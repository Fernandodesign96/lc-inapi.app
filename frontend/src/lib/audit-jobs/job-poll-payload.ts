import type { AuditJob } from "@contracts/audit-job"

import { messageForPoll } from "@/lib/audit-jobs/status-message"

/** Shape compartido de GET `:id` y 409 de GET `:id/result`. */
export function jobPollPayload(job: AuditJob) {
  return {
    id: job.id,
    status: job.status,
    url: job.url,
    auditorNombre: job.auditorNombre,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    message: messageForPoll(job),
    ...(job.status === "failed" && job.errorMessage
      ? { errorMessage: job.errorMessage }
      : {}),
    ...(job.status === "done" && job.auditId ? { auditId: job.auditId } : {}),
  }
}
