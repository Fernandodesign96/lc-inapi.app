import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
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
const clarityLaunchPath = join(
  __dirname,
  "../../frontend/src/lib/clarity-audits-launch.ts",
)

const MEI_ROOTS = ["tramites", "sitioweb"] as const

function entryName(entry: string | Buffer): string {
  return typeof entry === "string" ? entry : entry.toString("utf8")
}

function auditDateFromId(id: string): string | null {
  const match = id.match(/_(\d{4}-\d{2}-\d{2})$/)
  return match?.[1] ?? null
}

/** data/claude-audits/{tramites|sitioweb}/{fecha}/{id}.json */
function resolveAuditJsonPath(id: string): string | null {
  const date = auditDateFromId(id)
  if (!date) return null
  for (const mei of MEI_ROOTS) {
    const candidate = join(auditsDir, mei, date, `${id}.json`)
    if (existsSync(candidate)) return candidate
  }
  return null
}

/** Lista recursiva de *.json (excluye *.export.json). */
function listAuditJsonFiles(dir: string): string[] {
  if (!existsSync(dir)) return []
  const out: string[] = []
  for (const entry of readdirSync(dir).map(entryName)) {
    const full = join(dir, entry)
    const st = statSync(full)
    if (st.isDirectory()) {
      out.push(...listAuditJsonFiles(full))
      continue
    }
    if (entry.endsWith(".json") && !entry.endsWith(".export.json")) {
      out.push(full)
    }
  }
  return out.sort()
}

/** Ids registrados en CLAUDE_PILOT_URL_ROWS. */
function registeredLaunchIds(): Set<string> {
  const source = readFileSync(launchPath, "utf8")
  const ids = new Set<string>()
  for (const match of source.matchAll(/claudeAuditId:\s*"([^"]+)"/g)) {
    ids.add(match[1])
  }
  return ids
}

/**
 * Ids en clarity-audits-launch.ts (incluye history.id vía regex).
 * Misma regla que antes con urls-clarity/.
 */
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

function validateAuditJsonFiles(
  files: string[],
  label: string,
  options?: { requireClarityMetaIds?: Set<string> },
): ValidateFolderResult {
  const fileIds = new Set<string>()
  let ok = 0

  for (const filePath of files) {
    const name = basename(filePath)
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
      if (
        options?.requireClarityMetaIds?.has(expectedId) &&
        !bundle.clarity
      ) {
        console.error(
          `Falta clarity_meta (${label}/${name}): obligatorio para ids Clarity/history.`,
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

function alignLaunchWithResolvedFiles(
  launchIds: Set<string>,
  fileIds: Set<string>,
  launchLabel: string,
): void {
  for (const id of launchIds) {
    const filePath = resolveAuditJsonPath(id)
    if (!filePath) {
      console.error(
        `Falta archivo para id registrado en ${launchLabel}: ${id} (esperado bajo tramites|sitioweb/{fecha}/)`,
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
}

// --- Recolectar todos los JSON bajo tramites/ y sitioweb/ ---
const allFiles: string[] = []
for (const mei of MEI_ROOTS) {
  allFiles.push(...listAuditJsonFiles(join(auditsDir, mei)))
}

const pilotLaunchIds = registeredLaunchIds()
const clarityLaunchIds = registeredClarityLaunchIds()
const knownLaunchIds = new Set([...pilotLaunchIds, ...clarityLaunchIds])

const all = validateAuditJsonFiles(allFiles, "claude-audits", {
  requireClarityMetaIds: clarityLaunchIds,
})

// Cada JSON debe pertenecer a algún launch (piloto o clarity/history)
for (const id of all.fileIds) {
  if (!knownLaunchIds.has(id)) {
    console.error(
      `JSON sin registro en claude-audits-launch ni clarity-audits-launch: ${id}`,
    )
    process.exit(1)
  }
}

alignLaunchWithResolvedFiles(
  pilotLaunchIds,
  all.fileIds,
  "claude-audits-launch.ts",
)
alignLaunchWithResolvedFiles(
  clarityLaunchIds,
  all.fileIds,
  "clarity-audits-launch.ts",
)

const pilotOk = [...all.fileIds].filter((id) => pilotLaunchIds.has(id)).length
const clarityOk = [...all.fileIds].filter((id) =>
  clarityLaunchIds.has(id),
).length

console.log(
  `OK — ${all.ok} auditoría(s) en tramites|sitioweb/{fecha}/ (${pilotOk} piloto + ${clarityOk} Clarity/history) alineadas con launch (${pilotLaunchIds.size} + ${clarityLaunchIds.size} id(s)).`,
)