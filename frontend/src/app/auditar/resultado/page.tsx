"use client"

import { Suspense, useMemo } from "react"
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
import { buildDemoStrictAudit } from "@contracts/checklist"

function ResultadoInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlRaw = searchParams.get("url")

  const urlDecoded = useMemo(() => {
    if (!urlRaw) return null
    try {
      return decodeURIComponent(urlRaw)
    } catch {
      return null
    }
  }, [urlRaw])

  const auditUrl = useMemo(() => {
    if (!urlDecoded) return null
    try {
      return new URL(urlDecoded).toString()
    } catch {
      return null
    }
  }, [urlDecoded])

  const auditoria = useMemo(() => {
    if (!auditUrl) return null
    return buildDemoStrictAudit({
      url: auditUrl,
      texto_capturado: `(mock) Contenido evaluado para ${auditUrl}`,
    })
  }, [auditUrl])

  if (!urlDecoded) {
    router.replace("/auditar")
    return (
      <p className="text-muted-foreground text-sm">
        Redirigiendo al ingreso de URL…
      </p>
    )
  }

  if (!auditUrl) {
    router.replace("/auditar")
    return (
      <p className="text-muted-foreground text-sm">URL inválida…</p>
    )
  }

  if (!auditoria) {
    return null
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Resultado de la auditoría (mock)</CardTitle>
          <CardDescription>
            Datos generados con{" "}
            <code className="rounded bg-muted px-1 text-xs">
              buildDemoStrictAudit
            </code>{" "}
            desde <code className="rounded bg-muted px-1 text-xs">@contracts/checklist</code>.
            Las 39 filas cumplen{" "}
            <code className="rounded bg-muted px-1 text-xs">
              strictAuditRecordSchema
            </code>
            .
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <p>
              <span className="text-muted-foreground">URL:</span>{" "}
              <span className="font-medium break-all">{auditoria.url}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Checklist:</span>{" "}
              <span className="font-medium">{auditoria.version_checklist}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Cumplimiento:</span>{" "}
              <span className="font-medium">
                {auditoria.porcentaje_cumplimiento} %
              </span>
            </p>
            <p>
              <span className="text-muted-foreground">Estado:</span>{" "}
              <span className="font-medium">{auditoria.estado_aceptacion}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Aprobados:</span>{" "}
              {auditoria.criterios_aprobados} / aplicables{" "}
              {auditoria.criterios_aplicables}
            </p>
            <p>
              <span className="text-muted-foreground">N/A:</span>{" "}
              {auditoria.criterios_no_aplica}
            </p>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-3 py-2 font-medium">Criterio</th>
                  <th className="px-3 py-2 font-medium">Estado</th>
                  <th className="px-3 py-2 font-medium">Severidad</th>
                  <th className="px-3 py-2 font-medium">Comentario</th>
                </tr>
              </thead>
              <tbody>
                {auditoria.criterios_evaluados.map((row) => (
                  <tr key={row.id} className="border-b last:border-0">
                    <td className="px-3 py-2 font-mono text-xs">{row.id}</td>
                    <td className="px-3 py-2">{row.estado}</td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {row.severidad ?? "—"}
                    </td>
                    <td className="max-w-xs truncate px-3 py-2 text-muted-foreground">
                      {row.comentario ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" asChild>
            <Link href="/auditar">Nueva auditoría</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function ResultadoPage() {
  return (
    <Suspense
      fallback={
        <p className="text-muted-foreground text-sm">Cargando resultado…</p>
      }
    >
      <ResultadoInner />
    </Suspense>
  )
}