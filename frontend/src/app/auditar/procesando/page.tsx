"use client"

import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { CircularProgressIndeterminate } from "@/components/ui/circular-progress"
import { Button } from "@/components/ui/button"
import {
  AUDITAR_PROCESANDO_ANUNCIO,
  AUDITAR_PROCESANDO_DESCRIPCION,
  AUDITAR_PROCESANDO_DESCRIPCION_MOCK,
  AUDITAR_PROCESANDO_MS,
  AUDITAR_PROCESANDO_POLL_MS,
  AUDITAR_PROCESANDO_TITULO,
  AUDITAR_PROCESANDO_TITULO_MOCK,
} from "@/lib/auditar-procesando-copy"

type JobPoll = {
  id: string
  status: string
  url: string
  message: string
  auditId?: string
  errorMessage?: string
}

type JobResult = {
  status: string
  auditId: string
  descargas: {
    resultadoPath: string
    pdfPath: string
    excelPath?: string
  }
}

function isStubAuditId(auditId: string): boolean {
  return auditId.startsWith("stub-")
}

function JobProcesando({ jobId }: { jobId: string }) {
  const router = useRouter()
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [poll, setPoll] = useState<JobPoll | null>(null)
  const [fatal, setFatal] = useState<string | null>(null)
  const [stubDone, setStubDone] = useState(false)

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  useEffect(() => {
    let cancelled = false
    let timer: number | undefined

    async function tick() {
      try {
        const res = await fetch(`/api/audit-jobs/${encodeURIComponent(jobId)}`)
        if (res.status === 404) {
          if (!cancelled) setFatal("No encontramos esta solicitud de auditoría.")
          return
        }
        if (!res.ok) {
          if (!cancelled) setFatal("No se pudo consultar el estado. Reintenta más tarde.")
          return
        }
        const data = (await res.json()) as JobPoll
        if (cancelled) return
        setPoll(data)

        if (data.status === "failed") {
          setFatal(data.errorMessage ?? data.message)
          return
        }

        if (data.status === "done") {
          const resultRes = await fetch(
            `/api/audit-jobs/${encodeURIComponent(jobId)}/result`,
          )
          if (!resultRes.ok) {
            if (!cancelled) {
              setFatal("La auditoría terminó, pero no se pudo cargar el resultado.")
            }
            return
          }
          const result = (await resultRes.json()) as JobResult
          if (cancelled) return
          if (isStubAuditId(result.auditId)) {
            setStubDone(true)
            return
          }
          router.replace(result.descargas.resultadoPath)
          return
        }

        timer = window.setTimeout(tick, AUDITAR_PROCESANDO_POLL_MS)
      } catch {
        if (!cancelled) {
          setFatal("Error de red al consultar el estado.")
        }
      }
    }

    void tick()
    return () => {
      cancelled = true
      if (timer !== undefined) window.clearTimeout(timer)
    }
  }, [jobId, router])

  const statusText =
    fatal ??
    (stubDone
      ? "La solicitud terminó (modo prueba del worker). Aún no hay informe canónico para abrir."
      : (poll?.message ?? AUDITAR_PROCESANDO_DESCRIPCION))

  const showSpinner = !fatal && !stubDone

  return (
    <main
      aria-busy={showSpinner}
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

      {showSpinner ? (
        <CircularProgressIndeterminate
          size={160}
          aria-label="Procesando auditoría, sin porcentaje estimado"
          className="text-primary"
        />
      ) : null}

      <div
        role="status"
        aria-live="polite"
        className="w-full max-w-5xl px-1 text-center text-sm leading-snug text-foreground text-balance sm:px-4 sm:text-base sm:leading-snug"
      >
        {statusText}
      </div>

      <div className="flex w-full max-w-5xl justify-end gap-2 px-1 sm:px-4">
        <Button type="button" variant="outline" asChild>
          <Link href="/auditar">
            {fatal || stubDone ? "Volver" : "Cancelar y Volver"}
          </Link>
        </Button>
      </div>
    </main>
  )
}

function MockProcesando() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlRaw = searchParams.get("url")
  const fixtureRaw = searchParams.get("fixture")
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
    const fixtureQ =
      fixtureRaw && fixtureRaw.trim().length > 0
        ? `&fixture=${encodeURIComponent(fixtureRaw.trim())}`
        : ""
    const id = window.setTimeout(() => {
      router.replace(
        `/auditar/resultado?url=${encodeURIComponent(auditUrl)}${fixtureQ}`,
      )
    }, AUDITAR_PROCESANDO_MS)
    return () => window.clearTimeout(id)
  }, [auditUrl, fixtureRaw, router])

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
        {AUDITAR_PROCESANDO_TITULO_MOCK}
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
        {AUDITAR_PROCESANDO_DESCRIPCION_MOCK}
      </div>

      <div className="flex w-full max-w-5xl justify-end px-1 sm:px-4">
        <Button type="button" variant="outline" asChild>
          <Link href="/auditar">Cancelar y Volver</Link>
        </Button>
      </div>
    </main>
  )
}

function ProcesandoInner() {
  const searchParams = useSearchParams()
  const jobId = searchParams.get("jobId")?.trim()

  if (jobId) {
    return <JobProcesando jobId={jobId} />
  }

  return <MockProcesando />
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
