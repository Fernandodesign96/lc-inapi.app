import { NextResponse } from "next/server"

import {
  buildMeiXlsxResponse,
  getExportableHitoIdsFromCatalog,
  loadMeiCatalogFromRepo,
} from "@/lib/mei-calidad-web/mei-export-server"

export const runtime = "nodejs"

export async function GET() {
  try {
    const catalog = loadMeiCatalogFromRepo()
    const hitoIds = getExportableHitoIdsFromCatalog(catalog)

    if (hitoIds.length === 0) {
      return NextResponse.json(
        { error: "No hay hitos completados disponibles para exportación." },
        { status: 403 },
      )
    }

    return await buildMeiXlsxResponse(hitoIds)
  } catch (e) {
    console.error("[mei-calidad-web/export/completo]", e)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
