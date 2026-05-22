import type { CriterionEvaluation } from "@contracts/checklist"

import { pastillaSeveridadLabel, type PastillaSeveridadVisual } from "@/lib/criterio-evaluacion-visual"

/** Primera letra del id de criterio (p. ej. A de A1). */
export function letraTipoCriterio(id: string): string {
  const m = /^[A-Za-z]/.exec(id.trim())
  return m ? m[0].toUpperCase() : "—"
}

export type FiltroEstadoCriterioVisual =
  | "todos"
  | "cumple"
  | "no_aplica"
  | "no_cumple"
  | "medianamente"
  | "cumple_observaciones"

export type FiltroSeveridadPastilla = "todos" | PastillaSeveridadVisual

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

export function matchesSeveridadPastilla(
  row: CriterionEvaluation,
  filtro: FiltroSeveridadPastilla,
): boolean {
  if (filtro === "todos") return true
  return pastillaSeveridadLabel(row) === filtro
}

export function matchesLetraTipo(
  row: CriterionEvaluation,
  letra: "todas" | string,
): boolean {
  if (letra === "todas") return true
  return letraTipoCriterio(row.id) === letra
}

export function letrasTipoDisponibles(rows: CriterionEvaluation[]): string[] {
  const set = new Set<string>()
  for (const row of rows) {
    const L = letraTipoCriterio(row.id)
    if (L !== "—") set.add(L)
  }
  return [...set].sort((a, b) => a.localeCompare(b, "es"))
}
