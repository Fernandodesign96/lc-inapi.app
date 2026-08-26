import ExcelJS from "exceljs"

import type { LoadedClarityAudit } from "./mei-audit-loader"
import {
  loadMetaMeiAudits,
  loadVigenteClarityAudits,
} from "./mei-audit-loader"
import {
  checklistInstrumentosLabel,
  checklistSectionInstrumentTitle,
  loadChecklistCriteriaList,
  type ChecklistCriterionEntry,
} from "./mei-checklist-catalog"
import { MEI_EXPORT_HITOS, hitoById, type MeiExportHito } from "./mei-hitos"
import { MEI_META_MEI_URLS } from "./mei-meta-mei-urls"
import {
  buildRowsForHito,
  type MeiExcelRow,
} from "./mei-row-builder"
import { MEI_CATEGORIA_PRESENTACION } from "./mei-criterio-categoria"
import {
  buildHitosTareasCriteriosRows,
  type HitoTareaCriterioExcelRow,
} from "./mei-hitos-tareas-criterios"
import { ptdHitoTareaPorCriterio } from "../ptd-hito-tarea-por-criterio"

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
  "Categoría",
  "Texto en pantalla",
  "Corrección propuesta",
  "Ubicación en pantalla",
  "Justificación",
  "Criterio",
  "CheckList",
  "Línea / ref. técnica",
  "Hito",
  "Tarea",
] as const

const CATEGORY_SECTION_FILL: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFE2EFDA" },
}

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
  const colCount = 8
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
    "Porcentaje LC",
  ].forEach((label, i) => {
    headerRow.getCell(i + 1).value = label
  })
  styleHeaderRow(headerRow, colCount)

  if (documentary) {
    const note = sheet.getRow(5)
    note.getCell(1).value = "—"
    note.getCell(2).value = "Evidencia"
    note.getCell(3).value = "Checklist Editorial INAPI PTD-LC v3.0 (51 LC-*)"
    note.getCell(4).value =
      "N/A — evidencia documental (actividad 1 / H01); ver pestaña CheckList"
    note.getCell(7).value = 0
    note.getCell(8).value = "—"

    const total = sheet.getRow(6)
    total.getCell(1).value = "TOTAL"
    total.getCell(7).value = 0
    total.getCell(8).value = "—"
    for (let c = 1; c <= colCount; c++) {
      total.getCell(c).fill = TOTAL_CYAN
      total.getCell(c).font = { bold: true }
    }

    const pctHeader = sheet.getRow(8)
    sheet.mergeCells(8, 1, 8, colCount)
    pctHeader.getCell(1).value = "Porcentaje final"
    pctHeader.getCell(1).font = { bold: true }
    pctHeader.getCell(1).fill = SECTION_FILL

    const pctRow = sheet.getRow(9)
    sheet.mergeCells(9, 1, 9, colCount)
    pctRow.getCell(1).value =
      "N/A — evidencia documental (sin % LC por URL en este export)."

    autoWidth(sheet, colCount)
    return
  }

  const countByUrl = new Map<string, number>()
  for (const row of rows) {
    if (row.estadoAuditoria !== "incumple") continue
    countByUrl.set(row.url, (countByUrl.get(row.url) ?? 0) + 1)
  }

  let totalInc = 0
  let sumPct = 0
  audits.forEach((audit, idx) => {
    const r = sheet.getRow(5 + idx)
    const n = countByUrl.get(audit.url) ?? 0
    totalInc += n
    sumPct += audit.porcentajeLc
    r.getCell(1).value = audit.rank
    r.getCell(2).value = seccionLabel(audit.tipoPagina)
    r.getCell(3).value = audit.nombreUi
    r.getCell(4).value = audit.url
    r.getCell(5).value = audit.rolMetaMei ?? ""
    r.getCell(6).value = audit.fechaEvaluacionIso.slice(0, 10)
    r.getCell(7).value = n
    r.getCell(8).value = `${formatPorcentajeLc(audit.porcentajeLc)} %`
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
      r.getCell(8).value = "—"
      extra++
    }
  }

  const totalRowIdx = 5 + audits.length + extra
  const totalRow = sheet.getRow(totalRowIdx)
  totalRow.getCell(1).value = "TOTAL"
  totalRow.getCell(7).value = totalInc
  totalRow.getCell(8).value =
    audits.length > 0
      ? `${formatPorcentajeLc(sumPct / audits.length)} % (promedio)`
      : "—"
  for (let c = 1; c <= colCount; c++) {
    totalRow.getCell(c).fill = TOTAL_CYAN
    totalRow.getCell(c).font = { bold: true }
  }

  const pctHeaderIdx = totalRowIdx + 2
  const pctHeader = sheet.getRow(pctHeaderIdx)
  sheet.mergeCells(pctHeaderIdx, 1, pctHeaderIdx, colCount)
  pctHeader.getCell(1).value = "Porcentaje final"
  pctHeader.getCell(1).font = { bold: true }
  pctHeader.getCell(1).fill = SECTION_FILL

  const pctValueIdx = pctHeaderIdx + 1
  const pctValue = sheet.getRow(pctValueIdx)
  sheet.mergeCells(pctValueIdx, 1, pctValueIdx, colCount)
  if (audits.length === 0) {
    pctValue.getCell(1).value = "Sin auditorías en la muestra — sin porcentaje final."
  } else {
    const promedio = sumPct / audits.length
    pctValue.getCell(1).value =
      `Promedio LC de la muestra (${audits.length} URL${audits.length === 1 ? "" : "s"} con informe): ${formatPorcentajeLc(promedio)} %. ` +
      `Cada fila incluye su porcentaje LC en la columna «Porcentaje LC» (checklist PTD-LC v3.0).`
    pctValue.getCell(1).alignment = { wrapText: true }
    pctValue.height = 36
  }

  sheet.views = [{ state: "frozen", ySplit: 4 }]
  autoWidth(sheet, colCount)
}

function formatPorcentajeLc(value: number): string {
  const rounded = Math.round(value * 10) / 10
  return Number.isInteger(rounded)
    ? String(rounded)
    : rounded.toFixed(1).replace(".", ",")
}

const HITOS_TAREAS_CRITERIOS_HEADERS = [
  "URL",
  "Hito",
  "Tarea",
  "Criterio",
  "Estado",
  "Descripción Hito",
  "Descripción Tarea",
  "Descripción Criterio",
] as const

function writeHitoTareaCriterioDataRow(
  sheet: ExcelJS.Worksheet,
  rowIdx: number,
  data: HitoTareaCriterioExcelRow,
) {
  const r = sheet.getRow(rowIdx)
  r.getCell(1).value = data.url
  r.getCell(2).value = data.hito
  r.getCell(3).value = data.tarea
  r.getCell(4).value = data.criterio
  r.getCell(5).value = data.estado
  r.getCell(6).value = data.descripcionHito
  r.getCell(7).value = data.descripcionTarea
  r.getCell(8).value = data.descripcionCriterio
  for (const c of [1, 5, 6, 7, 8] as const) {
    r.getCell(c).alignment = { wrapText: true, vertical: "top" }
  }
  for (const c of [2, 3, 4] as const) {
    r.getCell(c).alignment = { vertical: "top", horizontal: "center" }
  }
}

/**
 * Pestaña alineada a «Resumen por hito» / árbol Hito→Tarea→Criterio (UI/PDF).
 * Una URL: tabla plana. Varias URLs: bloques seccionados por URL.
 */
function addHitosTareasCriteriosSheet(
  workbook: ExcelJS.Workbook,
  audits: LoadedClarityAudit[],
  root: string,
  documentary: boolean,
) {
  const sheet = workbook.addWorksheet("Hitos-Tareas-Criterios")
  const colCount = HITOS_TAREAS_CRITERIOS_HEADERS.length

  if (documentary) {
    sheet.mergeCells(1, 1, 1, colCount)
    sheet.getCell(1, 1).value =
      "N/A — evidencia documental (sin evaluación por URL). Ver Índice y CheckList."
    sheet.getCell(1, 1).font = { italic: true }
    autoWidth(sheet, 2)
    return
  }

  const allRows = buildHitosTareasCriteriosRows(audits, root)
  if (allRows.length === 0) {
    sheet.mergeCells(1, 1, 1, colCount)
    sheet.getCell(1, 1).value =
      "Sin criterios evaluados en el alcance de este export."
    sheet.getCell(1, 1).font = { italic: true }
    autoWidth(sheet, 2)
    return
  }

  const sectionByUrl = audits.length > 1
  let rowIdx = 1

  const writeHeader = () => {
    const header = sheet.getRow(rowIdx)
    HITOS_TAREAS_CRITERIOS_HEADERS.forEach((label, i) => {
      header.getCell(i + 1).value = label
    })
    styleHeaderRow(header, colCount)
    header.height = 22
    rowIdx++
  }

  if (!sectionByUrl) {
    writeHeader()
    for (const data of allRows) {
      writeHitoTareaCriterioDataRow(sheet, rowIdx, data)
      rowIdx++
    }
  } else {
    const auditsSorted = [...audits].sort((a, b) => a.rank - b.rank)
    for (const audit of auditsSorted) {
      const title = sheet.getRow(rowIdx)
      sheet.mergeCells(rowIdx, 1, rowIdx, colCount)
      const rol = audit.rolMetaMei ? ` · ${audit.rolMetaMei}` : ""
      title.getCell(1).value = `URL ${audit.rank} — ${audit.nombreUi}${rol}`
      title.getCell(1).font = WHITE_BOLD
      title.getCell(1).fill = URL_TITLE_FILL
      rowIdx++

      writeHeader()

      const auditRows = allRows.filter((r) => r.url === audit.url)
      if (auditRows.length === 0) {
        const empty = sheet.getRow(rowIdx)
        empty.getCell(1).value = audit.url
        empty.getCell(5).value = "—"
        empty.getCell(8).value =
          "(sin criterios evaluados en el alcance de este export)"
        rowIdx++
      } else {
        for (const data of auditRows) {
          writeHitoTareaCriterioDataRow(sheet, rowIdx, data)
          rowIdx++
        }
      }
      rowIdx++
    }
  }

  sheet.getColumn(1).width = 36
  sheet.getColumn(2).width = 8
  sheet.getColumn(3).width = 8
  sheet.getColumn(4).width = 10
  sheet.getColumn(5).width = 24
  sheet.getColumn(6).width = 48
  sheet.getColumn(7).width = 48
  sheet.getColumn(8).width = 56
  sheet.views = [{ state: "frozen", ySplit: sectionByUrl ? 0 : 1 }]
}

function addCheckListSheet(
  workbook: ExcelJS.Workbook,
  root: string,
  _hitos: MeiExportHito[],
) {
  const sheet = workbook.addWorksheet("CheckList")
  const entries: ChecklistCriterionEntry[] = loadChecklistCriteriaList(root)
  const colCount = 6

  const header = sheet.getRow(1)
  ;[
    "Hitos",
    "Tareas",
    "Instrumentos",
    "Criterios",
    "Nombre del Criterio",
    "Cita fuente",
  ].forEach((label, i) => {
    header.getCell(i + 1).value = label
  })
  styleHeaderRow(header, colCount)

  let rowIdx = 2
  let lastSection = ""
  for (const entry of entries) {
    if (entry.sectionId !== lastSection) {
      lastSection = entry.sectionId
      const sep = sheet.getRow(rowIdx)
      const sectionTitle = checklistSectionInstrumentTitle(
        entry.sectionId,
        entry.sectionTitle,
      )
      sep.getCell(1).value = entry.sectionId
      sep.getCell(2).value = ""
      sep.getCell(3).value = sectionTitle
      sep.getCell(4).value = ""
      sep.getCell(5).value = ""
      sep.getCell(6).value = ""
      for (let c = 1; c <= colCount; c++) {
        sep.getCell(c).fill = SECTION_FILL
        sep.getCell(c).font = { bold: true }
      }
      sep.getCell(3).alignment = { wrapText: true }
      rowIdx++
    }

    const ptd = ptdHitoTareaPorCriterio(entry.id)
    const r = sheet.getRow(rowIdx)
    r.getCell(1).value = ptd.hitoPtd
    r.getCell(2).value = ptd.tareaPtd
    r.getCell(3).value = checklistInstrumentosLabel(entry)
    r.getCell(4).value = entry.id
    r.getCell(5).value = entry.displayLabel ?? entry.criterion
    r.getCell(6).value = entry.source
    for (const c of [1, 2, 3, 5] as const) {
      r.getCell(c).alignment = { wrapText: true, vertical: "top" }
    }
    rowIdx++
  }

  sheet.getColumn(1).width = 36
  sheet.getColumn(2).width = 36
  sheet.getColumn(3).width = 40
  sheet.getColumn(4).width = 16
  sheet.getColumn(5).width = 56
  sheet.getColumn(6).width = 28
  sheet.views = [{ state: "frozen", ySplit: 1 }]
}

function lineaId(row: MeiExcelRow): string {
  if (row.lineaRef) return String(row.lineaRef)
  if (row.htmlLineaAprox) return String(row.htmlLineaAprox)
  return ""
}

function ubicacionEntrega(row: MeiExcelRow): string {
  if (row.ubicacionPantalla.trim()) return row.ubicacionPantalla
  // Si hay texto, la fila debió salir de criterioEntregaCampos con ubicación;
  // no rellenar con mensajes vagos aquí.
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
      "N/A — evidencia documental (sin filas por URL). Ver Índice y CheckList."
    sheet.getCell(1, 1).font = { italic: true }
    autoWidth(sheet, 2)
    return
  }

  const auditsOfType = audits.filter((a) => a.tipoPagina === tipoPagina)
  const rowsOfType = rows.filter((r) => r.tipoPagina === tipoPagina)

  let rowIdx = 1

  for (const audit of auditsOfType) {
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
      empty.getCell(3).value = "—"
      empty.getCell(4).value =
        "(sin criterios evaluados en el alcance de este export)"
      rowIdx++
    } else {
      for (const cat of MEI_CATEGORIA_PRESENTACION) {
        const catRows = auditRows.filter((r) => r.categoriaPresentacion === cat)
        if (catRows.length === 0) continue

        const sep = sheet.getRow(rowIdx)
        sheet.mergeCells(rowIdx, 1, rowIdx, DETAIL_HEADERS.length)
        sep.getCell(1).value = `${cat} (${catRows.length})`
        sep.getCell(1).font = { bold: true }
        for (let c = 1; c <= DETAIL_HEADERS.length; c++) {
          sep.getCell(c).fill = CATEGORY_SECTION_FILL
        }
        rowIdx++

        for (const data of catRows) {
          const r = sheet.getRow(rowIdx)
          r.getCell(1).value = data.nombreUi
          r.getCell(2).value = data.url
          r.getCell(3).value = data.categoriaPresentacion || "—"
          r.getCell(4).value = data.textoOriginal
          r.getCell(5).value = data.textoPropuesto
          r.getCell(6).value = ubicacionEntrega(data)
          r.getCell(7).value = data.motivo
          r.getCell(8).value = data.criterioId
          r.getCell(9).value = data.criterioEnunciado
          r.getCell(10).value = lineaId(data)
          r.getCell(11).value = data.hitoPtd
          r.getCell(12).value = data.tareaPtd
          for (const c of [4, 5, 6, 7, 9, 10, 11, 12] as const) {
            r.getCell(c).alignment = { wrapText: true, vertical: "top" }
          }
          rowIdx++
        }
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
  /** Si se pasa, no carga la muestra completa (Excel de una sola URL). */
  audits?: LoadedClarityAudit[]
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
  const audits = options.audits ?? loadAuditsForExport(urlSet, root)
  const hitos = resolveHitos(options.hitoIds)
  const documentary = isDocumentaryOnly(hitos)
  const rows = collectRows(hitos, audits, root)

  const workbook = new ExcelJS.Workbook()
  workbook.creator = "lc-inapi.app"
  workbook.created = new Date()

  addIndiceSheet(workbook, audits, rows, hitos, documentary, urlSet)
  addHitosTareasCriteriosSheet(workbook, audits, root, documentary)
  addCheckListSheet(workbook, root, hitos)
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
