/**
 * Lista demostrativa "URLs más auditadas" (mock Fase 1).
 * Sustituir o alimentar desde fixtures cuando el producto defina la fuente.
 */
export type MostAuditedUrlRow = {
    rank: number
    paginaRef: string
    auditoriasRef: string
    ultimaRevisionRef: string
    nota: string
  }
  
  export const MOST_AUDITED_URL_ROWS: readonly MostAuditedUrlRow[] = [
    {
      rank: 1,
      paginaRef: "https://www.inapi.cl/",
      auditoriasRef: "5",
      ultimaRevisionRef: "2026-05-02",
      nota: "Alta rotación editorial en home.",
    },
    {
      rank: 2,
      paginaRef: "https://tramites.inapi.cl/Notificaciones",
      auditoriasRef: "2",
      ultimaRevisionRef: "2026-05-25",
      nota: "Seguimiento recurrente en marcas.",
    },
    {
      rank: 3,
      paginaRef: "https://tramites.inapi.cl/Account/Login",
      auditoriasRef: "4",
      ultimaRevisionRef: "2026-05-27",
      nota: "Flujo de acceso con varias iteraciones.",
    },
    {
      rank: 4,
      paginaRef:
        "https://tramites.inapi.cl/Trademark/TrademarkUserDocument/SuccessConfirmation",
      auditoriasRef: "1",
      ultimaRevisionRef: "2026-03-30",
      nota: "Escritos y confirmaciones frecuentes.",
    },
    {
      rank: 5,
      paginaRef: "https://tramites.inapi.cl/Trademark/TrademarkFile",
      auditoriasRef: "3",
      ultimaRevisionRef: "2026-05-26",
      nota: "Expediente con revisiones periódicas.",
    },
    {
      rank: 6,
      paginaRef:
        "https://tramites.inapi.cl/Trademark/TrademarkAnnotation (mock)",
      auditoriasRef: "No aplica",
      ultimaRevisionRef: "1",
      nota: "Volumen de auditorías LC no consolidado en referencia mock.",
    },
    {
      rank: 7,
      paginaRef: "https://tramites.inapi.cl/Help/FAQ (mock)",
      auditoriasRef: "No aplica (ref.)",
      ultimaRevisionRef: "1",
      nota: "Página de ayuda fuera del alcance del seguimiento interno LC en Fase 1.",
    },
  ] as const