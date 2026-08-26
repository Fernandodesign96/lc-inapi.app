/**
 * Filas para la pestaña Excel «Hitos-Tareas-Criterios»
 * (equivalente tabular a «Resumen por hito» / árbol Hito→Tarea→Criterio en UI/PDF).
 */
import type { CriterionId } from "../../schemas/checklist"
import { criteriosVisiblesParaEntrega } from "../audit-visible-content"
import { ptdHitoTareaPorCriterio } from "../ptd-hito-tarea-por-criterio"
import {
  loadChecklistCriteriaList,
  type ChecklistCriterionEntry,
} from "./mei-checklist-catalog"
import {
  categoriaPresentacionFromEvaluation,
  type MeiCategoriaPresentacion,
} from "./mei-criterio-categoria"
import type { LoadedClarityAudit } from "./mei-audit-loader"

export type HitoTareaCriterioExcelRow = {
  url: string
  hito: number
  tarea: number
  criterio: number
  estado: MeiCategoriaPresentacion
  descripcionHito: string
  descripcionTarea: string
  descripcionCriterio: string
  /** Orden interno (rank META MEI / Clarity). */
  rank: number
  criterioId: string
}

function criterionTextMap(
  root: string,
): Map<CriterionId, ChecklistCriterionEntry> {
  const map = new Map<CriterionId, ChecklistCriterionEntry>()
  for (const entry of loadChecklistCriteriaList(root)) {
    map.set(entry.id, entry)
  }
  return map
}

function descripcionCriterioDe(
  criterioId: CriterionId,
  catalog: Map<CriterionId, ChecklistCriterionEntry>,
): string {
  const entry = catalog.get(criterioId)
  if (!entry) return criterioId
  return entry.criterion
}

/**
 * Una fila por criterio evaluado (LC-* visibles), ordenada por
 * rank URL → hito → tarea → criterio (ordinales de entrega).
 */
export function buildHitosTareasCriteriosRows(
  audits: LoadedClarityAudit[],
  root = process.cwd(),
): HitoTareaCriterioExcelRow[] {
  const catalog = criterionTextMap(root)
  const out: HitoTareaCriterioExcelRow[] = []

  const sortedAudits = [...audits].sort((a, b) => a.rank - b.rank)

  for (const audit of sortedAudits) {
    const evals = criteriosVisiblesParaEntrega(
      audit.bundle.audit.criterios_evaluados,
    )

    const rows: HitoTareaCriterioExcelRow[] = []
    for (const ev of evals) {
      const ptd = ptdHitoTareaPorCriterio(ev.id)
      const ref = ptd.refs[0]
      if (
        !ref ||
        ptd.hitoOrdinal == null ||
        ptd.tareaOrdinal == null ||
        ptd.criterioOrdinal == null
      ) {
        continue
      }

      rows.push({
        url: audit.url,
        hito: ptd.hitoOrdinal,
        tarea: ptd.tareaOrdinal,
        criterio: ptd.criterioOrdinal,
        estado: categoriaPresentacionFromEvaluation(ev),
        descripcionHito: ref.hitoTitulo,
        descripcionTarea: ref.tareaDescripcion,
        descripcionCriterio: descripcionCriterioDe(ev.id, catalog),
        rank: audit.rank,
        criterioId: ev.id,
      })
    }

    rows.sort(
      (a, b) =>
        a.hito - b.hito ||
        a.tarea - b.tarea ||
        a.criterio - b.criterio,
    )
    out.push(...rows)
  }

  return out
}
