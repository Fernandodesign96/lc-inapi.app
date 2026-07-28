/**
 * Valida data/mei-calidad-web/catalog.json contra el schema Zod.
 *   bun run validate:mei-catalog
 */
import { loadMeiCatalog } from "../lib/mei-export/load-mei-catalog"

const catalog = loadMeiCatalog()
console.log(
  `OK: mei-catalog v${catalog.version} — ${catalog.items.length} items, ${Object.keys(catalog.subdimensions).length} subdimensiones`,
)
