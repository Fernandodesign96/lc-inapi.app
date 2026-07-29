import { groupItemsByTrimestreAndHito } from "@/lib/mei-calidad-web/catalog-helpers"
import type { MeiItem } from "@contracts/mei-calidad-web-catalog"

import { MeiTrimestreColumnView } from "@/components/mei-calidad-web/mei-trimestre-column"

export function MeiTrimestreBoard({ items }: { items: MeiItem[] }) {
  const columns = groupItemsByTrimestreAndHito(items)

  if (columns.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No hay actividades ni hitos en esta subdimensión.
      </p>
    )
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {columns.map((column) => (
        <MeiTrimestreColumnView key={column.trimestre} column={column} />
      ))}
    </div>
  )
}
