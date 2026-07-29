/**
 * Expande citas del checklist (`RLC §7, CW 5.2.1`) a documentos Colección A.
 * CW = marco conceptual Meta MEI (no existe calidad-web-2.0.pdf).
 */

export type SourceDocumentRef = {
  code: "RLC" | "CW" | "IEW" | "IESD" | "UI"
  documento: string
  nombre: string
}

const DOC_BY_CODE: Record<string, SourceDocumentRef> = {
  RLC: {
    code: "RLC",
    documento: "lenguaje-claro-recomendaciones.pdf",
    nombre: "Recomendaciones de Lenguaje Claro",
  },
  CW: {
    code: "CW",
    documento: "meta-mei.pdf",
    nombre: "Meta MEI (marco Calidad Web / servicios digitales)",
  },
  IEW: {
    code: "IEW",
    documento: "instrumento-evaluacion-sitios-web.pdf",
    nombre: "Instrumento de evaluación de sitios web",
  },
  IESD: {
    code: "IESD",
    documento: "instrumento-evaluacion-servicios-digitales-transaccionales.pdf",
    nombre: "Instrumento de evaluación de servicios digitales",
  },
  UI: {
    code: "UI",
    documento: "ui-kit-gobierno-3.0.1.pdf",
    nombre: "UI Kit Gobierno",
  },
}

/** Tokens de código documental en el campo `source` del checklist. */
const CODE_PATTERN = /\b(RLC|CW|IEW|IESD|UI)\b/g

export function parseSourceCodes(sourceCita: string): SourceDocumentRef[] {
  const seen = new Set<string>()
  const out: SourceDocumentRef[] = []
  for (const match of sourceCita.matchAll(CODE_PATTERN)) {
    const code = match[1]
    if (seen.has(code)) continue
    seen.add(code)
    const ref = DOC_BY_CODE[code]
    if (ref) out.push(ref)
  }
  return out
}

export function documentosLabelFromSource(sourceCita: string): string {
  const refs = parseSourceCodes(sourceCita)
  if (refs.length === 0) return sourceCita
  return refs.map((r) => `${r.nombre} (${r.documento})`).join(" · ")
}

export function sourceNotaMetaMei(): string {
  return (
    "Las citas CW del checklist editorial INAPI v1.1 son referencias conceptuales al marco " +
    "de calidad web; el PDF principal de Colección A es meta-mei.pdf (no existe calidad-web-2.0.pdf). " +
    "RLC = lenguaje-claro-recomendaciones.pdf."
  )
}
