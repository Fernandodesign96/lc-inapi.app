import { describe, expect, test } from "bun:test"

import {
  coberturaPtdHitoTarea,
  ptdHitoTareaPorCriterio,
} from "./ptd-hito-tarea-por-criterio"

describe("ptdHitoTareaPorCriterio", () => {
  test("cubre hito operativo en 47 LC-*; Completitud (solo bajo meta 492) sin hito en entrega", () => {
    const c = coberturaPtdHitoTarea()
    expect(c.total).toBe(51)
    expect(c.conHito).toBe(47)
    expect(c.sinHito).toEqual([
      "LC-1.1.2-01",
      "LC-1.1.2-02",
      "LC-1.1.2-03",
      "LC-1.1.2-04",
    ])
  })

  test("no muestra hito 492 ni tarea 491 (meta-checklist ya operativo)", () => {
    for (const id of [
      "LC-1.1.1-01",
      "LC-1.1.3-01",
      "LC-1.1.4-01",
      "LC-1.1.5-01",
      "LC-1.3.2-01",
    ] as const) {
      const labels = ptdHitoTareaPorCriterio(id)
      expect(labels.hitoPtd).not.toContain("492")
      expect(labels.tareaPtd).not.toContain("491")
      expect(labels.refs.every((r) => r.hitoId !== 492 && r.tareaId !== 491)).toBe(
        true,
      )
    }
  })

  test("Fiabilidad apunta al hito operativo 500 (no al meta 492)", () => {
    const labels = ptdHitoTareaPorCriterio("LC-1.1.1-01")
    expect(labels.hitoPtd).toContain("500")
    expect(labels.tareaPtd).toContain("499")
    expect(labels.hitoPtd).not.toContain("492")
  })

  test("Lenguaje plano → hitos 494 / 496 (operativos)", () => {
    const labels = ptdHitoTareaPorCriterio("LC-1.1.3-01")
    expect(labels.hitoPtd).toContain("494")
    expect(labels.hitoPtd).toContain("496")
    expect(labels.tareaPtd).toContain("493")
    expect(labels.tareaPtd).toContain("495")
  })

  test("Objetividad → hito 517 / tarea 516", () => {
    const labels = ptdHitoTareaPorCriterio("LC-1.3.2-01")
    expect(labels.hitoPtd).toContain("517")
    expect(labels.tareaPtd).toContain("516")
  })

  test("Completitud (solo en Word bajo 492) → guion en entrega", () => {
    const labels = ptdHitoTareaPorCriterio("LC-1.1.2-01")
    expect(labels.hitoPtd).toBe("—")
    expect(labels.tareaPtd).toBe("—")
    expect(labels.refs).toEqual([])
  })

  test("Archivo 1.3.3 → hito 519 / tarea 518", () => {
    const labels = ptdHitoTareaPorCriterio("LC-1.3.3-01")
    expect(labels.hitoPtd).toContain("519")
    expect(labels.tareaPtd).toContain("518")
  })

  test("legado A–H sin fila LC → guion", () => {
    const labels = ptdHitoTareaPorCriterio("B1")
    expect(labels.hitoPtd).toBe("—")
    expect(labels.tareaPtd).toBe("—")
  })
})
