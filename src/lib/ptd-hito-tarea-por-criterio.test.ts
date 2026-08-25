import { describe, expect, test } from "bun:test"
import {
  coberturaPtdHitoTarea,
  ptdHitoTareaPorCriterio,
} from "./ptd-hito-tarea-por-criterio"
import lcFile from "../../data/checklist-criteria-lc-ptd.json"

describe("ptdHitoTareaPorCriterio", () => {
  test("cubre hito/tarea en los 51 LC-* (sin meta 492)", () => {
    const c = coberturaPtdHitoTarea()
    expect(c.total).toBe(51)
    expect(c.conHito).toBe(51)
    expect(c.sinHito).toEqual([])
  })

  test("nunca muestra hito 492 ni tarea 491", () => {
    for (const c of (lcFile as { criteria: { id: string }[] }).criteria) {
      const id = c.id
      const labels = ptdHitoTareaPorCriterio(id)
      expect(labels.hitoPtd).not.toContain("492")
      expect(labels.tareaPtd).not.toContain("491")
      expect(
        labels.refs.every((r) => r.hitoId !== 492 && r.tareaId !== 491),
      ).toBe(true)
    }
  })

  test("etiquetas usan Hito N / Tarea N (no ids OpenProject)", () => {
    const labels = ptdHitoTareaPorCriterio("LC-1.1.5-01")
    expect(labels.hitoPtd).toMatch(/^Hito \d+ —/)
    expect(labels.tareaPtd).toMatch(/^Tarea \d+ —/)
    expect(labels.hitoPtd).not.toMatch(/\b494\b/)
    expect(labels.tareaPtd).not.toMatch(/\b493\b/)
  })

  test("Fiabilidad apunta al hito operativo 500 (no al meta 492)", () => {
    const labels = ptdHitoTareaPorCriterio("LC-1.1.1-01")
    expect(labels.refs[0]?.hitoId).toBe(500)
    expect(labels.refs[0]?.tareaId).toBe(499)
    expect(labels.hitoOrdinal).toBe(4)
    expect(labels.tareaOrdinal).toBe(1)
  })

  test("Lenguaje plano → solo hito 496 / tarea 495 (sin solape con 494)", () => {
    const labels = ptdHitoTareaPorCriterio("LC-1.1.3-01")
    expect(labels.refs[0]?.hitoId).toBe(496)
    expect(labels.refs[0]?.tareaId).toBe(495)
    expect(labels.hitoOrdinal).toBe(2)
    expect(labels.refs.every((r) => r.hitoId !== 494 && r.tareaId !== 493)).toBe(
      true,
    )
  })

  test("Redacción y ortografía → solo hito 494 / tarea 493", () => {
    const labels = ptdHitoTareaPorCriterio("LC-1.1.5-01")
    expect(labels.refs[0]?.hitoId).toBe(494)
    expect(labels.refs[0]?.tareaId).toBe(493)
    expect(labels.hitoOrdinal).toBe(1)
    expect(labels.criterioOrdinal).toBe(1)
    expect(labels.refs.every((r) => r.hitoId !== 496 && r.tareaId !== 495)).toBe(
      true,
    )
  })

  test("Objetividad → hito 517 / tarea 516", () => {
    const labels = ptdHitoTareaPorCriterio("LC-1.3.2-01")
    expect(labels.refs[0]?.hitoId).toBe(517)
    expect(labels.refs[0]?.tareaId).toBe(516)
    expect(labels.hitoOrdinal).toBe(11)
  })

  test("Completitud → hito 498 / tarea 497 (sin meta 492)", () => {
    for (const id of [
      "LC-1.1.2-01",
      "LC-1.1.2-02",
      "LC-1.1.2-03",
      "LC-1.1.2-04",
    ] as const) {
      const labels = ptdHitoTareaPorCriterio(id)
      expect(labels.refs[0]?.hitoId).toBe(498)
      expect(labels.refs[0]?.tareaId).toBe(497)
      expect(labels.hitoOrdinal).toBe(3)
    }
  })

  test("Archivo 1.3.3 → hito 519 / tarea 518", () => {
    const labels = ptdHitoTareaPorCriterio("LC-1.3.3-01")
    expect(labels.refs[0]?.hitoId).toBe(519)
    expect(labels.refs[0]?.tareaId).toBe(518)
    expect(labels.hitoOrdinal).toBe(12)
  })

  test("Privacidad: RUN/teléfonos → 503; ARCO → solo 504", () => {
    const run = ptdHitoTareaPorCriterio("LC-1.1.7-01")
    expect(run.refs[0]?.tareaId).toBe(503)
    expect(run.tareaOrdinal).toBe(1)
    const arco = ptdHitoTareaPorCriterio("LC-1.1.7-03")
    expect(arco.refs[0]?.tareaId).toBe(504)
    expect(arco.tareaOrdinal).toBe(2)
  })

  test("criterios se numeran 1…51 de forma continua (no reinician por tarea)", () => {
    const a = ptdHitoTareaPorCriterio("LC-1.1.5-01")
    const b = ptdHitoTareaPorCriterio("LC-1.1.5-02")
    const c = ptdHitoTareaPorCriterio("LC-1.1.5-03")
    expect(a.hitoOrdinal).toBe(1)
    expect(a.criterioOrdinal).toBe(1)
    expect(b.criterioOrdinal).toBe(2)
    expect(c.criterioOrdinal).toBe(3)

    const d = ptdHitoTareaPorCriterio("LC-1.1.3-01")
    expect(d.hitoOrdinal).toBe(2)
    expect(d.criterioOrdinal).toBe(4)

    const ids = (lcFile as { criteria: { id: string }[] }).criteria.map(
      (x) => x.id,
    )
    const nums = ids
      .map((id) => ptdHitoTareaPorCriterio(id).criterioOrdinal)
      .filter((n): n is number => n != null)
      .sort((x, y) => x - y)
    expect(nums).toEqual([...Array(51)].map((_, i) => i + 1))
  })

  test("Contenidos sensibles: una pregunta por tarea 510 / 511 / 512", () => {
    expect(ptdHitoTareaPorCriterio("LC-1.1.8-01").refs[0]?.tareaId).toBe(510)
    expect(ptdHitoTareaPorCriterio("LC-1.1.8-01").tareaOrdinal).toBe(1)
    expect(ptdHitoTareaPorCriterio("LC-1.1.8-02").refs[0]?.tareaId).toBe(511)
    expect(ptdHitoTareaPorCriterio("LC-1.1.8-02").tareaOrdinal).toBe(2)
    expect(ptdHitoTareaPorCriterio("LC-1.1.8-03").refs[0]?.tareaId).toBe(512)
    expect(ptdHitoTareaPorCriterio("LC-1.1.8-03").tareaOrdinal).toBe(3)
  })

  test("legado A–H sin fila LC → guion", () => {
    const labels = ptdHitoTareaPorCriterio("B1")
    expect(labels.hitoPtd).toBe("—")
    expect(labels.tareaPtd).toBe("—")
    expect(labels.hitoOrdinal).toBeNull()
  })
})
