import type { CriterionEvaluation } from "@contracts/checklist"

import { formatSeccionTitulo } from "@/lib/checklist-criterion-catalog"
import { ptdHitoTareaPorCriterio } from "@repo/lib/ptd-hito-tarea-por-criterio"

export type FiltroEstadoCriterioVisual =
  | "todos"
  | "cumple"
  | "no_aplica"
  | "no_cumple"
  | "medianamente"
  | "cumple_observaciones"

export function matchesEstadoCriterioVisual(
  row: CriterionEvaluation,
  filtro: FiltroEstadoCriterioVisual,
): boolean {
  if (filtro === "todos") return true
  if (filtro === "cumple") return row.estado === "cumple"
  if (filtro === "no_aplica") return row.estado === "no_aplica"
  if (row.estado !== "incumple") return false
  const sev = row.severidad ?? "alta"
  if (filtro === "no_cumple") return sev === "alta"
  if (filtro === "medianamente") return sev === "media"
  if (filtro === "cumple_observaciones") return sev === "baja"
  return false
}

export function matchesHitoId(
  row: CriterionEvaluation,
  hitoId: "todos" | number,
): boolean {
  if (hitoId === "todos") return true
  return ptdHitoTareaPorCriterio(row.id).refs[0]?.hitoId === hitoId
}

export function matchesTareaId(
  row: CriterionEvaluation,
  tareaId: "todos" | number,
): boolean {
  if (tareaId === "todos") return true
  return ptdHitoTareaPorCriterio(row.id).refs[0]?.tareaId === tareaId
}

export function matchesCriterioId(
  row: CriterionEvaluation,
  criterioId: "todos" | string,
): boolean {
  if (criterioId === "todos") return true
  return row.id === criterioId
}

export function matchesInstrumento(
  row: CriterionEvaluation,
  instrumento: "todos" | string,
): boolean {
  if (instrumento === "todos") return true
  return formatSeccionTitulo(row.id) === instrumento
}

export type OpcionHitoFiltro = { id: number; label: string }
export type OpcionTareaFiltro = { id: number; label: string }

export function opcionesHitoDisponibles(
  rows: CriterionEvaluation[],
): OpcionHitoFiltro[] {
  const map = new Map<number, { ordinal: number; titulo: string }>()
  for (const row of rows) {
    const labels = ptdHitoTareaPorCriterio(row.id)
    const ref = labels.refs[0]
    if (!ref || labels.hitoOrdinal == null) continue
    if (!map.has(ref.hitoId)) {
      map.set(ref.hitoId, {
        ordinal: labels.hitoOrdinal,
        titulo: ref.hitoTitulo,
      })
    }
  }
  return [...map.entries()]
    .sort((a, b) => a[1].ordinal - b[1].ordinal)
    .map(([id, v]) => ({
      id,
      label: `Hito ${v.ordinal} — ${v.titulo}`,
    }))
}

export function opcionesTareaDisponibles(
  rows: CriterionEvaluation[],
  hitoId: "todos" | number = "todos",
): OpcionTareaFiltro[] {
  const map = new Map<number, { ordinal: number; desc: string }>()
  for (const row of rows) {
    const labels = ptdHitoTareaPorCriterio(row.id)
    const ref = labels.refs[0]
    if (!ref || labels.tareaOrdinal == null) continue
    if (hitoId !== "todos" && ref.hitoId !== hitoId) continue
    if (!map.has(ref.tareaId)) {
      map.set(ref.tareaId, {
        ordinal: labels.tareaOrdinal,
        desc: ref.tareaDescripcion,
      })
    }
  }
  return [...map.entries()]
    .sort((a, b) => a[1].ordinal - b[1].ordinal)
    .map(([id, v]) => ({
      id,
      label: `Tarea ${v.ordinal} — ${v.desc}`,
    }))
}

export function opcionesCriterioIds(
  rows: CriterionEvaluation[],
): string[] {
  return [...new Set(rows.map((r) => r.id))].sort((a, b) =>
    a.localeCompare(b, "es"),
  )
}

export function opcionesInstrumentoDisponibles(
  rows: CriterionEvaluation[],
): string[] {
  const set = new Set<string>()
  for (const row of rows) {
    const t = formatSeccionTitulo(row.id)
    if (t && t !== "—") set.add(t)
  }
  return [...set].sort((a, b) => a.localeCompare(b, "es"))
}

/** @deprecated Preferir filtros por hito/tarea/criterio/instrumento. */
export function letraTipoCriterio(id: string): string {
  const m = /^[A-Za-z]/.exec(id.trim())
  return m ? m[0].toUpperCase() : "—"
}

/** @deprecated */
export function matchesLetraTipo(
  row: CriterionEvaluation,
  letra: "todas" | string,
): boolean {
  if (letra === "todas") return true
  return letraTipoCriterio(row.id) === letra
}

/** @deprecated */
export function letrasTipoDisponibles(rows: CriterionEvaluation[]): string[] {
  const set = new Set<string>()
  for (const row of rows) {
    const L = letraTipoCriterio(row.id)
    if (L !== "—") set.add(L)
  }
  return [...set].sort((a, b) => a.localeCompare(b, "es"))
}
