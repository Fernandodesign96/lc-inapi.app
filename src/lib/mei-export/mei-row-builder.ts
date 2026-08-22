import type { CriterionEvaluation, CriterionId } from "../../schemas/checklist"
import {
  CRITERION_IDS_V30,
  criterionIdsForChecklistVersion,
} from "../../schemas/checklist"

import { isMetadataCriterionEvaluation } from "../audit-visible-content"
import {
  buildSustitucionesPorCriterio,
  criterioEntregaCampos,
} from "../criterio-entrega-campos"
import { ptdHitoTareaPorCriterio } from "../ptd-hito-tarea-por-criterio"
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
  /** Hito(s) OpenProject PTD (ids + título). */
  hitoPtd: string
  /** Tarea(s) OpenProject PTD (ids + descripción). */
  tareaPtd: string
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
    hitoPtd: "—",
    tareaPtd: "—",
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
 * (3.0 → 51 LC-*; 2.1 → 47 A–H solo en JSON histórico; sin versión → 51 LC-*).
 */
function criterioIdsParaDetalleUrl(
  _hitoId: string,
  versionChecklist?: string,
): readonly CriterionId[] {
  if (versionChecklist) {
    return criterionIdsForChecklistVersion(versionChecklist)
  }
  return CRITERION_IDS_V30 as readonly CriterionId[]
}

function sustitucionesPorCriterio(
  sustituciones: readonly ClaudeSustitucion[],
): Map<CriterionId, ClaudeSustitucion[]> {
  return buildSustitucionesPorCriterio(sustituciones) as Map<
    CriterionId,
    ClaudeSustitucion[]
  >
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
  const campos = criterioEntregaCampos(ev, sust)
  const ptd = ptdHitoTareaPorCriterio(ev.id)
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
    hitoPtd: ptd.hitoPtd,
    tareaPtd: ptd.tareaPtd,
  }

  if (ev.estado === "no_aplica") {
    return {
      ...base,
      estadoAuditoria: "no_aplica",
      severidad: "",
      tipoEntrega: "nuevo_contenido",
      textoOriginal: campos.textoEnPantalla,
      textoPropuesto: campos.correccionPropuesta,
      motivo: campos.justificacion,
      ubicacionPantalla:
        campos.ubicacionEnPantalla === "—" ? "" : campos.ubicacionEnPantalla,
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
      textoOriginal: campos.textoEnPantalla,
      textoPropuesto: campos.correccionPropuesta,
      motivo: campos.justificacion,
      ubicacionPantalla: campos.ubicacionEnPantalla,
      lineaRef: "",
      htmlLineaAprox: "",
      requiereValidacionTic: "no",
      notasTic: "",
    }
  }

  // incumple
  if (campos.tieneSustitucion) {
    return {
      ...base,
      estadoAuditoria: "incumple",
      severidad: ev.severidad ?? "",
      tipoEntrega: "correccion_texto",
      textoOriginal: campos.textoEnPantalla,
      textoPropuesto: campos.correccionPropuesta,
      motivo: campos.justificacion,
      ubicacionPantalla:
        campos.ubicacionEnPantalla === "—" ? "" : campos.ubicacionEnPantalla,
      lineaRef: campos.lineaRef,
      htmlLineaAprox: campos.htmlLineaAprox,
      requiereValidacionTic: requiereValidacionTic(ev.id, audit.rank),
      notasTic: notasTicFor(ev.id, audit.rank),
    }
  }

  return {
    ...base,
    estadoAuditoria: "incumple",
    severidad: ev.severidad ?? "",
    tipoEntrega: campos.tipoEntregaSinSust,
    textoOriginal: campos.textoEnPantalla,
    textoPropuesto: campos.correccionPropuesta,
    motivo: campos.justificacion,
    ubicacionPantalla:
      campos.ubicacionEnPantalla === "—" ? "" : campos.ubicacionEnPantalla,
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
        hitoPtd: ptdHitoTareaPorCriterio("LC-1.3.1-01").hitoPtd,
        tareaPtd: ptdHitoTareaPorCriterio("LC-1.3.1-01").tareaPtd,
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
    const sustMap = sustitucionesPorCriterio(
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
      const sustList =
        ev.estado === "incumple" ? (sustMap.get(ev.id) ?? []) : []
      if (sustList.length > 0) {
        for (const sust of sustList) {
          num++
          rows.push(
            rowFromEvaluation({
              num,
              hitoId,
              audit,
              ev,
              enunciados,
              sust,
            }),
          )
        }
        continue
      }
      num++
      rows.push(
        rowFromEvaluation({
          num,
          hitoId,
          audit,
          ev,
          enunciados,
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
  "hitoPtd",
  "tareaPtd",
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
  hitoPtd: "hito_ptd",
  tareaPtd: "tarea_ptd",
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
