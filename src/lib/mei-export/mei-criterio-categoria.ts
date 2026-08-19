import type { CriterionEvaluation } from "../../schemas/checklist"

/**
 * Etiquetas Bernarda / UI de resultado (mismas que
 * `frontend/src/lib/criterio-evaluacion-visual.ts` → `presentacionCriterio`).
 * No son enums del schema: se derivan de `estado` + `severidad`.
 */
export const MEI_CATEGORIA_BERNARDA = [
  "Cumple",
  "Cumple con observaciones",
  "Medianamente cumple",
  "No cumple",
  "No aplica",
] as const

export type MeiCategoriaBernarda = (typeof MEI_CATEGORIA_BERNARDA)[number]

function severidadIncumple(
  ev: Pick<CriterionEvaluation, "severidad">,
): NonNullable<CriterionEvaluation["severidad"]> {
  return ev.severidad ?? "alta"
}

/** Orden de secciones en Excel (Cumple → … → No aplica). */
export function ordenCategoriaBernarda(cat: MeiCategoriaBernarda): number {
  return MEI_CATEGORIA_BERNARDA.indexOf(cat)
}

export function categoriaBernardaFromEvaluation(
  ev: Pick<CriterionEvaluation, "estado"> &
    Partial<Pick<CriterionEvaluation, "severidad">>,
): MeiCategoriaBernarda {
  if (ev.estado === "no_aplica") return "No aplica"
  if (ev.estado === "cumple") return "Cumple"
  const sev = severidadIncumple(ev)
  if (sev === "baja") return "Cumple con observaciones"
  if (sev === "media") return "Medianamente cumple"
  return "No cumple"
}
