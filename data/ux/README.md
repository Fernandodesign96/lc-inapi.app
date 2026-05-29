# Inventarios UX — JSON de apoyo (Fase 1 mock)

Archivos máquina-legibles alineados a las tablas mostradas en **`/auditar`** (inventarios y seguimiento). La fuente editorial sigue siendo [`docs/ux/inventario-urls-clarity.md`](../../docs/ux/inventario-urls-clarity.md) donde aplique.

| Archivo | Contenido | Par en código |
| --- | --- | --- |
| `clarity-fichas-mock.json` | **Maestro** — 22 fichas Calidad Web (URL, **`type_url`**, métricas, encargado, auditorías, historial) | `frontend/src/lib/clarity-fichas-mock.ts` |
| `clarity-inventory.json` | Espejo resumido 22 filas (opcional; tabla deriva del maestro; sin `type_url` en espejo) | `frontend/src/lib/clarity-inventory-rows.ts` |

**Deprecado (2026-05-28):** `resolved-lc-states.json` y `resolved-lc-state-rows.ts` — sustituidos por la tabla única de historial LC y observaciones en ficha.

**Mantenimiento:** si cambia una fila en el `.ts` o en el documento UX, actualizar el JSON correspondiente (o automatizar en un script futuro). No hay validación CI dedicada a estos archivos en Fase 1; opcional según [`docs/ROADMAP.md`](../../docs/ROADMAP.md).
