import { NextResponse } from "next/server"

import { loadAuditByIdForMeiExport } from "@repo/lib/mei-export/mei-audit-loader"
import { buildMeiWorkbook } from "@repo/lib/mei-export/mei-xlsx-writer"
import { CLAUDE_AUDIT_ID_SET } from "@/lib/claude-audits-launch"
import { contentDispositionAttachment } from "@/lib/informe-piloto-filename"
import {
  getExportableHitoIdsFromCatalog,
  loadMeiCatalogFromRepo,
} from "@/lib/mei-calidad-web/mei-export-server"
import { meiUrlXlsxFilename } from "@/lib/mei-calidad-web/export-href"
import { repoRoot } from "@/lib/repo-root"

export const runtime = "nodejs"

type RouteParams = { params: Promise<{ auditId: string }> }

/**
 * Excel MEI de **una sola URL** (la auditoría `auditId`).
 * El workbook completo de las 10 META MEI vive en `/export/completo.xlsx`.
 */
export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const { auditId: raw } = await params
    const auditId = decodeURIComponent(raw ?? "").trim()
    if (!auditId || !CLAUDE_AUDIT_ID_SET.has(auditId)) {
      return NextResponse.json(
        { error: "Auditoría no encontrada o no cableada en launch." },
        { status: 404 },
      )
    }

    const catalog = loadMeiCatalogFromRepo()
    const hitoIds = getExportableHitoIdsFromCatalog(catalog)
    if (hitoIds.length === 0) {
      return NextResponse.json(
        { error: "No hay hitos completados disponibles para exportación." },
        { status: 403 },
      )
    }

    const root = repoRoot()
    const audit = loadAuditByIdForMeiExport(auditId, root)
    const workbook = await buildMeiWorkbook({
      hitoIds,
      root,
      audits: [audit],
    })
    const buffer = await workbook.xlsx.writeBuffer()
    const filename = meiUrlXlsxFilename(auditId)

    return new Response(Buffer.from(buffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": contentDispositionAttachment(filename),
        "Cache-Control": "private, no-store",
      },
    })
  } catch (e) {
    console.error("[mei-calidad-web/export/url]", e)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
