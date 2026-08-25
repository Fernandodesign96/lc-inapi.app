"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ZodError } from "zod"

import type {
  ClaudeAuditBundle,
  ClaudeAuditPilotMeta,
  ClarityAuditMeta,
} from "@contracts/claude-audit-pilot"
import { parseClaudeAuditFile } from "@contracts/claude-audit-pilot"
import {
  buildDemoStrictAudit,
  parseStrictAuditRecord,
  type StrictAuditRecord,
} from "@contracts/checklist"
import { Button } from "@/components/ui/button"
import { excelPathForClaudeAudit } from "@/lib/audit-jobs/excel-path"
import {
  bundleForVisibleDelivery,
  criteriosVisiblesParaEntrega,
} from "@repo/lib/audit-visible-content"
import {
  buildSustitucionesPorCriterio,
  criterioEntregaCampos,
} from "@repo/lib/criterio-entrega-campos"
import { ptdHitoTareaPorCriterio } from "@repo/lib/ptd-hito-tarea-por-criterio"
import {
  buildResumenHitosAuditoria,
  CHECKLIST_DATOS_AUDITORIA_VALOR,
} from "@repo/lib/resumen-hitos-auditoria"
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
  TableCaption,
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { ResultadoScrollTopButton } from "@/components/resultado-scroll-top-button"
import {
  formatFechaEvaluacionDatosUi,
  formatUsuarioQueAudita,
  labelTipoPagina,
  SustitucionesTextoContent,
} from "@/components/resultado-claude-pilot-sections"
import {
  ResultadoInformeCollapsible,
  ResultadoInformeCollapsibleGroup,
  ResultadoInformePanel,
} from "@/components/resultado-informe-collapsible"
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
  presentacionCriterio,
} from "@/lib/criterio-evaluacion-visual"
import {
  type FiltroEstadoCriterioVisual,
  matchesCriterioId,
  matchesEstadoCriterioVisual,
  matchesHitoId,
  matchesInstrumento,
  matchesTareaId,
  opcionesCriterioIds,
  opcionesHitoDisponibles,
  opcionesInstrumentoDisponibles,
  opcionesTareaDisponibles,
} from "@/lib/criterios-evaluados-filters"
import {
  formatCriterioEnunciado,
  formatSeccionTitulo,
} from "@/lib/checklist-criterion-catalog"

const PANEL_BODY_CLASS = "bg-card text-card-foreground"

const CRITERIOS_FILTER_SELECT_CLASS =
  "mt-1 min-h-9 w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground dark:bg-input/30"

function ResultadoInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlRaw = searchParams.get("url")
  const claudeAuditRaw = searchParams.get("claudeAudit")
  const claudeAuditId = claudeAuditRaw?.trim() ? claudeAuditRaw.trim() : null
  const fixtureRaw = searchParams.get("fixture")
  const fixtureId = fixtureRaw?.trim() ? fixtureRaw.trim() : null

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

  const urlDerivedAudit = useMemo((): StrictAuditRecord | null => {
    if (fixtureId || claudeAuditId) return null
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
  }, [auditUrl, fixtureId, claudeAuditId])

  const [claudeBundle, setClaudeBundle] = useState<ClaudeAuditBundle | null>(null)
  const [claudeFetchError, setClaudeFetchError] = useState<string | null>(null)
  const [fixtureAudit, setFixtureAudit] = useState<StrictAuditRecord | null>(null)
  const [fixtureFetchError, setFixtureFetchError] = useState<string | null>(null)
  const [importedAudit, setImportedAudit] = useState<StrictAuditRecord | null>(null)
  const [importDraft, setImportDraft] = useState("")
  const [importError, setImportError] = useState<string | null>(null)

  const [filtroHito, setFiltroHito] = useState<"todos" | number>("todos")
  const [filtroTarea, setFiltroTarea] = useState<"todos" | number>("todos")
  const [filtroCriterio, setFiltroCriterio] = useState<"todos" | string>("todos")
  const [filtroInstrumento, setFiltroInstrumento] = useState<"todos" | string>(
    "todos",
  )
  const [filtroEstado, setFiltroEstado] =
    useState<FiltroEstadoCriterioVisual>("todos")

  useEffect(() => {
    if (!fixtureId) return

    let cancelled = false

    fetch(`/api/audit-fixtures/${encodeURIComponent(fixtureId)}`)
      .then(async (r) => {
        if (!r.ok) {
          const body = await r.text()
          throw new Error(body || `HTTP ${r.status}`)
        }
        return r.json() as Promise<unknown>
      })
      .then((data) => {
        const parsed = parseStrictAuditRecord(data)
        if (!cancelled) {
          setFixtureAudit(parsed)
          setClaudeBundle(null)
          setImportedAudit(null)
          setImportError(null)
          setFixtureFetchError(null)
          setFiltroHito("todos")
          setFiltroTarea("todos")
          setFiltroCriterio("todos")
          setFiltroInstrumento("todos")
          setFiltroEstado("todos")
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setFixtureAudit(null)
          setFixtureFetchError(
            e instanceof Error ? e.message : "No se pudo cargar el fixture.",
          )
        }
      })

    return () => {
      cancelled = true
    }
  }, [fixtureId])

  useEffect(() => {
    if (!claudeAuditId) return

    let cancelled = false

    fetch(`/api/claude-audits/${encodeURIComponent(claudeAuditId)}`)
      .then(async (r) => {
        if (!r.ok) {
          const body = await r.text()
          throw new Error(body || `HTTP ${r.status}`)
        }
        return r.json() as Promise<unknown>
      })
      .then((data) => {
        const raw = data as {
          audit: unknown
          pilot?: ClaudeAuditPilotMeta
          clarity?: ClarityAuditMeta
        }
        const audit = parseStrictAuditRecord(raw.audit)
        const bundle: ClaudeAuditBundle = {
          audit,
          pilot: raw.pilot ?? {},
          ...(raw.clarity ? { clarity: raw.clarity } : {}),
        }
        if (!cancelled) {
          setClaudeBundle(bundle)
          setFixtureAudit(null)
          setImportedAudit(null)
          setImportError(null)
          setClaudeFetchError(null)
          setFiltroHito("todos")
          setFiltroTarea("todos")
          setFiltroCriterio("todos")
          setFiltroInstrumento("todos")
          setFiltroEstado("todos")
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setClaudeBundle(null)
          setClaudeFetchError(
            e instanceof Error
              ? e.message
              : "No se pudo cargar la auditoría piloto.",
          )
        }
      })

    return () => {
      cancelled = true
    }
  }, [claudeAuditId])

  const fixtureFetchErrorForDisplay = fixtureId ? fixtureFetchError : null

  const fixtureAuditForDisplay =
    fixtureId &&
    fixtureAudit !== null &&
    fixtureAudit.id === fixtureId
      ? fixtureAudit
      : null

  const showFixtureLoading =
    Boolean(fixtureId) &&
    fixtureFetchErrorForDisplay === null &&
    fixtureAuditForDisplay === null

  const claudeFetchErrorForDisplay = claudeAuditId ? claudeFetchError : null

  const deliveryBundle = useMemo(
    () => (claudeBundle ? bundleForVisibleDelivery(claudeBundle) : null),
    [claudeBundle],
  )

  const claudeAuditForDisplay =
    claudeAuditId &&
    deliveryBundle !== null &&
    deliveryBundle.audit.id === claudeAuditId
      ? deliveryBundle.audit
      : null

  const showClaudeLoading =
    Boolean(claudeAuditId) &&
    claudeFetchErrorForDisplay === null &&
    claudeAuditForDisplay === null

  const auditoria: StrictAuditRecord | null =
    claudeAuditForDisplay ??
    fixtureAuditForDisplay ??
    importedAudit ??
    urlDerivedAudit ??
    null

  const pilotMeta: ClaudeAuditPilotMeta | null = deliveryBundle?.pilot ?? null

  const sustitucionesPorCriterio = useMemo(
    () => buildSustitucionesPorCriterio(pilotMeta?.sustituciones ?? []),
    [pilotMeta?.sustituciones],
  )

  const criteriosEntregaRows = useMemo(
    () =>
      auditoria
        ? criteriosVisiblesParaEntrega(auditoria.criterios_evaluados)
        : [],
    [auditoria],
  )

  const criteriosFiltrados = useMemo(() => {
    return criteriosEntregaRows.filter(
      (row) =>
        matchesHitoId(row, filtroHito) &&
        matchesTareaId(row, filtroTarea) &&
        matchesCriterioId(row, filtroCriterio) &&
        matchesInstrumento(row, filtroInstrumento) &&
        matchesEstadoCriterioVisual(row, filtroEstado),
    )
  }, [
    criteriosEntregaRows,
    filtroHito,
    filtroTarea,
    filtroCriterio,
    filtroInstrumento,
    filtroEstado,
  ])

  const criteriosEntregaCount = criteriosEntregaRows.length

  const hitosFiltroOpts = useMemo(
    () => opcionesHitoDisponibles(criteriosEntregaRows),
    [criteriosEntregaRows],
  )
  const tareasFiltroOpts = useMemo(
    () => opcionesTareaDisponibles(criteriosEntregaRows, filtroHito),
    [criteriosEntregaRows, filtroHito],
  )
  const criteriosFiltroOpts = useMemo(
    () => opcionesCriterioIds(criteriosEntregaRows),
    [criteriosEntregaRows],
  )
  const instrumentosFiltroOpts = useMemo(
    () => opcionesInstrumentoDisponibles(criteriosEntregaRows),
    [criteriosEntregaRows],
  )

  function resetFiltrosCriterios() {
    setFiltroHito("todos")
    setFiltroTarea("todos")
    setFiltroCriterio("todos")
    setFiltroInstrumento("todos")
    setFiltroEstado("todos")
  }

  function aplicarImportacion() {
    setImportError(null)
    try {
      const data: unknown = JSON.parse(importDraft)
      try {
        const bundle = parseClaudeAuditFile(data)
        setImportedAudit(bundle.audit)
        setClaudeBundle(bundle)
        setFixtureAudit(null)
      } catch {
        const parsed = parseStrictAuditRecord(data)
        setImportedAudit(parsed)
        setClaudeBundle(null)
        setFixtureAudit(null)
      }
      setFiltroHito("todos")
      setFiltroTarea("todos")
      setFiltroCriterio("todos")
      setFiltroInstrumento("todos")
      setFiltroEstado("todos")
    } catch (e) {
      if (e instanceof ZodError) {
        setImportError("El JSON no cumple el esquema de auditoría.")
      } else if (e instanceof SyntaxError) {
        setImportError("JSON inválido (revisa comillas y comas).")
      } else {
        setImportError("No se pudo importar el registro.")
      }
      setImportedAudit(null)
      setClaudeBundle(null)
    }
  }
  if (!fixtureId && !claudeAuditId) {
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
  }

  if (showClaudeLoading) {
    return (
      <p className="text-muted-foreground text-sm">
        Cargando auditoría piloto…
      </p>
    )
  }

  if (showFixtureLoading) {
    return (
      <p className="text-muted-foreground text-sm">Cargando fixture…</p>
    )
  }

  if (claudeAuditId && claudeFetchErrorForDisplay) {
    return (
      <div className="flex w-full flex-col gap-4">
        <p className="text-sm text-destructive">{claudeFetchErrorForDisplay}</p>
        <Button type="button" variant="outline" asChild>
          <Link href="/auditar">Volver al ingreso</Link>
        </Button>
      </div>
    )
  }

  if (fixtureId && fixtureFetchErrorForDisplay) {
    return (
      <div className="flex w-full flex-col gap-4">
        <p className="text-sm text-destructive">{fixtureFetchErrorForDisplay}</p>
        <Button type="button" variant="outline" asChild>
          <Link href="/auditar">Volver al ingreso</Link>
        </Button>
      </div>
    )
  }

  if (!auditoria) {
    return null
  }

  const esInformePiloto = Boolean(pilotMeta)

  const sustitucionesPiloto = pilotMeta?.sustituciones ?? []

  
  const bloquePasos = PASOS_SEGUN_ESTADO[auditoria.estado_aceptacion]
  const etiquetaEstado = ETIQUETA_ESTADO_ACEPTACION[auditoria.estado_aceptacion]
  const tituloCriteriosEvaluados = `${criteriosEntregaCount} Criterios evaluados`
  const resumenHitos = buildResumenHitosAuditoria(
    criteriosVisiblesParaEntrega(auditoria.criterios_evaluados),
  )

  return (
    <div className="flex w-full flex-col gap-6">
      <ResultadoScrollTopButton />
      {!claudeAuditId ? (
      <Card className="border-dashed">
        <CardHeader className="space-y-1.5">
          <CardTitle className="text-base">Demostración: importar JSON</CardTitle>
          <CardDescription>
            Solo aplica si no hay{" "}
            <code className="rounded bg-muted px-1 text-xs">fixture=</code> ni{" "}
            <code className="rounded bg-muted px-1 text-xs">claudeAudit=</code>{" "}
            en la URL. Puede pegar un registro completo aquí o volver a{" "}
            <Link href="/auditar" className="underline underline-offset-4">
              /auditar
            </Link>
            .
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="resultado-import-json">JSON del registro</Label>
            <textarea
              id="resultado-import-json"
              value={importDraft}
              onChange={(e) => setImportDraft(e.target.value)}
              rows={6}
              spellCheck={false}
              className="w-full resize-y rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              placeholder='{ "id": "…", "url": "https://…", … }'
            />
          </div>
          {importError ? (
            <p className="text-sm text-destructive" role="alert">
              {importError}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              disabled={!!fixtureId || !!claudeAuditId}
              onClick={() => aplicarImportacion()}
            >
              Aplicar JSON
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setImportDraft("")
                setImportedAudit(null)
                setClaudeBundle(null)
                setImportError(null)
              }}
            >
              Limpiar
            </Button>
            <Button type="button" variant="outline" asChild>
              <label className="cursor-pointer">
                Elegir archivo…
                <input
                  type="file"
                  accept="application/json,.json"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    e.target.value = ""
                    if (!file) return
                    const reader = new FileReader()
                    reader.onload = () => {
                      const text =
                        typeof reader.result === "string" ? reader.result : ""
                      setImportDraft(text)
                    }
                    reader.readAsText(file, "utf8")
                  }}
                />
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>
      ) : null}
      <Card>
        <CardHeader className="gap-4 space-y-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1 space-y-1.5">
              <CardTitle>Resultado de la auditoría</CardTitle>
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
        {esInformePiloto ? (
          <>
            <ResultadoInformePanel
              title="Datos de Auditoría"
              id="resultado-datos-auditoria"
            >
              <div className="grid gap-2 text-sm sm:grid-cols-2">
                <p>
                  <span className="text-muted-foreground">URL:</span>{" "}
                  <span className="font-medium break-all">{auditoria.url}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Checklist 3.0:</span>{" "}
                  <span className="font-medium">
                    {CHECKLIST_DATOS_AUDITORIA_VALOR}
                  </span>
                </p>
                <div className="sm:col-span-2 space-y-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span
                      className="text-muted-foreground"
                      id="resultado-cumplimiento-label"
                    >
                      Porcentaje
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
                    className={
                      CLASES_BARRA_POR_ESTADO[auditoria.estado_aceptacion].track
                    }
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
                  <span className="text-muted-foreground">No aplica:</span>{" "}
                  {auditoria.criterios_no_aplica}
                </p>
                <p>
                  <span className="text-muted-foreground">
                    Fecha de evaluación:
                  </span>{" "}
                  <span className="font-medium">
                    {formatFechaEvaluacionDatosUi(auditoria.fecha_evaluacion, auditoria.url)}
                  </span>
                </p>
                <p>
                  <span className="text-muted-foreground">
                    Usuario que audita:
                  </span>{" "}
                  <span className="font-medium">
                    {formatUsuarioQueAudita()}
                  </span>
                </p>
                {pilotMeta?.tipo_pagina ? (
                  <p>
                    <span className="text-muted-foreground">
                      Tipo de página:
                    </span>{" "}
                    <span className="font-medium">
                      {labelTipoPagina(pilotMeta.tipo_pagina)}
                    </span>
                  </p>
                ) : null}
              </div>
            </ResultadoInformePanel>
            {resumenHitos.length > 0 ? (
              <ResultadoInformeCollapsibleGroup>
              <ResultadoInformeCollapsible
                value="resumen-hitos"
                title="Resumen por hito"
              >
                <div className="space-y-4 p-4">
                  {resumenHitos.map((hito) => (
                    <div
                      key={hito.hitoId}
                      className="overflow-x-auto rounded-md border border-border"
                    >
                      <Table className="min-w-[48rem] border-collapse text-sm">
                        <TableHeader>
                          <TableRow className="border-b border-border hover:bg-transparent">
                            <TableHead className="w-[34%] min-w-[12rem] border-r border-border bg-muted/40 text-left font-semibold text-foreground">
                              Hito
                            </TableHead>
                            <TableHead className="border-r border-border bg-muted/40 text-right font-semibold text-foreground">
                              Checklist
                            </TableHead>
                            <TableHead className="border-r border-border bg-muted/40 text-right font-semibold text-foreground">
                              Cumple
                            </TableHead>
                            <TableHead className="border-r border-border bg-muted/40 text-right font-semibold text-foreground">
                              Cumple con Observaciones
                            </TableHead>
                            <TableHead className="border-r border-border bg-muted/40 text-right font-semibold text-foreground">
                              Medianamente cumple
                            </TableHead>
                            <TableHead className="border-r border-border bg-muted/40 text-right font-semibold text-foreground">
                              No cumple
                            </TableHead>
                            <TableHead className="border-r border-border bg-muted/40 text-right font-semibold text-foreground">
                              No aplica
                            </TableHead>
                            <TableHead className="bg-muted/40 text-right font-semibold text-foreground">
                              % Cumple
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow className="hover:bg-transparent">
                            <TableCell className="align-bottom border-r border-border text-left text-sm leading-snug text-foreground">
                              {hito.hitoTitulo}
                            </TableCell>
                            <TableCell className="align-bottom border-r border-border text-right tabular-nums">
                              {hito.checklist}
                            </TableCell>
                            <TableCell className="align-bottom border-r border-border text-right tabular-nums">
                              {hito.cumple}
                            </TableCell>
                            <TableCell className="align-bottom border-r border-border text-right tabular-nums">
                              {hito.cumpleConObservaciones}
                            </TableCell>
                            <TableCell className="align-bottom border-r border-border text-right tabular-nums">
                              {hito.medianamenteCumple}
                            </TableCell>
                            <TableCell className="align-bottom border-r border-border text-right tabular-nums">
                              {hito.noCumple}
                            </TableCell>
                            <TableCell className="align-bottom border-r border-border text-right tabular-nums">
                              {hito.noAplica}
                            </TableCell>
                            <TableCell className="align-bottom text-right tabular-nums font-medium">
                              {hito.pctCumple}%
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  ))}
                </div>
              </ResultadoInformeCollapsible>
              </ResultadoInformeCollapsibleGroup>
            ) : null}
          </>
          ) : (
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
              <div className={cn(PANEL_BODY_CLASS, "p-4")}>
                <div className="grid gap-2 text-sm sm:grid-cols-2">
                  <p>
                    <span className="text-muted-foreground">URL:</span>{" "}
                    <span className="font-medium break-all">{auditoria.url}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Checklist 3.0:</span>{" "}
                    <span className="font-medium">
                      {CHECKLIST_DATOS_AUDITORIA_VALOR}
                    </span>
                  </p>
                  <div className="sm:col-span-2 space-y-2">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span
                        className="text-muted-foreground"
                        id="resultado-cumplimiento-label"
                      >
                        Porcentaje
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
                      className={
                        CLASES_BARRA_POR_ESTADO[auditoria.estado_aceptacion].track
                      }
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
                    <span className="text-muted-foreground">No aplica:</span>{" "}
                    {auditoria.criterios_no_aplica}
                  </p>
                </div>
              </div>
            </section>
          )}
          {esInformePiloto ? (
            <ResultadoInformeCollapsibleGroup>
              <ResultadoInformeCollapsible
                value="pasos-seguir"
                title="Pasos a seguir"
              >
                <ol className="list-decimal space-y-2 ps-5 text-sm leading-relaxed text-foreground marker:text-muted-foreground">
                  {bloquePasos.pasos.map((paso) => (
                    <li key={paso}>{paso}</li>
                  ))}
                </ol>
              </ResultadoInformeCollapsible>
            </ResultadoInformeCollapsibleGroup>
          ) : (
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
              <div className={cn(PANEL_BODY_CLASS, "p-4")}>
                <ol className="list-decimal space-y-2 ps-5 text-sm leading-relaxed text-foreground marker:text-muted-foreground">
                  {bloquePasos.pasos.map((paso) => (
                    <li key={paso}>{paso}</li>
                  ))}
                </ol>
              </div>
            </section>
          )}

            {!esInformePiloto ? (
            <div className="space-y-4">
            {auditoria.observaciones_lc ? (
              <section className="overflow-hidden rounded-lg border border-border shadow-sm">
                <div className="bg-[#0F69C4] px-4 py-3 text-sm font-semibold text-white">
                  Observaciones
                </div>
                <div className={cn(PANEL_BODY_CLASS, "p-4")}>
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
                {pilotMeta
                  ? "Texto propuesto — Para implementación por TIC (solo texto, sin tocar HTML)"
                  : "Texto propuesto"}              
              </div>
              <div className={cn(PANEL_BODY_CLASS, "p-4")}>
                {auditoria.texto_propuesto ? (
                  <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
                    {auditoria.texto_propuesto}
                  </p>
                ) : (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    En esta demostración no hay borrador sugerido para esta URL: el
                    texto propuesto enriquecido está reservado a las tres prioridades
                    demostrativas (mock por URL o fixture) en la pantalla de ingreso, o
                    puede importar un JSON con borrador. En la Fase 2, una evaluación
                    asistida podrá proponer redacción aquí según el contenido
                    capturado.
                  </p>
                )}
              </div>
            </section>
          </div>
        ) : null}

          <ResultadoInformeCollapsibleGroup>
              <ResultadoInformeCollapsible
                value="criterios-evaluados"
                title={tituloCriteriosEvaluados}
                contentClassName="border-t-0 bg-card p-0 pt-0"
              >
            <div
                className="flex flex-wrap gap-x-5 gap-y-2 border-b border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground"
                aria-label="Leyenda: la tabla incluye sección y enunciado del criterio; estos íconos describen solo la columna Estado y la severidad en incumplidos"
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
                  <span className="font-medium text-foreground">Estado: cumple</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="flex h-5 min-w-[1.35rem] shrink-0 items-center justify-center rounded-sm bg-emerald-600/15 px-0.5 text-[10px] font-bold leading-none text-emerald-800 dark:text-emerald-300"
                      aria-hidden
                    >
                      ✓✓
                    </span>
                    Columna Estado · pastilla «correcta» (verde)
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
              <div
                className="flex flex-col gap-3 border-b border-border px-4 py-3"
                role="group"
                aria-label="Filtros de la tabla de criterios"
              >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <label className="flex min-w-0 flex-col gap-0.5 text-xs font-medium text-foreground">
                  Por Hitos
                  <select
                    className={CRITERIOS_FILTER_SELECT_CLASS}
                    value={filtroHito === "todos" ? "todos" : String(filtroHito)}
                    onChange={(e) => {
                      const v = e.target.value
                      setFiltroHito(v === "todos" ? "todos" : Number(v))
                      setFiltroTarea("todos")
                    }}
                  >
                    <option value="todos">Todos los hitos</option>
                    {hitosFiltroOpts.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex min-w-0 flex-col gap-0.5 text-xs font-medium text-foreground">
                  Por Tareas
                  <select
                    className={CRITERIOS_FILTER_SELECT_CLASS}
                    value={
                      filtroTarea === "todos" ? "todos" : String(filtroTarea)
                    }
                    onChange={(e) => {
                      const v = e.target.value
                      setFiltroTarea(v === "todos" ? "todos" : Number(v))
                    }}
                  >
                    <option value="todos">Todas las tareas</option>
                    {tareasFiltroOpts.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex min-w-0 flex-col gap-0.5 text-xs font-medium text-foreground">
                  Por Criterios
                  <select
                    className={CRITERIOS_FILTER_SELECT_CLASS}
                    value={filtroCriterio}
                    onChange={(e) => {
                      const v = e.target.value
                      setFiltroCriterio(v === "todos" ? "todos" : v)
                    }}
                  >
                    <option value="todos">Todos los criterios</option>
                    {criteriosFiltroOpts.map((id) => (
                      <option key={id} value={id}>
                        {id}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex min-w-0 flex-col gap-0.5 text-xs font-medium text-foreground">
                  Por Instrumento
                  <select
                    className={CRITERIOS_FILTER_SELECT_CLASS}
                    value={filtroInstrumento}
                    onChange={(e) => {
                      const v = e.target.value
                      setFiltroInstrumento(v === "todos" ? "todos" : v)
                    }}
                  >
                    <option value="todos">Todos los instrumentos</option>
                    {instrumentosFiltroOpts.map((nombre) => (
                      <option key={nombre} value={nombre}>
                        {nombre}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex min-w-0 flex-col gap-0.5 text-xs font-medium text-foreground">
                  Por estados
                  <select
                    className={CRITERIOS_FILTER_SELECT_CLASS}
                    value={filtroEstado}
                    onChange={(e) =>
                      setFiltroEstado(
                        e.target.value as FiltroEstadoCriterioVisual,
                      )
                    }
                  >
                    <option value="todos">Todos los estados</option>
                    <option value="cumple">Cumple</option>
                    <option value="cumple_observaciones">
                      Cumple con observaciones
                    </option>
                    <option value="medianamente">Medianamente cumple</option>
                    <option value="no_cumple">No cumple</option>
                    <option value="no_aplica">No aplica</option>
                  </select>
                </label>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-xs text-muted-foreground tabular-nums">
                    Mostrando {criteriosFiltrados.length} de{" "}
                    {criteriosEntregaCount}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={resetFiltrosCriterios}
                  >
                    Limpiar Filtros
                  </Button>
                </div>
              </div>
              <Table className="min-w-[76rem]">
                <TableCaption className="sr-only">
                  Criterios del checklist editorial: Instrumento de evaluación,
                  Estado, Texto en pantalla, Corrección propuesta, Ubicación en
                  pantalla, Comentario o justificación, Criterio, Hito PTD y
                  Tarea PTD.
                </TableCaption>
                <TableHeader>
                  <TableRow className="border-b border-border bg-muted/50 hover:bg-muted/50">
                    <TableHead className="min-w-[9rem] max-w-[12rem] text-card-foreground">
                      Instrumento de evaluación
                    </TableHead>
                    <TableHead className="text-card-foreground">Estado</TableHead>
                    <TableHead className="min-w-[10rem] text-card-foreground">
                      Texto en pantalla
                    </TableHead>
                    <TableHead className="min-w-[10rem] text-card-foreground">
                      Corrección propuesta
                    </TableHead>
                    <TableHead className="min-w-[9rem] text-card-foreground">
                      Ubicación en pantalla
                    </TableHead>
                    <TableHead className="min-w-[12rem] text-card-foreground">
                      Comentario / justificación
                    </TableHead>
                    <TableHead className="min-w-[14rem] text-card-foreground">
                      Criterio
                    </TableHead>
                    <TableHead className="min-w-[12rem] text-card-foreground">
                      Hito PTD
                    </TableHead>
                    <TableHead className="min-w-[12rem] text-card-foreground">
                      Tarea PTD
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {criteriosFiltrados.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="p-6 text-center text-muted-foreground"
                      >
                        <p className="mb-3 text-sm">
                          Ningún criterio coincide con los filtros seleccionados.
                        </p>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={resetFiltrosCriterios}
                        >
                          Restablecer filtros
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : null}
                  {criteriosFiltrados.flatMap((row) => {
                    const sustList =
                      row.estado === "incumple"
                        ? (sustitucionesPorCriterio.get(row.id) ?? [])
                        : []
                    const slots =
                      sustList.length > 0 ? sustList : [undefined]
                    const pres = presentacionCriterio(row)
                    const ptd = ptdHitoTareaPorCriterio(row.id)
                    return slots.map((sust, sustIdx) => {
                      const campos = criterioEntregaCampos(row, sust)
                      return (
                      <TableRow
                        key={`${row.id}-${sustIdx}`}
                        className={filaCriterioClassName(row)}
                      >
                        <TableCell className="max-w-[12rem] text-sm leading-snug text-muted-foreground">
                          {formatSeccionTitulo(row.id)}
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
                        <TableCell
                          className="max-w-[min(100vw,16rem)] text-sm leading-snug text-foreground"
                          title={campos.textoEnPantalla}
                        >
                          <span className="line-clamp-3">
                            {campos.textoEnPantalla}
                          </span>
                        </TableCell>
                        <TableCell
                          className="max-w-[min(100vw,16rem)] text-sm leading-snug text-foreground"
                          title={campos.correccionPropuesta}
                        >
                          <span className="line-clamp-3">
                            {campos.correccionPropuesta}
                          </span>
                        </TableCell>
                        <TableCell
                          className="max-w-[12rem] text-sm leading-snug text-muted-foreground"
                          title={campos.ubicacionEnPantalla}
                        >
                          <span className="line-clamp-3">
                            {campos.ubicacionEnPantalla}
                          </span>
                        </TableCell>
                        <TableCell
                          className="max-w-[min(100vw,20rem)] text-sm leading-snug text-foreground"
                          title={campos.justificacion}
                        >
                          <span className="line-clamp-3">
                            {campos.justificacion}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-[min(100vw,28rem)] text-sm leading-snug text-foreground">
                          {formatCriterioEnunciado(row.id)}
                        </TableCell>
                        <TableCell
                          className="max-w-[14rem] text-sm leading-snug text-muted-foreground"
                          title={ptd.hitoPtd}
                        >
                          <span className="line-clamp-4">{ptd.hitoPtd}</span>
                        </TableCell>
                        <TableCell
                          className="max-w-[14rem] text-sm leading-snug text-muted-foreground"
                          title={ptd.tareaPtd}
                        >
                          <span className="line-clamp-4">{ptd.tareaPtd}</span>
                        </TableCell>
                      </TableRow>
                      )
                    })
                  })}
                </TableBody>
              </Table>
              </ResultadoInformeCollapsible>
              {esInformePiloto && sustitucionesPiloto.length > 0 ? (
                <ResultadoInformeCollapsible
                  value="texto-propuesto"
                  title="Texto propuesto"
                >
                  <SustitucionesTextoContent
                    sustituciones={sustitucionesPiloto}
                  />
                </ResultadoInformeCollapsible>
              ) : null}
            </ResultadoInformeCollapsibleGroup>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          {claudeAuditId && claudeAuditForDisplay ? (
            <Button type="button" asChild>
              <a
                href={`/api/claude-audits/${encodeURIComponent(claudeAuditId)}/export/pdf`}
                download
              >
                Descargar PDF auditoría
              </a>
            </Button>
          ) : null}
          {claudeAuditId && claudeAuditForDisplay
            ? (() => {
                const excelHref = excelPathForClaudeAudit(claudeAuditId)
                if (!excelHref) return null
                return (
                  <Button type="button" asChild>
                    <a href={excelHref} download>
                      Descargar Excel auditoría
                    </a>
                  </Button>
                )
              })()
            : null}
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
          