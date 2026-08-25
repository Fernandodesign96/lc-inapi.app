import { describe, expect, test } from "bun:test"

import {
  coberturaPtdHitoTarea,
  ptdHitoTareaPorCriterio,
} from "./ptd-hito-tarea-por-criterio"

describe("ptdHitoTareaPorCriterio", () => {
  test("cubre hito/tarea en los 51 LC-* (sin meta 492)", () => {
    const c = coberturaPtdHitoTarea()
    expect(c.total).toBe(51)
    expect(c.conHito).toBe(51)
    expect(c.sinHito).toEqual([])
  })

  test("nunca muestra hito 492 ni tarea 491", () => {
    for (const id of [
      "LC-1.1.1-01",
      "LC-1.1.2-01",
      "LC-1.1.3-01",
      "LC-1.1.4-01",
      "LC-1.1.5-01",
      "LC-1.3.2-01",
    ] as const) {
      const labels = ptdHitoTareaPorCriterio(id)
      expect(labels.hitoPtd).not.toContain("492")
      expect(labels.tareaPtd).not.toContain("491")
      expect(
        labels.refs.every((r) => r.hitoId !== 492 && r.tareaId !== 491),
      ).toBe(true)
    }
  })

  test("Fiabilidad apunta al hito operativo 500 (no al meta 492)", () => {
    const labels = ptdHitoTareaPorCriterio("LC-1.1.1-01")
    expect(labels.hitoPtd).toContain("500")
    expect(labels.tareaPtd).toContain("499")
    expect(labels.hitoPtd).not.toContain("492")
  })

  test("Lenguaje plano → solo hito 496 / tarea 495 (sin solape con 494)", () => {
    const labels = ptdHitoTareaPorCriterio("LC-1.1.3-01")
    expect(labels.hitoPtd).toContain("496")
    expect(labels.tareaPtd).toContain("495")
    expect(labels.hitoPtd).not.toContain("494")
    expect(labels.tareaPtd).not.toContain("493")
  })

  test("Redacción y ortografía → solo hito 494 / tarea 493", () => {
    const labels = ptdHitoTareaPorCriterio("LC-1.1.5-01")
    expect(labels.hitoPtd).toContain("494")
    expect(labels.tareaPtd).toContain("493")
    expect(labels.hitoPtd).not.toContain("496")
    expect(labels.tareaPtd).not.toContain("495")
  })

  test("Objetividad → hito 517 / tarea 516", () => {
    const labels = ptdHitoTareaPorCriterio("LC-1.3.2-01")
    expect(labels.hitoPtd).toContain("517")
    expect(labels.tareaPtd).toContain("516")
  })

  test("Completitud → hito 498 / tarea 497 (sin meta 492)", () => {
    for (const id of [
      "LC-1.1.2-01",
      "LC-1.1.2-02",
      "LC-1.1.2-03",
      "LC-1.1.2-04",
    ] as const) {
      const labels = ptdHitoTareaPorCriterio(id)
      expect(labels.hitoPtd).toContain("498")
      expect(labels.tareaPtd).toContain("497")
      expect(labels.hitoPtd).not.toContain("492")
      expect(labels.tareaPtd).not.toContain("491")
      expect(labels.refs.length).toBeGreaterThan(0)
    }
  })

  test("Archivo 1.3.3 → hito 519 / tarea 518", () => {
    const labels = ptdHitoTareaPorCriterio("LC-1.3.3-01")
    expect(labels.hitoPtd).toContain("519")
    expect(labels.tareaPtd).toContain("518")
  })

  test("Privacidad: RUN/teléfonos → 503; ARCO → solo 504", () => {
    const run = ptdHitoTareaPorCriterio("LC-1.1.7-01")
    expect(run.tareaPtd).toContain("503")
    expect(run.tareaPtd).not.toContain("504")
    const arco = ptdHitoTareaPorCriterio("LC-1.1.7-03")
    expect(arco.tareaPtd).toContain("504")
    expect(arco.tareaPtd).not.toContain("503")
  })

  test("Contenidos sensibles: una pregunta por tarea 510 / 511 / 512", () => {
    expect(ptdHitoTareaPorCriterio("LC-1.1.8-01").tareaPtd).toContain("510")
    expect(ptdHitoTareaPorCriterio("LC-1.1.8-01").tareaPtd).not.toContain("511")
    expect(ptdHitoTareaPorCriterio("LC-1.1.8-02").tareaPtd).toContain("511")
    expect(ptdHitoTareaPorCriterio("LC-1.1.8-02").tareaPtd).not.toContain("510")
    expect(ptdHitoTareaPorCriterio("LC-1.1.8-03").tareaPtd).toContain("512")
    expect(ptdHitoTareaPorCriterio("LC-1.1.8-03").tareaPtd).not.toContain("510")
  })

  test("legado A–H sin fila LC → guion", () => {
    const labels = ptdHitoTareaPorCriterio("B1")
    expect(labels.hitoPtd).toBe("—")
    expect(labels.tareaPtd).toBe("—")
  })
})
