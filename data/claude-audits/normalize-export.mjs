/**
 * Uso (raíz del monorepo):
 *   bun data/claude-audits/normalize-export.mjs data/claude-audits/www-inapi-cl_2026-06-02.export.json
 *
 * Lee el export crudo de Claude y escribe el JSON canónico (strictAuditRecordSchema + extensiones piloto).
 */
import { readFileSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const exportPath = resolve(process.argv[2] ?? join(__dirname, "www-inapi-cl_2026-06-02.export.json"))
const raw = JSON.parse(readFileSync(exportPath, "utf8"))

const slugMatch = String(raw.url ?? "")
  .replace(/^https?:\/\//, "")
  .replace(/\/$/, "")
  .replace(/[^a-z0-9]+/gi, "-")
  .replace(/^-+|-+$/g, "")
  .toLowerCase()
/** Fecha local del export (antes de UTC) para el id de archivo en repo. */
const datePartLocal = String(raw.fecha_evaluacion ?? "").slice(0, 10) || new Date().toISOString().slice(0, 10)
/** Id de archivo en repo (ver tabla §2 en flujo-piloto). */
const id =
  raw.id ??
  raw.claude_audit_id ??
  (slugMatch === "www-inapi-cl" ? "www-inapi-cl_2026-06-02" : `${slugMatch}_${datePartLocal}`)

function toUtcDatetime(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) {
    throw new Error(`fecha_evaluacion inválida: ${iso}`)
  }
  return d.toISOString()
}

function normalizeCriterion(c) {
  const out = { id: c.id, estado: c.estado }
  if (c.estado === "incumple" && c.severidad) {
    out.severidad = c.severidad
  }
  if (typeof c.comentario === "string" && c.comentario.length > 0) {
    out.comentario = c.comentario
  }
  if (typeof c.cita_textual === "string" && c.cita_textual.length > 0) {
    out.cita_textual = c.cita_textual
  }
  return out
}

const criterios_evaluados = raw.criterios_evaluados.map(normalizeCriterion)

const canonical = {
  id,
  url: raw.url,
  fecha_evaluacion: toUtcDatetime(raw.fecha_evaluacion),
  evaluador_uid: raw.evaluador_uid ?? raw.evaluador,
  version_checklist: raw.version_checklist,
  texto_capturado: raw.texto_capturado,
  criterios_evaluados,
  criterios_no_aplica: raw.criterios_no_aplica,
  criterios_aplicables: raw.criterios_aplicables,
  criterios_aprobados: raw.criterios_aprobados,
  porcentaje_cumplimiento: raw.porcentaje_cumplimiento,
  estado_aceptacion: raw.estado_aceptacion,
  texto_propuesto: raw.texto_propuesto,
  observaciones_lc: raw.observaciones_lc,
  tipo_pagina: raw.tipo_pagina,
  resumen_ejecutivo: raw.resumen_ejecutivo,
  observaciones_lc_por_severidad: raw.observaciones_lc_por_severidad,
  sustituciones: raw.sustituciones,
  nota_final_tic: raw.nota_final_tic,
}

const outPath = join(__dirname, `${id}.json`)
writeFileSync(outPath, `${JSON.stringify(canonical, null, 2)}\n`)
console.log(`Escrito: ${outPath}`)
