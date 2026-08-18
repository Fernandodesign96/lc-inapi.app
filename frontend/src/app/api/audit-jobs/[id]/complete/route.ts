import { NextResponse } from "next/server"
import { ZodError } from "zod"

import { unauthorizedWorkerResponse } from "@/lib/audit-jobs/worker-auth"
import { completeBodySchema } from "@/lib/audit-jobs/worker-body"
import { repoRoot } from "@/lib/repo-root"
import {
  completeJobFailure,
  completeJobSuccess,
  JobConflictError,
  JobNotFoundError,
} from "@repo/lib/audit-jobs/store"

export const runtime = "nodejs"

/**
 * POST /api/audit-jobs/:id/complete — worker marca `done` o `failed`.
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const authError = unauthorizedWorkerResponse(request)
  if (authError) return authError

  const { id } = await context.params
  if (!id?.trim()) {
    return NextResponse.json({ error: "Id requerido" }, { status: 400 })
  }

  let json: unknown
  try {
    json = await request.json()
  } catch {
    return NextResponse.json(
      { error: "Cuerpo JSON inválido" },
      { status: 400 },
    )
  }

  try {
    const body = completeBodySchema.parse(json)
    const root = repoRoot()
    const job = body.ok
      ? completeJobSuccess(id.trim(), body.auditId, root)
      : completeJobFailure(id.trim(), body.errorMessage, root)

    return NextResponse.json({
      id: job.id,
      status: job.status,
      finishedAt: job.finishedAt,
      ...(job.auditId ? { auditId: job.auditId } : {}),
      ...(job.errorMessage ? { errorMessage: job.errorMessage } : {}),
    })
  } catch (e) {
    if (e instanceof ZodError) {
      const first = e.issues[0]?.message ?? "Datos inválidos"
      return NextResponse.json({ error: first }, { status: 400 })
    }
    if (e instanceof JobNotFoundError) {
      return NextResponse.json(
        { error: "Solicitud de auditoría no encontrada" },
        { status: 404 },
      )
    }
    if (e instanceof JobConflictError) {
      return NextResponse.json({ error: e.message }, { status: 409 })
    }
    console.error("[audit-jobs] complete falló", e)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
