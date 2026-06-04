import { readFileSync } from "node:fs"
import { join } from "node:path"

import { NextResponse } from "next/server"

import { parseClaudeAuditFile } from "@contracts/claude-audit-pilot"
import { CLAUDE_AUDIT_ID_SET } from "@/lib/claude-audits-launch"

export async function GET(
  _request: Request,
  context: { params: Promise<{ claudeAuditId: string }> },
) {
  const { claudeAuditId: param } = await context.params
  const claudeAuditId = decodeURIComponent(param)

  if (!CLAUDE_AUDIT_ID_SET.has(claudeAuditId)) {
    return NextResponse.json({ error: "Auditoría piloto no permitida" }, { status: 404 })
  }

  const repoRoot = process.env.LC_REPO_ROOT ?? join(process.cwd(), "..")
  const filePath = join(repoRoot, "data", "claude-audits", `${claudeAuditId}.json`)

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
    const bundle = parseClaudeAuditFile(data)
    return NextResponse.json(bundle)
  } catch {
    return NextResponse.json(
      { error: "No cumple el esquema de auditoría piloto" },
      { status: 500 },
    )
  }
}