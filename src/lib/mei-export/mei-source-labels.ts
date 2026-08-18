/**
 * Expande citas del checklist (`RLC §7, IEW 5.2.1`) a documentos Colección A.
 * v2.1 depreca la sigla genérica CW; preferir IEW / IESD / RLC / MEI.
 */

export type SourceDocumentRef = {
  code: "RLC" | "CW" | "IEW" | "IESD" | "UI" | "MEI"
  documento: string
  nombre: string
}

const DOC_BY_CODE: Record<string, SourceDocumentRef> = {
  RLC: {
    code: "RLC",
    documento: "lenguaje-claro-recomendaciones.pdf",
    nombre: "Recomendaciones de Lenguaje Claro",
  },
  /** Histórico v1.1 — mapear a Meta MEI si aparece en auditorías antiguas. */
  CW: {
    code: "CW",
    documento: "meta-mei.pdf",
    nombre: "Meta MEI (marco legado citado como CW en v1.1)",
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
  MEI: {
    code: "MEI",
    documento: "meta-mei.pdf",
    nombre: "Meta MEI (PMG-MEI / compromiso institucional)",
  },
  UI: {
    code: "UI",
    documento: "ui-kit-gobierno-3.0.1.pdf",
    nombre: "UI Kit Gobierno",
  },
}

/** Tokens de código documental en el campo `source` del checklist. */
const CODE_PATTERN = /\b(RLC|CW|IEW|IESD|MEI|UI)\b/g

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
    "Checklist Editorial INAPI v2.1 cita IEW, IESD, RLC y MEI (sin sigla genérica CW). " +
    "IEW = instrumento-evaluacion-sitios-web.pdf; IESD = instrumento-evaluacion-servicios-digitales-transaccionales.pdf; " +
    "RLC = lenguaje-claro-recomendaciones.pdf; MEI = meta-mei.pdf. " +
    "Auditorías v1.1 pueden conservar citas CW (legado → meta-mei.pdf)."
  )
}
