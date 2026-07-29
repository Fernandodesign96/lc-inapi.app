import { existsSync } from "node:fs"
import { join } from "node:path"

const CATALOG_REL = "data/mei-calidad-web/catalog.json"

function hasMeiCatalog(root: string): boolean {
  return existsSync(join(root, CATALOG_REL))
}

/**
 * Raíz del monorepo (`data/`, `src/`) desde el workspace frontend.
 *
 * Orden: `LC_REPO_ROOT` → `cwd` → `cwd/..` (dev desde `frontend/`) →
 * subida de directorios hasta encontrar el catálogo.
 *
 * En Vercel/preview: definir `LC_REPO_ROOT` o incluir `data/mei-calidad-web/`
 * en el despliegue; si solo se publica `frontend/`, el catálogo no existirá.
 */
export function repoRoot(): string {
  const fromEnv = process.env.LC_REPO_ROOT?.trim()
  if (fromEnv && hasMeiCatalog(fromEnv)) return fromEnv

  const cwd = process.cwd()
  if (hasMeiCatalog(cwd)) return cwd

  const parent = join(cwd, "..")
  if (hasMeiCatalog(parent)) return parent

  let dir = cwd
  for (let i = 0; i < 6; i++) {
    const next = join(dir, "..")
    if (next === dir) break
    if (hasMeiCatalog(next)) return next
    dir = next
  }

  if (fromEnv) return fromEnv
  return parent
}

export function meiCatalogAbsolutePath(): string {
  return join(repoRoot(), CATALOG_REL)
}
