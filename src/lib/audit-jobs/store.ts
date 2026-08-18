import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { randomUUID } from "node:crypto"

import {
  parseAuditJob,
  type AuditJob,
  type AuditJobStatus,
  type CreateAuditJobInput,
} from "../../schemas/audit-job"

const JOBS_REL = "data/jobs"

/** Raíz del monorepo: `LC_REPO_ROOT` o tres niveles arriba de este archivo. */
export function defaultRepoRoot(): string {
  const fromEnv = process.env.LC_REPO_ROOT?.trim()
  if (fromEnv) return fromEnv

  const here = dirname(fileURLToPath(import.meta.url))
  return join(here, "../../..")
}

export function jobsDir(root = defaultRepoRoot()): string {
  return join(root, JOBS_REL)
}

export function ensureJobsDir(root = defaultRepoRoot()): string {
  const dir = jobsDir(root)
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
  return dir
}

function jobPath(id: string, root = defaultRepoRoot()): string {
  return join(jobsDir(root), `${id}.json`)
}

export function writeJob(job: AuditJob, root = defaultRepoRoot()): void {
  parseAuditJob(job)
  ensureJobsDir(root)
  writeFileSync(jobPath(job.id, root), `${JSON.stringify(job, null, 2)}\n`, "utf8")
}

export function readJob(
  id: string,
  root = defaultRepoRoot(),
): AuditJob | null {
  const path = jobPath(id, root)
  if (!existsSync(path)) return null
  const raw = JSON.parse(readFileSync(path, "utf8")) as unknown
  return parseAuditJob(raw)
}

export function listJobs(root = defaultRepoRoot()): AuditJob[] {
  const dir = ensureJobsDir(root)
  const files = readdirSync(dir).filter(
    (name) => name.endsWith(".json") && !name.startsWith("."),
  )
  const jobs: AuditJob[] = []
  for (const file of files) {
    const id = file.replace(/\.json$/u, "")
    const job = readJob(id, root)
    if (job) jobs.push(job)
  }
  return jobs.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function listJobsByStatus(
  status: AuditJobStatus,
  root = defaultRepoRoot(),
): AuditJob[] {
  return listJobs(root).filter((job) => job.status === status)
}

export type AuditJobPatch = Partial<
  Omit<AuditJob, "id" | "createdAt" | "timezone">
>

export function updateJob(
  id: string,
  patch: AuditJobPatch,
  root = defaultRepoRoot(),
): AuditJob {
  const current = readJob(id, root)
  if (!current) {
    throw new Error(`Job no encontrado: ${id}`)
  }
  const next = parseAuditJob({
    ...current,
    ...patch,
    id: current.id,
    createdAt: current.createdAt,
    timezone: current.timezone,
    updatedAt: new Date().toISOString(),
  })
  writeJob(next, root)
  return next
}

export function createJob(
  input: CreateAuditJobInput,
  root = defaultRepoRoot(),
): AuditJob {
  const now = new Date().toISOString()
  const job = parseAuditJob({
    id: randomUUID(),
    url: input.url,
    auditorNombre: input.auditorNombre.trim(),
    status: input.status ?? "queued",
    createdAt: now,
    updatedAt: now,
    timezone: "America/Santiago",
  })
  writeJob(job, root)
  return job
}

/** Promueve `outside_hours` → `queued` (ventana laboral / claim). */
export function promoteOutsideHoursToQueued(
  root = defaultRepoRoot(),
): AuditJob[] {
  const promoted: AuditJob[] = []
  for (const job of listJobsByStatus("outside_hours", root)) {
    promoted.push(updateJob(job.id, { status: "queued" }, root))
  }
  return promoted
}

/**
 * Reclama el job `queued` más antiguo → `running`.
 * MVP un worker; no hay candado de disco.
 */
export function claimNextQueuedJob(
  options: { workerId?: string; root?: string } = {},
): AuditJob | null {
  const root = options.root ?? defaultRepoRoot()
  const queued = listJobsByStatus("queued", root).sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt),
  )
  const next = queued[0]
  if (!next) return null

  const claimedAt = new Date().toISOString()
  return updateJob(
    next.id,
    {
      status: "running",
      claimedAt,
      workerId: options.workerId?.trim() || undefined,
    },
    root,
  )
}

export function completeJobSuccess(
  id: string,
  auditId: string,
  root = defaultRepoRoot(),
): AuditJob {
  const current = readJob(id, root)
  if (!current) throw new JobNotFoundError(id)
  if (current.status !== "running") {
    throw new JobConflictError(
      id,
      `El job no está en curso (estado: ${current.status})`,
    )
  }
  return updateJob(
    id,
    {
      status: "done",
      auditId: auditId.trim(),
      finishedAt: new Date().toISOString(),
      errorMessage: undefined,
    },
    root,
  )
}

export function completeJobFailure(
  id: string,
  errorMessage: string,
  root = defaultRepoRoot(),
): AuditJob {
  const current = readJob(id, root)
  if (!current) throw new JobNotFoundError(id)
  if (current.status !== "running") {
    throw new JobConflictError(
      id,
      `El job no está en curso (estado: ${current.status})`,
    )
  }
  return updateJob(
    id,
    {
      status: "failed",
      errorMessage: errorMessage.trim(),
      finishedAt: new Date().toISOString(),
    },
    root,
  )
}

export class JobNotFoundError extends Error {
  readonly id: string
  constructor(id: string) {
    super(`Job no encontrado: ${id}`)
    this.name = "JobNotFoundError"
    this.id = id
  }
}

export class JobConflictError extends Error {
  readonly id: string
  constructor(id: string, message: string) {
    super(message)
    this.name = "JobConflictError"
    this.id = id
  }
}
