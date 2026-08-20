import type { CriterionEvaluation } from "../../schemas/checklist"

/**
 * Etiquetas de presentación MEI / UI de resultado (mismas que
 * `frontend/src/lib/criterio-evaluacion-visual.ts` → `presentacionCriterio`).
 * No son enums del schema: se derivan de `estado` + `severidad`.
 */
export const MEI_CATEGORIA_PRESENTACION = [
  "Cumple",
  "Cumple con observaciones",
  "Medianamente cumple",
  "No cumple",
  "No aplica",
] as const

export type MeiCategoriaPresentacion = (typeof MEI_CATEGORIA_PRESENTACION)[number]

function severidadIncumple(
  ev: Pick<CriterionEvaluation, "severidad">,
): NonNullable<CriterionEvaluation["severidad"]> {
  return ev.severidad ?? "alta"
}

/** Orden de secciones en Excel (Cumple → … → No aplica). */
export function ordenCategoriaPresentacion(cat: MeiCategoriaPresentacion): number {
  return MEI_CATEGORIA_PRESENTACION.indexOf(cat)
}

export function categoriaPresentacionFromEvaluation(
  ev: Pick<CriterionEvaluation, "estado"> &
    Partial<Pick<CriterionEvaluation, "severidad">>,
): MeiCategoriaPresentacion {
  if (ev.estado === "no_aplica") return "No aplica"
  if (ev.estado === "cumple") return "Cumple"
  const sev = severidadIncumple(ev)
  if (sev === "baja") return "Cumple con observaciones"
  if (sev === "media") return "Medianamente cumple"
  return "No cumple"
}
