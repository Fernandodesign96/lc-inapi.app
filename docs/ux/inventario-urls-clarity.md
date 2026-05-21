# Inventario de URLs — tráfico Clarity y priorización LC

**Propósito:** una sola fuente de verdad **documental** para el equipo UX/editorial: qué páginas concentran visitas o interacción según **Microsoft Clarity** y cómo se relacionan con el **seguimiento de lenguaje claro** en el aplicativo mock (Fase 1).

**Alcance:** Clarity informa **comportamiento y volumen** en el sitio; **no** sustituye una evaluación LC automática. Las columnas de **% cumplimiento LC** y **estado** (rechazado / aceptado con observaciones / aprobado) reflejan **criterio editorial de referencia** al momento de registrar esta tabla, salvo donde exista fixture validado en repo.

**URLs canónicas:** las **20 rutas** listadas abajo provienen del informe Clarity como **rutas o etiquetas de pantalla**. Donde falte `https://…`, el equipo debe completar el enlace absoluto (p. ej. `https://tramites.inapi.cl/…` o `https://www.inapi.cl/…`) en una revisión posterior; hasta entonces el inventario sirve como **backlog de seguimiento** y subtítulo de referencia en la UI.

---

## 1. Tres URLs priorizadas (atajos editoriales — mock Fase 1)

Estas tres direcciones son las **prioridades demostrativas** acordadas: representan **peor**, **intermedia** y **mejor** desempeño respecto al checklist LC en la referencia actual del equipo. En implementación mock, los atajos en **`/auditar`** deben navegar **directo a resultado** con datos coherentes con ese perfil (fixtures o generador mock alineado).

| Perfil | Nombre (producto) | URL canónica |
| --- | --- | --- |
| **Peor** (rechazado; menor %) | Notificaciones Marcas | `https://tramites.inapi.cl/Notificaciones` |
| **Intermedia** (rechazada; mayor % que la peor) | Presentación de Escritos — INAPI — Sitio de Trámites | `https://tramites.inapi.cl/Trademark/TrademarkUserDocument/SuccessConfirmation` |
| **Mejor** (única aceptada en referencia) | Homepage | `https://www.inapi.cl/` |

**Informe completo → fixture (ejemplo):** el caso **Notificaciones Marcas** (55,2 %; rechazado) está volcado como referencia humana para el primer JSON de `data/audit-fixtures/` en [`audit-fixture-ejemplo-notificaciones-marcas-rechazado.md`](audit-fixture-ejemplo-notificaciones-marcas-rechazado.md). Los otros dos perfiles de la tabla deben tener el mismo nivel de detalle cuando existan informes cerrados; mientras tanto ver [`docs/development/plan-fixtures-auditoria-fase1.md`](../development/plan-fixtures-auditoria-fase1.md) §2.2–2.3.

---

## 2. Inventario ampliado — ~20 URLs más visitadas / interactuadas (Clarity)

### 2.1 Presentación en la pantalla `/auditar`

La tabla de esta sección (y otras listas de seguimiento similares, p. ej. **URLs más auditadas** o **URLs con estados resueltos**) debe mostrarse **dentro de una barra colapsable** en `/auditar`, no como texto suelto: **título en la cabecera** del acordeón (puede reutilizar o acortar el subtítulo sugerido abajo), **icono flecha hacia abajo** en el trigger, contenido expandido con la tabla. **Mismo patrón y mismo `gap` vertical** entre todas las barras de la página, según [`docs/DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md) §15.

**Subtítulo sugerido como título de la barra (o primera línea del trigger):** «Prioridades evidenciadas en **Microsoft Clarity** (volumen e interacción); estados LC según referencia editorial.»

Orden por volumen relativo en el extracto entregado al repositorio (sin pretender ser un dump crudo de Clarity).

| # | Ruta o etiqueta (Clarity) | Visitas (ref.) | % LC (ref.) | Estado (ref.) |
| --- | --- | --- | --- | --- |
| 1 | Home `tramites.inapi.cl/` | 432.572 | 60,0 % | Rechazado |
| 2 | `Account/Login` | 209.811 | 65,2 % | Rechazado |
| 3 | `Trademark/TrademarkFile` (Expediente) | 198.337 | 61,5 % | Rechazado |
| 4 | Notificaciones Marcas | 79.775 | 55,2 % | Rechazado |
| 5 | `TrademarkSavedApplications` | 65.628 | 64,3 % | Rechazado |
| 6 | `TrademarkApplication/IndexTrademark` | 41.429 | 57,1 % | Rechazado |
| 7 | `Login/claveunica` (Registro CU) | 38.519 | 62,1 % | Rechazado |
| 8 | `LoadTrademarkApplication` (paso 1) | 37.468 | 61,3 % | Rechazado |
| 9 | `EstadosDiariosMarcas` | 31.929 | 70,4 % | Rechazado |
| 10 | `TrademarkNizaClassifier` | 30.947 | 67,7 % | Rechazado |
| 11 | `TrademarkUserDocument/SuccessConfirmation` | 23.779 | 72,0 % | Rechazado |
| 12 | `TrademarkUserDocument` (Escritos) | 23.141 | 63,0 % | Rechazado |
| 13 | Confirmación Solicitud Marca | 21.825 | 57,7 % | Rechazado |
| 14 | `LoadTrademarkApplication` (revisión) | 18.654 | 59,4 % | Rechazado |
| 15 | `Account/Register` | 17.603 | 55,9 % | Rechazado |
| 16 | `TrademarkSecondPayment/SuccessConfirmation` | 14.609 | 68,0 % | Rechazado |
| 17 | `TrademarkAnnotation` | 13.600 | 59,3 % | Rechazado |
| 18 | `EstadosDiariosPatentes` | 12.628 | 70,4 % | Rechazado |
| 19 | `TrademarkRenewalApplication` | 12.528 | 70,8 % | Rechazado |
| 20 | `NotificacionesPatentes` | 12.271 | 56,7 % | Rechazado |

**Nota:** completar columna de URL absoluta en una pasada editorial cuando se consoliden enlaces por fila (p. ej. prefijo `https://tramites.inapi.cl/` salvo páginas institucionales en `https://www.inapi.cl/`).

---

## 3. Política de datos (`docs/ux/` vs `data/`)

- **`docs/ux/`** (este archivo): inventario **humano**, contexto Clarity, notas y prioridades; versionado con el repo; adecuado para definir **títulos de barra** y copy que luego implementa el frontend en acordeones (`/auditar`).
- **`data/`:** reservado para artefactos **máquina-legibles** (p. ej. JSON consumido por la UI o CI) cuando el equipo decida generar fixtures o listas validadas por script; hasta entonces no es obligatorio duplicar esta tabla en JSON.

---

*Última revisión documental: 2026-05-18 — alineado a [`docs/ROADMAP.md`](../ROADMAP.md), [`docs/PRD.md`](../PRD.md) y [`docs/DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md) §15 (barras colapsables).*
