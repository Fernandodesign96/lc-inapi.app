# Plan: fixtures de auditoría (Fase 1)

**Estado:** plan de implementación (código lo aplica el equipo; este archivo es la referencia versionada en el repo).

**Roadmap:** [`docs/ROADMAP.md`](../ROADMAP.md) — ítem «Fixtures de auditoría».

---

## Contexto del contrato (lógica que debes respetar)

- El tipo estricto vive en [`src/schemas/checklist.ts`](../../src/schemas/checklist.ts): `strictAuditRecordSchema` = `auditRecordSchema` + `superRefine` que **recalcula** el resumen con `summarizeEvaluations` sobre las **39** filas de `criterios_evaluados` y exige igualdad en:
  - `criterios_aprobados`, `criterios_aplicables`, `criterios_no_aplica`, `porcentaje_cumplimiento`, `estado_aceptacion`
- **Porcentaje:** `aplicables = 39 - no_aplica`; `porcentaje_cumplimiento = aplicables === 0 ? 0 : Math.round((cumple / aplicables) * 1000) / 10` (un decimal).
- **Franjas** (`acceptanceStatusFromPercentage`): `≤ 80` → `rechazado`; `81`–`90.9…` → `aceptado_con_observaciones`; `≥ 91` → `aprobado` (umbral superior **91**, no 90).

Cualquier JSON que no cuadre con esa suma **fallará** la validación: no basta con inventar porcentaje y estado; hay que derivarlos de las 39 evaluaciones (o generar el objeto con las helpers del mismo archivo, p. ej. `buildDemoStrictAuditWithCumpleCount`).

---

## Paso 1 — Convención de carpetas y documentación

- Directorio canónico: **`data/audit-fixtures/`** (alineado al roadmap).
- **Nombres de archivo = identificador estable**; el campo `id` **dentro** del JSON debe coincidir con el identificador que use la UI y la lista blanca del API.
- Opcional: **`manifest.json`** (no validado por `strictAuditRecordSchema`) con `id`, `label`, `band_esperada` para el selector.
- **Ejemplo editorial rechazado ya documentado:** [`docs/ux/audit-fixture-ejemplo-notificaciones-marcas-rechazado.md`](../ux/audit-fixture-ejemplo-notificaciones-marcas-rechazado.md) (URL `https://tramites.inapi.cl/Notificaciones`, 55,2 %, 16/29 aplicables, 10 N/A, 13 incumplidos).

---

## Paso 2 — Contenido de los 2–3 JSON (tres franjas)

### 2.1 Fixture «rechazado» (≤80 %) — fuente humana lista

- **Base cualitativa:** el documento [`docs/ux/audit-fixture-ejemplo-notificaciones-marcas-rechazado.md`](../ux/audit-fixture-ejemplo-notificaciones-marcas-rechazado.md) (texto capturado, listas de IDs cumple / incumple / no aplica, severidades resumidas, texto propuesto, observaciones).
- **Materialización en JSON:** construir las **39** entradas de `criterios_evaluados` con `estado` y orden `CRITERION_IDS`; rellenar `severidad` y `comentario` en incumplidos de forma coherente con el informe (y con `enrichCriterionEvaluationsForMock` solo si se desea alinear al mock rotativo actual — no obligatorio si se setean a mano).
- **Resumen:** debe reproducir **16** cumple, **13** incumple, **10** no aplica, **55,2** %, `estado_aceptacion: "rechazado"`; si no cuadra, `strictAuditRecordSchema` fallará.
- **Sugerencia de id/archivo:** `audit_fixture_notificaciones_marcas_rechazado` (ver sección 8 del doc de ejemplo).

### 2.2 Fixture «aceptado con observaciones» (81 %–90,9 %)

- **Ideal:** mismo formato de informe que el doc de Notificaciones (secciones 1–8) cuando exista **informe cerrado** para una URL del inventario Clarity cuyo **análisis numérico** caiga en esa franja.
- **Candidata de producto (atajos actuales):** flujo «intermedio» asociado a **Presentación de escritos / confirmación** — URL de referencia en [`docs/ux/inventario-urls-clarity.md`](../ux/inventario-urls-clarity.md) §1 y fila #11 (`TrademarkUserDocument/SuccessConfirmation`, 72 % en tabla Clarity como **referencia editorial**, no necesariamente igual al % del fixture JSON).
- **Hasta tener informe completo:** se puede **congelar** un JSON válido con `buildDemoStrictAuditWithCumpleCount` y conteos que caigan en 81–90 % (como en [`frontend/src/lib/editorial-shortcut-audit-mock.ts`](../../frontend/src/lib/editorial-shortcut-audit-mock.ts) perfil `intermedio`: 29 cumple / 4 no aplica → 35 aplicables → ~82,9 %), y **sustituir** después por datos del informe real cuando esté listo. Documentar en `manifest` si el fixture es «sintético» vs «informe volcado».

### 2.3 Fixture «aprobado» (≥ 91 %)

- **Ideal:** informe cerrado para la URL **mejor** del inventario (p. ej. homepage `https://www.inapi.cl/` según §1 del inventario).
- **Hasta tener informe completo:** mismo enfoque que 2.2 con conteos que disparen ≥91 % (p. ej. perfil `mejor` del mock de atajos: 36 cumple / 2 no aplica → ~92,3 %), luego reemplazo por volcado editorial.

**Entregable:** 3 archivos `.json` en `data/audit-fixtures/` que pasen `strictAuditRecordSchema.parse`.

---

## Paso 3 — Script `validate:audit-fixtures` en la raíz

- Añadir `src/scripts/validate-audit-fixtures.ts` siguiendo el patrón de `src/scripts/validate-checklist-data.ts`: leer `data/audit-fixtures/*.json`, excluir `manifest.json`, `strictAuditRecordSchema.parse` por archivo, `process.exit(1)` si falla.
- En `package.json` raíz: `"validate:audit-fixtures": "bun run src/scripts/validate-audit-fixtures.ts"`.

---

## Paso 4 — UI: seleccionar por identificador + importar JSON

- **Route Handler** `GET /api/audit-fixtures/[fixtureId]`: leer `../data/audit-fixtures/${fixtureId}.json` desde cwd `frontend`, lista blanca de ids, validar con `strictAuditRecordSchema` en servidor.
- **`/auditar/resultado`:** prioridad: query `fixture=` → fetch API; import/pegar JSON → `parseStrictAuditRecord` en cliente; si no, flujo actual por `url`.
- **`/auditar` y `/auditar/procesando`:** propagar `fixture=` hasta resultado.

---

## Paso 5 — Cierre

- Marcar ítem en [`docs/ROADMAP.md`](../ROADMAP.md).
- Entrada en [`docs/development/DEVLOG.md`](DEVLOG.md).

---

## Modo Ask (implementación paso a paso)

Pedir en chat los fragmentos en orden: script + `package.json`, JSON (o generador), route handler, páginas `resultado` / `auditar` / `procesando`, manifest, cierre ROADMAP/DEVLOG.

---

## Checklist de tareas (seguimiento)

| # | Tarea |
| --- | --- |
| 1 | `data/audit-fixtures/` + README (convención de ids y manifest opcional) |
| 2 | JSON fixture rechazado desde doc Notificaciones + validación |
| 2b | JSON franja media (informe futuro o sintético documentado) |
| 2c | JSON franja alta (informe futuro o sintético documentado) |
| 3 | `validate:audit-fixtures` en raíz |
| 4 | API route + allowlist |
| 5 | UI resultado + import |
| 6 | UI `/auditar` + propagación `fixture` |
| 7 | ROADMAP + DEVLOG |
