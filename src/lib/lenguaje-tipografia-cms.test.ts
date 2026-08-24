import { describe, expect, test } from "bun:test"

import { normalizarLenguajeTipografiaCms } from "./lenguaje-tipografia-cms"

describe("normalizarLenguajeTipografiaCms", () => {
  test("títulos H1/H2/H3 con cita", () => {
    expect(normalizarLenguajeTipografiaCms('H1 «Marcas»')).toBe(
      "título H1 'Marcas'",
    )
    expect(
      normalizarLenguajeTipografiaCms(
        'El título principal de la página H1 "Observancia"',
      ),
    ).toBe("título H1 'Observancia'")
    expect(normalizarLenguajeTipografiaCms("subtítulo H2 «Cómo solicitar»")).toBe(
      "subtítulo h2 'Cómo solicitar'",
    )
    expect(normalizarLenguajeTipografiaCms("H3 'Datos del trámite'")).toBe(
      "subtítulo h3 'Datos del trámite'",
    )
  })

  test("alineación y justificación", () => {
    expect(
      normalizarLenguajeTipografiaCms("El bloque está alineado a la izquierda"),
    ).toBe(
      "El bloque está Alineado a la izquierda (align left)",
    )
    expect(normalizarLenguajeTipografiaCms("Párrafo justificado en columna")).toBe(
      "Párrafo Justificado (justify) en columna",
    )
    expect(
      normalizarLenguajeTipografiaCms(
        "Alineado a la izquierda (align left) ya ok",
      ),
    ).toBe("Alineado a la izquierda (align left) ya ok")
  })

  test("negrita, cursiva y sin negrita", () => {
    expect(
      normalizarLenguajeTipografiaCms('texto en negrita «INAPI»'),
    ).toBe("el texto en negrita (bold) 'INAPI'")
    expect(normalizarLenguajeTipografiaCms("en cursiva «aviso»")).toBe(
      "el texto en cursiva (italic) 'aviso'",
    )
    expect(normalizarLenguajeTipografiaCms("sin negrita «solo cuerpo»")).toBe(
      "el texto sin negrita 'solo cuerpo'",
    )
  })

  test("no altera guion ni literales simples", () => {
    expect(normalizarLenguajeTipografiaCms("—")).toBe("—")
    expect(normalizarLenguajeTipografiaCms("Marcas")).toBe("Marcas")
  })
})
