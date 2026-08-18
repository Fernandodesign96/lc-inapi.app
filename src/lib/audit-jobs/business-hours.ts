/**
 * Ventana laboral del worker on-demand (contrato audit-jobs / ADR 0011).
 * America/Santiago, lunes–viernes, [08:00, 18:00).
 */

export const AUDIT_JOB_TIMEZONE = "America/Santiago" as const

/** Inclusive. */
export const AUDIT_JOB_WINDOW_START_HOUR = 8

/** Exclusive (18:00 ya está fuera). */
export const AUDIT_JOB_WINDOW_END_HOUR = 18

const WEEKDAY_SHORT = new Set(["Mon", "Tue", "Wed", "Thu", "Fri"])

function santiagoParts(now: Date): { weekday: string; hour: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: AUDIT_JOB_TIMEZONE,
    weekday: "short",
    hour: "numeric",
    hourCycle: "h23",
  }).formatToParts(now)

  const weekday = parts.find((p) => p.type === "weekday")?.value
  const hourRaw = parts.find((p) => p.type === "hour")?.value
  if (!weekday || hourRaw === undefined) {
    throw new Error("No se pudo resolver hora America/Santiago")
  }

  const hour = Number.parseInt(hourRaw, 10)
  if (!Number.isFinite(hour)) {
    throw new Error(`Hora Santiago inválida: ${hourRaw}`)
  }

  return { weekday, hour }
}

/** true si el worker puede reclamar jobs ahora. */
export function isWithinAuditJobHours(now: Date = new Date()): boolean {
  const { weekday, hour } = santiagoParts(now)
  if (!WEEKDAY_SHORT.has(weekday)) return false
  return hour >= AUDIT_JOB_WINDOW_START_HOUR && hour < AUDIT_JOB_WINDOW_END_HOUR
}

export type InitialAuditJobStatus = "queued" | "outside_hours"

export function initialAuditJobStatus(
  now: Date = new Date(),
): InitialAuditJobStatus {
  return isWithinAuditJobHours(now) ? "queued" : "outside_hours"
}
