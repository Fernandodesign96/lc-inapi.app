import type {
  ClaudeAuditBundle,
  ClaudeSustitucion,
  ObservacionesLcPorSeveridad,
} from "../schemas/claude-audit-pilot"
import {
  summarizeEvaluations,
  type CriterionEvaluation,
  type StrictAuditRecord,
} from "../schemas/checklist"

/**
 * Alcance de entrega: solo contenido **visible en pantalla** para el ciudadano.
 * `<title>`, `<meta>`, Open Graph y demás capa METADATA quedan fuera de
 * criterios, UI, PDF y Excel (filtro de presentación + regla operativa Claude).
 */
const METADATA_EVIDENCE_RE =
  /(?:\[title\]|<title\b|<\/title>|\bmeta\s+(?:description|keywords|og:|name=)|\[meta\b|<meta\b|html-l-head|head-meta|capa:\s*metadata|\bog:(?:title|description|image)\b|\btwitter:(?:title|description)\b)/iu

export type AuditContentCapa = "VISIBLE" | "METADATA" | "SISTEMA"

export function textLooksLikeMetadataEvidence(
  ...parts: Array<string | undefined | null>
): boolean {
  const blob = parts.filter(Boolean).join("\n")
  if (!blob.trim()) return false
  return METADATA_EVIDENCE_RE.test(blob)
}

export function isMetadataSustitucion(s: ClaudeSustitucion): boolean {
  if (s.capa === "METADATA") return true
  if (s.capa === "VISIBLE") return false
  return textLooksLikeMetadataEvidence(
    s.linea,
    s.html_linea_aprox,
    s.original,
    s.propuesto,
    s.motivo,
    s.ubicacion_pantalla,
  )
}

export function isMetadataCriterionEvaluation(
  ev: CriterionEvaluation,
  sustituciones: readonly ClaudeSustitucion[] = [],
): boolean {
  if (ev.capa === "METADATA") return true
  if (ev.capa === "VISIBLE") return false

  const linked = sustituciones.filter((s) => s.criterio_id === ev.id)
  if (linked.some((s) => isMetadataSustitucion(s))) return true

  return textLooksLikeMetadataEvidence(ev.cita_textual, ev.comentario)
}

function filterObservaciones(
  obs: ObservacionesLcPorSeveridad | undefined,
): ObservacionesLcPorSeveridad | undefined {
  if (!obs) return undefined
  const keep = (items: string[]) =>
    items.filter((t) => !textLooksLikeMetadataEvidence(t))
  return {
    hallazgos_prioridad_alta: keep(obs.hallazgos_prioridad_alta),
    hallazgos_prioridad_media: keep(obs.hallazgos_prioridad_media),
    hallazgos_prioridad_baja: keep(obs.hallazgos_prioridad_baja),
  }
}

export const METADATA_DELIVERY_EXCLUSION_MARK =
  "[excluido entrega: metadata HTML, no visible en pantalla]"

/**
 * Vista de entrega: excluye hallazgos de metadata y recalcula % / estado
 * tratando esos criterios como `no_aplica` (no cuentan en aplicables).
 * No muta el JSON en disco.
 */
export function bundleForVisibleDelivery(
  bundle: ClaudeAuditBundle,
): ClaudeAuditBundle {
  const sustAll = bundle.pilot.sustituciones ?? []
  const sustituciones = sustAll.filter((s) => !isMetadataSustitucion(s))

  const criterios_evaluados: CriterionEvaluation[] =
    bundle.audit.criterios_evaluados.map((ev) => {
      if (!isMetadataCriterionEvaluation(ev, sustAll)) return ev
      return {
        ...ev,
        estado: "no_aplica" as const,
        comentario: ev.comentario
          ? `${ev.comentario} ${METADATA_DELIVERY_EXCLUSION_MARK}`
          : `Excluido de la entrega: evidencia solo en metadata HTML (no visible en pantalla). ${METADATA_DELIVERY_EXCLUSION_MARK}`,
        severidad: undefined,
      }
    })

  const summary = summarizeEvaluations(criterios_evaluados)
  const audit: StrictAuditRecord = {
    ...bundle.audit,
    criterios_evaluados,
    ...summary,
  }

  return {
    audit,
    pilot: {
      ...bundle.pilot,
      sustituciones,
      observaciones_lc_por_severidad: filterObservaciones(
        bundle.pilot.observaciones_lc_por_severidad,
      ),
    },
    clarity: bundle.clarity,
  }
}

/** Filas de criterios para tablas UI/PDF (sin las marcadas como metadata excluida). */
export function criteriosVisiblesParaEntrega(
  evaluations: readonly CriterionEvaluation[],
): CriterionEvaluation[] {
  return evaluations.filter(
    (ev) => !ev.comentario?.includes(METADATA_DELIVERY_EXCLUSION_MARK),
  )
}

export function filterVisibleSustituciones(
  sustituciones: readonly ClaudeSustitucion[] | undefined,
): ClaudeSustitucion[] {
  return (sustituciones ?? []).filter((s) => !isMetadataSustitucion(s))
}
