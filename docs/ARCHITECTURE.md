# Arquitectura del sistema
## MVP — Aplicativo de Auditoría de Lenguaje Claro INAPI

| Metadatos | Detalle |
| --- | --- |
| **Versión** | 0.2 |
| **Tipo** | Web app — Next.js (SSR/CSR) + API NestJS (Prisma) + Postgres/Auth (Supabase) + jobs opcionales |
| **Gestor de paquetes** | Bun |

---

## 1. Visión general

```
┌─────────────────────────────────────────────────────────────┐
│  Cliente (Browser) — Next.js App Router                     │
│  Formularios (RHF+Zod) · Tablas hallazgos · Dashboard URLs  │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTPS
┌────────────────────────────▼────────────────────────────────┐
│  Next.js servidor — Route Handlers / Server Actions (ligeros)│
│  · UI y proxy hacia API si aplica                           │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTPS (API interna)
┌────────────────────────────▼────────────────────────────────┐
│  NestJS — API de dominio                                    │
│  · Validación Zod / DTOs                                    │
│  · Orquestación LLM (sin exponer API keys al cliente)       │
│  · Captura URL (Cheerio/Playwright según ADR futuro)        │
│  · Prisma → Postgres                                        │
└───────┬──────────────────────────────┬──────────────────────┘
        │                              │
        │ Postgres + Auth + RLS        │ HTTPS API
        ▼                              ▼
┌───────────────────┐         ┌──────────────────┐
│  Supabase         │         │  Proveedor LLM   │
│  · Auth           │         │  (p. ej. Claude) │
│  · Row Level Sec. │         └──────────────────┘
│  · Storage (exports opcional) │
└───────────────────┘
```

**Fase mock (actual):** solo repositorio con **JSON + Zod**; UI mock puede vivir en Storybook o Next cuando se inicialice el proyecto.

---

## 2. Decisiones de stack (resumen)

| Capa | Elección | Notas |
| --- | --- | --- |
| Framework | **Next.js** (última estable, App Router) | Turbopack en `next dev` (default en versiones recientes) |
| Lenguaje | TypeScript estricto | Compartir esquemas Zod FE/BE |
| UI | Tailwind + shadcn/ui | Coherencia con otros proyectos INAPI-personal |
| Formularios | React Hook Form + Zod | Misma fuente de verdad que mocks |
| Datos | **Supabase** (Postgres) + **Prisma** en Nest | Mismo motor; ORM y migraciones en el servicio API ([ADR 0005](adr/0005-api-backend-nestjs-prisma.md)) |
| API de aplicación | **NestJS** (Node.js) | Dominio, LLM, persistencia vía Prisma; experiencia de equipo |
| Runtime local / CI | **Bun** | `bun install`, `bun run`, lockfile `bun.lock` |
| IA | API server-side | JSON mode / schema validation hacia `strictAuditRecordSchema` cuando aplique |

Detalle en [docs/adr/0002-stack-next-bun-supabase.md](adr/0002-stack-next-bun-supabase.md) y [docs/adr/0005-api-backend-nestjs-prisma.md](adr/0005-api-backend-nestjs-prisma.md).

---

## 3. Contratos de datos

- **Catálogo:** `checklistCriteriaFileSchema` ↔ `data/checklist-criteria.json`.
- **Evaluación:** `criterionEvaluationSchema` × 39.
- **Auditoría persistida:** `auditRecordSchema` / `strictAuditRecordSchema` (consistencia resumen vs. detalle).

Implementación: [`src/schemas/checklist.ts`](../src/schemas/checklist.ts).

---

## 4. Flujo principal (runtime objetivo)

1. Usuario autenticado (Supabase Auth; método a definir con TI: magic link, Google workspace, etc.).
2. Ingresa URL o elige URL prioritaria.
3. Servidor o cliente ejecuta **captura**; se muestra texto para confirmación.
4. Servidor arma prompt con **criterios versionados** + texto.
5. LLM devuelve JSON → validación Zod → si falla, reintento o degradación controlada.
6. Usuario revisa y edita **texto propuesto** y hallazgos.
7. Guardado en Postgres; histórico por URL; export.

---

## 5. Seguridad

- **RLS** en todas las tablas con datos de usuario/auditoría.
- **Service role** de Supabase solo en entorno servidor nunca en cliente.
- Logs sin contenido sensible completo (opcional: hash del texto).

---

## 6. Observabilidad

- Métricas de latencia por etapa: captura, LLM, persistencia.
- Traza `audit_id` en logs servidor.

---

*Ver también [DATABASE.md](DATABASE.md). El índice de ADR está en la sección correspondiente del [README.md](../README.md) en la raíz del repositorio.*
