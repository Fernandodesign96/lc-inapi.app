import type { ClarityInventoryRow } from "@/lib/clarity-inventory-rows"
import { parsePorcentajeLcRef } from "@/lib/inventory-table-visuals"
import {
  resolveLcAceptacionBucket,
  type LcAceptacionBucket,
} from "@/lib/lc-aceptacion-visual"
import type { ClarityUrlType } from "@/lib/clarity-url-ficha"

export type FiltroTypeUrlInventario = "todos" | ClarityUrlType

export type FiltroEstadoLcInventario = "todos" | LcAceptacionBucket

export type ClarityInventarioSortKey =
  | "rank"
  | "visitas"
  | "auditorias"
  | "ultimaRevision"
  | "porcentaje"

export type SortDirection = "asc" | "desc"

export function parseVisitasRef(ref: string): number {
  const cleaned = ref.trim().replace(/\./g, "").replace(/\s/g, "")
  const n = Number.parseInt(cleaned, 10)
  return Number.isFinite(n) ? n : 0
}

export function parseAuditoriasRef(ref: string): number {
  const cleaned = ref.trim()
  if (cleaned === "—" || cleaned === "–" || cleaned === "") return 0
  const n = Number.parseInt(cleaned, 10)
  return Number.isFinite(n) ? n : 0
}

export function parseUltimaRevisionRef(ref: string): number {
  const raw = ref.trim()
  if (raw === "—" || raw === "–" || raw === "") return 0
  const t = Date.parse(raw)
  return Number.isFinite(t) ? t : 0
}

export function getClarityInventorySortValue(
  row: ClarityInventoryRow,
  key: ClarityInventarioSortKey,
): number {
  switch (key) {
    case "rank":
      return row.rank
    case "visitas":
      return parseVisitasRef(row.visitasRef)
    case "auditorias":
      return parseAuditoriasRef(row.auditoriasRef)
    case "ultimaRevision":
      return parseUltimaRevisionRef(row.ultimaRevisionRef)
    case "porcentaje":
      return parsePorcentajeLcRef(row.porcentajeLcRef) ?? -1
    default:
      return row.rank
  }
}

export function filterAndSortClarityInventoryRows(
  rows: readonly ClarityInventoryRow[],
  options: {
    filtroEstado: FiltroEstadoLcInventario
    filtroTypeUrl: FiltroTypeUrlInventario
    sortKey: ClarityInventarioSortKey
    sortDir: SortDirection
  },
): ClarityInventoryRow[] {
  let result = [...rows]

  if (options.filtroEstado !== "todos") {
    result = result.filter(
      (row) =>
        resolveLcAceptacionBucket({
          porcentajeLcRef: row.porcentajeLcRef,
          estadoLcRef: row.estadoRef,
        }) === options.filtroEstado,
    )
  }
  if (options.filtroTypeUrl !== "todos") {
    result = result.filter((row) => row.type_url === options.filtroTypeUrl)
  }

  const dir = options.sortDir === "asc" ? 1 : -1
  result.sort((a, b) => {
    const va = getClarityInventorySortValue(a, options.sortKey)
    const vb = getClarityInventorySortValue(b, options.sortKey)
    if (va !== vb) return (va - vb) * dir
    return a.rank - b.rank
  })

  return result
}

const SORT_KEY_LABEL: Record<ClarityInventarioSortKey, string> = {
  rank: "volumen Clarity (#)",
  visitas: "visitas",
  auditorias: "auditorías",
  ultimaRevision: "última revisión",
  porcentaje: "% LC",
}

export function clarityInventarioSortSummary(
  sortKey: ClarityInventarioSortKey,
  sortDir: SortDirection,
): string {
  const campo = SORT_KEY_LABEL[sortKey]
  if (sortKey === "ultimaRevision") {
    return sortDir === "desc"
      ? `Orden: ${campo} (más reciente primero)`
      : `Orden: ${campo} (más antigua primero)`
  }
  if (sortKey === "rank") {
    return sortDir === "asc"
      ? "Orden: volumen Clarity (# 1 → 22)"
      : "Orden: volumen Clarity (# 22 → 1)"
  }
  return sortDir === "desc"
    ? `Orden: ${campo} (mayor a menor)`
    : `Orden: ${campo} (menor a mayor)`
}