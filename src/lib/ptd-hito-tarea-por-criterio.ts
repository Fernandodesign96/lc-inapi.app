/**
 * Mapa LC-* → hito(s) y tarea(s) PTD (OpenProject) desde el checklist editorial.
 * Fuente: data/checklist-editorial-ptd-v2.json (= Word PTD v2.0 + ajustes de entrega).
 *
 * Hito **492** / Tarea **491** (checklist editorial meta) **nunca** se muestran en
 * UI / PDF / Excel: el checklist ya está implementado. Las preguntas que solo
 * vivían ahí se anclan a hitos operativos (p. ej. Completitud → **498** / **497**).
 *
 * Anclaje entrega (sin solape 494↔496):
 * - Fiabilidad (`LC-1.1.1-*`) → Hito **500** / Tarea **499**
 * - Completitud (`LC-1.1.2-*`) → Hito **498** / Tarea **497**
 * - Redacción (`LC-1.1.5-*`) → Hito **494** / Tarea **493**
 * - Lenguaje plano (`LC-1.1.3-*`) → Hito **496** / Tarea **495**
 * - Privacidad: RUN/teléfonos → **503**; ARCO → **504**
 * - Contenidos sensibles: identidad → **510**; aptitud → **511**; susceptibilidad → **512**
 *
 * Si no hay match textual de la pregunta, se usa el indicador IEW/IESD.
 */
import ptdFile from "../../data/checklist-editorial-ptd-v2.json"
import lcFile from "../../data/checklist-criteria-lc-ptd.json"

export type PtdHitoTareaRef = {
  hitoId: number
  hitoTitulo: string
  tareaId: number
  tareaDescripcion: string
}

export type PtdHitoTareaLabels = {
  /**
   * Etiqueta de entrega (numeración simple).
   * Ej. `Hito 1 — El sitio publica contenidos…`
   */
  hitoPtd: string
  /**
   * Etiqueta de entrega (numeración simple dentro del hito).
   * Ej. `Tarea 1 — Corregir y prevenir errores…`
   */
  tareaPtd: string
  /** 1…N según orden de hitos PTD (menor id → mayor), excl. 492. */
  hitoOrdinal: number | null
  /** 1…M dentro del hito (menor id de tarea → mayor). */
  tareaOrdinal: number | null
  /** 1…51 continuo (recorrido Hito → Tarea → catálogo; no reinicia por tarea). */
  criterioOrdinal: number | null
  refs: PtdHitoTareaRef[]
}

type PtdIndicador = {
  codigo: string
  nombre: string
  preguntas: string[]
}

type PtdTarea = {
  id: number
  descripcion: string
  indicadores: PtdIndicador[]
}

type PtdHito = {
  id: number
  titulo: string
  tareas: PtdTarea[]
}

type PtdDimension = {
  id: string
  hitos: PtdHito[]
}

type LcCriterion = {
  id: string
  indicator_code_iew: string | null
  indicator_code_iesd: string | null
  indicator_name: string
  criterion: string
  verification: string
}

const DASH = "—"
const TITLE_MAX = 72

/** Hito/tarea meta del checklist: nunca en entregables. */
const META_CHECKLIST_HITO_IDS = new Set([492])
const META_CHECKLIST_TAREA_IDS = new Set([491])

/**
 * Anclas forzadas de entrega cuando el JSON solo tiene la pregunta bajo el meta
 * 492/491 (u otro solape a evitar).
 */
const ANCLA_ENTREGA_FORZADA: Array<{
  match: (id: string) => boolean
  hitoId: number
  tareaId: number
}> = [
  {
    match: (id) => id.startsWith("LC-1.1.2-"),
    hitoId: 498,
    tareaId: 497,
  },
]

function isMetaChecklistRef(ref: PtdHitoTareaRef): boolean {
  return (
    META_CHECKLIST_HITO_IDS.has(ref.hitoId) ||
    META_CHECKLIST_TAREA_IDS.has(ref.tareaId)
  )
}

function withoutMetaChecklist(refs: PtdHitoTareaRef[]): PtdHitoTareaRef[] {
  return refs.filter((r) => !isMetaChecklistRef(r))
}

function truncate(text: string, max = TITLE_MAX): string {
  const t = text.trim()
  if (t.length <= max) return t
  return `${t.slice(0, max - 1)}…`
}

function normalizeText(raw: string): string {
  return raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[«»""]/g, '"')
    .replace(/&quot;/gi, '"')
    .replace(/[—–]/g, "-")
    .replace(/\([^)]*por ejemplo[^)]*\)/gi, " ")
    .replace(/\s*por ejemplo[:.].*$/i, " ")
    .replace(/[^a-z0-9¿?\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function stripQuestionCore(raw: string): string {
  const n = normalizeText(raw)
  // Quitar prefijos situacionales largos para comparar el núcleo interrogativo
  const qIdx = n.indexOf("¿")
  return qIdx >= 0 ? n.slice(qIdx) : n
}

function codesFromDisplay(codigo: string): string[] {
  const found = codigo.match(/\d+\.\d+\.\d+/g)
  return found ? [...new Set(found)] : []
}

function cl1Hitos(): PtdHito[] {
  const dims = (ptdFile as { dimensiones: PtdDimension[] }).dimensiones
  const cl1 = dims.find((d) => d.id === "CL1")
  return cl1?.hitos ?? []
}

type IndexedPair = {
  ref: PtdHitoTareaRef
  codes: string[]
  preguntasNorm: string[]
}

function buildIndex(): IndexedPair[] {
  const out: IndexedPair[] = []
  for (const hito of cl1Hitos()) {
    for (const tarea of hito.tareas) {
      for (const ind of tarea.indicadores) {
        out.push({
          ref: {
            hitoId: hito.id,
            hitoTitulo: hito.titulo,
            tareaId: tarea.id,
            tareaDescripcion: tarea.descripcion,
          },
          codes: codesFromDisplay(ind.codigo),
          preguntasNorm: (ind.preguntas ?? []).map(stripQuestionCore),
        })
      }
    }
  }
  return out
}

const INDEX = buildIndex()

const lcById = new Map(
  ((lcFile as { criteria: LcCriterion[] }).criteria ?? []).map((c) => [c.id, c]),
)

const CATALOG_ORDER = new Map(
  [...lcById.keys()].map((id, i) => [id, i]),
)

/**
 * Numeración de entrega: Hito 1…N (ids PTD asc), Tarea 1…M por hito,
 * Criterio 1…51 continuo (recorrido Hito → Tarea → catálogo). Ids OpenProject en `refs`.
 */
type NumeracionSimple = {
  hitoOrdinalById: Map<number, number>
  tareaOrdinalByKey: Map<string, number>
  criterioOrdinalById: Map<string, number>
}

function buildNumeracionSimple(): NumeracionSimple {
  type AccTarea = { tareaId: number; desc: string; criterioIds: string[] }
  type AccHito = {
    hitoId: number
    titulo: string
    tareas: Map<number, AccTarea>
  }
  const byHito = new Map<number, AccHito>()

  for (const id of lcById.keys()) {
    const forced = anclaForzadaEntrega(id)
    let refs: PtdHitoTareaRef[]
    if (forced) {
      refs = forced
    } else {
      const lc = lcById.get(id)!
      const core = stripQuestionCore(lc.criterion || lc.verification)
      refs = withoutMetaChecklist(matchByQuestion(core))
      if (refs.length === 0) {
        const codes = [lc.indicator_code_iew, lc.indicator_code_iesd].filter(
          (c): c is string => Boolean(c),
        )
        refs = withoutMetaChecklist(matchByIndicatorCodes(codes))
      }
    }
    const ref = refs[0]
    if (!ref) continue
    let h = byHito.get(ref.hitoId)
    if (!h) {
      h = { hitoId: ref.hitoId, titulo: ref.hitoTitulo, tareas: new Map() }
      byHito.set(ref.hitoId, h)
    }
    let t = h.tareas.get(ref.tareaId)
    if (!t) {
      t = {
        tareaId: ref.tareaId,
        desc: ref.tareaDescripcion,
        criterioIds: [],
      }
      h.tareas.set(ref.tareaId, t)
    }
    if (!t.criterioIds.includes(id)) t.criterioIds.push(id)
  }

  const hitoOrdinalById = new Map<number, number>()
  const tareaOrdinalByKey = new Map<string, number>()
  const criterioOrdinalById = new Map<string, number>()

  const hitos = [...byHito.values()].sort((a, b) => a.hitoId - b.hitoId)
  const criterioIdsEnOrden: string[] = []
  hitos.forEach((h, hi) => {
    const hitoN = hi + 1
    hitoOrdinalById.set(h.hitoId, hitoN)
    const tareas = [...h.tareas.values()].sort((a, b) => a.tareaId - b.tareaId)
    tareas.forEach((t, ti) => {
      const tareaN = ti + 1
      tareaOrdinalByKey.set(`${h.hitoId}:${t.tareaId}`, tareaN)
      const sorted = [...t.criterioIds].sort(
        (a, b) =>
          (CATALOG_ORDER.get(a) ?? 999) - (CATALOG_ORDER.get(b) ?? 999),
      )
      for (const cid of sorted) criterioIdsEnOrden.push(cid)
    })
  })
  // Criterios 1…51 en orden de recorrido Hito → Tarea → catálogo (no reinician por tarea).
  criterioIdsEnOrden.forEach((cid, i) => {
    criterioOrdinalById.set(cid, i + 1)
  })

  return { hitoOrdinalById, tareaOrdinalByKey, criterioOrdinalById }
}

/** Lazy: `anclaForzadaEntrega` se define más abajo. */
let NUMERACION: NumeracionSimple | null = null

function numeracion(): NumeracionSimple {
  if (!NUMERACION) NUMERACION = buildNumeracionSimple()
  return NUMERACION
}

function emptyLabels(refs: PtdHitoTareaRef[] = []): PtdHitoTareaLabels {
  return {
    hitoPtd: DASH,
    tareaPtd: DASH,
    hitoOrdinal: null,
    tareaOrdinal: null,
    criterioOrdinal: null,
    refs,
  }
}

function formatRefs(
  refs: PtdHitoTareaRef[],
  criterioId?: string,
): PtdHitoTareaLabels {
  if (refs.length === 0) return emptyLabels()
  const num = numeracion()
  const seenH = new Set<number>()
  const seenT = new Set<number>()
  const hitoParts: string[] = []
  const tareaParts: string[] = []
  for (const r of refs) {
    if (!seenH.has(r.hitoId)) {
      seenH.add(r.hitoId)
      const n = num.hitoOrdinalById.get(r.hitoId)
      hitoParts.push(
        n != null
          ? `Hito ${n} — ${truncate(r.hitoTitulo)}`
          : `Hito — ${truncate(r.hitoTitulo)}`,
      )
    }
    if (!seenT.has(r.tareaId)) {
      seenT.add(r.tareaId)
      const n = num.tareaOrdinalByKey.get(`${r.hitoId}:${r.tareaId}`)
      tareaParts.push(
        n != null
          ? `Tarea ${n} — ${truncate(r.tareaDescripcion)}`
          : `Tarea — ${truncate(r.tareaDescripcion)}`,
      )
    }
  }
  const primary = refs[0]!
  return {
    hitoPtd: hitoParts.join(" | "),
    tareaPtd: tareaParts.join(" | "),
    hitoOrdinal: num.hitoOrdinalById.get(primary.hitoId) ?? null,
    tareaOrdinal:
      num.tareaOrdinalByKey.get(`${primary.hitoId}:${primary.tareaId}`) ?? null,
    criterioOrdinal: criterioId
      ? (num.criterioOrdinalById.get(criterioId) ?? null)
      : null,
    refs,
  }
}

function matchByQuestion(criterionNorm: string): PtdHitoTareaRef[] {
  const hits: PtdHitoTareaRef[] = []
  const seen = new Set<string>()
  for (const row of INDEX) {
    for (const pn of row.preguntasNorm) {
      if (!pn) continue
      const ok =
        criterionNorm === pn ||
        criterionNorm.startsWith(pn) ||
        pn.startsWith(criterionNorm.slice(0, Math.min(48, criterionNorm.length))) ||
        (pn.length >= 24 && criterionNorm.includes(pn)) ||
        (criterionNorm.length >= 24 && pn.includes(criterionNorm.slice(0, 60)))
      if (!ok) continue
      const key = `${row.ref.hitoId}:${row.ref.tareaId}`
      if (seen.has(key)) continue
      seen.add(key)
      hits.push(row.ref)
    }
  }
  return hits
}

function matchByIndicatorCodes(codes: string[]): PtdHitoTareaRef[] {
  if (codes.length === 0) return []
  const hits: PtdHitoTareaRef[] = []
  const seen = new Set<string>()
  for (const row of INDEX) {
    const overlap = codes.some((c) => row.codes.includes(c))
    if (!overlap) continue
    const key = `${row.ref.hitoId}:${row.ref.tareaId}`
    if (seen.has(key)) continue
    seen.add(key)
    hits.push(row.ref)
  }
  return hits
}

function refPorHitoTarea(
  hitoId: number,
  tareaId: number,
): PtdHitoTareaRef | null {
  for (const hito of cl1Hitos()) {
    if (hito.id !== hitoId) continue
    for (const tarea of hito.tareas) {
      if (tarea.id !== tareaId) continue
      return {
        hitoId: hito.id,
        hitoTitulo: hito.titulo,
        tareaId: tarea.id,
        tareaDescripcion: tarea.descripcion,
      }
    }
  }
  return null
}

function anclaForzadaEntrega(criterioId: string): PtdHitoTareaRef[] | null {
  for (const rule of ANCLA_ENTREGA_FORZADA) {
    if (!rule.match(criterioId)) continue
    const ref = refPorHitoTarea(rule.hitoId, rule.tareaId)
    return ref ? [ref] : null
  }
  return null
}

/**
 * Resuelve hito(s)/tarea(s) PTD para un id de criterio (LC-* o legado A–H).
 * Legado A–H sin fila en catálogo v3.0 → guion.
 * Nunca incluye Hito 492 / Tarea 491.
 * Etiquetas de entrega: Hito 1…N / Tarea 1…M / Criterio 1…K (no ids OpenProject).
 */
export function ptdHitoTareaPorCriterio(criterioId: string): PtdHitoTareaLabels {
  const lc = lcById.get(criterioId)
  if (!lc) return emptyLabels()

  const forced = anclaForzadaEntrega(criterioId)
  if (forced) return formatRefs(forced, criterioId)

  const core = stripQuestionCore(lc.criterion || lc.verification)
  let refs = withoutMetaChecklist(matchByQuestion(core))
  if (refs.length === 0) {
    const codes = [lc.indicator_code_iew, lc.indicator_code_iesd].filter(
      (c): c is string => Boolean(c),
    )
    refs = withoutMetaChecklist(matchByIndicatorCodes(codes))
  }
  return formatRefs(refs, criterioId)
}

/** Cubre los 51 LC-* (útil en tests). */
export function coberturaPtdHitoTarea(): {
  total: number
  conHito: number
  sinHito: string[]
} {
  const ids = [...lcById.keys()]
  const sinHito: string[] = []
  let conHito = 0
  for (const id of ids) {
    const labels = ptdHitoTareaPorCriterio(id)
    if (labels.refs.length > 0) conHito += 1
    else sinHito.push(id)
  }
  return { total: ids.length, conHito, sinHito }
}
