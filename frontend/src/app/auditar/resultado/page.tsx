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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { buildDemoStrictAudit, type CriterionEvaluation } from "@contracts/checklist"
import { buildStrictAuditForAuditarUrl } from "@/lib/editorial-shortcut-audit-mock"
import { cn } from "@/lib/utils"

type EstadoCriterio = CriterionEvaluation["estado"]
type SeveridadCriterio = NonNullable<CriterionEvaluation["severidad"]>

function filaCriterioClassName(estado: EstadoCriterio): string {
  return cn(
    "border-b border-border transition-colors",
    estado === "incumple" &&
      "border-l-4 border-l-destructive bg-destructive/5 hover:bg-destructive/10 dark:bg-destructive/10 dark:hover:bg-destructive/15",
    estado === "no_aplica" &&
      "border-l-4 border-l-amber-600/80 bg-muted/50 hover:bg-muted/70 dark:border-l-amber-500",
    estado === "cumple" &&
      "border-l-4 border-l-emerald-600 bg-emerald-50/70 hover:bg-emerald-100/80 dark:border-l-emerald-500 dark:bg-emerald-950/35 dark:hover:bg-emerald-950/50",
  )
}

function presentacionEstado(estado: EstadoCriterio): {
  simbolo: string
  etiqueta: string
  simboloClass: string
  textoClass: string
} {
  switch (estado) {
    case "incumple":
      return {
        simbolo: "!",
        etiqueta: "No cumple",
        simboloClass: "text-destructive",
        textoClass: "text-foreground",
      }
    case "no_aplica":
      return {
        simbolo: "?",
        etiqueta: "No aplica",
        simboloClass: "text-amber-700 dark:text-amber-400",
        textoClass: "text-muted-foreground",
      }
    case "cumple":
      return {
        simbolo: "✓",
        etiqueta: "Cumple",
        simboloClass: "text-emerald-700 dark:text-emerald-400",
        textoClass: "text-foreground",
      }
  }
}

function severidadChipClass(sev: SeveridadCriterio): string {
  return cn(
    "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium tabular-nums",
    sev === "alta" &&
      "border-destructive/45 bg-destructive/10 text-destructive",
    sev === "media" &&
      "border-amber-500/55 bg-amber-500/10 text-amber-950 dark:text-amber-50",
    sev === "baja" && "border-border bg-muted text-muted-foreground",
  )
}

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
    const texto = `(mock) Contenido evaluado para ${auditUrl}`
    return (
      buildStrictAuditForAuditarUrl(auditUrl, texto) ??
      buildDemoStrictAudit({
        url: auditUrl,
        texto_capturado: texto,
      })
    )
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
        <CardHeader className="gap-4 space-y-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1 space-y-1.5">
              <CardTitle>Resultado de la auditoría (mock)</CardTitle>
              <CardDescription>
                Datos generados con{" "}
                <code className="rounded bg-muted px-1 text-xs">
                  buildDemoStrictAudit
                </code>{" "}
                desde{" "}
                <code className="rounded bg-muted px-1 text-xs">
                  @contracts/checklist
                </code>
                . Las 39 filas cumplen{" "}
                <code className="rounded bg-muted px-1 text-xs">
                  strictAuditRecordSchema
                </code>
                .
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              className="shrink-0 self-start sm:self-auto"
              asChild
            >
              <Link href="/auditar">Regresar</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <section
            className="overflow-hidden rounded-lg border border-border shadow-sm"
            aria-labelledby="resultado-resumen-titulo"
          >
            <div
              id="resultado-resumen-titulo"
              className="bg-[#0F69C4] px-4 py-3 text-sm font-semibold text-white"
            >
              Resumen
            </div>
            <div className="bg-[#FFFFFF] p-4">
              <div className="grid gap-2 text-sm sm:grid-cols-2">
                <p>
                  <span className="text-muted-foreground">URL:</span>{" "}
                  <span className="font-medium break-all">{auditoria.url}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Checklist:</span>{" "}
                  <span className="font-medium">
                    {auditoria.version_checklist}
                  </span>
                </p>
                <p>
                  <span className="text-muted-foreground">Cumplimiento:</span>{" "}
                  <span className="font-medium">
                    {auditoria.porcentaje_cumplimiento} %
                  </span>
                </p>
                <p>
                  <span className="text-muted-foreground">Estado:</span>{" "}
                  <span className="font-medium">
                    {auditoria.estado_aceptacion}
                  </span>
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
            </div>
          </section>

          {(auditoria.observaciones_lc || auditoria.texto_propuesto) ? (
            <div className="space-y-4">
              {auditoria.observaciones_lc ? (
                <section className="overflow-hidden rounded-lg border border-border shadow-sm">
                  <div className="bg-[#0F69C4] px-4 py-3 text-sm font-semibold text-white">
                    Observaciones
                  </div>
                  <div className="bg-[#FFFFFF] p-4">
                    <p className="text-sm leading-relaxed text-foreground">
                      {auditoria.observaciones_lc}
                    </p>
                  </div>
                </section>
              ) : null}
              {auditoria.texto_propuesto ? (
                <section className="overflow-hidden rounded-lg border border-border shadow-sm">
                  <div className="bg-[#0F69C4] px-4 py-3 text-sm font-semibold text-white">
                    Texto propuesto
                  </div>
                  <div className="bg-[#FFFFFF] p-4">
                    <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
                      {auditoria.texto_propuesto}
                    </p>
                  </div>
                </section>
              ) : null}
            </div>
          ) : null}

          <section
            className="overflow-hidden rounded-lg border border-border shadow-sm"
            aria-labelledby="resultado-criterios-titulo"
          >
            <div
              id="resultado-criterios-titulo"
              className="bg-[#0F69C4] px-4 py-3 text-sm font-semibold text-white"
            >
              Criterios evaluados
            </div>
            <div className="bg-[#FFFFFF] p-0">
              <div
                className="flex flex-wrap gap-x-6 gap-y-1 border-b border-border px-4 py-2 text-xs text-muted-foreground"
                aria-label="Leyenda de símbolos por estado de criterio"
              >
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-destructive/15 font-semibold text-destructive"
                    aria-hidden
                  >
                    !
                  </span>
                  No cumple
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-amber-500/15 font-semibold text-amber-800 dark:text-amber-300"
                    aria-hidden
                  >
                    ?
                  </span>
                  No aplica
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-emerald-600/15 font-semibold text-emerald-800 dark:text-emerald-300"
                    aria-hidden
                  >
                    ✓
                  </span>
                  Cumple
                </span>
              </div>
              <Table className="min-w-[36rem]">
                <TableHeader>
                  <TableRow className="border-b border-border bg-muted/50 hover:bg-muted/50">
                    <TableHead className="min-w-[4rem]">Criterio</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Severidad</TableHead>
                    <TableHead>Comentario</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditoria.criterios_evaluados.map((row) => {
                    const pres = presentacionEstado(row.estado)
                    return (
                      <TableRow
                        key={row.id}
                        className={filaCriterioClassName(row.estado)}
                      >
                        <TableCell className="font-mono text-xs font-medium">
                          {row.id}
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-2">
                            <span
                              className={cn(
                                "flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-sm font-bold leading-none",
                                row.estado === "incumple" && "bg-destructive/15",
                                row.estado === "no_aplica" && "bg-amber-500/15",
                                row.estado === "cumple" && "bg-emerald-600/15",
                              )}
                              aria-hidden
                            >
                              <span className={pres.simboloClass}>
                                {pres.simbolo}
                              </span>
                            </span>
                            <span
                              className={cn(
                                "text-sm font-medium leading-tight",
                                pres.textoClass,
                              )}
                            >
                              {pres.etiqueta}
                            </span>
                          </span>
                        </TableCell>
                        <TableCell>
                          {row.severidad ? (
                            <span
                              className={severidadChipClass(row.severidad)}
                            >
                              {row.severidad}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell
                          className="max-w-[min(100vw,24rem)] text-sm leading-snug text-foreground"
                          title={row.comentario ?? undefined}
                        >
                          {row.comentario ? (
                            <span className="line-clamp-2">{row.comentario}</span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </section>
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