import { readFileSync } from "node:fs"
import { join } from "node:path"

import type { CriterionId } from "../../schemas/checklist"

type ChecklistFile = {
  criteria: Array<{
    id: CriterionId
    criterion: string
  }>
}

let cached: Map<CriterionId, string> | null = null

export function loadChecklistEnunciados(root = process.cwd()): Map<CriterionId, string> {
  if (cached) return cached
  const path = join(root, "data/checklist-criteria.json")
  const data = JSON.parse(readFileSync(path, "utf8")) as ChecklistFile
  cached = new Map(data.criteria.map((c) => [c.id, c.criterion]))
  return cached
}
