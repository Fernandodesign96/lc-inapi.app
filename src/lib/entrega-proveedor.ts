/**
 * Proyección Word proveedor (C-2026-11-17a/b).
 * 5 columnas fijas; header/footer se consolidan; el JSON de auditoría no cambia.
 */

export const PROVEEDOR_HEADERS = [
  "N° de solicitud",
  "Link de referencia",
  "Contenido original",
  "Contenido a modificar/agregar",
  "Observaciones",
] as const

export type PerfilWordCorrecciones = "proveedor" | "respaldo"

export type ComponenteSitio = "header" | "footer" | null

export type FilaSitioEntrega = {
  url: string
  original: string
  propuesto: string
  ubicacion_pantalla?: string
  patron_sistema?: boolean
  criterio_id: string
  linea: string
  motivo?: string
}

export type FilaProveedor = {
  n: number
  urls: string[]
  original: string
  propuesto: string
  observaciones: string
  componente: ComponenteSitio
}

const ORIGINAL_INSERCION =
  /^\s*(\(sin |\(ausencia|\(única|\(no existe|$)/i

const HEADER_RE =
  /menú|header|cabecera|navbar|lupa|buscar y tramitar|contraste|link externo|box-login|atajo/i
const FOOTER_RE =
  /pie de página|footer|política de privacidad|©|actualizado|descargable/i

export function originalEsInsercion(original: string): boolean {
  const t = original.trim()
  if (t.length === 0) return true
  return ORIGINAL_INSERCION.test(t)
}

export function originalParaProveedor(original: string): string {
  if (originalEsInsercion(original)) return ""
  return original.trim()
}

export function componenteSitio(fila: FilaSitioEntrega): ComponenteSitio {
  const blob = `${fila.ubicacion_pantalla ?? ""} ${fila.linea}`
  if (FOOTER_RE.test(blob)) return "footer"
  if (HEADER_RE.test(blob) || fila.patron_sistema) return "header"
  return null
}

function verboAccion(original: string, propuesto: string): string {
  const p = propuesto.trim().toLowerCase()
  if (/^elimin/.test(p) || /^quitar/.test(p) || /^sacar /.test(p)) {
    return "Eliminar"
  }
  if (originalEsInsercion(original)) return "Insertar"
  return "Actualizar"
}

export function observacionesProveedor(fila: FilaSitioEntrega): string {
  const verbo = verboAccion(fila.original, fila.propuesto)
  const ubi = (fila.ubicacion_pantalla ?? "").trim()
  const text = ubi ? `${verbo}. ${ubi}.` : `${verbo}.`
  return text
    .replace(/\bLC-[A-Z0-9.-]+/gi, "")
    .replace(/Hito \d+\s*-\s*Criterio \d+/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim()
}

export type HighlightSeg = { text: string; yellow: boolean }

const ETIQUETA_NUEVO =
  /^(Título:|Desplegable:|Bajada:|Añadir |Encargo a Comunicaciones:)/i

export function propuestoHighlightSegments(
  original: string,
  propuesto: string,
): HighlightSeg[] {
  const lines = propuesto.replace(/\r\n/g, "\n").split("\n")
  const allNew = originalEsInsercion(original)
  const segs: HighlightSeg[] = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? ""
    const yellow = allNew || ETIQUETA_NUEVO.test(line.trim())
    const suffix = i === lines.length - 1 ? "" : "\n"
    segs.push({ text: `${line}${suffix}`, yellow })
  }
  if (segs.length === 0) segs.push({ text: propuesto, yellow: allNew })
  return segs
}

function claveConsolidado(fila: FilaSitioEntrega): string {
  const kind = componenteSitio(fila)
  if (kind) {
    return `${kind}::${fila.propuesto.trim().toLowerCase()}`
  }
  return `url::${fila.url}::${fila.linea}::${fila.criterio_id}`
}

export function consolidarFilasSitio(
  filas: FilaSitioEntrega[],
  consolidado: boolean,
): FilaProveedor[] {
  if (!consolidado) {
    return filas.map((f, i) => ({
      n: i + 1,
      urls: [f.url],
      original: originalParaProveedor(f.original),
      propuesto: f.propuesto,
      observaciones: observacionesProveedor(f),
      componente: componenteSitio(f),
    }))
  }

  const order: string[] = []
  const map = new Map<string, FilaSitioEntrega & { urls: string[] }>()
  for (const f of filas) {
    const k = claveConsolidado(f)
    const prev = map.get(k)
    if (!prev) {
      map.set(k, { ...f, urls: [f.url] })
      order.push(k)
    } else if (!prev.urls.includes(f.url)) {
      prev.urls.push(f.url)
    }
  }
  return order.map((k, i) => {
    const f = map.get(k)!
    return {
      n: i + 1,
      urls: f.urls,
      original: originalParaProveedor(f.original),
      propuesto: f.propuesto,
      observaciones: observacionesProveedor(f),
      componente: componenteSitio(f),
    }
  })
}

export function linksReferencia(urls: string[]): string {
  return urls.join("\n")
}

/** Tres filas canónicas (Caso 1 hover, Caso 2 inserción, Caso 7 footer PDF). */
export function fixtureTresFilasProveedor(): FilaSitioEntrega[] {
  return [
    {
      url: "https://www.inapi.cl/",
      original: "Conoce más",
      propuesto: 'title="Qué es la Propiedad Intelectual e Industrial"',
      ubicacion_pantalla: "Menú de navegación › ítem «Conoce más»",
      patron_sistema: true,
      criterio_id: "LC-5.2.4-01",
      linea: "atajo menú Conoce más",
    },
    {
      url: "https://www.inapi.cl/",
      original: "(no existe en pantalla)",
      propuesto:
        "Encargo a Comunicaciones: frase del hero que diga qué, cómo, dónde, cuándo y para quién. No inventar el copy.",
      ubicacion_pantalla: "Portada › banner principal (hero)",
      criterio_id: "LC-1.1.2-03",
      linea: "hero home",
    },
    {
      url: "https://www.inapi.cl/acerca-de",
      original: "Política de privacidad",
      propuesto: "Política de privacidad (PDF, 245 KB)",
      ubicacion_pantalla: "Pie de página › enlace «Política de privacidad»",
      patron_sistema: true,
      criterio_id: "LC-1.2.4-07",
      linea: "footer PDF",
    },
  ]
}
