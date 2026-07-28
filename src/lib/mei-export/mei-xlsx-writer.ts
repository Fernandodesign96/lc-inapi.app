import ExcelJS from "exceljs"

import type { LoadedClarityAudit } from "./mei-audit-loader"
import { loadVigenteClarityAudits } from "./mei-audit-loader"
import { MEI_EXPORT_HITOS, type MeiExportHito } from "./mei-hitos"
import {
  buildRowsForHito,
  buildUrlSummariesForHito,
  MEI_EXCEL_COLUMNS,
  MEI_EXCEL_HEADER_LABELS,
  type MeiExcelRow,
  type MeiUrlResumen,
} from "./mei-row-builder"

const HEADER_FILL: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFE6F1FB" },
}

function cellValue(row: MeiExcelRow, key: keyof MeiExcelRow): string | number | null {
  const v = row[key]
  if (v === null || v === undefined) return ""
  return v
}

function writeHeaderRow(sheet: ExcelJS.Worksheet, rowIndex: number) {
  const row = sheet.getRow(rowIndex)
  MEI_EXCEL_COLUMNS.forEach((key, idx) => {
    const cell = row.getCell(idx + 1)
    cell.value = MEI_EXCEL_HEADER_LABELS[key]
    cell.font = { bold: true }
    cell.fill = HEADER_FILL
  })
  row.commit()
}

function writeDataRows(sheet: ExcelJS.Worksheet, startRow: number, rows: MeiExcelRow[]) {
  rows.forEach((data, offset) => {
    const row = sheet.getRow(startRow + offset)
    MEI_EXCEL_COLUMNS.forEach((key, idx) => {
      row.getCell(idx + 1).value = cellValue(data, key)
    })
    row.commit()
  })
}

function autoWidth(sheet: ExcelJS.Worksheet, maxCols: number) {
  for (let c = 1; c <= maxCols; c++) {
    let max = 12
    sheet.eachRow((row) => {
      const val = row.getCell(c).value
      const len = val ? String(val).length : 0
      max = Math.min(Math.max(max, len + 2), 60)
    })
    sheet.getColumn(c).width = max
  }
}

function addHitoSheet(
  workbook: ExcelJS.Workbook,
  hito: MeiExportHito,
  rows: MeiExcelRow[],
  summaries: MeiUrlResumen[],
) {
  const sheet = workbook.addWorksheet(hito.sheetName)
  sheet.mergeCells(1, 1, 1, MEI_EXCEL_COLUMNS.length)
  sheet.getCell(1, 1).value = `HITO ${hito.id}: ${hito.tituloHito}`
  sheet.getCell(1, 1).font = { bold: true, size: 12 }

  sheet.mergeCells(2, 1, 2, MEI_EXCEL_COLUMNS.length)
  sheet.getCell(2, 1).value =
    `Actividades MEI: ${hito.actividades.join(", ")} | Inicio: ${hito.fechaInicioActividad} | Término actividad: ${hito.fechaTerminoActividad} | Fecha hito: ${hito.fechaHito}`

  sheet.mergeCells(3, 1, 3, MEI_EXCEL_COLUMNS.length)
  const criteriosLabel =
    hito.criterios.length > 0 ? hito.criterios.join(", ") : "N/A (evidencia documental)"
  sheet.getCell(3, 1).value = `Criterios checklist: ${criteriosLabel}`

  if (summaries.length > 0) {
    const resumenStart = 5
    sheet.getCell(resumenStart, 1).value = "Resumen por URL auditada (Clarity vigente)"
    sheet.getCell(resumenStart, 1).font = { bold: true }
    const resumenHeaders = [
      "rank",
      "url",
      "nombre_ui",
      "% LC",
      "fecha_auditoria",
      "incumple_hito",
      "cumple_hito",
      "no_aplica_hito",
      "audit_id",
    ]
    const headerRow = sheet.getRow(resumenStart + 1)
    resumenHeaders.forEach((h, i) => {
      headerRow.getCell(i + 1).value = h
      headerRow.getCell(i + 1).font = { bold: true }
    })
    summaries.forEach((s, i) => {
      const r = sheet.getRow(resumenStart + 2 + i)
      r.getCell(1).value = s.rankClarity
      r.getCell(2).value = s.url
      r.getCell(3).value = s.nombreUi
      r.getCell(4).value = s.porcentajeLc
      r.getCell(5).value = s.fechaAuditoria
      r.getCell(6).value = s.criteriosHitoIncumple
      r.getCell(7).value = s.criteriosHitoCumple
      r.getCell(8).value = s.criteriosHitoNoAplica
      r.getCell(9).value = s.auditId
    })
    const detailHeaderRow = resumenStart + 2 + summaries.length + 1
    writeHeaderRow(sheet, detailHeaderRow)
    writeDataRows(sheet, detailHeaderRow + 1, rows)
    sheet.views = [{ state: "frozen", ySplit: detailHeaderRow }]
  } else {
    writeHeaderRow(sheet, 5)
    writeDataRows(sheet, 6, rows)
    sheet.views = [{ state: "frozen", ySplit: 5 }]
  }

  autoWidth(sheet, MEI_EXCEL_COLUMNS.length)
}

function addIndiceSheet(workbook: ExcelJS.Workbook) {
  const sheet = workbook.addWorksheet("00_Indice")
  const headers = [
    "hito_id",
    "sheet",
    "actividades",
    "fecha_inicio",
    "fecha_termino",
    "fecha_hito",
    "criterios",
  ]
  const headerRow = sheet.getRow(1)
  headers.forEach((h, i) => {
    headerRow.getCell(i + 1).value = h
    headerRow.getCell(i + 1).font = { bold: true }
  })
  MEI_EXPORT_HITOS.forEach((hito, idx) => {
    const row = sheet.getRow(idx + 2)
    row.getCell(1).value = hito.id
    row.getCell(2).value = hito.sheetName
    row.getCell(3).value = hito.actividades.join(", ")
    row.getCell(4).value = hito.fechaInicioActividad
    row.getCell(5).value = hito.fechaTerminoActividad
    row.getCell(6).value = hito.fechaHito
    row.getCell(7).value = hito.criterios.join(", ") || "N/A"
  })
  autoWidth(sheet, headers.length)
}

function addResumenUrlsSheet(workbook: ExcelJS.Workbook, audits: LoadedClarityAudit[]) {
  const sheet = workbook.addWorksheet("99_Resumen_URLs")
  const headers = [
    "rank_clarity",
    "url",
    "nombre_ui",
    "tipo_pagina",
    "porcentaje_lc",
    "fecha_auditoria",
    "estado_aceptacion",
    "audit_id",
    "evaluador",
  ]
  const headerRow = sheet.getRow(1)
  headers.forEach((h, i) => {
    headerRow.getCell(i + 1).value = h
    headerRow.getCell(i + 1).font = { bold: true }
  })
  audits.forEach((audit, idx) => {
    const row = sheet.getRow(idx + 2)
    row.getCell(1).value = audit.rank
    row.getCell(2).value = audit.url
    row.getCell(3).value = audit.nombreUi
    row.getCell(4).value = audit.tipoPagina
    row.getCell(5).value = audit.porcentajeLc
    row.getCell(6).value = audit.fechaEvaluacionIso.slice(0, 10)
    row.getCell(7).value = audit.bundle.audit.estado_aceptacion
    row.getCell(8).value = audit.auditId
    row.getCell(9).value = audit.bundle.audit.evaluador_uid
  })
  autoWidth(sheet, headers.length)
}

export type BuildMeiWorkbookOptions = {
  hitoIds?: string[]
  root?: string
}

export async function buildMeiWorkbook(
  options: BuildMeiWorkbookOptions = {},
): Promise<ExcelJS.Workbook> {
  const root = options.root ?? process.cwd()
  const audits = loadVigenteClarityAudits(root)
  const hitos = options.hitoIds
    ? MEI_EXPORT_HITOS.filter((h) => options.hitoIds!.includes(h.id))
    : MEI_EXPORT_HITOS

  const workbook = new ExcelJS.Workbook()
  workbook.creator = "lc-inapi.app"
  workbook.created = new Date()

  addIndiceSheet(workbook)
  addResumenUrlsSheet(workbook, audits)

  for (const hito of hitos) {
    const rows = buildRowsForHito(hito.id, audits, root)
    const summaries = hito.incluyeAuditoriasUrl
      ? buildUrlSummariesForHito(hito.id, audits)
      : []
    addHitoSheet(workbook, hito, rows, summaries)
  }

  return workbook
}

export type MeiExportStats = {
  auditCount: number
  hitoSheets: number
  totalRows: number
}

export async function buildMeiWorkbookWithStats(
  options: BuildMeiWorkbookOptions = {},
): Promise<{ workbook: ExcelJS.Workbook; stats: MeiExportStats }> {
  const root = options.root ?? process.cwd()
  const audits = loadVigenteClarityAudits(root)
  const hitoIds =
    options.hitoIds ?? MEI_EXPORT_HITOS.map((h) => h.id)
  let totalRows = 0
  for (const id of hitoIds) {
    totalRows += buildRowsForHito(id, audits, root).length
  }
  const workbook = await buildMeiWorkbook({ ...options, hitoIds })
  return {
    workbook,
    stats: {
      auditCount: audits.length,
      hitoSheets: hitoIds.length,
      totalRows,
    },
  }
}
