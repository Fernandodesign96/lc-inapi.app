import { describe, expect, test } from "bun:test"

import {
  PROVEEDOR_HEADERS,
  componenteSitio,
  consolidarFilasSitio,
  fixtureTresFilasProveedor,
  observacionesProveedor,
  originalParaProveedor,
  propuestoHighlightSegments,
} from "./entrega-proveedor"

describe("entrega proveedor C-2026-11-17b", () => {
  test("5 columnas fijas en orden", () => {
    expect([...PROVEEDOR_HEADERS]).toEqual([
      "N° de solicitud",
      "Link de referencia",
      "Contenido original",
      "Contenido a modificar/agregar",
      "Observaciones",
    ])
  })

  test("fixture 3 filas: hover, original vacío, footer PDF", () => {
    const filas = consolidarFilasSitio(fixtureTresFilasProveedor(), false)
    expect(filas).toHaveLength(3)
    expect(filas[0]?.original).toBe("Conoce más")
    expect(filas[0]?.propuesto).toContain("title=")
    expect(filas[0]?.observaciones).not.toMatch(/LC-/)
    expect(filas[0]?.observaciones).not.toMatch(/Hito/)
    expect(filas[1]?.original).toBe("")
    expect(filas[1]?.observaciones.startsWith("Insertar")).toBe(true)
    expect(filas[2]?.componente).toBe("footer")
    expect(filas[2]?.propuesto).toContain("PDF")
  })

  test("consolidado agrupa header/footer y lista N URLs", () => {
    const base = fixtureTresFilasProveedor()
    const extraHeader = {
      ...base[0]!,
      url: "https://www.inapi.cl/marcas",
    }
    const extraFooter = {
      ...base[2]!,
      url: "https://www.inapi.cl/patentes",
    }
    const out = consolidarFilasSitio(
      [...base, extraHeader, extraFooter],
      true,
    )
    expect(out).toHaveLength(3)
    const hover = out.find((f) => f.componente === "header")
    expect(hover?.urls).toHaveLength(2)
    const footer = out.find((f) => f.componente === "footer")
    expect(footer?.urls).toHaveLength(2)
    expect(out.map((f) => f.n)).toEqual([1, 2, 3])
  })

  test("original vacío en inserción; amarillo en texto nuevo", () => {
    expect(originalParaProveedor("(no existe en pantalla)")).toBe("")
    expect(originalParaProveedor("")).toBe("")
    const segs = propuestoHighlightSegments(
      "(ausencia)",
      "Añadir un subtítulo descriptivo: Tasas nacionales",
    )
    expect(segs.every((s) => s.yellow)).toBe(true)
    const etiquetas = propuestoHighlightSegments(
      "Tasas",
      "Título: Tasas nacionales\ntexto viejo",
    )
    expect(etiquetas[0]?.yellow).toBe(true)
    expect(etiquetas[1]?.yellow).toBe(false)
  })

  test("observaciones proveedor no llevan hito ni LC", () => {
    const obs = observacionesProveedor({
      url: "https://www.inapi.cl/",
      original: "Conoce más",
      propuesto: 'title="…"',
      ubicacion_pantalla: "Menú › «Conoce más»",
      criterio_id: "LC-5.2.4-01",
      linea: "x",
      motivo: "Checklist Hito 3 - Criterio 12 — LC-5.2.4-01",
    })
    expect(obs).not.toMatch(/LC-/)
    expect(obs).not.toMatch(/Criterio 12/)
    expect(componenteSitio({
      url: "https://www.inapi.cl/",
      original: "x",
      propuesto: "y",
      ubicacion_pantalla: "Menú de navegación",
      criterio_id: "LC-5.2.4-01",
      linea: "atajo",
    })).toBe("header")
  })
})
