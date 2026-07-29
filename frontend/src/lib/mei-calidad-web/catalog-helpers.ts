import type {
  MeiCatalog,
  MeiItem,
  MeiItemEstado,
} from "@contracts/mei-calidad-web-catalog"
import { MEI_EXPORT_HITOS } from "@repo/lib/mei-export/mei-hitos"

export type MeiHitoGroup = {
  hito: MeiItem
  actividades: MeiItem[]
}

export type MeiTrimestreColumn = {
  trimestre: string
  groups: MeiHitoGroup[]
  orphans: MeiItem[]
}

function actividadNumsForExcelHito(excelHitoId: string | null): number[] {
  if (!excelHitoId) return []
  return MEI_EXPORT_HITOS.find((h) => h.id === excelHitoId)?.actividades ?? []
}

/**
 * Agrupa por trimestre del *hito*; cuelga actividades vía
 * `numeroActividad` ↔ `mei-hitos.actividades` / `excelHitoId`.
 */
export function groupItemsByTrimestreAndHito(
  items: MeiItem[],
): MeiTrimestreColumn[] {
  const hitos = items.filter((i) => i.type === "hito")
  const tareas = items.filter((i) => i.type === "tarea")
  const assigned = new Set<string>()

  const groupsByTrim = new Map<string, MeiHitoGroup[]>()

  for (const hito of hitos) {
    const nums = new Set(actividadNumsForExcelHito(hito.excelHitoId))
    const actividades = tareas.filter((t) => {
      if (t.numeroActividad === null || !nums.has(t.numeroActividad)) {
        return false
      }
      assigned.add(t.id)
      return true
    })
    const list = groupsByTrim.get(hito.trimestre) ?? []
    list.push({ hito, actividades })
    groupsByTrim.set(hito.trimestre, list)
  }

  const orphansByTrim = new Map<string, MeiItem[]>()
  for (const tarea of tareas) {
    if (assigned.has(tarea.id)) continue
    const list = orphansByTrim.get(tarea.trimestre) ?? []
    list.push(tarea)
    orphansByTrim.set(tarea.trimestre, list)
  }

  const trimestres = [
    ...new Set([...groupsByTrim.keys(), ...orphansByTrim.keys()]),
  ].sort((a, b) => trimestreSortKey(a) - trimestreSortKey(b))

  return trimestres.map((trimestre) => {
    const groups = (groupsByTrim.get(trimestre) ?? []).sort((a, b) => {
      const aId = a.hito.excelHitoId ?? a.hito.id
      const bId = b.hito.excelHitoId ?? b.hito.id
      return aId.localeCompare(bId)
    })
    const orphans = (orphansByTrim.get(trimestre) ?? []).sort((a, b) => {
      const na = a.numeroActividad ?? 999
      const nb = b.numeroActividad ?? 999
      return na - nb
    })
    return { trimestre, groups, orphans }
  })
}

export function getDimension(catalog: MeiCatalog, dimensionId: string) {
  return catalog.dimensions.find((d) => d.id === dimensionId)
}

export function getSubdimension(catalog: MeiCatalog, subdimensionId: string) {
  return catalog.subdimensions[subdimensionId] ?? null
}

export function getSubdimensionsForDimension(
  catalog: MeiCatalog,
  dimensionId: string,
) {
  const dimension = getDimension(catalog, dimensionId)
  if (!dimension) return []
  return dimension.subdimensionIds
    .map((id) => catalog.subdimensions[id])
    .filter(
      (sub): sub is NonNullable<typeof sub> =>
        sub !== undefined && sub !== null,
    )
}

export function getItemsForSubdimension(
  catalog: MeiCatalog,
  subdimensionId: string,
): MeiItem[] {
  return catalog.items.filter((item) => item.subdimensionId === subdimensionId)
}

export function trimestreSortKey(trimestre: string): number {
  const yearMatch = trimestre.match(/^(\d{4})/)
  const year = yearMatch ? Number(yearMatch[1]) : 2026
  const trimMatch = trimestre.match(/Trim\s*(\d+)/i)
  const trim = trimMatch ? Number(trimMatch[1]) : 99
  return year * 100 + trim
}

export function groupItemsByTrimestre(items: MeiItem[]): Map<string, MeiItem[]> {
  const map = new Map<string, MeiItem[]>()
  for (const item of items) {
    const list = map.get(item.trimestre) ?? []
    list.push(item)
    map.set(item.trimestre, list)
  }
  return map
}

export function sortedTrimestres(items: MeiItem[]): string[] {
  const keys = [...new Set(items.map((i) => i.trimestre))]
  return keys.sort((a, b) => trimestreSortKey(a) - trimestreSortKey(b))
}

export function isHitoExportable(item: MeiItem): boolean {
  return (
    item.type === "hito" &&
    item.excelHitoId !== null &&
    item.estado === "completado"
  )
}

export function exportableHitoIds(catalog: MeiCatalog): string[] {
  return catalog.items
    .filter(isHitoExportable)
    .map((item) => item.excelHitoId!)
    .sort()
}

export function countItemsByEstado(
  items: MeiItem[],
): Record<MeiItemEstado, number> {
  return items.reduce(
    (acc, item) => {
      acc[item.estado] += 1
      return acc
    },
    { pendiente: 0, en_progreso: 0, completado: 0 },
  )
}
