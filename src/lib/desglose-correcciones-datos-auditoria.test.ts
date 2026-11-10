import { describe, expect, test } from "bun:test"

import type { CriterionEvaluation } from "../schemas/checklist"
import type { ClaudeSustitucion } from "../schemas/claude-audit-pilot"
import {
  buildDesgloseCorreccionesDatosAuditoria,
  formatConteoCategoriaConCorrecciones,
  formatCriteriosMultiCorreccionResumen,
  listCorreccionesEntrega,
} from "./desglose-correcciones-datos-auditoria"

function sust(
  criterio_id: CriterionEvaluation["id"],
  n: number,
): ClaudeSustitucion[] {
  return Array.from({ length: n }, (_, i) => ({
    linea: `L${i + 1}-${criterio_id}`,
    original: `orig ${i + 1}`,
    propuesto: `prop ${i + 1}`,
    motivo: "motivo",
    criterio_id,
  }))
}

describe("desglose correcciones Datos de Auditoría", () => {
  test("cuenta correcciones (no criterios) y anota multi", () => {
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
    expect(d.correccionesNoCumple).toBe(3) // 2+1 alta
    expect(d.correccionesMedianamenteCumple).toBe(4)
    expect(d.correccionesCumpleConObservaciones).toBe(0)
    expect(
      d.correccionesNoCumple +
        d.correccionesMedianamenteCumple +
        d.correccionesCumpleConObservaciones,
    ).toBe(d.totalCorrecciones)
    expect(d.todos.map((x) => x.correcciones).sort()).toEqual([2, 4])
    expect(d.noCumple).toHaveLength(1)
    expect(d.noCumple[0]!.correcciones).toBe(2)
    expect(d.medianamenteCumple).toHaveLength(1)
    expect(d.medianamenteCumple[0]!.correcciones).toBe(4)

    const resumen = formatCriteriosMultiCorreccionResumen(d.todos)
    expect(resumen).toContain(" (2 correcciones)")
    expect(resumen).toContain(" (4 correcciones)")

    expect(
      formatConteoCategoriaConCorrecciones(3, d.noCumple),
    ).toMatch(/^3 \(Criterio \d+: 2 correcciones\)$/)
    expect(formatConteoCategoriaConCorrecciones(3, [])).toBe("3")
  })

  test("agrupado_en no crea fila extra (solo sustituciones cuentan)", () => {
    const rows: CriterionEvaluation[] = [
      { id: "LC-1.2.4-07", estado: "incumple", severidad: "alta" },
      {
        id: "LC-1.2.4-08",
        estado: "incumple",
        severidad: "alta",
        agrupado_en: "LC-1.2.4-07",
      },
      { id: "LC-1.2.1-04", estado: "incumple", severidad: "media" },
      {
        id: "LC-1.1.3-02",
        estado: "incumple",
        severidad: "baja",
        agrupado_en: "LC-1.2.1-04",
      },
    ]
    const sustituciones = [
      ...sust("LC-1.2.4-07", 1),
      ...sust("LC-1.2.1-04", 1),
    ]
    const d = buildDesgloseCorreccionesDatosAuditoria(rows, sustituciones)
    expect(d.totalCorrecciones).toBe(2)
    expect(d.correccionesNoCumple).toBe(1)
    expect(d.correccionesMedianamenteCumple).toBe(1)
    expect(d.correccionesCumpleConObservaciones).toBe(0)
    const items = listCorreccionesEntrega(rows, sustituciones)
    expect(items).toHaveLength(2)
    expect(items.filter((i) => i.esAgrupado)).toHaveLength(0)
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
    expect(d.correccionesNoCumple).toBe(1)
    expect(d.todos).toHaveLength(0)
  })
})
