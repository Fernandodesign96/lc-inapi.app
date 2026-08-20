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
  }>
}

let cachedMap: Map<CriterionId, string> | null = null
let cachedList: ChecklistCriterionEntry[] | null = null

function loadMergedChecklist(root = process.cwd()): AnyChecklistFile {
  const v30Path = join(root, "data/checklist-criteria-lc-ptd.json")
  const v21Path = join(root, "data/checklist-criteria.json")
  const v30 = JSON.parse(readFileSync(v30Path, "utf8")) as AnyChecklistFile
  const v21 = JSON.parse(readFileSync(v21Path, "utf8")) as AnyChecklistFile
  // Preferir v3.0; añadir v2.1 solo para IDs históricos no presentes
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

export function loadChecklistCriteriaList(
  root = process.cwd(),
): ChecklistCriterionEntry[] {
  if (cachedList) return cachedList
  const data = loadMergedChecklist(root)
  cachedList = data.criteria.map((c) => ({
    id: c.id,
    sectionId: c.section_id,
    sectionTitle: c.section_title,
    criterion: c.criterion,
    source: c.source,
    displayLabel: c.display_label,
  }))
  return cachedList
}

/** Resetea caché (tests / CLI). */
export function clearChecklistCatalogCache() {
  cachedMap = null
  cachedList = null
}
