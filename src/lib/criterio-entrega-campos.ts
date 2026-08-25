/**
 * Campos de evidencia por criterio para UI, PDF y Excel MEI (misma lógica).
 */
import lcCatalog from "../../data/checklist-criteria-lc-ptd.json"
import type { CriterionEvaluation } from "../schemas/checklist"
import type { ClaudeSustitucion } from "../schemas/claude-audit-pilot"
import { isMetadataSustitucion } from "./audit-visible-content"
import { normalizarLenguajeTipografiaCms } from "./lenguaje-tipografia-cms"
import { ptdHitoTareaPorCriterio } from "./ptd-hito-tarea-por-criterio"
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

const PROPUESTA_FALLBACK_LEGIBLE =
  "Reescribir el texto citado en oraciones cortas y palabras cotidianas; comprobar la legibilidad con una herramienta de lectura fácil (por ejemplo Legible) hasta alcanzar al menos tres de cinco indicadores en dificultad Normal."

const PROPUESTA_FALLBACK_GENERICA =
  "Reescribir el texto citado en pantalla con lenguaje cotidiano, oraciones cortas y una idea clara por frase, de modo que una persona lo entienda a la primera."

/** Preguntas del catálogo PTD (nunca deben ir a «Texto en pantalla»). */
const PREGUNTAS_CRITERIO: ReadonlySet<string> = (() => {
  const set = new Set<string>()
  const rows = (lcCatalog as { criteria?: Array<{ criterion?: string }> })
    .criteria
  for (const c of rows ?? []) {
    const q = normalizarPreguntaCriterio(c.criterion ?? "")
    if (q) set.add(q)
  }
  return set
})()

function normalizarPreguntaCriterio(s: string): string {
  return s.replace(/\s+/g, " ").trim()
}

/** True si el fragmento es (o empieza siendo) la pregunta de un criterio del catálogo. */
export function esPreguntaDeCriterio(fragmento: string): boolean {
  const t = normalizarPreguntaCriterio(fragmento)
  if (!t) return false
  if (PREGUNTAS_CRITERIO.has(t)) return true
  // Cita truncada o con sufijo («¿…?» · Para Informarse)
  for (const q of PREGUNTAS_CRITERIO) {
    if (t === q || t.startsWith(`${q} `) || t.startsWith(`${q}·`)) return true
  }
  return false
}

/**
 * Quita el encabezado de fila «Criterio N: «pregunta» — Instrumento M: Nombre.»
 * que a veces se copia dentro de comentario/motivo (no pertenece a los 4 campos CMS).
 */
export function stripEncabezadoCriterioInstrumento(text: string): string {
  if (!text.trim()) return text
  // Hasta «— Instrumento M: ….» (soporta comillas anidadas en la pregunta)
  const encabezado =
    /^Criterio\s+\d+\s*:\s*.+?\s*[—–-]\s*Instrumento\s+\d+\s*:\s*[^.]+.\s*/i
  let t = text.trim()
  while (encabezado.test(t)) {
    t = t.replace(encabezado, "").trim()
  }
  return t.replace(/\s{2,}/g, " ").trim()
}

function etiquetaCriterioSimple(criterioId: string): string {
  const n = ptdHitoTareaPorCriterio(criterioId).criterioOrdinal
  return n != null ? `criterio ${n}` : "este criterio"
}

/**
 * Quita códigos LC-* / IEW-IESD / Tnnn y jerga de orquestación de textos de entrega
 * y los sustituye por lenguaje ciudadano («criterio N», sin instrucciones al auditor).
 * También elimina encabezados Criterio N / Instrumento M colados en el cuerpo.
 */
export function limpiarNomenclaturaEntrega(text: string): string {
  if (!text.trim()) return text
  let t = stripEncabezadoCriterioInstrumento(text)
  t = t.replace(/\bLC-\d+\.\d+\.\d+-\d+\b/g, (id) =>
    etiquetaCriterioSimple(id),
  )
  // Inventario interno T001… — nunca en entrega CMS
  t = t.replace(/\bT\d{3}\b/g, "")
  // Campo técnico del catálogo
  t = t.replace(/\bapplicability\b/gi, "")
  t = t.replace(/\btipo_pagina\b/gi, "tipo de página")
  // Acrónimos de instrumentos: siempre nombre completo + sigla
  t = t.replace(
    /\bInstrumento de Evaluaci[oó]n de Sitios Web\s*\(IEW\)/gi,
    "§§IEW§§",
  )
  t = t.replace(
    /\bInstrumento de Evaluaci[oó]n de Servicios Digitales\s*\(IESD\)/gi,
    "§§IESD§§",
  )
  t = t.replace(
    /\bIEW\b/g,
    "Instrumento de Evaluación de Sitios Web (IEW)",
  )
  t = t.replace(
    /\bIESD\b/g,
    "Instrumento de Evaluación de Servicios Digitales (IESD)",
  )
  t = t.replace(
    /§§IEW§§/g,
    "Instrumento de Evaluación de Sitios Web (IEW)",
  )
  t = t.replace(
    /§§IESD§§/g,
    "Instrumento de Evaluación de Servicios Digitales (IESD)",
  )
  t = t.replace(/\bMETA\s*MEI\b/gi, "muestra de evaluación institucional")
  // Instrucciones al auditor pegadas por error en ubicación/justificación
  t = t.replace(
    /\s*\(indicar\s+Cabecera,\s*Cuerpo,\s*Pie[^)]*\)/gi,
    "",
  )
  t = t.replace(
    /\s*\(describir bloque o enlace con su r[oó]tulo en auditor[ií]as nuevas\)/gi,
    "",
  )
  t = t.replace(
    /Pantalla evaluada\s*[›>]\s*precisar en auditor[ií]as nuevas[^«"]*/gi,
    "Pantalla evaluada › zona del contenido revisado",
  )
  // Códigos de indicador sueltos (1.1.3 / 5.1.3) fuera de contexto de instrumento
  t = t.replace(/\b\d+\.\d+\.\d+(?:\s*\/\s*\d+\.\d+\.\d+)?\b/g, "")
  t = t.replace(/\s{2,}/g, " ").replace(/\s+([.,;:)])/g, "$1").trim()
  return t
}

function propuestaEsSoloNomenclatura(propuesto: string): boolean {
  const t = propuesto.trim()
  if (!t || t === DASH) return false
  return (
    /corregir\s+incumplimiento/i.test(t) ||
    /^LC-\d/i.test(t) ||
    /^corregir\s+incumplimiento\s+de\s+(?:el\s+)?criterio\s+\d+/i.test(t) ||
    /^incumple\s+LC-/i.test(t)
  )
}

function corregirPropuestaEntrega(
  propuesto: string,
  criterioId: string,
): string {
  const limpio = limpiarNomenclaturaEntrega(propuesto)
  if (!propuestaEsSoloNomenclatura(propuesto) && !propuestaEsSoloNomenclatura(limpio)) {
    return limpio
  }
  if (
    criterioId === "LC-1.1.3-01" ||
    /legible|comprensi[oó]n\s+lectora/i.test(propuesto)
  ) {
    return PROPUESTA_FALLBACK_LEGIBLE
  }
  return PROPUESTA_FALLBACK_GENERICA
}

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
    // Nunca tratar la pregunta del instrumento como literal en pantalla
    if (esPreguntaDeCriterio(q)) continue
    seen.add(q)
    out.push(q)
  }
  return out
}

/**
 * Texto literal que debe ir en «Texto en pantalla»:
 * 1) original de sustitución / cita_textual (si no es la pregunta del criterio)
 * 2) citas entre comillas en comentario/motivo (también en cumple / no_aplica)
 * 3) no volcar citas si la justificación dice que esos textos no se observaron
 */
export function resolverTextoEnPantalla(
  ev: CriterionEvaluation,
  sust?: ClaudeSustitucion,
): string {
  const fromSust = sust?.original?.trim() ?? ""
  if (fromSust && !esPreguntaDeCriterio(fromSust)) return fromSust

  const citaRaw = ev.cita_textual?.trim() ?? ""
  const cita =
    citaRaw && citaRaw !== "(ausencia)" && !esPreguntaDeCriterio(citaRaw)
      ? citaRaw
      : ""
  if (cita) return cita

  const narracion = stripEncabezadoCriterioInstrumento(
    [ev.comentario, sust?.motivo].filter(Boolean).join(" ").trim(),
  )
  if (!narracion) {
    if (ev.estado === "incumple" && !sust) {
      return citaRaw === "(ausencia)" ? "(ausencia)" : DASH
    }
    return DASH
  }

  if (justificacionDeclaraAusenciaDeTextos(narracion)) {
    return citaRaw === "(ausencia)" ? "(ausencia)" : DASH
  }

  const quotes = extraerCitasEntreComillas(narracion)
  if (quotes.length > 0) return quotes.join(" · ")

  if (ev.estado === "incumple" && !sust) {
    return citaRaw === "(ausencia)" ? "(ausencia)" : DASH
  }
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
  const citaRaw = ev.cita_textual?.trim() ?? ""
  const cita =
    citaRaw && citaRaw !== "(ausencia)" && !esPreguntaDeCriterio(citaRaw)
      ? citaRaw
      : ""
  const comentario = stripEncabezadoCriterioInstrumento(
    ev.comentario?.trim() ?? "",
  )

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

/** Aplica convenciones tipográficas CMS y limpia nomenclatura de orquestación. */
function conLenguajeTipografiaCms(
  campos: CriterioEntregaCampos,
): CriterioEntregaCampos {
  return {
    ...campos,
    textoEnPantalla: normalizarLenguajeTipografiaCms(
      limpiarNomenclaturaEntrega(
        presentarTextoEnPantallaEntrega(campos.textoEnPantalla),
      ),
    ),
    correccionPropuesta: normalizarLenguajeTipografiaCms(
      limpiarNomenclaturaEntrega(campos.correccionPropuesta),
    ),
    ubicacionEnPantalla: normalizarLenguajeTipografiaCms(
      limpiarNomenclaturaEntrega(campos.ubicacionEnPantalla),
    ),
    justificacion: normalizarLenguajeTipografiaCms(
      limpiarNomenclaturaEntrega(campos.justificacion),
    ),
  }
}

/**
 * Campos de evidencia alineados al detalle MEI (Texto / Corrección / Ubicación / Justificación).
 * Una llamada = una corrección. Si hay N sustituciones, llamar N veces (Excel/UI/PDF
 * emiten N filas con el mismo `criterio_id`).
 */
function narracionLimpia(
  ev: CriterionEvaluation,
  sust?: ClaudeSustitucion,
): string {
  return stripEncabezadoCriterioInstrumento(
    [ev.comentario, sust?.motivo].filter(Boolean).join(" "),
  )
}

function comentarioLimpio(ev: CriterionEvaluation): string {
  return stripEncabezadoCriterioInstrumento(ev.comentario?.trim() ?? "")
}

function motivoLimpio(sust?: ClaudeSustitucion): string {
  return stripEncabezadoCriterioInstrumento(sust?.motivo?.trim() ?? "")
}

/** Quita pregunta-de-criterio embebida en rutas de ubicación derivadas. */
function limpiarUbicacionEntrega(ubicacion: string, textoEnPantalla: string): string {
  let u = ubicacion.trim()
  if (!u || u === DASH) return u
  // Si la ruta cita la pregunta del criterio como si fuera rótulo en pantalla → invalidar
  const lit = textoEnPantalla.split(/\s*[·|]\s*/)[0]?.trim() ?? ""
  if (esPreguntaDeCriterio(lit) || /texto\s+«¿[^»]+\?»/i.test(u)) {
    // Quitar el tramo «texto «¿…?»»; si queda vacío o vago, DASH
    u = u
      .replace(/\s*[›>]\s*texto\s+[«"']¿[^»"']+\?[»"']/gi, "")
      .replace(/[«"']¿[^»"']+\?[»"']/g, (q) =>
        esPreguntaDeCriterio(q.replace(/[«»"']/g, "")) ? "" : q,
      )
      .replace(/\s{2,}/g, " ")
      .replace(/\s*[›>]\s*$/g, "")
      .trim()
  }
  if (!u || u === DASH) return DASH
  return u
}

export function criterioEntregaCampos(
  ev: CriterionEvaluation,
  sust?: ClaudeSustitucion,
): CriterioEntregaCampos {
  const narracion = narracionLimpia(ev, sust)
  const textoEnPantalla = resolverTextoEnPantalla(ev, sust)
  const ubicacionExplicita =
    sust?.ubicacion_pantalla?.trim() || ev.ubicacion_pantalla?.trim() || ""
  const ubicacionEnPantalla = limpiarUbicacionEntrega(
    resolverUbicacionEnPantalla(textoEnPantalla, ubicacionExplicita, narracion),
    textoEnPantalla,
  )

  if (ev.estado === "no_aplica") {
    return conLenguajeTipografiaCms({
      textoEnPantalla,
      correccionPropuesta: DASH,
      ubicacionEnPantalla,
      justificacion:
        comentarioLimpio(ev) ||
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
    const relacionados = sust.criterios_relacionados ?? []
    const listaRel =
      relacionados.length > 0
        ? [sust.criterio_id, ...relacionados]
            .map((id) => etiquetaCriterioSimple(id))
            .join(", ")
        : ""
    return conLenguajeTipografiaCms({
      textoEnPantalla,
      correccionPropuesta: corregirPropuestaEntrega(
        sust.propuesto,
        sust.criterio_id || ev.id,
      ),
      ubicacionEnPantalla,
      justificacion: [
        ev.agrupado_en
          ? `Agrupado en el ${etiquetaCriterioSimple(ev.agrupado_en)} (mismo nodo).`
          : null,
        sust.patron_sistema
          ? "Patrón de sitio (corregir una vez en el layout o componente compartido del CMS)."
          : null,
        listaRel ? `Criterios relacionados: ${listaRel}.` : null,
        motivoLimpio(sust) || null,
        comentarioLimpio(ev) || null,
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
  const propuesto = corregirPropuestaEntrega(
    cms ?? `Corregir incumplimiento de ${ev.id}.`,
    ev.id,
  )
  return conLenguajeTipografiaCms({
    textoEnPantalla,
    correccionPropuesta: propuesto,
    ubicacionEnPantalla,
    justificacion: [
      ev.agrupado_en
        ? `Agrupado en el ${etiquetaCriterioSimple(ev.agrupado_en)} (mismo nodo).`
        : null,
      comentarioLimpio(ev) ||
        `Incumple el ${etiquetaCriterioSimple(ev.id)} sin fila de corrección registrada.`,
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
