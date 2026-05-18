"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function CapturaInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlRaw = searchParams.get("url")

  if (!urlRaw) {
    router.replace("/auditar")
    return (
      <p className="text-muted-foreground text-sm">
        Redirigiendo al ingreso de URL…
      </p>
    )
  }

  let urlDecoded: string
  try {
    urlDecoded = decodeURIComponent(urlRaw)
  } catch {
    router.replace("/auditar")
    return null
  }

  const textoMock = [
    "Texto capturado (mock) — aún sin scraping real.",
    "",
    `Origen: ${urlDecoded}`,
    "",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.",
    "Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
  ].join("\n")

  return (
    <div className="flex w-full flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Texto a evaluar</CardTitle>
          <CardDescription>
            Vista previa mock del contenido que se enviaría a la evaluación. En
            el MVP real vendrá del scraping o del pegado manual.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            URL recibida:{" "}
            <span className="font-medium text-foreground">{urlDecoded}</span>
          </p>
          <pre className="max-h-[min(24rem,50vh)] w-full overflow-auto rounded-lg border border-border bg-muted/40 p-4 text-sm whitespace-pre-wrap">
            {textoMock}
          </pre>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          <Button asChild>
            <Link
              href={`/auditar/resultado?url=${encodeURIComponent(urlDecoded)}`}
            >
              Continuar al resultado
            </Link>
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/auditar">Volver a editar URL</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function CapturaPage() {
  return (
    <Suspense
      fallback={
        <p className="text-muted-foreground text-sm">Cargando vista previa…</p>
      }
    >
      <CapturaInner />
    </Suspense>
  )
}