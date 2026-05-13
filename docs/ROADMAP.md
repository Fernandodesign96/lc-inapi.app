# Roadmap
## MVP — Aplicativo de Auditoría de Lenguaje Claro INAPI

**Última actualización:** 2026-05-13

---

## Fase 0 — Documentación y contratos (completada en repo)

- [x] PRD, arquitectura, base de datos, design system, ADRs
- [x] `data/checklist-criteria.json` + validación Zod (`src/schemas/checklist.ts`)
- [x] Script `validate-checklist-data.ts`

---

## Fase 1 — Mock UX (sin backend productivo)

- [ ] Inicializar Next.js (Bun) + Tailwind + shadcn/ui + RHF/Zod
- [ ] Pantallas: ingreso URL, vista texto capturado (mock), resultado con tabla de 39 criterios
- [ ] Fixtures: 2–3 auditorías mock importadas desde JSON validado con `strictAuditRecordSchema`
- [ ] Demo interna con equipo UX (grabar feedback)

---

## Fase 2 — Supabase y persistencia

- [ ] Proyecto Supabase (Auth, Postgres, RLS)
- [ ] App NestJS + Prisma: migraciones iniciales (`audits`, resultados, `checklist_versions`) contra el Postgres de Supabase
- [ ] Contrato HTTP FE ↔ API; Next (Server Actions / Route Handlers) solo donde aporte valor frente a llamadas directas al API

---

## Fase 3 — Captura real + LLM

- [ ] Servicio de captura (Cheerio vs Playwright — ADR)
- [ ] Integración LLM con salida JSON + validación Zod + reintentos
- [ ] Versionado de prompts en repo o tabla

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
