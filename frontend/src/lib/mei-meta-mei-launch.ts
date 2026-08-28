import { MEI_META_MEI_URLS } from "@repo/lib/mei-export/mei-meta-mei-urls"

import { normalizeAuditUrl } from "@/lib/audit-jobs/excel-path"
import {
  CLAUDE_AUDIT_ID_SET,
  CLAUDE_PILOT_URL_ROWS,
  META_MEI_EXTRA_AUDITS,
} from "@/lib/claude-audits-launch"
import { CLARITY_FICHAS_MOCK } from "@/lib/clarity-fichas-mock"
import {
  CLARITY_INVENTORY_ROWS,
  type ClarityInventoryRow,
} from "@/lib/clarity-inventory-rows"
import { ETIQUETA_ESTADO_ACEPTACION } from "@/lib/resultado-mock-copy"

export type MetaMeiLaunchResumen = {
  porcentajeLc: number
  estadoAceptacion: "rechazado" | "aceptado_con_observaciones" | "aprobado"
  fechaEvaluacionIso: string
  evaluadorUid: string
}

/** Fila UI de la tabla META MEI (11 URLs compromiso). */
export type MetaMeiTableRow = {
  orden: number
  url: string
  label: string
  tipoPagina: "sitioweb" | "tramites"
  rolMetaMei: string
  /** Id JSON vigente en launch / mei-meta-mei-urls (null = aún sin cable). */
  claudeAuditId: string | null
  resumenMvp?: MetaMeiLaunchResumen
  /** Reauditoría 1-URL en curso: sin % ni enlace al JSON previo. */
  enProceso: boolean
}

function resumenFromLaunch(
  url: string,
  auditId: string | null,
): MetaMeiLaunchResumen | undefined {
  const target = normalizeAuditUrl(url)
  if (auditId) {
    const byId = META_MEI_EXTRA_AUDITS.find((e) => e.id === auditId)
    if (byId) return byId.resumenMvp
  }
  const byUrlExtra = META_MEI_EXTRA_AUDITS.find(
    (e) => normalizeAuditUrl(e.url) === target,
  )
  if (byUrlExtra) return byUrlExtra.resumenMvp

  const pilot = CLAUDE_PILOT_URL_ROWS.find(
    (r) => normalizeAuditUrl(r.url) === target,
  )
  return pilot?.resumenMvp
}

/**
 * La tabla superior META MEI solo habilita filas con auditoría §17 v2.1
 * cableada desde esta fecha (ids `…_YYYY-MM-DD`). Auditorías previas (v1.1)
 * siguen en el historial inferior, pero no activan links aquí.
 */
const META_MEI_UI_READY_FROM_ISO = "2026-08-18"

function auditDateFromId(auditId: string): string | null {
  const m = /_(\d{4}-\d{2}-\d{2})$/u.exec(auditId)
  return m?.[1] ?? null
}

/** True solo si el id está en launch y es la reauditoría META MEI (≥ 2026-08-18). */
export function metaMeiAuditReadyForUi(auditId: string | null): boolean {
  if (!auditId || !CLAUDE_AUDIT_ID_SET.has(auditId)) return false
  const fecha = auditDateFromId(auditId)
  return fecha !== null && fecha >= META_MEI_UI_READY_FROM_ISO
}

/** True si la fila puede mostrarse como disponible (no «En proceso»). */
export function metaMeiRowListoParaUi(entry: {
  auditId: string | null
  reauditoriaEnProceso?: boolean
}): boolean {
  if (entry.reauditoriaEnProceso) return false
  return metaMeiAuditReadyForUi(entry.auditId)
}

/** Las 11 URLs META MEI para la barra superior de `/auditar`. */
export const META_MEI_TABLE_ROWS: MetaMeiTableRow[] = MEI_META_MEI_URLS.map(
  (entry) => {
    const claudeAuditId = entry.auditId
    const enProceso = Boolean(entry.reauditoriaEnProceso)
    const ready = metaMeiRowListoParaUi(entry)
    return {
      orden: entry.orden,
      url: entry.url,
      label: entry.nombreUi,
      tipoPagina: entry.tipoPagina,
      rolMetaMei: entry.rolMetaMei,
      claudeAuditId,
      enProceso,
      resumenMvp: ready
        ? resumenFromLaunch(entry.url, claudeAuditId)
        : undefined,
    }
  },
)

export function metaMeiRowDisponibleEnMvp(row: MetaMeiTableRow): boolean {
  return !row.enProceso && metaMeiAuditReadyForUi(row.claudeAuditId)
}

export function metaMeiResultadoHref(row: MetaMeiTableRow): string | null {
  if (!metaMeiRowDisponibleEnMvp(row) || !row.claudeAuditId) return null
  const params = new URLSearchParams({
    claudeAudit: row.claudeAuditId,
    url: row.url,
  })
  return `/auditar/resultado?${params.toString()}`
}

export function isMetaMeiUrl(url: string): boolean {
  const target = normalizeAuditUrl(url)
  return MEI_META_MEI_URLS.some((e) => normalizeAuditUrl(e.url) === target)
}

/**
 * URLs con auditoría en launch (piloto / META extra / META MEI)
 * que no están en el inventario Clarity — se fusionan al historial único.
 */
export type LaunchHistorialExtraRow = {
  key: string
  url: string
  label: string
  tipoPagina: "sitioweb" | "tramites"
  claudeAuditId: string
  resumenMvp?: MetaMeiLaunchResumen
  origen: "piloto" | "meta-mei"
}

export function buildLaunchHistorialExtraRows(
  clarityUrls: readonly string[],
): LaunchHistorialExtraRow[] {
  const claritySet = new Set(clarityUrls.map((u) => normalizeAuditUrl(u)))
  const byUrl = new Map<string, LaunchHistorialExtraRow>()

  function upsert(
    url: string,
    label: string,
    tipoPagina: "sitioweb" | "tramites",
    claudeAuditId: string,
    resumenMvp: MetaMeiLaunchResumen | undefined,
    origen: "piloto" | "meta-mei",
  ) {
    const norm = normalizeAuditUrl(url)
    if (claritySet.has(norm)) return
    if (!CLAUDE_AUDIT_ID_SET.has(claudeAuditId)) return
    const prev = byUrl.get(norm)
    if (prev) {
      byUrl.set(norm, {
        ...prev,
        claudeAuditId,
        label,
        resumenMvp: resumenMvp ?? prev.resumenMvp,
        origen,
      })
      return
    }
    byUrl.set(norm, {
      key: norm,
      url,
      label,
      tipoPagina,
      claudeAuditId,
      resumenMvp,
      origen,
    })
  }

  for (const r of CLAUDE_PILOT_URL_ROWS) {
    if (!r.claudeAuditId) continue
    upsert(
      r.url,
      r.label,
      r.tipoPagina,
      r.claudeAuditId,
      r.resumenMvp,
      isMetaMeiUrl(r.url) ? "meta-mei" : "piloto",
    )
  }

  for (const e of META_MEI_EXTRA_AUDITS) {
    upsert(e.url, e.label, e.tipoPagina, e.id, e.resumenMvp, "meta-mei")
  }

  for (const m of META_MEI_TABLE_ROWS) {
    if (!m.claudeAuditId) continue
    upsert(
      m.url,
      m.label,
      m.tipoPagina,
      m.claudeAuditId,
      m.resumenMvp,
      "meta-mei",
    )
  }

  return [...byUrl.values()].sort((a, b) => a.label.localeCompare(b.label, "es"))
}

function formatPorcentajeLcRef(pct: number): string {
  return `${pct.toFixed(1).replace(".", ",")} %`
}

function extraToInventoryRow(
  extra: LaunchHistorialExtraRow,
  rank: number,
): ClarityInventoryRow {
  const resumen = extra.resumenMvp
  return {
    rank,
    rutaEtiqueta: extra.label,
    type_url: extra.tipoPagina,
    encargadoRef: resumen?.evaluadorUid ?? "—",
    visitasRef: "—",
    auditoriasRef: "1",
    ultimaRevisionRef: resumen
      ? resumen.fechaEvaluacionIso.slice(0, 10)
      : "—",
    porcentajeLcRef: resumen
      ? formatPorcentajeLcRef(resumen.porcentajeLc)
      : "—",
    estadoRef: resumen
      ? ETIQUETA_ESTADO_ACEPTACION[resumen.estadoAceptacion]
      : "—",
  }
}

export type UnifiedHistorialBundle = {
  rows: ClarityInventoryRow[]
  /** Filas que no vienen de Clarity (piloto / META MEI), indexadas por `#`. */
  launchExtraByRank: ReadonlyMap<number, LaunchHistorialExtraRow>
}

/**
 * Una sola lista para el historial inferior: inventario Clarity + URLs
 * auditadas en launch que no están en Clarity (para no perder ninguna).
 */
export function buildUnifiedHistorialInventory(): UnifiedHistorialBundle {
  const extras = buildLaunchHistorialExtraRows(
    CLARITY_FICHAS_MOCK.map((f) => f.url),
  )
  const maxClarityRank = CLARITY_INVENTORY_ROWS.reduce(
    (max, row) => Math.max(max, row.rank),
    0,
  )
  const launchExtraByRank = new Map<number, LaunchHistorialExtraRow>()
  const extraRows: ClarityInventoryRow[] = extras.map((extra, i) => {
    const rank = maxClarityRank + 1 + i
    launchExtraByRank.set(rank, extra)
    return extraToInventoryRow(extra, rank)
  })

  return {
    rows: [...CLARITY_INVENTORY_ROWS, ...extraRows],
    launchExtraByRank,
  }
}
