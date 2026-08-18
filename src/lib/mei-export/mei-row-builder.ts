import type { CriterionId } from "../../schemas/checklist"

import { loadChecklistEnunciados } from "./mei-checklist-catalog"
import {
  formatFechaDdMmYyyy,
  type LoadedClarityAudit,
} from "./mei-audit-loader"
import { criterioIdsForHito, hitoById } from "./mei-hitos"

export type MeiUrlResumen = {
  rankClarity: number
  url: string
  nombreUi: string
  tipoPagina: string
  porcentajeLc: number
  fechaAuditoria: string
  auditId: string
  criteriosHitoIncumple: number
  criteriosHitoCumple: number
  criteriosHitoNoAplica: number
}

export type MeiExcelRow = {
  num: number
  actividadMei: number | null
  hitoId: string
  fechaInicioActividad: string
  fechaTerminoActividad: string
  fechaHito: string
  rankClarity: number | null
  url: string
  nombreUi: string
  tipoPagina: string
  criterioId: string
  criterioEnunciado: string
  estadoAuditoria: "cumple" | "incumple" | "no_aplica" | "n/a"
  severidad: string
  tipoEntrega: "correccion_texto" | "config_cms" | "nuevo_contenido" | "evidencia"
  textoOriginal: string
  textoPropuesto: string
  motivo: string
  lineaRef: string
  htmlLineaAprox: string
  fragmentoBusqueda: string
  requiereValidacionTic: "si" | "no"
  estado: string
  notasTic: string
  fechaAuditoria: string
  auditor: string
  auditId: string
}

const SESSION_G1_RANKS = new Set([4, 7, 14])

const CMS_PROPUESTOS: Partial<Record<CriterionId, string>> = {
  E3: "Agregar fecha visible de última actualización en la página (pie o cabecera).",
  G2: "Publicar sección visible sobre derechos ARCO (acceso, rectificación, eliminación, oposición, bloqueo).",
  G3: "Publicar condiciones de uso / licencia de contenidos con enlace visible en el sitio.",
  E2: "Mostrar autoría institucional visible (INAPI) en la página.",
  H1: 'Rotular versiones anteriores como "archivo no vigente" con año o periodo.',
}

function actividadPrincipal(hitoId: string): number | null {
  const hito = hitoById(hitoId)
  return hito?.actividades[0] ?? null
}

function requiereValidacionTic(
  criterioId: CriterionId,
  rank: number | null,
): "si" | "no" {
  if (criterioId === "G1" && rank !== null && SESSION_G1_RANKS.has(rank)) {
    return "si"
  }
  if (criterioId === "B2") return "si"
  return "no"
}

function notasTicFor(
  criterioId: CriterionId,
  rank: number | null,
): string {
  if (criterioId === "G1" && rank !== null && SESSION_G1_RANKS.has(rank)) {
    return "Revisar con Bernarda/TI: posible dato de sesión (§19), no PII de terceros."
  }
  return ""
}

export function buildUrlSummariesForHito(
  hitoId: string,
  audits: LoadedClarityAudit[],
): MeiUrlResumen[] {
  const criterios = new Set(criterioIdsForHito(hitoId))
  return audits.map((audit) => {
    const evals = audit.bundle.audit.criterios_evaluados.filter((e) =>
      criterios.has(e.id),
    )
    return {
      rankClarity: audit.rank,
      url: audit.url,
      nombreUi: audit.nombreUi,
      tipoPagina: audit.tipoPagina,
      porcentajeLc: audit.porcentajeLc,
      fechaAuditoria: formatFechaDdMmYyyy(audit.fechaEvaluacionIso),
      auditId: audit.auditId,
      criteriosHitoIncumple: evals.filter((e) => e.estado === "incumple").length,
      criteriosHitoCumple: evals.filter((e) => e.estado === "cumple").length,
      criteriosHitoNoAplica: evals.filter((e) => e.estado === "no_aplica").length,
    }
  })
}

export function buildRowsForHito(
  hitoId: string,
  audits: LoadedClarityAudit[],
  root = process.cwd(),
): MeiExcelRow[] {
  const hito = hitoById(hitoId)
  if (!hito) return []

  const enunciados = loadChecklistEnunciados(root)
  const criteriosSet = new Set(criterioIdsForHito(hitoId))
  const rows: MeiExcelRow[] = []
  let num = 0

  if (!hito.incluyeAuditoriasUrl) {
    num++
    rows.push({
      num,
      actividadMei: actividadPrincipal(hitoId),
      hitoId,
      fechaInicioActividad: hito.fechaInicioActividad,
      fechaTerminoActividad: hito.fechaTerminoActividad,
      fechaHito: hito.fechaHito,
      rankClarity: null,
      url: "(evidencia repo)",
      nombreUi: "Checklist Editorial INAPI v2.1",
      tipoPagina: "—",
      criterioId: "N/A",
      criterioEnunciado: "47 criterios A1–H1 en data/checklist-criteria.json",
      estadoAuditoria: "n/a",
      severidad: "",
      tipoEntrega: "evidencia",
      textoOriginal: "",
      textoPropuesto:
        "Checklist v2.1 operativo en repo + flujo auditoría Claude §17 + validate:claude-audits.",
      motivo: "Evidencia actividad 1 / hito H01 (ago-2026).",
      lineaRef: "",
      htmlLineaAprox: "",
      fragmentoBusqueda: "",
      requiereValidacionTic: "no",
      estado: "pendiente",
      notasTic: "",
      fechaAuditoria: "",
      auditor: "",
      auditId: "",
    })
    return rows
  }

  if (hitoId === "H11") {
    for (const audit of audits) {
      num++
      rows.push({
        num,
        actividadMei: actividadPrincipal(hitoId),
        hitoId,
        fechaInicioActividad: hito.fechaInicioActividad,
        fechaTerminoActividad: hito.fechaTerminoActividad,
        fechaHito: hito.fechaHito,
        rankClarity: audit.rank,
        url: audit.url,
        nombreUi: audit.nombreUi,
        tipoPagina: audit.tipoPagina,
        criterioId: "N/A",
        criterioEnunciado: "Apoyos visuales (sin criterio directo en checklist A1–H1)",
        estadoAuditoria: "n/a",
        severidad: "",
        tipoEntrega: "evidencia",
        textoOriginal: "(revisión pendiente)",
        textoPropuesto:
          "Incorporar íconos, gráficos o infografías para datos publicados en la URL.",
        motivo: "Actividad MEI 14 — ticket diseño/TI.",
        lineaRef: "",
        htmlLineaAprox: "",
        fragmentoBusqueda: "",
        requiereValidacionTic: "si",
        estado: "pendiente",
        notasTic: "Sin criterio checklist; seguimiento con equipo UX/TIC.",
        fechaAuditoria: formatFechaDdMmYyyy(audit.fechaEvaluacionIso),
        auditor: audit.bundle.audit.evaluador_uid,
        auditId: audit.auditId,
      })
    }
    return rows
  }

  for (const audit of audits) {
    const sustituciones = audit.bundle.pilot.sustituciones ?? []
    const covered = new Set<CriterionId>()

    for (const sust of sustituciones) {
      if (!criteriosSet.has(sust.criterio_id)) continue
      covered.add(sust.criterio_id)
      num++
      rows.push({
        num,
        actividadMei: actividadPrincipal(hitoId),
        hitoId,
        fechaInicioActividad: hito.fechaInicioActividad,
        fechaTerminoActividad: hito.fechaTerminoActividad,
        fechaHito: hito.fechaHito,
        rankClarity: audit.rank,
        url: audit.url,
        nombreUi: audit.nombreUi,
        tipoPagina: audit.tipoPagina,
        criterioId: sust.criterio_id,
        criterioEnunciado: enunciados.get(sust.criterio_id) ?? "",
        estadoAuditoria: "incumple",
        severidad: "",
        tipoEntrega: "correccion_texto",
        textoOriginal: sust.original,
        textoPropuesto: sust.propuesto,
        motivo: sust.motivo,
        lineaRef: sust.linea,
        htmlLineaAprox: sust.html_linea_aprox ?? "",
        fragmentoBusqueda: "",
        requiereValidacionTic: requiereValidacionTic(sust.criterio_id, audit.rank),
        estado: "pendiente",
        notasTic: notasTicFor(sust.criterio_id, audit.rank),
        fechaAuditoria: formatFechaDdMmYyyy(audit.fechaEvaluacionIso),
        auditor: audit.bundle.audit.evaluador_uid,
        auditId: audit.auditId,
      })
    }

    for (const ev of audit.bundle.audit.criterios_evaluados) {
      if (!criteriosSet.has(ev.id) || ev.estado !== "incumple") continue
      if (covered.has(ev.id)) continue

      const propuesto = CMS_PROPUESTOS[ev.id] ?? `Corregir incumplimiento de ${ev.id}.`
      num++
      rows.push({
        num,
        actividadMei: actividadPrincipal(hitoId),
        hitoId,
        fechaInicioActividad: hito.fechaInicioActividad,
        fechaTerminoActividad: hito.fechaTerminoActividad,
        fechaHito: hito.fechaHito,
        rankClarity: audit.rank,
        url: audit.url,
        nombreUi: audit.nombreUi,
        tipoPagina: audit.tipoPagina,
        criterioId: ev.id,
        criterioEnunciado: enunciados.get(ev.id) ?? "",
        estadoAuditoria: "incumple",
        severidad: ev.severidad ?? "",
        tipoEntrega: CMS_PROPUESTOS[ev.id] ? "config_cms" : "nuevo_contenido",
        textoOriginal: ev.cita_textual ?? "(ausencia)",
        textoPropuesto: propuesto,
        motivo: ev.comentario ?? `Incumple ${ev.id} sin fila en sustituciones[].`,
        lineaRef: "",
        htmlLineaAprox: "",
        fragmentoBusqueda: "",
        requiereValidacionTic: requiereValidacionTic(ev.id, audit.rank),
        estado: "pendiente",
        notasTic: notasTicFor(ev.id, audit.rank),
        fechaAuditoria: formatFechaDdMmYyyy(audit.fechaEvaluacionIso),
        auditor: audit.bundle.audit.evaluador_uid,
        auditId: audit.auditId,
      })
    }
  }

  return rows
}

export const MEI_EXCEL_COLUMNS: Array<keyof MeiExcelRow> = [
  "num",
  "actividadMei",
  "hitoId",
  "fechaInicioActividad",
  "fechaTerminoActividad",
  "fechaHito",
  "rankClarity",
  "url",
  "nombreUi",
  "tipoPagina",
  "criterioId",
  "criterioEnunciado",
  "estadoAuditoria",
  "severidad",
  "tipoEntrega",
  "textoOriginal",
  "textoPropuesto",
  "motivo",
  "lineaRef",
  "htmlLineaAprox",
  "fragmentoBusqueda",
  "requiereValidacionTic",
  "estado",
  "notasTic",
  "fechaAuditoria",
  "auditor",
  "auditId",
]

export const MEI_EXCEL_HEADER_LABELS: Record<keyof MeiExcelRow, string> = {
  num: "num",
  actividadMei: "actividad_mei",
  hitoId: "hito_id",
  fechaInicioActividad: "fecha_inicio_actividad",
  fechaTerminoActividad: "fecha_termino_actividad",
  fechaHito: "fecha_hito",
  rankClarity: "rank_clarity",
  url: "url",
  nombreUi: "nombre_ui",
  tipoPagina: "tipo_pagina",
  criterioId: "criterio_id",
  criterioEnunciado: "criterio_enunciado",
  estadoAuditoria: "estado_auditoria",
  severidad: "severidad",
  tipoEntrega: "tipo_entrega",
  textoOriginal: "texto_original",
  textoPropuesto: "texto_propuesto",
  motivo: "motivo",
  lineaRef: "linea_ref",
  htmlLineaAprox: "html_linea_aprox",
  fragmentoBusqueda: "fragmento_busqueda",
  requiereValidacionTic: "requiere_validacion_tic",
  estado: "estado",
  notasTic: "notas_tic",
  fechaAuditoria: "fecha_auditoria",
  auditor: "auditor",
  auditId: "audit_id",
}
