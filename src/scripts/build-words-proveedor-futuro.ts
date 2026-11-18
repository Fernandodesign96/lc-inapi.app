/**
 * Clasifica los 9 Words del sitio informativo en:
 * - proveedor: solo reemplazos/mejoras de texto ( + subtítulos de acrónimos )
 * - futuro: desarrollo / estructura / hover / contenido nuevo
 *
 * Uso:
 *   bun run src/scripts/build-words-proveedor-futuro.ts
 *   (requiere inventario previo: docs/words-solicitudes-correccion/_inventario-raw.json)
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import {
  AlignmentType,
  Document,
  HeadingLevel,
  ImageRun,
  Packer,
  PageOrientation,
  Paragraph,
  Table,
  TableCell,
  TableLayoutType,
  TableRow,
  TextRun,
  WidthType,
  BorderStyle,
  VerticalAlign,
  type FileChild,
} from "docx"

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO = resolve(__dirname, "../..")
const SRC_DIR = join(REPO, "docs/words-solicitudes-correccion")
const RAW_PATH = join(SRC_DIR, "_inventario-raw.json")
const INV_PATH = join(SRC_DIR, "_inventario-clasificacion.json")
const OUT_PROV = join(SRC_DIR, "proveedor-solicitudes-texto.docx")
const OUT_FUT = join(SRC_DIR, "futuro-solicitudes-desarrollo.docx")
const EVID_DIR = join(
  REPO,
  "auditorias/evidencias/solicitudes-correcciones-proveedor",
)

const FONT = "Calibri"
const SIZE_BODY = 18
const SIZE_HEAD = 18
const PAGE_W = 11906
const PAGE_H = 16838
const MARGIN = 567
const CONTENT_W = PAGE_H - MARGIN * 2
const CELL_PAD = 28
const IMG_MAX_W = 100
const THIN = {
  style: BorderStyle.SINGLE,
  size: 4,
  color: "000000",
} as const
const CELL_BORDERS = {
  top: THIN,
  bottom: THIN,
  left: THIN,
  right: THIN,
}

type RawRow = {
  source_id: string
  source_file: string
  source_row: number
  numero_original: string
  link: string
  default_url: string
  original: string
  propuesto: string
  observaciones: string
  imagenes: string[]
}

type ClassifiedRow = RawRow & {
  bucket: "proveedor" | "futuro"
  reason: string
  rewrite_note?: string
  synthetic?: boolean
}

function normUrl(link: string, fallback: string): string {
  const raw = (link || fallback || "").trim().split(/\s+/)[0] || fallback
  if (/^https?:\/\//i.test(raw)) return raw
  if (raw.startsWith("www.")) return `https://${raw}`
  if (raw.startsWith("inapi.cl") || raw.startsWith("/")) {
    return raw.startsWith("/")
      ? `https://www.inapi.cl${raw}`
      : `https://www.${raw}`
  }
  return raw.includes("inapi.cl") ? `https://${raw.replace(/^\/\//, "")}` : raw
}

function classify(r: RawRow): { bucket: "proveedor" | "futuro"; reason: string } {
  const orig = (r.original || "").toLowerCase()
  const prop = (r.propuesto || "").toLowerCase()
  const obs = (r.observaciones || "").toLowerCase()
  const blob = `${orig}\n${prop}\n${obs}`
  const n = r.numero_original
  const sid = r.source_id

  // Homepage overrides
  if (sid === "1") {
    if (n === "7") return { bucket: "futuro", reason: "home-banner-estructura" }
    if (n === "4") return { bucket: "futuro", reason: "hover-pct-nav" }
    if (["16", "17", "18", "19"].includes(n)) {
      return { bucket: "futuro", reason: "boton-cta-extenso-original" }
    }
    if (n === "2") return { bucket: "proveedor", reason: "observancia-home-reescribir" }
    if (n === "3" || n === "5") {
      return { bucket: "proveedor", reason: "subtitulo-destino-acronimo" }
    }
    return { bucket: "proveedor", reason: "texto-existente-home" }
  }

  // Hover / mouse help → futuro (alternativa subtítulo se sintetiza aparte)
  if (
    /pasar el (cursor|mouse)|al pasar el|hover|ayuda visible al pasar|texto de ayuda al pasar/.test(
      blob,
    )
  ) {
    return { bucket: "futuro", reason: "hover-interactivo" }
  }

  // Estructura / contenido nuevo
  if (
    /debajo del título principal del banner|tarjetas informativas además|recuadro breve con datos clave|añadir un recuadro|añadir una sección|agregar una sección|añadir una sección con subtítulo|añadir sobre la lista de resultados/.test(
      blob,
    )
  ) {
    return { bucket: "futuro", reason: "estructura-o-seccion-nueva" }
  }

  if (
    /no hay texto que cumpla/.test(orig) &&
    !/actualizado/.test(prop)
  ) {
    return { bucket: "futuro", reason: "ausencia-contenido-nuevo" }
  }

  if (/alt text|texto alternativo/.test(blob) && /mouse|pasar|atajo del menú/.test(blob)) {
    return { bucket: "futuro", reason: "alt-hover-menu" }
  }

  // Botones Acceder / Conoce más extensos
  if (
    /cambiar acceder por|cambiar “acceder”|cambiar "acceder"|cambiar el enlace por un texto que diga/.test(
      prop,
    )
  ) {
    return { bucket: "futuro", reason: "boton-cta-extenso" }
  }

  // Añadir contenido genérico (no glosa/fecha/subtítulo acrónimo)
  if (/^(añadir|agregar|crear|insertar)\b/.test(prop.trim())) {
    if (/actualizado|subtítulo|subtitulo|glosa|definición|entre paréntesis/.test(prop)) {
      return { bucket: "proveedor", reason: "glosa-o-fecha" }
    }
    if (/pasar el mouse|pasar el cursor/.test(prop)) {
      return { bucket: "futuro", reason: "hover-anadir" }
    }
    return { bucket: "futuro", reason: "anadir-contenido" }
  }

  // Acerca de: cambios de jerarquía de títulos de árbol
  if (
    sid === "4" &&
    /acerca de/.test(prop) &&
    /(h1|título principal|miga de pan|encabezado de nivel)/.test(blob) &&
    /(cambiar|reemplazar|usar como título)/.test(blob)
  ) {
    return { bucket: "futuro", reason: "estructura-acerca-de" }
  }

  return { bucket: "proveedor", reason: "texto-default" }
}

function applyMeetingRewrites(rows: ClassifiedRow[]): ClassifiedRow[] {
  const out: ClassifiedRow[] = []

  for (const r of rows) {
    const copy: ClassifiedRow = { ...r, imagenes: [...r.imagenes] }

    // Home Observancia bloque (subtítulo + destino)
    if (r.source_id === "1" && r.numero_original === "2") {
      copy.propuesto =
        "En el subtítulo del banner Observancia (hoy «Conoce y utiliza»), reemplazar por:\n" +
        "«Herramientas para proteger tu marca o patente frente a la piratería y la falsificación».\n\n" +
        "Usar el mismo subtítulo/descripción en la URL de destino /protege-tu-idea/pirateria-y-falsificacion.\n\n" +
        "Botón del banner: reemplazar «Conoce más» por el texto corto «Ver Observancia»."
      copy.observaciones =
        `${r.observaciones}\n\n` +
        "Ajuste reunión Comunicaciones (2026-11-11): subtítulo fiel a Observancia (no CTA genérico); " +
        "mismo texto en destino; botón corto alusivo al concepto. Sin hover."
      copy.rewrite_note = "observancia-home"
      copy.link = "https://www.inapi.cl/"
    }

    if (r.source_id === "1" && r.numero_original === "3") {
      copy.propuesto =
        "En la URL de destino de Observancia, dejar como subtítulo/descripción visible:\n" +
        "«Herramientas para proteger tu marca o patente frente a la piratería y la falsificación»."
      copy.link =
        "https://www.inapi.cl/protege-tu-idea/pirateria-y-falsificacion"
      copy.rewrite_note = "observancia-destino"
    }

    // Novedades: URL específica cuando el obs menciona tarjeta de noticias
    if (
      r.source_id === "1" &&
      ["1.5", "6", "8"].includes(r.numero_original) &&
      /novedades/i.test(r.observaciones)
    ) {
      // Best-effort: dejar nota; link se afina si el texto cita la noticia
      if (/índice mundial|ompi/i.test(r.original + r.propuesto)) {
        copy.link =
          "https://www.inapi.cl/sala-de-prensa/noticias"
        copy.observaciones +=
          "\n\nAjuste reunión: al corregir novedades del home, el origen del texto es la URL de la noticia publicada (usar la ficha concreta en CMS)."
      }
      if (/programa de asistencia|pai/i.test(r.original + r.propuesto)) {
        copy.link =
          "https://www.inapi.cl/sala-de-prensa/noticias"
        copy.observaciones +=
          "\n\nAjuste reunión: indicar URL específica de la noticia de origen en el CMS."
      }
      if (r.numero_original === "1.5") {
        copy.observaciones +=
          "\n\nAjuste reunión: fechas de tarjetas de Novedades; cada tarjeta apunta a su noticia de origen."
      }
    }

    out.push(copy)
  }

  // Proveedor: botones cortos del home (alternativa a las filas 16-19 en futuro)
  const homeImgs = (n: string) =>
    rows.find((x) => x.source_id === "1" && x.numero_original === n)?.imagenes ??
    []

  const shortButtons: ClassifiedRow[] = [
    {
      source_id: "1",
      source_file: "1. Cambios de contenidos_web www.inapi.cl.docx",
      source_row: 0,
      numero_original: "16→corto",
      link: "https://www.inapi.cl/",
      default_url: "https://www.inapi.cl/",
      original: "Acceder (Botón del banner en sección Plataforma de datos)",
      propuesto:
        "Mantener un rótulo corto. Preferente: «Ver datos» (o conservar «Acceder»). No usar textos largos que describan todo el destino.",
      observaciones:
        "Alternativa proveedor (reunión 2026-11-11) a la solicitud extensa de botón en homepage. La propuesta larga queda en el Word futuro.",
      imagenes: homeImgs("16"),
      bucket: "proveedor",
      reason: "boton-corto-home",
      rewrite_note: "boton-plataforma-datos",
      synthetic: true,
    },
    {
      source_id: "1",
      source_file: "1. Cambios de contenidos_web www.inapi.cl.docx",
      source_row: 0,
      numero_original: "17→corto",
      link: "https://www.inapi.cl/",
      default_url: "https://www.inapi.cl/",
      original: "Acceder (Botón del banner en sección Cuenta Pública 2026)",
      propuesto:
        "Mantener rótulo corto alusivo: «Ver cuenta pública» (o conservar «Acceder»). Evitar textos extensos.",
      observaciones:
        "Alternativa proveedor (reunión 2026-11-11). La propuesta larga queda en el Word futuro.",
      imagenes: homeImgs("17"),
      bucket: "proveedor",
      reason: "boton-corto-home",
      rewrite_note: "boton-cuenta-publica",
      synthetic: true,
    },
    {
      source_id: "1",
      source_file: "1. Cambios de contenidos_web www.inapi.cl.docx",
      source_row: 0,
      numero_original: "18→corto",
      link: "https://www.inapi.cl/",
      default_url: "https://www.inapi.cl/",
      original: "Conoce más (Botón del menú de navegación global)",
      propuesto:
        "Usar rótulo corto estable, p. ej. «Qué es la PI» (máx. pocas palabras). No reemplazar por frases largas de menú.",
      observaciones:
        "Alternativa proveedor (reunión 2026-11-11). La propuesta larga / hover queda en el Word futuro.",
      imagenes: homeImgs("18"),
      bucket: "proveedor",
      reason: "boton-corto-home",
      rewrite_note: "boton-menu-conoce-mas",
      synthetic: true,
    },
    {
      source_id: "1",
      source_file: "1. Cambios de contenidos_web www.inapi.cl.docx",
      source_row: 0,
      numero_original: "19→corto",
      link: "https://www.inapi.cl/",
      default_url: "https://www.inapi.cl/",
      original: "Conoce más (Botón del banner Observancia)",
      propuesto: "Reemplazar «Conoce más» por el texto corto «Ver Observancia».",
      observaciones:
        "Incluido también en la solicitud Observancia del homepage. Alternativa corta (reunión 2026-11-11).",
      imagenes: homeImgs("19"),
      bucket: "proveedor",
      reason: "boton-corto-home",
      rewrite_note: "boton-observancia",
      synthetic: true,
    },
  ]

  // Subtítulos de acrónimos (alternativa a hover) — una fila por concepto destino
  const acronymSubs: ClassifiedRow[] = [
    {
      source_id: "synth",
      source_file: "(síntesis reunión)",
      source_row: 0,
      numero_original: "PCT-sub",
      link: "https://www.inapi.cl/pct",
      default_url: "https://www.inapi.cl/pct",
      original: "PCT",
      propuesto:
        "En la URL de destino /pct, dejar visible como subtítulo (no hover):\n«PCT: Tratado de Cooperación en materia de Patentes».",
      observaciones:
        "Alternativa proveedor a las solicitudes de hover/alt del ítem PCT en menús (esas quedan en Word futuro).",
      imagenes: [],
      bucket: "proveedor",
      reason: "subtitulo-acronimo-destino",
      rewrite_note: "pct-subtitulo",
      synthetic: true,
    },
    {
      source_id: "synth",
      source_file: "(síntesis reunión)",
      source_row: 0,
      numero_original: "Madrid-sub",
      link: "https://www.inapi.cl/",
      default_url: "https://www.inapi.cl/",
      original: "Sistema de Madrid",
      propuesto:
        "En la URL de destino del Sistema de Madrid, dejar subtítulo/descripción visible:\n«Sistema de Madrid: registra tu marca en otros países».",
      observaciones:
        "Alternativa proveedor al hover pedido en sala de prensa / atajos (hover en Word futuro).",
      imagenes: [],
      bucket: "proveedor",
      reason: "subtitulo-acronimo-destino",
      rewrite_note: "madrid-subtitulo",
      synthetic: true,
    },
    {
      source_id: "synth",
      source_file: "(síntesis reunión)",
      source_row: 0,
      numero_original: "Sello-sub",
      link: "https://www.inapi.cl/",
      default_url: "https://www.inapi.cl/",
      original: "Sello de Origen",
      propuesto:
        "En la URL de destino de Sello de Origen, dejar subtítulo/descripción visible:\n«Sello de Origen: distingue productos típicos de una zona geográfica».",
      observaciones:
        "Alternativa proveedor al hover (hover en Word futuro).",
      imagenes: [],
      bucket: "proveedor",
      reason: "subtitulo-acronimo-destino",
      rewrite_note: "sello-subtitulo",
      synthetic: true,
    },
  ]

  // Avoid duplicating PCT subtitle if home row 5 already covers it
  const hasPctDest = out.some(
    (r) =>
      r.bucket === "proveedor" &&
      /pct/i.test(r.link) &&
      /tratado de cooperación/i.test(r.propuesto),
  )

  out.push(...shortButtons)
  for (const a of acronymSubs) {
    if (a.rewrite_note === "pct-subtitulo" && hasPctDest) continue
    out.push(a)
  }

  return out
}

function run(text: string, opts?: { bold?: boolean; size?: number; color?: string }) {
  return new TextRun({
    text,
    font: FONT,
    size: opts?.size ?? SIZE_BODY,
    bold: opts?.bold,
    color: opts?.color,
  })
}

function para(text: string, opts?: { bold?: boolean; size?: number; color?: string }) {
  return new Paragraph({ children: [run(text || " ", opts)] })
}

function textCell(text: string, width: number): TableCell {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    margins: {
      top: CELL_PAD,
      bottom: CELL_PAD,
      left: CELL_PAD,
      right: CELL_PAD,
    },
    borders: CELL_BORDERS,
    verticalAlign: VerticalAlign.TOP,
    children: (text || " ").split("\n").map((line) => para(line)),
  })
}

function headerCell(text: string, width: number): TableCell {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    margins: {
      top: CELL_PAD,
      bottom: CELL_PAD,
      left: CELL_PAD,
      right: CELL_PAD,
    },
    borders: CELL_BORDERS,
    children: [para(text, { bold: true, size: SIZE_HEAD })],
  })
}

function numeroCell(n: number, images: string[], width: number): TableCell {
  const children: Paragraph[] = [para(String(n), { bold: true, size: 20 })]
  for (const rel of images.slice(0, 2)) {
    const abs = join(REPO, rel)
    if (!existsSync(abs)) continue
    try {
      const bytes = readFileSync(abs)
      // PNG IHDR width/height
      let widthPx = IMG_MAX_W
      let heightPx = 72
      if (bytes[0] === 0x89 && bytes[1] === 0x50) {
        const pxW = bytes.readUInt32BE(16)
        const pxH = bytes.readUInt32BE(20)
        widthPx = Math.min(IMG_MAX_W, pxW)
        heightPx = Math.max(28, Math.round((pxH / pxW) * widthPx))
      }
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new ImageRun({
              type: "png",
              data: bytes,
              transformation: { width: widthPx, height: heightPx },
              altText: {
                title: `evidencia-${n}`,
                description: `Evidencia solicitud ${n}`,
                name: `s${n}.png`,
              },
            }),
          ],
        }),
      )
    } catch {
      children.push(para("(imagen no disponible)", { size: 14, color: "666666" }))
    }
  }
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    margins: {
      top: CELL_PAD,
      bottom: CELL_PAD,
      left: CELL_PAD,
      right: CELL_PAD,
    },
    borders: CELL_BORDERS,
    verticalAlign: VerticalAlign.TOP,
    children,
  })
}

async function buildDoc(
  title: string,
  subtitle: string,
  rows: ClassifiedRow[],
): Promise<Buffer> {
  const fracs = [0.12, 0.16, 0.24, 0.24] as const
  const w = fracs.map((f) => Math.round(CONTENT_W * f))
  const widths = [...w, CONTENT_W - w.reduce((a, b) => a + b, 0)]

  const children: FileChild[] = [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [run(title, { bold: true, size: 28 })],
    }),
    new Paragraph({ children: [run(subtitle, { bold: true, size: 22 })] }),
    new Paragraph({ children: [] }),
    new Paragraph({
      children: [
        run(
          "Nombre del área: Departamento de Experiencia Usuaria y Ciencia de Datos",
        ),
      ],
    }),
    new Paragraph({
      children: [
        run(
          `Fecha: ${new Date().toLocaleDateString("es-CL", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}`,
        ),
      ],
    }),
    new Paragraph({
      children: [
        run(
          `Solicitudes: ${rows.length} (consolidadas desde 9 Words del sitio informativo www.inapi.cl)`,
        ),
      ],
    }),
    new Paragraph({ children: [] }),
  ]

  const headers = [
    "N° de solicitud",
    "Link de referencia",
    "Contenido original (Inserte en esta columna, el o los párrafos que requieren ser modificados)",
    "Contenido a modificar/agregar (Inserte en esta columna el contenido actualizado)",
    "Observaciones (Indicar en esta columna si es necesario insertar, actualizar o eliminar algún archivo)",
  ]

  const headerRow = new TableRow({
    children: headers.map((h, i) => headerCell(h, widths[i]!)),
  })

  const dataRows = rows.map((r, idx) => {
    const n = idx + 1
    const link = normUrl(r.link, r.default_url)
    const obsExtra = [
      r.observaciones,
      `Origen: Word ${r.source_id} · fila ${r.numero_original} · ${r.source_file}`,
      r.synthetic ? "Fila sintetizada / reescrita según reunión Comunicaciones 2026-11-11." : null,
    ]
      .filter(Boolean)
      .join("\n\n")

    return new TableRow({
      children: [
        numeroCell(n, r.imagenes, widths[0]!),
        textCell(link, widths[1]!),
        textCell(r.original, widths[2]!),
        textCell(r.propuesto, widths[3]!),
        textCell(obsExtra, widths[4]!),
      ],
    })
  })

  children.push(
    new Table({
      width: { size: CONTENT_W, type: WidthType.DXA },
      columnWidths: widths,
      layout: TableLayoutType.FIXED,
      alignment: AlignmentType.CENTER,
      rows: [headerRow, ...dataRows],
    }),
  )

  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: FONT, size: SIZE_BODY } },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              width: PAGE_W,
              height: PAGE_H,
              orientation: PageOrientation.LANDSCAPE,
            },
            margin: {
              top: MARGIN,
              bottom: MARGIN,
              left: MARGIN,
              right: MARGIN,
            },
          },
        },
        children,
      },
    ],
  })

  return Buffer.from(await Packer.toBuffer(doc))
}

function orderKey(r: ClassifiedRow): string {
  const sid = r.source_id === "synth" ? "99" : r.source_id.padStart(2, "0")
  const num = String(r.source_row || r.numero_original).padStart(4, "0")
  return `${sid}-${num}-${r.numero_original}`
}

async function main() {
  if (!existsSync(RAW_PATH)) {
    console.error(`Falta ${RAW_PATH}. Ejecuta primero la extracción Python.`)
    process.exit(1)
  }
  const raw = JSON.parse(readFileSync(RAW_PATH, "utf8")) as RawRow[]
  let classified: ClassifiedRow[] = raw.map((r) => {
    const { bucket, reason } = classify(r)
    return { ...r, bucket, reason }
  })
  classified = applyMeetingRewrites(classified)

  writeFileSync(INV_PATH, JSON.stringify(classified, null, 2) + "\n")

  const proveedor = classified
    .filter((r) => r.bucket === "proveedor")
    .sort((a, b) => orderKey(a).localeCompare(orderKey(b)))
  const futuro = classified
    .filter((r) => r.bucket === "futuro")
    .sort((a, b) => orderKey(a).localeCompare(orderKey(b)))

  // Integrity: every original raw row appears in exactly one bucket
  const rawKeys = new Set(raw.map((r) => `${r.source_id}:${r.numero_original}`))
  const placed = new Set(
    classified
      .filter((r) => !r.synthetic)
      .map((r) => `${r.source_id}:${r.numero_original}`),
  )
  const missing = [...rawKeys].filter((k) => !placed.has(k))
  if (missing.length) {
    console.error("Filas sin clasificar:", missing)
    process.exit(1)
  }

  const bufP = await buildDoc(
    "FORMULARIO DE REVISIÓN DE CONTENIDOS — PROVEEDOR (TEXTO)",
    "SITIO WEB INFORMATIVO INAPI 2026 — Solo reemplazos y mejoras de texto existente",
    proveedor,
  )
  const bufF = await buildDoc(
    "FORMULARIO DE REVISIÓN DE CONTENIDOS — FUTURO (DESARROLLO)",
    "SITIO WEB INFORMATIVO INAPI 2026 — Solicitudes pendientes (estructura, hover, contenido nuevo)",
    futuro,
  )

  writeFileSync(OUT_PROV, bufP)
  writeFileSync(OUT_FUT, bufF)
  mkdirSync(EVID_DIR, { recursive: true })
  copyFileSync(OUT_PROV, join(EVID_DIR, "proveedor.docx"))
  copyFileSync(OUT_FUT, join(EVID_DIR, "futuro.docx"))

  console.log({
    raw: raw.length,
    proveedor: proveedor.length,
    futuro: futuro.length,
    synthetic: classified.filter((r) => r.synthetic).length,
    outProv: OUT_PROV,
    outFut: OUT_FUT,
    evid: EVID_DIR,
  })
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
