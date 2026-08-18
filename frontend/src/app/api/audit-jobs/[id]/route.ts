import { NextResponse } from "next/server"

import { messageForPoll } from "@/lib/audit-jobs/status-message"
import { repoRoot } from "@/lib/repo-root"
import { readJob } from "@repo/lib/audit-jobs/store"

export const runtime = "nodejs"

/**
 * GET /api/audit-jobs/:id — poll de estado para `/auditar/procesando`.
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
    const job = readJob(id.trim(), repoRoot())
    if (!job) {
      return NextResponse.json(
        { error: "Solicitud de auditoría no encontrada" },
        { status: 404 },
      )
    }

    return NextResponse.json({
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
      ...(job.status === "done" && job.auditId
        ? { auditId: job.auditId }
        : {}),
    })
  } catch (e) {
    console.error("[audit-jobs] GET falló", e)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
