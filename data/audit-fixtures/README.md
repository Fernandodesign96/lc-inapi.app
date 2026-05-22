# Fixtures de auditoría — JSON (`data/audit-fixtures/`)

Registros de auditoría **completos** (mock o volcados desde informe editorial) en formato JSON. Cada archivo debe pasar **`strictAuditRecordSchema`** en [`src/schemas/checklist.ts`](../../src/schemas/checklist.ts) (validación con `summarizeEvaluations` sobre las **39** filas de `criterios_evaluados`).

**Documentación de producto / ejemplo humano (rechazado):** [`docs/ux/audit-fixture-ejemplo-notificaciones-marcas-rechazado.md`](../../docs/ux/audit-fixture-ejemplo-notificaciones-marcas-rechazado.md)

**Contexto de hito (Fase 1):** el ítem **Fixtures de auditoría** está cerrado en [`docs/ROADMAP.md`](../../docs/ROADMAP.md); la bitácora de implementación está en [`docs/development/DEVLOG.md`](../../docs/development/DEVLOG.md#devlog-2026-05-21-fixtures-implementacion).

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

Archivo **aparte** de los fixtures: lista ids y etiquetas para un selector en la UI. **No** se valida con `strictAuditRecordSchema`. El script `validate:audit-fixtures` **lo excluye** del barrido de fixtures.

---

## Regenerar los JSON (script de generación)

Tras **cambiar el informe editorial**, el **contrato Zod** (`strictAuditRecordSchema` / `summarizeEvaluations`) o los **conteos** de una franja, regenera los tres archivos desde código para evitar desalineación manual:

```bash
bun run src/scripts/generate-audit-fixture-json-files.ts
```

- **Ubicación del script:** [`src/scripts/generate-audit-fixture-json-files.ts`](../../src/scripts/generate-audit-fixture-json-files.ts) (raíz del monorepo, no dentro de `frontend/`).
- **Qué hace:** importa helpers desde `src/schemas/checklist.ts`, valida con `strictAuditRecordSchema.parse` y escribe `audit_fixture_*.json` en esta carpeta.
- **Después:** ejecutar `bun run validate:audit-fixtures` y, en local, `bun run typecheck:all` (incluye ambas validaciones de datos y los typecheck).

Si el script deja de usarse en el día a día, **no lo borres sin actualizar esta documentación**: sirve como referencia ejecutable del molde correcto de los fixtures.

---

## Validación automática

Desde la **raíz** del monorepo:

```bash
bun run validate:audit-fixtures
```

También se ejecuta como parte de `bun run typecheck:all` (junto con `validate:checklist` y los `tsc` de raíz y `frontend`).

---

## Variable de entorno `LC_REPO_ROOT` (API Next y lectura de `data/`)

El route handler en `frontend/src/app/api/audit-fixtures/[fixtureId]/route.ts` resuelve los JSON con la raíz del monorepo así:

- Por defecto: `join(process.cwd(), "..")`, pensando en `next dev` / `next build` con **`process.cwd()` = `frontend/`**.
- Si en tu entorno el `cwd` **no** es `frontend/` (CI, contenedor u otra disposición del monorepo), define **`LC_REPO_ROOT`** apuntando a la carpeta que contiene **`data/`** y **`src/`** (raíz del repo `lc-inapi-app`).

Ejemplo (Linux/macOS, sesión actual):

```bash
export LC_REPO_ROOT=/ruta/absoluta/a/lc-inapi-app
bun run --cwd frontend dev
```

Sin esta variable en entornos donde el `cwd` no coincide, la API puede responder 404 aunque el archivo exista en el repositorio.
