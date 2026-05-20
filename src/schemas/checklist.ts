import { z } from "zod"

/** IDs oficiales del Checklist Editorial INAPI v1.1 (39 criterios). */
export const CRITERION_IDS = [
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

export type CriterionId = (typeof CRITERION_IDS)[number]

export const criterionIdSchema = z.enum(CRITERION_IDS)

export const checklistCriterionSchema = z.object({
  id: criterionIdSchema,
  section_id: z.enum(["A", "B", "C", "D", "E", "F", "G", "H"]),
  section_title: z.string().min(1),
  criterion: z.string().min(1),
  verification: z.string().min(1),
  source: z.string().min(1),
})

export const checklistCriteriaFileSchema = z.object({
  checklist_version: z.string().min(1),
  title: z.string().min(1),
  criteria: z.array(checklistCriterionSchema).length(39),
})

export type ChecklistCriterion = z.infer<typeof checklistCriterionSchema>
export type ChecklistCriteriaFile = z.infer<typeof checklistCriteriaFileSchema>

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
 * - comentario omitido en severidad baja para no saturar la tabla
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
  const byId = new Map<CriterionId, CriterionEvaluation>(
    evaluations.map((e) => [e.id, e]),
  )
  let incumpleIndex = 0
  const baseBias = MOCK_BIAS_INDEX[bias]

  return CRITERION_IDS.map((id) => {
    const row = byId.get(id)
    if (!row) {
      throw new Error(`Falta evaluación para criterio ${id}`)
    }
    if (row.estado !== "incumple") {
      return row
    }
    const sev =
      MOCK_SEVERIDAD_ROTACION[
        (incumpleIndex + baseBias) % MOCK_SEVERIDAD_ROTACION.length
      ]
    incumpleIndex += 1

    const comentarioPorSeveridad: Record<Severity, string | undefined> = {
      baja: undefined,
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

export const criterionEvaluationSchema = z.object({
  id: criterionIdSchema,
  estado: criterionResultStateSchema,
  cita_textual: z.string().optional(),
  severidad: severitySchema.optional(),
  comentario: z.string().optional(),
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
  if (pct <= 90) return "aceptado_con_observaciones"
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
  const byId = new Map<CriterionId, CriterionEvaluation>()
  for (const e of evaluations) {
    byId.set(e.id, e)
  }
  let noAplica = 0
  let cumple = 0
  let incumple = 0
  for (const id of CRITERION_IDS) {
    const ev = byId.get(id)
    if (!ev) {
      throw new Error(`Falta evaluación para criterio ${id}`)
    }
    if (ev.estado === "no_aplica") noAplica++
    else if (ev.estado === "cumple") cumple++
    else incumple++
  }
  const aplicables = 39 - noAplica
  const porcentaje_cumplimiento =
    aplicables === 0 ? 0 : Math.round((cumple / aplicables) * 1000) / 10
  return {
    criterios_aprobados: cumple,
    criterios_incumplidos: incumple,
    criterios_no_aplica: noAplica,
    criterios_aplicables: aplicables,
    porcentaje_cumplimiento,
    estado_aceptacion: acceptanceStatusFromPercentage(porcentaje_cumplimiento),
  }
}

/** Resultado de auditoría (mock o persistido) — alineado al MVP conceptual. */
export const auditRecordSchema = z.object({
  id: z.string().min(1),
  url: z.string().url(),
  fecha_evaluacion: z.string().datetime(),
  evaluador_uid: z.string().email().or(z.string().min(1)),
  version_checklist: z.string().min(1),
  texto_capturado: z.string(),
  criterios_evaluados: z.array(criterionEvaluationSchema).length(39),
  criterios_aprobados: z.number().int().min(0).max(39),
  criterios_aplicables: z.number().int().min(0).max(39),
  criterios_no_aplica: z.number().int().min(0).max(39),
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

export function parseAuditRecord(data: unknown): AuditRecord {
  return auditRecordSchema.parse(data)
}

export function parseStrictAuditRecord(data: unknown): StrictAuditRecord {
  return strictAuditRecordSchema.parse(data)
}

/** Construye las 39 evaluaciones (por defecto `cumple`) para mocks y tests. */
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
    version_checklist: "1.1",
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
 * Auditoría demo con N criterios en "cumple" y el resto en "incumple" (sin N/A).
 * Útil para mocks por perfil LC coherentes con `summarizeEvaluations` y
 * `strictAuditRecordSchema`.
 */
export function buildDemoStrictAuditWithCumpleCount(
  cumpleCount: number,
  overrides?: Partial<AuditRecord>,
  mockSeveridadBias?: MockSeveridadBias,
): StrictAuditRecord {
  const n = Math.max(0, Math.min(39, Math.floor(cumpleCount)))
  const criterios_evaluadosRaw: CriterionEvaluation[] = CRITERION_IDS.map(
    (id, i) => ({
      id,
      estado: i < n ? "cumple" : "incumple",
    }),
  )
  const criterios_evaluados = enrichCriterionEvaluationsForMock(
    criterios_evaluadosRaw,
    mockSeveridadBias ?? "intermedio",
  )
  const sum = summarizeEvaluations(criterios_evaluados)
  const base: AuditRecord = {
    id: "demo_audit_profile_cumple_count",
    url: "https://tramites.inapi.cl/",
    fecha_evaluacion: new Date().toISOString(),
    evaluador_uid: "demo@inapi.cl",
    version_checklist: "1.1",
    texto_capturado: "(texto de demostración)",
    criterios_evaluados,
    ...sum,
    texto_propuesto: undefined,
    observaciones_lc: undefined,
    tiempo_evaluacion_segundos: 1,
  }
  return strictAuditRecordSchema.parse({ ...base, ...overrides })
}