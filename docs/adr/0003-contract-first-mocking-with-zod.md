# ADR 0003 — Contract-first: Zod como contrato de datos (mocks → Claude Code)

## Estado

**Aceptado — 2026-05-13 · Actualizado — 2026-08-21**

## En lenguaje claro: ¿qué problema resuelve Zod aquí?

Zod es una librería TypeScript que **define la forma exacta** que debe tener un JSON (campos, tipos, enums) y **lo valida en tiempo de ejecución**.  
Si Claude Code (o un script) escribe un JSON mal armado, Zod lo rechaza **antes** de que llegue a la UI, al PDF o al Excel MEI.

Sin ese contrato, cada auditoría podría inventar ids distintos (`A1` vs `LC-1.1.1-01`), omitir filas o romper el front.

## Contexto

La Fase 1 usó mocks sin backend. Hoy el mismo principio aplica al pipeline real:

1. Claude Code genera el JSON canónico tras Playwright + RAG + §17.  
2. Scripts / Hooks validan con Zod.  
3. Next lee el JSON y muestra resultado / PDF / Excel.

El backend Nest + Supabase previsto en 2026-05 **no se implementó** (propuesta antigua). El contrato Zod **sí** se mantiene y creció con el checklist PTD.

## Decisión (vigente 2026-08-21)

### 1. Catálogos de criterios (fuente de verdad)

| Archivo | Rol | Uso actual |
| --- | --- | --- |
| `data/checklist-criteria-lc-ptd.json` | **51 criterios** `LC-*` · `version_checklist: "3.0"` | Auditorías nuevas META MEI |
| `data/checklist-editorial-ptd-v2.json` | Hitos → tareas → preguntas (estructura PTD) | Contexto Claude / RAG B |
| `data/checklist-criteria.json` | Histórico 47 A–H v2.1 | **Solo lectura histórica** — no auditar con esto |

### 2. Esquemas Zod en el monorepo

| Módulo | Qué valida | Para qué |
| --- | --- | --- |
| `src/schemas/checklist.ts` | IDs `LC-*`, `criterionEvaluationSchema`, `strictAuditRecordSchema`, resumen % | Forma canónica de una auditoría LC |
| `src/schemas/claude-audit-pilot.ts` | JSON piloto / Clarity (`parseClaudeAuditFile`) | Adaptar archivos en `data/claude-audits/` a la UI |
| Validación CI | `bun run validate:claude-audits` (+ `typecheck:all`) | Nadie mergea JSON inválido |

Campos típicos por criterio (lenguaje claro):

| Campo | Significado |
| --- | --- |
| `id` | Código `LC-{indicador}-{nn}` (ej. `LC-1.1.3-03`) |
| `estado` | `cumple` · `incumple` · `no_aplica` |
| `cita_textual` | Fragmento visible en la página (evidencia) |
| `severidad` | `baja` · `media` · `alta` (si incumple) |
| `comentario` | Explicación en lenguaje CMS (sin jerga HTML como mensaje principal) |

El agregado (`strictAuditRecordSchema`) exige, entre otros: URL, fecha, versión de checklist **3.0**, **51** evaluaciones, contadores coherentes, `%` y estado de aceptación, más bloques de entrega (sustituciones, observaciones, nota TIC según contrato).

### 3. Cómo encaja con la orquestación Claude Code

```text
Playwright MCP (HTML)
        ↓
Claude Code + CLAUDE.md + prompts 01–06 + skills 01–05 + §17 (15 subagentes + 5 sub-subagentes)
        ↓
JSON canónico en data/claude-audits/.../*.json
        ↓
Zod (validate:claude-audits / Hooks)
        ↓
Next (Vercel): /auditar/resultado · PDF · Excel MEI
```

- **LangChain.js + Xenova + Chroma** alimentan el RAG (contexto), **no** sustituyen el contrato Zod.  
- El RAG puede citar norma; el **JSON de salida** debe pasar Zod igual.

### 4. Mocks y fixtures

Siguen existiendo `data/audit-fixtures/*.json` y helpers de demo para UI sin auditoría real. Deben respetar el mismo shape (o el adaptador piloto) para no enseñar otra forma al Equipo UX.

### 5. Jobs on-demand

Los jobs en `data/jobs/*.json` tienen su propio contrato HTTP ([`contratos-audit-jobs.md`](../contratos-audit-jobs.md)); el **resultado** de un job exitoso sigue siendo un JSON de auditoría validable con Zod (`version_checklist: "3.0"`, 51 `LC-*`).

## Consecuencias

- **Positivo:** UI, PDF, Excel y Claude Code hablan el mismo idioma; CI frena regresiones.  
- **Negativo:** al cambiar el checklist (v2.1 → v3.0) hay que actualizar Zod, catálogo, prompts y skills juntos.  
- **No implica:** base Postgres ni OpenAPI Nest — propuestas antiguas fuera del MVP.

## Alternativas consideradas

| Alternativa | Por qué no |
| --- | --- |
| Solo interfaces TypeScript | No validan el JSON en disco en runtime |
| OpenAPI + Nest primero | Backend Nest **retirado**; Zod en el monorepo basta |
| Confiar solo en Claude | El modelo puede omitir filas; Zod es la red de seguridad |

## Relación

- [ADR 0004](0004-llm-checklist-evaluation-and-versioning.md) — versión de checklist/prompt y LLM  
- [ADR 0009](0009-claude-code-pro-como-orquestador.md) — orquestador  
- [ADR 0010](0010-rag-local-chroma-xenova-transformers.md) — RAG (contexto, no contrato)
