/**
 * Lista demostrativa "URLs con estados resueltos" (mock Fase 1).
 * Estados y fechas son referencia editorial para la demo, no persistencia real.
 */
export type ResolvedLcStateRow = {
    rank: number
    paginaRef: string
    estadoLcFinalRef: string
    fechaCierreRef: string
    observacion: string
  }
  
  export const RESOLVED_LC_STATE_ROWS: readonly ResolvedLcStateRow[] = [
    {
      rank: 1,
      paginaRef: "https://www.inapi.cl/",
      estadoLcFinalRef: "Aprobado",
      fechaCierreRef: "2026-04-20",
      observacion: "Cierre tras ajustes de titulares y enlaces.",
    },
    {
      rank: 2,
      paginaRef: "https://tramites.inapi.cl/Account/Register",
      estadoLcFinalRef: "Aceptado con observaciones",
      fechaCierreRef: "2026-04-05",
      observacion: "Microcopy de errores y ayudas actualizado.",
    },
    {
      rank: 3,
      paginaRef: "https://tramites.inapi.cl/EstadosDiariosMarcas",
      estadoLcFinalRef: "Aceptado con observaciones",
      fechaCierreRef: "2026-03-22",
      observacion: "Tablas y encabezados alineados al checklist.",
    },
    {
      rank: 4,
      paginaRef: "https://tramites.inapi.cl/TrademarkNizaClassifier",
      estadoLcFinalRef: "Rechazado",
      fechaCierreRef: "2026-02-18",
      observacion: "Cierre documental; pendiente nueva ronda LC.",
    },
    {
      rank: 5,
      paginaRef: "https://tramites.inapi.cl/NotificacionesPatentes",
      estadoLcFinalRef: "Aprobado",
      fechaCierreRef: "2026-01-30",
      observacion: "Homologación de términos con glosario INAPI.",
    },
  ] as const