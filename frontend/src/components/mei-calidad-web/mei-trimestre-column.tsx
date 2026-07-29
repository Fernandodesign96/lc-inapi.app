import type { MeiTrimestreColumn } from "@/lib/mei-calidad-web/catalog-helpers"

import { MeiHitoGroupCard } from "@/components/mei-calidad-web/mei-hito-group-card"
import { MeiItemCard } from "@/components/mei-calidad-web/mei-item-card"

export function MeiTrimestreColumnView({
  column,
}: {
  column: MeiTrimestreColumn
}) {
  const itemCount =
    column.groups.reduce((n, g) => n + 1 + g.actividades.length, 0) +
    column.orphans.length

  return (
    <section className="flex w-[min(100%,20rem)] min-w-[280px] shrink-0 flex-col gap-3 md:flex-1">
      <header className="sticky top-0 z-10 rounded-lg border border-border bg-muted/50 px-3 py-2">
        <h3 className="font-medium text-sm">{column.trimestre}</h3>
        <p className="text-muted-foreground text-xs">
          {itemCount} ítem{itemCount === 1 ? "" : "s"} · {column.groups.length}{" "}
          hito{column.groups.length === 1 ? "" : "s"}
        </p>
      </header>

      <div className="flex flex-col gap-4">
        {column.groups.map(({ hito, actividades }) => (
          <MeiHitoGroupCard
            key={hito.id}
            hito={hito}
            actividades={actividades}
          />
        ))}

        {column.orphans.length > 0 ? (
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground text-xs font-medium">
              Actividades sin hito vinculado
            </p>
            {column.orphans.map((item) => (
              <MeiItemCard key={item.id} item={item} variant="actividad" />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
