import { describe, expect, test } from "bun:test"

import { loadMetaMeiAudits } from "./mei-audit-loader"
import { buildHitosTareasCriteriosRows } from "./mei-hitos-tareas-criterios"
import { buildMeiWorkbook } from "./mei-xlsx-writer"

const ROOT = process.cwd()

describe("buildHitosTareasCriteriosRows", () => {
  test("genera filas con ordinales y estado MEI para auditorías META MEI", () => {
    const audits = loadMetaMeiAudits(ROOT)
    expect(audits.length).toBeGreaterThan(0)

    const rows = buildHitosTareasCriteriosRows([audits[0]!], ROOT)
    expect(rows.length).toBeGreaterThan(0)
    expect(rows.every((r) => r.hito >= 1 && r.tarea >= 1 && r.criterio >= 1)).toBe(
      true,
    )
    expect(rows.every((r) => r.descripcionHito.trim().length > 0)).toBe(true)
    expect(rows.every((r) => r.descripcionTarea.trim().length > 0)).toBe(true)
    expect(rows.every((r) => r.descripcionCriterio.trim().length > 0)).toBe(true)
    expect(rows[0]!.url).toBe(audits[0]!.url)

    for (let i = 1; i < rows.length; i++) {
      const prev = rows[i - 1]!
      const cur = rows[i]!
      const ordered =
        cur.hito > prev.hito ||
        (cur.hito === prev.hito && cur.tarea > prev.tarea) ||
        (cur.hito === prev.hito &&
          cur.tarea === prev.tarea &&
          cur.criterio >= prev.criterio)
      expect(ordered).toBe(true)
    }
  })

  test("consolida varias URLs en orden de rank", () => {
    const audits = loadMetaMeiAudits(ROOT).slice(0, 2)
    if (audits.length < 2) return

    const rows = buildHitosTareasCriteriosRows(audits, ROOT)
    const firstUrlEnd = rows.findIndex((r) => r.url === audits[1]!.url)
    expect(firstUrlEnd).toBeGreaterThan(0)
    expect(rows.slice(0, firstUrlEnd).every((r) => r.url === audits[0]!.url)).toBe(
      true,
    )
  })
})

describe("buildMeiWorkbook — pestaña Hitos-Tareas-Criterios", () => {
  test("incluye la pestaña en export de una URL y consolidado", async () => {
    const audits = loadMetaMeiAudits(ROOT)
    expect(audits.length).toBeGreaterThan(0)

    const one = await buildMeiWorkbook({
      root: ROOT,
      audits: [audits[0]!],
    })
    expect(one.worksheets.map((s) => s.name)).toContain("Hitos-Tareas-Criterios")
    const sheetOne = one.getWorksheet("Hitos-Tareas-Criterios")!
    expect(sheetOne.getCell(1, 1).value).toBe("URL")
    expect(sheetOne.getCell(1, 5).value).toBe("Estado")
    expect(sheetOne.getCell(2, 2).value).toBeNumber()

    const many = await buildMeiWorkbook({
      root: ROOT,
      audits: audits.slice(0, Math.min(2, audits.length)),
    })
    const sheetMany = many.getWorksheet("Hitos-Tareas-Criterios")!
    expect(String(sheetMany.getCell(1, 1).value)).toMatch(/^URL \d+ —/)
  })
})
