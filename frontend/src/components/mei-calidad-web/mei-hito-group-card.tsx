"use client"

import type { MeiItem } from "@contracts/mei-calidad-web-catalog"

import { MeiItemCard } from "@/components/mei-calidad-web/mei-item-card"

export function MeiHitoGroupCard({
  hito,
  actividades,
}: {
  hito: MeiItem
  actividades: MeiItem[]
}) {
  return (
    <div className="flex flex-col gap-2 border-l-4 border-primary/50 pl-3">
      <MeiItemCard item={hito} variant="hito" />
      {actividades.length > 0 ? (
        <div className="ms-1 flex flex-col gap-2 border-l border-border/80 ps-3">
          {actividades.map((actividad) => (
            <MeiItemCard
              key={actividad.id}
              item={actividad}
              variant="actividad"
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
