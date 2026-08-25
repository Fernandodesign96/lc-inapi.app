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

  test("quita Tnnn, applicability e instrucciones de ubicación (C-2026-08-25h)", () => {
    const out = limpiarNomenclaturaEntrega(
      "Evidencia T020 y T019. El campo applicability es tramites (IESD). Pantalla › texto (indicar Cabecera, Cuerpo, Pie o ventana emergente › bloque).",
    )
    expect(out).not.toMatch(/\bT\d{3}\b/)
    expect(out).not.toMatch(/applicability/i)
    expect(out).not.toMatch(/indicar Cabecera/i)
    expect(out).toMatch(/Instrumento de Evaluaci[oó]n de Servicios Digitales \(IESD\)/)
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
