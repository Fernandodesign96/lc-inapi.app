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
      auditoriasRef: "24",
      ultimaRevisionRef: "2026-05-02",
      nota: "Alta rotación editorial en home.",
    },
    {
      rank: 2,
      paginaRef: "https://tramites.inapi.cl/Notificaciones",
      auditoriasRef: "19",
      ultimaRevisionRef: "2026-04-28",
      nota: "Seguimiento recurrente en marcas.",
    },
    {
      rank: 3,
      paginaRef: "https://tramites.inapi.cl/Account/Login",
      auditoriasRef: "16",
      ultimaRevisionRef: "2026-04-15",
      nota: "Flujo de acceso con varias iteraciones.",
    },
    {
      rank: 4,
      paginaRef:
        "https://tramites.inapi.cl/Trademark/TrademarkUserDocument/SuccessConfirmation",
      auditoriasRef: "12",
      ultimaRevisionRef: "2026-03-30",
      nota: "Escritos y confirmaciones frecuentes.",
    },
    {
      rank: 5,
      paginaRef: "https://tramites.inapi.cl/Trademark/TrademarkFile",
      auditoriasRef: "11",
      ultimaRevisionRef: "2026-03-10",
      nota: "Expediente con revisiones periódicas.",
    },
  ] as const