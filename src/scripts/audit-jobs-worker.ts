/**
 * Worker local on-demand (Fase 4).
 *
 * Bucle: dentro de 8–18 America/Santiago → claim → stub §17 → complete.
 * Stub por defecto (no invoca Claude Code). Modo real = ítem posterior / runbook §17.
 *
 * Uso:
 *   AUDIT_JOBS_WORKER_SECRET=… bun run worker:audit-jobs
 *   AUDIT_JOBS_WORKER_SECRET=… bun run worker:audit-jobs -- --once
 *
 * Requiere API en marcha (`bun run dev`) y el mismo secreto que frontend/.env.local.
 */

import { isWithinAuditJobHours } from "../lib/audit-jobs/business-hours"

type ClaimedJob = {
  id: string
  url: string
  auditorNombre: string
  status: string
  claimedAt?: string
}

function env(name: string, fallback?: string): string {
  const v = process.env[name]?.trim()
  if (v) return v
  if (fallback !== undefined) return fallback
  throw new Error(`Falta variable de entorno ${name}`)
}

function envInt(name: string, fallback: number): number {
  const raw = process.env[name]?.trim()
  if (!raw) return fallback
  const n = Number.parseInt(raw, 10)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function slugFromUrl(url: string): string {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./i, "").replace(/\./g, "-")
    const path = u.pathname
      .replace(/\/$/u, "")
      .replace(/^\//u, "")
      .replace(/\//gu, "-")
    const slug = path ? `${host}-${path}` : host
    return slug.toLowerCase().slice(0, 80) || "url"
  } catch {
    return "url-invalida"
  }
}

function stubAuditId(url: string, now = new Date()): string {
  const fecha = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Santiago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now)
  return `stub-${slugFromUrl(url)}_${fecha}`
}

function log(msg: string, extra?: unknown): void {
  const ts = new Date().toISOString()
  if (extra !== undefined) {
    console.log(`[worker ${ts}] ${msg}`, extra)
  } else {
    console.log(`[worker ${ts}] ${msg}`)
  }
}

async function claimJob(
  baseUrl: string,
  secret: string,
  workerId: string,
): Promise<ClaimedJob | null> {
  const res = await fetch(`${baseUrl}/api/audit-jobs/claim`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Worker-Secret": secret,
    },
    body: JSON.stringify({ workerId }),
  })

  if (res.status === 204) return null
  if (res.status === 401 || res.status === 503) {
    const body = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(
      `Auth claim HTTP ${res.status}: ${body.error ?? res.statusText}`,
    )
  }
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Claim HTTP ${res.status}: ${text.slice(0, 200)}`)
  }
  return (await res.json()) as ClaimedJob
}

async function completeOk(
  baseUrl: string,
  secret: string,
  id: string,
  auditId: string,
): Promise<void> {
  const res = await fetch(`${baseUrl}/api/audit-jobs/${id}/complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Worker-Secret": secret,
    },
    body: JSON.stringify({ ok: true, auditId }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Complete HTTP ${res.status}: ${text.slice(0, 200)}`)
  }
}

async function completeFail(
  baseUrl: string,
  secret: string,
  id: string,
  errorMessage: string,
): Promise<void> {
  const res = await fetch(`${baseUrl}/api/audit-jobs/${id}/complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Worker-Secret": secret,
    },
    body: JSON.stringify({ ok: false, errorMessage }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Complete fail HTTP ${res.status}: ${text.slice(0, 200)}`)
  }
}

/**
 * Stub: no Claude Code. Marca done con auditId provisional.
 * El JSON canónico real llega cuando se cablee §17 (modo futuro).
 */
async function runStubAudit(job: ClaimedJob): Promise<string> {
  log(`Stub §17 para ${job.url} (auditor: ${job.auditorNombre})`)
  await sleep(500)
  return stubAuditId(job.url)
}

async function processOne(
  baseUrl: string,
  secret: string,
  workerId: string,
  mode: string,
): Promise<boolean> {
  const job = await claimJob(baseUrl, secret, workerId)
  if (!job) {
    log("Sin jobs en cola (204)")
    return false
  }

  log(`Reclamado ${job.id}`, { url: job.url })

  try {
    if (mode !== "stub") {
      throw new Error(
        `Modo "${mode}" no implementado aún; usa AUDIT_JOBS_WORKER_MODE=stub`,
      )
    }
    const auditId = await runStubAudit(job)
    await completeOk(baseUrl, secret, job.id, auditId)
    log(`Completado stub ${job.id} → ${auditId}`)
  } catch (e) {
    const message =
      e instanceof Error ? e.message.slice(0, 400) : "Error desconocido en worker"
    log(`Fallo job ${job.id}: ${message}`)
    try {
      await completeFail(baseUrl, secret, job.id, message)
    } catch (completeErr) {
      log("No se pudo marcar failed", completeErr)
    }
  }

  return true
}

async function main(): Promise<void> {
  const once = process.argv.includes("--once")
  const baseUrl = env(
    "AUDIT_JOBS_API_BASE",
    "http://127.0.0.1:3000",
  ).replace(/\/$/u, "")
  const secret = env("AUDIT_JOBS_WORKER_SECRET")
  const workerId = env("AUDIT_JOBS_WORKER_ID", "pc-local")
  const mode = env("AUDIT_JOBS_WORKER_MODE", "stub")
  const pollMs = envInt("AUDIT_JOBS_POLL_MS", 30_000)
  const outsideMs = envInt("AUDIT_JOBS_OUTSIDE_MS", 60_000)

  const ignoreHours =
    process.env.AUDIT_JOBS_WORKER_IGNORE_HOURS?.trim() === "1"

  log("Inicio worker", {
    baseUrl,
    workerId,
    mode,
    once,
    pollMs,
    outsideMs,
    ignoreHours,
  })

  for (;;) {
    if (!ignoreHours && !isWithinAuditJobHours()) {
      log("Fuera de horario laboral; durmiendo…")
      if (once) {
        log("--once fuera de horario: salir sin claim")
        return
      }
      await sleep(outsideMs)
      continue
    }

    try {
      const worked = await processOne(baseUrl, secret, workerId, mode)
      if (once) return
      await sleep(worked ? 2_000 : pollMs)
    } catch (e) {
      log("Error de ciclo", e instanceof Error ? e.message : e)
      if (once) throw e
      await sleep(pollMs)
    }
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
