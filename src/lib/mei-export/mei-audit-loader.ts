import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"

import { parseClaudeAuditFile, type ClaudeAuditBundle } from "../../schemas/claude-audit-pilot"

const MEI_ROOTS = ["tramites", "sitioweb"] as const
const PENDING_RANKS = new Set([8, 11, 13, 15])

export type LoadedClarityAudit = {
  rank: number
  url: string
  nombreUi: string
  tipoPagina: "tramites" | "sitioweb"
  auditId: string
  fechaEvaluacionIso: string
  porcentajeLc: number
  bundle: ClaudeAuditBundle
}

type FichaMock = {
  rank: number
  nombre: string
  url: string
  type_url: "tramites" | "sitioweb"
}

type FichasMockFile = {
  fichas: FichaMock[]
}

function repoRootFromModule(): string {
  const cwd = process.cwd()
  if (existsSync(join(cwd, "data/claude-audits"))) return cwd
  return join(cwd, "..")
}

function auditDateFromId(id: string): string | null {
  const match = id.match(/_(\d{4}-\d{2}-\d{2})$/)
  return match?.[1] ?? null
}

function resolveAuditJsonPath(auditsDir: string, id: string): string | null {
  const date = auditDateFromId(id)
  if (!date) return null
  for (const mei of MEI_ROOTS) {
    const candidate = join(auditsDir, mei, date, `${id}.json`)
    if (existsSync(candidate)) return candidate
  }
  return null
}

/** Extrae rank → auditId vigente desde clarity-audits-launch.ts */
function parseVigenteAuditIdsByRank(launchSource: string): Map<number, string> {
  const out = new Map<number, string>()
  const blockStart = launchSource.indexOf("const CLARITY_AUDIT_BY_RANK")
  if (blockStart < 0) return out
  const block = launchSource.slice(blockStart)
  for (const match of block.matchAll(/^\s+(\d+):\s*\{[\r\n]+\s+id:\s*"([^"]+)"/gm)) {
    out.set(Number(match[1]), match[2])
  }
  return out
}

function loadFichasMock(root: string): FichaMock[] {
  const path = join(root, "data/ux/clarity-fichas-mock.json")
  const data = JSON.parse(readFileSync(path, "utf8")) as FichasMockFile
  return data.fichas
}

export function loadVigenteClarityAudits(root = process.cwd()): LoadedClarityAudit[] {
  const repoRoot = existsSync(join(root, "data/claude-audits"))
    ? root
    : repoRootFromModule()

  const auditsDir = join(repoRoot, "data/claude-audits")
  const launchPath = join(repoRoot, "frontend/src/lib/clarity-audits-launch.ts")
  const launchSource = readFileSync(launchPath, "utf8")
  const idsByRank = parseVigenteAuditIdsByRank(launchSource)
  const fichas = loadFichasMock(repoRoot)

  const out: LoadedClarityAudit[] = []

  for (const ficha of fichas) {
    if (PENDING_RANKS.has(ficha.rank)) continue
    const auditId = idsByRank.get(ficha.rank)
    if (!auditId) continue

    const jsonPath = resolveAuditJsonPath(auditsDir, auditId)
    if (!jsonPath) {
      throw new Error(`No se encontró JSON para rank ${ficha.rank}: ${auditId}`)
    }

    const raw = JSON.parse(readFileSync(jsonPath, "utf8")) as unknown
    const bundle = parseClaudeAuditFile(raw)
    const audit = bundle.audit

    out.push({
      rank: ficha.rank,
      url: audit.url,
      nombreUi: bundle.clarity?.nombre_ui ?? ficha.nombre,
      tipoPagina: bundle.pilot.tipo_pagina ?? ficha.type_url,
      auditId: audit.id,
      fechaEvaluacionIso: audit.fecha_evaluacion,
      porcentajeLc: audit.porcentaje_cumplimiento,
      bundle,
    })
  }

  return out.sort((a, b) => a.rank - b.rank)
}

export function formatFechaDdMmYyyy(iso: string): string {
  const date = iso.slice(0, 10)
  const [y, m, d] = date.split("-")
  return `${d}-${m}-${y}`
}
