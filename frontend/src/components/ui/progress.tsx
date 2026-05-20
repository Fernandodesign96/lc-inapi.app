"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root> & {
  /** Clases Tailwind solo para la franja de avance (p. ej. bg-destructive). */
  indicatorClassName?: string
}

function Progress({
  className,
  indicatorClassName,
  value,
  max = 100,
  ...props
}: ProgressProps) {
  const numericMax = max ?? 100
  const raw = value ?? 0
  const ratio =
    numericMax <= 0 ? 0 : Math.min(1, Math.max(0, raw / numericMax))
  const percentFill = ratio * 100

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      max={numericMax}
      value={raw}
      className={cn(
        "relative h-2.5 w-full overflow-hidden rounded-full bg-muted",
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "h-full w-full flex-1 origin-left transition-transform duration-500 ease-out",
          indicatorClassName,
        )}
        style={{
          transform: `translateX(-${100 - percentFill}%)`,
        }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }