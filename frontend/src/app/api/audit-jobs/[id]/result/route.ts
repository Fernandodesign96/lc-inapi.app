import { NextResponse } from "next/server"

import { jobPollPayload } from "@/lib/audit-jobs/job-poll-payload"
import {
  buildDescargas,
  buildHistorialForJob,
} from "@/lib/audit-jobs/job-result"
import { repoRoot } from "@/lib/repo-root"
import { readJob } from "@repo/lib/audit-jobs/store"

export const runtime = "nodejs"

/**
 * GET /api/audit-jobs/:id/result — disponible cuando status === done.
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  if (!id?.trim()) {
    return NextResponse.json({ error: "Id requerido" }, { status: 400 })
  }

  try {
    const root = repoRoot()
    const job = readJob(id.trim(), root)
    if (!job) {
      return NextResponse.json(
        { error: "Solicitud de auditoría no encontrada" },
        { status: 404 },
      )
    }

    if (job.status !== "done" || !job.auditId) {
      return NextResponse.json(jobPollPayload(job), { status: 409 })
    }

    return NextResponse.json({
      id: job.id,
      status: job.status,
      url: job.url,
      auditorNombre: job.auditorNombre,
      finishedAt: job.finishedAt ?? job.updatedAt,
      auditId: job.auditId,
      historial: buildHistorialForJob(job, root),
      descargas: buildDescargas(job.auditId, job.url),
    })
  } catch (e) {
    console.error("[audit-jobs] GET result falló", e)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
