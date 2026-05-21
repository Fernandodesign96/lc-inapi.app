import type { CriterionEvaluation } from "@contracts/checklist"

import { cn } from "@/lib/utils"

type SeveridadCriterio = NonNullable<CriterionEvaluation["severidad"]>

/** Mismo alto y ancho para todas las pastillas (ancho acorde a «correcta»). */
export const PASTILLA_SEVERIDAD_DIMENSIONES =
  "inline-flex h-7 w-[7.5rem] shrink-0 items-center justify-center rounded-md border px-1.5 text-xs font-medium leading-none"

export type PastillaSeveridadVisual = SeveridadCriterio | "correcta" | "na"

function severidadIncumple(
  row: CriterionEvaluation,
): SeveridadCriterio {
  return row.severidad ?? "alta"
}

/** Fila de tabla: barra izquierda y fondo alineados a severidad (incumple) o estado. */
export function filaCriterioClassName(row: CriterionEvaluation): string {
  const { estado } = row
  if (estado === "no_aplica") {
    return cn(
      "border-b border-border transition-colors",
      "border-l-4 border-l-muted-foreground/40 bg-muted/70 hover:bg-muted/85 dark:border-l-muted-foreground/50 dark:bg-muted/50 dark:hover:bg-muted/65",
    )
  }
  if (estado === "cumple") {
    return cn(
      "border-b border-border transition-colors",
      "border-l-4 border-l-emerald-600 bg-emerald-50/70 hover:bg-emerald-100/80 dark:border-l-emerald-500 dark:bg-emerald-950/35 dark:hover:bg-emerald-950/50",
    )
  }
  const sev = severidadIncumple(row)
  if (sev === "alta") {
    return cn(
      "border-b border-border transition-colors",
      "border-l-4 border-l-destructive bg-destructive/5 hover:bg-destructive/10 dark:bg-destructive/10 dark:hover:bg-destructive/15",
    )
  }
  if (sev === "media") {
    return cn(
      "border-b border-border transition-colors",
      "border-l-4 border-l-amber-600 bg-amber-50/80 hover:bg-amber-100/90 dark:border-l-amber-500 dark:bg-amber-950/25 dark:hover:bg-amber-950/40",
    )
  }
  return cn(
    "border-b border-border transition-colors",
    "border-l-4 border-l-sky-600 bg-sky-50/80 hover:bg-sky-100/90 dark:border-l-sky-500 dark:bg-sky-950/30 dark:hover:bg-sky-950/45",
  )
}

export type PresentacionCriterio = {
  simbolo: string
  /** Si true, mostrar símbolo en tracking compacto (p. ej. ✓✓). */
  simboloCompacto?: boolean
  /** Caja del símbolo en monoespaciado cuando convenga (p. ej. «✓✓» compacto). */
  simboloMono?: boolean
  etiqueta: string
  simboloClass: string
  textoClass: string
  cajaSimboloClass: string
}

export function presentacionCriterio(row: CriterionEvaluation): PresentacionCriterio {
  if (row.estado === "no_aplica") {
    return {
      simbolo: "—",
      simboloCompacto: true,
      etiqueta: "No aplica",
      simboloClass: "text-muted-foreground",
      textoClass: "text-muted-foreground",
      cajaSimboloClass: "bg-muted",
    }
  }
  if (row.estado === "cumple") {
    return {
      simbolo: "✓✓",
      simboloCompacto: true,
      etiqueta: "Cumple",
      simboloClass: "text-emerald-700 dark:text-emerald-400",
      textoClass: "text-foreground",
      cajaSimboloClass: "bg-emerald-600/15",
    }
  }
  const sev = severidadIncumple(row)
  if (sev === "alta") {
    return {
      simbolo: "!",
      etiqueta: "No cumple",
      simboloClass: "text-destructive",
      textoClass: "text-foreground",
      cajaSimboloClass: "bg-destructive/15",
    }
  }
  if (sev === "media") {
    return {
      simbolo: "?",
      etiqueta: "Medianamente cumple",
      simboloClass: "text-amber-800 dark:text-amber-300",
      textoClass: "text-foreground",
      cajaSimboloClass: "bg-amber-500/20",
    }
  }
  return {
    simbolo: "✓",
    etiqueta: "Cumple con observaciones",
    simboloClass: "text-sky-700 dark:text-sky-300",
    textoClass: "text-foreground",
    cajaSimboloClass: "bg-sky-500/20",
  }
}

export function pastillaSeveridadLabel(
  row: CriterionEvaluation,
): PastillaSeveridadVisual {
  if (row.estado === "cumple") return "correcta"
  if (row.estado === "incumple") return severidadIncumple(row)
  return "na"
}

export function pastillaSeveridadClass(
  pastilla: PastillaSeveridadVisual,
): string {
  return cn(
    PASTILLA_SEVERIDAD_DIMENSIONES,
    pastilla === "alta" &&
      "border-destructive/45 bg-destructive/10 text-destructive",
    pastilla === "media" &&
      "border-amber-600/55 bg-amber-500/15 text-amber-950 dark:text-amber-50",
    pastilla === "baja" &&
      "border-sky-600/50 bg-sky-500/12 text-sky-950 dark:text-sky-50",
    pastilla === "correcta" &&
      "border-emerald-600/50 bg-emerald-600/12 text-emerald-900 dark:text-emerald-100",
    pastilla === "na" &&
      "border-muted-foreground/35 bg-muted/80 text-muted-foreground",
  )
}

export function pastillaSeveridadTexto(pastilla: PastillaSeveridadVisual): string {
  if (pastilla === "correcta") return "correcta"
  if (pastilla === "na") return "—"
  return pastilla
}
