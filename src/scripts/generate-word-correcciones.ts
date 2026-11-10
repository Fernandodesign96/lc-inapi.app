/**
 * Genera Word TI (6 columnas, tipografía Calibri) con evidencia visual
 * dentro de la celda «N° de solicitud» (no anexo).
 *
 * Uso:
 *   bun run generate:word-correcciones -- --audit-id tramites-inapi-cl_2026-08-27
 *   bun run generate:word-correcciones -- --audit-id … --copy-docs
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import {
  AlignmentType,
  Document,
  HeadingLevel,
  ImageRun,
  Packer,
  PageOrientation,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableLayoutType,
  TableRow,
  TextRun,
  UnderlineType,
  WidthType,
  BorderStyle,
  VerticalAlign,
  type FileChild,
  type IParagraphOptions,
} from "docx"
import type { VistaRun } from "../lib/avisos-propuesta-html"
import type { AvisosCorreccionRow } from "../lib/avisos-correcciones-entrega"

import {
  AVISOS_CORRECCION_HEADERS,
  buildAvisosCorreccionRows,
  isAvisosSistemasAudit,
  sustitucionesSonAvisos,
} from "../lib/avisos-correcciones-entrega"
import { avisosCorreccionesXlsxBuffer } from "../lib/avisos-correcciones-xlsx"
import {
  evidenciasDocxPath,
  evidenciasXlsxPath,
  resolveClaudeAuditJsonPath,
} from "../lib/claude-audit-file-path"
import {
  listCorreccionesEntrega,
  type CorreccionEntregaItem,
} from "../lib/desglose-correcciones-datos-auditoria"
import { ptdHitoTareaPorCriterio } from "../lib/ptd-hito-tarea-por-criterio"
import {
  claudeAuditFileSchema,
  type ClaudeAuditFile,
  type ClaudeSustitucion,
} from "../schemas/claude-audit-pilot"

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, "../..")
const FONT = "Calibri"
/** Half-points: 18 = 9 pt (como el formulario TI compacto) */
const SIZE_BODY = 18
const SIZE_HEAD = 18
/**
 * A4 en medidas portrait: docx intercambia w/h si orientation=LANDSCAPE.
 * Ancho útil real en apaisado = PAGE_H − 2×MARGIN.
 */
const PAGE_W = 11906
const PAGE_H = 16838
/** ~1 cm: gap visible entre borde de tabla y borde de hoja */
const MARGIN = 567
const CONTENT_W = PAGE_H - MARGIN * 2
/** Padding interno de celda (DXA) — márgenes estrechos como en el formulario TI */
const CELL_PAD = 28
/** Ancho máx. de captura en px (columna N°) */
const IMG_MAX_W = 108
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

const DOCS_COPY: Record<string, string> = {
  "tramites-inapi-cl-siac_2026-08-25":
    "docs/auditorias-tramites-url-10-y-11/10. Cambios de contenidos_web tramites.inapi.cl formulario siac.docx",
  "tramites-inapi-cl_2026-08-27":
    "docs/auditorias-tramites-url-10-y-11/11. Cambios de contenidos_web tramites.inapi.cl portal tramites.docx",
  "avisos-sistemas-tramites_2026-11-09":
    "docs/auditorias-tramites-url-10-y-11/Avisos-sistemas-correcciones.docx",
}

type Args = { auditId: string; copyDocs: boolean }

function parseArgs(argv: string[]): Args {
  const get = (flag: string): string | undefined => {
    const i = argv.indexOf(flag)
    return i >= 0 ? argv[i + 1] : undefined
  }
  const auditId = get("--audit-id")
  if (!auditId) {
    console.error(
      "Uso: bun run generate:word-correcciones -- --audit-id <id> [--copy-docs]",
    )
    process.exit(1)
  }
  return { auditId, copyDocs: argv.includes("--copy-docs") }
}

function run(
  text: string,
  opts?: { bold?: boolean; italics?: boolean; color?: string; size?: number },
): TextRun {
  return new TextRun({
    text,
    font: FONT,
    size: opts?.size ?? SIZE_BODY,
    bold: opts?.bold,
    italics: opts?.italics,
    color: opts?.color,
  })
}

function para(
  text: string,
  opts?: { bold?: boolean; italics?: boolean; color?: string; size?: number },
): Paragraph {
  return new Paragraph({
    children: [run(text || " ", opts)],
  } satisfies IParagraphOptions)
}

function sevLabel(
  estado: string | undefined,
  severidad: string | undefined,
): string {
  if (estado === "cumple") return "Cumple"
  if (estado !== "incumple") return estado ?? "—"
  return (
    (
      {
        alta: "No cumple",
        media: "Medianamente cumple",
        baja: "Cumple con observaciones",
      } as Record<string, string>
    )[severidad ?? "alta"] ?? "No cumple"
  )
}

function obsFor(
  item: CorreccionEntregaItem,
  byId: Map<string, { estado: string; severidad?: string }>,
  relacionadosLabels: string[],
): string {
  const meta = ptdHitoTareaPorCriterio(item.criterioId)
  const ev = byId.get(item.criterioId)
  const label = sevLabel(ev?.estado, ev?.severidad)
  const heads = [
    `Checklist Hito ${meta.hitoOrdinal ?? "?"} - Criterio ${meta.criterioOrdinal ?? "?"} — ${label}`,
    ...relacionadosLabels,
  ]
  let head = heads.join("; ")
  if (item.totalInGrupo > 1) {
    head += ` (corrección ${item.indexInGrupo} de ${item.totalInGrupo})`
  }
  head += "."
  const parts = [head, "", item.sust.motivo]
  if (relacionadosLabels.length > 0) {
    parts.push(
      "",
      `Esta solicitud agrupa ${relacionadosLabels.length + 1} criterios del mismo texto o sección (propuesta final única).`,
    )
  }
  if (item.sust.patron_sistema) parts.push("", "Patrón de sitio.")
  return parts.join("\n")
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
    children: text.split("\n").map((line) => para(line)),
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

function numeroConEvidenciaCell(
  n: number,
  sust: ClaudeSustitucion,
  width: number,
): TableCell {
  const children: Paragraph[] = [para(String(n), { bold: true, size: 20 })]

  const imgRel = sust.evidencia_visual?.imagen
  const imgAbs = imgRel ? join(REPO_ROOT, imgRel) : null
  if (imgAbs && existsSync(imgAbs)) {
    const bytes = readFileSync(imgAbs)
    const pxW = bytes.readUInt32BE(16)
    const pxH = bytes.readUInt32BE(20)
    const widthPx = Math.min(IMG_MAX_W, pxW)
    const heightPx = Math.max(28, Math.round((pxH / pxW) * widthPx))
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new ImageRun({
            type: "png",
            data: bytes,
            transformation: { width: widthPx, height: heightPx },
            altText: {
              title: sust.linea,
              description: `Evidencia ${sust.linea}`,
              name: `${sust.linea}.png`,
            },
          }),
        ],
      }),
    )
  } else {
    children.push(
      para("Sin evidencia visual capturada.", {
        italics: true,
        size: 14,
        color: "666666",
      }),
    )
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

function cssColorToDocxHex(color: string | undefined): string | undefined {
  if (!color) return undefined
  const c = color.trim().toLowerCase()
  if (c === "red") return "FF0000"
  if (c === "white") return "FFFFFF"
  if (c.startsWith("#") && (c.length === 7 || c.length === 4)) {
    if (c.length === 4) {
      return `${c[1]}${c[1]}${c[2]}${c[2]}${c[3]}${c[3]}`.toUpperCase()
    }
    return c.slice(1).toUpperCase()
  }
  return undefined
}

function vistaRunsToParagraphs(runs: VistaRun[]): Paragraph[] {
  const paragraphs: Paragraph[] = []
  let current: TextRun[] = []
  const flush = () => {
    if (current.length === 0) {
      paragraphs.push(new Paragraph({ children: [run(" ")] }))
    } else {
      paragraphs.push(new Paragraph({ children: current }))
    }
    current = []
  }
  for (const r of runs) {
    if (r.text === "\n") {
      flush()
      continue
    }
    const hex = cssColorToDocxHex(r.color)
    current.push(
      new TextRun({
        text: r.text,
        font: FONT,
        size: SIZE_BODY,
        bold: r.bold,
        italics: r.italic,
        underline: r.underline || r.link ? { type: UnderlineType.SINGLE } : undefined,
        color: hex && hex !== "FFFFFF" ? hex : r.highlight ? "111111" : hex,
        highlight: r.highlight ? "yellow" : undefined,
        shading: r.highlight
          ? { type: ShadingType.CLEAR, fill: r.highlight }
          : undefined,
      }),
    )
  }
  if (current.length > 0) flush()
  return paragraphs.length > 0 ? paragraphs : [para(" ")]
}

function contenidoModificarCell(
  row: AvisosCorreccionRow,
  width: number,
): TableCell {
  const children: Paragraph[] = [
    ...row.propuestoHtml.split("\n").map((line) =>
      para(line || " ", { size: 14, color: "333333" }),
    ),
    para(" "),
    para("— Vista en pantalla —", { bold: true, size: 16 }),
    ...vistaRunsToParagraphs(row.vistaRuns),
  ]
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

async function buildAvisosWordDoc(file: ClaudeAuditFile): Promise<Document> {
  const susts = file.sustituciones ?? []
  const rows = buildAvisosCorreccionRows(susts, file.criterios_evaluados)
  // Primeras 5 angostas; texto/propuesta/obs más anchas
  const fracs = [0.05, 0.08, 0.1, 0.06, 0.07, 0.24, 0.22] as const
  const w = fracs.map((f) => Math.round(CONTENT_W * f))
  const widths = [...w, CONTENT_W - w.reduce((a, b) => a + b, 0)] as number[]

  const children: FileChild[] = [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [
        run("FORMULARIO DE REVISIÓN — AVISOS DE SISTEMAS", { bold: true, size: 28 }),
      ],
    }),
    new Paragraph({
      children: [run("SITIO WEB / TRÁMITES INAPI 2026", { bold: true, size: 24 })],
    }),
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
          "Corpus: Avisos Sistemas (plantillas editoriales; IDs agrupados si solo cambian día/hora)",
        ),
      ],
    }),
    new Paragraph({ children: [] }),
  ]

  const headerRow = new TableRow({
    children: AVISOS_CORRECCION_HEADERS.map((h, i) =>
      headerCell(h, widths[i]!),
    ),
  })

  const dataRows = rows.map(
    (row) =>
      new TableRow({
        children: row.cells.map((cell, i) =>
          i === 6
            ? contenidoModificarCell(row, widths[i]!)
            : textCell(cell, widths[i]!),
        ),
      }),
  )

  children.push(
    new Table({
      width: { size: CONTENT_W, type: WidthType.DXA },
      columnWidths: widths,
      layout: TableLayoutType.FIXED,
      alignment: AlignmentType.CENTER,
      rows: [headerRow, ...dataRows],
    }),
  )

  return new Document({
    styles: {
      default: {
        document: {
          run: { font: FONT, size: SIZE_BODY },
        },
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
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2))
  const jsonPath = resolveClaudeAuditJsonPath(REPO_ROOT, args.auditId)
  if (!jsonPath) {
    console.error(`No se encontró JSON para ${args.auditId}`)
    process.exit(1)
  }

  const file = claudeAuditFileSchema.parse(
    JSON.parse(readFileSync(jsonPath, "utf8")),
  )
  const susts = file.sustituciones ?? []
  if (susts.length === 0) {
    console.error("La auditoría no tiene sustituciones.")
    process.exit(1)
  }

  const avisosMode =
    isAvisosSistemasAudit(args.auditId) || sustitucionesSonAvisos(susts)

  if (avisosMode) {
    const doc = await buildAvisosWordDoc(file)
    const outPath = evidenciasDocxPath(REPO_ROOT, args.auditId)
    mkdirSync(dirname(outPath), { recursive: true })
    writeFileSync(outPath, await Packer.toBuffer(doc))
    console.log(`Word: ${relative(REPO_ROOT, outPath)}`)

    const xlsxPath = evidenciasXlsxPath(REPO_ROOT, args.auditId)
    writeFileSync(
      xlsxPath,
      await avisosCorreccionesXlsxBuffer(susts, file.criterios_evaluados),
    )
    console.log(`Excel: ${relative(REPO_ROOT, xlsxPath)}`)

    if (args.copyDocs && DOCS_COPY[args.auditId]) {
      const dest = join(REPO_ROOT, DOCS_COPY[args.auditId])
      mkdirSync(dirname(dest), { recursive: true })
      copyFileSync(outPath, dest)
      console.log(`Copia TI: ${relative(REPO_ROOT, dest)}`)
      const xlsxDocs = dest.replace(/\.docx$/i, ".xlsx")
      copyFileSync(xlsxPath, xlsxDocs)
      console.log(`Copia TI Excel: ${relative(REPO_ROOT, xlsxDocs)}`)
    }
    return
  }

  const byId = new Map<string, { estado: string; severidad?: string }>()
  const agrupadosPorPrimario = new Map<string, string[]>()
  for (const c of file.criterios_evaluados) {
    byId.set(c.id, { estado: c.estado, severidad: c.severidad })
    if (c.agrupado_en) {
      const list = agrupadosPorPrimario.get(c.agrupado_en) ?? []
      list.push(c.id)
      agrupadosPorPrimario.set(c.agrupado_en, list)
    }
  }

  function labelsRelacionados(sust: ClaudeSustitucion): string[] {
    const ids = new Set<string>([
      ...(sust.criterios_relacionados ?? []),
      ...(agrupadosPorPrimario.get(sust.criterio_id) ?? []),
    ])
    const out: string[] = []
    for (const id of ids) {
      if (id === sust.criterio_id) continue
      const meta = ptdHitoTareaPorCriterio(id)
      const ev = byId.get(id)
      const label = sevLabel(ev?.estado, ev?.severidad)
      out.push(
        `Hito ${meta.hitoOrdinal ?? "?"} - Criterio ${meta.criterioOrdinal ?? "?"} — ${label}`,
      )
    }
    return out
  }

  const correcciones = listCorreccionesEntrega(file.criterios_evaluados, susts)

  // 6 columnas = ancho útil A4 apaisado (proporción tipo formulario TI compacto)
  const w0 = Math.round(CONTENT_W * 0.14) // N° + evidencia
  const w1 = Math.round(CONTENT_W * 0.11) // Link
  const w2 = Math.round(CONTENT_W * 0.14) // Ubicación
  const w3 = Math.round(CONTENT_W * 0.18) // Original
  const w4 = Math.round(CONTENT_W * 0.2) // Modificar
  const w = [w0, w1, w2, w3, w4, CONTENT_W - (w0 + w1 + w2 + w3 + w4)] as const
  const tableW = CONTENT_W

  const children: FileChild[] = [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [
        run("FORMULARIO DE REVISIÓN DE CONTENIDOS", { bold: true, size: 28 }),
      ],
    }),
    new Paragraph({
      children: [run("SITIO WEB DE INAPI 2026", { bold: true, size: 24 })],
    }),
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
      children: [run(`Sitio: ${file.url}`)],
    }),
    new Paragraph({ children: [] }),
  ]

  const headerRow = new TableRow({
    children: [
      headerCell("N° de solicitud / evidencia visual", w[0]),
      headerCell("Link de referencia", w[1]),
      headerCell("Ubicación en pantalla", w[2]),
      headerCell("Contenido original", w[3]),
      headerCell("Contenido a modificar/agregar", w[4]),
      headerCell("Observaciones", w[5]),
    ],
  })

  const dataRows: TableRow[] = correcciones.map((item, i) => {
    const s = item.sust
    let original = s.original
    if (
      original.startsWith("(sin ") ||
      original.startsWith("(ausencia") ||
      original.startsWith("(única") ||
      original.startsWith("(no existe")
    ) {
      original = "No hay texto que cumpla con este requisito"
    }
    return new TableRow({
      children: [
        numeroConEvidenciaCell(i + 1, s, w[0]),
        textCell(file.url, w[1]),
        textCell(s.ubicacion_pantalla ?? "", w[2]),
        textCell(original, w[3]),
        textCell(s.propuesto, w[4]),
        textCell(obsFor(item, byId, labelsRelacionados(s)), w[5]),
      ],
    })
  })

  children.push(
    new Table({
      width: { size: tableW, type: WidthType.DXA },
      columnWidths: [...w],
      layout: TableLayoutType.FIXED,
      alignment: AlignmentType.CENTER,
      rows: [headerRow, ...dataRows],
    }),
  )

  const notasWord = file.notas_entrega_word ?? []
  if (notasWord.length > 0) {
    children.push(new Paragraph({ children: [] }))
    for (const nota of notasWord) {
      children.push(
        new Paragraph({
          children: [run(`• ${nota}`, { size: SIZE_BODY })],
        }),
      )
    }
  }

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: FONT, size: SIZE_BODY },
        },
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

  const outPath = evidenciasDocxPath(REPO_ROOT, args.auditId)
  mkdirSync(dirname(outPath), { recursive: true })
  const buffer = await Packer.toBuffer(doc)
  writeFileSync(outPath, buffer)
  console.log(`Word: ${relative(REPO_ROOT, outPath)}`)

  if (args.copyDocs && DOCS_COPY[args.auditId]) {
    const dest = join(REPO_ROOT, DOCS_COPY[args.auditId])
    mkdirSync(dirname(dest), { recursive: true })
    copyFileSync(outPath, dest)
    console.log(`Copia TI: ${relative(REPO_ROOT, dest)}`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
