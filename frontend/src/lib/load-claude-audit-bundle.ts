import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"

import {
  parseClaudeAuditFile,
  type ClaudeAuditBundle,
} from "@contracts/claude-audit-pilot"
import { CLAUDE_AUDIT_ID_SET } from "@/lib/claude-audits-launch"
import { CLARITY_AUDIT_ID_SET } from "@/lib/clarity-audits-launch"

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

function isAllowedClaudeAuditId(id: string): boolean {
  return CLAUDE_AUDIT_ID_SET.has(id) || CLARITY_AUDIT_ID_SET.has(id)
}

/** Extrae YYYY-MM-DD del id canónico (`slug_2026-07-22`). */
function auditDateFromId(claudeAuditId: string): string | null {
  const match = claudeAuditId.match(/_(\d{4}-\d{2}-\d{2})$/)
  return match?.[1] ?? null
}

/**
 * Resolución Opción A:
 * data/claude-audits/{tramites|sitioweb}/{YYYY-MM-DD}/{id}.json
 * Prueba ambas raíces MEI; la fecha sale del id.
 */
function claudeAuditFilePath(claudeAuditId: string): string {
  const base = join(repoRoot(), "data", "claude-audits")
  const date = auditDateFromId(claudeAuditId)
  if (!date) {
    throw new LoadClaudeAuditBundleError(
      "not_found",
      "Id sin fecha YYYY-MM-DD al final",
    )
  }

  const candidates = [
    join(base, "tramites", date, `${claudeAuditId}.json`),
    join(base, "sitioweb", date, `${claudeAuditId}.json`),
  ]

  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate
  }

  // Fallback: primer candidato (el catch de readFileSync → not_found)
  return candidates[0]
}

/**
 * Lee y valida JSON canónico bajo data/claude-audits/{tramites|sitioweb}/{fecha}/.
 * Solo ids en CLAUDE_AUDIT_ID_SET ∪ CLARITY_AUDIT_ID_SET.
 */

export function loadClaudeAuditBundle(claudeAuditId: string): ClaudeAuditBundle {
  const id = decodeURIComponent(claudeAuditId.trim())

  if (!id) {
    throw new LoadClaudeAuditBundleError("not_allowed", "Id de auditoría vacío")
  }

  if (!isAllowedClaudeAuditId(id)) {
    throw new LoadClaudeAuditBundleError(
      "not_allowed",
      "Auditoría no permitida",
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