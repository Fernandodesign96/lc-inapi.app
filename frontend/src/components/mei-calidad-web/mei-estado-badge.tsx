import type { MeiItemEstado } from "@contracts/mei-calidad-web-catalog"

import { cn } from "@/lib/utils"

const ESTADO_LABELS: Record<MeiItemEstado, string> = {
  pendiente: "Pendiente",
  en_progreso: "En progreso",
  completado: "Completado",
}

const ESTADO_CLASSES: Record<MeiItemEstado, string> = {
  pendiente: "bg-muted text-muted-foreground",
  en_progreso: "bg-amber-500/15 text-amber-800 dark:text-amber-200",
  completado: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200",
}

export function MeiEstadoBadge({
  estado,
  className,
}: {
  estado: MeiItemEstado
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        ESTADO_CLASSES[estado],
        className,
      )}
    >
      {ESTADO_LABELS[estado]}
    </span>
  )
}
