import type { CriterionId } from "../../schemas/checklist"

export type MeiExportHito = {
  id: string
  sheetName: string
  tituloHito: string
  actividades: number[]
  criterios: CriterionId[]
  fechaInicioActividad: string
  fechaTerminoActividad: string
  fechaHito: string
  /** Si false, la hoja solo lleva nota de evidencia (sin filas de auditoría URL). */
  incluyeAuditoriasUrl: boolean
}

export const MEI_EXPORT_HITOS: MeiExportHito[] = [
  {
    id: "H01",
    sheetName: "H01_Checklist",
    tituloHito:
      "La institución cuenta con un checklist editorial obligatorio implementado en su flujo de publicación.",
    actividades: [1],
    criterios: [],
    fechaInicioActividad: "01-01-2026",
    fechaTerminoActividad: "30-06-2026",
    fechaHito: "30-06-2026",
    incluyeAuditoriasUrl: false,
  },
  {
    id: "H02",
    sheetName: "H02_Ortografia_LC",
    tituloHito:
      "El sitio publica contenidos redactados en lenguaje claro, sin errores ortográficos ni gramaticales.",
    actividades: [2],
    criterios: [
      "B1",
      "B2",
      "B3",
      "B4",
      "B5",
      "B6",
      "B7",
      "C1",
      "C2",
      "C3",
      "C4",
      "C5",
      "C6",
      "C7",
      "D1",
      "D2",
      "D7",
    ],
    fechaInicioActividad: "02-03-2026",
    fechaTerminoActividad: "30-06-2026",
    fechaHito: "30-06-2026",
    incluyeAuditoriasUrl: true,
  },
  {
    id: "H03",
    sheetName: "H03_LC_positivo",
    tituloHito:
      "Los contenidos están redactados en lenguaje claro, positivo y cercano, con siglas definidas.",
    actividades: [3],
    criterios: ["B2", "B3", "B4", "B5", "B6", "B7"],
    fechaInicioActividad: "01-04-2026",
    fechaTerminoActividad: "31-12-2026",
    fechaHito: "31-12-2026",
    incluyeAuditoriasUrl: true,
  },
  {
    id: "H04",
    sheetName: "H04_Claridad_concisa",
    tituloHito:
      "Los contenidos se presentan de manera clara y concisa, sin redundancias ni ambigüedades.",
    actividades: [4],
    criterios: ["A2", "A3", "A4", "A5", "C1", "C2", "C3", "C4", "C5", "C6", "C7"],
    fechaInicioActividad: "01-05-2026",
    fechaTerminoActividad: "31-12-2026",
    fechaHito: "31-12-2026",
    incluyeAuditoriasUrl: true,
  },
  {
    id: "H05",
    sheetName: "H05_Autoria_fecha",
    tituloHito:
      "Cada página muestra la fuente de autoría y la fecha de actualización de los contenidos.",
    actividades: [5],
    criterios: ["E2", "E3"],
    fechaInicioActividad: "01-06-2026",
    fechaTerminoActividad: "31-12-2026",
    fechaHito: "31-12-2026",
    incluyeAuditoriasUrl: true,
  },
  {
    id: "H06",
    sheetName: "H06_Condiciones_uso",
    tituloHito: "El sitio muestra de manera visible las condiciones de uso de sus contenidos.",
    actividades: [6],
    criterios: ["G3"],
    fechaInicioActividad: "01-06-2026",
    fechaTerminoActividad: "31-12-2026",
    fechaHito: "31-12-2026",
    incluyeAuditoriasUrl: true,
  },
  {
    id: "H07",
    sheetName: "H07_Datos_personales",
    tituloHito:
      "El sitio evita publicar datos personales e informa cómo ejercer derechos sobre ellos.",
    actividades: [7, 8],
    criterios: ["G1", "G2"],
    fechaInicioActividad: "01-07-2026",
    fechaTerminoActividad: "31-12-2026",
    fechaHito: "31-12-2026",
    incluyeAuditoriasUrl: true,
  },
  {
    id: "H08",
    sheetName: "H08_Formato_texto",
    tituloHito: "El sitio presenta textos alineados a la izquierda y párrafos con espaciado.",
    actividades: [9],
    criterios: ["D3", "D4"],
    fechaInicioActividad: "03-08-2026",
    fechaTerminoActividad: "31-12-2026",
    fechaHito: "31-12-2026",
    incluyeAuditoriasUrl: true,
  },
  {
    id: "H09",
    sheetName: "H09_Documentos",
    tituloHito:
      "Los documentos enlazados muestran título, formato, peso y una breve descripción.",
    actividades: [10],
    criterios: ["F1", "F3", "F4"],
    fechaInicioActividad: "03-08-2026",
    fechaTerminoActividad: "31-12-2026",
    fechaHito: "31-12-2026",
    incluyeAuditoriasUrl: true,
  },
  {
    id: "H10",
    sheetName: "H10_Dignidad_menores",
    tituloHito:
      "El sitio no publica contenidos que vulneren la dignidad, menores o vida privada.",
    actividades: [11, 12, 13],
    criterios: ["B5", "B6", "E1", "G1"],
    fechaInicioActividad: "01-09-2026",
    fechaTerminoActividad: "31-12-2026",
    fechaHito: "31-12-2026",
    incluyeAuditoriasUrl: true,
  },
  {
    id: "H11",
    sheetName: "H11_Apoyos_visuales",
    tituloHito: "El sitio presenta sus datos acompañados de apoyos visuales.",
    actividades: [14],
    criterios: [],
    fechaInicioActividad: "01-10-2026",
    fechaTerminoActividad: "31-12-2026",
    fechaHito: "31-12-2026",
    incluyeAuditoriasUrl: true,
  },
  {
    id: "H12",
    sheetName: "H12_Objetividad",
    tituloHito: "Los contenidos publicados están redactados de forma objetiva y neutra.",
    actividades: [15],
    criterios: ["B5", "B7", "E1"],
    fechaInicioActividad: "02-11-2026",
    fechaTerminoActividad: "31-12-2026",
    fechaHito: "31-12-2026",
    incluyeAuditoriasUrl: true,
  },
  {
    id: "H13",
    sheetName: "H13_Archivo",
    tituloHito:
      "Las versiones anteriores de contenidos están rotuladas como documentos de archivo no vigentes.",
    actividades: [16],
    criterios: ["H1"],
    fechaInicioActividad: "01-12-2026",
    fechaTerminoActividad: "31-12-2026",
    fechaHito: "31-12-2026",
    incluyeAuditoriasUrl: true,
  },
]

const hitoByCriterion = new Map<CriterionId, string>()
for (const hito of MEI_EXPORT_HITOS) {
  for (const criterio of hito.criterios) {
    if (!hitoByCriterion.has(criterio)) {
      hitoByCriterion.set(criterio, hito.id)
    }
  }
}

export function hitoById(id: string): MeiExportHito | undefined {
  return MEI_EXPORT_HITOS.find((h) => h.id === id)
}

export function criterioIdsForHito(hitoId: string): CriterionId[] {
  return hitoById(hitoId)?.criterios ?? []
}

export function hitoIdForCriterio(criterioId: CriterionId): string | null {
  return hitoByCriterion.get(criterioId) ?? null
}
