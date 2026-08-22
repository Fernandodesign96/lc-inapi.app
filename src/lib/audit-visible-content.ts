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
 * `<title>`, `<meta>`, Open Graph y demás capa METADATA no descuentan %;
 * H1 y demás UI visible sí cuentan y se muestran siempre (47 filas en v2.1).
 */
const METADATA_EVIDENCE_RE =
  /(?:\[title\]|<title\b|<\/title>|\bmeta\s+(?:description|keywords|og:|name=)|\[meta\b|<meta\b|html-l-head|head-meta|capa:\s*metadata|\bog:(?:title|description|image)\b|\btwitter:(?:title|description)\b)/iu

/** Evidencia de contenido visible (H1, etc.): no tratar como metadata aunque el texto mencione title/meta. */
const VISIBLE_STRUCTURE_RE =
  /\bH1\b|\bH2\b|\bH3\b|t[ií]tulo\s+principal|encabezado\s+visible|hero\s+principal|\bT\d{3}\b/iu

/**
 * Frases que niegan usar metadata (p. ej. «No se evaluó &lt;title&gt;/&lt;meta&gt;»).
 * Hay que neutralizarlas antes del detector; si no, un cumplido editorial falso positivo
 * convierte E4 (H1) en N/A y lo oculta de la tabla.
 */
const METADATA_DENIAL_RE =
  /no\s+se\s+(?:evalu[oó]|us[oó]|consider[oó]|emple[oó]|tom[oó]\s+en\s+cuenta|analiz[oó])[\s\S]{0,100}?(?:<\/?title\b[^>]*>\s*\/\s*<\/?meta\b[^>]*>|<\/?meta\b[^>]*>\s*\/\s*<\/?title\b[^>]*>|<\/?title\b[^>]*>|<\/?meta\b[^>]*>|\[title\]|\[meta\b|title\s*\/\s*meta|meta\s*\/\s*title|t[ií]tulo\s+de\s+(?:la\s+)?pesta[nñ]a|metadatos?(?:\s+del\s+head)?)/giu

export type AuditContentCapa = "VISIBLE" | "METADATA" | "SISTEMA"

/** Quita cláusulas de negación sobre title/meta para no disparar el detector. */
export function stripMetadataDenialPhrases(text: string): string {
  let out = text
  for (let i = 0; i < 3; i++) {
    const next = out.replace(METADATA_DENIAL_RE, " ")
    if (next === out) break
    out = next
  }
  return out.replace(/\s+/g, " ").trim()
}

export function textLooksLikeMetadataEvidence(
  ...parts: Array<string | undefined | null>
): boolean {
  const blob = parts.filter(Boolean).join("\n")
  if (!blob.trim()) return false
  if (VISIBLE_STRUCTURE_RE.test(blob)) return false
  const normalized = stripMetadataDenialPhrases(blob)
  if (!normalized) return false
  return METADATA_EVIDENCE_RE.test(normalized)
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
  if (linked.length > 0) {
    // Si hay al menos una sustitución VISIBLE (o no-metadata), el criterio es visible.
    if (linked.some((s) => !isMetadataSustitucion(s))) return false
    return true
  }

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
 * Vista de entrega: hallazgos solo-metadata pasan a `no_aplica` (no descuentan %)
 * y se recalcula el resumen. Las **47** filas se conservan para UI/PDF/Excel.
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

/**
 * Filas de criterios para tablas UI/PDF/Excel.
 * Si el informe ya trae `LC-*` (v3.0), se omiten ids A–H legacy mezclados.
 * Informes solo A–H históricos se muestran completos hasta reauditar.
 */
export function criteriosVisiblesParaEntrega(
  evaluations: readonly CriterionEvaluation[],
): CriterionEvaluation[] {
  const hasLc = evaluations.some((e) => String(e.id).startsWith("LC-"))
  if (hasLc) {
    return evaluations.filter((e) => String(e.id).startsWith("LC-"))
  }
  return [...evaluations]
}

export function filterVisibleSustituciones(
  sustituciones: readonly ClaudeSustitucion[] | undefined,
): ClaudeSustitucion[] {
  return (sustituciones ?? []).filter((s) => !isMetadataSustitucion(s))
}
