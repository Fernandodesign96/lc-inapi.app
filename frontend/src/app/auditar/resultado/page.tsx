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
import { Progress } from "@/components/ui/progress"
import { buildDemoStrictAudit } from "@contracts/checklist"
import { buildStrictAuditForAuditarUrl } from "@/lib/editorial-shortcut-audit-mock"
import { cn } from "@/lib/utils"
import {
  CLASES_BARRA_POR_ESTADO,
  ETIQUETA_ESTADO_ACEPTACION,
  PASOS_SEGUN_ESTADO,
  TEXTO_PROPUESTO_GENERICO,
  USAR_TEXTO_PROPUESTO_GENERICO,
} from "@/lib/resultado-mock-copy"
import {
  filaCriterioClassName,
  pastillaSeveridadClass,
  pastillaSeveridadLabel,
  pastillaSeveridadTexto,
  presentacionCriterio,
} from "@/lib/criterio-evaluacion-visual"

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
        ...(USAR_TEXTO_PROPUESTO_GENERICO
          ? { texto_propuesto: TEXTO_PROPUESTO_GENERICO }
          : {}),
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

  const bloquePasos = PASOS_SEGUN_ESTADO[auditoria.estado_aceptacion]
  const etiquetaEstado = ETIQUETA_ESTADO_ACEPTACION[auditoria.estado_aceptacion]

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
                <div className="sm:col-span-2 space-y-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span
                      className="text-muted-foreground"
                      id="resultado-cumplimiento-label"
                    >
                      Cumplimiento (criterios aplicables)
                    </span>
                    <span
                      className="font-medium tabular-nums text-foreground"
                      aria-labelledby="resultado-cumplimiento-label"
                    >
                      {auditoria.porcentaje_cumplimiento} %
                    </span>
                  </div>
                  <Progress
                    aria-labelledby="resultado-cumplimiento-label"
                    value={auditoria.porcentaje_cumplimiento}
                    max={100}
                    className={CLASES_BARRA_POR_ESTADO[auditoria.estado_aceptacion].track}
                    indicatorClassName={
                      CLASES_BARRA_POR_ESTADO[auditoria.estado_aceptacion].fill
                    }
                  />
                </div>
                <p>
                  <span className="text-muted-foreground">Estado:</span>{" "}
                  <span
                    className="font-medium"
                    title={auditoria.estado_aceptacion}
                  >
                    {etiquetaEstado}
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

          <section
            className="overflow-hidden rounded-lg border border-border shadow-sm"
            aria-labelledby="resultado-pasos-titulo"
          >
            <div
              id="resultado-pasos-titulo"
              className="bg-[#0F69C4] px-4 py-3 text-sm font-semibold text-white"
            >
              {bloquePasos.titulo}
            </div>
            <div className="bg-[#FFFFFF] p-4">
              <ol className="list-decimal space-y-2 ps-5 text-sm leading-relaxed text-foreground marker:text-muted-foreground">
                {bloquePasos.pasos.map((paso) => (
                  <li key={paso}>{paso}</li>
                ))}
              </ol>
            </div>
          </section>

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

            <section
              className="overflow-hidden rounded-lg border border-border shadow-sm"
              aria-labelledby="resultado-texto-propuesto-titulo"
            >
              <div
                id="resultado-texto-propuesto-titulo"
                className="bg-[#0F69C4] px-4 py-3 text-sm font-semibold text-white"
              >
                Texto propuesto
              </div>
              <div className="bg-[#FFFFFF] p-4">
                {auditoria.texto_propuesto ? (
                  <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
                    {auditoria.texto_propuesto}
                  </p>
                ) : (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    En esta demostración no hay borrador sugerido para esta URL: el
                    texto propuesto enriquecido está reservado a los perfiles de los
                    tres atajos editoriales en la pantalla de ingreso. En la Fase 2,
                    una evaluación asistida podrá proponer redacción aquí según el
                    contenido capturado.
                  </p>
                )}
              </div>
            </section>
          </div>

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
                className="flex flex-wrap gap-x-5 gap-y-2 border-b border-border px-4 py-3 text-xs text-muted-foreground"
                aria-label="Leyenda de estados y severidad en criterios"
              >
                <span className="inline-flex max-w-[11rem] flex-col gap-0.5">
                  <span className="font-medium text-foreground">Severidad alta</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-destructive/15 font-semibold text-destructive"
                      aria-hidden
                    >
                      !
                    </span>
                    No cumple · pastilla «alta» (rojo)
                  </span>
                </span>
                <span className="inline-flex max-w-[11rem] flex-col gap-0.5">
                  <span className="font-medium text-foreground">Severidad media</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-amber-500/20 font-semibold text-amber-800 dark:text-amber-300"
                      aria-hidden
                    >
                      ?
                    </span>
                    Medianamente cumple · pastilla «media» (naranjo)
                  </span>
                </span>
                <span className="inline-flex max-w-[11rem] flex-col gap-0.5">
                  <span className="font-medium text-foreground">Severidad baja</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-sky-500/20 font-semibold text-sky-700 dark:text-sky-300"
                      aria-hidden
                    >
                      ✓
                    </span>
                    Cumple con observaciones · pastilla «baja» (azul)
                  </span>
                </span>
                <span className="inline-flex max-w-[11rem] flex-col gap-0.5">
                  <span className="font-medium text-foreground">Criterio cumple</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="flex h-5 min-w-[1.35rem] shrink-0 items-center justify-center rounded-sm bg-emerald-600/15 px-0.5 text-[10px] font-bold leading-none text-emerald-800 dark:text-emerald-300"
                      aria-hidden
                    >
                      ✓✓
                    </span>
                    Cumple · pastilla «correcta» (verde)
                  </span>
                </span>
                <span className="inline-flex max-w-[11rem] flex-col gap-0.5">
                  <span className="font-medium text-foreground">No aplica</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="flex h-5 w-7 shrink-0 items-center justify-center rounded-sm bg-muted text-[13px] font-semibold leading-none text-muted-foreground"
                      aria-hidden
                    >
                      —
                    </span>
                    Fila gris · estado «—» · severidad «—»
                  </span>
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
                    const pres = presentacionCriterio(row)
                    const pastilla = pastillaSeveridadLabel(row)
                    return (
                      <TableRow
                        key={row.id}
                        className={filaCriterioClassName(row)}
                      >
                        <TableCell className="font-mono text-xs font-medium">
                          {row.id}
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-2">
                            <span
                              className={cn(
                                "flex shrink-0 items-center justify-center rounded-md font-bold leading-none",
                                pres.simboloCompacto
                                  ? cn(
                                      "h-7 min-w-8 px-1 text-[11px] font-semibold tracking-tight",
                                      pres.simboloMono && "font-mono",
                                    )
                                  : "h-7 w-7 text-sm",
                                pres.cajaSimboloClass,
                              )}
                              aria-hidden
                            >
                              <span className={pres.simboloClass}>{pres.simbolo}</span>
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
                          <span className={pastillaSeveridadClass(pastilla)}>
                            {pastillaSeveridadTexto(pastilla)}
                          </span>
                        </TableCell>
                        <TableCell
                          className="max-w-[min(100vw,24rem)] text-sm leading-snug text-foreground"
                          title={
                            row.estado === "no_aplica"
                              ? undefined
                              : (row.comentario ?? undefined)
                          }
                        >
                          {row.estado === "no_aplica" ? (
                            <span className="text-muted-foreground">—</span>
                          ) : row.comentario ? (
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