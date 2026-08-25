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
  indicator_code_display?: string
  indicator_code_iew?: string
  indicator_code_iesd?: string | null
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

/** Encabezado PDF: Criterio N + pregunta + dimensión/códigos al final. */
export function formatCriterioPdfEncabezado(
  id: string,
  numero: number,
): string {
  const row = getCriterionCatalogRow(id)
  const pregunta =
    row?.criterion?.trim() ||
    (row?.display_label?.trim() ? row.display_label : id)
  const nombre = row?.indicator_name?.trim() || "Lenguaje claro"
  const codigos =
    row?.indicator_code_display?.trim() ||
    [row?.indicator_code_iew, row?.indicator_code_iesd]
      .filter((c): c is string => Boolean(c && String(c).trim()))
      .join(" / ") ||
    id
  return `Criterio ${numero}: ${pregunta} (Dimensión: ${nombre} — ${nombre} ${codigos})`
}

const criteria = [
  ...(checklistCriteriaV30.criteria as ChecklistCriterionCatalogRow[]),
  ...(checklistCriteriaV21.criteria as ChecklistCriterionCatalogRow[]),
]

/** Mapa id → fila (v3.0 primero). v2.1 A–H solo para informes históricos; UI/PDF filtran LC-* si el JSON ya es v3.0. */
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
