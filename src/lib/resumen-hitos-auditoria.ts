/**
 * Resumen de cumplimiento por hito PTD (UI · PDF).
 * Categorías MEI: Cumple / Cumple con observaciones / Medianamente cumple /
 * No cumple / No aplica.
 */
import type { CriterionEvaluation } from "../schemas/checklist"
import { categoriaPresentacionFromEvaluation } from "./mei-export/mei-criterio-categoria"
import { ptdHitoTareaPorCriterio } from "./ptd-hito-tarea-por-criterio"

export type ResumenHitoAuditoria = {
  hitoId: number
  /** Título del hito (sin prefijo «Hito:»). */
  hitoTitulo: string
  checklist: number
  cumple: number
  cumpleConObservaciones: number
  medianamenteCumple: number
  noCumple: number
  noAplica: number
  /** Entero 0–100: Cumple / Checklist */
  pctCumple: number
}

export function buildResumenHitosAuditoria(
  evaluations: CriterionEvaluation[],
): ResumenHitoAuditoria[] {
  const byHito = new Map<
    number,
    {
      titulo: string
      checklist: number
      cumple: number
      cumpleConObservaciones: number
      medianamenteCumple: number
      noCumple: number
      noAplica: number
    }
  >()

  for (const row of evaluations) {
    const ref = ptdHitoTareaPorCriterio(row.id).refs[0]
    if (!ref) continue

    let g = byHito.get(ref.hitoId)
    if (!g) {
      g = {
        titulo: ref.hitoTitulo,
        checklist: 0,
        cumple: 0,
        cumpleConObservaciones: 0,
        medianamenteCumple: 0,
        noCumple: 0,
        noAplica: 0,
      }
      byHito.set(ref.hitoId, g)
    }

    g.checklist += 1
    const cat = categoriaPresentacionFromEvaluation(row)
    if (cat === "Cumple") g.cumple += 1
    else if (cat === "Cumple con observaciones") g.cumpleConObservaciones += 1
    else if (cat === "Medianamente cumple") g.medianamenteCumple += 1
    else if (cat === "No cumple") g.noCumple += 1
    else if (cat === "No aplica") g.noAplica += 1
  }

  return [...byHito.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([hitoId, g]) => ({
      hitoId,
      hitoTitulo: g.titulo,
      checklist: g.checklist,
      cumple: g.cumple,
      cumpleConObservaciones: g.cumpleConObservaciones,
      medianamenteCumple: g.medianamenteCumple,
      noCumple: g.noCumple,
      noAplica: g.noAplica,
      pctCumple:
        g.checklist === 0
          ? 0
          : Math.round((g.cumple / g.checklist) * 100),
    }))
}

/** Valor tras la etiqueta «Checklist 3.0:» en Datos de Auditoría. */
export const CHECKLIST_DATOS_AUDITORIA_VALOR = "51 Criterios - 12 Hitos"

/** Línea completa (legacy / textos planos). */
export const CHECKLIST_DATOS_AUDITORIA_LABEL = `Checklist 3.0: ${CHECKLIST_DATOS_AUDITORIA_VALOR}`
