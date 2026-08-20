import { MEI_META_MEI_URLS } from "@repo/lib/mei-export/mei-meta-mei-urls"

import { metaMeiAuditReadyForUi } from "@/lib/mei-meta-mei-launch"

export function meiHitoExportHref(excelHitoId: string): string {
  return `/api/mei-calidad-web/export/${encodeURIComponent(excelHitoId)}/xlsx`
}

export const MEI_COMPLETO_EXPORT_HREF =
  "/api/mei-calidad-web/export/completo.xlsx"

/** Excel MEI de una sola URL (resultado de auditoría). */
export function meiUrlExportHref(auditId: string): string {
  return `/api/mei-calidad-web/export/url/${encodeURIComponent(auditId)}/xlsx`
}

export function meiXlsxFilename(hitoId?: string): string {
  const fecha = new Date().toISOString().slice(0, 10)
  const suffix = hitoId ? `_${hitoId}` : ""
  return `entrega-mei-calidad-web_${fecha}${suffix}.xlsx`
}

export function meiUrlXlsxFilename(auditId: string): string {
  const fecha = new Date().toISOString().slice(0, 10)
  const safe = auditId.replace(/[^\w.-]+/g, "_")
  return `entrega-mei-url_${safe}_${fecha}.xlsx`
}

/** Las 10 META MEI tienen auditoría v2.1 lista (sin filas «En proceso»). */
export function metaMeiCompletoExcelReady(): boolean {
  return MEI_META_MEI_URLS.every(
    (u) => !u.reauditoriaEnProceso && metaMeiAuditReadyForUi(u.auditId),
  )
}
