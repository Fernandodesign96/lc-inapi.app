"use client"

import { cn } from "@/lib/utils"

const VIEWBOX = 36
const CX = 18
const CY = 18
/** Radio del trazo; circunferencia ≈ 94,25 (suficiente para dasharray). */
const R = 15
const CIRCUMFERENCE = 2 * Math.PI * R

function polarToScreen(percent: number) {
  const p = Math.min(100, Math.max(0, percent))
  return (p / 100) * CIRCUMFERENCE
}

export type CircularProgressIndeterminateProps = {
  className?: string
  /** Etiqueta accesible (indeterminado: no uses aria-valuenow). */
  "aria-label"?: string
  /** Tamaño en px del cuadro del SVG. */
  size?: number
}

/**
 * Spinner circular estilo kit (arco sobre pista), **sin porcentaje**.
 * Indeterminado: `role="progressbar"` sin valores numéricos (WAI-ARIA).
 */
export function CircularProgressIndeterminate({
  className,
  "aria-label": ariaLabel = "Procesando, sin porcentaje estimado",
  size = 48,
}: CircularProgressIndeterminateProps) {
  const arc = CIRCUMFERENCE * 0.28

  return (
    <div
      role="progressbar"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex shrink-0 motion-safe:animate-spin motion-reduce:animate-none",
        className,
      )}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
        className="block text-primary"
        aria-hidden
      >
        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          className="stroke-muted stroke-[2.5]"
        />
        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          className="stroke-current stroke-[2.5]"
          strokeLinecap="round"
          strokeDasharray={`${arc} ${CIRCUMFERENCE}`}
          transform={`rotate(-90 ${CX} ${CY})`}
        />
      </svg>
    </div>
  )
}

export type CircularProgressDeterminateProps = {
  /** 0–100 */
  value: number
  className?: string
  "aria-label"?: string
  size?: number
}

/**
 * Progreso circular **con porcentaje** visible y ARIA determinado.
 * Usar cuando exista avance real (p. ej. streaming o fases de la API).
 */
export function CircularProgressDeterminate({
  value,
  className,
  "aria-label": ariaLabel,
  size = 56,
}: CircularProgressDeterminateProps) {
  const v = Math.min(100, Math.max(0, value))
  const dash = polarToScreen(v)
  const label =
    ariaLabel ?? `Progreso de la auditoría: ${Math.round(v)} por ciento`

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(v)}
      aria-label={label}
      className={cn("relative inline-flex shrink-0", className)}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
        className="block text-primary"
        aria-hidden
      >
        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          className="stroke-muted stroke-[2.5]"
        />
        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          className="stroke-current stroke-[2.5]"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${CIRCUMFERENCE}`}
          transform={`rotate(-90 ${CX} ${CY})`}
        />
      </svg>
      <span
        className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs font-semibold tabular-nums text-foreground sm:text-sm"
        aria-hidden
      >
        {Math.round(v)}%
      </span>
    </div>
  )
}