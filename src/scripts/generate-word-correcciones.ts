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
  Table,
  TableCell,
  TableLayoutType,
  TableRow,
  TextRun,
  WidthType,
  BorderStyle,
  VerticalAlign,
  type FileChild,
  type IParagraphOptions,
} from "docx"

import {
  evidenciasDocxPath,
  resolveClaudeAuditJsonPath,
} from "../lib/claude-audit-file-path"
import { ptdHitoTareaPorCriterio } from "../lib/ptd-hito-tarea-por-criterio"
import {
  claudeAuditFileSchema,
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
  sust: ClaudeSustitucion,
  byId: Map<string, { estado: string; severidad?: string }>,
  sameCriterionCount: Map<string, number>,
  sameCriterionIndex: Map<string, number>,
): string {
  const meta = ptdHitoTareaPorCriterio(sust.criterio_id)
  const ev = byId.get(sust.criterio_id)
  const label = sevLabel(ev?.estado, ev?.severidad)
  const total = sameCriterionCount.get(sust.criterio_id) ?? 1
  const idx = sameCriterionIndex.get(`${sust.linea}`) ?? 1
  let head = `Checklist Hito ${meta.hitoOrdinal ?? "?"} - Criterio ${meta.criterioOrdinal ?? "?"} — ${label}`
  if (total > 1) head += ` (corrección ${idx} de ${total})`
  head += "."
  const parts = [head, "", sust.motivo]
  if (sust.patron_sistema) parts.push("", "Patrón de sitio.")
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
  const children: Paragraph[] = [
    para(String(n), { bold: true, size: 20 }),
    para(`(${sust.linea})`, { size: 16, color: "666666" }),
  ]

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

  const byId = new Map<string, { estado: string; severidad?: string }>()
  for (const c of file.criterios_evaluados) {
    byId.set(c.id, { estado: c.estado, severidad: c.severidad })
  }

  const sameCriterionCount = new Map<string, number>()
  for (const s of susts) {
    sameCriterionCount.set(
      s.criterio_id,
      (sameCriterionCount.get(s.criterio_id) ?? 0) + 1,
    )
  }
  const seen = new Map<string, number>()
  const sameCriterionIndex = new Map<string, number>()
  for (const s of susts) {
    const n = (seen.get(s.criterio_id) ?? 0) + 1
    seen.set(s.criterio_id, n)
    sameCriterionIndex.set(s.linea, n)
  }

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

  const dataRows: TableRow[] = susts.map((s, i) => {
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
        textCell(obsFor(s, byId, sameCriterionCount, sameCriterionIndex), w[5]),
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
