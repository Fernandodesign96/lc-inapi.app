import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import {
  parseChecklistCriteriaFile,
  parseChecklistCriteriaLcPtdFile,
} from "../schemas/checklist"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "../..")

const v21Path = join(root, "data/checklist-criteria.json")
const v30Path = join(root, "data/checklist-criteria-lc-ptd.json")

const v21 = parseChecklistCriteriaFile(
  JSON.parse(readFileSync(v21Path, "utf8")),
)
const v21Ids = new Set(v21.criteria.map((c) => c.id))
if (v21Ids.size !== v21.criteria.length) {
  console.error("IDs duplicados en checklist-criteria.json (v2.1)")
  process.exit(1)
}

const v30 = parseChecklistCriteriaLcPtdFile(
  JSON.parse(readFileSync(v30Path, "utf8")),
)
const v30Ids = new Set(v30.criteria.map((c) => c.id))
if (v30Ids.size !== v30.criteria.length) {
  console.error("IDs duplicados en checklist-criteria-lc-ptd.json (v3.0)")
  process.exit(1)
}

console.log(
  `OK — checklist v${v21.checklist_version} histórico: ${v21.criteria.length} criterios A–H.`,
)
console.log(
  `OK — checklist v${v30.checklist_version} PTD-LC vigente: ${v30.criteria.length} criterios (indicadores IEW/IESD).`,
)
