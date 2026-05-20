# Roadmap
## MVP — Aplicativo de Auditoría de Lenguaje Claro INAPI

**Última actualización:** 2026-05-21

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

### Pendiente (UI y datos mock)

- [x] **Design system Gobierno de Chile** ([`docs/DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md)) aplicado en **toda** la UI del MVP: tipografías (Roboto Slab / Roboto Sans), tokens de color, espaciado y revisión de contraste (WCAG) en `frontend` (p. ej. `globals.css`, layout, componentes).
- [x] **Marco visual institucional (prototipo de alta fidelidad):** cáscara común al **MVP mock completo**, no solo a `/auditar`: portada de **acceso institucional** (`/`), flujo de auditoría (`/auditar`, captura, resultado). Incluye **fondo de página** con neutro del tema (p. ej. superficies `muted` / sidebar del design system) para separar jerárquicamente el lienzo de las **tarjetas** (`card` / `background`); **cabecera** con logo INAPI a la izquierda. A la derecha: **(1) Tema claro/oscuro — funcional y prioritario:** alternancia solo entre tokens ya definidos en [`docs/DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) §7 y en `globals.css` (`:root` / `.dark`), sin hex ad hoc; control accesible (`aria-label` claro, foco con `--ring` §3.5, área táctil acorde a WCAG §12). **(2) Usuario y configuración — demostración hasta definir negocio:** antes de modelar tipos de usuario, permisos e importancia de cada rol, abrir **modales superpuestos** con fondo semitransparente y **blur** (p. ej. Radix Dialog + tokens `background`/`foreground`/`border-border`), copy breve de “definición pendiente” y cierre explícito; sin simular inicio de sesión ni datos personales. Opcionalmente **secciones** dentro de tarjetas con `border-border`, fondos `muted` suaves y contraste §4 y radios/elevación §8, sin saturar de primario la cabecera. Con esto se trabaja el MVP como **prototipo institucional** desde el layout raíz; **después** se abordan **home** (portal de acceso, sin duplicar ingreso URL) y **atajos en `/auditar`**, más el resto de pendientes de esta fase.
- [x] **Home (`/`) — portal de acceso institucional:** pantalla de **bienvenida / acceso** alineada al UI kit Gobierno (p. ej. tarjeta primaria centrada, wordmark INAPI, mensaje de bienvenida al aplicativo de auditoría LC, CTA **Acceder** que navega a **`/auditar`**). Objetivo de producto: **un solo punto de entrada** “institucional” para funcionarios que auditan URLs; **evitar** una segunda pantalla con la misma función que `/auditar` (ingreso de URL). En Fase 1 **no** hay autenticación real ni captura de credenciales; el aspecto “auth” es **solo de composición visual** y expectativa mental de acceso restringido al trabajo de auditoría.
- [x] **`/auditar` — ingreso de URL, atajos, inventarios en barras colapsables:** **barra principal** de ingreso de URL (mismos dominios y validación que hoy). **Debajo** del bloque de ingreso (o modal de URL, según diseño), sección de **tres atajos** con copy tipo **prioridades del equipo** o **seguimiento** (p. ej. “más auditadas / estado conocido”), mapeadas a perfiles **peor / intermedio / mejor** desempeño LC según **criterio editorial de referencia** o **fixtures** etiquetados. Comportamiento mock acordado: al pulsar un atajo, navegación **directa a la pantalla de resultado** (`/auditar/resultado?url=…` o convención equivalente), asumiendo URL **ya trabajada** en el mock (p. ej. análisis previo con Claude en fases posteriores; en Fase 1 datos generados coherentes con el perfil). Las **listas seccionadas** de apoyo (p. ej. **~20 URLs Clarity**, **URLs más auditadas**, **URLs con estados resueltos** u otras que defina el producto) conviven en la misma pantalla mediante **barras / acordeones desplegables** con **un mismo patrón visual**: **título claro** en la cabecera del trigger **antes** de expandir, **icono de flecha hacia abajo** (o chevron equivalente) como affordance de despliegue; **contraste legible** respecto al lienzo sin ruido (tokens `border-border`, superficies `card` / `background` / `muted` según [`docs/DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) §15); **aire y `gap` vertical uniforme** entre cada barra para separación consistente entre secciones. Contenido de referencia de datos: [`docs/ux/inventario-urls-clarity.md`](ux/inventario-urls-clarity.md) (lista canónica por completar cuando el equipo consolide enlaces absolutos). Duplicar en `data/` solo si se requiere consumo máquina (JSON) más adelante.
- [ ] **Actualización de documentación con Equipo UX y tabla de criterios completa:** (1) Volcar en `docs/` (p. ej. [`DATABASE.md`](DATABASE.md), [`ARCHITECTURE.md`](ARCHITECTURE.md), [`docs/development/DEVLOG.md`](development/DEVLOG.md)) los **acuerdos, aclaraciones y feedback** del **Equipo UX** sobre **modelo de datos**, **parseo** del registro de auditoría mock y coherencia entre contrato Zod y persistencia futura. (2) En **`/auditar/resultado`**, completar la **tabla de los 39 criterios** con columnas **severidad** (`baja` \| `media` \| `alta`) y **comentario** (texto breve por fila cuando aplique), pobladas en **mock** de forma creíble y alineadas a `criterionEvaluationSchema` en [`src/schemas/checklist.ts`](../src/schemas/checklist.ts) y a las columnas `severidad` / `comentario` de `audit_criterion_results` en [`DATABASE.md`](DATABASE.md) §2.
- [ ] **Resultado mock:** **barra térmica** (o equivalente visual) del `porcentaje_cumplimiento` alineada al design system; bloque de **pasos a seguir** según `estado_aceptacion` (`rechazado` / `aceptado_con_observaciones` / `aprobado`); mostrar **texto propuesto** desde datos mock (hasta integrar LLM en Fase 2). *Las columnas **severidad** y **comentario** de la tabla de criterios quedan cubiertas por el ítem **Actualización de documentación con Equipo UX y tabla de criterios completa** anterior.*
- [ ] **Estado intermedio** entre ingreso y resultado (modal, spinner o barra): mensaje en **lenguaje claro**, accesible (WCAG), **sin** afirmar comunicación real con base de datos hasta existir backend.
- [ ] **Fixtures de auditoría:** 2–3 archivos JSON en `data/audit-fixtures/` (u otra convención documentada), cada uno validado con `strictAuditRecordSchema`; script `validate:audit-fixtures` en raíz; la UI debe poder **importar** o seleccionar fixture por identificador (coherente con las tres franjas de aceptación: ≤80 %, 81–90 %, ≥91 % sobre criterios aplicables).
- [ ] **Demo interna** con **Equipo UX**: sesión grabada (enlace externo al repo); **notas de feedback** y decisiones en `docs/` o [`docs/development/DEVLOG.md`](development/DEVLOG.md).

---

## Fase 2 — Persistencia, API y evaluación asistida (post-aprobación mock)

**Condición:** cierre aprobado de la Fase 1 (UI mock + demo UX).

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

- [ ] Export PDF/Word
- [ ] Histórico por URL en UI
- [ ] Pruebas con muestra de URLs reales; calibración de severidad y prompt

---

## Dependencias externas

- Alineación con TI INAPI (dominios, auth institucional, políticas de datos).
- Prioridades CORFO / OpenProject (ajustar fechas con liderazgo).

---

## Post-MVP (backlog)

- Auditorías programadas (cron)
- Roles (revisor vs editor)
- Panel de métricas agregadas
