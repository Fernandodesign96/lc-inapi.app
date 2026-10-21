/**
 * Desglose de criterios con más de una corrección (fila en `sustituciones[]`)
 * para Datos de Auditoría (UI · PDF).
 *
 * El número de cada categoría MEI sigue siendo **criterios únicos**.
 * Si un mismo `LC-*` tiene N textos distintos, N > 1 se anota al lado.
 */
import type { CriterionEvaluation } from "../schemas/checklist"
import type { ClaudeSustitucion } from "../schemas/claude-audit-pilot"
import { isMetadataSustitucion } from "./audit-visible-content"
import { categoriaPresentacionFromEvaluation } from "./mei-export/mei-criterio-categoria"
import { ptdHitoTareaPorCriterio } from "./ptd-hito-tarea-por-criterio"

export type CriterioMultiCorreccion = {
  criterioId: string
  ordinal: number
  correcciones: number
}

export type DesgloseCorreccionesDatosAuditoria = {
  /** Filas visibles en `sustituciones[]` (sin METADATA). */
  totalCorrecciones: number
  todos: CriterioMultiCorreccion[]
  cumpleConObservaciones: CriterioMultiCorreccion[]
  medianamenteCumple: CriterioMultiCorreccion[]
  noCumple: CriterioMultiCorreccion[]
}

function contarCorreccionesPorCriterio(
  sustituciones: readonly ClaudeSustitucion[],
): Map<string, number> {
  const counts = new Map<string, number>()
  for (const s of sustituciones) {
    if (isMetadataSustitucion(s)) continue
    counts.set(s.criterio_id, (counts.get(s.criterio_id) ?? 0) + 1)
  }
  return counts
}

function toMulti(
  criterioId: string,
  correcciones: number,
): CriterioMultiCorreccion | null {
  if (correcciones < 2) return null
  const ordinal = ptdHitoTareaPorCriterio(criterioId).criterioOrdinal
  if (ordinal == null) return null
  return { criterioId, ordinal, correcciones }
}

function byOrdinal(a: CriterioMultiCorreccion, b: CriterioMultiCorreccion) {
  return a.ordinal - b.ordinal
}

export function buildDesgloseCorreccionesDatosAuditoria(
  evaluations: CriterionEvaluation[],
  sustituciones: readonly ClaudeSustitucion[],
): DesgloseCorreccionesDatosAuditoria {
  const counts = contarCorreccionesPorCriterio(sustituciones)
  let totalCorrecciones = 0
  for (const n of counts.values()) totalCorrecciones += n
  const todos: CriterioMultiCorreccion[] = []
  const cumpleConObservaciones: CriterioMultiCorreccion[] = []
  const medianamenteCumple: CriterioMultiCorreccion[] = []
  const noCumple: CriterioMultiCorreccion[] = []

  for (const row of evaluations) {
    const n = counts.get(row.id) ?? 0
    const item = toMulti(row.id, n)
    if (!item) continue
    todos.push(item)
    const cat = categoriaPresentacionFromEvaluation(row)
    if (cat === "Cumple con observaciones") cumpleConObservaciones.push(item)
    else if (cat === "Medianamente cumple") medianamenteCumple.push(item)
    else if (cat === "No cumple") noCumple.push(item)
  }

  return {
    totalCorrecciones,
    todos: todos.sort(byOrdinal),
    cumpleConObservaciones: cumpleConObservaciones.sort(byOrdinal),
    medianamenteCumple: medianamenteCumple.sort(byOrdinal),
    noCumple: noCumple.sort(byOrdinal),
  }
}

/** «Criterio 1 (2 correcciones), Criterio 32 (3 correcciones)» */
export function formatCriteriosMultiCorreccionResumen(
  items: readonly CriterioMultiCorreccion[],
): string {
  return items
    .map((i) => `Criterio ${i.ordinal} (${i.correcciones} correcciones)`)
    .join(", ")
}

/**
 * «5» o «5 (Criterio 6: 2 correcciones. Criterio 32: 3 correcciones)»
 */
export function formatConteoCategoriaConCorrecciones(
  count: number,
  extras: readonly CriterioMultiCorreccion[],
): string {
  if (extras.length === 0) return String(count)
  const detalle = extras
    .map((i) => `Criterio ${i.ordinal}: ${i.correcciones} correcciones`)
    .join(". ")
  return `${count} (${detalle})`
}
