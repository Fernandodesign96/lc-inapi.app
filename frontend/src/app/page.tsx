import type { Metadata } from "next"
import Link from "next/link"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Acceso — Auditoría de lenguaje claro INAPI",
  description:
    "Portal de acceso al flujo mock de auditoría de lenguaje claro INAPI (sin autenticación en Fase 1).",
}

/** Modal y texto del botón «Acceder» (azul institucional). */
const MODAL_BLUE = "#0051A8"
const BAR_BLUE = "#0F69C4"
const BAR_RED = "#F63E32"

export default function Home() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex justify-end p-2 sm:right-6 sm:top-6">
        <div className="pointer-events-auto rounded-lg border border-border bg-background/90 p-1 shadow-sm backdrop-blur-sm">
          <ThemeToggle />
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-6 p-6 py-12 md:py-20">
        <div
          className="flex w-full flex-col gap-8 rounded-2xl p-8 text-white shadow-md ring-1 ring-white/10 dark:shadow-lg dark:ring-white/15"
          style={{ backgroundColor: MODAL_BLUE }}
        >
          {/* Barras iguales; ancho = ancho del bloque «INAPI» */}
          <div className="mx-auto flex w-max max-w-full flex-col items-stretch gap-3">
            <div className="flex h-2 w-full shrink-0" aria-hidden>
              <span
                className="min-h-0 flex-1"
                style={{ backgroundColor: BAR_BLUE }}
              />
              <span
                className="min-h-0 flex-1"
                style={{ backgroundColor: BAR_RED }}
              />
            </div>
            <p className="text-center font-heading text-3xl font-bold tracking-tight text-white uppercase">
              INAPI
            </p>
          </div>

          <h1 className="text-center text-base font-medium leading-snug text-white">
            Bienvenido al aplicativo de auditoría de lenguaje claro
          </h1>

          <Button
            asChild
            size="lg"
            className="w-full border-0 bg-white font-semibold shadow-sm hover:bg-white/90"
            style={{ color: MODAL_BLUE }}
          >
            <Link href="/auditar">Acceder</Link>
          </Button>
        </div>

        <p className="max-w-xl px-2 text-center text-sm leading-relaxed text-muted-foreground">
          Herramienta para auditar URLs de INAPI según el checklist editorial, CW 2.0 y RLC - Mock v1.0
        </p>
      </div>
    </div>
  )
}
