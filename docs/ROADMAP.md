# Roadmap
## MVP — Aplicativo de Auditoría de Lenguaje Claro INAPI

**Última actualización:** 2026-08-18

### Checklist editorial (ago-2026)

- [x] **Checklist v2.1 — 47 criterios** en rama `feat/checklist-v2.1-47-criterios` (`data/checklist-criteria.json` + Zod + skills Claude §17 + citas IEW/IESD/RLC/MEI). Auditorías JSON históricas v1.1 (39 filas) siguen válidas. **Merge/PR a `main`:** ver [Fase 4](#fase-4--mvp-on-demand-cuenta-claude-pro-institucional--worker-local--be-delgado) paso 1. **No** reauditar URLs hasta cuenta institucional + checklist en `main`.

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

## Fase 1.5 — Piloto auditoría LC con IA (9 URLs operativas, entrega TIC / Equipo UX)

**Contexto (reuniones 2026-06-01 y 2026-06-02):** priorizar **valor entregable** (informe PDF + sustituciones de texto en HTML) sobre infraestructura completa (sin Supabase/Nest obligatorio en esta etapa). Objetivo de negocio original: **10 páginas web** auditadas antes de fin de año; en repo operan **9 URLs** del piloto junio 2026 (7 `sitioweb` + 2 `tramites`). El inventario de **22 URLs** (Clarity + editorial) sigue como referencia editorial.

**Proveedor IA del piloto:** **Claude** (Proyecto «Auditor Lenguaje Claro URLs INAPI») — comparación con Gemini en home [`www.inapi.cl`](https://www.inapi.cl/) documentada en [`docs/Comparación Auditoría URL Home INAPI Gemini-Claude.md`](Comparación%20Auditoría%20URL%20Home%20INAPI%20Gemini-Claude.md). **No** hay sincronización automática Proyecto Claude ↔ app; flujo: export JSON → repo → MVP → PDF.

**Documentación operativa:** [`docs/flujo-piloto-10-urls-claude-mvp.md`](flujo-piloto-10-urls-claude-mvp.md) · [`docs/stack-orquestación.md`](stack-orquestación.md) · [`docs/plantilla-excel-mei-bcd.md`](plantilla-excel-mei-bcd.md) · [`docs/Propuesta Análisis LC URLs.md`](Propuesta%20Análisis%20LC%20URLs.md) (acuerdos reunión).

### Hecho en repo (código + datos, merge a `main` 2026-06-08)

- [x] Gema Gemini y Proyecto Claude configurados (checklist v1.1 en conocimiento del agente).
- [x] Auditoría piloto **home** con ambos agentes; decisión **Claude** por robustez editorial.
- [x] Documentos operativos: comparación Gemini/Claude, propuesta reunión, flujo piloto, sesión 2026-06-05.
- [x] **9 JSON canónicos** en [`data/claude-audits/`](../data/claude-audits/) (URLs 1–9; ver tabla en [`flujo-piloto-10-urls-claude-mvp.md`](flujo-piloto-10-urls-claude-mvp.md) §2).
- [x] Esquema y adaptador: [`src/schemas/claude-audit-pilot.ts`](../src/schemas/claude-audit-pilot.ts) (`parseClaudeAuditFile` → `strictAuditRecordSchema` + metadatos piloto).
- [x] **UI `/auditar`:** tarjeta + acordeón piloto debajo del ingreso de URL ([`frontend/src/components/auditar-claude-pilot-section.tsx`](../frontend/src/components/auditar-claude-pilot-section.tsx); fuente [`frontend/src/lib/claude-audits-launch.ts`](../frontend/src/lib/claude-audits-launch.ts)).
- [x] **API** `GET /api/claude-audits/[id]` + query `?claudeAudit=` en resultado.
- [x] **`/auditar/resultado` ampliado (piloto):** siete bloques §4 (Datos de Auditoría + 39 criterios fijos; resto colapsable); sin import JSON cuando hay `claudeAudit`.
- [x] **PDF server-side:** `GET /api/claude-audits/[id]/export/pdf` + botón «Descargar informe PDF» (`@react-pdf/renderer`).
- [x] **CI** (`typecheck:all`, `lint`) y **Vercel** verificados con las 9 URLs (tabla → resultado → PDF).

### Extensión serie Clarity 22 URLs (junio 2026, rama `feature/clarity-22-urls-auditorias-claude-json`)

- [x] **Cableado MVP:** tabla Historial 22 URLs → `/auditar/resultado` + PDF vía `clarity-audits-launch.ts` y `load-claude-audit-bundle.ts`.
- [x] **Esquema `clarity_meta`** en JSON serie Clarity; `validate:claude-audits` ampliado a `tramites/` y `sitioweb/` (Meta MEI + fecha).
- [x] **13/17 JSON** Clarity en repo (ranks 1–7, 9–10, 12, 14, 16–17); restructura `data/claude-audits/{tramites|sitioweb}/{fecha}/` (jul-2026).
- [ ] **Ranks 8, 11, 13, 15** — pendiente coordinación TI (sin acceso operativo; ver [Fase 3.3](fase-3-3-captura-auth-claveunica.md) §3).

### Pendiente — cierre editorial y entrega (sin código obligatorio)

- [x] **Entrega MEI (motor en repo, jul-2026):** catálogo PTD [`data/mei-calidad-web/catalog.json`](../data/mei-calidad-web/catalog.json); export Bernarda (Índice, CheckList, Fuentes, web INAPI, sitio TRAMITES); muestra por defecto **10 URLs META MEI** (`mei-meta-mei-urls.ts`; 3 reauditadas §17 el 2026-07-29); flag `--urls=clarity` para Clarity 13; API/UI `/auditar/mei-calidad-web` con guard 403. Plantilla: [`docs/plantilla-excel-mei-bcd.md`](plantilla-excel-mei-bcd.md). Rama: `10-urls-meta-mei-excel` (sobre UI jerárquica Bernarda).
- [ ] **Revisión editorial con Bernarda:** validar filas Excel H01–H02 (completados) y calibrar propuestas CMS antes de ampliar hitos en progreso — reunión jefatura 2026-07-30.
- [ ] **Consolidar** hallazgos DevTools del inventario extendido (~20 URLs) en un único Excel para TI (`fragmento_busqueda` como ancla principal).
- [ ] **Decisión de alcance:** cerrar piloto en **9 URLs** o añadir **10.ª URL** con Bernarda/TIC (propuesta reunión 2026-06-02 en flujo §2 histórico).
- [ ] **Revisión UX (Bernarda):** sustituciones aprobadas, falsos positivos (G1 RUT institucional, D7 mayúsculas en `tramites.inapi.cl`).
- [ ] **Entrega TIC:** PDF por URL (+ HTML corregido §3.3 tras aprobación); ticket de control de cambios.
- [ ] **Acta breve UX/TIC** con proveedor Claude y reglas de calibración (G1, E3, cobertura 1:1 sustituciones).

### Pendiente — código opcional (endurecimiento)

- [x] Script `validate:claude-audits` en raíz + paso en `typecheck:all` / CI (C7 del flujo operativo).
- [x] Copy UI «9 URLs» en tarjeta piloto (`auditar-claude-pilot-section.tsx`).

### Fuera de alcance Fase 1.5 (explícito)

- Login institucional y persistencia en Supabase (→ Fase 2).
- Evaluación automática vía API Anthropic desde la app (→ Fase 2; piloto es manual + JSON en repo).
- Inventario completo de 22 URLs con evaluación real en esta oleada (solo subconjunto piloto).
- Producto paralelo de «control de cambios» / diff automático entre auditorías (backlog).
- Captura automática Cheerio/Playwright (→ Fase 3).

### Criterio de cierre Fase 1.5

- [x] Las **9 URLs operativas** tienen JSON en repo, informe visible en MVP y **PDF** descargable por URL.
- [ ] Acta breve UX/TIC y entrega formal a TIC (PDF + HTML aprobado donde aplique).
- [ ] (Opcional) Decisión documentada sobre **10.ª URL** vs cierre en 9.

---

## Fase 0 — Contexto Claude Code (sin instalar nada)

**Condición:** cierre editorial de **Fase 1.5** (entrega TIC) y actualización de documentación ([ADR 0008](adr/0008-typescript-sobre-python-para-rag.md), [ADR 0009](adr/0009-claude-code-pro-como-orquestador.md), [ADR 0010](adr/0010-rag-local-chroma-xenova-transformers.md)).

- [x] Crear **`.claude/CLAUDE.md`** con contexto permanente del proyecto (dominio, checklist v1.1, contratos JSON, convenciones del repo)
- [x] Crear las 3 **Skills** en `.claude/skills/`: `auditoria-lc.md`, `auditoria-calidad-web.md`, `pesquisa-criterios.md`
- [x] Verificar `.gitignore` — `rag/chroma_db/` y `documentos/` ya incluidos ✓

**Resultado:** Claude Code ya tiene contexto completo del proyecto desde la primera sesión, sin infraestructura adicional.

---

## Fase 1 — MCP Playwright (captura de HTML)

**Condición:** entorno WSL disponible con Claude Code Pro instalado.

- [x] `claude mcp add playwright npx @playwright/mcp@latest`
- [x] Probar captura de una URL del inventario Clarity; verificar que el HTML se guarda en `auditorias/htmls/`
- [x] Documentar el resultado en el devlog

**Resultado:** Claude Code puede navegar URLs y extraer HTML completo sin intervención manual.

---

## Fase 2 — RAG (colecciones A y B) — completada (jul-2026, WSL)

**Condición:** Chroma instalado en WSL y PDFs normativos disponibles localmente.

- [x] Crear `rag/` con `package.json` y `tsconfig.json` (dependencias: `chromadb`, `@xenova/transformers`, `langchain`)
- [x] `bun install` en `rag/`
- [x] Levantar Chroma local: `chroma run --path ./rag/chroma_db --port 8000`
- [x] Poner PDFs en `documentos/` (solo local; nunca al repo)
- [x] `bun run ingest:b` — ingesta Colección B (datos ya en el repo)
- [x] `bun run ingest:a` — ingesta Colección A (requiere PDFs en `documentos/`)
- [x] Probar con `bun run query "criterio D7 encabezados mayúsculas"` — verificar resultados relevantes
- [x] `claude mcp add rag-auditoria bun /ruta/rag/mcp-server.ts`

**Resultado:** Claude Code puede consultar criterios y precedentes semánticamente con dos colecciones aisladas.

---

## Fase 3 — Flujo completo de auditoría — completada (jul-2026, WSL)

**Condición:** Fases 0, 1 y 2 completadas.

- [x] Probar flujo end-to-end con una URL: Playwright MCP → RAG MCP → análisis → JSON canónico
- [x] Verificar que el JSON generado pasa `validate-claude-audits.ts`
- [x] Implementar arquitectura de **sub-subagentes por grupo temático** (5 grupos: A+E, B+C, D, F, G+H) — ver [`.claude/CLAUDE.md`](../.claude/CLAUDE.md) §17
- [x] Verificar consolidación correcta de los 5 outputs en un único JSON canónico con 39 criterios
- [x] Escalar a lote de URLs con subagents en paralelo (un agente raíz por URL)
- [x] Verificar que los Hooks validan JSONs automáticamente al guardarse
- [ ] Calibrar severidad y prompts con el Equipo UX (G1, D7, E3) — seguimiento editorial con Bernarda

**Resultado:** auditoría completa automatizada de principio a fin, escalable a lotes. Detalle en devlog 2026-07-23.

---

## Fase 3.3 — Captura autenticada (ClaveÚnica) y calibración de datos de sesión

**Condición:** Fase 3 completada. **Entorno:** PC casa — WSL + Chroma + Playwright. Documentación: [`docs/fase-3-3-captura-auth-claveunica.md`](fase-3-3-captura-auth-claveunica.md).

**Rama del lote WSL:** `feat/audit-wsl-session-captures` (mergeado a `main`).

### Hecho en repo (jul-2026 — documentación y tooling)

- [x] Documentar flujo `storageState` + script `capture:tramites-html` y calibración G1–G3 en sesión (`.claude/CLAUDE.md` §19, skills, `SECURITY.md`)
- [x] Marcar ranks **8, 11, 13, 15** como **Pendiente TI** en inventario mock
- [x] Aclarar que **Chroma no navega URLs** — solo Playwright requiere sesión

### Implementación en WSL

- [x] Crear `auditorias/.auth/tramites-session.json` con login manual ClaveÚnica (`playwright codegen --save-storage`)
- [x] Capturar HTML de URLs post-login accesibles (ranks 5–7 u otras) con `bun run capture:tramites-html` — completado 2026-07-27 (rank 7 requirió recaptura vía Playwright MCP por HTML de error en la primera captura)
- [x] Auditar con flujo §17 + calibración §19; JSON en `data/claude-audits/tramites/{fecha}/` — ranks 5–7 en `2026-07-27/`, `bun run validate:claude-audits` OK
- [x] Subir capturas `.html` versionadas (`auditorias/htmls/*_2026-07-27.html`) y reingestar Colección B (`bun run ingest:b`)
- [ ] Coordinación TI para ranks 8, 11, 13, 15 (cuenta prueba, flujos de confirmación/pago)

**Siguiente oleada (opcional):** re-auditar con sesión ranks **3, 4, 10, 12, 14** (JSON aún en `2026-06-11`).

### Implementable hoy en PC empresa (sin WSL / sin Chroma)

- [x] Documentación, skills, ROADMAP y validación de JSON existentes
- [x] Commits, PRs y `typecheck:all`
- [ ] Playwright MCP solo en URLs **públicas** (captura parcial sin RAG)

**Resultado:** auditorías LC sobre pantallas autenticadas sin falsos positivos G1 por datos del solicitante; ranks bloqueados documentados para TI.

---

## Fase 4 — MVP on-demand (cuenta Claude Pro institucional + worker local + BE delgado)

**Contexto (oficina ago-2026, Álvaro / Bernarda):** MVP **sin login** (pegar URL → Continuar → auditoría → PDF + Excel → historial con fecha + nombre libre). TI **no** habilita servidor ni API Claude dedicada: operación con **asiento Enterprise/Pro institucional INAPI** + **worker en PC local 08:00–18:00**. Vercel = UI + API delgada; la auditoría real (10–40 min) corre en el PC con Claude Code §17 **sin reescribir** skills/MCP. Cotizar Anthropic API solo como evidencia de costo (no operar con ella). UX no técnica: sin JSON/HTML/ids en la UI.

**Stack (ADR 0009):** no cambiar — Claude Code orquesta; Playwright MCP + Chroma RAG + skills + §17. **No** Nest/Supabase/Auth en el camino crítico de esta fase.

**Orden obligatorio:** el paso 0 bloquea todo lo demás (auditorías §17 y validación del worker).

### Paso 0 — Cambiar cuenta Claude Pro (personal → institucional INAPI) — BLOQUEANTE

- [x] Confirmar con TI / administración el **asiento Pro o Enterprise institucional** (correo INAPI) y que puede usar **Claude Code** en WSL/PC de trabajo.
- [x] Cerrar sesión de la cuenta **personal** en Claude Code / CLI (`claude` auth) en el entorno de auditoría.
- [x] Iniciar sesión con la cuenta **institucional INAPI**; verificar `claude auth status` (o equivalente) y que el plan activo es el institucional.
- [x] Re-registrar MCP necesarios bajo esa cuenta: Playwright + RAG (`claude mcp list`); Chroma local (`chroma run`) sigue en el mismo PC.
- [x] Smoke test mínimo: una captura Playwright de URL pública + consulta RAG Colección A (sin auditoría completa aún).
- [x] Documentar en DEVLOG: fecha del cambio, cuenta usada (sin secretos), y que a partir de aquí **toda** auditoría §17 y el worker on-demand usan solo la cuenta institucional.
- [x] **Commit atómico (docs):** `docs: registrar migración Claude Pro personal → institucional INAPI` (solo si hay nota operativa en repo; no subir tokens).

**Criterio de salida paso 0:** Claude Code en el PC de trabajo autentica solo con INAPI; MCP verdes; smoke test OK. **Cumplido 2026-08-17** (`farriagada@inapi.cl`, Claude Team · org Inapi; Playwright + rag-auditoria Connected; smoke `www.inapi.cl` + B3).

### Paso 1 — Cerrar checklist v2.1 en `main` (rama ya creada)

Rama existente: `feat/checklist-v2.1-47-criterios` (47 criterios, Zod, skills, MEI Fuentes).

- [x] Revisar diff vs `main`; `bun run typecheck:all` en verde.
- [x] Abrir **PR** → `main` (título/cuerpo alineados a convención de commits).
- [x] Merge tras revisión; actualizar local: `git checkout main && git pull`.
- [x] **No** auditar URLs en este paso.

**Hecho 2026-08-17:** merge en `main` — commit `fad7d70` (`feat(checklist): v2.1 — 47 criterios + Claude Team INAPI`).

### Paso 2 — Documentación worker on-demand (commits atómicos de docs)

Rama: `docs/mvp-worker-on-demand` (desde `main` con checklist v2.1).

- [x] One-pager o borrador ADR: worker local + Claude Code, **sin** API Anthropic operativa; horario 8–18; Vercel orquesta/muestra → [`docs/adr/0011-worker-local-on-demand-vercel.md`](adr/0011-worker-local-on-demand-vercel.md).
- [x] ROADMAP/DEVLOG: historial (fecha + nombre libre), sin auth, persistencia inicial SQLite o `data/jobs/`.
- [x] Borrador cotización API Anthropic (método + placeholders) → [`docs/cotizacion-anthropic-api-evidencia.md`](cotizacion-anthropic-api-evidencia.md) — solo evidencia de costo.
- [x] Commits atómicos:
  1. `docs(adr): borrador worker local on-demand sin API operativa`
  2. `docs: cotización Anthropic API como evidencia de costo (placeholders)`

**Nota:** este paso **no** requiere vincular Cursor ni cuenta Vercel. El túnel y el cableado Continuar→job son pasos 3–4.

### Paso 3 — Contratos BE mínimo (especificación en repo, commit atómico)

Rama: `docs/mvp-audit-jobs-contracts`.

- [x] Especificar en `docs/` los contratos → [`docs/contratos-audit-jobs.md`](contratos-audit-jobs.md):
  - `POST /api/audit-jobs` `{ url, auditorNombre }`
  - `GET /api/audit-jobs/:id` (estado / cola / fuera de horario)
  - `GET /api/audit-jobs/:id/result` (+ historial por URL)
  - Cómo el **worker reclama jobs** (`POST …/claim` + `…/complete`) sin cambiar skills/MCP (§17 intacto)
- [x] Commit: `docs: contratos API audit-jobs y claim del worker local`

### Paso 4 — Implementar mini-backend + cablear Continuar (rama nueva + commits atómicos)

**Después** de planificar archivos en modo plan. Rama nueva desde `main`, p. ej. `feat/mvp-audit-jobs-worker`.

Orden atómico sugerido (un commit / PR slice por ítem; ajustar nombres al plan). Rama: `feat/mvp-audit-jobs-worker`.

1. [x] Persistencia jobs (`data/jobs/` + Zod) — `src/schemas/audit-job.ts`, `src/lib/audit-jobs/store.ts`
2. [x] `POST /api/audit-jobs` + `GET /api/audit-jobs/:id` — routes Next; POST siempre `queued` (horario → ítem 3)
3. [x] Fuera de horario 8–18 America/Santiago → persistir `outside_hours` (contrato: sí se encola diferido)
4. [x] Claim/complete worker: `POST …/claim` + `POST …/:id/complete` + `X-Worker-Secret`
5. [x] Worker script local stub: `bun run worker:audit-jobs` (claim → stub §17 → complete; sin Claude aún)
6. [x] `GET …/result` + historial (fecha + `auditorNombre`; launch + jobs done)
7. [x] UI: Continuar → POST job → `/auditar/procesando?jobId=` con poll (mock timer solo sin jobId)
8. [x] Descargas PDF (+ Excel MEI si URL META) desde resultado; `descargas` en GET …/result
9. [x] Spike túnel Vercel↔PC documentado → [`docs/despliegue/tunel-vercel-worker-pc.md`](despliegue/tunel-vercel-worker-pc.md) (MVP demo = túnel al PC; sin binarios en repo)
10. [x] `bun run typecheck:all` OK (2026-08-18) — abrir PR a `main` desde `feat/mvp-audit-jobs-worker`

**No hacer en este paso:** Nest/Prisma/Supabase Auth; reescribir §17/skills; Anthropic API operativa; exponer JSON/HTML en UI MVP. **Vercel Pro no es requisito** para la API delgada (Hobby suele bastar); las auditorías largas no corren en Vercel.

### Paso 5 — Cinco auditorías META MEI con checklist v2.1 (§17)

**Condición:** pasos 0–1 hechos; confirmar con el usuario **cuáles 5** de `mei-meta-mei-urls.ts`.

**Muestra acordada (órdenes 1–5 de `mei-meta-mei-urls.ts`):** Portada, Marcas, Patentes, Acerca de INAPI, Buscador de noticias. Alcance **solo visible**; `version_checklist: "2.1"` (47 criterios).

- [x] Flujo oficial: Playwright + 5 sub-subagentes + `validate:claude-audits` + cable launch (+ `ingest:b` en PC oficina)
- [x] JSON con `version_checklist: "2.1"` y **47** criterios (órdenes 1–4: `…_2026-08-18` en `main`; orden 5: `www-inapi-cl-buscador-noticias_2026-08-18`, **40,6 %** rechazado; orden 6: `www-inapi-cl-marcas-tramites-solicitud-nueva_2026-08-18`, **47,1 %** rechazado — rama `feat/meta-mei-v21-lote-3`)
- [x] **No** JSON provisorio Cursor
- [x] Commits atómicos **por URL** (`feat(audits): …`) + cableado `claude-audits-launch.ts` / `mei-meta-mei-urls.ts`
- [x] Órdenes **7–10** (Sala de Prensa, 2 noticias detalle, SIAC) — cerradas 2026-08-18 en `feat/meta-mei-v21-lote-3`: orden 7 `www-inapi-cl-sala-de-prensa-noticias_2026-08-18` (63,2 % rechazado); orden 8 `www-inapi-cl-noticia-cuenta-publica-2026_2026-08-18` (41,5 % rechazado); orden 9 `www-inapi-cl-noticia-cifra-patentes-nacionales_2026-08-18` (58,5 % rechazado); orden 10 `tramites-inapi-cl-siac_2026-08-18` (52,8 % rechazado, formulario sin sesión). Las **10 URLs META MEI** quedan en v2.1; Excel completo Bernarda pendiente de generar.

### Paso 6 — Optimizar entregables PDF/Excel (después del paso 5)

- [x] Calibración META MEI documentada (CLAUDE.md §20): VISIBLE vs no visible, patrones Layout, criterios cruzados (`agrupado_en` / `criterios_relacionados`), justificación en `no_aplica` — rama `feat/meta-mei-calibracion-ui-resultado`
- [x] UI `/auditar/resultado`: resumen y nota TI en lenguaje claro (párrafos); barra de criterios plegable; Excel MEI mismo estilo primary que PDF; botón fijo «volver arriba»
- [x] PDF/Excel: comentario en `no_aplica`; criterios relacionados y `patron_sistema` en sustituciones
- [x] Reauditoría §17 con calibración §20 (actualizar % y textos) — **Tanda A (órdenes 1–5)** cerrada 2026-08-19 en `feat/meta-mei-reaudit-s20-lote-a`: orden 1 `www-inapi-cl_2026-08-19` (70,0 % rechazado); orden 2 `www-inapi-cl-marcas_2026-08-19` (66,7 % rechazado); orden 3 `www-inapi-cl-patentes_2026-08-19` (61,0 % rechazado); orden 4 `www-inapi-cl-acerca-de-inapi_2026-08-19` (50,0 % rechazado); orden 5 `www-inapi-cl-buscador-noticias_2026-08-19` (43,8 % rechazado). JSON vigentes `…_2026-08-18` de estas 5 URLs pasan a `history[]`. Aplican `agrupado_en`/`criterios_relacionados`/`patron_sistema` reales (no solo notas en prosa) — % sube en las 5 URLs respecto al 2026-08-18 al no descontar dos veces el mismo hallazgo.
- [x] **Workflow 1-URL profundidad** (rama `feat/audit-workflow-1url-profundidad`): plantilla canónica `.claude/prompts/audit-una-url.md`; `audit-lote.md` acotado (default 1 URL, máx. 2 hermanas; 5 solo smoke); CLAUDE.md §8 playbook herramientas, §12/§14/§17, §20.6 gate evidencia, §21 criterios A9/D3/D4/E3/F4; skill `auditoria-lc` inventario R+U. **Depreca** lote de 5 URLs en un prompt maestro para entregas Bernarda.
- [x] **Entrega visible H1/47 filas** (rama `fix/entrega-visible-h1-47-criterios`): filtro metadata no oculta E4/H1; acordeón UI/PDF siempre 47 criterios v2.1; negaciones «no se evaluó title/meta» no disparan exclusión.
- [x] **Excel por URL / completo: 47 criterios + 5 categorías Bernarda**: filas A1–H1 en web INAPI / TRAMITES; secciones Cumple → No aplica; alineado a UI/PDF.
- [x] **Entrega legible humana (§22) + mapa Bernarda PTD v2.0**: CLAUDE.md §22, skills y `audit-una-url.md` (propuesto/motivo/ubicación para CMS); `docs/checklist-bernarda-v2-ptd-mapa.md` (LC 2026 en motor; Usabilidad/Seguridad fuera de §17).
- [ ] **Reauditoría completa órdenes 1–10** con workflow 1-URL + §20/§21/§22 (fecha sugerida `2026-08-20`; una sesión Claude Code por URL). Órdenes **1–6** cerradas `…_2026-08-20`; órdenes **7–10** marcadas `reauditoriaEnProceso` en la UI META MEI hasta cablear.
- [ ] Excel META MEI completo Bernarda de las 10 URLs tras esa reauditoría
- [ ] Commits atómicos por entregable (`feat(pdf): …`, `feat(mei): …`)

### Spike opcional (si sobra tiempo)

- [ ] Cola local + fuera de horario más robusto; Continuar→job ya cubierto en paso 4
- [ ] Endurecer túnel y runbook 8–18 para demostración a Álvaro/Bernarda

**Éxito de la Fase 4:** cuenta Claude institucional operativa + checklist v2.1 en `main` + docs worker/BE + mini-backend cableado a Continuar (o plan cerrado si el código queda en PR) + **10 auditorías §17 v2.1** (órdenes META MEI 1–10, ago-2026) + calibración §20 y UI resultado en `main` + Tanda A §20 en historial + **workflow 1-URL** documentado; queda pendiente **reauditoría 1–10** con ese workflow, Excel Bernarda de las 10 URLs, y merges pendientes a `main`.

---

## Fase 5 — Producción (servidor TI)

**Condición:** flujo completo validado en local (Fases 3 y 4) y coordinación con TI INAPI.

- [ ] Coordinar con Álvaro / Bernarda / Octavio: viabilidad del servidor, puertos, OS, capacidad CPU
- [ ] Copiar `rag/chroma_db/` al servidor TI (no hay que reingestar)
- [ ] Levantar `mcp-server.ts` como servicio en el servidor TI
- [ ] Configurar Claude Code en los equipos del equipo para apuntar al servidor remoto
- [ ] Verificar flujo completo desde distintas máquinas del equipo

**Resultado:** el equipo completo puede usar el RAG desde sus máquinas sin depender del equipo de desarrollo encendido.

---

## Backlog — persistencia y backend (fase posterior)

Estos ítems no bloquean las Fases 0–5. Se inician cuando el producto necesite persistencia multiusuario o autenticación institucional.

- [ ] Proyecto **Supabase** (PostgreSQL 16, Auth, RLS) según [`docs/DATABASE.md`](DATABASE.md)
- [ ] API de dominio en **Railway** (tier gratuito) — decisión de tecnología pendiente de ADR específico cuando se inicie
- [ ] Autenticación institucional con TI INAPI (magic link, Google Workspace u otro)
- [ ] Histórico por URL en UI con persistencia real (BD; distinto del historial versionado MVP ya en frontend)
- [ ] Auditorías programadas (cron)
- [ ] Roles (revisor vs editor)
- [ ] Panel de métricas agregadas
- [x] **Historial versionado por URL en UI** (`feat/frontend-audit-history`, jul-2026): `/auditar/historial` (índice + filtro Trámites/Sitio Web) y `/auditar/historial/[rank]` (fechas vigente + `history[]`); botón en ingreso de URL; ficha Clarity e inventario Clarity enlazan al historial; `CLARITY_AUDIT_ID_SET` incluye ids históricos para abrir informes en `/auditar/resultado`.
- [x] **MEI Calidad Web PTD en UI** (`feat/mei-calidad-web-export-ui` + `10-urls-meta-mei-excel`, jul-2026): módulo `/auditar/mei-calidad-web` con tablero trimestral jerárquico (hito→actividad); export XLSX Bernarda + Fuentes; muestra META MEI 10 URLs (3 §17 el 2026-07-29).

---

## Dependencias externas

- Alineación con TI INAPI (Octavio): asiento **Claude Pro/Enterprise institucional** (Fase 4 paso 0) y, más adelante, viabilidad del servidor interno (Fase 5).
- Alineación con Álvaro / Bernarda: MVP on-demand 8–18, entrega TIC del piloto 1.5 (PDFs + HTML corregido).
- Prioridades CORFO / OpenProject (ajustar fechas con liderazgo).

---

## Post-MVP (backlog)

- Auditorías programadas (cron)
- Roles (revisor vs editor)
- Panel de métricas agregadas
