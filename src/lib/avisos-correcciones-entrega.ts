/**
 * Filas de entrega (Word / PDF / Excel) para la auditoría de avisos de sistemas.
 * Columnas fijas; las 5 primeras van angostas en Word/PDF.
 */
import type { CriterionEvaluation } from "../schemas/checklist"
import type { ClaudeSustitucion } from "../schemas/claude-audit-pilot"
import { isMetadataSustitucion } from "./audit-visible-content"
import {
  buildContenidoModificarFromParts,
  formatContenidoModificarCelda,
  htmlToVistaRuns,
  vistaRunsToMarkedText,
  type VistaRun,
} from "./avisos-propuesta-html"
import { ptdHitoTareaPorCriterio } from "./ptd-hito-tarea-por-criterio"

export const AVISOS_AUDIT_ID = "avisos-sistemas-tramites_2026-11-10"

/** Prefijo común a todas las fechas de la auditoría de avisos (vigente + history). */
const AVISOS_AUDIT_ID_PREFIX = "avisos-sistemas-tramites_"

export const AVISOS_CORRECCION_HEADERS = [
  "Número de solicitud",
  "ID's",
  "Fechas de inicio",
  "Estado",
  "ID Sistema",
  "Texto anuncio",
  "Contenido a modificar/agregar",
  "Observaciones",
] as const

export type AvisosCorreccionHeader = (typeof AVISOS_CORRECCION_HEADERS)[number]

export type AvisosCorreccionRow = {
  numero: number
  ids: string
  fechasInicio: string
  estado: string
  idSistema: string
  textoAnuncio: string
  /** HTML propuesto (copy-paste TI). */
  propuestoHtml: string
  /** Runs tipográficos de la vista en pantalla. */
  vistaRuns: VistaRun[]
  /** Celda completa: HTML + vista marcada (Excel / PDF texto). */
  contenidoModificar: string
  observaciones: string
  /** Valores por columna (mismo orden que AVISOS_CORRECCION_HEADERS). */
  cells: string[]
}

export function isAvisosSistemasAudit(auditId: string): boolean {
  return auditId.startsWith(AVISOS_AUDIT_ID_PREFIX)
}

export function sustitucionesSonAvisos(
  sustituciones: readonly ClaudeSustitucion[],
): boolean {
  return sustituciones.some((s) => s.aviso_correccion != null)
}

function sevLabel(
  estado: string | undefined,
  severidad: string | undefined,
): string {
  if (estado === "cumple") return "Cumple"
  if (estado !== "incumple") return estado ?? "—"
  return (
    (
      {
        alta: "No cumple",
        media: "Medianamente cumple",
        baja: "Cumple con observaciones",
      } as Record<string, string>
    )[severidad ?? "alta"] ?? "No cumple"
  )
}

function obsAvisos(
  sust: ClaudeSustitucion,
  byId: Map<string, CriterionEvaluation>,
): string {
  const ids = [sust.criterio_id, ...(sust.criterios_relacionados ?? [])]
  const heads = ids.map((id) => {
    const meta = ptdHitoTareaPorCriterio(id)
    const ev = byId.get(id)
    const label = sevLabel(ev?.estado, ev?.severidad)
    return `Checklist Hito ${meta.hitoOrdinal ?? "?"} - Criterio ${meta.criterioOrdinal ?? "?"} — ${label}`
  })
  const parts = [`${heads.join("; ")}.`, "", sust.motivo]
  if ((sust.criterios_relacionados?.length ?? 0) > 0) {
    parts.push(
      "",
      `Esta solicitud agrupa ${ids.length} criterios del mismo texto (propuesta final única).`,
    )
  }
  if (sust.patron_sistema) {
    parts.push(
      "",
      "Patrón de sitio (misma plantilla en varios IDs / sistemas; solo varían día/hora).",
    )
  }
  return parts.join("\n")
}

function joinUnique(values: readonly string[]): string {
  return values.join(", ")
}

function contenidoFromSust(sust: ClaudeSustitucion): {
  propuestoHtml: string
  vistaRuns: VistaRun[]
  contenidoModificar: string
} {
  if (sust.propuesto_html?.trim()) {
    const propuestoHtml = sust.propuesto_html.trim()
    const vistaRuns = htmlToVistaRuns(propuestoHtml)
    return {
      propuestoHtml,
      vistaRuns,
      contenidoModificar: formatContenidoModificarCelda(
        propuestoHtml,
        vistaRunsToMarkedText(vistaRuns),
      ),
    }
  }
  const built = buildContenidoModificarFromParts(sust.original, sust.propuesto)
  return {
    propuestoHtml: built.propuesto_html,
    vistaRuns: htmlToVistaRuns(built.propuesto_html),
    contenidoModificar: built.celda,
  }
}

/**
 * Una fila por sustitución con `aviso_correccion` (plantilla editorial con hallazgo).
 */
export function buildAvisosCorreccionRows(
  sustituciones: readonly ClaudeSustitucion[],
  evaluaciones: readonly CriterionEvaluation[],
): AvisosCorreccionRow[] {
  const byId = new Map(evaluaciones.map((e) => [e.id, e]))
  const visibles = sustituciones.filter(
    (s) => !isMetadataSustitucion(s) && s.aviso_correccion != null,
  )

  return visibles.map((sust, i) => {
    const meta = sust.aviso_correccion!
    const ids = joinUnique(meta.ids.map(String))
    const fechasInicio = joinUnique(meta.fechas_inicio)
    const estado = joinUnique(meta.estados)
    const idSistema = joinUnique(meta.ids_sistema)
    const textoAnuncio = sust.original
    const { propuestoHtml, vistaRuns, contenidoModificar } =
      contenidoFromSust(sust)
    const observaciones = obsAvisos(sust, byId)
    const cells = [
      String(i + 1),
      ids,
      fechasInicio,
      estado,
      idSistema,
      textoAnuncio,
      contenidoModificar,
      observaciones,
    ]
    return {
      numero: i + 1,
      ids,
      fechasInicio,
      estado,
      idSistema,
      textoAnuncio,
      propuestoHtml,
      vistaRuns,
      contenidoModificar,
      observaciones,
      cells,
    }
  })
}
