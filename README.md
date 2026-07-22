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
| [docs/ROADMAP.md](docs/ROADMAP.md) | Hitos, fases y backlog (**Fase 1.5:** piloto 10 URLs + Claude + PDF) |
| [docs/flujo-piloto-10-urls-claude-mvp.md](docs/flujo-piloto-10-urls-claude-mvp.md) | Flujo operativo piloto UX → JSON → MVP → entrega TIC |
| [docs/Propuesta Análisis LC URLs.md](docs/Propuesta%20Análisis%20LC%20URLs.md) | Propuesta y acta reunión junio 2026 |
| [docs/Comparación Auditoría URL Home INAPI Gemini-Claude.md](docs/Comparación%20Auditoría%20URL%20Home%20INAPI%20Gemini-Claude.md) | Comparación proveedores IA (home piloto) |
| [docs/SECURITY.md](docs/SECURITY.md) | Higiene del repo, datos en fixtures y checklist post-despliegue |
| [docs/despliegue/despliegue-hibrido.md](docs/despliegue/despliegue-hibrido.md) | Plan por etapas: Vercel, GitHub Actions, Supabase, Nest, AWS LC |
| [docs/PROPUESTA_TECNICA_INTEGRAL.md](docs/PROPUESTA_TECNICA_INTEGRAL.md) | Propuesta técnica v2.0: AI Stack de 5 capas, procedimiento de implementación (Fases 0–4), decisiones técnicas clave |
| [docs/development/DEVLOG.md](docs/development/DEVLOG.md) | Bitácora de desarrollo |

---

## Decisiones de arquitectura (ADR)

Convención de archivos: `docs/adr/NNNN-titulo-en-kebab-case.md`.

| # | Título | Estado |
| --- | --- | --- |
| 0001 | [Plantilla y propósito de los ADR](docs/adr/0001-record-architecture-decisions.md) | Aceptado |
| 0002 | [Stack: Next.js, Bun y Supabase](docs/adr/0002-stack-next-bun-supabase.md) | Aceptado |
| 0003 | [Contract-first: mocks con Zod](docs/adr/0003-contract-first-mocking-with-zod.md) | Aceptado |
| 0004 | [Evaluación con LLM y versionado de prompts](docs/adr/0004-llm-checklist-evaluation-and-versioning.md) | Aceptado |
| 0005 | [API de dominio: NestJS y Prisma](docs/adr/0005-api-backend-nestjs-prisma.md) | **Supersedido** por ADR 0009 |
| 0006 | [Evaluación LC: Python, Claude API y AWS](docs/adr/0006-lc-evaluation-python-claude-aws.md) | **Supersedido** por ADR 0008 y ADR 0009 |
| 0007 | [Modelo lógico de datos, formato de entrada y parseo (pre-conexiones)](docs/adr/0007-modelo-datos-parseo-pre-conexiones.md) | Borrador |
| 0008 | [TypeScript sobre Python para RAG y orquestación](docs/adr/0008-typescript-sobre-python-para-rag.md) | Aceptado |
| 0009 | [Claude Code Pro como orquestador principal](docs/adr/0009-claude-code-pro-como-orquestador.md) | Aceptado |
| 0010 | [RAG local con Chroma y @xenova/transformers](docs/adr/0010-rag-local-chroma-xenova-transformers.md) | Aceptado |

---

## Datos y contratos (fase mock)

| Recurso | Descripción |
| --- | --- |
| [data/checklist-criteria.json](data/checklist-criteria.json) | Catálogo versionado de los **39 criterios** (fuente para mocks, prompts y futura base de datos) |
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

## Próximo paso

**Fase 1.5 operativa** (9 URLs con JSON, resultado y PDF en Vercel). Pendiente: entrega formal TIC (PDF + HTML aprobado). Detalle: [docs/flujo-piloto-10-urls-claude-mvp.md](docs/flujo-piloto-10-urls-claude-mvp.md).

**Siguiente fase:** [docs/ROADMAP.md](docs/ROADMAP.md) **Fase 0** — crear `.claude/CLAUDE.md` y las 3 Skills para que Claude Code Pro tenga contexto completo del proyecto desde la primera sesión.
