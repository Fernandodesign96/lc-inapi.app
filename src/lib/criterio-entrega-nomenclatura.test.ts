import { describe, expect, test } from "bun:test"

/**
 * Tests del catálogo de entrega viven en frontend; aquí validamos la limpieza
 * de nomenclatura en campos compartidos UI/PDF/Excel.
 */
import {
  criterioEntregaCampos,
  limpiarNomenclaturaEntrega,
} from "./criterio-entrega-campos"

describe("limpiarNomenclaturaEntrega", () => {
  test("sustituye LC-* por criterio N", () => {
    const out = limpiarNomenclaturaEntrega(
      "Agrupado en LC-1.1.3-03. Ver también LC-1.1.3-01.",
    )
    expect(out).not.toMatch(/LC-/)
    expect(out.toLowerCase()).toContain("criterio")
  })
})

describe("criterioEntregaCampos — sin nomenclatura en propuesto", () => {
  test("propuesta «Corregir incumplimiento de LC-…» se reemplaza por instrucción CMS", () => {
    const campos = criterioEntregaCampos(
      {
        id: "LC-1.1.3-01",
        estado: "incumple",
        severidad: "baja",
        comentario: "Sin medición Legible documentada.",
      },
      {
        criterio_id: "LC-1.1.3-01",
        original:
          "Existen tres criterios fundamentales de patentabilidad.",
        propuesto: "Corregir incumplimiento de LC-1.1.3-01.",
        motivo: "Falta medición de legibilidad.",
        ubicacion_pantalla:
          "Sección «Para Informarse», tarjeta «Requisitos para obtener una patente»",
        linea: "T010",
      },
    )
    expect(campos.correccionPropuesta).not.toMatch(/LC-/)
    expect(campos.correccionPropuesta).not.toMatch(/corregir incumplimiento/i)
    expect(campos.correccionPropuesta.toLowerCase()).toMatch(/legible|cotidian/)
    expect(campos.justificacion).not.toMatch(/LC-/)
  })
})
