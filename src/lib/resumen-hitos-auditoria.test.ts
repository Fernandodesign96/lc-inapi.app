import { describe, expect, test } from "bun:test"

import type { CriterionEvaluation } from "../schemas/checklist"
import {
  buildResumenHitosAuditoria,
  conteoCategoriasPresentacion,
} from "./resumen-hitos-auditoria"

describe("buildResumenHitosAuditoria", () => {
  test("agrupa por hito y cuenta categorías MEI", () => {
    const rows: CriterionEvaluation[] = [
      { id: "LC-1.1.3-01", estado: "cumple" },
      { id: "LC-1.1.3-02", estado: "cumple" },
      { id: "LC-1.1.3-03", estado: "incumple", severidad: "baja" },
      { id: "LC-1.1.3-04", estado: "incumple", severidad: "baja" },
      { id: "LC-1.1.3-05", estado: "incumple", severidad: "media" },
      { id: "LC-1.1.3-06", estado: "incumple", severidad: "alta" },
    ]
    const resumen = buildResumenHitosAuditoria(rows)
    const h496 = resumen.find((h) => h.hitoId === 496)
    expect(h496).toBeDefined()
    expect(h496!.checklist).toBe(6)
    expect(h496!.cumple).toBe(2)
    expect(h496!.cumpleConObservaciones).toBe(2)
    expect(h496!.medianamenteCumple).toBe(1)
    expect(h496!.noCumple).toBe(1)
    expect(h496!.noAplica).toBe(0)
    expect(h496!.pctCumple).toBe(Math.round((2 / 6) * 100))
    expect(h496!.hitoOrdinal).toBe(2)
    expect(h496!.hitoTitulo).not.toMatch(/^Hito:/)
    expect(h496!.hitoTitulo.length).toBeGreaterThan(10)
  })

  test("conteoCategoriasPresentacion suma todas las filas", () => {
    const rows: CriterionEvaluation[] = [
      { id: "LC-1.1.3-01", estado: "cumple" },
      { id: "LC-1.1.3-03", estado: "incumple", severidad: "baja" },
      { id: "LC-1.1.3-05", estado: "incumple", severidad: "media" },
      { id: "LC-1.1.3-06", estado: "incumple", severidad: "alta" },
      { id: "LC-1.1.3-02", estado: "no_aplica" },
    ]
    expect(conteoCategoriasPresentacion(rows)).toEqual({
      cumple: 1,
      cumpleConObservaciones: 1,
      medianamenteCumple: 1,
      noCumple: 1,
      noAplica: 1,
    })
  })

  test("con sustituciones, severidad del hito cuenta correcciones (incl. agrupados)", () => {
    const rows: CriterionEvaluation[] = [
      { id: "LC-1.2.1-04", estado: "incumple", severidad: "media" },
      {
        id: "LC-1.1.3-02",
        estado: "incumple",
        severidad: "baja",
        agrupado_en: "LC-1.2.1-04",
      },
      { id: "LC-1.2.4-07", estado: "incumple", severidad: "alta" },
      {
        id: "LC-1.2.4-08",
        estado: "incumple",
        severidad: "alta",
        agrupado_en: "LC-1.2.4-07",
      },
    ]
    const sustituciones = [
      {
        linea: "S1",
        original: "a",
        propuesto: "b",
        motivo: "m",
        criterio_id: "LC-1.2.1-04" as const,
      },
      {
        linea: "S2",
        original: "c",
        propuesto: "d",
        motivo: "m",
        criterio_id: "LC-1.2.4-07" as const,
      },
    ]
    // Criterios: agrupados → Cumple (no descuentan %).
    expect(conteoCategoriasPresentacion(rows)).toEqual({
      cumple: 2,
      cumpleConObservaciones: 0,
      medianamenteCumple: 1,
      noCumple: 1,
      noAplica: 0,
    })
    const hitos = buildResumenHitosAuditoria(rows, sustituciones)
    const sumSev = hitos.reduce(
      (n, h) =>
        n + h.cumpleConObservaciones + h.medianamenteCumple + h.noCumple,
      0,
    )
    expect(sumSev).toBe(2)
  })

  test("cuenta No aplica", () => {
    const rows: CriterionEvaluation[] = [
      { id: "LC-1.1.3-01", estado: "cumple" },
      { id: "LC-1.1.3-02", estado: "no_aplica" },
    ]
    const h496 = buildResumenHitosAuditoria(rows).find((h) => h.hitoId === 496)
    expect(h496?.noAplica).toBe(1)
    expect(h496?.checklist).toBe(2)
  })
})
