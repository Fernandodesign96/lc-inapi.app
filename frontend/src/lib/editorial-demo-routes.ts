/**
 * Fuente única para las tres URLs de demostración (perfil LC + fixture en repo).
 * Alineado a `docs/ux/inventario-urls-clarity.md` §1 y a `data/audit-fixtures/`.
 */
export type EditorialShortcutPerfil = "peor" | "intermedio" | "mejor"

export const EDITORIAL_DEMO_ROUTES = [
  {
    perfil: "peor" as const,
    perfilLabel: "Perfil peor (rechazado)",
    label: "Notificaciones Marcas",
    url: "https://tramites.inapi.cl/Notificaciones",
    bordeHex: "#FB3B3B",
    fixtureId: "audit_fixture_notificaciones_marcas_rechazado",
    fixtureLaunchLabel:
      "Notificaciones Marcas (rechazado — ejemplo editorial)",
  },
  {
    perfil: "intermedio" as const,
    perfilLabel: "Perfil intermedio (aceptado con observaciones)",
    label: "Presentación de Escritos — INAPI — Sitio de Trámites",
    url: "https://tramites.inapi.cl/Trademark/TrademarkUserDocument/SuccessConfirmation",
    bordeHex: "#FFC107",
    fixtureId: "audit_fixture_presentacion_escritos_observaciones",
    fixtureLaunchLabel:
      "Presentación de escritos / confirmación (aceptado con observaciones — mock numérico)",
  },
  {
    perfil: "mejor" as const,
    perfilLabel: "Perfil mejor (aceptada en referencia)",
    label: "Homepage",
    url: "https://www.inapi.cl/",
    bordeHex: "#4CAF50",
    fixtureId: "audit_fixture_home_inapi_aprobado",
    fixtureLaunchLabel: "Home INAPI (aprobado — mock numérico)",
  },
] as const

export type EditorialDemoRoute = (typeof EDITORIAL_DEMO_ROUTES)[number]
