import { readdirSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { ZodError } from "zod"

import { strictAuditRecordSchema } from "../schemas/checklist"

const __dirname = dirname(fileURLToPath(import.meta.url))
const fixturesDir = join(__dirname, "../../data/audit-fixtures")

function entryName(entry: string | Buffer): string {
  return typeof entry === "string" ? entry : entry.toString("utf8")
}

const names = readdirSync(fixturesDir)
  .map(entryName)
  .filter((n) => n.endsWith(".json") && n !== "manifest.json")
  .sort()

if (names.length === 0) {
  console.error(
    `No se encontraron fixtures JSON en ${fixturesDir} (se ignora manifest.json).`,
  )
  process.exit(1)
}

let ok = 0
for (const name of names) {
  const filePath = join(fixturesDir, name)
  const rawText = readFileSync(filePath, "utf8")
  let data: unknown
  try {
    data = JSON.parse(rawText)
  } catch (e) {
    console.error(`JSON inválido (${name}):`, e)
    process.exit(1)
  }
  try {
    strictAuditRecordSchema.parse(data)
  } catch (e) {
    console.error(`Fallo strictAuditRecordSchema (${name}):`)
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

console.log(
  `OK — ${ok} fixture(s) de auditoría validados contra strictAuditRecordSchema en data/audit-fixtures/.`,
)