/**
 * Construye HTML propuesto (copy-paste TI) y una vista tipográfica
 * (cómo se vería en pantalla) a partir del HTML original + texto propuesto.
 */

export type VistaRun = {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  /** Color CSS/hex del texto (si blanco → se usa highlight). */
  color?: string
  /** Fondo de contraste cuando el texto es blanco/casi blanco. */
  highlight?: string
  link?: string
  bullet?: boolean
}

const WHITE_CONTRAST_BG = "FFD54F" // amarillo contraste en Word/PDF

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
}

function isNearWhite(color: string | undefined): boolean {
  if (!color) return false
  const c = color.trim().toLowerCase()
  if (c === "white" || c === "#fff" || c === "#ffffff" || c === "rgb(255,255,255)") {
    return true
  }
  const hex = c.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (!hex) return false
  let h = hex[1]!
  if (h.length === 3) h = h.split("").map((ch) => ch + ch).join("")
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return (r + g + b) / 3 >= 245
}

function normalizeCssColor(raw: string | undefined): string | undefined {
  if (!raw) return undefined
  const c = raw.trim()
  if (!c) return undefined
  if (c.toLowerCase() === "red") return "#FF0000"
  if (c.startsWith("#") || c.startsWith("rgb")) return c
  return c
}

/** Extrae color del style inline más cercano en el HTML original. */
export function extractDominantTextColor(html: string): string | undefined {
  const m = html.match(COLOR_RE)
  return normalizeCssColor(m?.[1])
}

/** `color:` del texto; no confunde `background-color` ni `border-*-color`. */
const COLOR_RE = /(?:^|[;"'\s])color\s*:\s*([^;"']+)/i

/** Etiquetas de bloque: al cerrarse, la vista empieza una línea nueva. */
const BLOCK_TAGS = ["p", "div", "li", "ul", "ol", "h1", "h2", "h3", "h4", "h5", "h6"]
const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"]

/**
 * Envuelve el texto propuesto en la misma cáscara HTML del aviso original
 * (conserva id/class/style del contenedor; reemplaza el interior visible).
 */
export function buildPropuestaHtml(
  originalHtml: string,
  textoPropuestoPlano: string,
): string {
  const color = extractDominantTextColor(originalHtml) ?? "Red"
  const idMatch = originalHtml.match(/\bid\s*=\s*["']([^"']+)["']/i)
  const classMatch = originalHtml.match(/\bclass\s*=\s*["']([^"']+)["']/i)
  const idAttr = idMatch ? ` id="${idMatch[1]}"` : ""
  const classAttr = classMatch ? ` class="${classMatch[1]}"` : ' class="formularios"'

  const lines = textoPropuestoPlano
    .split(/(?<=\.)\s+/)
    .map((l) => l.trim())
    .filter(Boolean)

  // Primera frase corta tipo «Importante.» → <strong>
  let body = ""
  if (lines.length > 0 && /^importante\.?$/i.test(lines[0]!.replace(/\s+/g, " ").trim())) {
    body += `<strong>Importante</strong><br/>`
    lines.shift()
  } else if (/^importante\b/i.test(textoPropuestoPlano)) {
    body += `<strong>Importante</strong><br/>`
    const rest = textoPropuestoPlano.replace(/^importante\.?\s*/i, "")
    body += escapeHtml(rest).replace(/\n/g, "<br/>")
    return `<div${idAttr}${classAttr}><div style="text-align: left; color: ${color};">${body}</div></div>`
  }

  body += lines.map((l) => escapeHtml(l)).join("<br/>")
  // Enlaces literales http(s) → <a>
  body = body.replace(
    /(https?:\/\/[^\s<]+)/g,
    '<a href="$1">$1</a>',
  )

  return `<div${idAttr}${classAttr}><div style="text-align: left; color: ${color};"> ${body} </div></div>`
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

/**
 * Parsea un HTML simple de aviso a runs tipográficos para la vista en pantalla.
 */
export function htmlToVistaRuns(html: string): VistaRun[] {
  const runs: VistaRun[] = []
  // Color base = solo el del contenedor exterior; los hijos aportan el suyo vía `stack`.
  const firstTag = html.match(/<[a-z0-9]+([^>]*)>/i)
  const outerColor = normalizeCssColor(firstTag?.[1]?.match(COLOR_RE)?.[1])

  // Tokenizar tags relevantes
  const tokenRe =
    /<\/?([a-z0-9]+)([^>]*)>|([^<]+)/gi
  const stack: { tag: string; color?: string; href?: string }[] = []

  const currentStyle = () => {
    let bold = false
    let italic = false
    let underline = false
    let color = outerColor
    let link: string | undefined
    for (const s of stack) {
      if (s.tag === "strong" || s.tag === "b" || HEADING_TAGS.includes(s.tag)) bold = true
      if (s.tag === "em" || s.tag === "i") italic = true
      if (s.tag === "u") underline = true
      if (s.tag === "a") {
        underline = true
        link = s.href
      }
      if (s.color) color = s.color
    }
    const highlight = isNearWhite(color) ? WHITE_CONTRAST_BG : undefined
    return { bold, italic, underline, color, link, highlight }
  }

  let m: RegExpExecArray | null
  const src = html.replace(/<\/?br\s*\/?>/gi, "\n")
  while ((m = tokenRe.exec(src)) !== null) {
    if (m[1]) {
      const tag = m[1].toLowerCase()
      const attrs = m[2] ?? ""
      const closing = /^<\//.test(m[0])
      if (closing) {
        for (let i = stack.length - 1; i >= 0; i--) {
          if (stack[i]!.tag === tag) {
            stack.splice(i, 1)
            break
          }
        }
        if (BLOCK_TAGS.includes(tag)) runs.push({ text: "\n" })
        continue
      }
      if (tag === "hr") {
        runs.push({ text: "\n" })
        continue
      }
      if (
        ["div", "span", "p", "strong", "b", "em", "i", "u", "a", "li", "ul", "ol", ...HEADING_TAGS].includes(tag)
      ) {
        // Un bloque que abre después de texto en línea (p. ej. <strong> título + <p>) empieza línea nueva
        if (BLOCK_TAGS.includes(tag) && tag !== "li") runs.push({ text: "\n" })
        const colorM = attrs.match(COLOR_RE)
        const hrefM = attrs.match(/href\s*=\s*["']([^"']+)["']/i)
        stack.push({
          tag,
          color: normalizeCssColor(colorM?.[1]),
          href: hrefM?.[1],
        })
        if (tag === "li") {
          const st = currentStyle()
          runs.push({ text: "• ", bullet: true, ...st })
        }
      }
      continue
    }
    const raw = decodeEntities(m[3] ?? "")
    if (!raw) continue
    const st = currentStyle()
    // Conservar saltos; colapsar espacios horizontales
    const parts = raw.split(/(\n+)/)
    for (const part of parts) {
      if (!part) continue
      if (/^\n+$/.test(part)) {
        runs.push({ text: "\n", ...st })
      } else {
        const text = part.replace(/[ \t]+/g, " ")
        if (text.trim().length === 0 && text.length > 0) {
          runs.push({ text: " ", ...st })
        } else if (text.length > 0) {
          runs.push({ text, ...st })
        }
      }
    }
  }

  return mergeRuns(collapseLineBreaks(runs))
}

/** Un solo salto entre bloques; sin saltos ni espacios sueltos al inicio o al final. */
function collapseLineBreaks(runs: VistaRun[]): VistaRun[] {
  const out: VistaRun[] = []
  for (const r of runs) {
    const prev = out[out.length - 1]
    if (r.text === "\n") {
      if (!prev || prev.text === "\n") continue
      // Quitar espacios en blanco que quedaron antes del salto
      while (out.length > 0 && out[out.length - 1]!.text.trim() === "" && out[out.length - 1]!.text !== "\n") out.pop()
      if (out.length === 0 || out[out.length - 1]!.text === "\n") continue
      out.push(r)
      continue
    }
    if ((!prev || prev.text === "\n") && r.text.trim() === "") continue
    out.push(r)
  }
  while (out.length > 0 && (out[out.length - 1]!.text === "\n" || out[out.length - 1]!.text.trim() === "")) out.pop()
  return out
}

function mergeRuns(runs: VistaRun[]): VistaRun[] {
  const out: VistaRun[] = []
  for (const r of runs) {
    const prev = out[out.length - 1]
    if (
      prev &&
      prev.bold === r.bold &&
      prev.italic === r.italic &&
      prev.underline === r.underline &&
      prev.color === r.color &&
      prev.highlight === r.highlight &&
      prev.link === r.link &&
      !prev.bullet &&
      !r.bullet &&
      prev.text !== "\n" &&
      r.text !== "\n"
    ) {
      prev.text += r.text
    } else {
      out.push({ ...r })
    }
  }
  return out
}

/** Vista tipográfica como texto con marcas legibles (Excel / fallback). */
export function vistaRunsToMarkedText(runs: VistaRun[]): string {
  let out = ""
  for (const r of runs) {
    if (r.text === "\n") {
      out += "\n"
      continue
    }
    let t = r.text
    if (r.bold) t = `**${t}**`
    if (r.italic) t = `_${t}_`
    if (r.underline) t = `__${t}__`
    if (r.link) t = `[${t}](${r.link})`
    if (r.highlight) t = `⟦${t}⟧` // texto blanco con contraste
    out += t
  }
  return out.replace(/\n{3,}/g, "\n\n").trim()
}

/**
 * Contenido de la celda «Contenido a modificar/agregar»:
 * HTML propuesto + vista tipográfica marcada.
 */
export function formatContenidoModificarCelda(
  propuestoHtml: string,
  vistaMarked: string,
): string {
  return (
    `${propuestoHtml.trim()}\n\n` +
    `— Vista en pantalla —\n` +
    `${vistaMarked}`
  )
}

export function buildContenidoModificarFromParts(
  originalHtml: string,
  textoPropuestoPlano: string,
): { propuesto_html: string; celda: string; vista_marked: string } {
  const propuesto_html = buildPropuestaHtml(originalHtml, textoPropuestoPlano)
  const vista_marked = vistaRunsToMarkedText(htmlToVistaRuns(propuesto_html))
  return {
    propuesto_html,
    vista_marked,
    celda: formatContenidoModificarCelda(propuesto_html, vista_marked),
  }
}
