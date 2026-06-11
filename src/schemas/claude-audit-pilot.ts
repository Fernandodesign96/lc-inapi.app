import { z } from "zod"

import {
  criterionIdSchema,
  parseStrictAuditRecord,
  strictAuditRecordSchema,
  type StrictAuditRecord,
} from "./checklist"

export const claudeSustitucionSchema = z.object({
  linea: z.string().min(1),
  html_linea_aprox: z.string().optional(),
  original: z.string().min(1),
  propuesto: z.string().min(1),
  criterio_id: criterionIdSchema,
  motivo: z.string().min(1),
})

export type ClaudeSustitucion = z.infer<typeof claudeSustitucionSchema>

export const observacionesLcPorSeveridadSchema = z.object({
  hallazgos_prioridad_alta: z.array(z.string()),
  hallazgos_prioridad_media: z.array(z.string()),
  hallazgos_prioridad_baja: z.array(z.string()),
})

export type ObservacionesLcPorSeveridad = z.infer<
  typeof observacionesLcPorSeveridadSchema
>

export const claudeAuditPilotMetaSchema = z.object({
  tipo_pagina: z.enum(["sitioweb", "tramites"]).optional(),
  resumen_ejecutivo: z.string().optional(),
  observaciones_lc_por_severidad: observacionesLcPorSeveridadSchema.optional(),
  sustituciones: z.array(claudeSustitucionSchema).optional(),
  nota_final_tic: z.string().optional(),
})

export type ClaudeAuditPilotMeta = z.infer<typeof claudeAuditPilotMetaSchema>

/** Metadatos inventario Clarity (22 URLs) — obligatorio en `data/claude-audits/urls-clarity/*.json`. */
export const clarityAuditMetaSchema = z.object({
  serie: z.literal("clarity"),
  rank: z.number().int().min(1).max(22),
  nombre_ui: z.string().min(1),
  ruta_etiqueta: z.string().min(1),
  visitas_ref: z.string().min(1),
  encargado_ref: z.string().min(1),
  fuente_piloto_id: z.string().optional(),
  descripcion: z.string().optional(),
})

export type ClarityAuditMeta = z.infer<typeof clarityAuditMetaSchema>

export const claudeAuditClarityExtensionsSchema = z.object({
  clarity_meta: clarityAuditMetaSchema.optional(),
})

/** Archivo en data/claude-audits/*.json (canónico con extensiones piloto y/o Clarity). */
export const claudeAuditFileSchema = strictAuditRecordSchema
  .and(claudeAuditPilotMetaSchema)
  .and(claudeAuditClarityExtensionsSchema)

export type ClaudeAuditFile = z.infer<typeof claudeAuditFileSchema>

export type ClaudeAuditBundle = {
  audit: StrictAuditRecord
  pilot: ClaudeAuditPilotMeta
  clarity?: ClarityAuditMeta
}

export function parseClaudeAuditFile(data: unknown): ClaudeAuditBundle {
  const file = claudeAuditFileSchema.parse(data)
  const audit = parseStrictAuditRecord(file)
  const pilot: ClaudeAuditPilotMeta = {
    tipo_pagina: file.tipo_pagina,
    resumen_ejecutivo: file.resumen_ejecutivo,
    observaciones_lc_por_severidad: file.observaciones_lc_por_severidad,
    sustituciones: file.sustituciones,
    nota_final_tic: file.nota_final_tic,
  }
  return { audit, pilot, clarity: file.clarity_meta }
}