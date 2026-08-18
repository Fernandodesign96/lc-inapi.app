import ExcelJS from "exceljs"

import type { CriterionId } from "../../schemas/checklist"

import type { LoadedClarityAudit } from "./mei-audit-loader"
import {
  loadMetaMeiAudits,
  loadVigenteClarityAudits,
} from "./mei-audit-loader"
import {
  loadChecklistCriteriaList,
  type ChecklistCriterionEntry,
} from "./mei-checklist-catalog"
import { MEI_EXPORT_HITOS, hitoById, hitoIdForCriterio, type MeiExportHito } from "./mei-hitos"
import { MEI_META_MEI_URLS } from "./mei-meta-mei-urls"
import {
  buildRowsForHito,
  type MeiExcelRow,
} from "./mei-row-builder"
import {
  documentosLabelFromSource,
  sourceNotaMetaMei,
} from "./mei-source-labels"

const HEADER_BLUE: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FF1F4E79" },
}

const TOTAL_CYAN: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFBDD7EE" },
}

const SECTION_FILL: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFD6DCE4" },
}

const URL_TITLE_FILL: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FF1F4E79" },
}

const WHITE_BOLD: Partial<ExcelJS.Font> = {
  bold: true,
  color: { argb: "FFFFFFFF" },
}

const DETAIL_HEADERS = [
  "Página",
  "Dirección",
  "ID/Línea",
  "Criterio",
  "CheckList",
  "Texto original (Incumplimiento)",
  "Sustitución propuesta",
  "Justificación",
] as const

function styleHeaderRow(row: ExcelJS.Row, colCount: number) {
  for (let c = 1; c <= colCount; c++) {
    const cell = row.getCell(c)
    cell.font = WHITE_BOLD
    cell.fill = HEADER_BLUE
    cell.alignment = { vertical: "middle", wrapText: true }
  }
}

function autoWidth(sheet: ExcelJS.Worksheet, maxCols: number) {
  for (let c = 1; c <= maxCols; c++) {
    let max = 12
    sheet.eachRow((row) => {
      const val = row.getCell(c).value
      const len = val ? String(val).length : 0
      max = Math.min(Math.max(max, len + 2), 56)
    })
    sheet.getColumn(c).width = max
  }
}

function resolveHitos(hitoIds?: string[]): MeiExportHito[] {
  if (!hitoIds || hitoIds.length === 0) return [...MEI_EXPORT_HITOS]
  return MEI_EXPORT_HITOS.filter((h) => hitoIds.includes(h.id))
}

function isDocumentaryOnly(hitos: MeiExportHito[]): boolean {
  return hitos.length > 0 && hitos.every((h) => !h.incluyeAuditoriasUrl)
}

function includesFullChecklist(hitos: MeiExportHito[]): boolean {
  return hitos.some((h) => h.id === "H01" || h.criterios.length === 0)
}

function criterioIdsForExport(hitos: MeiExportHito[]): Set<CriterionId> | "all" {
  if (includesFullChecklist(hitos)) return "all"
  const set = new Set<CriterionId>()
  for (const h of hitos) {
    for (const c of h.criterios) set.add(c)
  }
  return set
}

function collectRows(
  hitos: MeiExportHito[],
  audits: LoadedClarityAudit[],
  root: string,
): MeiExcelRow[] {
  const rows: MeiExcelRow[] = []
  for (const hito of hitos) {
    if (!hito.incluyeAuditoriasUrl) continue
    rows.push(...buildRowsForHito(hito.id, audits, root))
  }
  return rows
}

function seccionLabel(tipoPagina: string): string {
  if (tipoPagina === "tramites") return "Trámites"
  if (tipoPagina === "sitioweb") return "Sitio Web"
  return tipoPagina
}

function addIndiceSheet(
  workbook: ExcelJS.Workbook,
  audits: LoadedClarityAudit[],
  rows: MeiExcelRow[],
  hitos: MeiExportHito[],
  documentary: boolean,
  urlSet: "meta-mei" | "clarity",
) {
  const sheet = workbook.addWorksheet("Índice")
  const colCount = 7
  sheet.mergeCells(1, 1, 1, colCount)
  sheet.getCell(1, 1).value = "Auditoría Lenguaje Claro — INAPI"
  sheet.getCell(1, 1).font = { bold: true, size: 14 }

  const hitoLabel = hitos.map((h) => h.id).join(", ")
  const pending = MEI_META_MEI_URLS.filter((u) => !u.auditId).length
  sheet.mergeCells(2, 1, 2, colCount)
  sheet.getCell(2, 1).value = documentary
    ? `Evidencia documental (${hitoLabel}) — sin filas por URL`
    : urlSet === "meta-mei"
      ? `META MEI — ${audits.length}/10 URLs compromiso jefatura (Sitio Web + Trámites) — hito(s) ${hitoLabel}` +
        (pending > 0 ? ` — ${pending} URL(s) aún sin JSON` : "")
      : `Clarity vigente — ${audits.length} URLs — hito(s) ${hitoLabel}`

  const headerRow = sheet.getRow(4)
  ;[
    "URL #",
    "Sección",
    "Página",
    "Dirección",
    "Rol META MEI",
    "Fecha auditoría",
    "N° incumplimientos",
  ].forEach((label, i) => {
    headerRow.getCell(i + 1).value = label
  })
  styleHeaderRow(headerRow, colCount)

  if (documentary) {
    const note = sheet.getRow(5)
    note.getCell(1).value = "—"
    note.getCell(2).value = "Evidencia"
    note.getCell(3).value = "Checklist Editorial INAPI v2.1"
    note.getCell(4).value =
      "N/A — evidencia documental (actividad 1 / H01); ver pestañas CheckList y Fuentes"
    note.getCell(7).value = 0

    const total = sheet.getRow(6)
    total.getCell(1).value = "TOTAL"
    total.getCell(7).value = 0
    for (let c = 1; c <= colCount; c++) {
      total.getCell(c).fill = TOTAL_CYAN
      total.getCell(c).font = { bold: true }
    }
    autoWidth(sheet, colCount)
    return
  }

  const countByUrl = new Map<string, number>()
  for (const row of rows) {
    if (row.estadoAuditoria !== "incumple") continue
    countByUrl.set(row.url, (countByUrl.get(row.url) ?? 0) + 1)
  }

  let totalInc = 0
  audits.forEach((audit, idx) => {
    const r = sheet.getRow(5 + idx)
    const n = countByUrl.get(audit.url) ?? 0
    totalInc += n
    r.getCell(1).value = audit.rank
    r.getCell(2).value = seccionLabel(audit.tipoPagina)
    r.getCell(3).value = audit.nombreUi
    r.getCell(4).value = audit.url
    r.getCell(5).value = audit.rolMetaMei ?? ""
    r.getCell(6).value = audit.fechaEvaluacionIso.slice(0, 10)
    r.getCell(7).value = n
  })

  // Filas pendientes META MEI (sin JSON aún)
  let extra = 0
  if (urlSet === "meta-mei") {
    for (const pendingUrl of MEI_META_MEI_URLS.filter((u) => !u.auditId)) {
      const r = sheet.getRow(5 + audits.length + extra)
      r.getCell(1).value = pendingUrl.orden
      r.getCell(2).value = seccionLabel(pendingUrl.tipoPagina)
      r.getCell(3).value = pendingUrl.nombreUi
      r.getCell(4).value = pendingUrl.url
      r.getCell(5).value = pendingUrl.rolMetaMei
      r.getCell(6).value = "(pendiente auditoría)"
      r.getCell(7).value = "—"
      extra++
    }
  }

  const totalRow = sheet.getRow(5 + audits.length + extra)
  totalRow.getCell(1).value = "TOTAL"
  totalRow.getCell(7).value = totalInc
  for (let c = 1; c <= colCount; c++) {
    totalRow.getCell(c).fill = TOTAL_CYAN
    totalRow.getCell(c).font = { bold: true }
  }

  sheet.views = [{ state: "frozen", ySplit: 4 }]
  autoWidth(sheet, colCount)
}

function addCheckListSheet(
  workbook: ExcelJS.Workbook,
  root: string,
  hitos: MeiExportHito[],
) {
  const sheet = workbook.addWorksheet("CheckList")
  const all = loadChecklistCriteriaList(root)
  const filter = criterioIdsForExport(hitos)
  const entries: ChecklistCriterionEntry[] =
    filter === "all" ? all : all.filter((c) => filter.has(c.id))

  const header = sheet.getRow(1)
  header.getCell(1).value = "Criterio"
  header.getCell(2).value = "CheckList"
  header.getCell(3).value = "Cita fuente"
  styleHeaderRow(header, 3)

  let rowIdx = 2
  let lastSection = ""
  for (const entry of entries) {
    if (entry.sectionId !== lastSection) {
      lastSection = entry.sectionId
      const sep = sheet.getRow(rowIdx)
      sep.getCell(1).value = entry.sectionId
      sep.getCell(2).value = entry.sectionTitle
      sep.getCell(1).fill = SECTION_FILL
      sep.getCell(2).fill = SECTION_FILL
      sep.getCell(3).fill = SECTION_FILL
      sep.getCell(1).font = { bold: true }
      sep.getCell(2).font = { bold: true }
      rowIdx++
    }
    const r = sheet.getRow(rowIdx)
    r.getCell(1).value = entry.id
    r.getCell(2).value = entry.criterion
    r.getCell(3).value = entry.source
    r.getCell(2).alignment = { wrapText: true }
    rowIdx++
  }

  sheet.getColumn(1).width = 12
  sheet.getColumn(2).width = 64
  sheet.getColumn(3).width = 28
  sheet.views = [{ state: "frozen", ySplit: 1 }]
}

/**
 * Pestaña Fuentes: Hito × Dimensión × Criterio × documentos PDF (Colección A).
 */
function addFuentesSheet(
  workbook: ExcelJS.Workbook,
  root: string,
  hitos: MeiExportHito[],
) {
  const sheet = workbook.addWorksheet("Fuentes")
  sheet.mergeCells(1, 1, 1, 6)
  sheet.getCell(1, 1).value =
    "Fuentes normativas del Checklist Editorial INAPI v2.1 (47 criterios)"
  sheet.getCell(1, 1).font = { bold: true, size: 12 }

  sheet.mergeCells(2, 1, 2, 6)
  sheet.getCell(2, 1).value = sourceNotaMetaMei()
  sheet.getCell(2, 1).alignment = { wrapText: true }
  sheet.getRow(2).height = 36

  const header = sheet.getRow(4)
  ;[
    "Hito",
    "Dimensión",
    "Criterio",
    "Enunciado",
    "Cita (checklist)",
    "Documento(s) Colección A",
  ].forEach((label, i) => {
    header.getCell(i + 1).value = label
  })
  styleHeaderRow(header, 6)

  const all = loadChecklistCriteriaList(root)
  const filter = criterioIdsForExport(hitos)
  const entries =
    filter === "all" ? all : all.filter((c) => filter.has(c.id))

  const hitoIdsInExport = new Set(hitos.map((h) => h.id))

  let rowIdx = 5
  let lastSection = ""
  for (const entry of entries) {
    if (entry.sectionId !== lastSection) {
      lastSection = entry.sectionId
      const sep = sheet.getRow(rowIdx)
      sep.getCell(1).value = ""
      sep.getCell(2).value = `${entry.sectionId} — ${entry.sectionTitle}`
      for (let c = 1; c <= 6; c++) {
        sep.getCell(c).fill = SECTION_FILL
        sep.getCell(c).font = { bold: true }
      }
      rowIdx++
    }

    const mappedHito = hitoIdForCriterio(entry.id) ?? "—"
    // Si el export es solo H02, anclar hito a H02 para criterios del alcance
    const hitoLabel =
      hitoIdsInExport.size === 1 && hitoIdsInExport.has("H02")
        ? "H02"
        : mappedHito

    const r = sheet.getRow(rowIdx)
    r.getCell(1).value = hitoLabel
    r.getCell(2).value = entry.sectionTitle
    r.getCell(3).value = entry.id
    r.getCell(4).value = entry.criterion
    r.getCell(5).value = entry.source
    r.getCell(6).value = documentosLabelFromSource(entry.source)
    r.getCell(4).alignment = { wrapText: true }
    r.getCell(6).alignment = { wrapText: true }
    rowIdx++
  }

  sheet.getColumn(1).width = 10
  sheet.getColumn(2).width = 36
  sheet.getColumn(3).width = 10
  sheet.getColumn(4).width = 48
  sheet.getColumn(5).width = 22
  sheet.getColumn(6).width = 56
  sheet.views = [{ state: "frozen", ySplit: 4 }]
}

function lineaId(row: MeiExcelRow): string {
  if (row.lineaRef) return String(row.lineaRef)
  if (row.htmlLineaAprox) return String(row.htmlLineaAprox)
  return ""
}

function addDetallePorTipoSheet(
  workbook: ExcelJS.Workbook,
  sheetName: string,
  tipoPagina: "sitioweb" | "tramites",
  audits: LoadedClarityAudit[],
  rows: MeiExcelRow[],
  documentary: boolean,
) {
  const sheet = workbook.addWorksheet(sheetName)

  if (documentary) {
    sheet.mergeCells(1, 1, 1, DETAIL_HEADERS.length)
    sheet.getCell(1, 1).value =
      "N/A — evidencia documental (sin filas por URL). Ver Índice, CheckList y Fuentes."
    sheet.getCell(1, 1).font = { italic: true }
    autoWidth(sheet, 2)
    return
  }

  const auditsOfType = audits.filter((a) => a.tipoPagina === tipoPagina)
  const rowsOfType = rows.filter((r) => r.tipoPagina === tipoPagina)

  let rowIdx = 1
  let urlOrdinal = 0

  for (const audit of auditsOfType) {
    urlOrdinal++
    const title = sheet.getRow(rowIdx)
    sheet.mergeCells(rowIdx, 1, rowIdx, DETAIL_HEADERS.length)
    const rol = audit.rolMetaMei ? ` · ${audit.rolMetaMei}` : ""
    title.getCell(1).value = `URL ${audit.rank} — ${audit.nombreUi}${rol}`
    title.getCell(1).font = WHITE_BOLD
    title.getCell(1).fill = URL_TITLE_FILL
    rowIdx++

    const header = sheet.getRow(rowIdx)
    DETAIL_HEADERS.forEach((label, i) => {
      header.getCell(i + 1).value = label
    })
    styleHeaderRow(header, DETAIL_HEADERS.length)
    rowIdx++

    const auditRows = rowsOfType.filter((r) => r.url === audit.url)
    if (auditRows.length === 0) {
      const empty = sheet.getRow(rowIdx)
      empty.getCell(1).value = audit.nombreUi
      empty.getCell(2).value = audit.url
      empty.getCell(6).value = "(sin incumplimientos en el alcance de este export)"
      rowIdx++
    } else {
      for (const data of auditRows) {
        const r = sheet.getRow(rowIdx)
        r.getCell(1).value = data.nombreUi
        r.getCell(2).value = data.url
        r.getCell(3).value = lineaId(data)
        r.getCell(4).value = data.criterioId
        r.getCell(5).value = data.criterioEnunciado
        r.getCell(6).value = data.textoOriginal
        r.getCell(7).value = data.textoPropuesto
        r.getCell(8).value = data.motivo
        for (let c = 5; c <= 8; c++) {
          r.getCell(c).alignment = { wrapText: true, vertical: "top" }
        }
        rowIdx++
      }
    }

    rowIdx++
  }

  if (auditsOfType.length === 0) {
    sheet.getCell(1, 1).value =
      "Sin URLs de este tipo en la muestra del export."
  }

  autoWidth(sheet, DETAIL_HEADERS.length)
}

export type BuildMeiWorkbookOptions = {
  hitoIds?: string[]
  root?: string
  /** Por defecto META MEI (10 URLs jefatura). Use `clarity` para la serie Clarity 13. */
  urlSet?: "meta-mei" | "clarity"
}

function loadAuditsForExport(
  urlSet: "meta-mei" | "clarity",
  root: string,
): LoadedClarityAudit[] {
  return urlSet === "clarity"
    ? loadVigenteClarityAudits(root)
    : loadMetaMeiAudits(root)
}

export async function buildMeiWorkbook(
  options: BuildMeiWorkbookOptions = {},
): Promise<ExcelJS.Workbook> {
  const root = options.root ?? process.cwd()
  const urlSet = options.urlSet ?? "meta-mei"
  const audits = loadAuditsForExport(urlSet, root)
  const hitos = resolveHitos(options.hitoIds)
  const documentary = isDocumentaryOnly(hitos)
  const rows = collectRows(hitos, audits, root)

  const workbook = new ExcelJS.Workbook()
  workbook.creator = "lc-inapi.app"
  workbook.created = new Date()

  addIndiceSheet(workbook, audits, rows, hitos, documentary, urlSet)
  addCheckListSheet(workbook, root, hitos)
  addFuentesSheet(workbook, root, hitos)
  addDetallePorTipoSheet(
    workbook,
    "web INAPI",
    "sitioweb",
    audits,
    rows,
    documentary,
  )
  addDetallePorTipoSheet(
    workbook,
    "sitio TRAMITES",
    "tramites",
    audits,
    rows,
    documentary,
  )

  return workbook
}

export type MeiExportStats = {
  auditCount: number
  hitoSheets: number
  totalRows: number
  sheetNames: string[]
  urlSet: "meta-mei" | "clarity"
}

export async function buildMeiWorkbookWithStats(
  options: BuildMeiWorkbookOptions = {},
): Promise<{ workbook: ExcelJS.Workbook; stats: MeiExportStats }> {
  const root = options.root ?? process.cwd()
  const urlSet = options.urlSet ?? "meta-mei"
  const audits = loadAuditsForExport(urlSet, root)
  const hitoIds = options.hitoIds ?? MEI_EXPORT_HITOS.map((h) => h.id)
  let totalRows = 0
  for (const id of hitoIds) {
    const hito = hitoById(id)
    if (hito && !hito.incluyeAuditoriasUrl) continue
    totalRows += buildRowsForHito(id, audits, root).length
  }
  const workbook = await buildMeiWorkbook({ ...options, hitoIds, urlSet })
  return {
    workbook,
    stats: {
      auditCount: audits.length,
      hitoSheets: hitoIds.length,
      totalRows,
      sheetNames: workbook.worksheets.map((s) => s.name),
      urlSet,
    },
  }
}
