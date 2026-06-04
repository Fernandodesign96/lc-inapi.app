"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ZodError } from "zod"

import type { ClaudeAuditBundle, ClaudeAuditPilotMeta } from "@contracts/claude-audit-pilot"
import { parseClaudeAuditFile } from "@contracts/claude-audit-pilot"
import {
  buildDemoStrictAudit,
  parseStrictAuditRecord,
  type StrictAuditRecord,
} from "@contracts/checklist"
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
  TableCaption,
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import {
  formatFechaEvaluacion,
  labelTipoPagina,
  NotaEquipoTiContent,
  ObservacionesSeveridadContent,
  ResumenAuditoriaContent,
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
  pastillaSeveridadClass,
  pastillaSeveridadLabel,
  pastillaSeveridadTexto,
  presentacionCriterio,
} from "@/lib/criterio-evaluacion-visual"
import {
  type FiltroEstadoCriterioVisual,
  type FiltroSeveridadPastilla,
  letrasTipoDisponibles,
  matchesEstadoCriterioVisual,
  matchesLetraTipo,
  matchesSeveridadPastilla,
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

  const [filtroLetra, setFiltroLetra] = useState<"todas" | string>("todas")
  const [filtroEstado, setFiltroEstado] =
    useState<FiltroEstadoCriterioVisual>("todos")
  const [filtroSeveridad, setFiltroSeveridad] =
    useState<FiltroSeveridadPastilla>("todos")

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
          setFiltroLetra("todas")
          setFiltroEstado("todos")
          setFiltroSeveridad("todos")
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
        const raw = data as { audit: unknown; pilot?: ClaudeAuditPilotMeta }
        const audit = parseStrictAuditRecord(raw.audit)
        const bundle: ClaudeAuditBundle = {
          audit,
          pilot: raw.pilot ?? {},
        }
        if (!cancelled) {
          setClaudeBundle(bundle)
          setFixtureAudit(null)
          setImportedAudit(null)
          setImportError(null)
          setClaudeFetchError(null)
          setFiltroLetra("todas")
          setFiltroEstado("todos")
          setFiltroSeveridad("todos")
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

  const claudeAuditForDisplay =
    claudeAuditId &&
    claudeBundle !== null &&
    claudeBundle.audit.id === claudeAuditId
      ? claudeBundle.audit
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

  const pilotMeta: ClaudeAuditPilotMeta | null = claudeBundle?.pilot ?? null

  const origenDatos:
    | "claude_audit_api"
    | "fixture_api"
    | "import_json"
    | "url_mock" = claudeAuditForDisplay
    ? "claude_audit_api"
    : fixtureAuditForDisplay
      ? "fixture_api"
      : importedAudit
        ? "import_json"
        : "url_mock"

  const criteriosFiltrados = useMemo(() => {
    if (!auditoria) return []
    return auditoria.criterios_evaluados.filter(
      (row) =>
        matchesLetraTipo(row, filtroLetra) &&
        matchesEstadoCriterioVisual(row, filtroEstado) &&
        matchesSeveridadPastilla(row, filtroSeveridad),
    )
  }, [auditoria, filtroLetra, filtroEstado, filtroSeveridad])

  const letrasDisponibles = useMemo(
    () =>
      auditoria ? letrasTipoDisponibles(auditoria.criterios_evaluados) : [],
    [auditoria],
  )

  function resetFiltrosCriterios() {
    setFiltroLetra("todas")
    setFiltroEstado("todos")
    setFiltroSeveridad("todos")
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
      setFiltroLetra("todas")
      setFiltroEstado("todos")
      setFiltroSeveridad("todos")
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
  const severidadPiloto = pilotMeta?.observaciones_lc_por_severidad
  const tieneSeveridadPiloto = Boolean(
    severidadPiloto &&
      (severidadPiloto.hallazgos_prioridad_alta.length > 0 ||
        severidadPiloto.hallazgos_prioridad_media.length > 0 ||
        severidadPiloto.hallazgos_prioridad_baja.length > 0),
  )

  
  const bloquePasos = PASOS_SEGUN_ESTADO[auditoria.estado_aceptacion]
  const etiquetaEstado = ETIQUETA_ESTADO_ACEPTACION[auditoria.estado_aceptacion]

  const descripcionOrigen =
    origenDatos === "claude_audit_api"
      ? "Datos cargados desde auditoría piloto Claude en el repositorio (API /api/claude-audits/…)."
      : origenDatos === "fixture_api"
        ? "Datos cargados desde el fixture del repositorio (API /api/audit-fixtures/…, validado con strictAuditRecordSchema)."
        : origenDatos === "import_json"
          ? "Datos cargados desde JSON pegado o importado en el navegador."
          : "Datos generados en cliente con buildStrictAuditForAuditarUrl o buildDemoStrictAudit desde @contracts/checklist."



  return (
    <div className="flex w-full flex-col gap-6">
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
              <CardTitle>Resultado de la auditoría (mock)</CardTitle>
              <CardDescription>{descripcionOrigen}</CardDescription>
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
                  <span className="text-muted-foreground">N/A:</span>{" "}
                  {auditoria.criterios_no_aplica}
                </p>
                <p>
                  <span className="text-muted-foreground">
                    Fecha de evaluación:
                  </span>{" "}
                  <span className="font-medium">
                    {formatFechaEvaluacion(auditoria.fecha_evaluacion)}
                  </span>
                </p>
                <p>
                  <span className="text-muted-foreground">Encargado:</span>{" "}
                  <span className="font-medium">{auditoria.evaluador_uid}</span>
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
                <p className="sm:col-span-2">
                  <span className="text-muted-foreground">Id auditoría:</span>{" "}
                  <span className="font-mono text-xs">{auditoria.id}</span>
                </p>
              </div>
            </ResultadoInformePanel>
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
                    <span className="text-muted-foreground">N/A:</span>{" "}
                    {auditoria.criterios_no_aplica}
                  </p>
                </div>
              </div>
            </section>
          )}
          {esInformePiloto ? (
            <ResultadoInformeCollapsibleGroup>
              {pilotMeta?.resumen_ejecutivo ? (
                <ResultadoInformeCollapsible
                  value="resumen-auditoria"
                  title="Resumen Auditoría"
                >
                  <ResumenAuditoriaContent
                    texto={pilotMeta.resumen_ejecutivo}
                  />
                </ResultadoInformeCollapsible>
              ) : null}
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

          <section
            className="overflow-hidden rounded-lg border border-border shadow-sm"
            aria-labelledby="resultado-criterios-titulo"
          >
            <div
              id="resultado-criterios-titulo"
              className="bg-[#0F69C4] px-4 py-3 text-sm font-semibold text-white"
            >
              {esInformePiloto
                ? "39 Criterios Evaluados"
                : "Criterios evaluados"}
            </div>
            <div className={cn(PANEL_BODY_CLASS, "p-0")}>
            <div
                className="flex flex-wrap gap-x-5 gap-y-2 border-b border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground"
                aria-label="Leyenda: la tabla incluye sección y enunciado del criterio (catálogo v1.1); estos íconos describen solo la columna Estado y la severidad en incumplidos"
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
                className="grid gap-3 border-b border-border px-4 py-3 sm:grid-cols-2 lg:grid-cols-4"
                role="group"
                aria-label="Filtros de la tabla de criterios (tipo, estado en tabla, severidad)"
              >
                <label className="flex flex-col gap-0.5 text-xs font-medium text-foreground">
                  Tipo (prefijo)
                  <select
                    className={CRITERIOS_FILTER_SELECT_CLASS}
                    value={filtroLetra}
                    onChange={(e) =>
                      setFiltroLetra(
                        e.target.value === "todas" ? "todas" : e.target.value,
                      )
                    }
                  >
                    <option value="todas">Todas las letras</option>
                    {letrasDisponibles.map((L) => (
                      <option key={L} value={L}>
                        Solo {L}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-0.5 text-xs font-medium text-foreground">
                  Estado en tabla
                  <select
                    className={CRITERIOS_FILTER_SELECT_CLASS}
                    value={filtroEstado}
                    onChange={(e) =>
                      setFiltroEstado(e.target.value as FiltroEstadoCriterioVisual)
                    }
                  >
                    <option value="todos">Todos</option>
                    <option value="cumple">Cumple (✓✓)</option>
                    <option value="cumple_observaciones">
                      Cumple con observaciones (✓)
                    </option>
                    <option value="medianamente">Medianamente cumple (?)</option>
                    <option value="no_cumple">No cumple (!)</option>
                    <option value="no_aplica">No aplica (—)</option>
                  </select>
                </label>
                <label className="flex flex-col gap-0.5 text-xs font-medium text-foreground">
                  Severidad (pastilla)
                  <select
                    className={CRITERIOS_FILTER_SELECT_CLASS}
                    value={filtroSeveridad}
                    onChange={(e) =>
                      setFiltroSeveridad(e.target.value as FiltroSeveridadPastilla)
                    }
                  >
                    <option value="todos">Todas</option>
                    <option value="correcta">correcta</option>
                    <option value="alta">alta</option>
                    <option value="media">media</option>
                    <option value="baja">baja</option>
                    <option value="na">— (N/A)</option>
                  </select>
                </label>
                <div className="flex flex-col justify-end gap-2 sm:col-span-2 lg:col-span-1">
                  <span className="text-xs text-muted-foreground tabular-nums">
                    Mostrando {criteriosFiltrados.length} de{" "}
                    {auditoria.criterios_evaluados.length}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={resetFiltrosCriterios}
                  >
                    Restablecer filtros
                  </Button>
                </div>
              </div>
              <Table className="min-w-[48rem]">
                <TableCaption className="sr-only">
                  Criterios del checklist editorial v1.1: columnas Sección del criterio,
                  Criterio con código e enunciado oficial, Estado de evaluación, Severidad
                  y Comentario.
                </TableCaption>
                <TableHeader>
                  <TableRow className="border-b border-border bg-muted/50 hover:bg-muted/50">
                    <TableHead className="min-w-[10rem] max-w-[14rem] text-card-foreground">
                      Sección
                    </TableHead>
                    <TableHead className="min-w-[12rem] text-card-foreground">
                      Criterio
                    </TableHead>
                    <TableHead className="text-card-foreground">Estado</TableHead>
                    <TableHead className="text-card-foreground">Severidad</TableHead>
                    <TableHead className="text-card-foreground">Comentario</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {criteriosFiltrados.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
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
                  {criteriosFiltrados.map((row) => {
                    const pres = presentacionCriterio(row)
                    const pastilla = pastillaSeveridadLabel(row)
                    return (
                      <TableRow
                        key={row.id}
                        className={filaCriterioClassName(row)}
                      >
                        <TableCell className="max-w-[14rem] text-sm leading-snug text-muted-foreground">
                          {formatSeccionTitulo(row.id)}
                        </TableCell>
                        <TableCell className="max-w-[min(100vw,32rem)] text-sm leading-snug text-foreground">
                          {formatCriterioEnunciado(row.id)}
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
          {esInformePiloto ? (
            <ResultadoInformeCollapsibleGroup>
              {tieneSeveridadPiloto && severidadPiloto ? (
                <ResultadoInformeCollapsible
                  value="observaciones-severidad"
                  title="Observaciones finales por severidad"
                >
                  <ObservacionesSeveridadContent severidad={severidadPiloto} />
                </ResultadoInformeCollapsible>
              ) : null}
              {sustitucionesPiloto.length > 0 ? (
                <ResultadoInformeCollapsible
                  value="texto-propuesto"
                  title="Texto propuesto"
                >
                  <SustitucionesTextoContent
                    sustituciones={sustitucionesPiloto}
                  />
                </ResultadoInformeCollapsible>
              ) : null}
              {pilotMeta?.nota_final_tic ? (
                <ResultadoInformeCollapsible
                  value="nota-equipo-ti"
                  title="Nota para el equipo TI"
                >
                  <NotaEquipoTiContent texto={pilotMeta.nota_final_tic} />
                </ResultadoInformeCollapsible>
              ) : null}
            </ResultadoInformeCollapsibleGroup>
          ) : null}
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