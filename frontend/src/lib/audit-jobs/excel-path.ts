import { meiUrlExportHref } from "@/lib/mei-calidad-web/export-href"
import { isAvisosSistemasAudit } from "@repo/lib/avisos-correcciones-entrega"

/** Normalización de URL para comparar historial / META MEI (sin Node fs). */
export function normalizeAuditUrl(url: string): string {
  try {
    const u = new URL(url)
    const path = u.pathname.replace(/\/$/u, "")
    return `${u.protocol}//${u.hostname.toLowerCase()}${path}`
  } catch {
    return url.trim().replace(/\/$/u, "")
  }
}

/**
 * Excel de la auditoría: MEI por URL, o correcciones de avisos (8 columnas).
 */
export function excelPathForClaudeAudit(
  claudeAuditId: string | null | undefined,
): string | undefined {
  if (!claudeAuditId) return undefined
  if (isAvisosSistemasAudit(claudeAuditId)) {
    return `/api/claude-audits/${encodeURIComponent(claudeAuditId)}/export/xlsx`
  }
  return meiUrlExportHref(claudeAuditId)
}

/** @deprecated Preferir `excelPathForClaudeAudit(id)`. */
export function excelPathForAuditUrl(): string | undefined {
  return undefined
}
