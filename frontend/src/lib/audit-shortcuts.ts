/** Perfil LC mock para coherencia con resultado por atajo editorial. */
export type EditorialShortcutPerfil = "peor" | "intermedio" | "mejor"

/** Atajos editoriales mock — alineado a `docs/ux/inventario-urls-clarity.md` §1 */
export const EDITORIAL_AUDIT_SHORTCUTS = [
  {
    perfil: "peor" as const,
    perfilLabel: "Perfil peor (rechazado)",
    label: "Notificaciones Marcas",
    url: "https://tramites.inapi.cl/Notificaciones",
    bordeHex: "#FB3B3B",
  },
  {
    perfil: "intermedio" as const,
    perfilLabel: "Perfil intermedio (aceptado con observaciones)",
    label:
      "Presentación de Escritos — INAPI — Sitio de Trámites",
    url: "https://tramites.inapi.cl/Trademark/TrademarkUserDocument/SuccessConfirmation",
    bordeHex: "#FFC107",
  },
  {
    perfil: "mejor" as const,
    perfilLabel: "Perfil mejor (aceptada en referencia)",
    label: "Homepage",
    url: "https://www.inapi.cl/",
    bordeHex: "#4CAF50",
  },
] as const