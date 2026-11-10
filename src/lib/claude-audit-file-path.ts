/**
 * Resolución de rutas JSON canónicos bajo data/claude-audits/.
 * Uso: scripts de captura/Word y utilidades de repo root.
 */
import { existsSync } from "node:fs"
import { join } from "node:path"

export function auditDateFromId(claudeAuditId: string): string | null {
  const match = claudeAuditId.match(/_(\d{4}-\d{2}-\d{2})$/)
  return match?.[1] ?? null
}

/** data/claude-audits/{tramites|sitioweb}/{fecha}/{id}.json */
export function resolveClaudeAuditJsonPath(
  repoRoot: string,
  claudeAuditId: string,
): string | null {
  const date = auditDateFromId(claudeAuditId)
  if (!date) return null

  const base = join(repoRoot, "data", "claude-audits")
  const candidates = [
    join(base, "tramites", date, `${claudeAuditId}.json`),
    join(base, "sitioweb", date, `${claudeAuditId}.json`),
  ]
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate
  }
  return null
}

export function evidenciasDir(repoRoot: string, claudeAuditId: string): string {
  return join(repoRoot, "auditorias", "evidencias", claudeAuditId)
}

export function evidenciasDocxPath(
  repoRoot: string,
  claudeAuditId: string,
): string {
  return join(evidenciasDir(repoRoot, claudeAuditId), "correcciones.docx")
}

export function evidenciasXlsxPath(
  repoRoot: string,
  claudeAuditId: string,
): string {
  return join(evidenciasDir(repoRoot, claudeAuditId), "correcciones.xlsx")
}
