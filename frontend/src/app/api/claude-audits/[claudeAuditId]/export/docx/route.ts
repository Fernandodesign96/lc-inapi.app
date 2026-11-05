import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"

import { NextResponse } from "next/server"

import {
  contentDispositionAttachment,
  auditoriaDescargaFilename,
} from "@/lib/informe-piloto-filename"
import {
  LoadClaudeAuditBundleError,
  loadClaudeAuditBundle,
} from "@/lib/load-claude-audit-bundle"

/** Sirve Word TI pregenerado (sin Playwright en el server). */
export const runtime = "nodejs"

function repoRoot(): string {
  return process.env.LC_REPO_ROOT ?? join(process.cwd(), "..")
}

function evidenciasDocxPath(claudeAuditId: string): string {
  return join(
    repoRoot(),
    "auditorias",
    "evidencias",
    claudeAuditId,
    "correcciones.docx",
  )
}

function errorResponse(err: LoadClaudeAuditBundleError) {
  const status =
    err.code === "not_allowed" || err.code === "not_found" ? 404 : 500
  return NextResponse.json({ error: err.message }, { status })
}

export async function GET(
  request: Request,
  context: { params: Promise<{ claudeAuditId: string }> },
) {
  const { claudeAuditId: param } = await context.params
  const wantsCheck =
    new URL(request.url).searchParams.get("check") === "1"

  try {
    const bundle = loadClaudeAuditBundle(param)
    const id = decodeURIComponent(param.trim())
    const docxPath = evidenciasDocxPath(id)
    const exists = existsSync(docxPath)

    if (wantsCheck) {
      return NextResponse.json(
        {
          exists,
          path: `auditorias/evidencias/${id}/correcciones.docx`,
          hint: exists
            ? null
            : `bun run capture:evidencias-visuales -- --audit-id ${id} && bun run generate:word-correcciones -- --audit-id ${id}`,
        },
        { status: 200 },
      )
    }

    if (!exists) {
      return NextResponse.json(
        {
          error:
            "Word de correcciones no generado. Ejecuta en el repo: bun run capture:evidencias-visuales -- --audit-id " +
            id +
            " && bun run generate:word-correcciones -- --audit-id " +
            id,
        },
        { status: 404 },
      )
    }

    const bytes = new Uint8Array(readFileSync(docxPath))
    const filename = auditoriaDescargaFilename(bundle.audit, "docx")

    return new Response(bytes, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": contentDispositionAttachment(filename),
        "Cache-Control": "private, no-store",
      },
    })
  } catch (e) {
    if (e instanceof LoadClaudeAuditBundleError) {
      return errorResponse(e)
    }
    console.error("[claude-audits/export/docx]", e)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
