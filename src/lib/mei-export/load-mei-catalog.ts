import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"

import {
  parseMeiCatalog,
  type MeiCatalog,
} from "../../schemas/mei-calidad-web-catalog"

const DEFAULT_RELATIVE_PATH = "data/mei-calidad-web/catalog.json"

export class MeiCatalogLoadError extends Error {
  readonly path: string

  constructor(message: string, path: string, cause?: unknown) {
    super(message, cause !== undefined ? { cause } : undefined)
    this.name = "MeiCatalogLoadError"
    this.path = path
  }
}

export function meiCatalogPath(root = process.cwd()): string {
  return join(root, DEFAULT_RELATIVE_PATH)
}

export function loadMeiCatalog(root = process.cwd()): MeiCatalog {
  const path = meiCatalogPath(root)
  if (!existsSync(path)) {
    throw new MeiCatalogLoadError(
      `No se encontró el catálogo MEI en ${path}. ` +
        `Defina LC_REPO_ROOT apuntando a la raíz del monorepo, ` +
        `o asegúrese de desplegar data/mei-calidad-web/catalog.json.`,
      path,
    )
  }

  try {
    const raw = JSON.parse(readFileSync(path, "utf8")) as unknown
    return parseMeiCatalog(raw)
  } catch (cause) {
    throw new MeiCatalogLoadError(
      `No se pudo leer o validar el catálogo MEI en ${path}.`,
      path,
      cause,
    )
  }
}

export function hitosConExcelDescargable(catalog: MeiCatalog) {
  return catalog.items.filter(
    (item) =>
      item.type === "hito" &&
      item.excelHitoId !== null &&
      item.estado === "completado",
  )
}
