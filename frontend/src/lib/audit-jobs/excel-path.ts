import { meiUrlExportHref } from "@/lib/mei-calidad-web/export-href"

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
 * Excel MEI de **esa URL** (no el workbook de las 10).
 * Requiere `claudeAuditId` cableado.
 */
export function excelPathForClaudeAudit(
  claudeAuditId: string | null | undefined,
): string | undefined {
  if (!claudeAuditId) return undefined
  return meiUrlExportHref(claudeAuditId)
}

/** @deprecated Preferir `excelPathForClaudeAudit(id)`. */
export function excelPathForAuditUrl(): string | undefined {
  return undefined
}
