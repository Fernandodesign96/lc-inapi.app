import type { ClaudeAuditBundle } from "@contracts/claude-audit-pilot"
import type { StrictAuditRecord } from "@contracts/checklist"

/** Slug legible desde la URL auditada (sin protocolo ni barras problemáticas). */
export function slugFromAuditUrl(url: string): string {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./i, "").replace(/\./g, "-")
    const path = u.pathname
      .replace(/\/$/, "")
      .replace(/^\//, "")
      .replace(/\//g, "-")
    const slug = path ? `${host}-${path}` : host
    return slug.toLowerCase() || "sin-slug"
  } catch {
    return "url-invalida"
  }
}

/** Fecha corta para nombre de archivo (parte calendario del ISO). */
export function fechaArchivoDesdeEvaluacion(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) {
    return iso.slice(0, 10) || "sin-fecha"
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
  if (y && m && day) return `${y}-${m}-${day}`
  return iso.slice(0, 10)
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
 * Nombre sugerido en flujo §8: informe-lc-[slug-url]-[fecha].pdf
 */
export function informePilotoPdfFilename(audit: StrictAuditRecord): string {
  const slug = slugFromAuditUrl(audit.url)
  const fecha = fechaArchivoDesdeEvaluacion(audit.fecha_evaluacion)
  return sanitizePdfFilename(`informe-lc-${slug}_${fecha}.pdf`)
}

export function informePilotoPdfFilenameFromBundle(
  bundle: ClaudeAuditBundle,
): string {
  return informePilotoPdfFilename(bundle.audit)
}

/**
 * Valor para header Content-Disposition (C4).
 * filename entre comillas por si queda algún carácter especial.
 */
export function contentDispositionAttachment(filename: string): string {
  const safe = sanitizePdfFilename(filename)
  return `attachment; filename="${safe}"`
}