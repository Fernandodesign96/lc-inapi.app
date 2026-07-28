import { buildMeiWorkbook } from "@repo/lib/mei-export/mei-xlsx-writer"
import type { MeiCatalog, MeiItem } from "@contracts/mei-calidad-web-catalog"

import { contentDispositionAttachment } from "@/lib/informe-piloto-filename"
import { repoRoot } from "@/lib/repo-root"

import { exportableHitoIds } from "./catalog-helpers"
import { loadMeiCatalogFromRepo } from "./catalog-server"
import { meiXlsxFilename } from "./export-href"

const HITO_ID_PATTERN = /^H\d{2}$/

export { loadMeiCatalogFromRepo } from "./catalog-server"

export function findHitoByExcelId(
  catalog: MeiCatalog,
  excelHitoId: string,
): MeiItem | undefined {
  return catalog.items.find(
    (item) => item.type === "hito" && item.excelHitoId === excelHitoId,
  )
}

export function isValidHitoId(hitoId: string): boolean {
  return HITO_ID_PATTERN.test(hitoId)
}

export async function buildMeiXlsxResponse(
  hitoIds: string[],
  filenameHitoId?: string,
): Promise<Response> {
  const workbook = await buildMeiWorkbook({ hitoIds, root: repoRoot() })
  const buffer = await workbook.xlsx.writeBuffer()
  const filename = meiXlsxFilename(filenameHitoId)

  return new Response(Buffer.from(buffer), {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": contentDispositionAttachment(filename),
      "Cache-Control": "private, no-store",
    },
  })
}

export function getExportableHitoIdsFromCatalog(
  catalog?: MeiCatalog,
): string[] {
  return exportableHitoIds(catalog ?? loadMeiCatalogFromRepo())
}
