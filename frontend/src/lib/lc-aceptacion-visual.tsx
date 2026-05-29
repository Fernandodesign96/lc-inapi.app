import {
    acceptanceStatusFromPercentage,
    type AcceptanceStatus,
  } from "@contracts/checklist"
  
  import { ETIQUETA_ESTADO_ACEPTACION } from "@/lib/resultado-mock-copy"
  import { cn } from "@/lib/utils"
  import { parsePorcentajeLcRef } from "@/lib/inventory-table-visuals"

export type LcAceptacionBucket = AcceptanceStatus | "no_aplica"

export function lcAceptacionBucketFromPorcentaje(
    pct: number | null,
  ): LcAceptacionBucket {
    if (pct === null) return "no_aplica"
    return acceptanceStatusFromPercentage(pct)
  }

export function lcAceptacionBucketFromLabel(label: string): LcAceptacionBucket {
  const s = label.trim().toLowerCase()
  if (s.includes("no aplica") || s === "n/a" || s === "—") return "no_aplica"
  if (s.includes("rechaz")) return "rechazado"
  if (s.includes("aprobado")) return "aprobado"
  if (s.includes("aceptado") || s.includes("observaci")) {
    return "aceptado_con_observaciones"
  }
  return "no_aplica"
}

export function resolveLcAceptacionBucket(input: {
  porcentajeLcRef?: string
  estadoLcRef?: string
}): LcAceptacionBucket {
  const pct = input.porcentajeLcRef
    ? parsePorcentajeLcRef(input.porcentajeLcRef)
    : null
  if (pct !== null) return lcAceptacionBucketFromPorcentaje(pct)
  if (input.estadoLcRef) return lcAceptacionBucketFromLabel(input.estadoLcRef)
  return "no_aplica"
}

export function etiquetaLcAceptacion(bucket: LcAceptacionBucket): string {
    if (bucket === "no_aplica") return "No aplica"
    return ETIQUETA_ESTADO_ACEPTACION[bucket]
}

export type PresentacionLcAceptacion = {
    simbolo: string
    simboloCompacto?: boolean
    etiqueta: string
    simboloClass: string
    textoClass: string
    cajaSimboloClass: string
}
  
export function presentacionLcAceptacion(
    bucket: LcAceptacionBucket,
    etiquetaOverride?: string,
): PresentacionLcAceptacion {
    const etiqueta = etiquetaOverride ?? etiquetaLcAceptacion(bucket)
  
    switch (bucket) {
      case "rechazado":
        return {
          simbolo: "!",
          etiqueta,
          simboloClass: "text-destructive",
          textoClass: "text-foreground",
          cajaSimboloClass: "bg-destructive/15",
        }
      case "aceptado_con_observaciones":
        return {
          simbolo: "✓",
          etiqueta,
          simboloClass: "text-sky-700 dark:text-sky-300",
          textoClass: "text-foreground",
          cajaSimboloClass: "bg-sky-500/20",
        }
      case "aprobado":
        return {
          simbolo: "✓✓",
          simboloCompacto: true,
          etiqueta,
          simboloClass: "text-emerald-700 dark:text-emerald-400",
          textoClass: "text-foreground",
          cajaSimboloClass: "bg-emerald-600/15",
        }
      case "no_aplica":
        return {
          simbolo: "—",
          etiqueta,
          simboloClass: "text-muted-foreground",
          textoClass: "text-muted-foreground",
          cajaSimboloClass: "bg-muted",
        }
    }
}

export function inventoryRowClassFromLcAceptacionBucket(
  bucket: LcAceptacionBucket,
): string {
  return cn(
    "border-b border-border transition-colors",
    bucket === "rechazado" &&
      "border-l-4 border-l-destructive bg-destructive/5 hover:bg-destructive/10 dark:bg-destructive/10 dark:hover:bg-destructive/15",
    bucket === "aceptado_con_observaciones" &&
      "border-l-4 border-l-amber-600/80 bg-muted/50 hover:bg-muted/70 dark:border-l-amber-500",
    bucket === "aprobado" &&
      "border-l-4 border-l-emerald-600 bg-emerald-50/70 hover:bg-emerald-100/80 dark:border-l-emerald-500 dark:bg-emerald-950/35 dark:hover:bg-emerald-950/50",
    bucket === "no_aplica" &&
      "border-l-4 border-l-muted-foreground/40 bg-muted/70 hover:bg-muted/85 dark:border-l-muted-foreground/50 dark:bg-muted/50 dark:hover:bg-muted/65",
  )
}

export function porcentajeLcAceptacionTextClass(n: number | null): string {
  if (n === null) return "tabular-nums text-muted-foreground"
  if (n <= 80) return "tabular-nums font-semibold text-destructive"
  if (n <= 90)
    return "tabular-nums font-semibold text-sky-700 dark:text-sky-300"
  return "tabular-nums font-semibold text-emerald-700 dark:text-emerald-400"
}

export function InventarioLeyendaLcAceptacion() {
  return (
    <div
      className="flex flex-wrap gap-x-6 gap-y-1 border-b border-border px-0 py-2 text-xs text-muted-foreground"
      aria-label="Leyenda de estados de aceptación LC"
    >
      <span className="inline-flex items-center gap-1.5">
        <span
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-destructive/15 font-semibold text-destructive"
          aria-hidden
        >
          !
        </span>
        Rechazado (≤ 80 %)
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-sky-500/20 font-semibold text-sky-700 dark:text-sky-300"
          aria-hidden
        >
          ✓
        </span>
        Aceptado con observaciones (81–90 %)
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span
          className="flex h-5 w-7 shrink-0 items-center justify-center rounded-sm bg-emerald-600/15 px-0.5 text-[11px] font-semibold tracking-tight text-emerald-800 dark:text-emerald-300"
          aria-hidden
        >
          ✓✓
        </span>
        Aprobado (≥ 91 %)
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span
          className="flex h-5 w-7 shrink-0 items-center justify-center rounded-sm bg-muted px-0.5 text-[11px] font-semibold text-muted-foreground"
          aria-hidden
        >
          —
        </span>
        No aplica
      </span>
    </div>
  )
}

export function CeldaEstadoLcAceptacion({
  bucket,
  etiqueta,
}: {
  bucket: LcAceptacionBucket
  etiqueta?: string
}) {
  const pres = presentacionLcAceptacion(bucket, etiqueta)

  return (
    <span className="flex items-center gap-2">
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-md font-bold leading-none",
          pres.simboloCompacto
            ? "h-7 min-w-8 px-1 text-[11px] font-semibold tracking-tight"
            : "h-7 w-7 text-sm",
          pres.cajaSimboloClass,
        )}
        aria-hidden
      >
        <span className={pres.simboloClass}>{pres.simbolo}</span>
      </span>
      <span className={cn("text-sm font-medium leading-tight", pres.textoClass)}>
        {pres.etiqueta}
      </span>
    </span>
  )
}