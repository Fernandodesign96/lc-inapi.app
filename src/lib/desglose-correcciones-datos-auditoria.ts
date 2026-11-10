/**
 * Desglose de correcciones para Datos de Auditoría (UI · PDF) y Word.
 *
 * Una corrección / solicitud = fila visible en `sustituciones[]` (sin METADATA).
 * Los criterios con `agrupado_en` se mencionan en Observaciones del primario
 * (C-2026-11-09a); **no** generan fila Word extra.
 *
 * Los números de Cumple con observaciones / Medianamente / No cumplen
 * cuentan **correcciones** (filas de sustitución) y deben sumar
 * `totalCorrecciones`. Si un mismo LC-* tiene N > 1 filas, se anota al lado.
 */
import type {
  CriterionEvaluation,
  CriterionId,
} from "../schemas/checklist"
import type { ClaudeSustitucion } from "../schemas/claude-audit-pilot"
import { isMetadataSustitucion } from "./audit-visible-content"
import {
  categoriaPresentacionFromEvaluation,
  type MeiCategoriaPresentacion,
} from "./mei-export/mei-criterio-categoria"
import { ptdHitoTareaPorCriterio } from "./ptd-hito-tarea-por-criterio"

export type CriterioMultiCorreccion = {
  criterioId: string
  ordinal: number
  correcciones: number
}

export type DesgloseCorreccionesDatosAuditoria = {
  totalCorrecciones: number
  /** Correcciones por bucket de severidad (suman `totalCorrecciones`). */
  correccionesCumpleConObservaciones: number
  correccionesMedianamenteCumple: number
  correccionesNoCumple: number
  todos: CriterioMultiCorreccion[]
  cumpleConObservaciones: CriterioMultiCorreccion[]
  medianamenteCumple: CriterioMultiCorreccion[]
  noCumple: CriterioMultiCorreccion[]
}

/** Ítem entregable: una fila lógica de corrección (Word / conteos). */
export type CorreccionEntregaItem = {
  /** Criterio que representa esta fila (agrupado o primario). */
  criterioId: CriterionId
  /** Grupo para «corrección i de n» (primario del hallazgo). */
  grupoId: CriterionId
  indexInGrupo: number
  totalInGrupo: number
  /** Contenido CMS / evidencia (sustitución fuente). */
  sust: ClaudeSustitucion
  /** Si la fila representa un criterio agrupado sin sustitución propia. */
  esAgrupado: boolean
  categoria: Exclude<
    MeiCategoriaPresentacion,
    "Cumple" | "No aplica"
  >
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

function catSeveridad(
  ev: CriterionEvaluation | undefined,
): CorreccionEntregaItem["categoria"] | null {
  if (!ev || ev.estado === "cumple" || ev.estado === "no_aplica") return null
  const cat = categoriaPresentacionFromEvaluation(ev)
  if (
    cat === "Cumple con observaciones" ||
    cat === "Medianamente cumple" ||
    cat === "No cumple"
  ) {
    return cat
  }
  return null
}

/**
 * Lista ordenada de correcciones de entrega = filas visibles de
 * `sustituciones[]` (C-2026-11-09a: sin filas sintéticas por `agrupado_en`).
 */
export function listCorreccionesEntrega(
  evaluations: readonly CriterionEvaluation[],
  sustituciones: readonly ClaudeSustitucion[],
): CorreccionEntregaItem[] {
  const byId = new Map(evaluations.map((e) => [e.id, e]))
  const sustVisibles = sustituciones.filter((s) => !isMetadataSustitucion(s))
  const sustByCrit = new Map<CriterionId, ClaudeSustitucion[]>()
  for (const s of sustVisibles) {
    const list = sustByCrit.get(s.criterio_id) ?? []
    list.push(s)
    sustByCrit.set(s.criterio_id, list)
  }

  const items: CorreccionEntregaItem[] = []
  const seenIdx = new Map<CriterionId, number>()

  for (const sust of sustVisibles) {
    const ev = byId.get(sust.criterio_id)
    const categoria = catSeveridad(ev)
    if (!categoria) continue
    const totalInGrupo = sustByCrit.get(sust.criterio_id)?.length ?? 1
    const idx = (seenIdx.get(sust.criterio_id) ?? 0) + 1
    seenIdx.set(sust.criterio_id, idx)
    items.push({
      criterioId: sust.criterio_id,
      grupoId: sust.criterio_id,
      indexInGrupo: idx,
      totalInGrupo,
      sust,
      esAgrupado: false,
      categoria,
    })
  }

  return items
}

export function buildDesgloseCorreccionesDatosAuditoria(
  evaluations: CriterionEvaluation[],
  sustituciones: readonly ClaudeSustitucion[],
): DesgloseCorreccionesDatosAuditoria {
  const items = listCorreccionesEntrega(evaluations, sustituciones)

  let correccionesCumpleConObservaciones = 0
  let correccionesMedianamenteCumple = 0
  let correccionesNoCumple = 0
  for (const it of items) {
    if (it.categoria === "Cumple con observaciones") {
      correccionesCumpleConObservaciones += 1
    } else if (it.categoria === "Medianamente cumple") {
      correccionesMedianamenteCumple += 1
    } else {
      correccionesNoCumple += 1
    }
  }

  const countsByGrupo = new Map<CriterionId, number>()
  for (const it of items) {
    countsByGrupo.set(it.grupoId, (countsByGrupo.get(it.grupoId) ?? 0) + 1)
  }

  const byId = new Map(evaluations.map((e) => [e.id, e]))
  const todos: CriterioMultiCorreccion[] = []
  const cumpleConObservaciones: CriterioMultiCorreccion[] = []
  const medianamenteCumple: CriterioMultiCorreccion[] = []
  const noCumple: CriterioMultiCorreccion[] = []

  for (const [grupoId, n] of countsByGrupo) {
    const item = toMulti(grupoId, n)
    if (!item) continue
    todos.push(item)
    const ev = byId.get(grupoId)
    const cat = ev ? categoriaPresentacionFromEvaluation(ev) : null
    if (cat === "Cumple con observaciones") cumpleConObservaciones.push(item)
    else if (cat === "Medianamente cumple") medianamenteCumple.push(item)
    else if (cat === "No cumple") noCumple.push(item)
  }

  return {
    totalCorrecciones: items.length,
    correccionesCumpleConObservaciones,
    correccionesMedianamenteCumple,
    correccionesNoCumple,
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
 * «5» o «8 (Criterio 6: 2 correcciones. Criterio 32: 3 correcciones)»
 * `count` = correcciones del bucket (debe sumar el total al agrupar buckets).
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
