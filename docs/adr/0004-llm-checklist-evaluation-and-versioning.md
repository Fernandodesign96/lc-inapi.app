# ADR 0004 — Evaluación con LLM, captura Playwright y versionado

## Estado

**Aceptado — 2026-05-13 · Actualizado — 2026-08-21**

## Resumen en lenguaje claro

| Pregunta | Respuesta hoy |
| --- | --- |
| **¿Qué es el LLM en este proyecto?** | **Claude Code** (suscripción institucional): no solo “responde un prompt”, sino que **orquesta** captura, RAG, skills, sub-subagentes y escritura del JSON. |
| **¿Cómo se captura la página?** | **Playwright MCP** — abre el navegador real y entrega el HTML/DOM que ve la ciudadanía. |
| **¿Cheerio?** | Propuesta antigua de scrapeo liviano. **No se usa** como camino principal. |
| **¿API Anthropic de pago?** | **No operativa** en el MVP ([ADR 0011](0011-worker-local-on-demand-vercel.md)). |
| **¿Cuántos criterios?** | **51** códigos `LC-*`, checklist **v3.0**. |

## Contexto

Auditar lenguaje claro exige juicio lingüístico. Un LLM acelera, pero puede alucinar o variar. Por eso:

1. El instrumento (51 preguntas PTD) es la verdad editorial.  
2. Playwright aporta **evidencia** de la página.  
3. El RAG (Chroma + Xenova) aporta **fundamento** normativo/precedentes.  
4. Zod valida la **salida**.  
5. Un humano / Equipo UX revisa la entrega CMS (§22).

## Decisión 1 — El LLM orquesta todo el pipeline

**Claude Code** (Pro/Team institucional) es el orquestador ([ADR 0009](0009-claude-code-pro-como-orquestador.md)):

| Pieza | Función |
| --- | --- |
| `.claude/CLAUDE.md` | Constitución: reglas §5, §17, §20–§23, nomenclatura LC |
| Prompts | `01`…`06` (maestro = `05-audit-maestro-url.md`) |
| Skills | `01`…`05` (documentos/RAG, CMS, subagentes, Xenova, calibración) |
| §17 | **15** subagentes (1 indicador) + **5** sub-subagentes de entrega |
| MCP Playwright | Captura |
| MCP RAG | Consultas a Colecciones A/B |
| Hooks / `validate:claude-audits` | Cierre con Zod |

No hay un servicio Python intermedio ni Nest que “llame al LLM”: **Claude Code es el proceso**.

## Decisión 2 — Captura con Playwright MCP (no Cheerio)

| Opción | Qué era | Estado |
| --- | --- | --- |
| **Cheerio** | Parsear HTML estático sin navegador | **Descartado** como captura principal (no ejecuta JS ni menús dinámicos) |
| **Playwright MCP** | Navegador automatizado vía MCP | **Decisión final** — evidencia = DOM real |
| Pegado manual | Fallback UX | Solo si la página bloquea o falta sesión |

**Por qué Playwright:** en `inapi.cl` / `tramites.inapi.cl` el contenido crítico aparece tras JS, menús y a veces login (ClaveÚnica + `storageState`). Cheerio vería plantillas incompletas.

Detalle sesión autenticada: [`fase-3-3-captura-auth-claveunica.md`](../fase-3-3-captura-auth-claveunica.md).

## Decisión 3 — Versionado de checklist y de “prompt”

1. Cada JSON persiste `version_checklist` (hoy **`"3.0"`**).  
2. Se documenta la versión de orquestación / prompts en metadatos o DEVLOG cuando cambia el contrato (§5 / skills).  
3. La salida se valida con Zod ([ADR 0003](0003-contract-first-mocking-with-zod.md)): si falla → corregir y revalidar (no mergear JSON roto).  
4. Exportación oficial (PDF/Excel) asume JSON ya validado; la **validación humana** sigue siendo requisito de producto para publicación en CMS.

## Decisión 4 — Formato de salida

- **51** filas `LC-*` (no A1–H1).  
- Estados: `cumple` | `incumple` | `no_aplica`.  
- Entrega CMS-first (§22): comentarios entendibles para editor, no “solo `alt=`”).  
- Alcance §23: Usabilidad/Seguridad catalogadas; **no** entran al % LC 2026 salvo solapes explícitos.

## Consecuencias

- **Positivo:** un solo orquestador; captura real; contrato versionado; sin costo de API Claude por URL en el MVP.  
- **Negativo:** depende del PC/WSL y de la cuenta institucional; auditorías largas (10–40 min).  
- **Pendiente histórico “Cheerio vs Playwright”:** **cerrado** a favor de Playwright MCP.

## Alternativas (no adoptadas)

| Alternativa | Motivo de no uso |
| --- | --- |
| Solo reglas determinísticas | Insuficientes para matices de lenguaje claro |
| Fine-tuning propio | Fuera de alcance |
| Claude API + Lambda | Propuesta antigua ([ADR 0006](0006-lc-evaluation-python-claude-aws.md)) — no se implementará |
| Cheerio como captura principal | Pierde DOM dinámico |

## Relación

- [ADR 0003](0003-contract-first-mocking-with-zod.md) · [ADR 0009](0009-claude-code-pro-como-orquestador.md) · [ADR 0010](0010-rag-local-chroma-xenova-transformers.md) · [ADR 0011](0011-worker-local-on-demand-vercel.md)
