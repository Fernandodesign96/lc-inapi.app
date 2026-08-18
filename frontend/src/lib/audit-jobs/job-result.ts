import type { AuditJob } from "@contracts/audit-job"

import { CLAUDE_PILOT_URL_ROWS } from "@/lib/claude-audits-launch"
import { CLARITY_AUDIT_LAUNCH_ROWS } from "@/lib/clarity-audits-launch"
import { MEI_COMPLETO_EXPORT_HREF } from "@/lib/mei-calidad-web/export-href"
import { listJobsByStatus } from "@repo/lib/audit-jobs/store"
import { MEI_META_MEI_URLS } from "@repo/lib/mei-export/mei-meta-mei-urls"

export type HistorialEstadoAceptacion =
  | "rechazado"
  | "aceptado_con_observaciones"
  | "aprobado"

export type HistorialEntrada = {
  fecha: string
  auditorNombre: string
  auditId: string
  porcentajeCumplimiento?: number
  estadoAceptacion?: HistorialEstadoAceptacion
}

export function normalizeAuditUrl(url: string): string {
  try {
    const u = new URL(url)
    const path = u.pathname.replace(/\/$/u, "")
    return `${u.protocol}//${u.hostname.toLowerCase()}${path}`
  } catch {
    return url.trim().replace(/\/$/u, "")
  }
}

function fechaSantiagoFromIso(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10)
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Santiago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d)
}

function fechaFromAuditId(auditId: string): string | null {
  const m = auditId.match(/_(\d{4}-\d{2}-\d{2})$/u)
  return m?.[1] ?? null
}

type LaunchMeta = {
  porcentajeLc: number
  estadoAceptacion: HistorialEstadoAceptacion
  fechaEvaluacionIso: string
  evaluadorUid: string
}

function launchMetaByAuditId(auditId: string): LaunchMeta | null {
  for (const row of CLAUDE_PILOT_URL_ROWS) {
    if (row.claudeAuditId === auditId && row.resumenMvp) {
      return row.resumenMvp
    }
  }
  for (const row of CLARITY_AUDIT_LAUNCH_ROWS) {
    if (row.claudeAuditId === auditId && row.resumenMvp) {
      return row.resumenMvp
    }
    for (const v of row.versiones) {
      if (v.id === auditId) return v.resumenMvp
    }
  }
  return null
}

function entradaFromLaunch(
  auditId: string,
  fallbackAuditor: string,
): HistorialEntrada {
  const meta = launchMetaByAuditId(auditId)
  const fecha =
    fechaFromAuditId(auditId) ??
    (meta ? fechaSantiagoFromIso(meta.fechaEvaluacionIso) : "sin-fecha")
  return {
    fecha,
    auditorNombre: meta?.evaluadorUid ?? fallbackAuditor,
    auditId,
    ...(meta
      ? {
          porcentajeCumplimiento: meta.porcentajeLc,
          estadoAceptacion: meta.estadoAceptacion,
        }
      : {}),
  }
}

function entradaFromDoneJob(job: AuditJob): HistorialEntrada | null {
  if (!job.auditId) return null
  const meta = launchMetaByAuditId(job.auditId)
  const fecha = fechaSantiagoFromIso(
    job.finishedAt ?? job.updatedAt ?? job.createdAt,
  )
  return {
    fecha: fechaFromAuditId(job.auditId) ?? fecha,
    auditorNombre: job.auditorNombre,
    auditId: job.auditId,
    ...(meta
      ? {
          porcentajeCumplimiento: meta.porcentajeLc,
          estadoAceptacion: meta.estadoAceptacion,
        }
      : {}),
  }
}

/** Historial por URL: launch cableado + jobs `done` locales. */
export function buildHistorialForJob(
  job: AuditJob,
  root: string,
): { url: string; entradas: HistorialEntrada[] } {
  const target = normalizeAuditUrl(job.url)
  const byId = new Map<string, HistorialEntrada>()

  const pilot = CLAUDE_PILOT_URL_ROWS.find(
    (r) => normalizeAuditUrl(r.url) === target,
  )
  if (pilot?.claudeAuditId) {
    byId.set(
      pilot.claudeAuditId,
      entradaFromLaunch(pilot.claudeAuditId, job.auditorNombre),
    )
    for (const h of pilot.history ?? []) {
      byId.set(h.id, entradaFromLaunch(h.id, job.auditorNombre))
    }
  }

  const clarity = CLARITY_AUDIT_LAUNCH_ROWS.find(
    (r) => normalizeAuditUrl(r.url) === target,
  )
  if (clarity?.claudeAuditId) {
    byId.set(
      clarity.claudeAuditId,
      entradaFromLaunch(clarity.claudeAuditId, job.auditorNombre),
    )
    for (const id of clarity.historyIds) {
      byId.set(id, entradaFromLaunch(id, job.auditorNombre))
    }
  }

  for (const done of listJobsByStatus("done", root)) {
    if (normalizeAuditUrl(done.url) !== target) continue
    const entrada = entradaFromDoneJob(done)
    if (entrada) byId.set(entrada.auditId, entrada)
  }

  if (job.auditId && !byId.has(job.auditId)) {
    const entrada = entradaFromDoneJob(job)
    if (entrada) byId.set(entrada.auditId, entrada)
  }

  const entradas = [...byId.values()].sort((a, b) =>
    b.fecha.localeCompare(a.fecha),
  )

  return { url: job.url, entradas }
}

/** Excel MEI completo si la URL está en la muestra META MEI. */
export function excelPathForAuditUrl(url: string): string | undefined {
  const target = normalizeAuditUrl(url)
  const hit = MEI_META_MEI_URLS.some(
    (row) => normalizeAuditUrl(row.url) === target,
  )
  return hit ? MEI_COMPLETO_EXPORT_HREF : undefined
}

export function buildDescargas(auditId: string, url?: string) {
  const q = encodeURIComponent(auditId)
  const excelPath = url ? excelPathForAuditUrl(url) : undefined
  return {
    resultadoPath: `/auditar/resultado?claudeAudit=${q}`,
    pdfPath: `/api/claude-audits/${q}/export/pdf`,
    ...(excelPath ? { excelPath } : {}),
  }
}
