import checklistCriteriaFile from "../../../data/checklist-criteria.json"

export type ChecklistCriterionCatalogRow = {
  id: string
  section_id: string
  section_title: string
  criterion: string
  verification: string
  source: string
}


/** Texto para la columna «Criterio»: id + enunciado del catálogo (v1.1). Si falta el id en el catálogo, devuelve solo el id. */
export function formatCriterioEnunciado(id: string): string {
    const row = getCriterionCatalogRow(id)
    if (!row) return id
    return `${id} ${row.criterion}`
  }
  
  /** Texto para la columna «Sección»; «—» si el id no está en el catálogo. */
  export function formatSeccionTitulo(id: string): string {
    return getCriterionCatalogRow(id)?.section_title ?? "—"
  }

const criteria = checklistCriteriaFile.criteria as ChecklistCriterionCatalogRow[]

/** Mapa id de criterio (A1…H1) → fila del catálogo checklist v1.1 */
export const CRITERION_CATALOG_BY_ID = new Map<string, ChecklistCriterionCatalogRow>(
  criteria.map((row) => [row.id, row]),
)

export function getCriterionCatalogRow(
  id: string,
): ChecklistCriterionCatalogRow | undefined {
  return CRITERION_CATALOG_BY_ID.get(id)
}