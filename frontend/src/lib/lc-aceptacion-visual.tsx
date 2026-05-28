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