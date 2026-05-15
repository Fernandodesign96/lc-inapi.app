# Roadmap
## MVP — Aplicativo de Auditoría de Lenguaje Claro INAPI

**Última actualización:** 2026-05-13

---

## Fase 0 — Documentación y contratos (completada en repo)

- [x] PRD, arquitectura, base de datos, design system, ADRs
- [x] `data/checklist-criteria.json` + validación Zod (`src/schemas/checklist.ts`)
- [x] Script `validate-checklist-data.ts`

---

## Fase 1 — Mock UX e interfaz institucional (sin backend productivo)

**Orden de negocio:** entregar MVP **mock** aprobado por equipo (UX y liderazgo) **antes** de integrar API, base de datos y evaluación real con LLM (Fase 2).

### Hecho en repo

- [x] Inicializar Next.js (Bun) + Tailwind + shadcn/ui + RHF/Zod
- [x] Pantallas: ingreso URL (`/auditar`), vista texto capturado (mock), resultado con tabla de **39** criterios y datos generados con `buildDemoStrictAudit` / contrato Zod

### Pendiente (UI y datos mock)

- [ ] **Design system Gobierno de Chile** ([`docs/DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md)) aplicado en **toda** la UI del MVP: tipografías (Roboto Slab / Roboto Sans), tokens de color, espaciado y revisión de contraste (WCAG) en `frontend` (p. ej. `globals.css`, layout, componentes).
- [ ] **Home:** barra principal de ingreso de URL; **atajos** a **tres** URLs del inventario priorizado (mejor / intermedio / peor desempeño según criterio editorial o fixtures etiquetados). Referencia al inventario ampliado (p. ej. ~20 URLs seguimiento Clarity / documento equipo); la lista detallada puede vivir en `docs/ux/` o `data/` según política de datos.
- [ ] **Resultado mock:** **barra térmica** (o equivalente visual) del `porcentaje_cumplimiento` alineada al design system; bloque de **pasos a seguir** según `estado_aceptacion` (`rechazado` / `aceptado_con_observaciones` / `aprobado`); mostrar **texto propuesto** desde datos mock (hasta integrar LLM en Fase 2).
- [ ] **Estado intermedio** entre ingreso y resultado (modal, spinner o barra): mensaje en **lenguaje claro**, accesible (WCAG), **sin** afirmar comunicación real con base de datos hasta existir backend.
- [ ] **Fixtures de auditoría:** 2–3 archivos JSON en `data/audit-fixtures/` (u otra convención documentada), cada uno validado con `strictAuditRecordSchema`; script `validate:audit-fixtures` en raíz; la UI debe poder **importar** o seleccionar fixture por identificador (coherente con las tres franjas de aceptación: ≤80 %, 81–90 %, ≥91 % sobre criterios aplicables).
- [ ] **Demo interna** con equipo UX: sesión grabada (enlace externo al repo); **notas de feedback** y decisiones en `docs/` o [`docs/development/DEVLOG.md`](development/DEVLOG.md).

---

## Fase 2 — Persistencia, API y evaluación asistida (post-aprobación mock)

**Condición:** cierre aprobado de la Fase 1 (UI mock + demo UX).

- [ ] Proyecto **Supabase** (Auth, Postgres, RLS) según [`docs/DATABASE.md`](DATABASE.md)
- [ ] App **NestJS** + **Prisma**: migraciones iniciales (`audits`, resultados detallados, `checklist_versions`, etc.) contra Postgres de Supabase ([ADR 0005](adr/0005-api-backend-nestjs-prisma.md))
- [ ] **Contrato HTTP** frontend ↔ API de dominio; Next (Server Actions / Route Handlers) solo donde aporte valor frente a llamadas directas al API
- [ ] **Evaluación de lenguaje claro con Claude API** orquestada desde un **servicio en Python** (prompts estrictos, salida JSON validada con Zod en frontera de sistema); límites de responsabilidad respecto a NestJS en [ADR 0006](adr/0006-lc-evaluation-python-claude-aws.md)
- [ ] **Entorno compartido en AWS** (desarrollo o staging) para que el flujo no dependa de equipos personales encendidos; detalle de servicio (EC2, contenedor, etc.) por acuerdo de infraestructura

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
