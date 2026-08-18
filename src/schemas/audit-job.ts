import { z } from "zod"

/**
 * Job de auditoría on-demand (Fase 4).
 * Contrato: `docs/contratos-audit-jobs.md`
 */

export const auditJobStatusSchema = z.enum([
  "queued",
  "outside_hours",
  "running",
  "done",
  "failed",
])

export type AuditJobStatus = z.infer<typeof auditJobStatusSchema>

export const auditJobSchema = z.object({
  id: z.string().min(1),
  url: z.string().url(),
  auditorNombre: z.string().min(1).max(120),
  status: auditJobStatusSchema,
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
  claimedAt: z.string().optional(),
  workerId: z.string().optional(),
  finishedAt: z.string().optional(),
  errorMessage: z.string().optional(),
  /** Id del JSON canónico cuando status === done. */
  auditId: z.string().optional(),
  timezone: z.literal("America/Santiago"),
})

export type AuditJob = z.infer<typeof auditJobSchema>

export function parseAuditJob(data: unknown): AuditJob {
  return auditJobSchema.parse(data)
}

export const createAuditJobInputSchema = z.object({
  url: z.string().url(),
  auditorNombre: z.string().min(1).max(120),
  status: auditJobStatusSchema.default("queued"),
})

export type CreateAuditJobInput = z.infer<typeof createAuditJobInputSchema>
