import {
  loadMeiCatalog,
  MeiCatalogLoadError,
} from "@repo/lib/mei-export/load-mei-catalog"
import type { MeiCatalog } from "@contracts/mei-calidad-web-catalog"

import { meiCatalogAbsolutePath, repoRoot } from "@/lib/repo-root"

export { MeiCatalogLoadError }

export function loadMeiCatalogFromRepo(): MeiCatalog {
  try {
    return loadMeiCatalog(repoRoot())
  } catch (error) {
    if (error instanceof MeiCatalogLoadError) throw error
    throw new MeiCatalogLoadError(
      `Error al cargar el catálogo MEI (raíz: ${repoRoot()}).`,
      meiCatalogAbsolutePath(),
      error,
    )
  }
}
