import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { parseChecklistCriteriaFile } from "../schemas/checklist"

const __dirname = dirname(fileURLToPath(import.meta.url))
const jsonPath = join(__dirname, "../../data/checklist-criteria.json")

const raw = JSON.parse(readFileSync(jsonPath, "utf8"))
const parsed = parseChecklistCriteriaFile(raw)

const ids = new Set(parsed.criteria.map((c) => c.id))
if (ids.size !== 39) {
  console.error("IDs duplicados o incompletos")
  process.exit(1)
}

console.log(
  `OK — checklist v${parsed.checklist_version}, ${parsed.criteria.length} criterios validados contra Zod.`,
)
