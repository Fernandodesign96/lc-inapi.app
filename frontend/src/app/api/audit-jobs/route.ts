import { NextResponse } from "next/server"
import { ZodError } from "zod"

import { createAuditJobBodySchema } from "@/lib/audit-jobs/post-body"
import { messageForCreatedJob } from "@/lib/audit-jobs/status-message"
import { repoRoot } from "@/lib/repo-root"
import { createJob } from "@repo/lib/audit-jobs/store"

export const runtime = "nodejs"

/**
 * POST /api/audit-jobs — crea un job (estado `queued` en este slice;
 * horario 8–18 → commit siguiente).
 */
export async function POST(request: Request) {
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
    const body = createAuditJobBodySchema.parse(json)
    const job = createJob(
      {
        url: body.url,
        auditorNombre: body.auditorNombre,
        status: "queued",
      },
      repoRoot(),
    )

    return NextResponse.json(
      {
        id: job.id,
        status: job.status,
        createdAt: job.createdAt,
        message: messageForCreatedJob(job.status),
      },
      { status: 201 },
    )
  } catch (e) {
    if (e instanceof ZodError) {
      const first = e.issues[0]?.message ?? "Datos inválidos"
      return NextResponse.json({ error: first }, { status: 400 })
    }
    console.error("[audit-jobs] POST falló", e)
    return NextResponse.json(
      { error: "No se pudo guardar la solicitud de auditoría" },
      { status: 500 },
    )
  }
}
