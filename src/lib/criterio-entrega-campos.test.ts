import { describe, expect, test } from "bun:test"

import type { CriterionEvaluation } from "../schemas/checklist"
import type { ClaudeSustitucion } from "../schemas/claude-audit-pilot"
import {
  buildSustitucionesPorCriterio,
  criterioEntregaCampos,
  esPreguntaDeCriterio,
  justificacionCumple,
  resolverTextoEnPantalla,
  stripEncabezadoCriterioInstrumento,
} from "./criterio-entrega-campos"

function ev(
  partial: Partial<CriterionEvaluation> &
    Pick<CriterionEvaluation, "id" | "estado">,
): CriterionEvaluation {
  return partial
}

describe("justificacionCumple", () => {
  test("con cita_textual usa el comentario o el genérico", () => {
    expect(
      justificacionCumple(
        ev({
          id: "LC-1.1.1-01",
          estado: "cumple",
          cita_textual: "Instituto Nacional de Propiedad Industrial",
          comentario: "Autoría clara en el pie.",
        }),
      ),
    ).toBe("Autoría clara en el pie.")

    expect(
      justificacionCumple(
        ev({
          id: "LC-1.1.1-01",
          estado: "cumple",
          cita_textual: "INAPI",
        }),
      ),
    ).toContain("Cumple según evidencia")
  })

  test("sin texto literal refuerza la justificación", () => {
    const out = justificacionCumple(
      ev({
        id: "LC-1.2.1-01",
        estado: "cumple",
        comentario: "La estructura de títulos es coherente en toda la página.",
      }),
    )
    expect(out).toBe(
      "La estructura de títulos es coherente en toda la página.",
    )

    const debil = justificacionCumple(
      ev({ id: "LC-1.2.1-01", estado: "cumple", comentario: "cumple" }),
    )
    expect(debil).toContain("no hay texto literal")
    expect(debil).toContain("cumple")

    const vacio = justificacionCumple(
      ev({ id: "LC-1.2.1-01", estado: "cumple" }),
    )
    expect(vacio).toContain("no hay texto literal")
  })
})

describe("criterioEntregaCampos", () => {
  test("cumple: texto, ubicación y corrección —", () => {
    const campos = criterioEntregaCampos(
      ev({
        id: "LC-1.1.1-01",
        estado: "cumple",
        cita_textual: "INAPI",
        ubicacion_pantalla: "Pie de página › contacto",
        comentario: "Se identifica la institución.",
      }),
    )
    expect(campos.textoEnPantalla).toBe("INAPI")
    expect(campos.ubicacionEnPantalla).toBe("Pie de página › contacto")
    expect(campos.correccionPropuesta).toBe("—")
    expect(campos.justificacion).toBe("Se identifica la institución.")
  })

  test("cumple sin cita ni ubicación usa —", () => {
    const campos = criterioEntregaCampos(
      ev({ id: "A1", estado: "cumple", comentario: "OK visual." }),
    )
    expect(campos.textoEnPantalla).toBe("—")
    expect(campos.ubicacionEnPantalla).toBe("—")
    expect(campos.justificacion).toBe("OK visual.")
  })

  test("normaliza tipografía CMS en justificación y ubicación", () => {
    const campos = criterioEntregaCampos(
      ev({
        id: "LC-1.2.4-03",
        estado: "cumple",
        ubicacion_pantalla: "Cuerpo › bajo el H1 «Marcas»",
        comentario:
          "Hay título H1 «Marcas» y texto en negrita «INAPI»; el bloque está alineado a la izquierda.",
      }),
    )
    expect(campos.ubicacionEnPantalla).toBe(
      "Cuerpo › bajo el título principal 'Marcas'",
    )
    expect(campos.justificacion).toContain("título principal 'Marcas'")
    expect(campos.justificacion).toContain("el texto en negrita 'INAPI'")
    expect(campos.justificacion).toContain("Alineado a la izquierda")
    expect(campos.justificacion).not.toMatch(/\bH1\b|\(bold\)|align left/i)
  })

  test("cumple: citas en comentario → Texto en pantalla", () => {
    const campos = criterioEntregaCampos(
      ev({
        id: "LC-1.1.3-02",
        estado: "cumple",
        comentario:
          "El H1 usa segunda persona: «Te queremos ayudar a utilizar la propiedad industrial».",
      }),
    )
    expect(campos.textoEnPantalla).toBe(
      "Te queremos ayudar a utilizar la propiedad industrial",
    )
    expect(campos.ubicacionEnPantalla).toMatch(/título principal|Portada/i)
    expect(campos.ubicacionEnPantalla).not.toMatch(/\bH1\b|hero/i)
    expect(campos.ubicacionEnPantalla).not.toMatch(/ubicación exacta no registrada/i)
  })

  test("no usa la pregunta del criterio como Texto en pantalla (C-2026-08-25d)", () => {
    expect(
      esPreguntaDeCriterio(
        "¿Los signos de puntuación empleados facilitan la lectura del documento?",
      ),
    ).toBe(true)

    const stripped = stripEncabezadoCriterioInstrumento(
      "Criterio 14: «¿Los signos de puntuación empleados facilitan la lectura del documento?» — Instrumento 5: Redacción y ortografía. La puntuación de los párrafos institucionales no entorpece la lectura.",
    )
    expect(stripped).toBe(
      "La puntuación de los párrafos institucionales no entorpece la lectura.",
    )
    expect(stripped).not.toMatch(/Criterio\s+\d+|Instrumento\s+\d+/i)

    const soloPregunta = criterioEntregaCampos(
      ev({
        id: "LC-1.1.5-02",
        estado: "cumple",
        comentario:
          "Criterio 14: «¿Los signos de puntuación empleados facilitan la lectura del documento?» — Instrumento 5: Redacción y ortografía. La puntuación de los párrafos institucionales y de la lista de Valores no entorpece la lectura.",
      }),
    )
    expect(soloPregunta.textoEnPantalla).toBe("—")
    expect(soloPregunta.textoEnPantalla).not.toMatch(/signos de puntuaci[oó]n/i)
    expect(soloPregunta.justificacion).not.toMatch(/^Criterio\s+\d+/i)
    expect(soloPregunta.justificacion).toMatch(/p[aá]rrafos institucionales/i)
    expect(soloPregunta.ubicacionEnPantalla).not.toMatch(/signos de puntuaci[oó]n/i)
    expect(soloPregunta.correccionPropuesta).toBe("—")

    const conLiteralReal = criterioEntregaCampos(
      ev({
        id: "LC-1.1.5-02",
        estado: "cumple",
        comentario:
          "Criterio 14: «¿Los signos de puntuación empleados facilitan la lectura del documento?» — Instrumento 5: Redacción y ortografía. Las tarjetas de «Para Informarse» usan puntuación simple.",
      }),
    )
    expect(conLiteralReal.textoEnPantalla).toBe("Para Informarse")
    expect(conLiteralReal.justificacion).toMatch(/Para Informarse/)
    expect(conLiteralReal.justificacion).not.toMatch(/^Criterio\s+\d+/i)
  })

  test("con texto infiere ubicación desde narración o usa explícita", () => {
    const conNarracion = criterioEntregaCampos(
      ev({
        id: "LC-1.1.3-02",
        estado: "cumple",
        cita_textual: "INAPI",
        comentario: "Autoría visible en el pie de página del sitio.",
      }),
    )
    expect(conNarracion.ubicacionEnPantalla).toMatch(/Pie de página/i)

    const explicita = criterioEntregaCampos(
      ev({
        id: "LC-1.1.3-02",
        estado: "cumple",
        cita_textual: "INAPI",
        ubicacion_pantalla: "Pie › bloque contacto › nombre institucional",
        comentario: "en el menú superior también hay logo.",
      }),
    )
    expect(explicita.ubicacionEnPantalla).toBe(
      "Pie › bloque contacto › nombre institucional",
    )
  })

  test("sin texto en pantalla deja ubicación en —", () => {
    const campos = criterioEntregaCampos(
      ev({
        id: "LC-1.2.1-01",
        estado: "cumple",
        comentario: "Cumple por revisión visual de la estructura.",
      }),
    )
    expect(campos.textoEnPantalla).toBe("—")
    expect(campos.ubicacionEnPantalla).toBe("—")
  })

  test("incumple sin texto muestra mensaje de ausencia legible", () => {
    const campos = criterioEntregaCampos(
      ev({
        id: "LC-1.1.4-01",
        estado: "incumple",
        severidad: "alta",
        cita_textual: "(ausencia)",
        comentario:
          "No se observó fecha de actualización visible bajo el título ni en el pie de página.",
      }),
    )
    expect(campos.textoEnPantalla).toBe(
      "No hay texto que cumpla con este requisito",
    )
    expect(campos.ubicacionEnPantalla).toMatch(/Pie de página|título/i)
  })

  test("cumple: justificación de ausencia no vuelca citas a Texto en pantalla", () => {
    const campos = criterioEntregaCampos(
      ev({
        id: "LC-1.1.3-04",
        estado: "cumple",
        comentario:
          "No se observaron abreviaturas ni extranjerismos como «etc.» o «status» en el cuerpo evaluado.",
      }),
    )
    expect(campos.textoEnPantalla).toBe("—")
  })

  test("no_aplica con cita en comentario la muestra en Texto en pantalla", () => {
    expect(
      resolverTextoEnPantalla(
        ev({
          id: "LC-5.2.1-01",
          estado: "no_aplica",
          comentario:
            "Variante de trámite; no aplica en sitioweb. Se revisó el bloque «Marcas».",
        }),
      ),
    ).toBe("Marcas")
  })

  test("incumple con sustitución", () => {
    const sust: ClaudeSustitucion = {
      original: "Titulos",
      propuesto: "Títulos",
      criterio_id: "D1",
      motivo: "Falta tilde.",
      linea: "T01",
      ubicacion_pantalla: "Menú principal",
    }
    const campos = criterioEntregaCampos(
      ev({
        id: "D1",
        estado: "incumple",
        severidad: "media",
        comentario: "Error ortográfico.",
      }),
      sust,
    )
    expect(campos.textoEnPantalla).toBe("Titulos")
    expect(campos.correccionPropuesta).toBe("Títulos")
    expect(campos.ubicacionEnPantalla).toBe(
      "Menú principal › texto «Titulos»",
    )
    expect(campos.tieneSustitucion).toBe(true)
    expect(campos.justificacion).toContain("Falta tilde")
  })

  test("no_aplica", () => {
    const campos = criterioEntregaCampos(
      ev({
        id: "LC-1.3.3-01",
        estado: "no_aplica",
        comentario: "No hay versiones anteriores en esta URL.",
      }),
    )
    expect(campos.textoEnPantalla).toBe("—")
    expect(campos.correccionPropuesta).toBe("—")
    expect(campos.justificacion).toContain("versiones anteriores")
  })
})

describe("buildSustitucionesPorCriterio", () => {
  test("conserva todas las correcciones del mismo criterio_id", () => {
    const susts: ClaudeSustitucion[] = [
      {
        original: "Para Informarse",
        propuesto: "Todo sobre las marcas",
        criterio_id: "LC-1.2.4-02",
        motivo: "Título genérico",
        linea: "T07",
        ubicacion_pantalla: "Sección informativa",
      },
      {
        original: "Buscadores",
        propuesto: "Herramientas de búsqueda de marcas",
        criterio_id: "LC-1.2.4-02",
        motivo: "Título genérico",
        linea: "T12",
        ubicacion_pantalla: "Sección búsqueda",
      },
      {
        original: "Tipo de Cobertura",
        propuesto: "Tipo de cobertura: define…",
        criterio_id: "LC-1.1.3-03",
        motivo: "Concepto opaco",
        linea: "T17",
        ubicacion_pantalla: "Bloque tipos",
      },
    ]
    const map = buildSustitucionesPorCriterio(susts)
    expect(map.get("LC-1.2.4-02")?.map((s) => s.original)).toEqual([
      "Para Informarse",
      "Buscadores",
    ])
    expect(map.get("LC-1.1.3-03")).toHaveLength(1)
  })

  test("incluye criterios_relacionados sin duplicar la misma fila", () => {
    const sust: ClaudeSustitucion = {
      original: "tres etapas…",
      propuesto: "1. … 2. … 3. …",
      criterio_id: "LC-1.1.3-03",
      criterios_relacionados: ["LC-1.2.2-04", "LC-1.2.3-03"],
      motivo: "Jerga + extensión",
      linea: "T10",
    }
    const map = buildSustitucionesPorCriterio([sust, sust])
    expect(map.get("LC-1.1.3-03")).toHaveLength(1)
    expect(map.get("LC-1.2.2-04")).toHaveLength(1)
    expect(map.get("LC-1.2.3-03")?.[0]?.original).toBe("tres etapas…")
  })
})
