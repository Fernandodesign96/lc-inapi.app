/**
 * Convenciones de tipografía / formato en entrega CMS (UI · PDF · Excel).
 * Lenguaje claro para Equipo UX / jefatura: sin H1/H2/H3, CSS ni inglés técnico.
 * Las sustituciones son idempotentes (reaplicar no duplica prefijos).
 */

const DASH = "—"

/**
 * Reescribe menciones de títulos, alineación, negrita y cursiva a lenguaje
 * cotidiano (ej. título principal '…', Alineado a la izquierda).
 */
export function normalizarLenguajeTipografiaCms(raw: string): string {
  if (!raw || raw === DASH) return raw

  let t = raw

  // Ya normalizado con jerga → plain (idempotente hacia lenguaje claro)
  t = t.replace(/\bt[ií]tulo\s+H1\s*[«"']([^»"']+)[»"']/gi, "título principal '$1'")
  t = t.replace(/\bsubt[ií]tulo\s+h2\s*[«"']([^»"']+)[»"']/gi, "subtítulo '$1'")
  t = t.replace(
    /\bsubt[ií]tulo\s+h3\s*[«"']([^»"']+)[»"']/gi,
    "título de apartado '$1'",
  )
  t = t.replace(/\s*\(\s*align\s+left\s*\)/gi, "")
  t = t.replace(/\s*\(\s*justify\s*\)/gi, "")
  t = t.replace(/\s*\(\s*bold\s*\)/gi, "")
  t = t.replace(/\s*\(\s*italic\s*\)/gi, "")
  // Hero: frases concretas antes de borrar el paréntesis suelto
  t = t.replace(/\bzona\s+superior\s*\(\s*hero\s*\)/gi, "zona superior destacada")
  t = t.replace(/\bzona\s+hero\b/gi, "zona superior destacada")
  t = t.replace(/\bhero\s+principal\b/gi, "zona superior destacada")
  t = t.replace(/\b(?:zona\s+)?hero\b/gi, "zona superior destacada")
  t = t.replace(/\s*\(\s*hero\s*\)/gi, "")

  // Encabezados con cita (formas largas / Hn sueltos)
  t = t.replace(
    /\b(?:el\s+)?t[ií]tulo\s+(?:principal|grande|visible)\s+(?:de\s+la\s+p[aá]gina\s+)?(?:H1|h1)(?:\s+visible)?\s*[«"']([^»"']+)[»"']/gi,
    "título principal '$1'",
  )
  t = t.replace(
    /\bt[ií]tulo\s+(?:H1|h1)\s*[«"']([^»"']+)[»"']/gi,
    "título principal '$1'",
  )
  // No consumir el artículo: «el H1 '…'» → «el título principal '…'»
  t = t.replace(
    /(?<!título\s+principal\s)\b(?:H1|h1)(?:\s+visible)?\s*[«"']([^»"']+)[»"']/gi,
    "título principal '$1'",
  )
  t = t.replace(
    /(?<!título\s+principal\s)\b(?:H1|h1)\b(?!\s*'[^']*')/gi,
    "título principal",
  )

  t = t.replace(
    /\b(?:el\s+)?subt[ií]tulo\s+(?:H2|h2)(?:\s+visible)?\s*[«"']([^»"']+)[»"']/gi,
    "subtítulo '$1'",
  )
  t = t.replace(
    /(?<!subtítulo\s)\b(?:H2|h2)(?:\s+visible)?\s*[«"']([^»"']+)[»"']/gi,
    "subtítulo '$1'",
  )
  t = t.replace(/(?<!subtítulo\s)\b(?:H2|h2)\b(?!\s*'[^']*')/gi, "subtítulo")

  t = t.replace(
    /\b(?:el\s+)?subt[ií]tulo\s+(?:H3|h3)(?:\s+visible)?\s*[«"']([^»"']+)[»"']/gi,
    "título de apartado '$1'",
  )
  t = t.replace(
    /(?<!título\s+de\s+apartado\s)\b(?:H3|h3)(?:\s+visible)?\s*[«"']([^»"']+)[»"']/gi,
    "título de apartado '$1'",
  )
  t = t.replace(
    /(?<!título\s+de\s+apartado\s)\b(?:H3|h3)\b(?!\s*'[^']*')/gi,
    "título de apartado",
  )

  // Alineación
  t = t.replace(
    /alinead[oa]s?\s+a\s+la\s+izquierda/gi,
    "Alineado a la izquierda",
  )
  t = t.replace(/text-align\s*[:=]\s*['"]?left['"]?/gi, "Alineado a la izquierda")
  t = t.replace(/\bjustificad[oa]s?\b/gi, "Justificado")
  t = t.replace(/text-align\s*[:=]\s*['"]?justify['"]?/gi, "Justificado")

  // Negrita / cursiva / sin negrita
  t = t.replace(
    /(?<!el texto en )(?:el\s+)?(?:texto\s+)?en\s+negrita\s*[«"']([^»"']+)[»"']/gi,
    "el texto en negrita '$1'",
  )
  t = t.replace(
    /(?<!el texto en )(?<!sin\s)negrita\s*[«"']([^»"']+)[»"']/gi,
    "el texto en negrita '$1'",
  )
  t = t.replace(
    /(?<!el texto en )(?:el\s+)?(?:texto\s+)?en\s+cursiva\s*[«"']([^»"']+)[»"']/gi,
    "el texto en cursiva '$1'",
  )
  t = t.replace(
    /(?<!el texto en )cursiva\s*[«"']([^»"']+)[»"']/gi,
    "el texto en cursiva '$1'",
  )
  t = t.replace(
    /(?<!el texto )(?:el\s+)?(?:texto\s+)?sin\s+negrita\s*[«"']([^»"']+)[»"']/gi,
    "el texto sin negrita '$1'",
  )

  // CSS / jerga de diseño
  t = t.replace(/font-weight\s*[:=]\s*['"]?bold['"]?/gi, "negrita")
  t = t.replace(/font-style\s*[:=]\s*['"]?italic['"]?/gi, "cursiva")
  t = t.replace(/\bfont-weight\s*[:=]\s*['"]?(?:400|normal)['"]?/gi, "sin negrita")
  t = t.replace(/\bfooter\b/gi, "pie de página")
  t = t.replace(/\bheader\b/gi, "cabecera")
  t = t.replace(/\bbreadcrumb\b/gi, "ruta de navegación")
  t = t.replace(/\blos\s+modales\b/gi, "las ventanas emergentes")
  t = t.replace(/\bel\s+modal\b/gi, "la ventana emergente")
  t = t.replace(/\bun\s+modal\b/gi, "una ventana emergente")
  t = t.replace(/\bmodales\b/gi, "ventanas emergentes")
  t = t.replace(/\bmodal\b/gi, "ventana emergente")
  t = t.replace(/\bCTA\b/g, "botón o llamado a la acción")
  t = t.replace(/\btooltip\b/gi, "texto al pasar el cursor")

  t = t.replace(
    /may[uú]sculas?\s+sostenidas?\s*[«"']([^»"']+)[»"']/gi,
    "texto en mayúsculas sostenidas '$1'",
  )

  return t.replace(/\s{2,}/g, " ").trim()
}
