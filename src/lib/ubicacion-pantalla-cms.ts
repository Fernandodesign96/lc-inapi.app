/**
 * Ubicación en pantalla para entrega CMS (UI · PDF · Excel).
 * Debe ser ruta humana zona › elemento › literal — nunca una sola palabra vaga.
 */

const DASH = "—"

/** Texto de entrega cuando el JSON usa `(ausencia)`. */
export const TEXTO_SIN_REQUISITO =
  "No hay texto que cumpla con este requisito"

const FALLBACK_SIN_ZONA =
  "Pantalla evaluada › zona del contenido revisado › precisar el bloque o enlace con su rótulo visible"

/** True si la ubicación no sirve a Equipo UX (imprecisa, corta o genérica). */
export function esUbicacionPantallaVaga(raw: string): boolean {
  const t = raw.trim()
  if (!t || t === DASH) return true
  const lower = t.toLowerCase()

  if (/ubicaci[oó]n exacta no registrada/i.test(t)) return true
  if (/revisi[oó]n visual pendiente/i.test(t)) return true
  if (/^en la p[aá]gina\b/i.test(t)) return true
  if (/^pantalla evaluada\b/i.test(t) && !/›/.test(t)) return true

  // Una sola pieza sin ruta ni cita
  if (
    /^(el|la|los|las)\s+(enlace|bloque|men[uú]|bot[oó]n|secci[oó]n|modal|tarjeta|p[aá]rrafo)(\s+\w+){0,3}$/i.test(
      t,
    )
  ) {
    return true
  }
  if (/^el bloque de accesos(\s+r[aá]pidos)?$/i.test(t)) return true
  if (/^(enlace|bloque|men[uú]|footer|header|modal)$/i.test(t)) return true

  const hasPath = /[›>]/.test(t) || /\s[—–-]\s/.test(t)
  const hasQuote = /[«"']/.test(t)
  const words = t.split(/\s+/).filter(Boolean).length
  if (!hasPath && !hasQuote && words <= 4) return true
  if (t.length < 22 && !hasQuote) return true

  return false
}

function clipLiteral(s: string, max = 72): string {
  const t = s.replace(/\s+/g, " ").trim()
  if (t.length <= max) return t
  return `${t.slice(0, max - 1).trim()}…`
}

function primerFragmentoTexto(texto: string): string {
  if (!texto || texto === DASH || texto === TEXTO_SIN_REQUISITO) return ""
  if (texto === "(ausencia)") return ""
  const first = texto.split(/\s*[·|]\s*/)[0]?.trim() ?? texto
  return clipLiteral(first)
}

function detectarZonaBase(narracion: string): string | null {
  const n = narracion.toLowerCase()
  if (/modal|ventana\s+emergente/.test(n)) {
    const m = narracion.match(
      /(?:modal|ventana\s+emergente)\s*[«"']([^»"']+)[»"']/i,
    )
    if (m?.[1]) return `Ventana emergente «${m[1].trim()}»`
    return "Ventana emergente de la página"
  }
  if (/pie\s+de\s+p[aá]gina|footer|\bpie\b/.test(n)) return "Pie de página"
  if (/cabecera|encabezado|header|men[uú]\s+(superior|global|principal)/.test(n)) {
    return "Cabecera"
  }
  if (/\bhero\b|portada|parte\s+superior|zona\s+superior/.test(n)) {
    return "Portada › zona superior destacada"
  }
  if (/cuerpo|secci[oó]n\s+de\s+noticias|novedades/.test(n)) return "Cuerpo"
  return null
}

/**
 * Construye una ruta CMS detallada a partir del comentario/motivo y el texto citado.
 */
export function construirUbicacionDetallada(
  narracion: string,
  textoEnPantalla: string,
): string | null {
  const n = narracion.trim()
  if (!n) return null

  const lit = primerFragmentoTexto(textoEnPantalla)
  const partes: string[] = []

  // Título principal / zona destacada de portada
  if (/\bH1\b|t[ií]tulo\s+(?:principal|H1)|hero|título\s+principal/i.test(n)) {
    const quote =
      n.match(
        /(?:H1|t[ií]tulo\s+(?:principal|H1)|título\s+principal)[^\n«"']{0,40}[«"']([^»"']+)[»"']/i,
      )?.[1] ?? lit
    const label = quote
      ? `título principal «${clipLiteral(quote)}»`
      : "título principal"
    return `Portada › zona superior destacada › ${label}`
  }

  // Ventana emergente + pie (contactos / Dónde estamos)
  const modalQ = n.match(
    /(?:modal|ventana\s+emergente)\s*[«"']([^»"']+)[»"']/i,
  )?.[1]
  const bloqueDonde = /bloque\s*[«"']D[oó]nde estamos[»"']/i.test(n)
  if (modalQ && bloqueDonde) {
    return `Ventana emergente «${modalQ.trim()}» (contacto) y Pie de página › bloque «Dónde estamos» (teléfono, correo y dirección institucionales)`
  }
  if (modalQ) {
    const extra = lit ? ` › texto «${lit}»` : ""
    return `Ventana emergente «${modalQ.trim()}»${extra}`
  }

  // Bloque de accesos rápidos
  if (/bloque\s+de\s+accesos(\s+r[aá]pidos)?/i.test(n) || /accesos\s+r[aá]pidos/i.test(n)) {
    return "Portada › bloque de accesos rápidos (enlaces Estadísticas, Notificaciones diarias, Preguntas frecuentes, Datos abiertos, noticias y guías de registro)"
  }

  // Enlace «…» (con zona)
  const enlaceLit =
    n.match(/enlace(?:\s+a)?\s*[«"']([^»"']+)[»"']/i)?.[1] ??
    (/\benlace\b/i.test(n) && lit ? lit : null)
  if (enlaceLit) {
    const zona =
      detectarZonaBase(n)?.replace(
        /^Portada › zona superior destacada$/,
        "Portada",
      ) ?? (/pie|footer/i.test(n) ? "Pie de página" : null) ?? "Pie de página"
    const zonaClean = zona.startsWith("Modal") || zona.startsWith("Ventana")
      ? "Pie de página"
      : zona
    return `${zonaClean} › enlace «${clipLiteral(enlaceLit)}»`
  }

  // Bloque «…»
  const bloqueLit = n.match(/bloque\s*[«"']([^»"']+)[»"']/i)?.[1]
  if (bloqueLit) {
    const zona = detectarZonaBase(n) ?? "Pie de página"
    const zonaClean =
      zona.startsWith("Modal") || zona.startsWith("Ventana")
        ? "Pie de página"
        : zona.replace(/^Portada › zona superior destacada$/, "Portada")
    return `${zonaClean} › bloque «${clipLiteral(bloqueLit)}»`
  }

  // Pie + nombre / RUT / institucional
  if (/pie\s+de\s+p[aá]gina|footer|\ben el pie\b/i.test(n)) {
    if (/RUT|instituci|nombre|autor[ií]a|D[oó]nde estamos/i.test(n) || lit) {
      const detail = /D[oó]nde estamos/i.test(n)
        ? "bloque «Dónde estamos» (nombre institucional y RUT)"
        : lit
          ? `texto institucional «${lit}»`
          : "bloque de identificación institucional"
      return `Pie de página › ${detail}`
    }
    return lit
      ? `Pie de página › junto al texto «${lit}»`
      : "Pie de página › bloque de contenidos del pie"
  }

  // Cabecera / menú
  if (/cabecera|men[uú]\s+(superior|global|principal)|encabezado/i.test(n)) {
    return lit
      ? `Cabecera › menú o logo › texto «${lit}»`
      : "Cabecera › menú superior o logo institucional"
  }

  // Noticias / cuerpo
  if (/noticia|novedades|p[aá]rrafo/i.test(n)) {
    return lit
      ? `Cuerpo › sección de novedades › texto «${lit}»`
      : "Cuerpo › sección de novedades"
  }

  const zona = detectarZonaBase(n)
  if (zona && lit) {
    partes.push(zona, `junto al texto «${lit}»`)
    return partes.join(" › ")
  }
  if (zona) return `${zona} › (completar bloque o enlace citado en el comentario)`

  return null
}

function normalizarSeparadoresUbicacion(s: string): string {
  return s
    .replace(/\s*[—–]\s*/g, " › ")
    .replace(/\s*>\s*/g, " › ")
    .replace(/\s*›\s*/g, " › ")
    .replace(/\s+/g, " ")
    .trim()
}

/** Si la ubicación nombra zona pero es corta, añade el literal del texto. */
function enriquecerUbicacionParcial(
  ubi: string,
  textoEnPantalla: string,
): string | null {
  if (!esUbicacionPantallaVaga(ubi)) return null
  if (
    !/(men[uú]|pie(?:\s+de\s+p[aá]gina)?|cabecera|modal|cuerpo|portada|footer|header|formulario|secci[oó]n|tarjeta|bloque|enlace)/i.test(
      ubi,
    )
  ) {
    return null
  }
  // Demasiado vago para enriquecer («el enlace», «el bloque»)
  if (/^(el|la|los|las)\s+(enlace|bloque)\b/i.test(ubi.trim())) return null

  const lit = primerFragmentoTexto(textoEnPantalla)
  const base = normalizarSeparadoresUbicacion(ubi)
  if (lit) return `${base} › texto «${lit}»`
  return `${base} › elemento visible a corregir`
}

/**
 * Ubicación para entrega: rechaza vaguedades; prioriza JSON bueno, luego narración.
 */
export function resolverUbicacionEnPantalla(
  textoEnPantalla: string,
  explicit: string | undefined,
  narracion: string,
): string {
  const texto = textoEnPantalla.trim()
  const esAusencia =
    texto === "(ausencia)" || texto === TEXTO_SIN_REQUISITO
  const tieneTexto = Boolean(texto) && texto !== DASH && !esAusencia

  const explicitNorm = explicit?.trim()
    ? normalizarSeparadoresUbicacion(explicit.trim())
    : ""

  // Sin texto ni ausencia: no inventar ubicación (salvo que el JSON ya traiga una ruta buena).
  if (!tieneTexto && !esAusencia) {
    if (explicitNorm && !esUbicacionPantallaVaga(explicitNorm)) return explicitNorm
    return DASH
  }

  if (explicitNorm && !esUbicacionPantallaVaga(explicitNorm)) {
    return explicitNorm
  }

  const enriquecida = explicitNorm
    ? enriquecerUbicacionParcial(explicitNorm, texto)
    : null
  if (enriquecida && !esUbicacionPantallaVaga(enriquecida)) {
    return enriquecida
  }

  const desdeNarracion = construirUbicacionDetallada(narracion, texto)
  if (desdeNarracion) {
    const norm = normalizarSeparadoresUbicacion(desdeNarracion)
    if (!esUbicacionPantallaVaga(norm)) return norm
  }

  // Ausencia: igual debe decir dónde se buscó
  if (esAusencia) {
    const desdeAusencia = construirUbicacionDetallada(narracion, "")
    if (desdeAusencia && !esUbicacionPantallaVaga(desdeAusencia)) {
      return normalizarSeparadoresUbicacion(desdeAusencia)
    }
  }

  const zona = detectarZonaBase(narracion)
  const lit = primerFragmentoTexto(texto)
  if (zona && lit) {
    return normalizarSeparadoresUbicacion(`${zona} › junto al texto «${lit}»`)
  }
  if (zona) {
    return normalizarSeparadoresUbicacion(
      `${zona} › elemento visible evaluado`,
    )
  }
  if (lit) {
    return `Cuerpo › junto al texto «${lit}»`
  }
  return FALLBACK_SIN_ZONA
}

/** Presentación de Texto en pantalla para UI/PDF/Excel. */
export function presentarTextoEnPantallaEntrega(raw: string): string {
  const t = raw.trim()
  if (
    t === "(ausencia)" ||
    /^\(ausencia\b/i.test(t) ||
    /^\(sin fecha de actualizaci[oó]n visible\)$/i.test(t) ||
    /^\(no existe en pantalla\)$/i.test(t) ||
    /^no hay texto que cumpla con este requisito$/i.test(t)
  ) {
    return TEXTO_SIN_REQUISITO
  }
  return raw
}
