# MVP — Aplicativo de auditoría de lenguaje claro INAPI

Plataforma web (futuro) con apoyo de IA para evaluar el **Checklist editorial INAPI** v1.1 sobre URLs de `inapi.cl` y `tramites.inapi.cl`.

---

## Documentación del producto y la arquitectura

| Documento | Descripción |
| --- | --- |
| [docs/PRD.md](docs/PRD.md) | Requisitos de producto y alcance del MVP |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Arquitectura objetivo (frontend, backend, IA) |
| [docs/DATABASE.md](docs/DATABASE.md) | Modelo de datos Supabase y PostgreSQL |
| [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) | Tokens y patrones de interfaz |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Hitos, fases y backlog |
| [docs/development/DEVLOG.md](docs/development/DEVLOG.md) | Bitácora de desarrollo |

---

## Decisiones de arquitectura (ADR)

Convención de archivos: `docs/adr/NNNN-titulo-en-kebab-case.md`.

| # | Título |
| --- | --- |
| 0001 | [Plantilla y propósito de los ADR](docs/adr/0001-record-architecture-decisions.md) |
| 0002 | [Stack: Next.js, Bun y Supabase](docs/adr/0002-stack-next-bun-supabase.md) |
| 0003 | [Contract-first: mocks con Zod](docs/adr/0003-contract-first-mocking-with-zod.md) |
| 0004 | [Evaluación con LLM y versionado de prompts](docs/adr/0004-llm-checklist-evaluation-and-versioning.md) |
| 0005 | [API de dominio: NestJS y Prisma](docs/adr/0005-api-backend-nestjs-prisma.md) |
| 0006 | [Evaluación LC: Python, Claude API y AWS](docs/adr/0006-lc-evaluation-python-claude-aws.md) |

---

## Datos y contratos (fase mock)

| Recurso | Descripción |
| --- | --- |
| [data/checklist-criteria.json](data/checklist-criteria.json) | Catálogo versionado de los **39 criterios** (fuente para mocks, prompts y futura base de datos) |
| `data/audit-fixtures/` (previsto) | **Fixtures** de auditorías completas (JSON) validadas con `strictAuditRecordSchema`; ver [docs/ROADMAP.md](docs/ROADMAP.md) y [docs/DATABASE.md](docs/DATABASE.md) |
| [src/schemas/checklist.ts](src/schemas/checklist.ts) | Esquemas **Zod**, tipos inferidos y helpers para mocks y validación |

Validación local: **un solo** `bun install` en la raíz (workspace Bun). Contratos y scripts en la raíz; Next en `frontend/`.

```bash
bun install
bun run validate:checklist
# cuando exista el script en package.json:
# bun run validate:audit-fixtures
bun run typecheck
bun run typecheck:frontend
cd frontend && bun run dev
```

Desde la raíz también puedes usar `bun run dev` (delega en `frontend`).

Importar esquemas compartidos en el front: `@contracts/checklist` (ver `frontend/tsconfig.json`).

---

## Convenciones del repositorio (devlog y Git)

Pauta base para el formato del [devlog](docs/development/DEVLOG.md) y para los mensajes de commit al trabajar en GitHub:

| Tema | Ubicación |
| --- | --- |
| Formato del devlog | [.agents/workflows/devlog-standard.md](.agents/workflows/devlog-standard.md) |
| Convención de commits | [.agents/workflows/git-commit-convention.md](.agents/workflows/git-commit-convention.md) |

---

## Próximo paso

Seguir [docs/ROADMAP.md](docs/ROADMAP.md) **Fase 1 — pendientes**: design system en toda la UI, home con atajos a tres URLs, resultado con barra térmica y pasos a seguir, estado de carga honesto (WCAG), fixtures JSON + script de validación, demo UX. La UI Next está en **`frontend/`**. Arquitectura objetivo (Nest, Python, Claude, AWS) en [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) y [docs/adr/0006-lc-evaluation-python-claude-aws.md](docs/adr/0006-lc-evaluation-python-claude-aws.md).
