/**
 * Excel de solicitudes de corrección (avisos de sistemas) — mismas 8 columnas
 * que Word/PDF.
 */
import ExcelJS from "exceljs"

import type { CriterionEvaluation } from "../schemas/checklist"
import type { ClaudeSustitucion } from "../schemas/claude-audit-pilot"
import {
  AVISOS_CORRECCION_HEADERS,
  buildAvisosCorreccionRows,
} from "./avisos-correcciones-entrega"

const HEADER_FILL: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FF1F4E79" },
}

/** Anchos relativos: primeras 5 angostas. */
const COL_WIDTHS = [8, 14, 18, 10, 12, 48, 40, 36]

export async function buildAvisosCorreccionesWorkbook(
  sustituciones: readonly ClaudeSustitucion[],
  evaluaciones: readonly CriterionEvaluation[],
): Promise<ExcelJS.Workbook> {
  const rows = buildAvisosCorreccionRows(sustituciones, evaluaciones)
  const wb = new ExcelJS.Workbook()
  wb.creator = "INAPI — Lenguaje Claro"
  const ws = wb.addWorksheet("Correcciones avisos", {
    views: [{ state: "frozen", ySplit: 1 }],
  })

  AVISOS_CORRECCION_HEADERS.forEach((h, i) => {
    ws.getColumn(i + 1).width = COL_WIDTHS[i] ?? 20
  })

  const header = ws.addRow([...AVISOS_CORRECCION_HEADERS])
  header.height = 22
  for (let c = 1; c <= AVISOS_CORRECCION_HEADERS.length; c++) {
    const cell = header.getCell(c)
    cell.fill = HEADER_FILL
    cell.font = { bold: true, color: { argb: "FFFFFFFF" }, name: "Calibri", size: 10 }
    cell.alignment = { vertical: "middle", wrapText: true }
  }

  for (const row of rows) {
    const excelRow = ws.addRow(row.cells)
    excelRow.alignment = { vertical: "top", wrapText: true }
    for (let c = 1; c <= AVISOS_CORRECCION_HEADERS.length; c++) {
      excelRow.getCell(c).font = { name: "Calibri", size: 9 }
    }
    // HTML y textos largos: altura generosa
    excelRow.height = Math.min(180, 40 + Math.floor(row.textoAnuncio.length / 80) * 12)
  }

  return wb
}

export async function avisosCorreccionesXlsxBuffer(
  sustituciones: readonly ClaudeSustitucion[],
  evaluaciones: readonly CriterionEvaluation[],
): Promise<Buffer> {
  const wb = await buildAvisosCorreccionesWorkbook(sustituciones, evaluaciones)
  const buf = await wb.xlsx.writeBuffer()
  return Buffer.from(buf)
}
