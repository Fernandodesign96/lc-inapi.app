import type { AuditJob, AuditJobStatus } from "@contracts/audit-job"

const STATUS_MESSAGE: Record<AuditJobStatus, string> = {
  queued: "En cola; te avisamos al terminar el análisis.",
  outside_hours: "Fuera de horario laboral (8:00–18:00).",
  running: "Auditoría en curso (puede demorar 10–40 min).",
  done: "Lista; puedes ver el resultado.",
  failed: "No se pudo completar la auditoría.",
}

export function messageForJobStatus(status: AuditJobStatus): string {
  return STATUS_MESSAGE[status]
}

export function messageForCreatedJob(status: AuditJobStatus): string {
  if (status === "outside_hours") {
    return "El servicio de auditoría opera de lunes a viernes de 8:00 a 18:00 (hora Chile). Intenta nuevamente en ese horario."
  }
  return "Tu auditoría quedó en cola. Puede demorar entre 10 y 40 minutos."
}

export function messageForPoll(job: AuditJob): string {
  if (job.status === "failed" && job.errorMessage?.trim()) {
    return job.errorMessage.trim()
  }
  return messageForJobStatus(job.status)
}
