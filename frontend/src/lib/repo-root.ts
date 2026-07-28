import { join } from "node:path"

/** Raíz del monorepo (data/, src/) desde el workspace frontend. */
export function repoRoot(): string {
  return process.env.LC_REPO_ROOT ?? join(process.cwd(), "..")
}
