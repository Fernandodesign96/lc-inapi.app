import { describe, expect, test } from "bun:test"

import { normalizarLenguajeTipografiaCms } from "./lenguaje-tipografia-cms"

describe("normalizarLenguajeTipografiaCms", () => {
  test("títulos en lenguaje claro (sin H1/H2/H3)", () => {
    expect(normalizarLenguajeTipografiaCms('H1 «Marcas»')).toBe(
      "título principal 'Marcas'",
    )
    expect(
      normalizarLenguajeTipografiaCms(
        'El título principal de la página H1 "Observancia"',
      ),
    ).toBe("título principal 'Observancia'")
    expect(normalizarLenguajeTipografiaCms("subtítulo H2 «Cómo solicitar»")).toBe(
      "subtítulo 'Cómo solicitar'",
    )
    expect(normalizarLenguajeTipografiaCms("H3 'Datos del trámite'")).toBe(
      "título de apartado 'Datos del trámite'",
    )
    expect(normalizarLenguajeTipografiaCms("título H1 'Marcas'")).toBe(
      "título principal 'Marcas'",
    )
  })

  test("alineación sin inglés técnico", () => {
    expect(
      normalizarLenguajeTipografiaCms("El bloque está alineado a la izquierda"),
    ).toBe("El bloque está Alineado a la izquierda")
    expect(normalizarLenguajeTipografiaCms("Párrafo justificado en columna")).toBe(
      "Párrafo Justificado en columna",
    )
    expect(
      normalizarLenguajeTipografiaCms(
        "Alineado a la izquierda (align left) ya ok",
      ),
    ).toBe("Alineado a la izquierda ya ok")
  })

  test("negrita y cursiva sin (bold)/(italic)", () => {
    expect(normalizarLenguajeTipografiaCms('texto en negrita «INAPI»')).toBe(
      "el texto en negrita 'INAPI'",
    )
    expect(normalizarLenguajeTipografiaCms("en cursiva «aviso»")).toBe(
      "el texto en cursiva 'aviso'",
    )
    expect(normalizarLenguajeTipografiaCms("sin negrita «solo cuerpo»")).toBe(
      "el texto sin negrita 'solo cuerpo'",
    )
    expect(
      normalizarLenguajeTipografiaCms("el texto en negrita (bold) 'INAPI'"),
    ).toBe("el texto en negrita 'INAPI'")
  })

  test("jerga de diseño → palabras claras", () => {
    expect(normalizarLenguajeTipografiaCms("en el footer del sitio")).toBe(
      "en el pie de página del sitio",
    )
    expect(normalizarLenguajeTipografiaCms("abrir el modal de contacto")).toBe(
      "abrir la ventana emergente de contacto",
    )
    expect(
      normalizarLenguajeTipografiaCms("Portada › zona superior (hero)"),
    ).toBe("Portada › zona superior destacada")
  })

  test("no altera guion ni literales simples", () => {
    expect(normalizarLenguajeTipografiaCms("—")).toBe("—")
    expect(normalizarLenguajeTipografiaCms("Marcas")).toBe("Marcas")
  })
})
