"use client"

import { Suspense, useEffect, useMemo, useRef } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { CircularProgressIndeterminate } from "@/components/ui/circular-progress"
import { Button } from "@/components/ui/button"
import {
  AUDITAR_PROCESANDO_ANUNCIO,
  AUDITAR_PROCESANDO_DESCRIPCION,
  AUDITAR_PROCESANDO_MS,
  AUDITAR_PROCESANDO_TITULO,
} from "@/lib/auditar-procesando-copy"

function ProcesandoInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlRaw = searchParams.get("url")
  const titleRef = useRef<HTMLHeadingElement>(null)

  const auditUrl = useMemo(() => {
    if (!urlRaw) return null
    try {
      return new URL(decodeURIComponent(urlRaw)).toString()
    } catch {
      return null
    }
  }, [urlRaw])

  useEffect(() => {
    if (!auditUrl) {
      router.replace("/auditar")
      return
    }
    const id = window.setTimeout(() => {
      router.replace(
        `/auditar/resultado?url=${encodeURIComponent(auditUrl)}`,
      )
    }, AUDITAR_PROCESANDO_MS)
    return () => window.clearTimeout(id)
  }, [auditUrl, router])

  useEffect(() => {
    if (!auditUrl) return
    titleRef.current?.focus()
  }, [auditUrl])

  if (!urlRaw) {
    return (
      <p className="text-muted-foreground text-sm">
        Redirigiendo al ingreso de URL…
      </p>
    )
  }

  if (!auditUrl) {
    return (
      <p className="text-muted-foreground text-sm">URL inválida…</p>
    )
  }

  return (
    <main
      aria-busy="true"
      className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 pb-10 pt-2"
    >
      <span className="sr-only">{AUDITAR_PROCESANDO_ANUNCIO}</span>

      <h1
        ref={titleRef}
        tabIndex={-1}
        className="font-heading text-center text-xl font-semibold leading-tight text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:text-2xl"
      >
        {AUDITAR_PROCESANDO_TITULO}
      </h1>

      <CircularProgressIndeterminate
        size={160}
        aria-label="Procesando auditoría de demostración, sin porcentaje estimado"
        className="text-primary"
      />

      <div
        role="status"
        aria-live="polite"
        className="w-full max-w-5xl px-1 text-center text-sm leading-snug text-foreground text-balance sm:px-4 sm:text-base sm:leading-snug"
      >
        {AUDITAR_PROCESANDO_DESCRIPCION}
      </div>

      <div className="flex w-full max-w-5xl justify-end px-1 sm:px-4">
        <Button type="button" variant="outline" asChild>
          <Link href="/auditar">Cancelar y Volver</Link>
        </Button>
      </div>
    </main>
  )
}

export default function ProcesandoPage() {
  return (
    <Suspense
      fallback={
        <p role="status" className="text-muted-foreground text-sm">
          Cargando…
        </p>
      }
    >
      <ProcesandoInner />
    </Suspense>
  )
}