/**
 * Etiquetas de entrega para criterios LC (UI · PDF): sin códigos IEW/IESD ni LC-*.
 * Instrumento N = orden de los 15 indicadores IEW (§2.1 CLAUDE.md).
 */
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

/** Orden canónico de instrumentos (entrega). */
export const INSTRUMENTOS_ENTREGA_ORDEN = [
  "Fiabilidad",
  "Completitud",
  "Lenguaje plano",
  "Actualización",
  "Redacción y ortografía",
  "Propiedad intelectual",
  "Privacidad y datos personales",
  "Contenidos sensibles",
  "Claridad",
  "Concisión",
  "Legibilidad",
  "Escritura para la web",
  "Visualización de la información",
  "Objetividad",
  "Archivo",
] as const

const INSTRUMENTO_ORDINAL = new Map<string, number>(
  INSTRUMENTOS_ENTREGA_ORDEN.map((nombre, i) => [nombre.toLowerCase(), i + 1]),
)

export function instrumentoOrdinalPorNombre(
  nombre: string | undefined | null,
): number | null {
  if (!nombre?.trim()) return null
  return INSTRUMENTO_ORDINAL.get(nombre.trim().toLowerCase()) ?? null
}

/** Ej. `Instrumento 3: Lenguaje plano`. */
export function formatInstrumentoEntrega(id: string): string {
  const row = getCriterionCatalogRow(id)
  const nombre =
    row?.indicator_name?.trim() ||
    row?.section_title?.trim() ||
    "Lenguaje claro"
  const n = instrumentoOrdinalPorNombre(nombre)
  return n != null ? `Instrumento ${n}: ${nombre}` : `Instrumento: ${nombre}`
}

/**
 * Pregunta del criterio sin prefijos «Nombre 1.1.3 / 5.1.3 — Criterio:».
 */
export function preguntaCriterioEntrega(id: string): string {
  const row = getCriterionCatalogRow(id)
  if (!row) return id
  const directa = row.criterion?.trim()
  if (directa) return directa
  const label = row.display_label?.trim()
  if (!label) return id
  const m = /(?:—\s*)?Criterio:\s*(.+)$/iu.exec(label)
  if (m?.[1]) return m[1].trim()
  return label
    .replace(/^[A-Za-zÁÉÍÓÚáéíóúñÑüÜ\s]+?\d+\.\d+\.\d+(?:\s*\/\s*\d+\.\d+\.\d+)?\s*—\s*/u, "")
    .trim()
}

/** Texto para la columna «Criterio» (solo la pregunta; sin códigos). */
export function formatCriterioEnunciado(id: string): string {
  return preguntaCriterioEntrega(id)
}

/** Columna instrumento / filtros: `Instrumento N: Nombre`. */
export function formatSeccionTitulo(id: string): string {
  return formatInstrumentoEntrega(id)
}

/** Encabezado PDF/UI: Criterio N + pregunta — Instrumento M: Nombre. */
export function formatCriterioPdfEncabezado(
  id: string,
  numero: number,
): string {
  const pregunta = preguntaCriterioEntrega(id)
  return `Criterio ${numero}: ${pregunta} — ${formatInstrumentoEntrega(id)}`
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
