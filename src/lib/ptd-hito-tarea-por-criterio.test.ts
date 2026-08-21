import { describe, expect, test } from "bun:test"

import {
  coberturaPtdHitoTarea,
  ptdHitoTareaPorCriterio,
} from "./ptd-hito-tarea-por-criterio"

describe("ptdHitoTareaPorCriterio", () => {
  test("cubre los 51 criterios LC-*", () => {
    const c = coberturaPtdHitoTarea()
    expect(c.total).toBe(51)
    expect(c.conHito).toBe(51)
    expect(c.sinHito).toEqual([])
  })

  test("Fiabilidad apunta a hitos 492 y 500", () => {
    const labels = ptdHitoTareaPorCriterio("LC-1.1.1-01")
    expect(labels.hitoPtd).toContain("492")
    expect(labels.hitoPtd).toContain("500")
    expect(labels.tareaPtd).toContain("491")
    expect(labels.tareaPtd).toContain("499")
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
