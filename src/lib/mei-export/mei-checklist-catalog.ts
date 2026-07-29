import { readFileSync } from "node:fs"
import { join } from "node:path"

import type { CriterionId } from "../../schemas/checklist"

export type ChecklistCriterionEntry = {
  id: CriterionId
  sectionId: string
  sectionTitle: string
  criterion: string
  source: string
}

type ChecklistFile = {
  criteria: Array<{
    id: CriterionId
    section_id: string
    section_title: string
    criterion: string
    source: string
  }>
}

let cachedMap: Map<CriterionId, string> | null = null
let cachedList: ChecklistCriterionEntry[] | null = null

function loadChecklistFile(root = process.cwd()): ChecklistFile {
  const path = join(root, "data/checklist-criteria.json")
  return JSON.parse(readFileSync(path, "utf8")) as ChecklistFile
}

export function loadChecklistEnunciados(
  root = process.cwd(),
): Map<CriterionId, string> {
  if (cachedMap) return cachedMap
  const data = loadChecklistFile(root)
  cachedMap = new Map(data.criteria.map((c) => [c.id, c.criterion]))
  return cachedMap
}

export function loadChecklistCriteriaList(
  root = process.cwd(),
): ChecklistCriterionEntry[] {
  if (cachedList) return cachedList
  const data = loadChecklistFile(root)
  cachedList = data.criteria.map((c) => ({
    id: c.id,
    sectionId: c.section_id,
    sectionTitle: c.section_title,
    criterion: c.criterion,
    source: c.source,
  }))
  return cachedList
}

/** Resetea caché (tests / CLI). */
export function clearChecklistCatalogCache() {
  cachedMap = null
  cachedList = null
}
