"use client"

import { useEffect } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function MeiCalidadWebError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[mei-calidad-web]", error)
  }, [error])

  const isCatalog =
    error.name === "MeiCatalogLoadError" ||
    error.message.includes("catálogo MEI") ||
    error.message.includes("catalog.json")

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 py-10">
      <h1 className="font-heading text-xl font-semibold tracking-tight">
        No se pudo cargar MEI Calidad Web
      </h1>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {isCatalog
          ? "Falta el catálogo PTD (data/mei-calidad-web/catalog.json) o la ruta del monorepo. En local use LC_REPO_ROOT o ejecute el frontend desde el monorepo; en Vercel incluya data/ o defina LC_REPO_ROOT."
          : "Ocurrió un error al renderizar esta sección. Revise la consola del servidor para el detalle."}
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
        <Button asChild variant="outline">
          <Link href="/auditar">Ir a Auditar</Link>
        </Button>
      </div>
    </div>
  )
}
