/**
 * Metadatos de lanzamiento para fixtures versionados en data/audit-fixtures/.
 * Mantener alineado con manifest.json y con los archivos *.json del mismo id.
 */
export const AUDIT_FIXTURE_LAUNCHES = [
  {
    id: "audit_fixture_notificaciones_marcas_rechazado",
    label: "Notificaciones Marcas (rechazado — ejemplo editorial)",
    url: "https://tramites.inapi.cl/Notificaciones",
  },
  {
    id: "audit_fixture_presentacion_escritos_observaciones",
    label:
      "Presentación de escritos / confirmación (aceptado con observaciones — mock numérico)",
    url: "https://tramites.inapi.cl/Trademark/TrademarkUserDocument/SuccessConfirmation",
  },
  {
    id: "audit_fixture_home_inapi_aprobado",
    label: "Home INAPI (aprobado — mock numérico)",
    url: "https://www.inapi.cl/",
  },
] as const

export type AuditFixtureLaunchRow = (typeof AUDIT_FIXTURE_LAUNCHES)[number]

export const AUDIT_FIXTURE_ID_SET = new Set<string>(
  AUDIT_FIXTURE_LAUNCHES.map((row) => row.id),
)
