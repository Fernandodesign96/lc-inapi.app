import { readFileSync } from "node:fs"
import { join } from "node:path"

import { NextResponse } from "next/server"

import { strictAuditRecordSchema } from "@contracts/checklist"
import { AUDIT_FIXTURE_ID_SET } from "@/lib/audit-fixtures-launch"

export async function GET(
  _request: Request,
  context: { params: Promise<{ fixtureId: string }> },
) {
  const { fixtureId: fixtureIdParam } = await context.params
  const fixtureId = decodeURIComponent(fixtureIdParam)

  if (!AUDIT_FIXTURE_ID_SET.has(fixtureId)) {
    return NextResponse.json({ error: "Fixture no permitido" }, { status: 404 })
  }

  const repoRoot = process.env.LC_REPO_ROOT ?? join(process.cwd(), "..")
  const filePath = join(
    repoRoot,
    "data",
    "audit-fixtures",
    `${fixtureId}.json`,
  )

  let rawText: string
  try {
    rawText = readFileSync(filePath, "utf8")
  } catch {
    return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 })
  }

  let data: unknown
  try {
    data = JSON.parse(rawText)
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 500 })
  }

  try {
    const parsed = strictAuditRecordSchema.parse(data)
    return NextResponse.json(parsed)
  } catch {
    return NextResponse.json(
      { error: "No cumple strictAuditRecordSchema" },
      { status: 500 },
    )
  }
}