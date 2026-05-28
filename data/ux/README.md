# Inventarios UX — JSON de apoyo (Fase 1 mock)

Archivos máquina-legibles alineados a las tablas mostradas en **`/auditar`** (inventarios y seguimiento). La fuente editorial sigue siendo [`docs/ux/inventario-urls-clarity.md`](../../docs/ux/inventario-urls-clarity.md) donde aplique.

| Archivo | Contenido | Par en código |
| --- | --- | --- |
| `clarity-fichas-mock.json` | **Maestro** — 20 fichas Clarity (URL, métricas, encargado, auditorías, historial) | `frontend/src/lib/clarity-fichas-mock.ts` |
| `clarity-inventory.json` | Espejo resumido ~20 filas (opcional; tabla deriva del maestro) | `frontend/src/lib/clarity-inventory-rows.ts` |
| `resolved-lc-states.json` | Estados LC resueltos (mock) | `frontend/src/lib/resolved-lc-state-rows.ts` |

**Mantenimiento:** si cambia una fila en el `.ts` o en el documento UX, actualizar el JSON correspondiente (o automatizar en un script futuro). No hay validación CI dedicada a estos archivos en Fase 1; opcional según [`docs/ROADMAP.md`](../../docs/ROADMAP.md).
