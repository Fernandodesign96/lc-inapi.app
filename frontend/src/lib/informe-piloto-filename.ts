import type { ClaudeAuditBundle } from "@contracts/claude-audit-pilot"
import type { StrictAuditRecord } from "@contracts/checklist"

import { esUrlHomeInapi } from "@/lib/informe-piloto-format"

/** Slug para descargables: `inapi-cl`, `inapi-cl-marcas`, `tramites-inapi-cl-siac`. */
export function slugFromAuditUrl(url: string): string {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./i, "").replace(/\./g, "-")
    const path = u.pathname
      .replace(/\/$/, "")
      .replace(/^\//, "")
      .replace(/\//g, "-")
      .replace(/[^a-zA-Z0-9._-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
    const slug = path ? `${host}-${path}` : host
    return slug.toLowerCase() || "sin-slug"
  } catch {
    return "url-invalida"
  }
}

/**
 * Fecha de archivo `dd-mm-yyyy` (America/Santiago).
 * Home INAPI: misma fecha forzada que Datos de Auditoría (24-08-2026).
 */
export function fechaArchivoDesdeEvaluacion(
  iso: string,
  url?: string,
): string {
  if (url && esUrlHomeInapi(url)) return "24-08-2026"

  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) {
    const raw = iso.slice(0, 10)
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw)
    if (m) return `${m[3]}-${m[2]}-${m[1]}`
    return "sin-fecha"
  }
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Santiago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d)
  const y = parts.find((p) => p.type === "year")?.value
  const m = parts.find((p) => p.type === "month")?.value
  const day = parts.find((p) => p.type === "day")?.value
  if (y && m && day) return `${day}-${m}-${y}`
  return "sin-fecha"
}

/** Quita caracteres no permitidos en nombres de archivo típicos. */
export function sanitizePdfFilename(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

/**
 * Nombre de descarga: `auditoria-{slug}-{dd-mm-yyyy}.{ext}`
 * Ej.: `auditoria-inapi-cl-24-08-2026.pdf`,
 * `auditoria-tramites-inapi-cl-siac-22-08-2026.xlsx`
 */
export function auditoriaDescargaFilename(
  audit: Pick<StrictAuditRecord, "url" | "fecha_evaluacion">,
  ext: "pdf" | "xlsx",
): string {
  const slug = slugFromAuditUrl(audit.url)
  const fecha = fechaArchivoDesdeEvaluacion(audit.fecha_evaluacion, audit.url)
  return sanitizePdfFilename(`auditoria-${slug}-${fecha}.${ext}`)
}

/** @deprecated Preferir `auditoriaDescargaFilename(audit, "pdf")`. */
export function informePilotoPdfFilename(audit: StrictAuditRecord): string {
  return auditoriaDescargaFilename(audit, "pdf")
}

export function informePilotoPdfFilenameFromBundle(
  bundle: ClaudeAuditBundle,
): string {
  return auditoriaDescargaFilename(bundle.audit, "pdf")
}

/**
 * Valor para header Content-Disposition (C4).
 * filename entre comillas por si queda algún carácter especial.
 */
export function contentDispositionAttachment(filename: string): string {
  const safe = sanitizePdfFilename(filename)
  return `attachment; filename="${safe}"`
}
