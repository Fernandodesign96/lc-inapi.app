import { readFileSync } from "node:fs"
import { join } from "node:path"

import {
  parseClaudeAuditFile,
  type ClaudeAuditBundle,
} from "@contracts/claude-audit-pilot"
import { CLAUDE_AUDIT_ID_SET } from "@/lib/claude-audits-launch"

export type LoadClaudeAuditBundleErrorCode =
  | "not_allowed"
  | "not_found"
  | "invalid_json"
  | "schema_error"

export class LoadClaudeAuditBundleError extends Error {
  readonly code: LoadClaudeAuditBundleErrorCode

  constructor(code: LoadClaudeAuditBundleErrorCode, message: string) {
    super(message)
    this.name = "LoadClaudeAuditBundleError"
    this.code = code
  }
}

function repoRoot(): string {
  return process.env.LC_REPO_ROOT ?? join(process.cwd(), "..")
}

function claudeAuditFilePath(claudeAuditId: string): string {
  return join(repoRoot(), "data", "claude-audits", `${claudeAuditId}.json`)
}

/**
 * Lee y valida un JSON canónico de data/claude-audits/{id}.json.
 * Solo ids en CLAUDE_AUDIT_ID_SET (misma regla que la API).
 */
export function loadClaudeAuditBundle(claudeAuditId: string): ClaudeAuditBundle {
  const id = decodeURIComponent(claudeAuditId.trim())

  if (!id) {
    throw new LoadClaudeAuditBundleError("not_allowed", "Id de auditoría vacío")
  }

  if (!CLAUDE_AUDIT_ID_SET.has(id)) {
    throw new LoadClaudeAuditBundleError(
      "not_allowed",
      "Auditoría piloto no permitida",
    )
  }

  const filePath = claudeAuditFilePath(id)

  let rawText: string
  try {
    rawText = readFileSync(filePath, "utf8")
  } catch {
    throw new LoadClaudeAuditBundleError("not_found", "Archivo no encontrado")
  }

  let data: unknown
  try {
    data = JSON.parse(rawText)
  } catch {
    throw new LoadClaudeAuditBundleError("invalid_json", "JSON inválido")
  }

  try {
    return parseClaudeAuditFile(data)
  } catch {
    throw new LoadClaudeAuditBundleError(
      "schema_error",
      "No cumple el esquema de auditoría piloto",
    )
  }
}