import type {
  MeiCatalog,
  MeiItem,
  MeiItemEstado,
} from "@contracts/mei-calidad-web-catalog"

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
    .filter(Boolean)
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
