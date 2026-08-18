import { NextResponse } from "next/server"

const HEADER = "x-worker-secret"
const ENV_KEY = "AUDIT_JOBS_WORKER_SECRET"

/**
 * Valida `X-Worker-Secret` contra `AUDIT_JOBS_WORKER_SECRET`.
 * @returns respuesta de error, o `null` si OK.
 */
export function unauthorizedWorkerResponse(
  request: Request,
): NextResponse | null {
  const expected = process.env[ENV_KEY]?.trim()
  if (!expected) {
    return NextResponse.json(
      {
        error:
          "Falta AUDIT_JOBS_WORKER_SECRET en el entorno del servidor",
      },
      { status: 503 },
    )
  }

  const got = request.headers.get(HEADER)?.trim()
  if (!got || got !== expected) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  return null
}
