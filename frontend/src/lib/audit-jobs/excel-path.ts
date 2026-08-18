import { MEI_COMPLETO_EXPORT_HREF } from "@/lib/mei-calidad-web/export-href"
import { MEI_META_MEI_URLS } from "@repo/lib/mei-export/mei-meta-mei-urls"

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

/** Excel MEI completo si la URL está en la muestra META MEI. */
export function excelPathForAuditUrl(url: string): string | undefined {
  const target = normalizeAuditUrl(url)
  const hit = MEI_META_MEI_URLS.some(
    (row) => normalizeAuditUrl(row.url) === target,
  )
  return hit ? MEI_COMPLETO_EXPORT_HREF : undefined
}
