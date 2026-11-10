import { z } from "zod"

import {
  criterionIdSchema,
  parseStrictAuditRecord,
  strictAuditRecordSchema,
  type StrictAuditRecord,
} from "./checklist"

/** Ancla para captura Playwright de evidencia visual anotada. */
export const evidenciaVisualPasoSchema = z.object({
  /** `hover` abre menús desplegables; `click` abre modales/acordeones. */
  action: z.enum(["click", "hover"]),
  ancla: z.string().min(1),
  ancla_tipo: z.enum(["css", "text", "role"]).optional(),
})

export const evidenciaVisualSchema = z.object({
  /** CSS / texto visible / nombre de rol — según `ancla_tipo`. */
  ancla: z.string().min(1),
  /** Default: `text`. */
  ancla_tipo: z.enum(["css", "text", "role"]).optional(),
  /** Clics previos (abrir menú/modal) antes de capturar. */
  pasos: z.array(evidenciaVisualPasoSchema).optional(),
  /** Ruta relativa al repo del PNG anotado (rectángulo + flecha). */
  imagen: z.string().min(1).optional(),
})

export type EvidenciaVisual = z.infer<typeof evidenciaVisualSchema>

/**
 * Metadatos de filas Excel «Avisos Sistemas» agrupadas por el mismo copy.
 * Una solicitud = un texto único; IDs/fechas/estados/sistemas van concatenados
 * sin repetir valores dentro de la misma casilla.
 */
export const avisoCorreccionSchema = z.object({
  ids: z.array(z.number().int()).min(1),
  fechas_inicio: z.array(z.string().min(1)).min(1),
  estados: z.array(z.string().min(1)).min(1),
  ids_sistema: z.array(z.string().min(1)).min(1),
})

export type AvisoCorreccion = z.infer<typeof avisoCorreccionSchema>

export const claudeSustitucionSchema = z.object({
  linea: z.string().min(1),
  html_linea_aprox: z.string().optional(),
  /**
   * Dónde lo ve el ciudadano en la pantalla (obligatorio en práctica para
   * sitioweb: «En el título…», «En el subtítulo de…», «En la sección…»).
   */
  ubicacion_pantalla: z.string().optional(),
  /** METADATA no se incluye en entrega UI/PDF/Excel. */
  capa: z.enum(["VISIBLE", "METADATA", "SISTEMA"]).optional(),
  /**
   * Texto original / anuncio. En avisos de sistemas: HTML completo del anuncio
   * (una muestra representativa del grupo de copy equivalente).
   */
  original: z.string().min(1),
  /**
   * Corrección propuesta. En avisos: texto plano legible (base de la vista).
   * El HTML listo para pegar va en `propuesto_html` cuando aplica.
   */
  propuesto: z.string().min(1),
  /**
   * HTML completo propuesto (avisos): mismo id/class/cáscara; TI copia y pega.
   * La celda de entrega muestra este HTML y debajo la vista tipográfica.
   */
  propuesto_html: z.string().min(1).optional(),
  /** Criterio primario que descuenta en el % (uno por hallazgo editorial). */
  criterio_id: criterionIdSchema,
  /**
   * Otros criterios del mismo texto/propuesta. No generan filas ni descuentos
   * adicionales; se muestran juntos en UI/PDF/Excel.
   */
  criterios_relacionados: z.array(criterionIdSchema).optional(),
  /**
   * Hallazgo de shell compartido (header, footer, modal global, `_Layout`).
   * Sigue descontando en la URL; la justificación debe indicar el origen.
   */
  patron_sistema: z.boolean().optional(),
  motivo: z.string().min(1),
  /**
   * Ancla + PNG para Word TI con evidencia visual (rectángulo rojo + flecha).
   * Opcional: no bloquea auditorías sin captura.
   */
  evidencia_visual: evidenciaVisualSchema.optional(),
  /** Solo auditoría de avisos de sistemas (columnas ID / fechas / estado / sistema). */
  aviso_correccion: avisoCorreccionSchema.optional(),
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
  /** Viñetas al final del Word, fuera de la tabla de solicitudes. */
  notas_entrega_word: z.array(z.string().min(1)).optional(),
})

export type ClaudeAuditPilotMeta = z.infer<typeof claudeAuditPilotMetaSchema>

/** Metadatos inventario Clarity (17 URLs) — obligatorio en `data/claude-audits/urls-clarity/*.json`. */
export const clarityAuditMetaSchema = z.object({
  serie: z.literal("clarity"),
  rank: z.number().int().min(1).max(17),
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
    notas_entrega_word: file.notas_entrega_word,
  }
  return { audit, pilot, clarity: file.clarity_meta }
}