import { NextResponse } from "next/server"
import { ZodError } from "zod"

import { unauthorizedWorkerResponse } from "@/lib/audit-jobs/worker-auth"
import { claimBodySchema } from "@/lib/audit-jobs/worker-body"
import { repoRoot } from "@/lib/repo-root"
import { isWithinAuditJobHours } from "@repo/lib/audit-jobs/business-hours"
import {
  claimNextQueuedJob,
  promoteOutsideHoursToQueued,
} from "@repo/lib/audit-jobs/store"

export const runtime = "nodejs"

/**
 * POST /api/audit-jobs/claim — worker reclama el próximo `queued`.
 * Dentro de horario, primero promueve `outside_hours` → `queued`.
 */
export async function POST(request: Request) {
  const authError = unauthorizedWorkerResponse(request)
  if (authError) return authError

  let body: { workerId?: string } = {}
  const raw = await request.text()
  if (raw.trim()) {
    try {
      body = claimBodySchema.parse(JSON.parse(raw) as unknown)
    } catch (e) {
      if (e instanceof ZodError) {
        const first = e.issues[0]?.message ?? "Datos inválidos"
        return NextResponse.json({ error: first }, { status: 400 })
      }
      return NextResponse.json(
        { error: "Cuerpo JSON inválido" },
        { status: 400 },
      )
    }
  }

  try {
    const root = repoRoot()
    if (isWithinAuditJobHours()) {
      promoteOutsideHoursToQueued(root)
    }

    const job = claimNextQueuedJob({
      workerId: body.workerId,
      root,
    })

    if (!job) {
      return new NextResponse(null, { status: 204 })
    }

    return NextResponse.json({
      id: job.id,
      url: job.url,
      auditorNombre: job.auditorNombre,
      status: job.status,
      claimedAt: job.claimedAt,
    })
  } catch (e) {
    console.error("[audit-jobs] claim falló", e)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
