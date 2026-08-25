import { describe, expect, test } from "bun:test"

import {
  construirUbicacionDetallada,
  esUbicacionPantallaVaga,
  presentarTextoEnPantallaEntrega,
  resolverUbicacionEnPantalla,
  TEXTO_SIN_REQUISITO,
} from "./ubicacion-pantalla-cms"

describe("presentarTextoEnPantallaEntrega", () => {
  test("reemplaza (ausencia)", () => {
    expect(presentarTextoEnPantallaEntrega("(ausencia)")).toBe(
      TEXTO_SIN_REQUISITO,
    )
  })
})

describe("esUbicacionPantallaVaga", () => {
  test("rechaza piezas sueltas y fallbacks viejos", () => {
    expect(esUbicacionPantallaVaga("el enlace")).toBe(true)
    expect(esUbicacionPantallaVaga("El bloque")).toBe(true)
    expect(esUbicacionPantallaVaga("El bloque de accesos")).toBe(true)
    expect(
      esUbicacionPantallaVaga(
        "En la página (ubicación exacta no registrada en la auditoría)",
      ),
    ).toBe(true)
  })

  test("acepta rutas CMS con zona y elemento", () => {
    expect(
      esUbicacionPantallaVaga(
        "Pie de página › enlace «Política de privacidad»",
      ),
    ).toBe(false)
  })
})

describe("construirUbicacionDetallada / resolverUbicacionEnPantalla", () => {
  test("autoría / nombre en pie", () => {
    const ubi = resolverUbicacionEnPantalla(
      "Instituto Nacional de Propiedad industrial (INAPI)",
      undefined,
      "El pie de página identifica claramente a la institución responsable: «Instituto Nacional de Propiedad industrial (INAPI)» con su RUT.",
    )
    expect(ubi).toMatch(/Pie de página/i)
    expect(ubi).toMatch(/institucional|INAPI|Dónde estamos/i)
    expect(esUbicacionPantallaVaga(ubi)).toBe(false)
  })

  test("enlace de contenidos en pie", () => {
    const ubi = resolverUbicacionEnPantalla(
      "Uso de los Contenidos de este Sitio",
      "el enlace",
      "El pie de página incluye el enlace «Uso de los Contenidos de este Sitio», accesible desde la portada.",
    )
    expect(ubi).toBe(
      "Pie de página › enlace «Uso de los Contenidos de este Sitio»",
    )
  })

  test("RUT en bloque Dónde estamos", () => {
    const ubi = resolverUbicacionEnPantalla(
      "Instituto Nacional de Propiedad industrial (INAPI), RUT: 65.999.669-3",
      "el bloque",
      "El único RUT visible está en el bloque «Dónde estamos» del pie.",
    )
    expect(ubi).toMatch(/Pie de página/)
    expect(ubi).toMatch(/Dónde estamos/)
  })

  test("ventana emergente de contacto (sin decir modal)", () => {
    const ubi = resolverUbicacionEnPantalla(
      "¿Quieres contactarnos? · Dónde estamos",
      undefined,
      "Los datos están en el modal «¿Quieres contactarnos?» y bloque «Dónde estamos» del pie.",
    )
    expect(ubi).toMatch(/Ventana emergente/)
    expect(ubi).toMatch(/Dónde estamos/)
    expect(ubi).not.toMatch(/\bModal\b/)
  })

  test("política de privacidad", () => {
    expect(
      resolverUbicacionEnPantalla(
        "Política de privacidad",
        "el enlace",
        "El pie de página ofrece el enlace «Política de privacidad».",
      ),
    ).toBe("Pie de página › enlace «Política de privacidad»")
  })

  test("bloque de accesos rápidos", () => {
    const ubi = resolverUbicacionEnPantalla(
      "Estadísticas · Notificaciones diarias",
      "El bloque de accesos",
      "El bloque de accesos rápidos (T010) enlaza Estadísticas y Notificaciones diarias.",
    )
    expect(ubi).toMatch(/accesos rápidos/)
    expect(ubi).toMatch(/Portada/)
    expect(esUbicacionPantallaVaga(ubi)).toBe(false)
  })

  test("Gobierno Transparente Histórico en pie", () => {
    expect(
      resolverUbicacionEnPantalla(
        "Gobierno Transparente Histórico",
        "El enlace",
        "El enlace a «Gobierno Transparente Histórico» del pie ya está rotulado.",
      ),
    ).toBe("Pie de página › enlace «Gobierno Transparente Histórico»")
  })

  test("título principal en portada (sin H1/hero)", () => {
    const ubi = resolverUbicacionEnPantalla(
      "Te queremos ayudar a utilizar la propiedad industrial",
      undefined,
      "El H1 visible «Te queremos ayudar a utilizar la propiedad industrial» es coherente con el contenido.",
    )
    expect(ubi).toMatch(/título principal/)
    expect(ubi).toMatch(/Portada|zona superior destacada/i)
    expect(ubi).not.toMatch(/\bH1\b|hero/i)
  })

  test("conserva ubicación explícita ya detallada", () => {
    expect(
      resolverUbicacionEnPantalla(
        "INAPI",
        "Pie de página — bloque «Dónde estamos»",
        "comentario irrelevante",
      ),
    ).toBe("Pie de página › bloque «Dónde estamos»")
  })

  test("construirUbicacionDetallada null si no hay narración", () => {
    expect(construirUbicacionDetallada("", "x")).toBeNull()
  })
})
