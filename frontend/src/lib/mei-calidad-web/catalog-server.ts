import { loadMeiCatalog } from "@repo/lib/mei-export/load-mei-catalog"
import type { MeiCatalog } from "@contracts/mei-calidad-web-catalog"

import { repoRoot } from "@/lib/repo-root"

export function loadMeiCatalogFromRepo(): MeiCatalog {
  return loadMeiCatalog(repoRoot())
}
