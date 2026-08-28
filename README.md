# MVP — Aplicativo de auditoría de lenguaje claro INAPI

Plataforma web con apoyo de IA para evaluar el **Checklist editorial INAPI PTD-LC v3.0** (**51** criterios `LC-*`) sobre URLs de `inapi.cl` y `tramites.inapi.cl` (muestra META MEI: **11 URLs**). Orquestación: **Claude Code** + Playwright MCP + Chroma/Xenova/LangChain; UI en **Vercel**.

---

## Documentación del producto y la arquitectura

| Documento | Descripción |
| --- | --- |
| [docs/PRD.md](docs/PRD.md) | Requisitos de producto y alcance del MVP |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Arquitectura vigente (Claude Code + Vercel + RAG) |
| [docs/DATABASE.md](docs/DATABASE.md) | Persistencia MVP = JSON en repo (Postgres histórico) |
| [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) | Tokens y patrones de interfaz |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Hitos, fases y backlog |
| [docs/flujo-piloto-10-urls-claude-mvp.md](docs/flujo-piloto-10-urls-claude-mvp.md) | Runbook META MEI 10 / Clarity / orquestación / fixture histórico |
| [docs/plantilla-excel-mei-bcd.md](docs/plantilla-excel-mei-bcd.md) | Plantilla Excel MEI |
| [docs/SECURITY.md](docs/SECURITY.md) | Higiene del repo y stack IA local |
| [docs/despliegue/despliegue-hibrido.md](docs/despliegue/despliegue-hibrido.md) | Despliegue híbrido: Vercel + GitHub + Claude Code / RAG |
| [docs/PROPUESTA_TECNICA_INTEGRAL.md](docs/PROPUESTA_TECNICA_INTEGRAL.md) | Propuesta técnica v3.0 — AI Stack vigente |
| [docs/development/DEVLOG.md](docs/development/DEVLOG.md) | Bitácora de desarrollo |

---

## Decisiones de arquitectura (ADR)

Convención de archivos: `docs/adr/NNNN-titulo-en-kebab-case.md`.

| # | Título | Estado |
| --- | --- | --- |
| 0001 | [Plantilla y propósito de los ADR](docs/adr/0001-record-architecture-decisions.md) | Aceptado |
| 0002 | [Stack: Next.js, Bun y (hist.) Supabase](docs/adr/0002-stack-next-bun-supabase.md) | **Obsoleto** en Firebase/Postgres; Next+Bun vigente |
| 0003 | [Contract-first: Zod](docs/adr/0003-contract-first-mocking-with-zod.md) | Aceptado (act. 2026-08-21) |
| 0004 | [LLM, Playwright y versionado](docs/adr/0004-llm-checklist-evaluation-and-versioning.md) | Aceptado (act. 2026-08-21) |
| 0006 | [Evaluación LC: Python/AWS — histórico](docs/adr/0006-lc-evaluation-python-claude-aws.md) | **Supersedido** (clarificado 2026-08-21) |
| 0007 | [Parseo y embeddings Xenova](docs/adr/0007-modelo-datos-parseo-pre-conexiones.md) | Aceptado (reescrito 2026-08-21) |
| 0008 | [TypeScript sobre Python para RAG y orquestación](docs/adr/0008-typescript-sobre-python-para-rag.md) | Aceptado |
| 0009 | [Claude Code Pro como orquestador principal](docs/adr/0009-claude-code-pro-como-orquestador.md) | Aceptado |
| 0010 | [RAG local con Chroma y @xenova/transformers](docs/adr/0010-rag-local-chroma-xenova-transformers.md) | Aceptado |
| 0011 | [Worker local on-demand (Vercel + Claude Code)](docs/adr/0011-worker-local-on-demand-vercel.md) | Borrador |

---

## Datos y contratos (fase mock)

| Recurso | Descripción |
| --- | --- |
| [data/checklist-criteria.json](data/checklist-criteria.json) | Catálogo versionado de los **47 criterios** v2.1 (fuente para mocks, prompts y futura base de datos) |
| [data/audit-fixtures/](data/audit-fixtures/) | **Fixtures** de auditorías completas (JSON) validadas con `strictAuditRecordSchema`; convención y scripts en [data/audit-fixtures/README.md](data/audit-fixtures/README.md) |
| [data/ux/clarity-fichas-mock.json](data/ux/clarity-fichas-mock.json) | **22 fichas** mock Calidad Web (objetivo): ranks 1–20 `tramites.inapi.cl`, 21–22 `sitioweb`; campo **`type_url`**; fuente de la tabla en `/auditar` — ver [docs/ux/inventario-urls-clarity.md](docs/ux/inventario-urls-clarity.md) |
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

## AI Stack

El sistema de auditoría automatizada se organiza en 5 capas. Detalle completo en [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) y [docs/PROPUESTA_TECNICA_INTEGRAL.md](docs/PROPUESTA_TECNICA_INTEGRAL.md).

| Capa | Tecnología |
| --- | --- |
| Orquestación | Claude Code Pro (WSL, suscripción existente) |
| Captura HTML | Playwright MCP |
| Embeddings | `@xenova/transformers` — offline en CPU |
| Base vectorial | Chroma local → servidor TI INAPI en producción |
| Pipeline RAG | LangChain.js (TypeScript) |
| Frontend | Next.js en Vercel |

---

## Estado y próximo paso

**Operativo:** muestra META MEI (**11 URLs**), checklist PTD-LC **v3.0** (51 `LC-*`), UI/PDF/Excel en Vercel, orquestación Claude Code (`.claude/prompts/01`…`07` + `skills/01`…`06`).

**Runbook de URLs y cableado:** [docs/flujo-piloto-10-urls-claude-mvp.md](docs/flujo-piloto-10-urls-claude-mvp.md).  
**Roadmap:** [docs/ROADMAP.md](docs/ROADMAP.md) — reauditorías v3.0, worker on-demand (ADR 0011), calibración con Equipo UX.
