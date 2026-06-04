import { NextResponse } from "next/server"

import {
  LoadClaudeAuditBundleError,
  loadClaudeAuditBundle,
} from "@/lib/load-claude-audit-bundle"

function errorResponse(err: LoadClaudeAuditBundleError) {
  const status =
    err.code === "not_allowed" || err.code === "not_found" ? 404 : 500
  return NextResponse.json({ error: err.message }, { status })
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ claudeAuditId: string }> },
) {
  const { claudeAuditId: param } = await context.params

  try {
    const bundle = loadClaudeAuditBundle(param)
    return NextResponse.json(bundle)
  } catch (e) {
    if (e instanceof LoadClaudeAuditBundleError) {
      return errorResponse(e)
    }
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}