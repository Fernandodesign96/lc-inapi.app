import { describe, expect, test } from "bun:test"

import {
  auditoriaDescargaFilename,
  fechaArchivoDesdeEvaluacion,
  slugFromAuditUrl,
} from "./informe-piloto-filename"

describe("slugFromAuditUrl", () => {
  test("home sitioweb", () => {
    expect(slugFromAuditUrl("https://www.inapi.cl/")).toBe("inapi-cl")
  })

  test("ruta sitioweb", () => {
    expect(slugFromAuditUrl("https://www.inapi.cl/marcas")).toBe(
      "inapi-cl-marcas",
    )
  })

  test("trámites", () => {
    expect(slugFromAuditUrl("https://tramites.inapi.cl/siac")).toBe(
      "tramites-inapi-cl-siac",
    )
  })
})

describe("fechaArchivoDesdeEvaluacion", () => {
  test("formato dd-mm-yyyy", () => {
    expect(
      fechaArchivoDesdeEvaluacion(
        "2026-08-22T20:00:00.000Z",
        "https://tramites.inapi.cl/siac",
      ),
    ).toMatch(/^\d{2}-\d{2}-\d{4}$/)
  })

  test("home fuerza 24-08-2026", () => {
    expect(
      fechaArchivoDesdeEvaluacion(
        "2026-08-20T20:00:00.000Z",
        "https://www.inapi.cl/",
      ),
    ).toBe("24-08-2026")
  })
})

describe("auditoriaDescargaFilename", () => {
  test("pdf home", () => {
    expect(
      auditoriaDescargaFilename(
        {
          url: "https://www.inapi.cl/",
          fecha_evaluacion: "2026-08-20T20:00:00.000Z",
        },
        "pdf",
      ),
    ).toBe("auditoria-inapi-cl-24-08-2026.pdf")
  })

  test("xlsx trámites", () => {
    const name = auditoriaDescargaFilename(
      {
        url: "https://tramites.inapi.cl/siac",
        fecha_evaluacion: "2026-08-22T12:00:00.000-04:00",
      },
      "xlsx",
    )
    expect(name.startsWith("auditoria-tramites-inapi-cl-siac-")).toBe(true)
    expect(name.endsWith(".xlsx")).toBe(true)
  })
})
