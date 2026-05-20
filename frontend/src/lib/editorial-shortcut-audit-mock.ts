import {
  buildDemoStrictAudit,
  buildDemoStrictAuditWithCumpleCount,
  type StrictAuditRecord,
} from "@contracts/checklist"

import {
  EDITORIAL_AUDIT_SHORTCUTS,
  type EditorialShortcutPerfil,
} from "@/lib/audit-shortcuts"

/** Criterios en "cumple" por perfil (39 aplicables, sin N/A). */
const CUMPLE_COUNT_BY_PERFIL: Record<EditorialShortcutPerfil, number> = {
  peor: 22,
  intermedio: 28,
  mejor: 36,
}

/** Resumen editorial (campo `observaciones_lc` del contrato). */
const OBSERVACIONES_LC_BY_PERFIL: Record<EditorialShortcutPerfil, string> = {
  peor:
    "Priorizar avisos legales en titulares, reducir deuda de microcopy en alertas y homologar términos con el glosario INAPI antes de una nueva ronda LC.",
  intermedio:
    "Ajustar instrucciones del paso de confirmación, unificar tono institucional en mensajes de éxito y revisar enlaces de ayuda contextual.",
  mejor:
    "Mantener criterios de titulares y enlaces; planificar revisión periódica de novedades sin bloquear publicación.",
}

/**
 * Contenido sugerido para la URL (campo `texto_propuesto`).
 * Mock en texto plano; en una iteración siguiente se puede enriquecer con iconos/markup.
 */
const TEXTO_PROPUESTO_BY_PERFIL: Record<EditorialShortcutPerfil, string> = {
  peor: `(mock) Propuesta de titular principal
• "Notificaciones de marcas — INAPI" (sin siglas crípticas en el H1)
• Subtítulo: "Revisa avisos y plazos en lenguaje claro"

Bloque de alerta (estado: pendiente de lectura)
• Primera línea en voz activa: "Tienes avisos por leer antes del plazo."
• Enlace de ayuda: "Cómo entender tu notificación" (abre glosario)`,

  intermedio: `(mock) Confirmación de presentación de escritos
• Título: "Recibimos tus escritos"
• Cuerpo: "Guardamos tu presentación; te avisaremos si falta un antecedente."

Mensaje de éxito (estado: completado)
• "Puedes descargar el comprobante en PDF desde tu expediente."`,

  mejor: `(mock) Homepage institucional
• H1: "Instituto Nacional de Propiedad Industrial"
• Banda de accesos rápidos con verbos en infinitivo: "Tramitar", "Consultar", "Contactar"

Nota: mock alineado a perfil "mejor"; sin bloquear publicación.`,
}

function canonicalAuditUrl(url: string): string {
  try {
    const u = new URL(url)
    u.hash = ""
    if (u.pathname === "") u.pathname = "/"
    return u.href
  } catch {
    return url.trim()
  }
}

/**
 * Si la URL coincide con un atajo editorial, devuelve auditoría mock alineada al
 * perfil LC; si no, null (usar `buildDemoStrictAudit` genérico).
 */
export function buildStrictAuditForAuditarUrl(
  auditUrl: string,
  textoCapturado: string,
): StrictAuditRecord | null {
  const key = canonicalAuditUrl(auditUrl)
  const shortcut = EDITORIAL_AUDIT_SHORTCUTS.find(
    (s) => canonicalAuditUrl(s.url) === key,
  )
  if (!shortcut) return null

  const cumple = CUMPLE_COUNT_BY_PERFIL[shortcut.perfil]

  return buildDemoStrictAuditWithCumpleCount(cumple, {
    id: `demo_audit_shortcut_${shortcut.perfil}`,
    url: auditUrl,
    texto_capturado: textoCapturado,
    observaciones_lc: OBSERVACIONES_LC_BY_PERFIL[shortcut.perfil],
    texto_propuesto: TEXTO_PROPUESTO_BY_PERFIL[shortcut.perfil],
  })
}

export { buildDemoStrictAudit }