/**
 * Mapa LC-* → hito(s) y tarea(s) PTD (OpenProject) desde el checklist editorial.
 * Fuente: data/checklist-editorial-ptd-v2.json (= Word PTD v2.0).
 *
 * Varias preguntas se repiten bajo más de un hito/tarea: se listan todas.
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
  /** Ej. `492 — La institución… | 500 — Cada página…` */
  hitoPtd: string
  /** Ej. `491 — Implementar un checklist… | 499 — Configurar en el CMS…` */
  tareaPtd: string
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

function formatRefs(refs: PtdHitoTareaRef[]): PtdHitoTareaLabels {
  if (refs.length === 0) {
    return { hitoPtd: DASH, tareaPtd: DASH, refs: [] }
  }
  // Deduplicar manteniendo orden
  const seenH = new Set<number>()
  const seenT = new Set<number>()
  const hitoParts: string[] = []
  const tareaParts: string[] = []
  for (const r of refs) {
    if (!seenH.has(r.hitoId)) {
      seenH.add(r.hitoId)
      hitoParts.push(`${r.hitoId} — ${truncate(r.hitoTitulo)}`)
    }
    if (!seenT.has(r.tareaId)) {
      seenT.add(r.tareaId)
      tareaParts.push(`${r.tareaId} — ${truncate(r.tareaDescripcion)}`)
    }
  }
  return {
    hitoPtd: hitoParts.join(" | "),
    tareaPtd: tareaParts.join(" | "),
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

const lcById = new Map(
  ((lcFile as { criteria: LcCriterion[] }).criteria ?? []).map((c) => [c.id, c]),
)

/**
 * Resuelve hito(s)/tarea(s) PTD para un id de criterio (LC-* o legado A–H).
 * Legado A–H sin fila en catálogo v3.0 → guion.
 */
export function ptdHitoTareaPorCriterio(criterioId: string): PtdHitoTareaLabels {
  const lc = lcById.get(criterioId)
  if (!lc) {
    return { hitoPtd: DASH, tareaPtd: DASH, refs: [] }
  }

  const core = stripQuestionCore(lc.criterion || lc.verification)
  let refs = matchByQuestion(core)
  if (refs.length === 0) {
    const codes = [lc.indicator_code_iew, lc.indicator_code_iesd].filter(
      (c): c is string => Boolean(c),
    )
    refs = matchByIndicatorCodes(codes)
  }
  return formatRefs(refs)
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
