/**
 * Presentación legible de `resumen_ejecutivo` y `nota_final_tic` para UI/PDF.
 * No altera el JSON canónico: solo formatea para lectura (párrafos, menos jerga).
 */

const REEMPLAZOS_JERGA: Array<[RegExp, string]> = [
  [/\bCLAUDE\.md\s*§\d+\b/giu, "flujo de auditoría"],
  [/\bsub-subagentes?\b/giu, "equipo de revisión"],
  [/\bchecklist editorial v?2\.1\b/giu, "lista de revisión"],
  [/\bHTML-L\d+\b/giu, ""],
  [/\bnodo\s+T\d+\b/giu, "texto en pantalla"],
  [/\bT\d{3}\b/gu, ""],
  [/\b`[^`]+`\b/gu, ""],
  [/\s{2,}/gu, " "],
]

/**
 * Parte un bloque denso en párrafos (saltos dobles o enumeraciones (1)(2)…).
 */
export function partirParrafosInforme(texto: string): string[] {
  const trimmed = texto.trim()
  if (!trimmed) return []

  if (/\n\s*\n/.test(trimmed)) {
    return trimmed
      .split(/\n\s*\n/u)
      .map((p) => p.replace(/\s+/gu, " ").trim())
      .filter(Boolean)
  }

  // Enumeraciones tipo "(1) … (2) …"
  if (/\(\d+\)/.test(trimmed)) {
    const parts = trimmed.split(/(?=\(\d+\))/u).map((p) => p.trim()).filter(Boolean)
    if (parts.length > 1) return parts.map((p) => p.replace(/\s+/gu, " "))
  }

  // Oraciones largas: partir cada ~2 oraciones si el bloque supera ~320 chars
  if (trimmed.length > 320) {
    const oraciones = trimmed.match(/[^.!?]+[.!?]+|[^.!?]+$/gu) ?? [trimmed]
    const grupos: string[] = []
    let buf = ""
    for (const o of oraciones) {
      const pieza = o.trim()
      if (!pieza) continue
      if ((buf + " " + pieza).trim().length > 220 && buf) {
        grupos.push(buf.trim())
        buf = pieza
      } else {
        buf = (buf + " " + pieza).trim()
      }
    }
    if (buf) grupos.push(buf.trim())
    if (grupos.length > 1) return grupos
  }

  return [trimmed.replace(/\s+/gu, " ")]
}

/** Suaviza jerga interna para audiencia no técnica (jefatura / TI funcional). */
export function suavizarJergaInforme(texto: string): string {
  let out = texto
  for (const [re, rep] of REEMPLAZOS_JERGA) {
    out = out.replace(re, rep)
  }
  return out.replace(/\s{2,}/gu, " ").trim()
}

export function parrafosInformeLegible(texto: string): string[] {
  return partirParrafosInforme(suavizarJergaInforme(texto))
}

/** Etiqueta de criterios en una sustitución agrupada (ej. «C1, C3, C4»). */
export function etiquetaCriteriosSustitucion(
  primario: string,
  relacionados?: string[] | null,
): string {
  const ids = [primario, ...(relacionados ?? [])]
  return [...new Set(ids)].join(", ")
}
