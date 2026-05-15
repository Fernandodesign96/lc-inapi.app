# Arquitectura del sistema
## MVP — Aplicativo de Auditoría de Lenguaje Claro INAPI

| Metadatos | Detalle |
| --- | --- |
| **Versión** | 0.3 |
| **Tipo** | Web app — Next.js (App Router) + API NestJS (Prisma) + Postgres/Auth (Supabase) + **servicio de evaluación LC (Python, Claude API)** + entorno compartido **AWS** |
| **Gestor de paquetes** | Bun |

---

## 1. Visión general

### 1.1 Objetivo (runtime con backend y LLM)

```
┌─────────────────────────────────────────────────────────────┐
│  Cliente (Browser) — Next.js App Router                     │
│  Formularios (RHF+Zod) · Barra térmica / resultado · WCAG   │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTPS
┌────────────────────────────▼────────────────────────────────┐
│  Next.js servidor — Route Handlers / Server Actions (ligeros)│
│  · UI y proxy hacia API si aplica                           │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTPS (API aplicación)
┌────────────────────────────▼────────────────────────────────┐
│  NestJS — API de dominio                                    │
│  · Validación Zod / DTOs                                    │
│  · Captura URL (Cheerio/Playwright según ADR futuro)        │
│  · Orquestación flujo auditoría → invocación evaluación LC  │
│  · Prisma → Postgres (Supabase)                             │
└───────┬──────────────────────────────┬──────────────────────┘
        │                              │
        │ Postgres + Auth + RLS        │ HTTPS interno / cola / RPC
        │                              ▼
        │              ┌──────────────────────────────┐
        │              │  Servicio evaluación LC     │
        │              │  Python · Claude API        │
        │              │  · Prompts versionados      │
        │              │  · Salida JSON → Zod        │
        │              │    (strictAuditRecordSchema)│
        │              └──────────────────────────────┘
        ▼
┌───────────────────┐
│  Supabase         │
│  · Auth           │
│  · Row Level Sec. │
│  · Storage (exports opcional) │
└───────────────────┘
```

**Despliegue:** componentes anteriores pueden ejecutarse en **AWS** (entorno compartido de desarrollo o staging) para no depender de equipos locales; topología concreta por decisión de infraestructura (ver [ADR 0006](adr/0006-lc-evaluation-python-claude-aws.md)).

### 1.2 Fase mock (Fase 1 producto)

Hasta aprobar el mock de UI:

- **No** hay llamadas productivas a Supabase ni a Claude desde la app demo.
- Contratos y datos: **`data/checklist-criteria.json`**, futuros **`data/audit-fixtures/*.json`**, [`src/schemas/checklist.ts`](../src/schemas/checklist.ts).
- Next en `frontend/` sirve flujo **ingreso → estado de carga (copy honesto) → resultado** con datos generados o importados desde fixtures validados.

---

## 2. Decisiones de stack (resumen)

| Capa | Elección | Notas |
| --- | --- | --- |
| Framework | **Next.js** (última estable, App Router) | Turbopack en `next dev` (default en versiones recientes) |
| Lenguaje | TypeScript estricto | Compartir esquemas Zod FE/BE |
| UI | Tailwind + shadcn/ui + **Design system** INAPI/Gobierno ([`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md)) | Fase 1: alinear tokens y tipografía al MVP |
| Formularios | React Hook Form + Zod | Misma fuente de verdad que mocks |
| Datos | **Supabase** (Postgres) + **Prisma** en Nest | Mismo motor; ORM y migraciones en el servicio API ([ADR 0005](adr/0005-api-backend-nestjs-prisma.md)) |
| API de aplicación | **NestJS** (Node.js) | Dominio, persistencia, orquestación hacia servicio de evaluación |
| Evaluación LC + LLM | **Python** + **Claude API** | [ADR 0006](adr/0006-lc-evaluation-python-claude-aws.md); validación contractual [ADR 0004](adr/0004-llm-checklist-evaluation-and-versioning.md) |
| Runtime local / CI | **Bun** | `bun install`, `bun run`, lockfile `bun.lock` |
| Infra compartida | **AWS** (dev/staging) | Acuerdo de equipo; detalle en ADR 0006 |

Detalle en [docs/adr/0002-stack-next-bun-supabase.md](adr/0002-stack-next-bun-supabase.md), [docs/adr/0004-llm-checklist-evaluation-and-versioning.md](adr/0004-llm-checklist-evaluation-and-versioning.md), [docs/adr/0005-api-backend-nestjs-prisma.md](adr/0005-api-backend-nestjs-prisma.md) y [docs/adr/0006-lc-evaluation-python-claude-aws.md](adr/0006-lc-evaluation-python-claude-aws.md).

---

## 3. Contratos de datos

- **Catálogo:** `checklistCriteriaFileSchema` ↔ `data/checklist-criteria.json`.
- **Evaluación:** `criterionEvaluationSchema` × 39.
- **Auditoría persistida o mock:** `auditRecordSchema` / `strictAuditRecordSchema` (consistencia resumen vs. detalle).
- **Fixtures:** JSON versionado bajo `data/audit-fixtures/` (convención en roadmap), validados en CI o script local igual que el catálogo.

Implementación: [`src/schemas/checklist.ts`](../src/schemas/checklist.ts).

---

## 4. Flujo principal (runtime objetivo)

1. Usuario autenticado (Supabase Auth; método a definir con TI: magic link, Google workspace, etc.).
2. Ingresa URL o elige URL prioritaria (inventario interno; ver `url_index` en [DATABASE.md](DATABASE.md)).
3. Servidor ejecuta **captura**; se muestra texto para confirmación.
4. NestJS solicita **evaluación** al **servicio Python** (Claude) con criterios versionados + texto.
5. Respuesta JSON → validación Zod (`strictAuditRecordSchema` cuando sea registro completo) → reintento o degradación si falla ([ADR 0004](adr/0004-llm-checklist-evaluation-and-versioning.md)).
6. Usuario revisa **texto propuesto** y hallazgos.
7. Guardado en Postgres; histórico por URL; export.

---

## 5. Seguridad

- **RLS** en todas las tablas con datos de usuario/auditoría.
- **Service role** de Supabase y **claves Anthropic** solo en entorno servidor (Nest y/o servicio Python); **nunca** en el cliente ni en variables `NEXT_PUBLIC_*`.
- Logs sin contenido sensible completo (opcional: hash del texto).

---

## 6. Observabilidad

- Métricas de latencia por etapa: captura, **evaluación Python/Claude**, persistencia.
- Traza `audit_id` en logs servidor y correlación entre Nest y worker Python cuando aplique.

---

*Ver también [DATABASE.md](DATABASE.md). El índice de ADR está en el [README.md](../README.md) en la raíz del repositorio.*
