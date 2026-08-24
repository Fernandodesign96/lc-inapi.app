/**
 * Convenciones de tipografía / formato en entrega CMS (UI · PDF · Excel).
 * Normaliza frases frecuentes hacia un lenguaje editable por Equipo UX.
 * Las sustituciones son idempotentes (reaplicar no duplica prefijos).
 */

const DASH = "—"

/**
 * Reescribe menciones de títulos, alineación, negrita y cursiva al formato
 * institucional de entrega (ej. título H1 '…', Alineado a la izquierda (align left)).
 */
export function normalizarLenguajeTipografiaCms(raw: string): string {
  if (!raw || raw === DASH) return raw

  let t = raw

  // Encabezados con cita (formas largas primero; luego Hn suelto si no ya normalizado)
  t = t.replace(
    /\b(?:el\s+)?t[ií]tulo\s+(?:principal|grande|visible)\s+(?:de\s+la\s+p[aá]gina\s+)?(?:H1|h1)(?:\s+visible)?\s*[«"']([^»"']+)[»"']/gi,
    "título H1 '$1'",
  )
  t = t.replace(
    /\bt[ií]tulo\s+(?:H1|h1)\s*[«"']([^»"']+)[»"']/gi,
    "título H1 '$1'",
  )
  t = t.replace(
    /(?<!título\s)\b(?:H1|h1)(?:\s+visible)?\s*[«"']([^»"']+)[»"']/gi,
    "título H1 '$1'",
  )

  t = t.replace(
    /\b(?:el\s+)?subt[ií]tulo\s+(?:H2|h2)(?:\s+visible)?\s*[«"']([^»"']+)[»"']/gi,
    "subtítulo h2 '$1'",
  )
  t = t.replace(
    /(?<!subtítulo\s)\b(?:H2|h2)(?:\s+visible)?\s*[«"']([^»"']+)[»"']/gi,
    "subtítulo h2 '$1'",
  )

  t = t.replace(
    /\b(?:el\s+)?subt[ií]tulo\s+(?:H3|h3)(?:\s+visible)?\s*[«"']([^»"']+)[»"']/gi,
    "subtítulo h3 '$1'",
  )
  t = t.replace(
    /(?<!subtítulo\s)\b(?:H3|h3)(?:\s+visible)?\s*[«"']([^»"']+)[»"']/gi,
    "subtítulo h3 '$1'",
  )

  // Alineación (evitar duplicar si ya trae el inglés)
  t = t.replace(
    /alinead[oa]s?\s+a\s+la\s+izquierda(?!\s*\(\s*align\s+left\s*\))/gi,
    "Alineado a la izquierda (align left)",
  )
  t = t.replace(
    /text-align\s*[:=]\s*['"]?left['"]?/gi,
    "Alineado a la izquierda (align left)",
  )
  t = t.replace(
    /\bjustificad[oa]s?(?!\s*\(\s*justify\s*\))/gi,
    "Justificado (justify)",
  )
  t = t.replace(
    /text-align\s*[:=]\s*['"]?justify['"]?/gi,
    "Justificado (justify)",
  )

  // Negrita / cursiva / sin negrita (una sola pasada; no reescribir si ya tiene (bold)/(italic))
  t = t.replace(
    /(?<!el texto en )(?:el\s+)?(?:texto\s+)?en\s+negrita(?!\s*\(\s*bold\s*\))\s*[«"']([^»"']+)[»"']/gi,
    "el texto en negrita (bold) '$1'",
  )
  t = t.replace(
    /(?<!el texto en )(?<!sin\s)negrita(?!\s*\(\s*bold\s*\))\s*[«"']([^»"']+)[»"']/gi,
    "el texto en negrita (bold) '$1'",
  )
  t = t.replace(
    /(?<!el texto en )(?:el\s+)?(?:texto\s+)?en\s+cursiva(?!\s*\(\s*italic\s*\))\s*[«"']([^»"']+)[»"']/gi,
    "el texto en cursiva (italic) '$1'",
  )
  t = t.replace(
    /(?<!el texto en )cursiva(?!\s*\(\s*italic\s*\))\s*[«"']([^»"']+)[»"']/gi,
    "el texto en cursiva (italic) '$1'",
  )
  t = t.replace(
    /(?<!el texto )(?:el\s+)?(?:texto\s+)?sin\s+negrita\s*[«"']([^»"']+)[»"']/gi,
    "el texto sin negrita '$1'",
  )

  // Propiedades CSS sueltas (sin inventar el literal del texto)
  t = t.replace(/font-weight\s*[:=]\s*['"]?bold['"]?/gi, "negrita (bold)")
  t = t.replace(/font-style\s*[:=]\s*['"]?italic['"]?/gi, "cursiva (italic)")
  t = t.replace(/\bfont-weight\s*[:=]\s*['"]?(?:400|normal)['"]?/gi, "sin negrita")

  // Mayúsculas sostenidas (formato tipográfico frecuente en LC-1.2.4-05)
  t = t.replace(
    /may[uú]sculas?\s+sostenidas?\s*[«"']([^»"']+)[»"']/gi,
    "texto en mayúsculas sostenidas '$1'",
  )

  return t
}
