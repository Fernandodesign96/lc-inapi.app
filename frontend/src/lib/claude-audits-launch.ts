/** Filas del piloto 9 URLs (tabla en /auditar). */
export type ClaudePilotUrlRow = {
  pilotoNum: number
  url: string
  label: string
  tipoPagina: "sitioweb" | "tramites"
  /** null = aún sin JSON en data/claude-audits/ */
  claudeAuditId: string | null
  /** Metadatos de UI cuando el informe ya está en repo (evita fetch en /auditar). */
  resumenMvp?: {
    porcentajeLc: number
    estadoAceptacion: "rechazado" | "aceptado_con_observaciones" | "aprobado"
    fechaEvaluacionIso: string
    evaluadorUid: string
  }
}

export const CLAUDE_PILOT_URL_ROWS: ClaudePilotUrlRow[] = [
  {
    pilotoNum: 1,
    url: "https://www.inapi.cl/",
    label: "Home INAPI",
    tipoPagina: "sitioweb",
    claudeAuditId: "www-inapi-cl_2026-06-02",
    resumenMvp: {
      porcentajeLc: 45.5,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-06-03T14:00:00.000Z",
      evaluadorUid: "Fernando Arriagada Castillo",
    },
  },
  {
    pilotoNum: 2,
    url: "https://buscadormarcas.inapi.cl/Marca/BuscarMarca.aspx",
    label: "Buscador Marcas INAPI",
    tipoPagina: "sitioweb",
    claudeAuditId: "buscadormarcas-inapi-cl-marca-buscar-marca_2026-06-05",
    resumenMvp: {
      porcentajeLc: 39.4,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-06-05T15:00:00.000Z",
      evaluadorUid: "Fernando Arriagada Castillo",
    },
  },
  {
    pilotoNum: 3,
    url: "https://www.inapi.cl/marcas",
    label: "Marcas",
    tipoPagina: "sitioweb",
    claudeAuditId: "www-inapi-cl-marcas_2026-06-05",
    resumenMvp: {
      porcentajeLc: 48.5,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-06-05T17:00:00.000Z",
      evaluadorUid: "Fernando Arriagada Castillo",
    },
  },
  {
    pilotoNum: 4,
    url: "https://www.inapi.cl/acerca-de/inapi",
    label: "Acerca de INAPI",
    tipoPagina: "sitioweb",
    claudeAuditId: "www-inapi-cl-acerca-de-inapi_2026-06-07",
    resumenMvp: {
      porcentajeLc: 34.3,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-06-07T08:00:00.000Z",
      evaluadorUid: "Fernando Arriagada Castillo",
    },
  },
  {
    pilotoNum: 5,
    url: "https://www.inapi.cl/buscador?indexCatalogue=inapi&searchQuery=noticias&wordsMode=0",
    label: "Buscador de noticias",
    tipoPagina: "sitioweb",
    claudeAuditId: "www-inapi-cl-buscador-noticias_2026-06-07",
    resumenMvp: {
      porcentajeLc: 34.5,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-06-07T12:00:00.000Z", // usar la del JSON
      evaluadorUid: "Fernando Arriagada Castillo",
    },
  },
  {
    pilotoNum: 6,
    url: "https://www.inapi.cl/marcas/tramites/solicitud-nueva",
    label: "Solicitud Nueva",
    tipoPagina: "sitioweb",
    claudeAuditId: "www-inapi-cl-marcas-tramites-solicitud-nueva_2026-06-07",
    resumenMvp: {
      porcentajeLc: 44.8,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-06-07T16:00:00.000Z",
      evaluadorUid: "Fernando Arriagada Castillo",
    },
  },
  {
    pilotoNum: 7,
    url: "https://www.inapi.cl/sala-de-prensa/noticias",
    label: "Sala de Prensa",
    tipoPagina: "sitioweb",
    claudeAuditId: "www-inapi-cl-sala-de-prensa-noticias_2026-06-07",
    resumenMvp: {
      porcentajeLc: 45.5,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-06-07T18:00:00.000Z",
      evaluadorUid: "Fernando Arriagada Castillo",
    },
  },
  {
    pilotoNum: 8,
    url: "https://tramites.inapi.cl/siac",
    label: "Formulario Contacto SIAC",
    tipoPagina: "tramites",
    claudeAuditId: "tramites-inapi-cl-siac_2026-06-07",
    resumenMvp: {
      porcentajeLc: 51.5,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-06-07T20:00:00.000Z",
      evaluadorUid: "Fernando Arriagada Castillo",
    },
  },
  {
    pilotoNum: 9,
    url: "https://tramites.inapi.cl/",
    label: "Trámites y Servicios",
    tipoPagina: "tramites",
    claudeAuditId: "tramites-inapi-cl_2026-06-07",
    resumenMvp: {
      porcentajeLc: 57.6,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-06-07T22:00:00.000Z",
      evaluadorUid: "Fernando Arriagada Castillo",
    },
  }
]

/** Solo ids con JSON en repo (GET /api/claude-audits/[id]). */
export const CLAUDE_AUDIT_LAUNCHES = CLAUDE_PILOT_URL_ROWS.filter(
  (r): r is ClaudePilotUrlRow & { claudeAuditId: string } =>
    r.claudeAuditId !== null,
).map((r) => ({
  id: r.claudeAuditId,
  url: r.url,
  label: r.label,
  tipoPagina: r.tipoPagina,
}))

export type ClaudeAuditLaunchRow = (typeof CLAUDE_AUDIT_LAUNCHES)[number]

export const CLAUDE_AUDIT_ID_SET = new Set<string>(
  CLAUDE_AUDIT_LAUNCHES.map((row) => row.id),
)

export function claudeAuditIdForUrl(url: string): string | null {
  const normalized = url.replace(/\/$/, "")
  const row = CLAUDE_PILOT_URL_ROWS.find(
    (r) => r.url.replace(/\/$/, "") === normalized && r.claudeAuditId,
  )
  return row?.claudeAuditId ?? null
}

export function pilotRowDisponibleEnMvp(row: ClaudePilotUrlRow): boolean {
  return row.claudeAuditId !== null && CLAUDE_AUDIT_ID_SET.has(row.claudeAuditId)
}