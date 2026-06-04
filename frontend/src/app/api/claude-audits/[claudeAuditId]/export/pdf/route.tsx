import { renderToBuffer } from "@react-pdf/renderer"
import { NextResponse } from "next/server"

import {
  contentDispositionAttachment,
  informePilotoPdfFilenameFromBundle,
} from "@/lib/informe-piloto-filename"
import {
  LoadClaudeAuditBundleError,
  loadClaudeAuditBundle,
} from "@/lib/load-claude-audit-bundle"
import { InformePilotoPdfDocument } from "@/lib/pdf/informe-piloto-pdf-document"

/** Lectura de disco + @react-pdf/renderer requieren Node (no Edge). */
export const runtime = "nodejs"

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
    const filename = informePilotoPdfFilenameFromBundle(bundle)

    const buffer = await renderToBuffer(
      <InformePilotoPdfDocument bundle={bundle} />,
    )
    const pdfBytes = new Uint8Array(buffer)

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": contentDispositionAttachment(filename),
        "Cache-Control": "private, no-store",
      },
    })
  } catch (e) {
    if (e instanceof LoadClaudeAuditBundleError) {
      return errorResponse(e)
    }
    console.error("[claude-audits/export/pdf]", e)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}