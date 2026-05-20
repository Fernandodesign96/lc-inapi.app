import { cn } from "@/lib/utils"

/** Agrupa etiquetas editoriales tipo «Rechazado» / «Aceptado con observaciones» / «Aprobado». */
export type LcEditorialBucket = "rechazado" | "intermedio" | "aprobado"

/** Agrupa frecuencia de auditorías mock (URLs más auditadas). */
export type SeguimientoVolumenBucket = "alto" | "medio" | "bajo"

export function lcEditorialBucketFromLabel(label: string): LcEditorialBucket {
  const s = label.toLowerCase()
  if (s.includes("rechaz")) return "rechazado"
  if (s.includes("aceptado") || s.includes("observaci")) return "intermedio"
  if (s.includes("aprobado")) return "aprobado"
  return "intermedio"
}

/** Misma lógica visual que filas de criterios en resultado (bandas + hover). */
export function inventoryRowClassFromLcEditorialBucket(
  bucket: LcEditorialBucket,
): string {
  return cn(
    "border-b border-border transition-colors",
    bucket === "rechazado" &&
      "border-l-4 border-l-destructive bg-destructive/5 hover:bg-destructive/10 dark:bg-destructive/10 dark:hover:bg-destructive/15",
    bucket === "intermedio" &&
      "border-l-4 border-l-amber-600/80 bg-muted/50 hover:bg-muted/70 dark:border-l-amber-500",
    bucket === "aprobado" &&
      "border-l-4 border-l-emerald-600 bg-emerald-50/70 hover:bg-emerald-100/80 dark:border-l-emerald-500 dark:bg-emerald-950/35 dark:hover:bg-emerald-950/50",
  )
}

export function inventoryEstadoPresentationFromEditorialBucket(
  bucket: LcEditorialBucket,
  etiqueta: string,
): {
  simbolo: string
  etiqueta: string
  simboloClass: string
  textoClass: string
} {
  switch (bucket) {
    case "rechazado":
      return {
        simbolo: "!",
        etiqueta,
        simboloClass: "text-destructive",
        textoClass: "text-foreground",
      }
    case "intermedio":
      return {
        simbolo: "?",
        etiqueta,
        simboloClass: "text-amber-700 dark:text-amber-400",
        textoClass: "text-muted-foreground",
      }
    case "aprobado":
      return {
        simbolo: "✓",
        etiqueta,
        simboloClass: "text-emerald-700 dark:text-emerald-400",
        textoClass: "text-foreground",
      }
  }
}

export function parsePorcentajeLcRef(ref: string): number | null {
  const cleaned = ref.replace("%", "").trim().replace(/\s/g, "").replace(",", ".")
  const n = parseFloat(cleaned)
  return Number.isFinite(n) ? n : null
}

/** Rangos de aceptación LC alineados al checklist (≤80 / 81–90 / ≥91). */
export function porcentajeLcTextClass(n: number | null): string {
  if (n === null) return "tabular-nums text-muted-foreground"
  if (n <= 80) return "tabular-nums font-semibold text-destructive"
  if (n <= 90)
    return "tabular-nums font-semibold text-amber-700 dark:text-amber-400"
  return "tabular-nums font-semibold text-emerald-700 dark:text-emerald-400"
}

export function seguimientoVolumenFromAuditorias(
  auditoriasRef: string,
): SeguimientoVolumenBucket {
  const n = Number.parseInt(auditoriasRef.replace(/\D/g, "") || "0", 10)
  if (n >= 20) return "alto"
  if (n >= 14) return "medio"
  return "bajo"
}

export function inventoryRowClassFromSeguimientoBucket(
  bucket: SeguimientoVolumenBucket,
): string {
  return inventoryRowClassFromLcEditorialBucket(
    bucket === "alto"
      ? "rechazado"
      : bucket === "medio"
        ? "intermedio"
        : "aprobado",
  )
}

export function seguimientoVolumenPresentation(bucket: SeguimientoVolumenBucket): {
  simbolo: string
  simboloClass: string
  etiquetaCorta: string
} {
  switch (bucket) {
    case "alto":
      return {
        simbolo: "!",
        simboloClass: "text-destructive",
        etiquetaCorta: "Alta frecuencia",
      }
    case "medio":
      return {
        simbolo: "?",
        simboloClass: "text-amber-700 dark:text-amber-400",
        etiquetaCorta: "Frecuencia media",
      }
    case "bajo":
      return {
        simbolo: "✓",
        simboloClass: "text-emerald-700 dark:text-emerald-400",
        etiquetaCorta: "Frecuencia habitual",
      }
  }
}

export function InventarioLeyendaLcEditorial() {
  return (
    <div
      className="flex flex-wrap gap-x-6 gap-y-1 border-b border-border px-0 py-2 text-xs text-muted-foreground"
      aria-label="Leyenda de estados editoriales LC"
    >
      <span className="inline-flex items-center gap-1.5">
        <span
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-destructive/15 font-semibold text-destructive"
          aria-hidden
        >
          !
        </span>
        Rechazado / prioridad
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-amber-500/15 font-semibold text-amber-800 dark:text-amber-300"
          aria-hidden
        >
          ?
        </span>
        Aceptado con observaciones
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-emerald-600/15 font-semibold text-emerald-800 dark:text-emerald-300"
          aria-hidden
        >
          ✓
        </span>
        Aprobado
      </span>
    </div>
  )
}

export function InventarioLeyendaSeguimientoVolumen() {
  return (
    <div
      className="flex flex-wrap gap-x-6 gap-y-1 border-b border-border px-0 py-2 text-xs text-muted-foreground"
      aria-label="Leyenda de frecuencia de auditorías de referencia"
    >
      <span className="inline-flex items-center gap-1.5">
        <span
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-destructive/15 font-semibold text-destructive"
          aria-hidden
        >
          !
        </span>
        Alta frecuencia (muchas auditorías ref.)
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-amber-500/15 font-semibold text-amber-800 dark:text-amber-300"
          aria-hidden
        >
          ?
        </span>
        Frecuencia media
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-emerald-600/15 font-semibold text-emerald-800 dark:text-emerald-300"
          aria-hidden
        >
          ✓
        </span>
        Frecuencia habitual
      </span>
    </div>
  )
}

export function CeldaEstadoEditorial({
  bucket,
  etiqueta,
}: {
  bucket: LcEditorialBucket
  etiqueta: string
}) {
  const pres = inventoryEstadoPresentationFromEditorialBucket(bucket, etiqueta)
  return (
    <span className="flex items-center gap-2">
      <span
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-sm font-bold leading-none",
          bucket === "rechazado" && "bg-destructive/15",
          bucket === "intermedio" && "bg-amber-500/15",
          bucket === "aprobado" && "bg-emerald-600/15",
        )}
        aria-hidden
      >
        <span className={pres.simboloClass}>{pres.simbolo}</span>
      </span>
      <span
        className={cn("text-sm font-medium leading-tight", pres.textoClass)}
      >
        {pres.etiqueta}
      </span>
    </span>
  )
}

export function CeldaIndicadorSeguimiento({
  bucket,
}: {
  bucket: SeguimientoVolumenBucket
}) {
  const pres = seguimientoVolumenPresentation(bucket)
  return (
    <span
      className="flex flex-col items-center gap-0.5"
      title={pres.etiquetaCorta}
    >
      <span
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-md text-sm font-bold leading-none",
          bucket === "alto" && "bg-destructive/15",
          bucket === "medio" && "bg-amber-500/15",
          bucket === "bajo" && "bg-emerald-600/15",
        )}
        aria-hidden
      >
        <span className={pres.simboloClass}>{pres.simbolo}</span>
      </span>
      <span className="max-w-18 text-center text-[10px] font-medium leading-tight text-muted-foreground">
        {pres.etiquetaCorta}
      </span>
    </span>
  )
}
