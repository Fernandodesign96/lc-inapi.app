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
| [docs/SECURITY.md](docs/SECURITY.md) | Higiene del repo, datos en fixtures y checklist post-despliegue |
| [docs/despliegue/despliegue-hibrido.md](docs/despliegue/despliegue-hibrido.md) | Plan por etapas: Vercel, GitHub Actions, Supabase, Nest, AWS LC |
| [docs/PROPUESTA_TECNICA_INTEGRAL.md](docs/PROPUESTA_TECNICA_INTEGRAL.md) | Acuerdos de reunión: roles, monorepo objetivo, Nest ↔ API Gateway ↔ Lambda ↔ Claude, Docker |
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
| 0007 | [Modelo lógico de datos, formato de entrada y parseo (pre-conexiones)](docs/adr/0007-modelo-datos-parseo-pre-conexiones.md) |

---

## Datos y contratos (fase mock)

| Recurso | Descripción |
| --- | --- |
| [data/checklist-criteria.json](data/checklist-criteria.json) | Catálogo versionado de los **39 criterios** (fuente para mocks, prompts y futura base de datos) |
| [data/audit-fixtures/](data/audit-fixtures/) | **Fixtures** de auditorías completas (JSON) validadas con `strictAuditRecordSchema`; convención y scripts en [data/audit-fixtures/README.md](data/audit-fixtures/README.md); ver [docs/ROADMAP.md](docs/ROADMAP.md) y [docs/DATABASE.md](docs/DATABASE.md) |
| [src/schemas/checklist.ts](src/schemas/checklist.ts) | Esquemas **Zod**, tipos inferidos y helpers para mocks y validación (equivalente actual a `packages/contracts` del monorepo objetivo; ver [propuesta técnica integral](docs/PROPUESTA_TECNICA_INTEGRAL.md)) |

Validación local: **un solo** `bun install` en la raíz (workspace Bun). Contratos y scripts en la raíz; Next en `frontend/`.

```bash
bun install
bun run typecheck:all   # validate:checklist + validate:audit-fixtures + tsc (raíz y frontend)
cd frontend && bun run dev
```

(Paso a paso: `bun run validate:checklist`, `bun run validate:audit-fixtures`, `bun run typecheck`, `bun run typecheck:frontend`.)

Desde la raíz también puedes usar `bun run dev` (delega en `frontend`).

Importar esquemas compartidos en el front: `@contracts/checklist` (ver `frontend/tsconfig.json`).

---

## Despliegue y CI (Fase 1 mock)

- **Vercel:** proyecto enlazado al mismo repositorio de GitHub. **Root Directory:** `frontend`. **Install Command:** `cd .. && bun install`. **Build Command:** `cd .. && bun run build` (monorepo Bun: `bun.lock` y workspace en la raíz). Previews por rama o PR según configuración del equipo en el panel de Vercel.
- **Variables:** no son obligatorias para el mock. Si en algún entorno `GET /api/audit-fixtures/<id>` respondiera archivo no encontrado, revisar `LC_REPO_ROOT` y la inclusión de `data/audit-fixtures/` en el despliegue (ver [`docs/despliegue/despliegue-hibrido.md`](docs/despliegue/despliegue-hibrido.md)).
- **GitHub Actions:** workflow **`CI`** en [`.github/workflows/ci.yml`](.github/workflows/ci.yml) — en cada ejecución: `bun install --frozen-lockfile`, `bun run typecheck:all`, `bun run lint`. Se dispara en `push` a `main` y ramas `feature/**`, en `pull_request` hacia `main` y manualmente (`workflow_dispatch`). Revisar resultados en la pestaña **Actions** del repositorio.
- **Plan por etapas** (Supabase, Nest, AWS LC): [`docs/despliegue/despliegue-hibrido.md`](docs/despliegue/despliegue-hibrido.md).

---

## Convenciones del repositorio (devlog y Git)

Pauta base para el formato del [devlog](docs/development/DEVLOG.md) y para los mensajes de commit al trabajar en GitHub:

| Tema | Ubicación |
| --- | --- |
| Formato del devlog | [.agents/workflows/devlog-standard.md](.agents/workflows/devlog-standard.md) |
| Convención de commits | [.agents/workflows/git-commit-convention.md](.agents/workflows/git-commit-convention.md) |

---

## Próximo paso

Seguir [docs/ROADMAP.md](docs/ROADMAP.md) **Fase 1**: el backlog mock principal está cerrado en repo; **Etapa 1 del plan de despliegue híbrido** (Vercel + GitHub Actions + verificación en URL) documentada arriba y en [docs/despliegue/despliegue-hibrido.md](docs/despliegue/despliegue-hibrido.md). **Pendiente** el ítem **demo interna** con Equipo UX (grabación y notas en `docs/` o [docs/development/DEVLOG.md](docs/development/DEVLOG.md)). Completado en repo: design system en la UI; **home** como portal a **`/auditar`**; en **`/auditar`**: ingreso URL, **tres atajos** y propagación de **fixtures** (`data/audit-fixtures/`, API `GET /api/audit-fixtures/…`, importación JSON en resultado), inventarios en **barras colapsables** ([docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) §15) y [docs/ux/inventario-urls-clarity.md](docs/ux/inventario-urls-clarity.md); resultado mock (barra de cumplimiento, pasos a seguir, severidad/comentario en tabla); estado intermedio `/auditar/procesando`. La UI Next está en **`frontend/`**. Arquitectura Fase 2 (Nest ↔ **API Gateway** ↔ **Lambda** Python ↔ Claude, Supabase) en [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/PROPUESTA_TECNICA_INTEGRAL.md](docs/PROPUESTA_TECNICA_INTEGRAL.md) y [docs/adr/0006-lc-evaluation-python-claude-aws.md](docs/adr/0006-lc-evaluation-python-claude-aws.md).
