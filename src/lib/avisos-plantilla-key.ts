/**
 * Clave de agrupación de avisos: mismo copy editorial aunque cambien
 * días, fechas u horas. Diferencias de palabras/concepto → claves distintas.
 */

/** Quita acentos para comparar plantillas. */
function fold(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

/**
 * Normaliza el texto plano a una plantilla: fechas/horas/días relativos
 * se sustituyen por tokens; se conservan el resto de palabras y conceptos.
 */
export function avisosPlantillaKey(textoPlano: string): string {
  let t = fold(textoPlano).toLowerCase()

  // Horas: 17:00 / 17:00:00 / 17:00 horas
  t = t.replace(
    /\b\d{1,2}:\d{2}(?::\d{2})?\s*(?:horas|hrs\.?)?/g,
    " «hora» ",
  )
  // Fechas numéricas: 26/08, 24/09/2025
  t = t.replace(/\b\d{1,2}\/\d{1,2}(?:\/\d{2,4})?\b/g, " «fecha» ")
  // Fechas en palabras: 28 de septiembre [de 2023]
  t = t.replace(
    /\b(?:0?[1-9]|[12]\d|3[01])\s+de\s+(?:enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)(?:\s+(?:de\s+)?\d{4})?/g,
    " «fecha» ",
  )
  // Días de la semana y relativos de calendario
  t = t.replace(
    /\b(?:lunes|martes|miercoles|jueves|viernes|sabado|domingo)\b/g,
    " «dia» ",
  )
  t = t.replace(/\b(?:manana|hoy|este|proximo|el dia)\b/g, " «rel» ")
  // Meses / años sueltos
  t = t.replace(
    /\b(?:enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)\b/g,
    " «mes» ",
  )
  t = t.replace(/\b20\d{2}\b/g, " «anio» ")

  // Colapsar espacios antes de patrones de ventana
  t = t.replace(/\s+/g, " ")

  // Ventanas horarias (misma idea operativa; flexible en espacios)
  t = t.replace(
    /a partir de las\s*«hora»( hasta las\s*«hora»)?/g,
    " «ventana» ",
  )
  t = t.replace(
    /desde las\s*«hora»( hasta las\s*«hora»)?/g,
    " «ventana» ",
  )
  t = t.replace(/a las\s*«hora»/g, " «ventana» ")

  // Anclas de calendario → un solo token de programación
  t = t.replace(
    /(?:programada para|programado(?: para)?)(?:\s*«rel»)?(?:\s*el)?(?:\s*«dia»)?(?:\s*«fecha»)?(?:\s*«ventana»)?/g,
    " «cuando» ",
  )
  t = t.replace(/(?:«rel»\s*)?«dia»(?:\s*«fecha»)?(?:\s*«ventana»)?/g, " «cuando» ")
  t = t.replace(/«fecha»(?:\s*«ventana»)?/g, " «cuando» ")
  t = t.replace(/«ventana»/g, " «cuando» ")

  // Ruido tipográfico / puntuación
  t = t.replace(/[^\w«»]+/g, " ")
  t = t.replace(/\s+/g, " ").trim()

  // Variantes menores de cierre / énfasis que no cambian el mensaje
  t = t
    .replace(/\bprofundamente\b/g, "")
    .replace(/\baproximadamente\b/g, "")
    .replace(/\bsaludos cordiales\b/g, "")
    .replace(/\bsaludos\b/g, "")
    .replace(/\s+/g, " ")
    .trim()

  return t
}
