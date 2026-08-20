import checklistCriteriaV21 from "../../../data/checklist-criteria.json"
import checklistCriteriaV30 from "../../../data/checklist-criteria-lc-ptd.json"

export type ChecklistCriterionCatalogRow = {
  id: string
  section_id: string
  section_title: string
  criterion: string
  verification: string
  source: string
  display_label?: string
  indicator_name?: string
}

/** Texto para la columna «Criterio»: preferir display_label v3.0; si no, id + enunciado. */
export function formatCriterioEnunciado(id: string): string {
  const row = getCriterionCatalogRow(id)
  if (!row) return id
  if (row.display_label) return row.display_label
  return `${id} ${row.criterion}`
}

/** Texto para la columna «Sección»; indicador o section_title; «—» si falta. */
export function formatSeccionTitulo(id: string): string {
  const row = getCriterionCatalogRow(id)
  if (!row) return "—"
  return row.indicator_name ?? row.section_title
}

const criteria = [
  ...(checklistCriteriaV30.criteria as ChecklistCriterionCatalogRow[]),
  ...(checklistCriteriaV21.criteria as ChecklistCriterionCatalogRow[]),
]

/** Mapa id → fila (v3.0 primero; v2.1 rellena históricos A–H). */
export const CRITERION_CATALOG_BY_ID = new Map<
  string,
  ChecklistCriterionCatalogRow
>()
for (const row of criteria) {
  if (!CRITERION_CATALOG_BY_ID.has(row.id)) {
    CRITERION_CATALOG_BY_ID.set(row.id, row)
  }
}

export function getCriterionCatalogRow(
  id: string,
): ChecklistCriterionCatalogRow | undefined {
  return CRITERION_CATALOG_BY_ID.get(id)
}
