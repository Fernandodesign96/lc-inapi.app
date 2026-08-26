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
  /**
   * Auditorías anteriores de la misma URL (ids en repo).
   * El `claudeAuditId` debe ser siempre la más reciente.
   */
  history?: { id: string }[]
}

export const CLAUDE_PILOT_URL_ROWS: ClaudePilotUrlRow[] = [
  {
    pilotoNum: 1,
    url: "https://www.inapi.cl/",
    label: "Home INAPI",
    tipoPagina: "sitioweb",
    // Misma URL que Clarity rank 16 — reauditoría §20 (15 subagentes + 5 sub-subagentes §17, meta-mei orden 1)
    // Migrada a checklist PTD-LC v3.0 (51 criterios LC-*) el 2026-08-21; reauditada el 2026-08-22.
    // Reauditoría 2026-08-25 (Prompt 6 C-2026-08-25b): entrega sin ningún código interno visible
    // (LC-*, IEW/IESD, Tnnn) en texto/ubicación/propuesto/justificación; encabezado «Criterio N — Instrumento M».
    // Reauditoría 2026-08-25 (2ª pasada, C-2026-08-25c): se corrige el criterio 45 (rótulos/CTA
    // descriptivos, LC-5.2.4-01), que estaba en no_aplica por "página informativa"; ahora se evalúa
    // con evidencia real (botones «Acceder» y enlaces «Conoce más» ambiguos) y queda en incumple
    // severidad media. % baja de 78,9 a 76,9 (30/39 aplicables; antes 30/38).
    claudeAuditId: "www-inapi-cl_2026-08-25",
    resumenMvp: {
      porcentajeLc: 75.0,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-08-25T00:00:00.000Z",
      evaluadorUid: "equipo de desarrollo",
    },
    history: [
      { id: "www-inapi-cl_2026-08-22" },
      { id: "www-inapi-cl_2026-08-21" },
      { id: "www-inapi-cl_2026-08-20" },
      { id: "www-inapi-cl_2026-08-19" },
      { id: "www-inapi-cl_2026-08-18" },
      { id: "www-inapi-cl_2026-07-22" },
      { id: "www-inapi-cl_2026-06-11" },
      { id: "www-inapi-cl_2026-06-02" },
    ],
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
      evaluadorUid: "equipo de desarrollo",
    },
  },
  {
    pilotoNum: 3,
    url: "https://www.inapi.cl/marcas",
    label: "Marcas",
    tipoPagina: "sitioweb",
    // Reauditoría META MEI orden 2, checklist PTD-LC v3.0 (51 criterios LC-*).
    // 2026-08-25: corrige el criterio 45 (rótulos/CTA descriptivos), que había quedado en
    // no_aplica por "página informativa" (calibración C-2026-08-25c); entrega reescrita con
    // encabezado canónico "Criterio N — Instrumento M" y sin nomenclatura interna.
    claudeAuditId: "www-inapi-cl-marcas_2026-08-25",
    resumenMvp: {
      porcentajeLc: 71.4,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-08-25T00:00:00.000Z",
      evaluadorUid: "equipo de desarrollo",
    },
    history: [
      { id: "www-inapi-cl-marcas_2026-08-22" },
      { id: "www-inapi-cl-marcas_2026-08-21" },
      { id: "www-inapi-cl-marcas_2026-08-20" },
      { id: "www-inapi-cl-marcas_2026-08-19" },
      { id: "www-inapi-cl-marcas_2026-08-18" },
      { id: "www-inapi-cl-marcas_2026-06-05" },
    ],
  },
  {
    pilotoNum: 4,
    url: "https://www.inapi.cl/acerca-de/inapi",
    label: "Acerca de INAPI",
    tipoPagina: "sitioweb",
    // Reauditoría §20 (Paso D0 texto ascendente §17.1bis + 15 subagentes + 5 sub-subagentes §17, meta-mei orden 4)
    // Migrada a checklist PTD-LC v3.0 (51 criterios LC-*) el 2026-08-22 (antes v2.1, 47 A–H); reauditada el 2026-08-25.
    claudeAuditId: "www-inapi-cl-acerca-de-inapi_2026-08-25",
    resumenMvp: {
      porcentajeLc: 65.1,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-08-25T00:00:00.000Z",
      evaluadorUid: "equipo de desarrollo",
    },
    history: [
      { id: "www-inapi-cl-acerca-de-inapi_2026-08-22" },
      { id: "www-inapi-cl-acerca-de-inapi_2026-08-20" },
      { id: "www-inapi-cl-acerca-de-inapi_2026-08-19" },
      { id: "www-inapi-cl-acerca-de-inapi_2026-08-18" },
      { id: "www-inapi-cl-acerca-de-inapi_2026-06-07" },
    ],
  },
  {
    pilotoNum: 5,
    url: "https://www.inapi.cl/buscador?indexCatalogue=inapi&searchQuery=noticias&wordsMode=0",
    label: "Buscador de noticias",
    tipoPagina: "sitioweb",
    // Reauditoría §20 (Paso D0 texto ascendente §17.1bis + 15 subagentes + 5 sub-subagentes §17, meta-mei orden 5)
    // Migrada a checklist PTD-LC v3.0 (51 criterios LC-*) el 2026-08-22 (antes v2.1, 47 A–H); reauditada el 2026-08-25.
    claudeAuditId: "www-inapi-cl-buscador-noticias_2026-08-25",
    resumenMvp: {
      porcentajeLc: 71.0,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-08-25T00:00:00.000Z",
      evaluadorUid: "equipo de desarrollo",
    },
    history: [
      { id: "www-inapi-cl-buscador-noticias_2026-08-22" },
      { id: "www-inapi-cl-buscador-noticias_2026-08-20" },
      { id: "www-inapi-cl-buscador-noticias_2026-08-19" },
      { id: "www-inapi-cl-buscador-noticias_2026-08-18" },
      { id: "www-inapi-cl-buscador-noticias_2026-06-07" },
    ],
  },
  {
    pilotoNum: 6,
    url: "https://www.inapi.cl/marcas/tramites/solicitud-nueva",
    label: "Solicitud Nueva",
    tipoPagina: "sitioweb",
    // Reauditoría §20 (Paso D0 texto ascendente §17.1bis + 15 subagentes + 5 sub-subagentes §17, meta-mei orden 6)
    // Migrada a checklist PTD-LC v3.0 (51 criterios LC-*) el 2026-08-22 (antes v2.1, 47 A–H).
    // Reauditoría 2026-08-25: aplica C-2026-08-25c (rótulos LC-5.2.4-01 en todas las URLs) y
    // C-2026-08-25e/f/g (rigor en datos clave, fecha ausente y ausencia total → severidad alta).
    claudeAuditId: "www-inapi-cl-marcas-tramites-solicitud-nueva_2026-08-25",
    resumenMvp: {
      porcentajeLc: 71.4,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-08-25T00:00:00.000Z",
      evaluadorUid: "equipo de desarrollo",
    },
    history: [
      { id: "www-inapi-cl-marcas-tramites-solicitud-nueva_2026-08-22" },
      { id: "www-inapi-cl-marcas-tramites-solicitud-nueva_2026-08-20" },
      { id: "www-inapi-cl-marcas-tramites-solicitud-nueva_2026-08-18" },
      { id: "www-inapi-cl-marcas-tramites-solicitud-nueva_2026-06-07" },
    ],
  },
  {
    pilotoNum: 7,
    url: "https://www.inapi.cl/sala-de-prensa/noticias",
    label: "Sala de Prensa",
    tipoPagina: "sitioweb",
    // Reauditoría §20 (Paso D0 texto ascendente §17.1bis + 15 subagentes + 5 sub-subagentes §17, meta-mei orden 7)
    // Migrada a checklist PTD-LC v3.0 (51 criterios LC-*) el 2026-08-22 (antes v2.1, 47 A–H).
    // Reauditoría 2026-08-25: aplica C-2026-08-25c (rótulos LC-5.2.4-01 en todas las URLs) y
    // C-2026-08-25h (fecha de la página de listado ≠ fecha de cada noticia individual → severidad alta).
    claudeAuditId: "www-inapi-cl-sala-de-prensa-noticias_2026-08-25",
    resumenMvp: {
      porcentajeLc: 73.7,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-08-25T00:00:00.000Z",
      evaluadorUid: "equipo de desarrollo",
    },
    history: [
      { id: "www-inapi-cl-sala-de-prensa-noticias_2026-08-22" },
      { id: "www-inapi-cl-sala-de-prensa-noticias_2026-08-20" },
      { id: "www-inapi-cl-sala-de-prensa-noticias_2026-08-18" },
      { id: "www-inapi-cl-sala-de-prensa-noticias_2026-06-07" },
    ],
  },
  {
    pilotoNum: 8,
    url: "https://tramites.inapi.cl/siac",
    label: "Formulario Contacto SIAC",
    tipoPagina: "tramites",
    // Reauditoría §20 (Paso D0 texto ascendente §17.1bis + 15 subagentes + 5 sub-subagentes §17, meta-mei orden 10)
    // Reauditada el 2026-08-25 con calibraciones hasta C-2026-08-25l; cierra la muestra de
    // evaluación institucional 1…10 de esta oleada. Nuevo aviso de mantenimiento programado
    // detectado en el DOM (evidencia positiva de negrita/espaciado y hallazgos de anglicismo/tono).
    claudeAuditId: "tramites-inapi-cl-siac_2026-08-25",
    resumenMvp: {
      porcentajeLc: 54.3,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-08-25T00:00:00.000Z",
      evaluadorUid: "equipo de desarrollo",
    },
    history: [
      { id: "tramites-inapi-cl-siac_2026-08-22" },
      { id: "tramites-inapi-cl-siac_2026-08-20" },
      { id: "tramites-inapi-cl-siac_2026-08-18" },
      { id: "tramites-inapi-cl-siac_2026-06-07" },
    ],
  },
  {
    pilotoNum: 9,
    url: "https://tramites.inapi.cl/",
    label: "Trámites y Servicios",
    tipoPagina: "tramites",
    // Misma URL que Clarity rank 1 — vigente jul-2026
    claudeAuditId: "tramites-inapi-cl_2026-07-22",
    resumenMvp: {
      porcentajeLc: 60.6,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-07-22T00:00:00.000Z",
      evaluadorUid: "equipo de desarrollo",
    },
    history: [
      { id: "tramites-inapi-cl_2026-06-11" },
      { id: "tramites-inapi-cl_2026-06-07" },
    ],
  },
]

/**
 * Auditorías META MEI (compromiso jefatura) fuera del piloto 9.
 * Registradas aquí para `validate:claude-audits` y API de informe.
 */
export const META_MEI_EXTRA_AUDITS: Array<{
  id: string
  url: string
  label: string
  tipoPagina: "sitioweb" | "tramites"
  resumenMvp: {
    porcentajeLc: number
    estadoAceptacion: "rechazado" | "aceptado_con_observaciones" | "aprobado"
    fechaEvaluacionIso: string
    evaluadorUid: string
  }
  /**
   * Auditorías anteriores de la misma URL (ids en repo).
   * El `id` debe ser siempre la más reciente.
   */
  history?: { id: string }[]
}> = [
  {
    id: "www-inapi-cl-patentes_2026-08-25",
    url: "https://www.inapi.cl/patentes",
    label: "Patentes",
    tipoPagina: "sitioweb",
    // Reauditoría META MEI orden 3 (Menú principal 2/2), checklist PTD-LC v3.0 (51 criterios LC-*).
    // 2026-08-25 (segunda reauditoría del día): corrige el criterio 45 (rótulos/CTA descriptivos),
    // que la revisión anterior había marcado como no aplicable con el argumento inválido de que la
    // página, por ser informativa, correspondía a la variante exclusiva de servicios digitales. Con
    // evidencia real (enlace «Conoce más» y botón «LINK EXTERNO» sin destino descrito) el criterio
    // pasa a incumplido, lo que baja el % de 71,4% a 69,8%. Entrega CMS sin nomenclatura interna.
    resumenMvp: {
      porcentajeLc: 69.8,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-08-25T00:00:00.000Z",
      evaluadorUid: "equipo de desarrollo",
    },
    history: [
      { id: "www-inapi-cl-patentes_2026-08-22" },
      { id: "www-inapi-cl-patentes_2026-08-20" },
      { id: "www-inapi-cl-patentes_2026-08-19" },
      { id: "www-inapi-cl-patentes_2026-08-18" },
      { id: "www-inapi-cl-patentes_2026-07-29" },
    ],
  },
  {
    id: "www-inapi-cl-noticia-cuenta-publica-2026_2026-08-25",
    url: "https://www.inapi.cl/sala-de-prensa/detalle-noticia/inapi-realizo-su-cuenta-publica-participativa-2026-en-valparaiso-y-reforzo-compromiso-con-la-descentralizacion-de-la-propiedad-industrial",
    label: "Noticia — Cuenta Pública Participativa 2026",
    tipoPagina: "sitioweb",
    // Reauditoría §20 (Paso D0 texto ascendente §17.1bis + 15 subagentes + 5 sub-subagentes §17, meta-mei orden 8)
    // Migrada a checklist PTD-LC v3.0 (51 criterios LC-*) el 2026-08-22 (antes v2.1, 47 A–H).
    resumenMvp: {
      porcentajeLc: 59.0,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-08-25T00:00:00.000Z",
      evaluadorUid: "equipo de desarrollo",
    },
    history: [
      { id: "www-inapi-cl-noticia-cuenta-publica-2026_2026-08-22" },
      { id: "www-inapi-cl-noticia-cuenta-publica-2026_2026-08-20" },
      { id: "www-inapi-cl-noticia-cuenta-publica-2026_2026-08-18" },
      { id: "www-inapi-cl-noticia-cuenta-publica-2026_2026-07-29" },
    ],
  },
  {
    id: "www-inapi-cl-noticia-cifra-patentes-nacionales_2026-08-25",
    url: "https://www.inapi.cl/sala-de-prensa/detalle-noticia/chile-alcanza-su-mayor-cifra-de-solicitudes-de-patentes-nacionales-en-mas-de-una-decada",
    label: "Noticia — Cifra histórica de patentes nacionales",
    tipoPagina: "sitioweb",
    // Reauditoría §20 (Paso D0 texto ascendente §17.1bis + 15 subagentes + 5 sub-subagentes §17, meta-mei orden 9)
    // Migrada a checklist PTD-LC v3.0 (51 criterios LC-*) el 2026-08-22 (antes v2.1, 47 A–H).
    // Reauditada el 2026-08-25 con calibraciones hasta C-2026-08-25l (escaneo ≠ negritas;
    // literales solo de esta URL; desagrupado criterio 38 del 39).
    resumenMvp: {
      porcentajeLc: 62.5,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-08-25T00:00:00.000Z",
      evaluadorUid: "equipo de desarrollo",
    },
    history: [
      { id: "www-inapi-cl-noticia-cifra-patentes-nacionales_2026-08-22" },
      { id: "www-inapi-cl-noticia-cifra-patentes-nacionales_2026-08-20" },
      { id: "www-inapi-cl-noticia-cifra-patentes-nacionales_2026-08-18" },
      { id: "www-inapi-cl-noticia-cifra-patentes-nacionales_2026-07-29" },
    ],
  },
]

/** Solo ids con JSON en repo (GET /api/claude-audits/[id]). Incluye history. */
export const CLAUDE_AUDIT_LAUNCHES = [
  ...CLAUDE_PILOT_URL_ROWS.filter(
    (r): r is ClaudePilotUrlRow & { claudeAuditId: string } =>
      r.claudeAuditId !== null,
  ).map((r) => ({
    id: r.claudeAuditId,
    url: r.url,
    label: r.label,
    tipoPagina: r.tipoPagina,
  })),
  ...META_MEI_EXTRA_AUDITS.map((r) => ({
    id: r.id,
    url: r.url,
    label: r.label,
    tipoPagina: r.tipoPagina,
  })),
]

export type ClaudeAuditLaunchRow = (typeof CLAUDE_AUDIT_LAUNCHES)[number]

export const CLAUDE_AUDIT_ID_SET = new Set<string>([
  ...CLAUDE_AUDIT_LAUNCHES.map((row) => row.id),
  ...CLAUDE_PILOT_URL_ROWS.flatMap((r) => r.history?.map((h) => h.id) ?? []),
  ...META_MEI_EXTRA_AUDITS.map((r) => r.id),
])

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