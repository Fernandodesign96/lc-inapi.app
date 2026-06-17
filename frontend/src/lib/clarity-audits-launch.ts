import { CLARITY_FICHAS_MOCK } from "@/lib/clarity-fichas-mock"

/** Filas serie Clarity (17 URLs — tabla en /auditar). */
export type ClarityAuditLaunchRow = {
  rank: number
  url: string
  label: string
  tipoPagina: "sitioweb" | "tramites"
  claudeAuditId: string | null
  resumenMvp?: {
    porcentajeLc: number
    estadoAceptacion: "rechazado" | "aceptado_con_observaciones" | "aprobado"
    fechaEvaluacionIso: string
    evaluadorUid: string
  }
}

/** Ranks con JSON en data/claude-audits/urls-clarity/ (junio 2026). */
const CLARITY_AUDIT_BY_RANK: Record<
  number,
  { id: string; resumenMvp: NonNullable<ClarityAuditLaunchRow["resumenMvp"]> }
> = {
  1: {
    id: "tramites-inapi-cl_2026-06-11",
    resumenMvp: {
      porcentajeLc: 57.6,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-06-11T22:00:00.000Z",
      evaluadorUid: "Fernando Arriagada Castillo",
    },
  },
  2: {
    id: "tramites-inapi-cl-account-login_2026-06-11",
    resumenMvp: {
      porcentajeLc: 53.3,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-06-11T22:00:00.000Z",
      evaluadorUid: "Fernando Arriagada Castillo",
    },
  },
  3: {
    id: "tramites-inapi-cl-trademark-trademarkfile_2026-06-11",
    resumenMvp: {
      porcentajeLc: 40.0,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-06-11T22:00:00.000Z",
      evaluadorUid: "Fernando Arriagada Castillo",
    },
  },
  4: {
    id: "tramites-inapi-cl-notificaciones_2026-06-11",
    resumenMvp: {
      porcentajeLc: 41.2,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-06-11T22:00:00.000Z",
      evaluadorUid: "Fernando Arriagada Castillo",
    },
  },
  5: {
    id: "tramites-inapi-cl-trademark-trademarksavedapplications_2026-06-11",
    resumenMvp: {
      porcentajeLc: 47.1,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-06-11T22:00:00.000Z",
      evaluadorUid: "Fernando Arriagada Castillo",
    },
  },
  6: {
    id: "tramites-inapi-cl-trademark-trademarkapplication-indextrademark_2026-06-11",
    resumenMvp: {
      porcentajeLc: 40.0,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-06-11T22:00:00.000Z",
      evaluadorUid: "Fernando Arriagada Castillo",
    },
  },
  7: {
    id: "tramites-inapi-cl-trademark-trademarkapplication-loadtrademarkapplication_2026-06-11",
    resumenMvp: {
      porcentajeLc: 44.1,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-06-11T22:00:00.000Z",
      evaluadorUid: "Fernando Arriagada Castillo",
    },
  },
  9: {
    id: "tramites-inapi-cl-estadosdiariosmarcas_2026-06-11",
    resumenMvp: {
      porcentajeLc: 50.0,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-06-11T22:00:00.000Z",
      evaluadorUid: "Fernando Arriagada Castillo",
    },
  },
  10: {
    id: "tramites-inapi-cl-trademark-trademarknizaclassifier_2026-06-11",
    resumenMvp: {
      porcentajeLc: 44.1,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-06-11T22:00:00.000Z",
      evaluadorUid: "Fernando Arriagada Castillo",
    },
  },
  12: {
    id: "tramites-inapi-cl-trademark-trademarkuserdocument_2026-06-11",
    resumenMvp: {
      porcentajeLc: 55.9,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-06-11T22:00:00.000Z",
      evaluadorUid: "Fernando Arriagada Castillo",
    },
  },
  14: {
    id: "tramites-inapi-cl-trademark-trademarkannotation_2026-06-11",
    resumenMvp: {
      porcentajeLc: 50.0,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-06-11T22:00:00.000Z",
      evaluadorUid: "Fernando Arriagada Castillo",
    },
  },
  16: {
    id: "www-inapi-cl_2026-06-11",
    resumenMvp: {
      porcentajeLc: 45.5,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-06-11T22:00:00.000Z",
      evaluadorUid: "Fernando Arriagada Castillo",
    },
  },
  17: {
    id: "www-inapi-cl-tramites-tramites-digitales_2026-06-11",
    resumenMvp: {
      porcentajeLc: 41.7,
      estadoAceptacion: "rechazado",
      fechaEvaluacionIso: "2026-06-11T22:00:00.000Z",
      evaluadorUid: "Fernando Arriagada Castillo",
    },
  },
}

export const CLARITY_AUDIT_LAUNCH_ROWS: ClarityAuditLaunchRow[] =
  CLARITY_FICHAS_MOCK.map((ficha) => {
    const audit = CLARITY_AUDIT_BY_RANK[ficha.rank]
    return {
      rank: ficha.rank,
      url: ficha.url,
      label: ficha.nombre,
      tipoPagina: ficha.type_url,
      claudeAuditId: audit?.id ?? null,
      ...(audit ? { resumenMvp: audit.resumenMvp } : {}),
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
  
  export const CLARITY_AUDIT_ID_SET = new Set<string>(
    CLARITY_AUDIT_LAUNCHES.map((row) => row.id),
  )
  
  export function clarityLaunchByRank(rank: number): ClarityAuditLaunchRow | undefined {
    return CLARITY_AUDIT_LAUNCH_ROWS.find((r) => r.rank === rank)
  }
  
  export function clarityRowDisponibleEnMvp(row: ClarityAuditLaunchRow): boolean {
    return row.claudeAuditId !== null && CLARITY_AUDIT_ID_SET.has(row.claudeAuditId)
  }
  
  export function resultadoClarityHref(row: ClarityAuditLaunchRow): string | null {
    if (!clarityRowDisponibleEnMvp(row)) return null
    const params = new URLSearchParams({
      claudeAudit: row.claudeAuditId!,
      url: row.url,
    })
    return `/auditar/resultado?${params.toString()}`
  }