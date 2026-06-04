# Roadmap
## MVP — Aplicativo de Auditoría de Lenguaje Claro INAPI

**Última actualización:** 2026-06-02

---

## Fase 0 — Documentación y contratos (completada en repo)

- [x] PRD, arquitectura, base de datos, design system, ADRs
- [x] `data/checklist-criteria.json` + validación Zod (`src/schemas/checklist.ts`)
- [x] Script `validate-checklist-data.ts`

---

## Fase 1 — Mock UX e interfaz institucional (sin backend productivo)

**Orden de negocio:** entregar MVP **mock** aprobado por **Equipo UX** y liderazgo **antes** de integrar API, base de datos y evaluación real con LLM (Fase 2).

### Hecho en repo

- [x] Inicializar Next.js (Bun) + Tailwind + shadcn/ui + RHF/Zod
- [x] Pantallas: ingreso URL (`/auditar`), vista texto capturado (mock), resultado con tabla de **39** criterios y datos generados con `buildDemoStrictAudit` / contrato Zod
- [x] **Estado intermedio** entre intención de ver resultado y **`/auditar/resultado`:** pantalla **`/auditar/procesando?url=…`** (copy honesto sin base de datos; spinner circular alineado a kit; accesibilidad: `main`, `h1` con foco inicial, `aria-live`, `router.replace` al resultado). Atajos y captura enlazan a `procesando`. Checklist manual de QA en [`docs/qa/auditar-procesando-a11y-manual.md`](qa/auditar-procesando-a11y-manual.md) para cierre final antes de reunión con Equipo UX.

### Pendiente (UI y datos mock)

- [x] **Design system Gobierno de Chile** ([`docs/DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md)) aplicado en **toda** la UI del MVP: tipografías (Roboto Slab / Roboto Sans), tokens de color, espaciado y revisión de contraste (WCAG) en `frontend` (p. ej. `globals.css`, layout, componentes).
- [x] **Marco visual institucional (prototipo de alta fidelidad):** cáscara común al **MVP mock completo**, no solo a `/auditar`: portada de **acceso institucional** (`/`), flujo de auditoría (`/auditar`, captura, resultado). Incluye **fondo de página** con neutro del tema (p. ej. superficies `muted` / sidebar del design system) para separar jerárquicamente el lienzo de las **tarjetas** (`card` / `background`); **cabecera** con logo INAPI a la izquierda. A la derecha: **(1) Tema claro/oscuro — funcional y prioritario:** alternancia solo entre tokens ya definidos en [`docs/DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) §7 y en `globals.css` (`:root` / `.dark`), sin hex ad hoc; control accesible (`aria-label` claro, foco con `--ring` §3.5, área táctil acorde a WCAG §12). **(2) Usuario y configuración — demostración hasta definir negocio:** antes de modelar tipos de usuario, permisos e importancia de cada rol, abrir **modales superpuestos** con fondo semitransparente y **blur** (p. ej. Radix Dialog + tokens `background`/`foreground`/`border-border`), copy breve de “definición pendiente” y cierre explícito; sin simular inicio de sesión ni datos personales. Opcionalmente **secciones** dentro de tarjetas con `border-border`, fondos `muted` suaves y contraste §4 y radios/elevación §8, sin saturar de primario la cabecera. Con esto se trabaja el MVP como **prototipo institucional** desde el layout raíz; **después** se abordan **home** (portal de acceso, sin duplicar ingreso URL) y **atajos en `/auditar`**, más el resto de pendientes de esta fase.
- [x] **Home (`/`) — portal de acceso institucional:** pantalla de **bienvenida / acceso** alineada al UI kit Gobierno (p. ej. tarjeta primaria centrada, wordmark INAPI, mensaje de bienvenida al aplicativo de auditoría LC, CTA **Acceder** que navega a **`/auditar`**). Objetivo de producto: **un solo punto de entrada** “institucional” para funcionarios que auditan URLs; **evitar** una segunda pantalla con la misma función que `/auditar` (ingreso de URL). En Fase 1 **no** hay autenticación real ni captura de credenciales; el aspecto “auth” es **solo de composición visual** y expectativa mental de acceso restringido al trabajo de auditoría.
- [x] **`/auditar` — ingreso de URL, atajos, inventarios en barras colapsables:** **barra principal** de ingreso de URL (mismos dominios y validación que hoy). **Debajo** del bloque de ingreso, sección de **tres atajos** editoriales (peor / intermedio / mejor LC) hacia **`/auditar/procesando?url=…`** y resultado. Las **listas seccionadas** de apoyo conviven en **barras colapsables** (§15 design system). **Objetivo documentado (2026-05-28):** tarjeta **Tabla de Auditorías URLs - Calidad Web: Sitio Web y Trámites - INAPI** con acordeón **Historial de Auditorías URLs - INAPI** (**22 URLs** objetivo: ranks 1–20 `tramites.inapi.cl`, rank 1 = landing portal; ranks **21–22** `sitioweb`: home + Trámites digitales; campo **`type_url`**; filtro Trámites/Sitio Web implementado; Encargado, Auditorías, Última revisión, % LC, Estado; filtros LC/orden implementados; fuente [`data/ux/clarity-fichas-mock.json`](../data/ux/clarity-fichas-mock.json)) — más ficha `/auditar/inventario/clarity/[rank]`. Referencia: [`docs/ux/inventario-urls-clarity.md`](ux/inventario-urls-clarity.md).
- [x] **Actualización de documentación con Equipo UX y tabla de criterios completa:** (1) Volcar en `docs/` (p. ej. [`DATABASE.md`](DATABASE.md), [`ARCHITECTURE.md`](ARCHITECTURE.md), [`docs/development/DEVLOG.md`](development/DEVLOG.md)) los **acuerdos, aclaraciones y feedback** del **Equipo UX** sobre **modelo de datos**, **parseo** del registro de auditoría mock y coherencia entre contrato Zod y persistencia futura. (2) En **`/auditar/resultado`**, completar la **tabla de los 39 criterios** con columnas **severidad** (`baja` \| `media` \| `alta`) y **comentario** (texto breve por fila cuando aplique), pobladas en **mock** de forma creíble y alineadas a `criterionEvaluationSchema` en [`src/schemas/checklist.ts`](../src/schemas/checklist.ts) y a las columnas `severidad` / `comentario` de `audit_criterion_results` en [`DATABASE.md`](DATABASE.md) §2.
- [x] **Resultado mock:** **barra térmica** (o equivalente visual) del `porcentaje_cumplimiento` alineada al design system; bloque de **pasos a seguir** según `estado_aceptacion` (`rechazado` / `aceptado_con_observaciones` / `aprobado`); mostrar **texto propuesto** desde datos mock (hasta integrar LLM en Fase 2). *Las columnas **severidad** y **comentario** de la tabla de criterios quedan cubiertas por el ítem **Actualización de documentación con Equipo UX y tabla de criterios completa** anterior.*
- [x] **Fixtures de auditoría:** 2–3 archivos JSON en `data/audit-fixtures/` (u otra convención documentada), cada uno validado con `strictAuditRecordSchema`; script `validate:audit-fixtures` en raíz; la UI debe poder **importar** o seleccionar fixture por identificador (coherente con las tres franjas de aceptación: ≤80 %, 81–90 %, ≥91 % sobre criterios aplicables). **Convención, regeneración y API:** [`data/audit-fixtures/README.md`](../data/audit-fixtures/README.md). **Ejemplo editorial (rechazado):** [`docs/ux/audit-fixture-ejemplo-notificaciones-marcas-rechazado.md`](ux/audit-fixture-ejemplo-notificaciones-marcas-rechazado.md).
- [x] **Pulido UI y accesibilidad (pre-demo UX):** contraste **WCAG** en tema claro y **oscuro** (sin mezclar superficies hex fijas claras con tokens `foreground` / `muted-foreground` pensados para el tema); alinear tablas de **`/auditar/resultado`** al patrón de lectura de inventarios (`bg-card`, bandas de fila); **una sola** sección de navegación para las **tres URLs** de demostración (mock por URL vs fixture del repo) y bloque aparte para **importación JSON**; **filtros** en la tabla de criterios evaluados (tipo A/B/C…, estado visual, severidad/pastilla). **Criterios de cierre:** revisión manual en ambos temas; sin regresiones de lint/tsc en `frontend/`.
- [x] **Feedback UX post-demo (mayo 2026) — inventarios consistentes:** unificar mock bajo [`data/ux/clarity-fichas-mock.json`](../data/ux/clarity-fichas-mock.json); **fusionar** columnas de «URLs más auditadas» en la tabla **20 URLs Calidad Web** (Encargado, Auditorías, Última revisión); **eliminar** acordeón «URLs con estados LC resueltos» / «Estados URLs» (observaciones en ficha); iconografía LC **! / ✓ / ✓✓ / —** y color de fila por umbrales ≤80 / 81–90 / ≥91 %; historial de ficha alineado a conteo de auditorías (p. ej. rank 1 → 5); **filtros y orden** en tabla única (Etapa 5). **Documentación:** [`docs/ux/inventario-urls-clarity.md`](ux/inventario-urls-clarity.md), [`docs/DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) §13.1, devlog 2026-05-28.
- [x] **Feedback UX — Etapa 1:** columnas **Sección** y **Criterio** (enunciado checklist v1.1) en tabla de `/auditar/resultado`.
- [x] **Feedback UX — Etapa 2 (base):** 20 fichas mock + loader; ampliar campos según ítem «inventarios consistentes».
- [x] **Feedback UX — Etapa 3:** ruta `/auditar/inventario/clarity/[rank]` + enlaces; ficha con resumen (auditorías, última revisión), observaciones breve/detalle.
- [x] **Feedback UX — Etapa 4 (cancelada):** ~~sección mock «Calidad web (Sitio Web)» en acordeón aparte~~ — absorbida en tabla única con **`type_url`** y filtro Tipo; rank **1** = landing **`tramites.inapi.cl`** (Trámites); ranks **21–22** = Sitio Web (`www.inapi.cl`); título tarjeta Calidad Web Sitio + Trámites (ver [`docs/ux/inventario-urls-clarity.md`](ux/inventario-urls-clarity.md) §2.1).
- [x] **Feedback UX — Etapa 5:** filtros y orden cliente en la **tabla única** de historial (estado; visitas; auditorías; última revisión; % LC — sin filtro por encargado ni observación).
- [x] **Feedback UX — Etapa 5b (inventario `type_url`):** campo **`type_url`** (`tramites` \| `sitioweb`) en [`data/ux/clarity-fichas-mock.json`](../data/ux/clarity-fichas-mock.json); corregir **rank 1** → `https://tramites.inapi.cl/`; añadir ranks **21–22** (`www.inapi.cl/`, `www.inapi.cl/tramites/tramites-digitales`); filtro UI **URLs Trámites / URLs Sitio Web**; columna o badge Tipo en tabla. Documentación: [`docs/ux/inventario-urls-clarity.md`](ux/inventario-urls-clarity.md) §2.0–§2.1.
- [x] **Feedback UX — Etapa 5c (copy UI):** títulos tarjeta/acordeón en `/auditar` alineados con design system §15 (`auditar-inventory-sections.tsx`; intro sin conteo fijo de URLs).
- [x] **Despliegue demo y CI (Etapa 1 del plan híbrido):** aplicativo Next desplegado en **Vercel** (root `frontend`, install/build desde raíz del monorepo con Bun); **GitHub Actions** con workflow `CI` (`typecheck:all`, `lint`, `bun install --frozen-lockfile`); verificación manual en URL pública de flujo principal, carga de fixture vía API e **importación JSON** (pegar o archivo) usando los JSON de [`data/audit-fixtures/`](../data/audit-fixtures/). Detalle operativo: [`docs/despliegue/despliegue-hibrido.md`](despliegue/despliegue-hibrido.md); resumen en [README.md](../README.md) § «Despliegue y CI».
- [x] **Demo interna** con **Equipo UX** (sesión grabada): puede cerrarse en paralelo al piloto; decisiones de junio 2026 en [`docs/flujo-piloto-10-urls-claude-mvp.md`](flujo-piloto-10-urls-claude-mvp.md) y devlog 2026-06-02.

---

## Fase 1.5 — Piloto auditoría LC con IA (10 URLs, entrega TIC / Equipo UX)

**Contexto (reuniones 2026-06-01 y 2026-06-02):** priorizar **valor entregable** (informe PDF + sustituciones de texto en HTML) sobre infraestructura completa (sin Supabase/Nest obligatorio en esta etapa). Objetivo de negocio: **10 páginas web** auditadas antes de fin de año, con solicitudes concretas a **TIC**. El inventario de **22 URLs** (Clarity + editorial) sigue como referencia; el piloto opera sobre un **subconjunto de 10** acordado con Bernarda.

**Proveedor IA del piloto:** **Claude** (Proyecto «Auditor Lenguaje Claro URLs INAPI») — comparación con Gemini en home [`www.inapi.cl`](https://www.inapi.cl/) documentada en [`docs/Comparación Auditoría URL Home INAPI Gemini-Claude.md`](Comparación%20Auditoría%20URL%20Home%20INAPI%20Gemini-Claude.md). **No** hay sincronización automática Proyecto Claude ↔ app; flujo: export JSON → repo → MVP.

**Documentación operativa:** [`docs/flujo-piloto-10-urls-claude-mvp.md`](flujo-piloto-10-urls-claude-mvp.md) · [`docs/Propuesta Análisis LC URLs.md`](Propuesta%20Análisis%20LC%20URLs.md) (acuerdos reunión).

### Hecho / en curso (documentación y primera URL)

- [x] Gema Gemini y Proyecto Claude configurados (checklist v1.1 en conocimiento del agente).
- [x] Auditoría piloto **home** `https://www.inapi.cl/` con ambos agentes; decisión **Claude** por robustez editorial.
- [x] Documentos: comparación Gemini/Claude, propuesta reunión, flujo operativo piloto 10 URLs.
- [ ] Cierre JSON home en formato extendido para MVP (mensaje §3.2 en flujo operativo) → `data/claude-audits/`.

### Pendiente — producto y MVP (prioridad actual)

- [ ] **Lista oficial de 10 URLs** cerrada con Bernarda/TIC (tabla en flujo operativo §2).
- [ ] **UI `/auditar`:** nueva tarjeta + acordeón **debajo del ingreso de URL** — tabla **Piloto 10 URLs** (mismo patrón que historial 22 URLs); clic → `/auditar/resultado` con auditoría Claude cargada.
- [ ] **Parseo interno:** esquema export Claude → `strictAuditRecordSchema` + metadatos (`sustituciones`, observaciones por severidad, `nota_final_tic`) — ver plan técnico en flujo §5–6.
- [ ] **`/auditar/resultado` ampliado (piloto):** siete bloques en orden acordado ([`docs/flujo-piloto-10-urls-claude-mvp.md`](flujo-piloto-10-urls-claude-mvp.md) §4): **Datos de Auditoría** y **39 Criterios Evaluados** siempre visibles; **Resumen Auditoría**, **Pasos a seguir**, **Observaciones finales por severidad**, **Texto propuesto** (tabla `sustituciones`), **Nota para el equipo TI** en barras colapsables; sin duplicar `observaciones_lc` narrativo ni párrafo `texto_propuesto` cuando aplique piloto. **Descarga PDF** (server-side, `@react-pdf/renderer`) — Fase C.
- [ ] **9 URLs restantes:** HTML Ctrl+U → Claude → JSON en `data/claude-audits/` → revisión UX → PDF (+ HTML corregido a TIC tras aprobación de sustituciones).
- [ ] **Entrega TIC:** PDF + HTML con sustituciones aprobadas; control de cambios (Bernarda).

### Fuera de alcance Fase 1.5 (explícito)

- Login institucional y persistencia en Supabase (→ Fase 2).
- Evaluación automática vía API Anthropic desde la app (→ Fase 2; piloto es manual + JSON en repo).
- Inventario completo de 22 URLs con evaluación real en esta oleada (solo 10 del piloto).
- Producto paralelo de «control de cambios» / diff automático entre auditorías (backlog).
- Captura automática Cheerio/Playwright (→ Fase 3).

### Criterio de cierre Fase 1.5

- [ ] Las **10 URLs** tienen JSON validado en repo, informe visible en MVP y **PDF** descargable por URL.
- [ ] Acta breve UX/TIC con proveedor Claude y reglas de calibración (G1 RUT institucional, E3 en home, no inventar pesos PDF).

---

## Fase 2 — Persistencia, API y evaluación asistida (post-piloto 1.5)

**Condición:** cierre de **Fase 1.5** (10 URLs con informe + PDF en MVP) y, cuando aplique, demo UX de Fase 1.

- [ ] Proyecto **Supabase** (Auth, Postgres, RLS) según [`docs/DATABASE.md`](DATABASE.md)
- [ ] App **NestJS** + **Prisma**: migraciones iniciales (`audits`, resultados detallados, `checklist_versions`, etc.) contra Postgres de Supabase ([ADR 0005](adr/0005-api-backend-nestjs-prisma.md))
- [ ] **Contrato HTTP** frontend ↔ API de dominio; Next (Server Actions / Route Handlers) solo donde aporte valor frente a llamadas directas al API
- [ ] **Evaluación de lenguaje claro con Claude API** vía **servicio Python** en **AWS** (preferencia documentada: **API Gateway** + **Lambda**; alternativa ECS/EC2 si límites de Lambda no bastan). Contrato **REST/JSON** entre Nest y API Gateway; validación de salida alineada a [ADR 0004](adr/0004-llm-checklist-evaluation-and-versioning.md) y [ADR 0006](adr/0006-lc-evaluation-python-claude-aws.md)
- [ ] **Integración y seguridad:** definir autenticación **Nest ↔ API Gateway** (claves, IAM, mTLS o JWT de servicio) y secretos Anthropic solo en servidor/Lambda; cuestionario abierto en [`docs/PROPUESTA_TECNICA_INTEGRAL.md`](PROPUESTA_TECNICA_INTEGRAL.md) §5
- [ ] **Desarrollo local:** **Docker** para el servicio Python de evaluación (paridad con AWS), según propuesta técnica integral
- [ ] **Reestructura de monorepo (opcional / acordada):** migrar hacia `apps/frontend`, `apps/backend-api`, `apps/evaluation-service` y `packages/contracts` cuando el equipo lo priorice (hoy: `frontend/` + `src/schemas/`; ver tabla en propuesta técnica §1.1)
- [ ] **Entorno compartido en AWS** (desarrollo o staging) para API, gateway y lambdas, sin depender de equipos personales encendidos

---

## Fase 3 — Captura real y endurecimiento del pipeline

- [ ] Servicio de **captura** de contenido URL (Cheerio vs Playwright — ADR dedicado)
- [ ] **Reintentos**, límites de costo, caché y observabilidad del pipeline LLM en producción
- [ ] **Versionado de prompts** en repositorio o tabla, alineado a `prompt_version` en persistencia

---

## Fase 4 — Cierre MVP

- [ ] Export PDF/Word *(piloto: PDF por URL adelantado en **Fase 1.5**; consolidar plantilla institucional y persistencia en Fase 2/4)*
- [ ] Histórico por URL en UI
- [ ] Pruebas con muestra de URLs reales; calibración de severidad y prompt

---

## Dependencias externas

- Alineación con TI INAPI (dominios, auth institucional, políticas de datos).
- **Hosting API Nest (cuando exista código):** decisión **Railway** vs **AWS** (misma nube que Lambda LC u operación simplificada); anotar en este roadmap o en ADR breve al formalizar.
- Prioridades CORFO / OpenProject (ajustar fechas con liderazgo).

---

## Post-MVP (backlog)

- Auditorías programadas (cron)
- Roles (revisor vs editor)
- Panel de métricas agregadas
