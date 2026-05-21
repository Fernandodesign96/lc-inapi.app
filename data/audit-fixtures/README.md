# Fixtures de auditoría — JSON (`data/audit-fixtures/`)

Registros de auditoría **completos** (mock o volcados desde informe editorial) en formato JSON. Cada archivo debe pasar **`strictAuditRecordSchema`** en [`src/schemas/checklist.ts`](../../src/schemas/checklist.ts) (validación con `summarizeEvaluations` sobre las **39** filas de `criterios_evaluados`).

**Documentación de producto / ejemplo humano (rechazado):** [`docs/ux/audit-fixture-ejemplo-notificaciones-marcas-rechazado.md`](../../docs/ux/audit-fixture-ejemplo-notificaciones-marcas-rechazado.md)

**Plan de implementación (Fase 1):** [`docs/development/plan-fixtures-auditoria-fase1.md`](../../docs/development/plan-fixtures-auditoria-fase1.md)

---

## Convención de nombres

| Regla | Detalle |
| --- | --- |
| **Ubicación** | Solo archivos `*.json` de fixture en esta carpeta (salvo `manifest.json`, si existe). |
| **Archivo** | Un fixture = un archivo: `{fixtureId}.json`. |
| **Campo `id` dentro del JSON** | Debe ser **exactamente** el mismo string que `{fixtureId}` (mismo id que usará la UI y la allowlist del API). |
| **Ejemplo de id** | `audit_fixture_notificaciones_marcas_rechazado` → archivo `audit_fixture_notificaciones_marcas_rechazado.json`. |

---

## `manifest.json` (opcional)

Archivo **aparte** de los fixtures: lista ids y etiquetas para un selector en la UI. **No** se valida con `strictAuditRecordSchema`. Si está presente, el script `validate:audit-fixtures` (cuando lo implementes) debe **excluirlo** del barrido de fixtures y, si quieres, validarlo con un esquema Zod pequeño propio.

---

## Comando de validación (cuando exista el script)

Desde la raíz del monorepo:

```bash
bun run validate:audit-fixtures