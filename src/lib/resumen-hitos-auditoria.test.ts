import { describe, expect, test } from "bun:test"

import type { CriterionEvaluation } from "../schemas/checklist"
import { buildResumenHitosAuditoria } from "./resumen-hitos-auditoria"

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
