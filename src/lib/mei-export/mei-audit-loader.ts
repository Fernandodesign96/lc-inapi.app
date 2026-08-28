import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"

import { parseClaudeAuditFile, type ClaudeAuditBundle } from "../../schemas/claude-audit-pilot"
import { bundleForVisibleDelivery } from "../audit-visible-content"

import { MEI_META_MEI_URLS } from "./mei-meta-mei-urls"

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
  /** Rol Meta MEI (solo muestra compromiso jefatura). */
  rolMetaMei?: string
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

function resolveRepoRoot(root: string): string {
  return existsSync(join(root, "data/claude-audits")) ? root : repoRootFromModule()
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

function loadBundle(auditsDir: string, auditId: string): ClaudeAuditBundle {
  const jsonPath = resolveAuditJsonPath(auditsDir, auditId)
  if (!jsonPath) {
    throw new Error(`No se encontró JSON de auditoría: ${auditId}`)
  }
  const raw = JSON.parse(readFileSync(jsonPath, "utf8")) as unknown
  return bundleForVisibleDelivery(parseClaudeAuditFile(raw))
}

/**
 * Muestra META MEI (11 URLs compromiso jefatura).
 * Omite entradas sin `auditId` (aún no auditadas).
 */
export function loadMetaMeiAudits(root = process.cwd()): LoadedClarityAudit[] {
  const repoRoot = resolveRepoRoot(root)
  const auditsDir = join(repoRoot, "data/claude-audits")
  const out: LoadedClarityAudit[] = []

  for (const entry of MEI_META_MEI_URLS) {
    if (!entry.auditId) continue
    const bundle = loadBundle(auditsDir, entry.auditId)
    const audit = bundle.audit
    out.push({
      rank: entry.orden,
      url: audit.url,
      nombreUi: bundle.clarity?.nombre_ui ?? entry.nombreUi,
      tipoPagina: bundle.pilot.tipo_pagina ?? entry.tipoPagina,
      auditId: audit.id,
      fechaEvaluacionIso: audit.fecha_evaluacion,
      porcentajeLc: audit.porcentaje_cumplimiento,
      bundle,
      rolMetaMei: entry.rolMetaMei,
    })
  }

  return out.sort((a, b) => a.rank - b.rank)
}

/**
 * Carga una sola auditoría por id (Excel por URL desde resultado).
 * Si el id está en META MEI, conserva orden/rol; si no, rank=0.
 */
export function loadAuditByIdForMeiExport(
  auditId: string,
  root = process.cwd(),
): LoadedClarityAudit {
  const repoRoot = resolveRepoRoot(root)
  const auditsDir = join(repoRoot, "data/claude-audits")
  const bundle = loadBundle(auditsDir, auditId)
  const audit = bundle.audit
  const meta = MEI_META_MEI_URLS.find((e) => e.auditId === auditId)

  return {
    rank: meta?.orden ?? 0,
    url: audit.url,
    nombreUi:
      bundle.clarity?.nombre_ui ?? meta?.nombreUi ?? audit.url,
    tipoPagina: bundle.pilot.tipo_pagina ?? meta?.tipoPagina ?? "sitioweb",
    auditId: audit.id,
    fechaEvaluacionIso: audit.fecha_evaluacion,
    porcentajeLc: audit.porcentaje_cumplimiento,
    bundle,
    rolMetaMei: meta?.rolMetaMei,
  }
}

export function loadVigenteClarityAudits(root = process.cwd()): LoadedClarityAudit[] {
  const repoRoot = resolveRepoRoot(root)
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
    const bundle = loadBundle(auditsDir, auditId)
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
