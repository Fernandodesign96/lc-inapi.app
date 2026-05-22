/**
 * Metadatos de lanzamiento para fixtures versionados en data/audit-fixtures/.
 * Derivado de `EDITORIAL_DEMO_ROUTES` — mantener alineado con manifest.json y *.json.
 */
import { EDITORIAL_DEMO_ROUTES } from "@/lib/editorial-demo-routes"

export const AUDIT_FIXTURE_LAUNCHES = EDITORIAL_DEMO_ROUTES.map((row) => ({
  id: row.fixtureId,
  url: row.url,
  label: row.fixtureLaunchLabel,
})) as readonly {
  id: string
  url: string
  label: string
}[]

export type AuditFixtureLaunchRow = (typeof AUDIT_FIXTURE_LAUNCHES)[number]

export const AUDIT_FIXTURE_ID_SET = new Set<string>(
  AUDIT_FIXTURE_LAUNCHES.map((row) => row.id),
)
