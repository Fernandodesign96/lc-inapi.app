# ADR 0006 — Evaluación LC: Python, Claude API y AWS (propuesta antigua)

## Estado

**Supersedido — 2026-07-21 · Aclarado como archivo histórico — 2026-08-21**

> Este documento **no** es el plan del MVP.  
> Describe una propuesta de mayo 2026 (Python + Nest + AWS + Claude API) que **no se implementará**.  
> El camino vigente es Claude Code + Playwright + Chroma + Xenova + LangChain.js ([ADR 0009](0009-claude-code-pro-como-orquestador.md), [ADR 0008](0008-typescript-sobre-python-para-rag.md), [ADR 0010](0010-rag-local-chroma-xenova-transformers.md)).

## 1. Distinción rápida: qué se propuso vs qué quedó

| Tema | Propuesta antigua (este ADR) | MVP vigente (2026-08-21) | ¿Se implementará a futuro según este plan? |
| --- | --- | --- | --- |
| Proveedor LLM | **Claude API** (pago, API key) | **Claude Code** (suscripción institucional) | **No** la API operativa |
| Runtime del motor | **Python** + prompts | **TypeScript / Bun** + Claude Code | **No** Python como motor LC |
| Validación en servicio | **Pydantic** (Python) | **Zod** en el monorepo | **No** Pydantic |
| API de dominio | **NestJS** + Prisma | Next route handlers + JSON en repo | **No** Nest |
| Persistencia | **Supabase / Postgres** | Archivos `data/claude-audits/`, `data/jobs/` | **No** Postgres en MVP |
| Hosting evaluación | **AWS** API Gateway + **Lambda** (o ECS/EC2) | PC/WSL local (+ worker 8–18) | **No** AWS LC |
| Captura | (ajena a este ADR; Cheerio pendiente) | **Playwright MCP** | Playwright sí |
| Criterios | 39 A–H | **51 `LC-*` v3.0** | Catálogo PTD actual |
| Login | Implícito vía Nest/Auth | **Acceso libre** INAPI | **No** login MVP |
| Embeddings / RAG | HuggingFace Python / nube | **@xenova/transformers** + Chroma + LangChain.js | Xenova/Chroma sí |

## 2. Por qué el backend Nest / AWS / Claude API queda supersedido

| Pieza | Por qué se descartó para este proyecto |
| --- | --- |
| **NestJS** | Añadía un tercer servicio (Next + Nest + Lambda) antes de poder auditar. Claude Code ya orquesta captura, RAG y JSON. El MVP **no** necesita API de dominio ni login. |
| **AWS Lambda + API Gateway** | Costo, secretos, timeouts y operación TI. TI no habilitó API Claude dedicada; se opera con asiento Claude Code institucional ([ADR 0011](0011-worker-local-on-demand-vercel.md)). |
| **Claude API de pago** | Cada auditoría larga multiplicaría costo; la suscripción Code ya cubre el trabajo. La API solo se cotizó como evidencia histórica (documento de cotización **retirado**). |
| **Python + Pydantic** | Duplicaba contratos frente a Zod/TS del monorepo ([ADR 0008](0008-typescript-sobre-python-para-rag.md)). |
| **Prisma + Supabase Auth** | El MVP debe ser usable **sin inicio de sesión**; la trazabilidad va en GitHub. |

## 3. Registro histórico (qué decía la decisión original)

Se conserva solo para auditoría de decisiones. **No usar como guía de implementación.**

1. Proveedor: Claude API.  
2. Motor: Python.  
3. Nest como única escritura a Postgres.  
4. Exponer Python detrás de API Gateway → Lambda.  
5. Frontend sin claves; hablaría con Nest.

Preguntas abiertas de entonces (Lambda vs ECS, Pydantic vs Nest, auth Nest→Gateway) **ya no aplican**: el diseño completo fue reemplazado.

## 4. Camino MVP (referencia)

```text
Usuario / auditor → (opcional) UI Vercel
                 → Claude Code en PC
                 → Playwright MCP + RAG (Chroma/Xenova/LangChain)
                 → JSON 51 LC-* → Zod → PDF/Excel
```

Detalle: [ARCHITECTURE.md](../ARCHITECTURE.md) · [despliegue-hibrido.md](../despliegue/despliegue-hibrido.md).

## Relación

- Supersedido por: [0008](0008-typescript-sobre-python-para-rag.md), [0009](0009-claude-code-pro-como-orquestador.md), [0010](0010-rag-local-chroma-xenova-transformers.md), [0011](0011-worker-local-on-demand-vercel.md).  
- Contrato JSON: [0003](0003-contract-first-mocking-with-zod.md), [0004](0004-llm-checklist-evaluation-and-versioning.md).
