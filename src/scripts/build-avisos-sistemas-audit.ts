/**
 * Construye la auditoría agregada de avisos de mantenimiento/informativos
 * (130 filas Excel → chunks por plantilla; copy por hechos + HTML de referencia).
 *
 * Uso: bun run src/scripts/build-avisos-sistemas-audit.ts
 */
import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import ExcelJS from "exceljs"

import { avisosPlantillaKey } from "../lib/avisos-plantilla-key"
import {
  construirPropuestaAviso,
  extraerHechosAviso,
  etiquetasHechos,
} from "../lib/avisos-hechos-operativos"
import { buildPropuestaHtml } from "../lib/avisos-propuesta-html"
import { CRITERION_IDS_V30, summarizeEvaluations } from "../schemas/checklist"
import type { CriterionEvaluation, CriterionId } from "../schemas/checklist"
import type { ClaudeSustitucion } from "../schemas/claude-audit-pilot"
import { claudeAuditFileSchema } from "../schemas/claude-audit-pilot"

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO = resolve(__dirname, "../..")
const XLSX = join(
  REPO,
  "docs/auditorias-tramites-url-10-y-11/Avisos Sistemas.xlsx",
)
const AUDIT_ID = "avisos-sistemas-tramites_2026-11-09"
const OUT_JSON = join(
  REPO,
  "data/claude-audits/tramites/2026-11-09",
  `${AUDIT_ID}.json`,
)

type AvisoRow = {
  id: number
  texto_html: string
  texto_plano: string
  fecha_inicio: string
  fecha_fin: string
  estado: string
  id_sistema: string
}

type UniqueGroup = {
  key: string
  texto_html: string
  texto_plano: string
  ids: number[]
  fechas_inicio: string[]
  estados: string[]
  ids_sistema: string[]
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n+/g, "\n")
    .trim()
}

function cellAsString(value: unknown): string {
  if (value == null) return ""
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value)
  }
  if (value instanceof Date) {
    return value.toISOString().replace("T", " ").replace(/\.\d{3}Z$/, "")
  }
  if (typeof value === "object" && value !== null && "text" in value) {
    return String((value as { text: unknown }).text ?? "")
  }
  if (typeof value === "object" && value !== null && "result" in value) {
    return cellAsString((value as { result: unknown }).result)
  }
  return String(value)
}

/** Normaliza fecha Excel a `YYYY-MM-DD HH:mm:ss` o el literal si ya viene así. */
function normalizeFecha(raw: string): string {
  const s = raw.trim()
  if (!s) return s
  // "2023-09-27 16:20:00.000" → sin milisegundos
  const m = s.match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})/)
  if (m) return `${m[1]} ${m[2]}`
  return s
}

function pushUnique(list: string[], value: string) {
  if (!value) return
  if (!list.includes(value)) list.push(value)
}

async function loadAvisos(): Promise<AvisoRow[]> {
  const wb = new ExcelJS.Workbook()
  await wb.xlsx.readFile(XLSX)
  const ws = wb.worksheets[0]!
  const rows: AvisoRow[] = []
  ws.eachRow((row, n) => {
    if (n === 1) return
    const id = row.getCell(1).value
    if (id == null || id === "") return
    const texto_html = cellAsString(row.getCell(2).value)
    rows.push({
      id: Number(id),
      texto_html,
      texto_plano: stripHtml(texto_html),
      fecha_inicio: normalizeFecha(cellAsString(row.getCell(3).value)),
      fecha_fin: normalizeFecha(cellAsString(row.getCell(4).value)),
      estado: cellAsString(row.getCell(5).value),
      id_sistema: cellAsString(row.getCell(6).value),
    })
  })
  return rows
}

/**
 * Agrupa por plantilla editorial: ignora días/fechas/horas; separa si cambian
 * palabras, conceptos o forma de dirigirse a la persona (C-2026-11-09b).
 */
function groupUnique(rows: AvisoRow[]): UniqueGroup[] {
  const map = new Map<string, UniqueGroup>()
  for (const r of rows) {
    const key = avisosPlantillaKey(r.texto_plano)
    const g = map.get(key)
    if (!g) {
      map.set(key, {
        key,
        texto_html: r.texto_html,
        texto_plano: r.texto_plano,
        ids: [r.id],
        fechas_inicio: r.fecha_inicio ? [r.fecha_inicio] : [],
        estados: r.estado ? [r.estado] : [],
        ids_sistema: r.id_sistema ? [r.id_sistema] : [],
      })
    } else {
      g.ids.push(r.id)
      pushUnique(g.fechas_inicio, r.fecha_inicio)
      pushUnique(g.estados, r.estado)
      pushUnique(g.ids_sistema, r.id_sistema)
    }
  }
  for (const g of map.values()) {
    g.ids.sort((a, b) => a - b)
    g.fechas_inicio.sort()
  }
  return [...map.values()].sort((a, b) => a.ids[0]! - b.ids[0]!)
}

/** Heurísticas de copy para avisos operativos (solo texto plano). */
function analyzeText(texto: string) {
  const t = texto
  const lower = t.toLowerCase()
  const hechos = extraerHechosAviso(t)
  return {
    hechos,
    hasDatacenter: hechos.datacenter,
    hasMantenciones: /\bmantenciones\b/i.test(t),
    hasNoSeraPosible: /no será posible realizar trámites/i.test(t),
    hasSoloNegativo: /no será posible|no se podrán|fuera de servicio/i.test(t),
    hasQueHacer: /puede completar|vuelva a intentarlo|antes de las|tome las medidas|recomendamos/i.test(
      t,
    ),
    hasTgrSinExpandir:
      /\bTGR\b/.test(t) && !/Tesorer[ií]a General de la Rep[uú]blica/i.test(t),
    hasCustodiaTypo: /Custod[ií]a y presentaci[oó]n de poderes/i.test(t),
    hasImportanteCaps: /^IMPORTANTE\b/.test(t.trim()) || /\bIMPORTANTE:/.test(t),
    hasVuestra: /\bvuestra\b/i.test(t),
    hasIpAnglicism: /\bdireccionamiento IP\b/i.test(t),
    isMfaNotice: hechos.mfaSeisDigitos,
    isShortBroken: t.length < 120 && /lamentamos las molestias/i.test(lower),
    tieneHechoEspecifico: etiquetasHechos(hechos).length > 0,
  }
}

function ubicacionGroup(g: UniqueGroup): string {
  const ids =
    g.ids.length <= 8
      ? g.ids.join(", ")
      : `${g.ids.slice(0, 8).join(", ")}… (+${g.ids.length - 8})`
  const sys = g.ids_sistema.join(", ")
  return `Avisos Sistemas — IDs ${ids} (sistemas ${sys})`
}

async function main(): Promise<void> {
  const rows = await loadAvisos()
  const groups = groupUnique(rows)
  mkdirSync(dirname(OUT_JSON), { recursive: true })
  writeFileSync(
    join(
      REPO,
      "docs/auditorias-tramites-url-10-y-11/avisos-sistemas-extract.json",
    ),
    JSON.stringify(
      {
        avisos: rows,
        unique_count: groups.length,
        groups: groups.map((g) => ({
          ids: g.ids,
          fechas_inicio: g.fechas_inicio,
          estados: g.estados,
          ids_sistema: g.ids_sistema,
          n: g.ids.length,
          texto_plano: g.texto_plano,
          texto_html: g.texto_html,
        })),
      },
      null,
      2,
    ),
  )

  const sustituciones: ClaudeSustitucion[] = []
  let lineaN = 0
  const flagsAgg = {
    datacenter: 0,
    noOrientacion: 0,
    tgr: 0,
    mantenciones: 0,
    caps: 0,
    otros: 0,
  }

  for (const g of groups) {
    const a = analyzeText(g.texto_plano)
    const needsFix =
      a.hasDatacenter ||
      a.hasMantenciones ||
      (a.hasSoloNegativo && !a.hasQueHacer) ||
      a.hasTgrSinExpandir ||
      a.hasCustodiaTypo ||
      a.hasImportanteCaps ||
      a.hasVuestra ||
      a.hasIpAnglicism ||
      a.isShortBroken ||
      a.isMfaNotice ||
      a.tieneHechoEspecifico

    if (!needsFix) continue

    if (a.hasDatacenter) flagsAgg.datacenter++
    if (a.hasSoloNegativo && !a.hasQueHacer) flagsAgg.noOrientacion++
    if (a.hasTgrSinExpandir) flagsAgg.tgr++
    if (a.hasMantenciones) flagsAgg.mantenciones++
    if (a.hasImportanteCaps) flagsAgg.caps++
    if (
      a.hasCustodiaTypo ||
      a.hasVuestra ||
      a.hasIpAnglicism ||
      a.isShortBroken ||
      a.isMfaNotice
    ) {
      flagsAgg.otros++
    }

    lineaN += 1
    const linea = `A${String(lineaN).padStart(2, "0")}`
    const primary: CriterionId =
      a.hasDatacenter || a.hasMantenciones || a.hasIpAnglicism
        ? "LC-1.1.3-04"
        : a.hasSoloNegativo && !a.hasQueHacer
          ? "LC-1.1.3-06"
          : a.hasTgrSinExpandir || a.hasCustodiaTypo
            ? "LC-1.1.3-05"
            : "LC-1.1.3-03"

    const relacionados: CriterionId[] = []
    if (primary !== "LC-1.1.3-04" && (a.hasDatacenter || a.hasMantenciones)) {
      relacionados.push("LC-1.1.3-04")
    }
    if (primary !== "LC-1.1.3-06" && a.hasSoloNegativo && !a.hasQueHacer) {
      relacionados.push("LC-1.1.3-06")
    }
    if (primary !== "LC-1.1.3-05" && (a.hasTgrSinExpandir || a.hasCustodiaTypo)) {
      relacionados.push("LC-1.1.3-05")
    }

    const propuestoPlano = construirPropuestaAviso(g.texto_plano, {
      plantillaVariosIds: g.ids.length > 1,
    })
    const propuesto_html = buildPropuestaHtml(g.texto_html, propuestoPlano)

    sustituciones.push({
      linea,
      criterio_id: primary,
      criterios_relacionados: relacionados.length ? relacionados : undefined,
      ubicacion_pantalla: ubicacionGroup(g),
      original: g.texto_html,
      propuesto: propuestoPlano,
      propuesto_html,
      motivo:
        `Aviso operativo: pegar el HTML propuesto conservando id/class del contenedor. ` +
        (etiquetasHechos(a.hechos).length
          ? `Hechos que no se pueden omitir: ${etiquetasHechos(a.hechos).join("; ")}. `
          : "") +
        `Misma plantilla editorial` +
        (g.ids.length > 1
          ? ` en ${g.ids.length} IDs (${g.ids.join(", ")}); solo cambian día/hora. El propuesto no usa una sola fecha para todos.`
          : ".") +
        (relacionados.length
          ? ` Agrupa criterios de lenguaje/orientación del mismo texto.`
          : ""),
      patron_sistema: g.ids.length > 1 || g.ids_sistema.length > 1,
      aviso_correccion: {
        ids: g.ids,
        fechas_inicio:
          g.fechas_inicio.length > 0 ? g.fechas_inicio : ["(sin fecha)"],
        estados: g.estados.length > 0 ? g.estados : ["(sin estado)"],
        ids_sistema:
          g.ids_sistema.length > 0 ? g.ids_sistema : ["(sin sistema)"],
      },
    })
  }

  const IEW_ONLY = new Set<string>([
    "LC-1.1.5-03",
    "LC-1.1.6-02",
    "LC-1.1.7-01",
    "LC-1.1.7-02",
    "LC-1.1.8-01",
    "LC-1.1.8-02",
    "LC-1.1.8-03",
    "LC-1.2.4-06",
    "LC-1.3.1-01",
    "LC-1.3.2-02",
  ])

  const TEXT_FOCUS = new Set<string>([
    "LC-1.1.3-03",
    "LC-1.1.3-04",
    "LC-1.1.3-05",
    "LC-1.1.3-06",
    "LC-1.1.2-03",
    "LC-1.2.1-03",
    "LC-1.2.1-04",
    "LC-5.2.4-01",
  ])

  const criterios_evaluados: CriterionEvaluation[] = CRITERION_IDS_V30.map(
    (id) => {
      if (IEW_ONLY.has(id)) {
        return {
          id,
          estado: "no_aplica" as const,
          comentario:
            "Exclusivo del instrumento de sitios web (IEW). Esta auditoría cubre avisos operativos de sistemas (copy de mantención/información), no una página sitioweb.",
        }
      }

      if (
        id.startsWith("LC-1.2.4") ||
        id.startsWith("LC-1.2.3") ||
        id.startsWith("LC-1.1.4") ||
        id.startsWith("LC-1.1.5") ||
        id.startsWith("LC-1.1.6") ||
        id.startsWith("LC-1.1.7") ||
        id.startsWith("LC-1.1.8") ||
        id.startsWith("LC-5.2.2") ||
        id === "LC-5.2.1-01" ||
        id === "LC-1.2.2-03" ||
        id === "LC-1.2.2-04" ||
        id === "LC-1.3.2-01"
      ) {
        return {
          id,
          estado: "no_aplica" as const,
          comentario:
            "No aplica al corpus de avisos: se audita el texto del anuncio (con HTML de referencia en la entrega), no la estructura de página contenedora (C-2026-11-09a).",
        }
      }

      if (id === "LC-1.1.3-04") {
        return {
          id,
          estado: "incumple" as const,
          severidad: "baja" as const,
          comentario:
            flagsAgg.datacenter > 0 || flagsAgg.mantenciones > 0
              ? `Varios avisos usan «datacenter» o «mantenciones». Hay ${flagsAgg.datacenter} textos únicos con datacenter y ${flagsAgg.mantenciones} con mantenciones; propuestas unificadas por copy.`
              : "No se detectó anglicismo datacenter en el corpus actual.",
          cita_textual: "datacenter / mantenciones",
          ubicacion_pantalla: "Avisos Sistemas (textos únicos con el hallazgo)",
        }
      }
      if (id === "LC-1.1.3-06") {
        return {
          id,
          estado: "incumple" as const,
          severidad: "baja" as const,
          comentario:
            flagsAgg.noOrientacion > 0
              ? `${flagsAgg.noOrientacion} textos únicos se centran en lo que no se puede hacer sin orientar a la persona.`
              : "Los avisos revisados orientan adecuadamente.",
          cita_textual: "Durante este período, no será posible realizar trámites en línea.",
          ubicacion_pantalla: "Avisos Sistemas (mensajes de mantención)",
        }
      }
      if (id === "LC-1.1.3-05") {
        const hit = flagsAgg.tgr > 0 || flagsAgg.otros > 0
        return {
          id,
          estado: hit ? ("incumple" as const) : ("cumple" as const),
          severidad: hit ? ("baja" as const) : undefined,
          comentario: hit
            ? "Hay avisos con siglas sin expandir (p. ej. TGR) o rótulos poco claros en el copy."
            : "No se detectaron siglas críticas sin expandir en los textos únicos priorizados.",
        }
      }
      if (id === "LC-1.1.3-03") {
        return {
          id,
          estado: "incumple" as const,
          severidad: "baja" as const,
          comentario:
            "Varios avisos usan fórmulas densas («Debemos informar», mayúsculas sostenidas en IMPORTANTE) que se simplifican en las propuestas finales por texto.",
        }
      }
      if (id === "LC-1.1.2-03") {
        return {
          id,
          estado: "incumple" as const,
          severidad: "media" as const,
          comentario:
            "Muchos avisos indican el qué/cuándo del corte pero no el qué hacer (completar antes / reintentar después).",
        }
      }

      if (TEXT_FOCUS.has(id) && id.startsWith("LC-1.2.1")) {
        return {
          id,
          estado: "cumple" as const,
          comentario:
            "Las propuestas finales usan oraciones cortas y voz activa en el corpus de correcciones.",
        }
      }

      return {
        id,
        estado: "cumple" as const,
        comentario:
          "Sin hallazgo de copy en el corpus de avisos para esta pregunta; fuera de alcance HTML/layout de página.",
      }
    },
  )

  if (flagsAgg.datacenter === 0 && flagsAgg.mantenciones === 0) {
    const ev = criterios_evaluados.find((c) => c.id === "LC-1.1.3-04")!
    ev.estado = "cumple"
    delete ev.severidad
  }
  if (flagsAgg.noOrientacion === 0) {
    const ev = criterios_evaluados.find((c) => c.id === "LC-1.1.3-06")!
    ev.estado = "cumple"
    delete ev.severidad
  }

  const sum = summarizeEvaluations(criterios_evaluados)
  const file = {
    id: AUDIT_ID,
    url: "inapi://avisos-sistemas-tramites",
    fecha_evaluacion: "2026-11-09T00:00:00.000Z",
    evaluador_uid: "equipo de desarrollo",
    version_checklist: "3.0",
    tipo_pagina: "tramites" as const,
    texto_capturado: `Corpus de ${rows.length} avisos (${groups.length} textos únicos) desde Avisos Sistemas.xlsx. Entrega con HTML de referencia por texto único.`,
    criterios_evaluados,
    criterios_aprobados: sum.criterios_aprobados,
    criterios_aplicables: sum.criterios_aplicables,
    criterios_no_aplica: sum.criterios_no_aplica,
    porcentaje_cumplimiento: sum.porcentaje_cumplimiento,
    estado_aceptacion: sum.estado_aceptacion,
    resumen_ejecutivo:
      `Se auditaron ${rows.length} avisos de mantenimiento/informativos (${groups.length} plantillas editoriales) ` +
      `aplicando los 51 criterios al copy. ` +
      `Se generaron ${sustituciones.length} solicitudes de corrección, una por plantilla con hallazgos ` +
      `(agrupa IDs con el mismo mensaje aunque cambien día/hora; separa si cambia el wording). ` +
      `Cada solicitud entrega HTML original, HTML propuesto listo para pegar y vista tipográfica (C-2026-11-09b).`,
    nota_final_tic:
      "Pegar el HTML propuesto en cada ID listado (conservar id/class del contenedor). " +
      "Cuando la plantilla agrupa varios IDs, usar el mismo HTML en todos; solo ajusta fechas/horas operativas si el sistema las inyecta aparte.",
    observaciones_lc_por_severidad: {
      hallazgos_prioridad_alta: [],
      hallazgos_prioridad_media: [
        "Varios avisos de mantención no orientan qué hacer antes o después del corte.",
      ],
      hallazgos_prioridad_baja: [
        "Anglicismo «datacenter» y fórmulas en negativo sin alternativa de acción en textos repetidos.",
        "Siglas o rótulos poco claros en avisos puntuales (TGR, custodia de poderes).",
      ],
    },
    sustituciones,
  }

  const parsed = claudeAuditFileSchema.parse(file)
  writeFileSync(OUT_JSON, JSON.stringify(parsed, null, 2) + "\n")
  console.log({
    out: OUT_JSON,
    avisos: rows.length,
    unique: groups.length,
    sust: sustituciones.length,
    pct: sum.porcentaje_cumplimiento,
    estado: sum.estado_aceptacion,
    flagsAgg,
    sampleHtml: sustituciones[0]?.original.slice(0, 80),
  })
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
