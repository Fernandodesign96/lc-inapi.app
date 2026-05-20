# Inventarios UX — JSON de apoyo (Fase 1 mock)

Archivos máquina-legibles alineados a las tablas mostradas en **`/auditar`** (inventarios y seguimiento). La fuente editorial sigue siendo [`docs/ux/inventario-urls-clarity.md`](../../docs/ux/inventario-urls-clarity.md) donde aplique.

| Archivo | Contenido | Par en código |
| --- | --- | --- |
| `clarity-inventory.json` | ~20 filas Clarity (referencia editorial) | `frontend/src/lib/clarity-inventory-rows.ts` |
| `most-audited-urls.json` | URLs más auditadas (mock) | `frontend/src/lib/most-audited-url-rows.ts` |
| `resolved-lc-states.json` | Estados LC resueltos (mock) | `frontend/src/lib/resolved-lc-state-rows.ts` |

**Mantenimiento:** si cambia una fila en el `.ts` o en el documento UX, actualizar el JSON correspondiente (o automatizar en un script futuro). No hay validación CI dedicada a estos archivos en Fase 1; opcional según [`docs/ROADMAP.md`](../../docs/ROADMAP.md).
