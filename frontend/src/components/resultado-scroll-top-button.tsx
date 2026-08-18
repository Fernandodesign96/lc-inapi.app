"use client"

import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * Botón fijo inferior izquierdo para volver al inicio de la página de resultado
 * cuando hay muchos acordeones abiertos.
 */
export function ResultadoScrollTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 320)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <Button
      type="button"
      size="icon"
      variant="default"
      className={cn(
        "fixed bottom-6 left-4 z-40 size-11 rounded-full shadow-md transition-opacity",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-label="Volver al inicio de la página"
      onClick={() => {
        window.scrollTo({ top: 0, behavior: "smooth" })
      }}
    >
      <ArrowUp className="size-5" aria-hidden />
    </Button>
  )
}
