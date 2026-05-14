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

---

## Datos y contratos (fase mock)

| Recurso | Descripción |
| --- | --- |
| [data/checklist-criteria.json](data/checklist-criteria.json) | Catálogo versionado de los **39 criterios** (fuente para mocks, prompts y futura base de datos) |
| [src/schemas/checklist.ts](src/schemas/checklist.ts) | Esquemas **Zod**, tipos inferidos y helpers para mocks y validación |

Validación local: **un solo** `bun install` en la raíz (workspace Bun). Contratos y scripts en la raíz; Next en `frontend/`.

```bash
bun install
bun run validate:checklist
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

La UI Next está en **`frontend/`** (`frontend/src/app`). Continuar fase mock en [docs/ROADMAP.md](docs/ROADMAP.md): shadcn/ui, RHF/Zod y pantallas. Contratos siguen en `src/schemas/` y `data/` en la raíz.
