import type { MeiItem } from "@contracts/mei-calidad-web-catalog"

import { MeiItemCard } from "@/components/mei-calidad-web/mei-item-card"
import {
  groupItemsByTrimestre,
  sortedTrimestres,
} from "@/lib/mei-calidad-web/catalog-helpers"

export function MeiTrimestreBoard({ items }: { items: MeiItem[] }) {
  const byTrim = groupItemsByTrimestre(items)
  const trimestres = sortedTrimestres(items)

  if (trimestres.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No hay actividades ni hitos en esta subdimensión.
      </p>
    )
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {trimestres.map((trimestre) => {
        const columnItems = byTrim.get(trimestre) ?? []
        return (
          <section
            key={trimestre}
            className="flex min-w-[min(100%,20rem)] flex-1 flex-col gap-3"
          >
            <header className="sticky top-0 z-10 rounded-lg border border-border bg-muted/50 px-3 py-2">
              <h3 className="font-medium text-sm">{trimestre}</h3>
              <p className="text-muted-foreground text-xs">
                {columnItems.length} ítem{columnItems.length === 1 ? "" : "s"}
              </p>
            </header>
            <div className="flex flex-col gap-3">
              {columnItems.map((item) => (
                <MeiItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
