# Devlog — auditoría LC INAPI

Bitácora de decisiones de implementación, aprendizajes y bloqueos. Las entradas más recientes van **arriba**. Formato obligatorio: ver `.agents/workflows/devlog-standard.md`.

---

## Índice de avances

| Fecha | Entrada |
| --- | --- |
| 2026-05-29 | [Documentación: `type_url`, corrección rank 1 Trámites y 22 URLs Sitio Web](#devlog-2026-05-29-type-url-inventario) |
| 2026-05-28 | [Documentación: Inventario único — Historial LC en `/auditar`](#devlog-2026-05-28-inventario-unico-docs) |
| 2026-05-28 | [Documentación: Consistencia de inventarios, tablas y pantallas mock en `/auditar`](#devlog-2026-05-28-consistencia-inventarios-docs) |
| 2026-05-27 | [Frontend: Feedback UX — catálogo en tabla de criterios y mock de 20 fichas Clarity](#devlog-2026-05-27-feedback-ux-criterios-fichas) |
| 2026-05-22 | [Infraestructura: Etapa 1 del plan híbrido — Vercel, GitHub Actions y verificación del mock en URL](#devlog-2026-05-22-vercel-gha-etapa1) |
| 2026-05-21 | [Frontend: Fixtures de auditoría — datos, scripts, validación, API y UI](#devlog-2026-05-21-fixtures-implementacion) |
| 2026-05-21 | [Documentación: Ejemplo editorial fixtures (rechazado) + alineación inventario / roadmap](#devlog-2026-05-21-fixtures-plan-ejemplo-notificaciones) |
| 2026-05-21 | [Frontend: Estado intermedio — pantalla `/auditar/procesando`](#devlog-2026-05-21-estado-intermedio-procesando) |
| 2026-05-20 | [Frontend: Resultado mock — barra de cumplimiento, pasos a seguir y texto propuesto](#devlog-2026-05-20-resultado-mock-cierre) |
| 2026-05-20 | [Frontend: Tabla de criterios con severidad mock, jerarquía visual e inventarios alineados](#devlog-2026-05-20-tabla-severidad-inventarios) |
| 2026-05-19 | [Frontend: Cierre mock `/auditar` desde el último PR (atajos, inventarios, resultado y `data/ux`)](#devlog-2026-05-19-auditar-data-ux-devlog) |
| 2026-05-19 | [Frontend: Portal de acceso en `/` (mock v1.0, sin cabecera global)](#devlog-2026-05-19-portal-home-mock) |
| 2026-05-19 | [Documentación: Flujo home gateway, `/auditar` (atajos, Clarity) y barras colapsables](#devlog-2026-05-19-doc-flujo-auditar) |
| 2026-05-18 | [Marco visual institucional: cabecera, tema y lienzo global](#devlog-2026-05-18-marco-visual-shell) |
| 2026-05-18 | [Design system en la interfaz y contenedor ancho del flujo /auditar](#devlog-2026-05-18-design-system-ui) |
| 2026-05-16 | [Documentación alineada a propuesta técnica integral (AWS API Gateway, Lambda, roles)](#devlog-2026-05-16-documentacion) |
| 2026-05-14 | [Pantallas mock del flujo auditar (captura y resultado con 39 criterios)](#devlog-2026-05-14-pantallas-mock) |
| 2026-05-14 | [Inicialización del frontend con Next, Tailwind, shadcn y formulario URL](#devlog-2026-05-14-inicializacion-frontend) |
| 2026-05-13 | [Documentación y contratos de la fase 0 (PRD, ADR, checklist y script de validación)](#devlog-2026-05-13-fase-0) |

---

<a id="devlog-2026-05-29-type-url-inventario"></a>

## [2026-05-29] - Documentación | `type_url`, corrección rank 1 Trámites y ampliación a 22 URLs Sitio Web

### Contexto y objetivos:

Revisión del informe Clarity (docx en Drive) y capturas del panel **Mapas térmicos** (proyecto Sitio Web INAPI, 365 días). Se confirmó que el **rank 1** del inventario **no** es la home `www.inapi.cl`, sino la **landing del portal de trámites** `https://tramites.inapi.cl/` (pantalla previa al modal de login; título «Trámites y Servicios • INAPI»). Es fácil confundirla con `Account/Login` (rank 2) porque ambas comparten la misma cabecera.

Paralelamente, el extracto Clarity — configurado para **Sitio Web** — lista sobre todo URLs de **`tramites.inapi.cl`**, mientras la URL con **más visitas** es **`www.inapi.cl/tramites/tramites-digitales`** (~16.059): página **informativa** con acordeones RNT (no el portal de aplicación). Clarity ranks 1, 2, 5, 11 y 12 son **variantes de URL** de esa misma pantalla (http/https, www, `inapi.gob.cl`). La **home** `https://www.inapi.cl/` **no aparece** en el top revisado.

**Decisión:** mantener **una sola tabla**; distinguir filas con **`type_url`**: `tramites` | `sitioweb`; añadir filtro UI **URLs Trámites / URLs Sitio Web**; ampliar inventario a **22 URLs** (ranks 21–22: home + Trámites digitales).

### Implementación técnica:

- **Documentos actualizados:** [`docs/ux/inventario-urls-clarity.md`](../ux/inventario-urls-clarity.md) (§2.0 tipos, tabla 22 filas, esquema `type_url`), [`docs/ROADMAP.md`](../ROADMAP.md) (Etapa **5b** pendiente), [`docs/PRD.md`](../PRD.md) (v0.3.9), [`docs/DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md) §15, [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md), [`docs/DATABASE.md`](../DATABASE.md), [`README.md`](../../README.md).
- **Pendiente en código/JSON:** corregir rank 1 en [`data/ux/clarity-fichas-mock.json`](../../data/ux/clarity-fichas-mock.json); añadir ranks 21–22; propagar `type_url` a tipos TS y filtro en `clarity-inventory-historial-table.tsx`.

### Próximos pasos:

- **Etapa 5b (Ask + implementación):** JSON + tipos + filtro `type_url` + columna Tipo.
- **Etapa 5c:** copy UI tarjeta/acordeón.
- **Nota:** entradas previas del 2026-05-28 que asumían rank 1 = `www.inapi.cl` quedan **supersedidas** en rank 1 y conteo de filas.

---

<a id="devlog-2026-05-28-inventario-unico-docs"></a>

## [2026-05-28] - Documentación | Inventario único — Historial LC en `/auditar`

### Contexto y objetivos:

Tras cerrar en código la **fusión de «URLs más auditadas»** en la tabla Clarity (commit `b2c6b0e`) y revisar la pantalla `/auditar` con el equipo, se acordó que la sección **«URLs con estados LC resueltos»** (antes planificada como «Estados URLs») **sobra**: las **20 URLs Clarity** concentran ya visitas, auditorías, última revisión, % LC y estado; lo único distintivo del segundo acordeón eran las **observaciones**, que deben vivir en **`/auditar/inventario/clarity/[rank]`** (breve en contexto editorial, con detalle desarrollable).

Objetivo de esta entrada: **actualizar `docs/`** para reflejar **un solo** inventario LC en `/auditar`, título **Historial de Auditoría LC - URLs INAPI**, y **Etapa 5** con filtros/orden en esa tabla única (estado, visitas, auditorías, última revisión, % LC; sin filtro por encargado ni observación).

### Implementación técnica:

- **Decisión de producto:** suprimir acordeón «URLs con estados LC resueltos» / «Estados URLs»; deprecar `resolved-lc-state-rows.ts` y `resolved-lc-states.json` en implementación **2c.1** (código pendiente).
- **Título objetivo del acordeón:** **Historial de Auditoría LC - URLs INAPI**.
- **Observaciones:** campo `observaciones` (y opcional detalle) en [`data/ux/clarity-fichas-mock.json`](../../data/ux/clarity-fichas-mock.json) / ficha §2.2; migrar copy editorial de URLs coincidentes con el antiguo listado resolved (ranks 1, 9, 10, 15, 20) en **2c.3**.
- **Filtros planificados (Etapa 5):** filtro por bucket de estado LC; orden asc/desc por visitas, auditorías, última revisión y % LC.
- **Documentos actualizados:** [`docs/ux/inventario-urls-clarity.md`](../ux/inventario-urls-clarity.md) (§2 renombrado, §4 deprecaciones, diagrama §4), [`docs/ROADMAP.md`](../ROADMAP.md), [`docs/PRD.md`](../PRD.md) (v0.3.7), [`docs/DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md) §13.1 y §15, [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md).

### Próximos pasos:

- **2c.1 (código):** eliminar acordeón y archivos `resolved-lc-*` en UI y repo.
- **2c.2–2c.3:** renombrar título del acordeón, enriquecer observaciones en fichas.
- **2b.4:** auditorías y última revisión en resumen de ficha.
- **Etapa 5:** componente cliente con filtros y orden en tabla única.
- **Nota:** la entrada [Consistencia de inventarios (misma fecha)](#devlog-2026-05-28-consistencia-inventarios-docs) describía **dos** acordeones; queda **supersedida** en lo relativo a «Estados URLs».

---

<a id="devlog-2026-05-28-consistencia-inventarios-docs"></a>

## [2026-05-28] - Documentación | Consistencia de inventarios, tablas y pantallas mock en `/auditar`

### Contexto y objetivos:

Tras el feedback UX (Bernarda/Álvaro, mayo 2026) y la implementación parcial de las **etapas 1–3** (tabla de criterios en resultado, **20 fichas** Clarity y ruta de detalle), el equipo detectó **inconsistencias** entre secciones del mismo mock: URLs distintas para el mismo concepto «home», conteos de auditorías desalineados entre tabla e historial de ficha, filas «No aplica» en Clarity que debían mostrarse como **rechazadas** con % LC, y leyendas de iconos distintas entre inventarios y el **estado de aceptación** del informe en `/auditar/resultado`.

Objetivo de esta entrada: **fijar en `docs/` y README** la estructura objetivo de pantallas y tablas (fuente única de datos, columnas, iconografía y colores de fila) para que la implementación en código quede alineada antes del siguiente commit de Etapa 3.

### Implementación técnica:

- **Fuente única (20 URLs Clarity):** [`data/ux/clarity-fichas-mock.json`](../../data/ux/clarity-fichas-mock.json) como maestro mock; la tabla resumida en UI deriva de ahí (no duplicar filas en varios `.ts` sin sincronía). Campos documentados: `encargadoRef`, `auditoriasRef`, `ultimaRevisionRef`, además de visitas, % LC, estado e `historialAuditorias` (longitud del historial = conteo de auditorías cuando es numérico).
- **Fusión de secciones en `/auditar`:** se **retira** el acordeón independiente **«URLs más auditadas»**; sus columnas útiles (**Auditorías**, **Última revisión**) pasan a la tabla ampliada de **~20 URLs Clarity**. Permanecen **dos** bloques colapsables de inventario: (1) Clarity ampliado, (2) **Estados URLs** (antes «URLs con estados LC resueltos»).
- **Tabla Clarity (columnas objetivo):** `#`, Ruta o etiqueta, **Encargado**, Visitas (ref.), **Auditorías (ref.)**, **Última revisión (ref.)**, % LC (ref.), Estado (ref.); enlaces a ficha `/auditar/inventario/clarity/[rank]`.
- **Ficha por URL:** [`/auditar/inventario/clarity/[rank]`](../../frontend/src/app/auditar/inventario/clarity/[rank]/page.tsx) muestra resumen (incl. **Encargado: Fernando Arriagada** en mock), contexto editorial e historial con **N** fechas coherentes con `auditoriasRef` (p. ej. rank 1 → **5** auditorías y **5** filas de historial).
- **Correcciones editoriales acordadas en tabla §2:** ranks **8, 15 y 18** con estado **Rechazado** y % **61,3 %**, **55,9 %** y **70,4 %** respectivamente (ya reflejados en [`docs/ux/inventario-urls-clarity.md`](../ux/inventario-urls-clarity.md)).
- **Iconografía y color de fila unificados** con umbrales de negocio del checklist (≤80 % rechazado, 81–90 % aceptado con observaciones, ≥91 % aprobado): símbolos **!** (rojo), **✓** (azul), **✓✓** (verde), **—** (gris); bandas de fila en verde / naranja / rojo según franja. Misma regla en tabla Clarity, sección **Estados URLs** y celdas de historial en ficha. Detalle en [`docs/DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md) §13.1 y §15.
- **Documentos actualizados:** [`docs/ux/inventario-urls-clarity.md`](../ux/inventario-urls-clarity.md) (estructura §2–§4), [`docs/ROADMAP.md`](../ROADMAP.md), [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md), [`docs/DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md), [`docs/PRD.md`](../PRD.md), [`README.md`](../../README.md).

### Próximos pasos:

- **Implementación en código** (responsabilidad del equipo en repo): ampliar JSON y tipos, refactor de `auditar-inventory-sections`, helper visual LC compartido, ajustes en ficha `[rank]`; luego commit de Etapa 3 + consistencia.
- **Etapa 4–5** del plan feedback UX: Calidad web mock y filtros en las **dos** tablas de inventario (ver [`docs/ROADMAP.md`](../ROADMAP.md)).
- Actualizar [`data/ux/README.md`](../../data/ux/README.md) cuando el JSON maestro sustituya los espejos `most-audited-urls.json` / `clarity-inventory.json` en mantenimiento.

**Nota (misma fecha):** la decisión de mantener un segundo acordeón **Estados URLs** queda **supersedida** por [Inventario único — Historial LC](#devlog-2026-05-28-inventario-unico-docs).

---

<a id="devlog-2026-05-27-feedback-ux-criterios-fichas"></a>

## [2026-05-27] - Frontend | Sprint fase-1: Feedback UX — catálogo en resultado e inventario Clarity con fichas mock

### Contexto y objetivos:

Avanzar las **dos primeras etapas** del plan de feedback UX post-demo (Bernarda/Álvaro, mayo 2026): (1) que la tabla de los 39 criterios en **`/auditar/resultado`** muestre la **sección** y el **enunciado oficial** del checklist editorial v1.1, no solo el código del criterio; (2) disponer de un **modelo mock de ~20 fichas** alineado al inventario ampliado Clarity en [`docs/ux/inventario-urls-clarity.md`](../ux/inventario-urls-clarity.md) §2, como base para rutas de detalle por URL sin mezclar aún con `StrictAuditRecord`. Objetivo: mejorar legibilidad del informe mock y una **fuente única** de datos para la tabla de inventario en `/auditar` y las futuras páginas de ficha.

### Implementación técnica:

- **Etapa 1 — Tabla de criterios en resultado:** nuevo módulo [`frontend/src/lib/checklist-criterion-catalog.ts`](../../frontend/src/lib/checklist-criterion-catalog.ts) que importa [`data/checklist-criteria.json`](../../data/checklist-criteria.json), expone `getCriterionCatalogRow`, `formatSeccionTitulo` y `formatCriterioEnunciado`. En [`frontend/src/app/auditar/resultado/page.tsx`](../../frontend/src/app/auditar/resultado/page.tsx) la tabla pasa de tres a **cinco columnas** (Sección, Criterio, Estado, Severidad, Comentario); leyenda accesible en `TableCaption` (`sr-only`); los filtros existentes se mantienen sobre el conjunto filtrado.
- **Etapa 2 — Fichas mock Clarity:** archivo [`data/ux/clarity-fichas-mock.json`](../../data/ux/clarity-fichas-mock.json) con **20 entradas** (`nombre`, `rutaEtiqueta`, `url`, métricas de referencia, `descripcion`, `observaciones`, `historialAuditorias` con fechas ISO y notas ficticias). URLs inferidas con prefijo `https://tramites.inapi.cl/` salvo prioridades canónicas documentadas (p. ej. Notificaciones, SuccessConfirmation). Ranks **8** y **15** alineados al criterio «No aplica» del inventario TypeScript, no al markdown §2 donde divergía.
- **Tipos y carga:** [`frontend/src/lib/clarity-url-ficha.ts`](../../frontend/src/lib/clarity-url-ficha.ts) (`ClarityUrlFicha`, `ClarityHistorialAuditoriaMock`); [`frontend/src/lib/clarity-fichas-mock.ts`](../../frontend/src/lib/clarity-fichas-mock.ts) con `CLARITY_FICHAS_MOCK`, `getClarityFichaByRank`, `isValidClarityFichaRank` y `clarityFichaToInventoryRow`.
- **Fuente única para la tabla:** [`frontend/src/lib/clarity-inventory-rows.ts`](../../frontend/src/lib/clarity-inventory-rows.ts) deja de duplicar filas estáticas y **deriva** `CLARITY_INVENTORY_ROWS` desde las fichas mock.

### 💡 Repaso técnico: Ficha vs registro de auditoría:

La **ficha de URL** resume contexto editorial (visitas Clarity, % LC de referencia, historial mock breve). **No** es un `StrictAuditRecord`: no incluye las 39 evaluaciones ni texto propuesto. La ruta de detalle por `rank` (Etapa 3) consumirá `getClarityFichaByRank`; el informe completo seguirá viniendo de fixtures JSON o mock por URL en resultado.

### Próximos pasos:

- **Etapa 3:** ruta `/auditar/inventario/clarity/[rank]` y enlaces desde inventario (base en repo; ver [consistencia documentada 2026-05-28](#devlog-2026-05-28-consistencia-inventarios-docs) para columnas, encargado e historial alineado).
- **Etapa 4:** filas mock de calidad web e ítem de acordeón correspondiente.
- **Etapa 5:** filtros cliente para las **dos** tablas de inventario (Clarity ampliado + Estados URLs).

---

<a id="devlog-2026-05-22-vercel-gha-etapa1"></a>

## [2026-05-22] - Infraestructura | Sprint fase-1: Vercel y workflow de CI en GitHub

### Contexto y objetivos:

Cerrar en operación la **Etapa 1** del plan de despliegue híbrido documentado en [`docs/despliegue/despliegue-hibrido.md`](../despliegue/despliegue-hibrido.md): URL estable para **demo UX** del mock (Next en **Vercel**) y **calidad reproducible** en **GitHub Actions**, sin desviar el deploy hacia Actions (opción A del plan). Objetivo de negocio: que Equipo UX y liderazgo puedan revisar el mismo binario que pasa `typecheck:all` y `lint` antes de abrir Fase 2 (Nest, Supabase, pipeline LC en AWS).

### Implementación técnica:

- **Vercel:** proyecto importado desde el repositorio de GitHub; **Root Directory** `frontend`; comandos **`cd .. && bun install`** y **`cd .. && bun run build`** para respetar el workspace Bun en la raíz (`bun.lock`, scripts de [`package.json`](../../package.json)) y el alias `@contracts/checklist` hacia [`src/schemas/checklist.ts`](../../src/schemas/checklist.ts). Previews por rama o PR según la configuración del panel.
- **GitHub Actions:** archivo [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) — disparadores `push` a `main` y ramas `feature/**`, `pull_request` hacia `main` y `workflow_dispatch`; `actions/checkout@v4` y `oven-sh/setup-bun@v2`; **`bun install --frozen-lockfile`** para alinear el árbol de dependencias con el lock versionado; **`bun run typecheck:all`** (checklist + fixtures + TypeScript raíz y frontend) y **`bun run lint`**. Concurrencia con cancelación del run anterior en la misma ref (`concurrency`).
- **Verificación en URL desplegada:** comprobación manual de `/`, `/auditar`, flujo mock, carga de datos por **fixture** (`fixture=` y `GET /api/audit-fixtures/[fixtureId]`) y bloque **«Demostración: importar JSON»** en [`frontend/src/app/auditar/resultado/page.tsx`](../../frontend/src/app/auditar/resultado/page.tsx) — pegado del contenido o **archivo** `.json` válido (mismo contrato `strictAuditRecordSchema` que los archivos en `data/audit-fixtures/`).
- **Documentación:** checklist actualizado en [`docs/despliegue/despliegue-hibrido.md`](../despliegue/despliegue-hibrido.md); sección **«Despliegue y CI»** en [`README.md`](../../README.md); ajustes en [`docs/ROADMAP.md`](../ROADMAP.md), [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md) y [`docs/SECURITY.md`](../SECURITY.md) para reflejar el cierre de Etapa 1 y la decisión de hosting Nest a formalizar con TI.

### Próximos pasos:

- **Demo interna** con Equipo UX según [`docs/ROADMAP.md`](../ROADMAP.md) (grabación y notas en `docs/` o en esta bitácora); checklist manual de accesibilidad en [`docs/qa/auditar-procesando-a11y-manual.md`](../qa/auditar-procesando-a11y-manual.md) si aún no se ejecutó antes de la reunión.
- Vigilar avisos de **deprecación de Node** en el runtime de las actions oficiales (`actions/checkout`, etc.); subir versión de la action o variable de entorno de opt-in cuando el equipo lo priorice.
- **Etapa 2** del plan (Supabase, Nest, AWS LC) alineada al cierre de Fase 1 en producto; formalizar por escrito **Railway vs AWS** para Nest cuando exista código (ver dependencias externas en roadmap).

---

<a id="devlog-2026-05-21-fixtures-implementacion"></a>

## [2026-05-21] - Frontend | Fixtures de auditoría: datos, scripts, validación, API y UI

### Contexto y objetivos:

Cerrar en código el ítem **«Fixtures de auditoría»** de la Fase 1 en [`docs/ROADMAP.md`](../ROADMAP.md): datos canónicos en `data/audit-fixtures/`, comprobación automática con el mismo contrato que usará el dominio (`strictAuditRecordSchema`), y en el **frontend** la posibilidad de **cargar un fixture por identificador** o **importar** un JSON, coherente con las tres franjas de aceptación (≤80 %, 81–90 %, ≥91 % sobre criterios aplicables).

### Implementación técnica:

- **Generación de JSON (fuente de verdad numérica):** script en la raíz del monorepo `src/scripts/generate-audit-fixture-json-files.ts`, ejecutable con Bun (`bun run src/scripts/generate-audit-fixture-json-files.ts`). Construye los tres registros usando `summarizeEvaluations`, `buildDemoStrictAuditWithCumpleCount` y `strictAuditRecordSchema.parse` desde [`src/schemas/checklist.ts`](../../src/schemas/checklist.ts) antes de escribir disco, de modo que **no** haya que ajustar a mano porcentajes ni `estado_aceptacion` incoherentes con las 39 filas. El fixture **rechazado** replica el reparto del informe editorial documentado en [`docs/ux/audit-fixture-ejemplo-notificaciones-marcas-rechazado.md`](../ux/audit-fixture-ejemplo-notificaciones-marcas-rechazado.md); los otros dos cubren franja media y alta con el mismo patrón numérico que los atajos editoriales hasta disponer de informes completos volcados.
- **Validación en CI / local:** `src/scripts/validate-audit-fixtures.ts` y comando raíz `bun run validate:audit-fixtures` (ver [`package.json`](../../package.json)), que recorre los `*.json` de `data/audit-fixtures/` excluyendo `manifest.json` y vuelve a parsear cada archivo con `strictAuditRecordSchema`.
- **Metadatos de lanzamiento:** [`frontend/src/lib/audit-fixtures-launch.ts`](../../frontend/src/lib/audit-fixtures-launch.ts) (ids permitidos y URL de navegación al flujo `procesando` + `resultado`).
- **API Next (servidor):** `GET` en [`frontend/src/app/api/audit-fixtures/[fixtureId]/route.ts`](../../frontend/src/app/api/audit-fixtures/[fixtureId]/route.ts): lee el JSON desde el monorepo (`process.cwd()` con padre `..` salvo override `LC_REPO_ROOT`), lista blanca de ids y respuesta validada con Zod antes de enviarla al cliente.
- **Flujo UI:** [`frontend/src/app/auditar/procesando/page.tsx`](../../frontend/src/app/auditar/procesando/page.tsx) propaga `fixture=` hacia [`frontend/src/app/auditar/resultado/page.tsx`](../../frontend/src/app/auditar/resultado/page.tsx); esta página prioriza **fixture por API** frente a **importación JSON** (`parseStrictAuditRecord`) y al **mock por URL**; se ajustó la interacción con la regla de lint `react-hooks/set-state-in-effect` derivando estado de carga y filtrando el fixture mostrado cuando el `id` del registro coincide con el parámetro de URL.
- **Descubrimiento en `/auditar`:** botones que disparan el mismo camino intermedio que los atajos, con `url` y `fixture` alineados a cada JSON.

### Próximos pasos:

- `validate:audit-fixtures` ya forma parte de `bun run typecheck:all` en la raíz del monorepo (ver [`package.json`](../../package.json)).
- Según roadmap: **demo interna con Equipo UX** (grabación y notas en `docs/` o en esta bitácora).
- Cuando existan informes cerrados para las otras URLs prioritarias, **sustituir** los dos fixtures «mock numérico» regenerando JSON con el mismo script y volver a ejecutar `validate:audit-fixtures`.

---

<a id="devlog-2026-05-21-fixtures-plan-ejemplo-notificaciones"></a>

## [2026-05-21] - Documentación | Ejemplo editorial fixtures (rechazado) + alineación inventario / roadmap

### Contexto y objetivos

Dejar **versionado en el repo** un **ejemplo editorial completo** (texto capturado, reparto de 39 criterios, resumen 55,2 % rechazado, texto propuesto) para la URL prioritaria **Notificaciones Marcas** (`https://tramites.inapi.cl/Notificaciones`), alineado al inventario Clarity en [`docs/ux/inventario-urls-clarity.md`](../ux/inventario-urls-clarity.md), como **referencia humana** para el primer JSON bajo `data/audit-fixtures/`. El plan de trabajo puntual de Fase 1 se redactó en paralelo y **se retiró del repositorio** una vez cerrados datos, scripts, API y UI; la operación vive en [`data/audit-fixtures/README.md`](../../data/audit-fixtures/README.md) y en la entrada [Frontend: Fixtures de auditoría — datos, scripts, validación, API y UI](#devlog-2026-05-21-fixtures-implementacion).

### Qué se añadió o actualizó

- **Nuevo:** [`docs/ux/audit-fixture-ejemplo-notificaciones-marcas-rechazado.md`](../ux/audit-fixture-ejemplo-notificaciones-marcas-rechazado.md) — volcado del informe (modal, vistas, pie, listas de IDs cumple/incumple/no aplica, severidades resumidas, texto propuesto, slug sugerido para `id` de fixture).
- **Actualizado:** [`docs/ux/inventario-urls-clarity.md`](../ux/inventario-urls-clarity.md) — enlace al ejemplo bajo la tabla de tres URLs priorizadas (y referencia a `data/audit-fixtures/README.md` donde aplica).
- **Actualizado:** [`docs/ROADMAP.md`](../ROADMAP.md) — el bullet de fixtures enlaza al README de `data/audit-fixtures/` y al ejemplo editorial.

### Próximos pasos

- **Completado en repo:** JSON en `data/audit-fixtures/`, `validate:audit-fixtures`, API `GET /api/audit-fixtures/[fixtureId]`, importación JSON y carga por `fixture=` en UI (ver [entrada Frontend 2026-05-21](#devlog-2026-05-21-fixtures-implementacion)). Pendiente según roadmap: **demo interna** con Equipo UX.

---

<a id="devlog-2026-05-21-estado-intermedio-procesando"></a>

## [2026-05-21] - Frontend | Estado intermedio — pantalla `/auditar/procesando`

### Contexto y objetivos:

Cerrar en documentación el ítem de Fase 1 del roadmap **«Estado intermedio entre ingreso y resultado»** en [`docs/ROADMAP.md`](../ROADMAP.md): pantalla dedicada con mensaje en **lenguaje claro**, **sin** afirmar persistencia ni comunicación real con base de datos; preparación visual y de accesibilidad alineada a lo que se esperará cuando la evaluación con **API** (p. ej. Claude) pueda tardar segundos o minutos.

### Implementación técnica:

- **`frontend/src/app/auditar/procesando/page.tsx`:** validación de `url`, `router.replace` hacia **`/auditar/resultado`**, copy en [`frontend/src/lib/auditar-procesando-copy.ts`](../../frontend/src/lib/auditar-procesando-copy.ts); contenedor **`main`** con `aria-busy="true"`; foco programático en **`h1`** (`tabIndex={-1}`); bloque de descripción con `role="status"` y `aria-live="polite"`; fallback de `Suspense` con `role="status"`; botón **Cancelar y Volver** a `/auditar`.
- **`frontend/src/components/ui/circular-progress.tsx`:** spinner circular **indeterminado** (`role="progressbar"`, sin `aria-valuenow`) y variante **determinada** con porcentaje para uso futuro con progreso real.
- **Navegación:** [`frontend/src/app/auditar/page.tsx`](../../frontend/src/app/auditar/page.tsx) (atajos) y [`frontend/src/app/auditar/captura/page.tsx`](../../frontend/src/app/auditar/captura/page.tsx) apuntan a **`/auditar/procesando?url=…`**.
- **QA previa a reunión UX:** borrador de checklist manual en [`docs/qa/auditar-procesando-a11y-manual.md`](../qa/auditar-procesando-a11y-manual.md) (ejecución y tachado de ítems reservados como **último paso** de Fase 1 antes de la demo con Equipo UX, con observaciones adicionales del equipo).

### Próximos pasos:

- Ejecutar y completar el checklist en [`docs/qa/auditar-procesando-a11y-manual.md`](../qa/auditar-procesando-a11y-manual.md); anotar hallazgos para la reunión con **Equipo UX**.
- Según [`docs/ROADMAP.md`](../ROADMAP.md): **demo interna** con Equipo UX (grabación y notas en `docs/` o este devlog). Los **fixtures** quedaron implementados (ver [entrada 2026-05-21 — fixtures](#devlog-2026-05-21-fixtures-implementacion)).

---

<a id="devlog-2026-05-20-resultado-mock-cierre"></a>

## [2026-05-20] - Frontend | Resultado mock: barra de cumplimiento, pasos a seguir y texto propuesto

### Contexto y objetivos:

Cerrar en bitácora el ítem de Fase 1 del roadmap **«Resultado mock»** en [`docs/ROADMAP.md`](../ROADMAP.md) (marcado `[x]`): en **`/auditar/resultado`** el **porcentaje de cumplimiento** con barra visual alineada a tokens del tema y al mismo **`estado_aceptacion`** que el contrato; bloque **«Pasos a seguir»** con copy por estado de aceptación; **etiqueta legible** del estado en el resumen; **texto propuesto** cuando el mock lo aporta (atajos editoriales) y mensaje explícito cuando no hay borrador, sin parecer fallo de la aplicación. Decisión registrada: la bandera **`USAR_TEXTO_PROPUESTO_GENERICO`** en `resultado-mock-copy.ts` controla si el fallback `buildDemoStrictAudit` inyecta texto genérico; por defecto se prioriza honestidad del mock y ausencia de borrador explicada en UI.

### Implementación técnica:

- **`frontend/src/components/ui/progress.tsx`:** componente de progreso (Radix) con indicador animado; props para clases del carril y del relleno.
- **`frontend/src/lib/resultado-mock-copy.ts`:** `CLASES_BARRA_POR_ESTADO`, `ETIQUETA_ESTADO_ACEPTACION`, `PASOS_SEGUN_ESTADO`, `USAR_TEXTO_PROPUESTO_GENERICO`, `TEXTO_PROPUESTO_GENERICO` y documentación de umbrales en `UMBRALES_CUMPLIMIENTO_DOC`.
- **`frontend/src/app/auditar/resultado/page.tsx`:** barra bajo la etiqueta de cumplimiento; sección de pasos con lista ordenada accesible; resumen con estado humanizado (`title` con valor técnico opcional); bloque **Texto propuesto** siempre visible con cuerpo condicional; fallback de auditoría con spread condicional sobre `buildDemoStrictAudit`.
- **Contrato y atajos (trazabilidad):** `buildDemoStrictAuditWithCumpleCount` y `noAplicaCount` en `src/schemas/checklist.ts`; perfiles peor / intermedio / mejor en `frontend/src/lib/editorial-shortcut-audit-mock.ts` con `texto_propuesto` y `observaciones_lc` por perfil; presentación unificada de criterios en `frontend/src/lib/criterio-evaluacion-visual.ts`.
- **Calidad:** `eslint` y `tsc` en `frontend` sin errores al cierre de esta tarea.

### Próximos pasos:

- Según [`docs/ROADMAP.md`](../ROADMAP.md): **demo interna** con Equipo UX (grabación y notas en `docs/` o este devlog). Los **fixtures** quedaron implementados (ver [entrada 2026-05-21 — fixtures](#devlog-2026-05-21-fixtures-implementacion)). El ítem **Estado intermedio** quedó cerrado en roadmap y bitácora (ver entrada [2026-05-21](#devlog-2026-05-21-estado-intermedio-procesando)); el checklist manual de QA en [`docs/qa/auditar-procesando-a11y-manual.md`](../qa/auditar-procesando-a11y-manual.md) se ejecuta como último paso de Fase 1 antes de la reunión con Equipo UX.

---

<a id="devlog-2026-05-20-tabla-severidad-inventarios"></a>

## [2026-05-20] - Frontend | Tabla de criterios con severidad mock, jerarquía visual e inventarios alineados

### Contexto y objetivos:

Cerrar en código y bitácora el ítem de Fase 1 del roadmap **«Actualización de documentación con Equipo UX y tabla de criterios completa»** (marcado `[x]` en [`docs/ROADMAP.md`](../ROADMAP.md)): datos mock creíbles para **severidad** y **comentario** por criterio en atajos editoriales, misma **jerarquía visual** que el producto final en la tabla de **39** filas (`!` / `?` / `✓`, bandas y chips), coherencia en las **tablas de inventarios** bajo `/auditar` y corrección del borde izquierdo en la **última fila** de todas las tablas `Table`.

### Implementación técnica:

- **`src/schemas/checklist.ts`:** `enrichCriterionEvaluationsForMock`, tipo `MockSeveridadBias` y tercer parámetro opcional en `buildDemoStrictAuditWithCumpleCount`; rotación determinista de severidad y comentarios breves solo en filas `incumple`.
- **`frontend/src/lib/editorial-shortcut-audit-mock.ts`:** paso del perfil del atajo al builder para sesgar severidades según peor / intermedio / mejor LC.
- **`frontend/src/app/auditar/resultado/page.tsx`:** leyenda de símbolos, `TableRow` con clases por `estado` del criterio, columna estado con icono + etiqueta, chips de severidad, comentario con `line-clamp-2` y `title`.
- **`frontend/src/lib/inventory-table-visuals.tsx`** y **`frontend/src/components/auditar-inventory-sections.tsx`:** leyendas y filas con la misma lógica de buckets editoriales (Clarity, más auditadas por volumen de auditorías, estados resueltos); color del **% LC** según umbrales del checklist; columna **Nivel** en más auditadas.
- **`frontend/src/components/ui/table.tsx`:** sustituir `[&_tr:last-child]:border-0` por `[&_tr:last-child]:border-b-0` para no anular `border-l-4` en la última fila.

### Próximos pasos:

- El ítem **Resultado mock** quedó cerrado en código y bitácora (ver entrada [2026-05-20](#devlog-2026-05-20-resultado-mock-cierre)).
- El ítem **Estado intermedio** quedó cerrado en roadmap y bitácora (ver entrada [2026-05-21](#devlog-2026-05-21-estado-intermedio-procesando)); checklist manual de QA en [`docs/qa/auditar-procesando-a11y-manual.md`](../qa/auditar-procesando-a11y-manual.md) para cierre final antes de reunión con Equipo UX.
- Según [`docs/ROADMAP.md`](../ROADMAP.md): **demo interna** con Equipo UX. Los **fixtures** quedaron implementados (ver [entrada 2026-05-21 — fixtures](#devlog-2026-05-21-fixtures-implementacion)).
- Volcar en documentación / **ADR 0007** los acuerdos formales con **Equipo UX** o responsable de datos cuando se concrete la reunión (modelo y parseo más allá del borrador actual).

---

<a id="devlog-2026-05-19-auditar-data-ux-devlog"></a>

## [2026-05-19] - Frontend | Cierre mock `/auditar` desde el último PR (atajos, inventarios, resultado y `data/ux`)

### Contexto y objetivos:

Consolidar en bitácora **todo lo avanzado desde el último PR** hasta el cierre del ítem de Fase 1 **`/auditar`**: ingreso de URL, atajos editoriales, inventarios en acordeones, pantalla de resultado alineada a perfiles LC, contrato de copy agregado y, por último, **artefactos JSON** en `data/ux` para consumo máquina sin sustituir `docs/ux/`.

### Implementación técnica:

- **`/auditar` (página):** tres atajos con bordes por perfil, navegación a `resultado?url=`; bloque en tarjeta con acordeón (`type="multiple"`); datos en `audit-shortcuts.ts`.
- **Inventarios y seguimiento:** `auditar-inventory-sections.tsx` con tres barras colapsables (Clarity ~20 filas, URLs más auditadas, estados resueltos); tablas con primitiva `Table`; filas mock en `clarity-inventory-rows.ts`, `most-audited-url-rows.ts`, `resolved-lc-state-rows.ts`.
- **Contrato y resultado:** en `src/schemas/checklist.ts`, campo opcional `observaciones_lc` y helper `buildDemoStrictAuditWithCumpleCount`; mock por URL en `editorial-shortcut-audit-mock.ts` (perfiles peor / intermedio / mejor coherentes con resumen y `texto_propuesto`).
- **`/auditar/resultado`:** botón **Regresar** en cabecera; secciones con barra primaria `#0F69C4`, paneles `#FFFFFF` y tabla de criterios con `Table` / hover alineado al resto del sistema; bloques **Observaciones** y **Texto propuesto** cuando el registro los trae.
- **Documentación de cierre:** `docs/ROADMAP.md` (ítem `/auditar` completado), `docs/DATABASE.md` y `docs/ARCHITECTURE.md` (mapeo `observaciones_lc` / `texto_propuesto` ↔ columnas futuras).
- **`data/ux/`:** `clarity-inventory.json`, `most-audited-urls.json`, `resolved-lc-states.json` como espejo de las listas de la UI; `README.md` con convención de mantenimiento frente a `frontend/src/lib/`.

### Próximos pasos:

- Según [`docs/ROADMAP.md`](../ROADMAP.md): **demo interna** con Equipo UX. Los **fixtures** quedaron implementados (ver [entrada 2026-05-21 — fixtures](#devlog-2026-05-21-fixtures-implementacion)). El ítem **Resultado mock** quedó cerrado (ver entrada [2026-05-20](#devlog-2026-05-20-resultado-mock-cierre)); el ítem **Estado intermedio** quedó cerrado (ver entrada [2026-05-21](#devlog-2026-05-21-estado-intermedio-procesando)); el ítem **Actualización de documentación con Equipo UX y tabla de criterios completa** quedó cerrado (ver entrada [2026-05-20](#devlog-2026-05-20-tabla-severidad-inventarios)).

---

<a id="devlog-2026-05-19-portal-home-mock"></a>

## [2026-05-19] - Frontend | Portal de acceso en `/` (mock v1.0)

### Contexto y objetivos:

Cerrar en código el ítem de Fase 1 **«Home (`/`) — portal de acceso institucional»**: pantalla tipo acceso Gobierno sin autenticación real, CTA hacia `/auditar`, sin duplicar el ingreso de URL en la portada.

### Implementación técnica:

- `frontend/src/app/page.tsx`: modal con colores fijos (`#0051A8`, barras `#0F69C4` / `#F63E32`), wordmark INAPI, bienvenida, botón «Acceder» con texto en el mismo azul modal; pie gris con referencia a checklist, CW 2.0, RLC y **Mock v1.0**.
- `frontend/src/app/layout.tsx`: se retira `SiteHeader` del layout raíz para que `/` no muestre cabecera.
- `frontend/src/app/auditar/layout.tsx`: se incorpora `SiteHeader` solo en el segmento `/auditar` (captura y resultado conservan cáscara con marca y controles).
- `docs/ROADMAP.md`: ítem Home marcado como completado.

### Próximos pasos:

- Implementar el ítem **`/auditar`** (ingreso URL, tres atajos a resultado, inventarios en acordeones según [`docs/DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md) §15) y el resto de pendientes de Fase 1 en [`docs/ROADMAP.md`](../ROADMAP.md).

---

<a id="devlog-2026-05-19-doc-flujo-auditar"></a>

## [2026-05-19] - Documentación | Flujo home gateway, `/auditar` (atajos, inventario Clarity) y barras colapsables

### Contexto y objetivos:

Alinear PRD, roadmap, arquitectura y datos de referencia a la **realidad del aplicativo**: evitar **dos pantallas** con la misma función (ingreso de URL). La **home `/`** queda como **portal de acceso institucional** (composición tipo auth Gobierno, **sin** login real en Fase 1) hacia **`/auditar`**. En **`/auditar`**: **ingreso de URL**, **tres atajos** (peor / intermedio / mejor LC) con navegación mock **directa a resultado**, inventario **~20 URLs Clarity** y otras **listas seccionadas** (**URLs más auditadas**, **URLs con estados resueltos**, etc.) documentadas para convivir en la misma pantalla como **barras / acordeones** con **título claro**, **flecha hacia abajo**, **contraste** institucional sin ruido y **`gap` vertical uniforme** entre secciones.

### Implementación técnica:

- [`docs/ROADMAP.md`](../ROADMAP.md): portal en `/`; ítem **`/auditar`** (URL, atajos, inventarios en barras colapsables, enlace a inventario UX); marco visual ajustado para no prometer barra de URL en `/`.
- [`docs/PRD.md`](../PRD.md) v0.3.3: requisitos Fase 1 de home vs `/auditar`, atajos a resultado, inventarios en acordeones.
- [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md) v0.5 y [`docs/DATABASE.md`](../DATABASE.md) v0.4.1: flujo mock, `url_index` orientado a **`/auditar`** e inventario en `docs/ux/`.
- Nuevo [`docs/ux/inventario-urls-clarity.md`](../ux/inventario-urls-clarity.md): tres URLs canónicas, tabla de 20 prioridades Clarity, §2.1 presentación en UI; URLs absolutas por completar donde falte.
- [`docs/DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md) v0.3.2: nueva **§15** (patrón barras colapsables en `/auditar`); renumeración §16–§17 (alcance MVP y referencias visuales).
- [`README.md`](../../README.md): pendientes Fase 1 alineados al mismo flujo.

### Próximos pasos:

- Implementar en `frontend/` la home tipo acceso, los atajos en `/auditar` y las **barras colapsables** de inventario según roadmap y [`docs/DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md) §15; completar enlaces absolutos del inventario cuando el equipo entregue la lista final.

---

<a id="devlog-2026-05-18-marco-visual-shell"></a>

## [2026-05-18] - Frontend | Marco visual institucional: cabecera, tema y lienzo global

### Contexto y objetivos:

Cerrar en el repo el ítem de Fase 1 del roadmap **«Marco visual institucional (prototipo de alta fidelidad)»**: cáscara común a portada, flujo `/auditar` y vistas mock, con jerarquía **cabecera → lienzo neutro → tarjetas**, tema claro/oscuro alineado a tokens §7 y modales de demostración sin simular autenticación real.

### Implementación técnica:

- `next-themes` y `frontend/src/components/ui/theme-provider.tsx`: proveedor con `attribute="class"`; `frontend/src/app/layout.tsx` con `suppressHydrationWarning` en `html` y cuerpo en columna con viewport estable.
- `frontend/src/components/theme-toggle.tsx`: alternancia claro/oscuro con `resolvedTheme`, `aria-label` en español y aplazamiento del estado de montaje para cumplir la regla `react-hooks/set-state-in-effect` (p. ej. `requestAnimationFrame`).
- `frontend/src/components/ui/dialog.tsx`: primitiva Radix con overlay `bg-background/60 backdrop-blur-sm` y panel con tokens `border-border` / `background` / `foreground`.
- `frontend/src/components/site-header.tsx`: cabecera sticky con wordmark INAPI (enlace a `/`), `ThemeToggle` y dos `Dialog` demo (usuario y configuración) con copy explícito de definición pendiente y botón «Cerrar».
- `frontend/src/app/layout.tsx`: `main` con `flex-1`, `min-h-0` y `bg-muted` bajo la cabecera para separar visualmente el lienzo de las `Card`.
- `frontend/src/app/auditar/layout.tsx` y `frontend/src/app/page.tsx`: eliminación de `min-h-dvh` y `bg-background` duplicados en el contenedor de página para no anular el lienzo `muted`.

### Próximos pasos:

- Según [`docs/ROADMAP.md`](../ROADMAP.md): **home** como portal de acceso a `/auditar`; en **`/auditar`**, barra de URL, **tres atajos** a resultado, inventarios en **barras colapsables** (§15 design system); luego barra térmica, estado intermedio, **demo UX** con Equipo UX (fixtures de auditoría ya implementados — ver [2026-05-21](#devlog-2026-05-21-fixtures-implementacion)).

---

<a id="devlog-2026-05-18-design-system-ui"></a>

## [2026-05-18] - Frontend | Design system en la interfaz y contenedor ancho del flujo /auditar

### Contexto y objetivos:

Cerrar en código el ítem de Fase 1 del roadmap sobre **design system Gobierno de Chile** en el frontend: tipografías institucionales, tokens de color y espaciado en tema global, contraste y objetivos táctiles (WCAG) en componentes reutilizables, y una **misma disposición ancha** en ingreso, captura y resultado del mock, sin cubrir aún barra térmica ni atajos de URL (otros bullets del roadmap).

### Implementación técnica:

- Tema en `frontend/src/app/globals.css`: variables §5 (`:root` y `.dark`), `--primary-hover`, enlaces en capa base, `spacing-kit` en `@theme` y fuentes enlazadas a variables de `next/font` en el `layout` raíz.
- `frontend/src/app/layout.tsx`: Roboto y Roboto Slab, metadatos INAPI y `lang="es"`.
- `frontend/src/components/ui/button.tsx`: tamaño por defecto con altura táctil ~44 px; variante primaria con hover y active vía `var(--primary-hover)`; tamaños `sm`, `lg` e iconos alineados al mismo criterio; `xs` más compacto desde el punto de ruptura `sm` donde aplica.
- Portada `frontend/src/app/page.tsx`: sustitución de la plantilla create-next-app por `Card` y CTA a `/auditar` con clases semánticas (`bg-background`, `text-foreground`, etc.).
- `frontend/src/app/auditar/layout.tsx`: envoltorio del segmento con `min-h-dvh`, fondo del tema y contenedor `max-w-5xl` con padding horizontal responsivo.
- `frontend/src/app/auditar/page.tsx`, `captura/page.tsx` y `resultado/page.tsx`: contenedor `w-full` sin duplicar `max-w` ni padding respecto al layout; mensajes de redirección y respaldos de `Suspense` sin `p-6` redundante; bordes de bloques con `border-border` donde corresponde.
- `frontend/tsconfig.json`: exclusión de `.next/dev/types` del `include` de TypeScript para que `tsc` no falle con el validador generado en modo desarrollo de Next.js 16.

### Contexto de errores o disyuntivas:

- **Tipografía y `@theme`:** en un momento `--font-sans` apuntaba a sí misma en el tema, con lo que el cuerpo caía en una fuente por defecto del motor (p. ej. serif). **Mitigación:** enlazar `--font-sans` y `--font-heading` en `@theme` a las variables que expone `next/font` en el `layout` raíz (`--font-roboto`, `--font-roboto-slab`).

- **`buttonVariants` (CVA):** se mezclaron clases de tamaño dentro de `variant.default` y se perdieron color y hover del primario; además faltó un `},` que cerrara `variants` antes de `defaultVariants`, y en un pegado `sm` y `lg` quedaron en la misma línea. **Mitigación:** separar estrictamente `variant` (semántica de color, hover con `var(--primary-hover)`) y `size` (altura, padding, texto); cerrar `size` y luego `variants`; una variante de tamaño por línea.

- **Typecheck con Next.js 16:** al incluir `.next/dev/types/**/*.ts` en `tsconfig`, `tsc` fallaba en el validador generado (`LayoutProps<Route>` frente a la unión de rutas de layout en desarrollo). **Mitigación:** quitar `.next/dev/types` del `include` y mantener la referencia de rutas hacia `./.next/types/routes.d.ts` en `next-env.d.ts` tras un build estable.

- **Flujo `/auditar`:** el ingreso usaba `max-w-lg` frente a captura/resultado más anchos; había `p-6` redundante en mensajes de redirección y en fallbacks de `Suspense` encima del padding del layout. **Mitigación:** `layout.tsx` del segmento con `max-w-5xl` y padding horizontal único; páginas con `flex w-full flex-col gap-6` sin segundo `max-w` ni `p-6` en esos textos.

### 💡 Repaso técnico: Layout anidado y tokens:

El layout del segmento `auditar` concentra ancho y márgenes; las páginas hijas solo distribuyen el contenido (`flex`, `gap`), de modo que la tarjeta y el campo de URL usan el ancho útil y se alinean con la tabla del resultado.

### Próximos pasos:

- Según [`docs/ROADMAP.md`](../ROADMAP.md): portal en **`/`**, ingreso y **tres atajos** en **`/auditar`**, inventarios en **barras colapsables** (§15 design system), barra térmica y bloques de resultado mock, estado intermedio de carga, **demo UX** con Equipo UX (fixtures JSON ya en repo — [2026-05-21](#devlog-2026-05-21-fixtures-implementacion)), con notas en este devlog o en `docs/`.

---

<a id="devlog-2026-05-16-documentacion"></a>

## [2026-05-16] - Documentación | Alineación con propuesta técnica integral y AWS

### Contexto y objetivos:

Registrar en el repo los acuerdos de la última reunión (oficina / transferencia desde entorno restringido): integración **NestJS ↔ Amazon API Gateway ↔ Lambda (Python) ↔ Claude API**, roles, Docker para desarrollo local del servicio de IA y monorepo objetivo frente al layout actual (`frontend/`, `src/schemas/`).

### Implementación técnica:

- Nuevo documento [`docs/PROPUESTA_TECNICA_INTEGRAL.md`](../PROPUESTA_TECNICA_INTEGRAL.md) (sustituye el nombre previo `PROUESTA_*`) con §1.1 **estado del repositorio** vs carpetas `apps/` y `packages/contracts`.
- [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md) v0.4: diagrama mermaid Nest–API Gateway–Lambda–Claude, tabla monorepo actual vs objetivo, §desarrollo local con Docker.
- [`docs/adr/0006-lc-evaluation-python-claude-aws.md`](../adr/0006-lc-evaluation-python-claude-aws.md): preferencia API Gateway + Lambda, preguntas abiertas §5, enlace a la propuesta técnica.
- [`docs/DATABASE.md`](../DATABASE.md) v0.4: principio de escritura **solo Nest + Prisma**; metadatos de evaluación vía AWS.
- [`docs/PRD.md`](../PRD.md) v0.3.1: stack y párrafo de flujo Fase 2 alineados a la integración AWS.
- [`docs/ROADMAP.md`](../ROADMAP.md): Fase 2 ampliada con bullets de integración, Docker, monorepo y enlace a la propuesta; fecha de actualización.
- [`README.md`](../../README.md): índice con propuesta técnica y nota sobre contratos en `src/schemas/`.

### Próximos pasos:

- **Fase 1 (código):** design system en UI; portal **`/`**; **`/auditar`** con URL, tres atajos, inventarios en barras colapsables (§15 design system); barra térmica y **fixtures** según [`docs/ROADMAP.md`](../ROADMAP.md) (implementados en [2026-05-21](#devlog-2026-05-21-fixtures-implementacion)).
- **Fase 2:** cerrar con Camila/TI las preguntas abiertas del ADR 0006 (auth, Lambda vs ECS, Pydantic).

---

<a id="devlog-2026-05-14-pantallas-mock"></a>

## [2026-05-14] - Frontend | Fase 1: Pantallas mock del flujo auditar (captura y resultado con 39 criterios)

### Contexto y objetivos:

Cerrar el segundo ítem de la Fase 1 del roadmap: flujo **URL → texto capturado (mock) → resultado** sin backend, pasando el estado por **query string** para poder demo y pruebas rápidas.

### Implementación técnica:

- Ruta `frontend/src/app/auditar/captura/page.tsx`: lectura de `?url=` con `useSearchParams`, redirección con `router.replace` si falta el parámetro, texto mock y enlace a resultado con la misma URL codificada.
- Ruta `frontend/src/app/auditar/resultado/page.tsx`: `Suspense` + `useMemo` para decodificar URL y construir auditoría con `buildDemoStrictAudit` desde `@contracts/checklist`; tabla HTML de **39** filas sobre `criterios_evaluados` y resumen de cumplimiento.
- Ajuste en `frontend/src/app/auditar/page.tsx`: `useRouter` en el cuerpo del componente y `router.push` hacia captura tras validación Zod + RHF.

### 💡 Repaso técnico: Query string y hooks en Next:

- `useSearchParams` solo en cliente (`"use client"`); el contenedor `Suspense` evita problemas de render/hidratación al depender de la URL.
- Los datos del mock viajan en `url` codificada; no hace falta estado global hasta integrar API o sesión.

### Contexto de errores o disyuntivas:

- **ESLint `react-hooks/rules-of-hooks` en `frontend/src/app/auditar/resultado/page.tsx`:** el `useMemo` que armaba la auditoría con `buildDemoStrictAudit` quedaba **después** de `return` tempranos (sin `url` decodificable o URL inválida para `new URL`), de modo que ese hook **no** se llamaba en todos los renders y violaba la regla de orden fijo de hooks. **Mitigación:** encadenar **tres** `useMemo` al inicio del componente (`urlDecoded` → `auditUrl` → `auditoria`, devolviendo `null` cuando no aplique) y **solo después** hacer `router.replace` y los `return` de redirección o la UI con tabla. Con eso `bun run lint` pasa sin errores.

### Próximos pasos:

- **Fase 1, punto 3 (cerrado en [2026-05-21](#devlog-2026-05-21-fixtures-implementacion)):** fixtures JSON en `data/audit-fixtures/` validados con `strictAuditRecordSchema`, API, importación en UI y validación en `typecheck:all`.
- Opcional: columnas con descripción del criterio leyendo `data/checklist-criteria.json`.

---

<a id="devlog-2026-05-14-inicializacion-frontend"></a>

## [2026-05-14] - Frontend | Fase 1: Inicialización del frontend con Next, Tailwind, shadcn y formulario URL

### Contexto y objetivos:

Cerrar el primer ítem de la Fase 1: stack de UI y **primer formulario** alineado al PRD (solo dominios `inapi.cl` / `tramites.inapi.cl`), con validación **Zod** y **React Hook Form**, sobre la carpeta `frontend/` del monorepo Bun.

### Implementación técnica:

- Dependencias en `frontend/package.json`: Next 16, Tailwind v4, shadcn (CLI y componentes `field`, `button`, `input`, `card`, etc.), `react-hook-form`, `@hookform/resolvers`, `zod`.
- Esquema `frontend/src/lib/schemas/url-audit.ts` con refinamiento de host permitido y mensajes en español.
- Página `frontend/src/app/auditar/page.tsx` con `Controller`, `zodResolver` y componentes `Field` de shadcn.
- Enlace en `frontend/src/app/page.tsx` hacia `/auditar` con `next/link`.

### Contexto de errores o disyuntivas:

- Peticiones `GET /mockServiceWorker.js` **404** en desarrollo: proceden de herramientas o extensiones que buscan MSW; no forman parte de la app.
- Aviso del navegador sobre `vercel.svg` (proporción de imagen): proviene de la plantilla por defecto de la home, no del flujo auditar.
- Regla de hooks: `useRouter` no debe invocarse dentro de `onSubmit`; se movió al cuerpo del componente para cumplir React y evitar advertencias de lint.

### Próximos pasos:

- Implementar pantallas de captura y resultado (entrada siguiente del devlog); **fixtures** de auditoría quedaron en [2026-05-21](#devlog-2026-05-21-fixtures-implementacion).

---

<a id="devlog-2026-05-13-fase-0"></a>

## [2026-05-13] - Estrategia | Fase 0: Documentación y contratos del repositorio

### Contexto y objetivos:

Dejar cerrada la **Fase 0** del roadmap: base de producto y de arquitectura por escrito, **contratos de datos** alineados al checklist editorial v1.1 (39 criterios) y herramientas en repo para validar el catálogo antes de introducir Next.js y el mock de interfaz, sin backend productivo.

### Implementación técnica:

- **Documentación y decisiones:** `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DATABASE.md`, `docs/DESIGN_SYSTEM.md`, `docs/ROADMAP.md`, ADR en `docs/adr/` (stack Next/Bun/Supabase, mocks contract-first con Zod, evaluación LLM y versión de prompts, API NestJS/Prisma).
- **Catálogo y esquemas:** `data/checklist-criteria.json` como fuente de los 39 criterios; `src/schemas/checklist.ts` con esquemas Zod, tipos, helpers (`buildDemoEvaluations`, `buildDemoStrictAudit`, `strictAuditRecordSchema`, etc.).
- **Validación en CI/local:** script `src/scripts/validate-checklist-data.ts` y script en `package.json` raíz (`validate:checklist`) para comprobar el JSON contra Zod.

### 💡 Repaso técnico: Enfoque contract-first:

- Los mismos contratos (`checklist-criteria` + Zod) deben alimentar mocks de UI, prompts y futura capa de datos, para no desalinear el MVP entre documentación y código.

### Próximos pasos:

- Fase 1: mock UX en `frontend/` (Next, Tailwind, shadcn, flujo por URL), tal como figura después en el roadmap.

---