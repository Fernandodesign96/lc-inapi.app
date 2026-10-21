import { describe, expect, test } from "bun:test"

import type { CriterionEvaluation } from "../schemas/checklist"
import type { ClaudeSustitucion } from "../schemas/claude-audit-pilot"
import {
  buildDesgloseCorreccionesDatosAuditoria,
  formatConteoCategoriaConCorrecciones,
  formatCriteriosMultiCorreccionResumen,
} from "./desglose-correcciones-datos-auditoria"

function sust(
  criterio_id: CriterionEvaluation["id"],
  n: number,
): ClaudeSustitucion[] {
  return Array.from({ length: n }, (_, i) => ({
    linea: `L${i + 1}`,
    original: `orig ${i + 1}`,
    propuesto: `prop ${i + 1}`,
    motivo: "motivo",
    criterio_id,
  }))
}

describe("desglose correcciones Datos de Auditoría", () => {
  test("lista solo criterios con 2+ correcciones y formatea las líneas", () => {
    const rows: CriterionEvaluation[] = [
      { id: "LC-1.1.2-03", estado: "incumple", severidad: "alta" },
      { id: "LC-1.1.3-03", estado: "incumple", severidad: "media" },
      { id: "LC-1.1.4-01", estado: "incumple", severidad: "alta" },
    ]
    const sustituciones = [
      ...sust("LC-1.1.2-03", 2),
      ...sust("LC-1.1.3-03", 4),
      ...sust("LC-1.1.4-01", 1),
    ]
    const d = buildDesgloseCorreccionesDatosAuditoria(rows, sustituciones)
    expect(d.totalCorrecciones).toBe(7)
    expect(d.todos.map((x) => x.correcciones).sort()).toEqual([2, 4])
    expect(d.noCumple).toHaveLength(1)
    expect(d.noCumple[0]!.correcciones).toBe(2)
    expect(d.medianamenteCumple).toHaveLength(1)
    expect(d.medianamenteCumple[0]!.correcciones).toBe(4)
    expect(d.cumpleConObservaciones).toHaveLength(0)

    const resumen = formatCriteriosMultiCorreccionResumen(d.todos)
    expect(resumen).toContain(" (2 correcciones)")
    expect(resumen).toContain(" (4 correcciones)")
    expect(resumen.startsWith("Criterio ")).toBe(true)

    expect(formatConteoCategoriaConCorrecciones(6, d.noCumple)).toMatch(
      /^6 \(Criterio \d+: 2 correcciones\)$/,
    )
    expect(formatConteoCategoriaConCorrecciones(3, [])).toBe("3")
  })

  test("ignora filas METADATA", () => {
    const rows: CriterionEvaluation[] = [
      { id: "LC-1.1.2-03", estado: "incumple", severidad: "alta" },
    ]
    const sustituciones: ClaudeSustitucion[] = [
      ...sust("LC-1.1.2-03", 1),
      {
        linea: "M1",
        original: "title",
        propuesto: "title 2",
        motivo: "meta",
        criterio_id: "LC-1.1.2-03",
        capa: "METADATA",
      },
    ]
    const d = buildDesgloseCorreccionesDatosAuditoria(rows, sustituciones)
    expect(d.totalCorrecciones).toBe(1)
    expect(d.todos).toHaveLength(0)
  })
})
