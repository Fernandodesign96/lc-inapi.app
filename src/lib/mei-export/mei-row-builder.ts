import type { CriterionEvaluation, CriterionId } from "../../schemas/checklist"
import {
  CRITERION_IDS_V21,
  criterionIdsForChecklistVersion,
} from "../../schemas/checklist"

import {
  isMetadataCriterionEvaluation,
  isMetadataSustitucion,
} from "../audit-visible-content"
import type { ClaudeSustitucion } from "../../schemas/claude-audit-pilot"
import { loadChecklistEnunciados } from "./mei-checklist-catalog"
import {
  formatFechaDdMmYyyy,
  type LoadedClarityAudit,
} from "./mei-audit-loader"
import {
  categoriaPresentacionFromEvaluation,
  ordenCategoriaPresentacion,
  type MeiCategoriaPresentacion,
} from "./mei-criterio-categoria"
import { hitoById } from "./mei-hitos"

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
  /** Etiqueta Equipo UX (5 categorías) para secciones en Excel. */
  categoriaPresentacion: MeiCategoriaPresentacion | ""
  severidad: string
  tipoEntrega: "correccion_texto" | "config_cms" | "nuevo_contenido" | "evidencia"
  textoOriginal: string
  textoPropuesto: string
  motivo: string
  /** Ubicación legible en pantalla (jefe no TI). */
  ubicacionPantalla: string
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

const CMS_PROPUESTOS: Partial<Record<string, string>> = {
  E3: "Agregar fecha visible de última actualización en la página (pie o cabecera).",
  "LC-1.1.4-01":
    "Agregar fecha visible de última actualización en la página (bajo el título o pie de contenido).",
  G2: "Publicar sección visible sobre derechos ARCO (acceso, rectificación, eliminación, oposición, bloqueo).",
  "LC-1.1.7-03":
    "Publicar sección visible sobre derechos ARCO (acceso, rectificación, eliminación, oposición, bloqueo).",
  G3: "Publicar condiciones de uso / licencia de contenidos con enlace visible en el sitio.",
  "LC-1.1.6-01":
    "Publicar condiciones de uso / licencia de contenidos con enlace visible en el sitio.",
  E2: "Mostrar autoría institucional visible (INAPI) en la página.",
  "LC-1.1.1-01":
    "Mostrar autoría institucional visible (INAPI) en encabezado o pie de cada página.",
  H1: 'Rotular versiones anteriores como "archivo no vigente" con año o periodo.',
  "LC-1.3.3-01":
    'Rotular versiones anteriores como "archivo no vigente" con año o periodo.',
}

function actividadPrincipal(hitoId: string): number | null {
  const hito = hitoById(hitoId)
  return hito?.actividades[0] ?? null
}

function requiereValidacionTic(
  criterioId: CriterionId,
  rank: number | null,
): "si" | "no" {
  if (
    (criterioId === "G1" || criterioId === "LC-1.1.7-01") &&
    rank !== null &&
    SESSION_G1_RANKS.has(rank)
  ) {
    return "si"
  }
  if (criterioId === "B2" || criterioId === "LC-1.1.3-03") return "si"
  return "no"
}

function notasTicFor(criterioId: CriterionId, rank: number | null): string {
  if (
    (criterioId === "G1" || criterioId === "LC-1.1.7-01") &&
    rank !== null &&
    SESSION_G1_RANKS.has(rank)
  ) {
    return "Revisar con Equipo UX/TI: posible dato de sesión (§19), no PII de terceros."
  }
  return ""
}

function emptyDocumentaryRow(
  num: number,
  hitoId: string,
): MeiExcelRow {
  const hito = hitoById(hitoId)!
  return {
    num,
    actividadMei: actividadPrincipal(hitoId),
    hitoId,
    fechaInicioActividad: hito.fechaInicioActividad,
    fechaTerminoActividad: hito.fechaTerminoActividad,
    fechaHito: hito.fechaHito,
    rankClarity: null,
    url: "(evidencia repo)",
    nombreUi: "Checklist Editorial INAPI PTD-LC v3.0",
    tipoPagina: "—",
    criterioId: "N/A",
    criterioEnunciado:
      "51 criterios LC por indicadores IEW/IESD en data/checklist-criteria-lc-ptd.json",
    estadoAuditoria: "n/a",
    categoriaPresentacion: "",
    severidad: "",
    tipoEntrega: "evidencia",
    textoOriginal: "",
    textoPropuesto:
      "Checklist PTD-LC v3.0 (51) operativo + flujo auditoría Claude §17 + validate:claude-audits.",
    motivo: "Evidencia actividad 1 / hito H01 (ago-2026).",
    ubicacionPantalla: "",
    lineaRef: "",
    htmlLineaAprox: "",
    fragmentoBusqueda: "",
    requiereValidacionTic: "no",
    estado: "pendiente",
    notasTic: "",
    fechaAuditoria: "",
    auditor: "",
    auditId: "",
  }
}

/**
 * Entrega Excel (por URL): filas según `version_checklist` de la auditoría
 * (3.0 → 51 LC-*; 2.1 → 47 A–H; 1.1 → 39).
 */
function criterioIdsParaDetalleUrl(
  _hitoId: string,
  versionChecklist?: string,
): readonly CriterionId[] {
  if (versionChecklist) {
    return criterionIdsForChecklistVersion(versionChecklist)
  }
  return CRITERION_IDS_V21 as readonly CriterionId[]
}

function sustitucionPrimariaPorCriterio(
  sustituciones: readonly ClaudeSustitucion[],
): Map<CriterionId, ClaudeSustitucion> {
  const map = new Map<CriterionId, ClaudeSustitucion>()
  for (const s of sustituciones) {
    if (isMetadataSustitucion(s)) continue
    if (!map.has(s.criterio_id)) map.set(s.criterio_id, s)
    for (const rel of s.criterios_relacionados ?? []) {
      if (!map.has(rel)) map.set(rel, s)
    }
  }
  return map
}

function rowFromEvaluation(opts: {
  num: number
  hitoId: string
  audit: LoadedClarityAudit
  ev: CriterionEvaluation
  enunciados: Map<string, string>
  sust?: ClaudeSustitucion
}): MeiExcelRow {
  const { num, hitoId, audit, ev, enunciados, sust } = opts
  const hito = hitoById(hitoId)!
  const categoria = categoriaPresentacionFromEvaluation(ev)
  const base = {
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
    categoriaPresentacion: categoria,
    fechaAuditoria: formatFechaDdMmYyyy(audit.fechaEvaluacionIso),
    auditor: audit.bundle.audit.evaluador_uid,
    auditId: audit.auditId,
    estado: "pendiente" as const,
    fragmentoBusqueda: "",
  }

  if (ev.estado === "no_aplica") {
    return {
      ...base,
      estadoAuditoria: "no_aplica",
      severidad: "",
      tipoEntrega: "nuevo_contenido",
      textoOriginal: "—",
      textoPropuesto: "—",
      motivo:
        ev.comentario?.trim() ||
        "Sin justificación registrada (auditorías nuevas deben justificar no_aplica).",
      ubicacionPantalla: "",
      lineaRef: "",
      htmlLineaAprox: "",
      requiereValidacionTic: "no",
      notasTic: "",
    }
  }

  if (ev.estado === "cumple") {
    return {
      ...base,
      estadoAuditoria: "cumple",
      severidad: "",
      tipoEntrega: "nuevo_contenido",
      textoOriginal: ev.cita_textual?.trim() || "—",
      textoPropuesto: "—",
      motivo: ev.comentario?.trim() || "Cumple según evidencia visible en la página.",
      ubicacionPantalla: "",
      lineaRef: "",
      htmlLineaAprox: "",
      requiereValidacionTic: "no",
      notasTic: "",
    }
  }

  // incumple (incl. agrupado_en): enriquecer con sustitución si existe
  if (sust) {
    return {
      ...base,
      estadoAuditoria: "incumple",
      severidad: ev.severidad ?? "",
      tipoEntrega: "correccion_texto",
      textoOriginal: sust.original,
      textoPropuesto: sust.propuesto,
      motivo: [
        ev.agrupado_en ? `Agrupado en ${ev.agrupado_en} (mismo nodo).` : null,
        sust.patron_sistema
          ? "Patrón de sitio (corregir en Layout/header/footer/modal compartido)."
          : null,
        sust.criterios_relacionados?.length
          ? `Criterios: ${sust.criterio_id}, ${sust.criterios_relacionados.join(", ")}.`
          : null,
        sust.motivo,
        ev.comentario,
      ]
        .filter(Boolean)
        .join(" "),
      ubicacionPantalla: sust.ubicacion_pantalla ?? "",
      lineaRef: sust.linea,
      htmlLineaAprox: sust.html_linea_aprox ?? "",
      requiereValidacionTic: requiereValidacionTic(ev.id, audit.rank),
      notasTic: notasTicFor(ev.id, audit.rank),
    }
  }

  const propuesto =
    CMS_PROPUESTOS[ev.id] ?? `Corregir incumplimiento de ${ev.id}.`
  return {
    ...base,
    estadoAuditoria: "incumple",
    severidad: ev.severidad ?? "",
    tipoEntrega: CMS_PROPUESTOS[ev.id] ? "config_cms" : "nuevo_contenido",
    textoOriginal: ev.cita_textual ?? "(ausencia)",
    textoPropuesto: propuesto,
    motivo: [
      ev.agrupado_en ? `Agrupado en ${ev.agrupado_en} (mismo nodo).` : null,
      ev.comentario ?? `Incumple ${ev.id} sin fila en sustituciones[].`,
    ]
      .filter(Boolean)
      .join(" "),
    ubicacionPantalla: "",
    lineaRef: "",
    htmlLineaAprox: "",
    requiereValidacionTic: requiereValidacionTic(ev.id, audit.rank),
    notasTic: notasTicFor(ev.id, audit.rank),
  }
}

export function buildUrlSummariesForHito(
  hitoId: string,
  audits: LoadedClarityAudit[],
): MeiUrlResumen[] {
  return audits.map((audit) => {
    const version = audit.bundle.audit.version_checklist
    const criterios = new Set(criterioIdsParaDetalleUrl(hitoId, version))
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
  const rows: MeiExcelRow[] = []
  let num = 0

  if (!hito.incluyeAuditoriasUrl) {
    num++
    rows.push(emptyDocumentaryRow(num, hitoId))
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
        criterioEnunciado:
          "Apoyos visuales (LC-1.3.1-01 / indicador Visualización IEW 1.3.1)",
        estadoAuditoria: "n/a",
        categoriaPresentacion: "",
        severidad: "",
        tipoEntrega: "evidencia",
        textoOriginal: "(revisión pendiente)",
        textoPropuesto:
          "Incorporar íconos, gráficos o infografías para datos publicados en la URL.",
        motivo: "Actividad MEI 14 — ticket diseño/TI.",
        ubicacionPantalla: "En la página (revisión visual pendiente)",
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
    const idsAlcance = criterioIdsParaDetalleUrl(
      hitoId,
      audit.bundle.audit.version_checklist,
    )
    const orderIndex = new Map(idsAlcance.map((id, i) => [id, i]))
    const sustMap = sustitucionPrimariaPorCriterio(
      audit.bundle.pilot.sustituciones ?? [],
    )
    const byId = new Map(
      audit.bundle.audit.criterios_evaluados.map((e) => [e.id, e]),
    )

    const evals: CriterionEvaluation[] = []
    for (const id of idsAlcance) {
      const ev = byId.get(id)
      if (!ev) continue
      // Metadata solo-head: en entrega visible ya viene como no_aplica; no omitir la fila.
      if (
        ev.estado === "incumple" &&
        isMetadataCriterionEvaluation(
          ev,
          audit.bundle.pilot.sustituciones ?? [],
        )
      ) {
        evals.push({
          ...ev,
          estado: "no_aplica",
          severidad: undefined,
          comentario: ev.comentario
            ? `${ev.comentario} (evidencia solo metadata; no descuenta %)`
            : "Evidencia solo metadata HTML; no descuenta %.",
        })
        continue
      }
      evals.push(ev)
    }

    evals.sort((a, b) => {
      const ca = ordenCategoriaPresentacion(categoriaPresentacionFromEvaluation(a))
      const cb = ordenCategoriaPresentacion(categoriaPresentacionFromEvaluation(b))
      if (ca !== cb) return ca - cb
      return (orderIndex.get(a.id) ?? 0) - (orderIndex.get(b.id) ?? 0)
    })

    for (const ev of evals) {
      num++
      rows.push(
        rowFromEvaluation({
          num,
          hitoId,
          audit,
          ev,
          enunciados,
          sust: sustMap.get(ev.id),
        }),
      )
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
  "categoriaPresentacion",
  "severidad",
  "tipoEntrega",
  "textoOriginal",
  "textoPropuesto",
  "motivo",
  "ubicacionPantalla",
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
  categoriaPresentacion: "categoria_presentacion",
  severidad: "severidad",
  tipoEntrega: "tipo_entrega",
  textoOriginal: "texto_original",
  textoPropuesto: "texto_propuesto",
  motivo: "motivo",
  ubicacionPantalla: "ubicacion_pantalla",
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
