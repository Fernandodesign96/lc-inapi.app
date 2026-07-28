import { NextResponse } from "next/server"

import {
  buildMeiXlsxResponse,
  findHitoByExcelId,
  isValidHitoId,
  loadMeiCatalogFromRepo,
} from "@/lib/mei-calidad-web/mei-export-server"

export const runtime = "nodejs"

export async function GET(
  _request: Request,
  context: { params: Promise<{ hitoId: string }> },
) {
  const { hitoId: raw } = await context.params
  const hitoId = decodeURIComponent(raw)

  if (!isValidHitoId(hitoId)) {
    return NextResponse.json({ error: "Hito no válido" }, { status: 404 })
  }

  try {
    const catalog = loadMeiCatalogFromRepo()
    const hitoItem = findHitoByExcelId(catalog, hitoId)

    if (!hitoItem) {
      return NextResponse.json({ error: "Hito no encontrado" }, { status: 404 })
    }

    if (hitoItem.estado !== "completado") {
      return NextResponse.json(
        { error: "El hito aún no está completado; exportación no disponible." },
        { status: 403 },
      )
    }

    return await buildMeiXlsxResponse([hitoId], hitoId)
  } catch (e) {
    console.error("[mei-calidad-web/export/xlsx]", e)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
