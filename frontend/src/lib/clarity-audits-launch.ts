import { CLARITY_FICHAS_MOCK } from "@/lib/clarity-fichas-mock"

export type ClarityAuditResumenMvp = {
  porcentajeLc: number
  estadoAceptacion: "rechazado" | "aceptado_con_observaciones" | "aprobado"
  fechaEvaluacionIso: string
  evaluadorUid: string
}

/** Una versión de auditoría (vigente o histórica) para la UI de historial. */
export type ClarityAuditVersion = {
  id: string
  fechaIso: string
  esVigente: boolean
  resumenMvp: ClarityAuditResumenMvp
}

/** Filas serie Clarity (17 URLs — tabla en /auditar). */
export type ClarityAuditLaunchRow = {
  rank: number
  url: string
  label: string
  tipoPagina: "sitioweb" | "tramites"
  claudeAuditId: string | null
  resumenMvp?: ClarityAuditResumenMvp
  /** Ids de auditorías anteriores (no vigentes). */
  historyIds: string[]
  /** Vigente + history, ordenadas por fecha desc. */
  versiones: ClarityAuditVersion[]
}

/** Ranks con JSON en data/claude-audits/urls-clarity/ (junio 2026). */
const CLARITY_AUDIT_BY_RANK: Record<
  number,
  {
    id: string
    resumenMvp: ClarityAuditResumenMvp
    /** Auditorías anteriores de la misma URL, conservadas en data/ pero no vigentes en el MVP. */
    history?: { id: string }[]
  }
> = {
  1: {
    id: "tramites-inapi-cl_2026-07-22",
    resumenMvp: {
      porcentajeLc: 60.6,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-07-22T00:00:00.000Z",
      evaluadorUid: "equipo de desarrollo",
    },
    history: [
      {
        id: "tramites-inapi-cl_2026-06-11",
      },
    ],
  },
  2: {
    id: "tramites-inapi-cl-account-login_2026-07-22",
    resumenMvp: {
      porcentajeLc: 51.7,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-07-22T00:00:00.000Z",
      evaluadorUid: "equipo de desarrollo",
    },
    history: [
      {
        id: "tramites-inapi-cl-account-login_2026-06-11",
      },
    ],
  },
  3: {
    id: "tramites-inapi-cl-trademark-trademarkfile_2026-07-27",
    resumenMvp: {
      porcentajeLc: 39.4,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-07-27T00:00:00.000Z",
      evaluadorUid: "equipo de desarrollo",
    },
    history: [
      {
        id: "tramites-inapi-cl-trademark-trademarkfile_2026-06-11",
      },
    ],
  },
  4: {
    id: "tramites-inapi-cl-notificaciones_2026-07-27",
    resumenMvp: {
      porcentajeLc: 36.4,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-07-27T00:00:00.000Z",
      evaluadorUid: "equipo de desarrollo",
    },
    history: [
      {
        id: "tramites-inapi-cl-notificaciones_2026-06-11",
      },
    ],
  },
  5: {
    id: "tramites-inapi-cl-trademark-trademarksavedapplications_2026-07-27",
    resumenMvp: {
      porcentajeLc: 48.4,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-07-27T00:00:00.000Z",
      evaluadorUid: "equipo de desarrollo",
    },
    history: [
      {
        id: "tramites-inapi-cl-trademark-trademarksavedapplications_2026-06-11",
      },
    ],
  },
  6: {
    id: "tramites-inapi-cl-trademark-trademarkapplication-indextrademark_2026-07-27",
    resumenMvp: {
      porcentajeLc: 28.1,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-07-27T00:00:00.000Z",
      evaluadorUid: "equipo de desarrollo",
    },
    history: [
      {
        id: "tramites-inapi-cl-trademark-trademarkapplication-indextrademark_2026-06-11",
      },
    ],
  },
  7: {
    id: "tramites-inapi-cl-trademark-trademarkapplication-loadtrademarkapplication_2026-07-27",
    resumenMvp: {
      porcentajeLc: 43.3,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-07-27T00:00:00.000Z",
      evaluadorUid: "equipo de desarrollo",
    },
    history: [
      {
        id: "tramites-inapi-cl-trademark-trademarkapplication-loadtrademarkapplication_2026-06-11",
      },
    ],
  },
  9: {
    id: "tramites-inapi-cl-estadosdiariosmarcas_2026-07-22",
    resumenMvp: {
      porcentajeLc: 50.0,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-07-22T00:00:00.000Z",
      evaluadorUid: "equipo de desarrollo",
    },
    history: [
      {
        id: "tramites-inapi-cl-estadosdiariosmarcas_2026-06-11",
      },
    ],
  },
  10: {
    id: "tramites-inapi-cl-trademark-trademarknizaclassifier_2026-07-27",
    resumenMvp: {
      porcentajeLc: 41.2,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-07-27T00:00:00.000Z",
      evaluadorUid: "equipo de desarrollo",
    },
    history: [
      {
        id: "tramites-inapi-cl-trademark-trademarknizaclassifier_2026-06-11",
      },
    ],
  },
  12: {
    id: "tramites-inapi-cl-trademark-trademarkuserdocument_2026-07-27",
    resumenMvp: {
      porcentajeLc: 48.4,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-07-27T00:00:00.000Z",
      evaluadorUid: "equipo de desarrollo",
    },
    history: [
      {
        id: "tramites-inapi-cl-trademark-trademarkuserdocument_2026-06-11",
      },
    ],
  },
  14: {
    id: "tramites-inapi-cl-trademark-trademarkannotation_2026-07-27",
    resumenMvp: {
      porcentajeLc: 52.9,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-07-27T00:00:00.000Z",
      evaluadorUid: "equipo de desarrollo",
    },
    history: [
      {
        id: "tramites-inapi-cl-trademark-trademarkannotation_2026-06-11",
      },
    ],
  },
  16: {
    id: "www-inapi-cl_2026-07-22",
    resumenMvp: {
      porcentajeLc: 54.5,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-07-22T00:00:00.000Z",
      evaluadorUid: "equipo de desarrollo",
    },
    history: [
      {
        id: "www-inapi-cl_2026-06-11",
      },
    ],
  },
  17: {
    id: "www-inapi-cl-tramites-tramites-digitales_2026-07-22",
    resumenMvp: {
      porcentajeLc: 41.7,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-07-22T00:00:00.000Z",
      evaluadorUid: "equipo de desarrollo",
    },
    history: [
      {
        id: "www-inapi-cl-tramites-tramites-digitales_2026-06-11",
      },
    ],
  },
}

const EVALUADOR = "equipo de desarrollo"

/** Meta de cada id (vigente + history) para tablas sin fetch N+1. */
const CLARITY_AUDIT_META_BY_ID: Record<string, ClarityAuditResumenMvp> = {
  "tramites-inapi-cl_2026-06-11": {
    porcentajeLc: 57.6,
    estadoAceptacion: "rechazado",
    fechaEvaluacionIso: "2026-06-11T22:00:00.000Z",
    evaluadorUid: EVALUADOR,
  },
  "tramites-inapi-cl_2026-07-22": {
    porcentajeLc: 60.6,
    estadoAceptacion: "rechazado",
    fechaEvaluacionIso: "2026-07-22T00:00:00.000Z",
    evaluadorUid: EVALUADOR,
  },
  "tramites-inapi-cl-account-login_2026-06-11": {
    porcentajeLc: 53.3,
    estadoAceptacion: "rechazado",
    fechaEvaluacionIso: "2026-06-11T22:00:00.000Z",
    evaluadorUid: EVALUADOR,
  },
  "tramites-inapi-cl-account-login_2026-07-22": {
    porcentajeLc: 51.7,
    estadoAceptacion: "rechazado",
    fechaEvaluacionIso: "2026-07-22T00:00:00.000Z",
    evaluadorUid: EVALUADOR,
  },
  "tramites-inapi-cl-trademark-trademarkfile_2026-06-11": {
    porcentajeLc: 40.0,
    estadoAceptacion: "rechazado",
    fechaEvaluacionIso: "2026-06-11T22:00:00.000Z",
    evaluadorUid: EVALUADOR,
  },
  "tramites-inapi-cl-trademark-trademarkfile_2026-07-27": {
    porcentajeLc: 39.4,
    estadoAceptacion: "rechazado",
    fechaEvaluacionIso: "2026-07-27T00:00:00.000Z",
    evaluadorUid: EVALUADOR,
  },
  "tramites-inapi-cl-notificaciones_2026-06-11": {
    porcentajeLc: 41.2,
    estadoAceptacion: "rechazado",
    fechaEvaluacionIso: "2026-06-11T22:00:00.000Z",
    evaluadorUid: EVALUADOR,
  },
  "tramites-inapi-cl-notificaciones_2026-07-27": {
    porcentajeLc: 36.4,
    estadoAceptacion: "rechazado",
    fechaEvaluacionIso: "2026-07-27T00:00:00.000Z",
    evaluadorUid: EVALUADOR,
  },
  "tramites-inapi-cl-trademark-trademarksavedapplications_2026-06-11": {
    porcentajeLc: 47.1,
    estadoAceptacion: "rechazado",
    fechaEvaluacionIso: "2026-06-11T22:00:00.000Z",
    evaluadorUid: EVALUADOR,
  },
  "tramites-inapi-cl-trademark-trademarksavedapplications_2026-07-27": {
    porcentajeLc: 48.4,
    estadoAceptacion: "rechazado",
    fechaEvaluacionIso: "2026-07-27T00:00:00.000Z",
    evaluadorUid: EVALUADOR,
  },
  "tramites-inapi-cl-trademark-trademarkapplication-indextrademark_2026-06-11": {
    porcentajeLc: 40.0,
    estadoAceptacion: "rechazado",
    fechaEvaluacionIso: "2026-06-11T22:00:00.000Z",
    evaluadorUid: EVALUADOR,
  },
  "tramites-inapi-cl-trademark-trademarkapplication-indextrademark_2026-07-27": {
    porcentajeLc: 28.1,
    estadoAceptacion: "rechazado",
    fechaEvaluacionIso: "2026-07-27T00:00:00.000Z",
    evaluadorUid: EVALUADOR,
  },
  "tramites-inapi-cl-trademark-trademarkapplication-loadtrademarkapplication_2026-06-11": {
    porcentajeLc: 44.1,
    estadoAceptacion: "rechazado",
    fechaEvaluacionIso: "2026-06-11T22:00:00.000Z",
    evaluadorUid: EVALUADOR,
  },
  "tramites-inapi-cl-trademark-trademarkapplication-loadtrademarkapplication_2026-07-27": {
    porcentajeLc: 43.3,
    estadoAceptacion: "rechazado",
    fechaEvaluacionIso: "2026-07-27T00:00:00.000Z",
    evaluadorUid: EVALUADOR,
  },
  "tramites-inapi-cl-estadosdiariosmarcas_2026-06-11": {
    porcentajeLc: 50.0,
    estadoAceptacion: "rechazado",
    fechaEvaluacionIso: "2026-06-11T22:00:00.000Z",
    evaluadorUid: EVALUADOR,
  },
  "tramites-inapi-cl-estadosdiariosmarcas_2026-07-22": {
    porcentajeLc: 50.0,
    estadoAceptacion: "rechazado",
    fechaEvaluacionIso: "2026-07-22T00:00:00.000Z",
    evaluadorUid: EVALUADOR,
  },
  "tramites-inapi-cl-trademark-trademarknizaclassifier_2026-06-11": {
    porcentajeLc: 44.1,
    estadoAceptacion: "rechazado",
    fechaEvaluacionIso: "2026-06-11T22:00:00.000Z",
    evaluadorUid: EVALUADOR,
  },
  "tramites-inapi-cl-trademark-trademarknizaclassifier_2026-07-27": {
    porcentajeLc: 41.2,
    estadoAceptacion: "rechazado",
    fechaEvaluacionIso: "2026-07-27T00:00:00.000Z",
    evaluadorUid: EVALUADOR,
  },
  "tramites-inapi-cl-trademark-trademarkuserdocument_2026-06-11": {
    porcentajeLc: 55.9,
    estadoAceptacion: "rechazado",
    fechaEvaluacionIso: "2026-06-11T22:00:00.000Z",
    evaluadorUid: EVALUADOR,
  },
  "tramites-inapi-cl-trademark-trademarkuserdocument_2026-07-27": {
    porcentajeLc: 48.4,
    estadoAceptacion: "rechazado",
    fechaEvaluacionIso: "2026-07-27T00:00:00.000Z",
    evaluadorUid: EVALUADOR,
  },
  "tramites-inapi-cl-trademark-trademarkannotation_2026-06-11": {
    porcentajeLc: 50.0,
    estadoAceptacion: "rechazado",
    fechaEvaluacionIso: "2026-06-11T22:00:00.000Z",
    evaluadorUid: EVALUADOR,
  },
  "tramites-inapi-cl-trademark-trademarkannotation_2026-07-27": {
    porcentajeLc: 52.9,
    estadoAceptacion: "rechazado",
    fechaEvaluacionIso: "2026-07-27T00:00:00.000Z",
    evaluadorUid: EVALUADOR,
  },
  "www-inapi-cl_2026-06-11": {
    porcentajeLc: 45.5,
    estadoAceptacion: "rechazado",
    fechaEvaluacionIso: "2026-06-11T22:00:00.000Z",
    evaluadorUid: EVALUADOR,
  },
  "www-inapi-cl_2026-07-22": {
    porcentajeLc: 54.5,
    estadoAceptacion: "rechazado",
    fechaEvaluacionIso: "2026-07-22T00:00:00.000Z",
    evaluadorUid: EVALUADOR,
  },
  "www-inapi-cl-tramites-tramites-digitales_2026-06-11": {
    porcentajeLc: 41.7,
    estadoAceptacion: "rechazado",
    fechaEvaluacionIso: "2026-06-11T22:00:00.000Z",
    evaluadorUid: EVALUADOR,
  },
  "www-inapi-cl-tramites-tramites-digitales_2026-07-22": {
    porcentajeLc: 41.7,
    estadoAceptacion: "rechazado",
    fechaEvaluacionIso: "2026-07-22T00:00:00.000Z",
    evaluadorUid: EVALUADOR,
  },
}

function auditDateFromId(id: string): string | null {
  const match = id.match(/_(\d{4}-\d{2}-\d{2})$/)
  return match?.[1] ?? null
}

function metaForId(id: string): ClarityAuditResumenMvp {
  const meta = CLARITY_AUDIT_META_BY_ID[id]
  if (!meta) {
    throw new Error(`Falta CLARITY_AUDIT_META_BY_ID para id: ${id}`)
  }
  return meta
}

function buildVersiones(
  vigenteId: string,
  history: { id: string }[] | undefined,
): ClarityAuditVersion[] {
  const historyIds = history?.map((h) => h.id) ?? []
  const allIds = [vigenteId, ...historyIds]
  return allIds
    .map((id) => {
      const resumenMvp = metaForId(id)
      const fecha = auditDateFromId(id) ?? resumenMvp.fechaEvaluacionIso.slice(0, 10)
      return {
        id,
        fechaIso: `${fecha}T00:00:00.000Z`,
        esVigente: id === vigenteId,
        resumenMvp,
      }
    })
    .sort((a, b) => b.fechaIso.localeCompare(a.fechaIso))
}

export const CLARITY_AUDIT_LAUNCH_ROWS: ClarityAuditLaunchRow[] =
  CLARITY_FICHAS_MOCK.map((ficha) => {
    const audit = CLARITY_AUDIT_BY_RANK[ficha.rank]
    if (!audit) {
      return {
        rank: ficha.rank,
        url: ficha.url,
        label: ficha.nombre,
        tipoPagina: ficha.type_url,
        claudeAuditId: null,
        historyIds: [],
        versiones: [],
      }
    }
    const historyIds = audit.history?.map((h) => h.id) ?? []
    return {
      rank: ficha.rank,
      url: ficha.url,
      label: ficha.nombre,
      tipoPagina: ficha.type_url,
      claudeAuditId: audit.id,
      resumenMvp: audit.resumenMvp,
      historyIds,
      versiones: buildVersiones(audit.id, audit.history),
    }
  })

export const CLARITY_AUDIT_LAUNCHES = CLARITY_AUDIT_LAUNCH_ROWS.filter(
  (r): r is ClarityAuditLaunchRow & { claudeAuditId: string } =>
    r.claudeAuditId !== null,
).map((r) => ({
  id: r.claudeAuditId,
  url: r.url,
  label: r.label,
  tipoPagina: r.tipoPagina,
  rank: r.rank,
}))

/** Vigentes + históricas — allowlist API / validate. */
export const CLARITY_AUDIT_ID_SET = new Set<string>(
  Object.keys(CLARITY_AUDIT_META_BY_ID),
)

export function clarityLaunchByRank(
  rank: number,
): ClarityAuditLaunchRow | undefined {
  return CLARITY_AUDIT_LAUNCH_ROWS.find((r) => r.rank === rank)
}

export function clarityRowsConHistorial(): ClarityAuditLaunchRow[] {
  return CLARITY_AUDIT_LAUNCH_ROWS.filter((r) => r.claudeAuditId !== null)
}

export function clarityHistorialByRank(rank: number): ClarityAuditVersion[] {
  return clarityLaunchByRank(rank)?.versiones ?? []
}

export function clarityRowDisponibleEnMvp(row: ClarityAuditLaunchRow): boolean {
  return (
    row.claudeAuditId !== null && CLARITY_AUDIT_ID_SET.has(row.claudeAuditId)
  )
}

export function resultadoClarityHref(
  row: ClarityAuditLaunchRow,
): string | null {
  if (!clarityRowDisponibleEnMvp(row)) return null
  return resultadoClarityHrefForId(row.url, row.claudeAuditId!)
}

export function resultadoClarityHrefForId(url: string, id: string): string {
  const params = new URLSearchParams({ claudeAudit: id, url })
  return `/auditar/resultado?${params.toString()}`
}

export function historialHref(): string {
  return "/auditar/historial"
}

export function historialRankHref(rank: number): string {
  return `/auditar/historial/${rank}`
}