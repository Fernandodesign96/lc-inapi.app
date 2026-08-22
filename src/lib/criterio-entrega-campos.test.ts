import { describe, expect, test } from "bun:test"

import type { CriterionEvaluation } from "../schemas/checklist"
import type { ClaudeSustitucion } from "../schemas/claude-audit-pilot"
import {
  buildSustitucionesPorCriterio,
  criterioEntregaCampos,
  justificacionCumple,
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
    expect(campos.ubicacionEnPantalla).toBe("Menú principal")
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
