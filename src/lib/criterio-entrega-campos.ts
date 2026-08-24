/**
 * Campos de evidencia por criterio para UI, PDF y Excel MEI (misma lógica).
 */
import type { CriterionEvaluation } from "../schemas/checklist"
import type { ClaudeSustitucion } from "../schemas/claude-audit-pilot"
import { isMetadataSustitucion } from "./audit-visible-content"
import { normalizarLenguajeTipografiaCms } from "./lenguaje-tipografia-cms"
import {
  presentarTextoEnPantallaEntrega,
  resolverUbicacionEnPantalla,
} from "./ubicacion-pantalla-cms"

export {
  construirUbicacionDetallada,
  esUbicacionPantallaVaga,
  presentarTextoEnPantallaEntrega,
  resolverUbicacionEnPantalla,
  TEXTO_SIN_REQUISITO,
} from "./ubicacion-pantalla-cms"

const DASH = "—"

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

export type CriterioEntregaCampos = {
  textoEnPantalla: string
  correccionPropuesta: string
  ubicacionEnPantalla: string
  justificacion: string
  /** Para Excel: tipo de entrega cuando incumple sin sustitución. */
  tipoEntregaSinSust:
    | "correccion_texto"
    | "config_cms"
    | "nuevo_contenido"
  lineaRef: string
  htmlLineaAprox: string
  tieneSustitucion: boolean
}

const MOTIVO_CUMPLE_GENERICO = "Cumple según evidencia visible en la página."

/** Justificación que niega haber visto textos citados (no volcar esas citas a Texto en pantalla). */
function justificacionDeclaraAusenciaDeTextos(text: string): boolean {
  const lower = text.toLowerCase()
  // «No se observó lenguaje distante…» niega un defecto; las citas previas (p. ej. H1) son evidencia positiva.
  if (
    /no se observ(?:ó|aron|a|e)?\s+(?:lenguaje\s+distante|tono\s+(?:distante|impersonal)|trato\s+impersonal|voz\s+(?:distante|impersonal))/i.test(
      text,
    )
  ) {
    return false
  }
  return (
    /no se observ/.test(lower) ||
    /no se detect/.test(lower) ||
    /no se encontr/.test(lower) ||
    /no aparecen/.test(lower) ||
    /no se vio/.test(lower) ||
    /no se identific/.test(lower) ||
    /sin textos?/.test(lower) ||
    /no hay texto/.test(lower) ||
    /no se hall/.test(lower) ||
    /\(ausencia\)/.test(lower)
  )
}

/** Extrae fragmentos entre «…», "…" o '…' mencionados en comentarios/motivos. */
export function extraerCitasEntreComillas(text: string): string[] {
  const out: string[] = []
  const seen = new Set<string>()
  for (const m of text.matchAll(/«([^»]+)»|"([^"]{2,80})"|'([^']{2,80})'/g)) {
    const q = (m[1] ?? m[2] ?? m[3] ?? "").trim()
    if (!q || seen.has(q)) continue
    seen.add(q)
    out.push(q)
  }
  return out
}

/**
 * Texto literal que debe ir en «Texto en pantalla»:
 * 1) original de sustitución / cita_textual
 * 2) citas entre comillas en comentario/motivo (también en cumple / no_aplica)
 * 3) no volcar citas si la justificación dice que esos textos no se observaron
 */
export function resolverTextoEnPantalla(
  ev: CriterionEvaluation,
  sust?: ClaudeSustitucion,
): string {
  const fromSust = sust?.original?.trim() ?? ""
  if (fromSust) return fromSust

  const cita = ev.cita_textual?.trim() ?? ""
  if (cita && cita !== "(ausencia)") return cita

  const narracion = [ev.comentario, sust?.motivo].filter(Boolean).join(" ").trim()
  if (!narracion) {
    if (ev.estado === "incumple" && !sust) return cita || "(ausencia)"
    return DASH
  }

  if (justificacionDeclaraAusenciaDeTextos(narracion)) {
    return cita === "(ausencia)" ? "(ausencia)" : DASH
  }

  const quotes = extraerCitasEntreComillas(narracion)
  if (quotes.length > 0) return quotes.join(" · ")

  if (ev.estado === "incumple" && !sust) return cita || "(ausencia)"
  return DASH
}

function esMotivoCumpleDebil(comentario: string | undefined): boolean {
  const t = comentario?.trim() ?? ""
  if (!t) return true
  const lower = t.toLowerCase()
  return (
    lower === MOTIVO_CUMPLE_GENERICO.toLowerCase() ||
    lower === "cumple" ||
    lower === "ok" ||
    lower === "sí" ||
    lower === "si"
  )
}

/**
 * Justificación en Cumple: si no hay texto literal, debe quedar claro por qué
 * el criterio está validado (sin inventar citas).
 */
export function justificacionCumple(
  ev: CriterionEvaluation,
): string {
  const cita = ev.cita_textual?.trim() ?? ""
  const comentario = ev.comentario?.trim() ?? ""

  if (cita) {
    return comentario || MOTIVO_CUMPLE_GENERICO
  }

  if (comentario && !esMotivoCumpleDebil(comentario)) {
    return comentario
  }

  if (comentario) {
    return `Cumple: no hay texto literal en pantalla; ${comentario}`
  }

  return `Cumple: no hay texto literal en pantalla; el criterio se validó por revisión visual de la página (registrar en auditorías nuevas una justificación precisa o cita_textual / ubicacion_pantalla).`
}

function sustKey(s: ClaudeSustitucion): string {
  return [
    s.criterio_id,
    s.original,
    s.propuesto,
    s.ubicacion_pantalla ?? "",
    s.linea,
  ].join("\u0001")
}

function pushSustUnique(
  map: Map<string, ClaudeSustitucion[]>,
  criterioId: string,
  s: ClaudeSustitucion,
): void {
  const list = map.get(criterioId) ?? []
  const key = sustKey(s)
  if (list.some((x) => sustKey(x) === key)) {
    map.set(criterioId, list)
    return
  }
  list.push(s)
  map.set(criterioId, list)
}

/**
 * Todas las correcciones visibles por criterio (no solo la primera).
 * Incluye filas cuyo `criterio_id` es el id y también las que lo listan en
 * `criterios_relacionados` (p. ej. agrupados §20.3).
 *
 * Un mismo `LC-*` puede tener N textos distintos (títulos, cobertura, atajos…)
 * → N entradas. UI / PDF / Excel deben entregarlas todas.
 */
export function buildSustitucionesPorCriterio(
  sustituciones: readonly ClaudeSustitucion[],
): Map<string, ClaudeSustitucion[]> {
  const map = new Map<string, ClaudeSustitucion[]>()
  for (const s of sustituciones) {
    if (isMetadataSustitucion(s)) continue
    pushSustUnique(map, s.criterio_id, s)
    for (const rel of s.criterios_relacionados ?? []) {
      pushSustUnique(map, rel, s)
    }
  }
  return map
}

/**
 * @deprecated Preferir `buildSustitucionesPorCriterio` + todas las filas.
 * Conservada por compatibilidad: primera corrección por criterio.
 */
export function buildSustitucionPrimariaPorCriterio(
  sustituciones: readonly ClaudeSustitucion[],
): Map<string, ClaudeSustitucion> {
  const multi = buildSustitucionesPorCriterio(sustituciones)
  const map = new Map<string, ClaudeSustitucion>()
  for (const [id, list] of multi) {
    if (list[0]) map.set(id, list[0])
  }
  return map
}

/** Aplica convenciones tipográficas CMS a los campos narrativos de entrega. */
function conLenguajeTipografiaCms(
  campos: CriterioEntregaCampos,
): CriterioEntregaCampos {
  return {
    ...campos,
    textoEnPantalla: normalizarLenguajeTipografiaCms(
      presentarTextoEnPantallaEntrega(campos.textoEnPantalla),
    ),
    correccionPropuesta: normalizarLenguajeTipografiaCms(
      campos.correccionPropuesta,
    ),
    ubicacionEnPantalla: normalizarLenguajeTipografiaCms(
      campos.ubicacionEnPantalla,
    ),
    justificacion: normalizarLenguajeTipografiaCms(campos.justificacion),
  }
}

/**
 * Campos de evidencia alineados al detalle MEI (Texto / Corrección / Ubicación / Justificación).
 * Una llamada = una corrección. Si hay N sustituciones, llamar N veces (Excel/UI/PDF
 * emiten N filas con el mismo `criterio_id`).
 */
export function criterioEntregaCampos(
  ev: CriterionEvaluation,
  sust?: ClaudeSustitucion,
): CriterioEntregaCampos {
  const narracion = [ev.comentario, sust?.motivo].filter(Boolean).join(" ")
  const textoEnPantalla = resolverTextoEnPantalla(ev, sust)
  const ubicacionExplicita =
    sust?.ubicacion_pantalla?.trim() || ev.ubicacion_pantalla?.trim() || ""
  const ubicacionEnPantalla = resolverUbicacionEnPantalla(
    textoEnPantalla,
    ubicacionExplicita,
    narracion,
  )

  if (ev.estado === "no_aplica") {
    return conLenguajeTipografiaCms({
      textoEnPantalla,
      correccionPropuesta: DASH,
      ubicacionEnPantalla,
      justificacion:
        ev.comentario?.trim() ||
        "Sin justificación registrada (auditorías nuevas deben justificar no_aplica).",
      tipoEntregaSinSust: "nuevo_contenido",
      lineaRef: "",
      htmlLineaAprox: "",
      tieneSustitucion: false,
    })
  }

  if (ev.estado === "cumple") {
    return conLenguajeTipografiaCms({
      textoEnPantalla,
      correccionPropuesta: DASH,
      ubicacionEnPantalla,
      justificacion: justificacionCumple(ev),
      tipoEntregaSinSust: "nuevo_contenido",
      lineaRef: "",
      htmlLineaAprox: "",
      tieneSustitucion: false,
    })
  }

  // incumple
  if (sust) {
    return conLenguajeTipografiaCms({
      textoEnPantalla,
      correccionPropuesta: sust.propuesto,
      ubicacionEnPantalla,
      justificacion: [
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
      tipoEntregaSinSust: "correccion_texto",
      lineaRef: sust.linea,
      htmlLineaAprox: sust.html_linea_aprox ?? "",
      tieneSustitucion: true,
    })
  }

  const cms = CMS_PROPUESTOS[ev.id]
  const propuesto = cms ?? `Corregir incumplimiento de ${ev.id}.`
  return conLenguajeTipografiaCms({
    textoEnPantalla,
    correccionPropuesta: propuesto,
    ubicacionEnPantalla,
    justificacion: [
      ev.agrupado_en ? `Agrupado en ${ev.agrupado_en} (mismo nodo).` : null,
      ev.comentario ?? `Incumple ${ev.id} sin fila en sustituciones[].`,
    ]
      .filter(Boolean)
      .join(" "),
    tipoEntregaSinSust: cms ? "config_cms" : "nuevo_contenido",
    lineaRef: "",
    htmlLineaAprox: "",
    tieneSustitucion: false,
  })
}

/** Propuestas CMS conocidas (exportadas para Excel tipoEntrega). */
export function cmsPropuestaParaCriterio(criterioId: string): string | undefined {
  return CMS_PROPUESTOS[criterioId]
}
