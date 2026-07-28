export function meiHitoExportHref(excelHitoId: string): string {
  return `/api/mei-calidad-web/export/${encodeURIComponent(excelHitoId)}/xlsx`
}

export const MEI_COMPLETO_EXPORT_HREF =
  "/api/mei-calidad-web/export/completo.xlsx"

export function meiXlsxFilename(hitoId?: string): string {
  const fecha = new Date().toISOString().slice(0, 10)
  const suffix = hitoId ? `_${hitoId}` : ""
  return `entrega-mei-calidad-web_${fecha}${suffix}.xlsx`
}
