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

const clarityAuditsDir = join(auditsDir, "urls-clarity")
const clarityLaunchPath = join(
  __dirname,
  "../../frontend/src/lib/clarity-audits-launch.ts",
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

/** Ids registrados en CLARITY_AUDIT_BY_RANK (misma regla que la API Clarity). */
function registeredClarityLaunchIds(): Set<string> {
  const source = readFileSync(clarityLaunchPath, "utf8")
  const ids = new Set<string>()
  for (const match of source.matchAll(/^\s+id:\s*"([^"]+)"/gm)) {
    ids.add(match[1])
  }
  return ids
}

type ValidateFolderResult = {
  ok: number
  fileIds: Set<string>
}

function validateAuditJsonFolder(
  dir: string,
  label: string,
  options?: { requireClarityMeta?: boolean },
): ValidateFolderResult {
  let names: string[]
  try {
    names = readdirSync(dir)
      .map(entryName)
      .filter((n) => n.endsWith(".json") && !n.endsWith(".export.json"))
      .sort()
  } catch {
    console.error(`No se pudo leer carpeta ${label}: ${dir}`)
    process.exit(1)
  }

  const fileIds = new Set<string>()
  let ok = 0

  for (const name of names) {
    const filePath = join(dir, name)
    const expectedId = basename(name, ".json")
    const rawText = readFileSync(filePath, "utf8")
    let data: unknown
    try {
      data = JSON.parse(rawText)
    } catch (e) {
      console.error(`JSON inválido (${label}/${name}):`, e)
      process.exit(1)
    }
    try {
      const bundle = parseClaudeAuditFile(data)
      if (bundle.audit.id !== expectedId) {
        console.error(
          `Id incoherente (${label}/${name}): campo "id"="${bundle.audit.id}" ≠ nombre "${expectedId}".`,
        )
        process.exit(1)
      }
      if (options?.requireClarityMeta && !bundle.clarity) {
        console.error(
          `Falta clarity_meta (${label}/${name}): obligatorio en urls-clarity/.`,
        )
        process.exit(1)
      }
      fileIds.add(bundle.audit.id)
    } catch (e) {
      console.error(`Fallo parseClaudeAuditFile (${label}/${name}):`)
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

  return { ok, fileIds }
}

function alignLaunchWithFiles(
  launchIds: Set<string>,
  fileIds: Set<string>,
  dir: string,
  launchLabel: string,
): void {
  for (const id of launchIds) {
    const filePath = join(dir, `${id}.json`)
    if (!existsSync(filePath)) {
      console.error(
        `Falta archivo para id registrado en ${launchLabel}: ${id}`,
      )
      process.exit(1)
    }
    if (!fileIds.has(id)) {
      console.error(
        `Id registrado en ${launchLabel} sin JSON validado: ${id}`,
      )
      process.exit(1)
    }
  }

  for (const id of fileIds) {
    if (!launchIds.has(id)) {
      console.error(
        `JSON en ${dir} sin registro en ${launchLabel}: ${id}`,
      )
      process.exit(1)
    }
  }
}

// --- Piloto (9 URLs) ---
const pilotLaunchIds = registeredLaunchIds()
const pilot = validateAuditJsonFolder(auditsDir, "piloto")
alignLaunchWithFiles(
  pilotLaunchIds,
  pilot.fileIds,
  auditsDir,
  "claude-audits-launch.ts",
)

// --- Serie Clarity (urls-clarity/) ---
const clarityLaunchIds = registeredClarityLaunchIds()
const clarity = validateAuditJsonFolder(clarityAuditsDir, "clarity", {
  requireClarityMeta: true,
})
alignLaunchWithFiles(
  clarityLaunchIds,
  clarity.fileIds,
  clarityAuditsDir,
  "clarity-audits-launch.ts",
)

console.log(
  `OK — ${pilot.ok} auditoría(s) piloto + ${clarity.ok} Clarity validadas (parseClaudeAuditFile) y alineadas con launch (${pilotLaunchIds.size} + ${clarityLaunchIds.size} id(s)).`,
)
