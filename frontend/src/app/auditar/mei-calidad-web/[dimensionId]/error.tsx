"use client"

import { useEffect } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function MeiDimensionError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[mei-calidad-web/dimension]", error)
  }, [error])

  const isCatalog =
    error.name === "MeiCatalogLoadError" ||
    error.message.includes("catálogo MEI") ||
    error.message.includes("catalog.json")

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 py-10">
      <h1 className="font-heading text-xl font-semibold tracking-tight">
        No se pudo abrir la dimensión MEI
      </h1>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {isCatalog
          ? "Falta el catálogo PTD o la ruta del monorepo (LC_REPO_ROOT / data/mei-calidad-web/)."
          : "Ocurrió un error al cargar las subdimensiones. Revise el log del servidor."}
      </p>
      {error.message ? (
        <pre className="overflow-x-auto rounded-lg border border-border bg-muted/40 p-3 text-xs whitespace-pre-wrap">
          {error.message}
          {error.digest ? `\nDigest: ${error.digest}` : ""}
        </pre>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={reset}>
          Reintentar
        </Button>
        <Button asChild variant="secondary">
          <Link href="/auditar/mei-calidad-web">Volver al índice MEI</Link>
        </Button>
      </div>
    </div>
  )
}
