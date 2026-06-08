import { readdirSync, readFileSync, existsSync } from "node:fs"
import { basename, dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { ZodError } from "zod"

import { parseClaudeAuditFile } from "../schemas/claude-audit-pilot"

const __dirname = dirname(fileURLToPath(import.meta.url))
const auditsDir = join(__dirname, "../../data/claude-audits")
const launchPath = join(
  __dirname,
  "../../frontend/src/lib/claude-audits-launch.ts",
)

function entryName(entry: string | Buffer): string {
  return typeof entry === "string" ? entry : entry.toString("utf8")
}

/** Ids registrados en CLAUDE_PILOT_URL_ROWS (misma regla que la API). */
function registeredLaunchIds(): Set<string> {
  const source = readFileSync(launchPath, "utf8")
  const ids = new Set<string>()
  for (const match of source.matchAll(/claudeAuditId:\s*"([^"]+)"/g)) {
    ids.add(match[1])
  }
  return ids
}

const names = readdirSync(auditsDir)
  .map(entryName)
  .filter((n) => n.endsWith(".json") && !n.endsWith(".export.json"))
  .sort()

if (names.length === 0) {
  console.error(`No se encontraron JSON canónicos en ${auditsDir}.`)
  process.exit(1)
}

const launchIds = registeredLaunchIds()
const fileIds = new Set<string>()
let ok = 0

for (const name of names) {
  const filePath = join(auditsDir, name)
  const expectedId = basename(name, ".json")
  const rawText = readFileSync(filePath, "utf8")
  let data: unknown
  try {
    data = JSON.parse(rawText)
  } catch (e) {
    console.error(`JSON inválido (${name}):`, e)
    process.exit(1)
  }
  try {
    const { audit } = parseClaudeAuditFile(data)
    if (audit.id !== expectedId) {
      console.error(
        `Id incoherente (${name}): campo "id"="${audit.id}" ≠ nombre de archivo "${expectedId}".`,
      )
      process.exit(1)
    }
    fileIds.add(audit.id)
  } catch (e) {
    console.error(`Fallo parseClaudeAuditFile (${name}):`)
    if (e instanceof ZodError) {
      console.error(JSON.stringify(e.flatten(), null, 2))
      console.error(e.issues)
    } else {
      console.error(e)
    }
    process.exit(1)
  }
  ok += 1
}

for (const id of launchIds) {
  const filePath = join(auditsDir, `${id}.json`)
  if (!existsSync(filePath)) {
    console.error(
      `Falta archivo para id registrado en claude-audits-launch.ts: ${id}`,
    )
    process.exit(1)
  }
  if (!fileIds.has(id)) {
    console.error(
      `Id registrado en launch sin JSON canónico validado: ${id}`,
    )
    process.exit(1)
  }
}

for (const id of fileIds) {
  if (!launchIds.has(id)) {
    console.error(
      `JSON en repo sin registro en claude-audits-launch.ts: ${id}`,
    )
    process.exit(1)
  }
}

console.log(
  `OK — ${ok} auditoría(s) Claude validadas (parseClaudeAuditFile) y alineadas con claude-audits-launch.ts (${launchIds.size} id(s) en MVP).`,
)
