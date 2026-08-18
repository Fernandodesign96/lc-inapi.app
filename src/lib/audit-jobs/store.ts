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
