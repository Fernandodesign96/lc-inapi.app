import { readFileSync } from "node:fs"
import { join } from "node:path"

import {
  parseMeiCatalog,
  type MeiCatalog,
} from "../../schemas/mei-calidad-web-catalog"

const DEFAULT_RELATIVE_PATH = "data/mei-calidad-web/catalog.json"

export function meiCatalogPath(root = process.cwd()): string {
  return join(root, DEFAULT_RELATIVE_PATH)
}

export function loadMeiCatalog(root = process.cwd()): MeiCatalog {
  const path = meiCatalogPath(root)
  const raw = JSON.parse(readFileSync(path, "utf8")) as unknown
  return parseMeiCatalog(raw)
}

export function hitosConExcelDescargable(catalog: MeiCatalog) {
  return catalog.items.filter(
    (item) =>
      item.type === "hito" &&
      item.excelHitoId !== null &&
      item.estado === "completado",
  )
}
