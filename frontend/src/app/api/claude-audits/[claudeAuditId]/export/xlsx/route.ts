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
import {
  isAvisosSistemasAudit,
  sustitucionesSonAvisos,
} from "@repo/lib/avisos-correcciones-entrega"
import { avisosCorreccionesXlsxBuffer } from "@repo/lib/avisos-correcciones-xlsx"
import { bundleForVisibleDelivery } from "@repo/lib/audit-visible-content"

/** Excel de correcciones (avisos) o archivo pregenerado. */
export const runtime = "nodejs"

function repoRoot(): string {
  return process.env.LC_REPO_ROOT ?? join(process.cwd(), "..")
}

function evidenciasXlsxPath(claudeAuditId: string): string {
  return join(
    repoRoot(),
    "auditorias",
    "evidencias",
    claudeAuditId,
    "correcciones.xlsx",
  )
}

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
    const raw = loadClaudeAuditBundle(param)
    const bundle = bundleForVisibleDelivery(raw)
    const id = decodeURIComponent(param.trim())
    const avisos =
      isAvisosSistemasAudit(id) ||
      sustitucionesSonAvisos(bundle.pilot.sustituciones ?? [])

    if (!avisos) {
      return NextResponse.json(
        {
          error:
            "Este endpoint Excel de correcciones aplica a la auditoría de avisos. Use el Excel MEI de la URL.",
        },
        { status: 404 },
      )
    }

    const pregenerated = evidenciasXlsxPath(id)
    const buffer = existsSync(pregenerated)
      ? readFileSync(pregenerated)
      : await avisosCorreccionesXlsxBuffer(
          bundle.pilot.sustituciones ?? [],
          bundle.audit.criterios_evaluados,
        )

    const filename = auditoriaDescargaFilename(bundle.audit, "xlsx")
    return new NextResponse(Uint8Array.from(buffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": contentDispositionAttachment(filename),
        "Cache-Control": "private, no-store",
      },
    })
  } catch (e) {
    if (e instanceof LoadClaudeAuditBundleError) {
      return errorResponse(e)
    }
    console.error("[claude-audits/export/xlsx]", e)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
