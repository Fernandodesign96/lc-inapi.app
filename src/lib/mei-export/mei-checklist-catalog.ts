import { readFileSync } from "node:fs"
import { join } from "node:path"

import type { CriterionId } from "../../schemas/checklist"

export type ChecklistCriterionEntry = {
  id: CriterionId
  sectionId: string
  sectionTitle: string
  criterion: string
  source: string
  displayLabel?: string
  indicatorName?: string
  indicatorCodeIew?: string | null
  indicatorCodeIesd?: string | null
  indicatorCodeDisplay?: string
}

type AnyChecklistFile = {
  criteria: Array<{
    id: CriterionId
    section_id: string
    section_title: string
    criterion: string
    source: string
    display_label?: string
    indicator_name?: string
    indicator_code_iew?: string | null
    indicator_code_iesd?: string | null
    indicator_code_display?: string
  }>
}

let cachedMap: Map<CriterionId, string> | null = null
let cachedList: ChecklistCriterionEntry[] | null = null

function loadV30Checklist(root = process.cwd()): AnyChecklistFile {
  const v30Path = join(root, "data/checklist-criteria-lc-ptd.json")
  return JSON.parse(readFileSync(v30Path, "utf8")) as AnyChecklistFile
}

/**
 * Catálogo para enunciados de filas Excel: v3.0 + legado A–H solo para
 * auditorías históricas que aún traen ids A1–H1.
 */
function loadMergedChecklist(root = process.cwd()): AnyChecklistFile {
  const v30 = loadV30Checklist(root)
  const v21Path = join(root, "data/checklist-criteria.json")
  const v21 = JSON.parse(readFileSync(v21Path, "utf8")) as AnyChecklistFile
  const byId = new Map(v30.criteria.map((c) => [c.id, c]))
  for (const c of v21.criteria) {
    if (!byId.has(c.id)) byId.set(c.id, c)
  }
  return { criteria: [...byId.values()] }
}

export function loadChecklistEnunciados(
  root = process.cwd(),
): Map<CriterionId, string> {
  if (cachedMap) return cachedMap
  const data = loadMergedChecklist(root)
  cachedMap = new Map(
    data.criteria.map((c) => [
      c.id,
      c.display_label ??
        (c.indicator_name
          ? `${c.indicator_name} — Criterio: ${c.criterion}`
          : c.criterion),
    ]),
  )
  return cachedMap
}

/**
 * Lista para pestaña CheckList del Excel MEI: **solo** PTD-LC v3.0 (51 `LC-*`).
 */
export function loadChecklistCriteriaList(
  root = process.cwd(),
): ChecklistCriterionEntry[] {
  if (cachedList) return cachedList
  const data = loadV30Checklist(root)
  cachedList = data.criteria.map((c) => ({
    id: c.id,
    sectionId: c.section_id,
    sectionTitle: c.section_title,
    criterion: c.criterion,
    source: c.source,
    displayLabel: c.display_label,
    indicatorName: c.indicator_name,
    indicatorCodeIew: c.indicator_code_iew ?? null,
    indicatorCodeIesd: c.indicator_code_iesd ?? null,
    indicatorCodeDisplay: c.indicator_code_display,
  }))
  return cachedList
}

/** Título de bloque de dimensión según instrumento (IEW §1 vs IESD §5). */
export function checklistSectionInstrumentTitle(
  sectionId: string,
  sectionTitle: string,
): string {
  if (sectionId === "1") {
    return `${sectionTitle} - Instrumento de evaluación del Sitio Web`
  }
  if (sectionId === "5") {
    return `${sectionTitle} - Instrumento de evaluación Servicios Digitales Transaccionales`
  }
  return sectionTitle
}

/** Columna Instrumentos: códigos IEW/IESD + nombre del indicador. */
export function checklistInstrumentosLabel(
  entry: ChecklistCriterionEntry,
): string {
  const parts: string[] = []
  if (entry.indicatorCodeIew) parts.push(`IEW ${entry.indicatorCodeIew}`)
  if (entry.indicatorCodeIesd) parts.push(`IESD ${entry.indicatorCodeIesd}`)
  const codes =
    parts.length > 0
      ? parts.join(" / ")
      : (entry.indicatorCodeDisplay ?? "—")
  return entry.indicatorName ? `${codes} — ${entry.indicatorName}` : codes
}

/** Resetea caché (tests / CLI). */
export function clearChecklistCatalogCache() {
  cachedMap = null
  cachedList = null
}
