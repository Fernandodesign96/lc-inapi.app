import { describe, expect, test } from "bun:test"

import {
  extractDominantTextColor,
  htmlToVistaRuns,
  vistaRunsToMarkedText,
} from "./avisos-propuesta-html"

describe("htmlToVistaRuns", () => {
  test("separa en líneas los bloques <p>, <h2> y <li>, y un <strong> seguido de <p>", () => {
    const html =
      '<div id="AvisoMantencionInapi" class="formularios"><strong>Importante: título</strong>' +
      "<p>Estimados usuarios y usuarias:</p><h2>Subtítulo</h2><ul><li>uno;</li><li>dos.</li></ul><hr><p>Cierre.</p></div>"
    expect(vistaRunsToMarkedText(htmlToVistaRuns(html))).toBe(
      "**Importante: título**\nEstimados usuarios y usuarias:\n**Subtítulo**\n• uno;\n• dos.\nCierre.",
    )
  })

  test("no confunde background-color con el color del texto", () => {
    const html =
      '<div style="background-color: #f8d7da; color: #491217;"><p>Texto</p></div>'
    const runs = htmlToVistaRuns(html).filter((r) => r.text.trim())
    expect(runs[0]?.color).toBe("#491217")
    expect(runs[0]?.highlight).toBeUndefined()
    expect(extractDominantTextColor(html)).toBe("#491217")
  })

  test("el color de un título hijo no se extiende al cuerpo", () => {
    const html =
      '<div><div style="text-align: left;"><strong style="color: #d64000;">Título</strong><p>Cuerpo</p></div></div>'
    const runs = htmlToVistaRuns(html).filter((r) => r.text.trim())
    expect(runs.find((r) => r.text === "Título")?.color).toBe("#d64000")
    expect(runs.find((r) => r.text === "Cuerpo")?.color).toBeUndefined()
  })

  test("<br/> sigue generando salto de línea", () => {
    const html = '<div style="color: Red;"><strong>Importante</strong><br/>Texto</div>'
    expect(vistaRunsToMarkedText(htmlToVistaRuns(html))).toBe("**Importante**\nTexto")
  })
})
