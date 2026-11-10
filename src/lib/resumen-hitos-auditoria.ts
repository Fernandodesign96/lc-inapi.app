/**
 * Resumen de cumplimiento por hito PTD (UI · PDF).
 * Checklist / Cumple / No aplica: criterios.
 * Cumple con observaciones / Medianamente / No cumple: **correcciones**
 * (sustituciones + agrupados), para que la suma entre hitos coincida con
 * el total de correcciones de Datos de Auditoría.
 * Numeración de entrega: Hito 1…N (orden id PTD ascendente).
 */
import type { CriterionEvaluation } from "../schemas/checklist"
import type { ClaudeSustitucion } from "../schemas/claude-audit-pilot"
import { listCorreccionesEntrega } from "./desglose-correcciones-datos-auditoria"
import { categoriaPresentacionFromEvaluation } from "./mei-export/mei-criterio-categoria"
import { ptdHitoTareaPorCriterio } from "./ptd-hito-tarea-por-criterio"

export type ResumenHitoAuditoria = {
  /** Id OpenProject (interno; orden y filtros). */
  hitoId: number
  /** 1…N en entrega (menor id PTD → mayor). */
  hitoOrdinal: number
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
  sustituciones: readonly ClaudeSustitucion[] = [],
): ResumenHitoAuditoria[] {
  const byHito = new Map<
    number,
    {
      titulo: string
      ordinal: number
      checklist: number
      cumple: number
      cumpleConObservaciones: number
      medianamenteCumple: number
      noCumple: number
      noAplica: number
    }
  >()

  function ensure(hitoId: number, titulo: string, ordinal: number) {
    let g = byHito.get(hitoId)
    if (!g) {
      g = {
        titulo,
        ordinal,
        checklist: 0,
        cumple: 0,
        cumpleConObservaciones: 0,
        medianamenteCumple: 0,
        noCumple: 0,
        noAplica: 0,
      }
      byHito.set(hitoId, g)
    }
    return g
  }

  for (const row of evaluations) {
    const labels = ptdHitoTareaPorCriterio(row.id)
    const ref = labels.refs[0]
    if (!ref) continue

    const g = ensure(ref.hitoId, ref.hitoTitulo, labels.hitoOrdinal ?? 0)
    g.checklist += 1
    // Misma regla que summarizeEvaluations: agrupado_en no descuenta %.
    if (row.agrupado_en) {
      g.cumple += 1
      continue
    }
    const cat = categoriaPresentacionFromEvaluation(row)
    if (cat === "Cumple") g.cumple += 1
    else if (cat === "No aplica") g.noAplica += 1
    else if (
      cat === "Cumple con observaciones" ||
      cat === "Medianamente cumple" ||
      cat === "No cumple"
    ) {
      // Las columnas de severidad se rellenan con correcciones más abajo.
    }
  }

  const correcciones = listCorreccionesEntrega(evaluations, sustituciones)
  if (correcciones.length > 0) {
    for (const it of correcciones) {
      const labels = ptdHitoTareaPorCriterio(it.criterioId)
      const ref = labels.refs[0]
      if (!ref) continue
      const g = ensure(ref.hitoId, ref.hitoTitulo, labels.hitoOrdinal ?? 0)
      if (it.categoria === "Cumple con observaciones") {
        g.cumpleConObservaciones += 1
      } else if (it.categoria === "Medianamente cumple") {
        g.medianamenteCumple += 1
      } else if (it.categoria === "No cumple") {
        g.noCumple += 1
      }
    }
  } else {
    // Sin sustituciones (p. ej. demos): buckets = criterios incumplidos.
    for (const row of evaluations) {
      if (row.agrupado_en) continue
      const labels = ptdHitoTareaPorCriterio(row.id)
      const ref = labels.refs[0]
      if (!ref) continue
      const g = ensure(ref.hitoId, ref.hitoTitulo, labels.hitoOrdinal ?? 0)
      const cat = categoriaPresentacionFromEvaluation(row)
      if (cat === "Cumple con observaciones") g.cumpleConObservaciones += 1
      else if (cat === "Medianamente cumple") g.medianamenteCumple += 1
      else if (cat === "No cumple") g.noCumple += 1
    }
  }

  return [...byHito.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([hitoId, g]) => ({
      hitoId,
      hitoOrdinal: g.ordinal,
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

/** Conteos globales de presentación MEI (Datos de Auditoría · UI · PDF). */
export type ConteoCategoriasPresentacion = {
  cumple: number
  cumpleConObservaciones: number
  medianamenteCumple: number
  noCumple: number
  noAplica: number
}

export function conteoCategoriasPresentacion(
  evaluations: CriterionEvaluation[],
): ConteoCategoriasPresentacion {
  const c: ConteoCategoriasPresentacion = {
    cumple: 0,
    cumpleConObservaciones: 0,
    medianamenteCumple: 0,
    noCumple: 0,
    noAplica: 0,
  }
  for (const row of evaluations) {
    if (row.agrupado_en) {
      c.cumple += 1
      continue
    }
    const cat = categoriaPresentacionFromEvaluation(row)
    if (cat === "Cumple") c.cumple += 1
    else if (cat === "Cumple con observaciones") c.cumpleConObservaciones += 1
    else if (cat === "Medianamente cumple") c.medianamenteCumple += 1
    else if (cat === "No cumple") c.noCumple += 1
    else if (cat === "No aplica") c.noAplica += 1
  }
  return c
}

/** Valor tras la etiqueta «Checklist 3.0:» en Datos de Auditoría. */
export const CHECKLIST_DATOS_AUDITORIA_VALOR = "51 Criterios - 12 Hitos"

/** Línea completa (legacy / textos planos). */
export const CHECKLIST_DATOS_AUDITORIA_LABEL = `Checklist 3.0: ${CHECKLIST_DATOS_AUDITORIA_VALOR}`
