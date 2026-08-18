import { NextResponse } from "next/server"

import { jobPollPayload } from "@/lib/audit-jobs/job-poll-payload"
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

    return NextResponse.json(jobPollPayload(job))
  } catch (e) {
    console.error("[audit-jobs] GET falló", e)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
