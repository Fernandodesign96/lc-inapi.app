import { z } from "zod"

/**
 * IDs oficiales META MEI 2026 — Lenguaje claro PTD (51 preguntas / indicadores IEW·IESD).
 * Fuente: `data/checklist-criteria-lc-ptd.json` · nomenclatura `LC-{indicador}-{nn}`.
 * Auditorías nuevas: `version_checklist: "3.0"`.
 */
export const CRITERION_IDS_V30 = [
  "LC-1.1.1-01",
  "LC-1.1.2-01",
  "LC-1.1.2-02",
  "LC-1.1.2-03",
  "LC-1.1.2-04",
  "LC-1.1.3-01",
  "LC-1.1.3-02",
  "LC-1.1.3-03",
  "LC-1.1.3-04",
  "LC-1.1.3-05",
  "LC-1.1.3-06",
  "LC-1.1.4-01",
  "LC-1.1.5-01",
  "LC-1.1.5-02",
  "LC-1.1.5-03",
  "LC-1.1.6-01",
  "LC-1.1.6-02",
  "LC-1.1.7-01",
  "LC-1.1.7-02",
  "LC-1.1.7-03",
  "LC-1.1.8-01",
  "LC-1.1.8-02",
  "LC-1.1.8-03",
  "LC-1.2.1-01",
  "LC-5.2.1-01",
  "LC-1.2.1-02",
  "LC-1.2.1-03",
  "LC-1.2.1-04",
  "LC-1.2.1-05",
  "LC-1.2.2-01",
  "LC-5.2.2-01",
  "LC-1.2.2-02",
  "LC-1.2.2-03",
  "LC-1.2.2-04",
  "LC-1.2.2-05",
  "LC-1.2.3-01",
  "LC-1.2.3-02",
  "LC-1.2.3-03",
  "LC-1.2.4-01",
  "LC-1.2.4-02",
  "LC-1.2.4-03",
  "LC-1.2.4-04",
  "LC-1.2.4-05",
  "LC-1.2.4-06",
  "LC-5.2.4-01",
  "LC-1.2.4-07",
  "LC-1.2.4-08",
  "LC-1.3.1-01",
  "LC-1.3.2-01",
  "LC-1.3.2-02",
  "LC-1.3.3-01",
] as const

/**
 * IDs históricos Checklist Editorial INAPI v2.1 (47 criterios A–H).
 * Fuente: `data/checklist-criteria.json`. Solo para JSON ya emitidos (no auditorías nuevas).
 */
export const CRITERION_IDS_V21 = [
  "A1",
  "A2",
  "A3",
  "A4",
  "A5",
  "A6",
  "A7",
  "A8",
  "A9",
  "B1",
  "B2",
  "B3",
  "B4",
  "B5",
  "B6",
  "B7",
  "B8",
  "C1",
  "C2",
  "C3",
  "C4",
  "C5",
  "C6",
  "C7",
  "C8",
  "C9",
  "D1",
  "D2",
  "D3",
  "D4",
  "D5",
  "D6",
  "D7",
  "E1",
  "E2",
  "E3",
  "E4",
  "F1",
  "F2",
  "F3",
  "F4",
  "F5",
  "F6",
  "G1",
  "G2",
  "G3",
  "H1",
] as const

/** Alias histórico — preferir `CRITERION_IDS_V21` / `CRITERION_IDS_V30`. */
export const CRITERION_IDS = CRITERION_IDS_V21

/** IDs históricos v1.1 (39) — auditorías y fixtures previos a v2.1. */
export const CRITERION_IDS_V11 = [
  "A1",
  "A2",
  "A3",
  "A4",
  "A5",
  "B1",
  "B2",
  "B3",
  "B4",
  "B5",
  "B6",
  "B7",
  "C1",
  "C2",
  "C3",
  "C4",
  "C5",
  "C6",
  "C7",
  "D1",
  "D2",
  "D3",
  "D4",
  "D5",
  "D6",
  "D7",
  "E1",
  "E2",
  "E3",
  "E4",
  "F1",
  "F2",
  "F3",
  "F4",
  "F5",
  "G1",
  "G2",
  "G3",
  "H1",
] as const

export const CRITERION_COUNT_V30 = CRITERION_IDS_V30.length
export const CRITERION_COUNT_V21 = CRITERION_IDS_V21.length
/** @deprecated Usar CRITERION_COUNT_V21; demos/fixtures siguen en 47. */
export const CRITERION_COUNT = CRITERION_COUNT_V21
export const CRITERION_COUNT_V11 = CRITERION_IDS_V11.length

export type CriterionIdV30 = (typeof CRITERION_IDS_V30)[number]
export type CriterionIdV21 = (typeof CRITERION_IDS_V21)[number]
export type CriterionId =
  | CriterionIdV30
  | CriterionIdV21
  | (typeof CRITERION_IDS_V11)[number]

const KNOWN_CRITERION_IDS = new Set<string>([
  ...CRITERION_IDS_V30,
  ...CRITERION_IDS_V21,
  ...CRITERION_IDS_V11,
])

export const criterionIdSchema = z.string().refine(
  (id): id is CriterionId => KNOWN_CRITERION_IDS.has(id),
  { message: "id de criterio desconocido (no está en v3.0 / v2.1 / v1.1)" },
)

export const checklistApplicabilitySchema = z.enum([
  "ambos",
  "sitioweb",
  "tramites",
])

export type ChecklistApplicability = z.infer<typeof checklistApplicabilitySchema>

/** Criterio v2.1 (secciones A–H). */
export const checklistCriterionSchema = z.object({
  id: z.enum(CRITERION_IDS_V21),
  section_id: z.enum(["A", "B", "C", "D", "E", "F", "G", "H"]),
  section_title: z.string().min(1),
  criterion: z.string().min(1),
  verification: z.string().min(1),
  source: z.string().min(1),
  applicability: checklistApplicabilitySchema,
})

export const checklistCriteriaFileSchema = z.object({
  checklist_version: z.string().min(1),
  title: z.string().min(1),
  criteria: z.array(checklistCriterionSchema).length(CRITERION_COUNT_V21),
})

/** Criterio v3.0 PTD-LC (indicadores IEW/IESD). */
export const checklistCriterionLcPtdSchema = z.object({
  id: z.enum(CRITERION_IDS_V30),
  indicator_code_iew: z.string().nullable(),
  indicator_code_iesd: z.string().nullable(),
  indicator_code_display: z.string().min(1),
  indicator_name: z.string().min(1),
  section_id: z.string().min(1),
  section_title: z.string().min(1),
  criterion: z.string().min(1),
  verification: z.string().min(1),
  display_label: z.string().min(1),
  source: z.string().min(1),
  applicability: checklistApplicabilitySchema,
  criticidad: z.enum(["imprescindible", "esperable", "deseable"]),
  dimension: z.literal("lenguaje_claro"),
})

export const checklistCriteriaLcPtdFileSchema = z
  .object({
    checklist_version: z.literal("3.0"),
    title: z.string().min(1),
    criterion_count: z.literal(CRITERION_COUNT_V30),
    criteria: z.array(checklistCriterionLcPtdSchema).length(CRITERION_COUNT_V30),
  })
  .passthrough()

export type ChecklistCriterion = z.infer<typeof checklistCriterionSchema>
export type ChecklistCriteriaFile = z.infer<typeof checklistCriteriaFileSchema>
export type ChecklistCriterionLcPtd = z.infer<typeof checklistCriterionLcPtdSchema>
export type ChecklistCriteriaLcPtdFile = z.infer<
  typeof checklistCriteriaLcPtdFileSchema
>

/** Estado por criterio tras una evaluación (humana o asistida por IA). */
export const criterionResultStateSchema = z.enum([
  "cumple",
  "incumple",
  "no_aplica",
])

export type CriterionResultState = z.infer<typeof criterionResultStateSchema>

export const severitySchema = z.enum(["baja", "media", "alta"])

export type Severity = z.infer<typeof severitySchema>

/** Orden para rotar severidad entre filas incumplidas (mock determinista). */
const MOCK_SEVERIDAD_ROTACION: Severity[] = ["baja", "media", "alta"]

/**
 * Reglas mock acordadas con Equipo UX (ajustar aquí si cambian):
 * - severidad y comentario solo en `incumple`
 * - sin aleatoriedad: rotación por orden de aparición entre incumplidos
 * - severidad baja incluye observación breve mock (cumple con observaciones)
 */
export type MockSeveridadBias = "peor" | "intermedio" | "mejor"

const MOCK_BIAS_INDEX: Record<MockSeveridadBias, number> = {
  peor: 2,
  intermedio: 1,
  mejor: 0,
}

/**
 * Rellena `severidad` y `comentario` en filas `incumple` sin alterar conteos del resumen.
 */
export function enrichCriterionEvaluationsForMock(
  evaluations: CriterionEvaluation[],
  bias: MockSeveridadBias = "intermedio",
): CriterionEvaluation[] {
  let incumpleIndex = 0
  const baseBias = MOCK_BIAS_INDEX[bias]

  return evaluations.map((row) => {
    if (row.estado !== "incumple") {
      return row
    }
    const sev =
      MOCK_SEVERIDAD_ROTACION[
        (incumpleIndex + baseBias) % MOCK_SEVERIDAD_ROTACION.length
      ]
    incumpleIndex += 1

    const comentarioPorSeveridad: Record<Severity, string | undefined> = {
      baja:
        "Cumple con observaciones: afinar microcopy o consistencia menor sin bloquear publicación; revisar en próxima iteración.",
      media: "Revisar redacción en titular o microcopy asociado al criterio.",
      alta: "Priorizar corrección antes de publicación: lenguaje poco claro o inconsistente con la pauta INAPI.",
    }

    return {
      ...row,
      severidad: sev,
      comentario: comentarioPorSeveridad[sev],
    }
  })
}

/** Conjunto de IDs esperado según cantidad de filas (v3.0=51, v2.1=47, v1.1=39). */
export function expectedCriterionIds(
  evaluationCount: number,
): readonly CriterionId[] {
  if (evaluationCount === CRITERION_COUNT_V30) {
    return CRITERION_IDS_V30 as readonly CriterionId[]
  }
  if (evaluationCount === CRITERION_COUNT_V21) {
    return CRITERION_IDS_V21 as readonly CriterionId[]
  }
  if (evaluationCount === CRITERION_COUNT_V11) {
    return CRITERION_IDS_V11 as readonly CriterionId[]
  }
  throw new Error(
    `Se esperaban ${CRITERION_COUNT_V30} (v3.0), ${CRITERION_COUNT_V21} (v2.1) o ${CRITERION_COUNT_V11} (v1.1) evaluaciones, hay ${evaluationCount}`,
  )
}

/** IDs canónicos según `version_checklist` del JSON de auditoría. */
export function criterionIdsForChecklistVersion(
  version: string,
): readonly CriterionId[] {
  if (version === "3.0" || version.startsWith("3.")) {
    return CRITERION_IDS_V30 as readonly CriterionId[]
  }
  if (version === "2.1" || version.startsWith("2.")) {
    return CRITERION_IDS_V21 as readonly CriterionId[]
  }
  if (version === "1.1" || version.startsWith("1.")) {
    return CRITERION_IDS_V11 as readonly CriterionId[]
  }
  return CRITERION_IDS_V30 as readonly CriterionId[]
}

export const criterionEvaluationSchema = z.object({
  id: criterionIdSchema,
  estado: criterionResultStateSchema,
  cita_textual: z.string().optional(),
  severidad: severitySchema.optional(),
  /**
   * Obligatorio en auditorías nuevas v2.1 para `no_aplica` e `incumple`.
   * En `no_aplica`: justificación breve de por qué no aplica en esta URL.
   */
  comentario: z.string().optional(),
  /**
   * Si este `incumple` está absorbido por otro criterio primario (mismo texto
   * propuesto), indicar aquí el id primario. No descuenta en el %.
   */
  agrupado_en: criterionIdSchema.optional(),
  /**
   * Capa DOM (opcional). METADATA no entra en entrega UI/PDF/Excel
   * (solo contenido visible en pantalla).
   */
  capa: z.enum(["VISIBLE", "METADATA", "SISTEMA"]).optional(),
})

export type CriterionEvaluation = z.infer<typeof criterionEvaluationSchema>

/** Escala de aceptación del checklist (por % sobre criterios aplicables). */
export const acceptanceStatusSchema = z.enum([
  "rechazado",
  "aceptado_con_observaciones",
  "aprobado",
])

export type AcceptanceStatus = z.infer<typeof acceptanceStatusSchema>

export function acceptanceStatusFromPercentage(pct: number): AcceptanceStatus {
  if (pct <= 80) return "rechazado"
  if (pct < 91) return "aceptado_con_observaciones"
  return "aprobado"
}

/** Agrega conteos y % según fórmula del checklist: aprobados / aplicables × 100 (excluye N/A). */
export function summarizeEvaluations(
  evaluations: CriterionEvaluation[],
): {
  criterios_aprobados: number
  criterios_incumplidos: number
  criterios_no_aplica: number
  criterios_aplicables: number
  porcentaje_cumplimiento: number
  estado_aceptacion: AcceptanceStatus
} {
  const expectedIds = expectedCriterionIds(evaluations.length)
  const byId = new Map<CriterionId, CriterionEvaluation>()
  for (const e of evaluations) {
    byId.set(e.id, e)
  }
  let noAplica = 0
  let cumple = 0
  let incumple = 0
  let agrupados = 0
  for (const id of expectedIds) {
    const ev = byId.get(id)
    if (!ev) {
      throw new Error(`Falta evaluación para criterio ${id}`)
    }
    if (ev.estado === "no_aplica") noAplica++
    else if (ev.estado === "cumple") cumple++
    else if (ev.agrupado_en) agrupados++
    else incumple++
  }
  const aplicables = expectedIds.length - noAplica
  // Los agrupados no descuentan: mismo hallazgo ya contado en el criterio primario.
  const numerador = cumple + agrupados
  const porcentaje_cumplimiento =
    aplicables === 0 ? 0 : Math.round((numerador / aplicables) * 1000) / 10
  return {
    criterios_aprobados: numerador,
    criterios_incumplidos: incumple,
    criterios_no_aplica: noAplica,
    criterios_aplicables: aplicables,
    porcentaje_cumplimiento,
    estado_aceptacion: acceptanceStatusFromPercentage(porcentaje_cumplimiento),
  }
}

const criteriosEvaluadosSchema = z
  .array(criterionEvaluationSchema)
  .superRefine((arr, ctx) => {
    const ok =
      arr.length === CRITERION_COUNT_V30 ||
      arr.length === CRITERION_COUNT_V21 ||
      arr.length === CRITERION_COUNT_V11
    if (!ok) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `criterios_evaluados debe tener ${CRITERION_COUNT_V30} (v3.0), ${CRITERION_COUNT_V21} (v2.1) o ${CRITERION_COUNT_V11} (v1.1) filas; hay ${arr.length}`,
      })
    }
  })

/** Resultado de auditoría (mock o persistido) — alineado al MVP conceptual. */
export const auditRecordSchema = z.object({
  id: z.string().min(1),
  url: z.string().url(),
  fecha_evaluacion: z.string().datetime(),
  evaluador_uid: z.string().email().or(z.string().min(1)),
  version_checklist: z.string().min(1),
  texto_capturado: z.string(),
  criterios_evaluados: criteriosEvaluadosSchema,
  criterios_aprobados: z.number().int().min(0).max(CRITERION_COUNT_V30),
  criterios_aplicables: z.number().int().min(0).max(CRITERION_COUNT_V30),
  criterios_no_aplica: z.number().int().min(0).max(CRITERION_COUNT_V30),
  porcentaje_cumplimiento: z.number().min(0).max(100),
  estado_aceptacion: acceptanceStatusSchema,
  texto_propuesto: z.string().optional(),
  /** Resumen editorial de hallazgos (no es la redacción sustituta publicada en la URL). */
  observaciones_lc: z.string().optional(),
  tiempo_evaluacion_segundos: z.number().nonnegative().optional(),
})

export type AuditRecord = z.infer<typeof auditRecordSchema>

/** Valida coherencia numérica entre resumen y arreglo de evaluaciones. */
export const strictAuditRecordSchema = auditRecordSchema.superRefine((val, ctx) => {
  let sum: ReturnType<typeof summarizeEvaluations>
  try {
    sum = summarizeEvaluations(val.criterios_evaluados)
  } catch (e) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: e instanceof Error ? e.message : "Error al resumir evaluaciones",
    })
    return
  }
  const checks: [keyof typeof sum, keyof AuditRecord][] = [
    ["criterios_aprobados", "criterios_aprobados"],
    ["criterios_aplicables", "criterios_aplicables"],
    ["criterios_no_aplica", "criterios_no_aplica"],
    ["porcentaje_cumplimiento", "porcentaje_cumplimiento"],
    ["estado_aceptacion", "estado_aceptacion"],
  ]
  for (const [a, b] of checks) {
    if (sum[a] !== val[b]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [b],
        message: `Esperado ${String(sum[a])} desde criterios_evaluados, recibido ${String(val[b])}`,
      })
    }
  }
})

export type StrictAuditRecord = z.infer<typeof strictAuditRecordSchema>

export function parseChecklistCriteriaFile(data: unknown): ChecklistCriteriaFile {
  return checklistCriteriaFileSchema.parse(data)
}

export function parseChecklistCriteriaLcPtdFile(
  data: unknown,
): ChecklistCriteriaLcPtdFile {
  return checklistCriteriaLcPtdFileSchema.parse(data)
}

export function parseAuditRecord(data: unknown): AuditRecord {
  return auditRecordSchema.parse(data)
}

export function parseStrictAuditRecord(data: unknown): StrictAuditRecord {
  return strictAuditRecordSchema.parse(data)
}

/** Construye las 47 evaluaciones v2.1 (por defecto `cumple`) para mocks y tests. */
export function buildDemoEvaluations(
  overrides: Partial<Record<CriterionId, Partial<Omit<CriterionEvaluation, "id">>>> = {},
): CriterionEvaluation[] {
  return CRITERION_IDS.map((id) => {
    const base: CriterionEvaluation = { id, estado: "cumple" }
    const extra = overrides[id]
    return extra ? { ...base, ...extra, id } : base
  })
}

/** Auditoría demo consistente (todos cumplen → 100 % aprobado). */
export function buildDemoStrictAudit(overrides?: Partial<AuditRecord>): StrictAuditRecord {
  const criterios_evaluados = buildDemoEvaluations()
  const sum = summarizeEvaluations(criterios_evaluados)
  const base: AuditRecord = {
    id: "demo_audit_all_cumple",
    url: "https://tramites.inapi.cl/",
    fecha_evaluacion: new Date().toISOString(),
    evaluador_uid: "demo@inapi.cl",
    version_checklist: "2.1",
    texto_capturado: "(texto de demostración)",
    criterios_evaluados,
    ...sum,
    texto_propuesto: undefined,
    observaciones_lc: undefined,
    tiempo_evaluacion_segundos: 1,
  }
  return strictAuditRecordSchema.parse({ ...base, ...overrides })
}

/**
 * Auditoría demo con N criterios en "cumple", opcionalmente K en "no_aplica", y el
 * resto en "incumple". Coherente con `summarizeEvaluations` y `strictAuditRecordSchema`.
 */
export function buildDemoStrictAuditWithCumpleCount(
  cumpleCount: number,
  overrides?: Partial<AuditRecord>,
  mockSeveridadBias: MockSeveridadBias = "intermedio",
  noAplicaCount = 0,
): StrictAuditRecord {
  const total = CRITERION_COUNT
  const na = Math.max(0, Math.min(total, Math.floor(noAplicaCount)))
  const aplicables = total - na
  const nCumple = Math.max(0, Math.min(aplicables, Math.floor(cumpleCount)))
  const criterios_evaluadosRaw: CriterionEvaluation[] = CRITERION_IDS.map(
    (id, idx) => {
      if (idx < na) {
        return { id, estado: "no_aplica" as const }
      }
      const pos = idx - na
      if (pos < nCumple) {
        return { id, estado: "cumple" as const }
      }
      return { id, estado: "incumple" as const }
    },
  )
  const criterios_evaluados = enrichCriterionEvaluationsForMock(
    criterios_evaluadosRaw,
    mockSeveridadBias,
  )
  const sum = summarizeEvaluations(criterios_evaluados)
  const base: AuditRecord = {
    id: "demo_audit_profile_cumple_count",
    url: "https://tramites.inapi.cl/",
    fecha_evaluacion: new Date().toISOString(),
    evaluador_uid: "demo@inapi.cl",
    version_checklist: "2.1",
    texto_capturado: "(texto de demostración)",
    criterios_evaluados,
    ...sum,
    texto_propuesto: undefined,
    observaciones_lc: undefined,
    tiempo_evaluacion_segundos: 1,
  }
  return strictAuditRecordSchema.parse({ ...base, ...overrides })
}