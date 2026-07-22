# ADR 0009 — Claude Code Pro como orquestador principal (sin API de pago)

## Estado

Aceptado — 2026-07-21

## Contexto

El [ADR 0005](0005-api-backend-nestjs-prisma.md) establecía NestJS como la capa de orquestación: recibía solicitudes del frontend, invocaba el servicio Python en AWS, validaba la respuesta y persistía en Supabase. Esa arquitectura requería mantener y desplegar tres servicios (Next, Nest, Lambda Python) antes de poder realizar una sola auditoría completa.

En paralelo, el equipo ya usa **Claude** como asistente de auditoría en el piloto Fase 1.5 (9 JSONs canónicos en `data/claude-audits/`). El flujo manual demostró que Claude tiene capacidad suficiente para analizar HTML, aplicar el checklist de 39 criterios y producir el JSON canónico directamente, sin necesidad de un servicio de backend adicional.

**Claude Code Pro** (suscripción existente del equipo) introduce dos capacidades clave sobre la interfaz web de Claude:
- Ejecución en terminal con acceso al filesystem y al repo.
- Protocolo MCP (Model Context Protocol) para conectar herramientas externas como servidores Playwright o RAG como llamadas nativas de herramienta.

Esto permite reemplazar toda la capa Nest + Lambda + API Gateway por un único proceso local que orquesta directamente.

## Decisión

1. **Claude Code Pro** (terminal WSL, suscripción existente) es el **orquestador principal** del pipeline de auditoría. Cero costo adicional en esta fase.

2. **`CLAUDE.md`** en la raíz del directorio de trabajo actúa como contexto permanente del proyecto en cada sesión: describe el dominio, el checklist v1.1, los contratos JSON canónicos y las convenciones del repo.

3. **Skills** — conocimiento especializado cargado bajo demanda, almacenadas en `.claude/skills/`:
   - `auditoria-lc.md` — criterios de lenguaje claro, checklist v1.1, patrones de incumplimiento frecuentes.
   - `auditoria-calidad-web.md` — Calidad Web 2.0, Meta MEI, instrumentos de evaluación.
   - `pesquisa-criterios.md` — cómo consultar el RAG MCP para buscar precedentes y fuentes normativas.

4. **Subagents** — un subagente por URL para auditorías en paralelo; sincronización mediante el sistema de archivos del repo.

5. **Hooks** — validación automática de los JSONs generados al guardarse, usando `validate-claude-audits.ts`.

6. **MCP servers** como herramientas nativas de Claude Code:
   - **Playwright MCP** (`npx @playwright/mcp@latest`): navega URLs, extrae HTML completo. Registrado con `claude mcp add playwright`.
   - **RAG MCP** (`bun /ruta/rag/mcp-server.ts`): expone las colecciones Chroma A y B como herramientas de búsqueda semántica. Registrado con `claude mcp add rag-auditoria`.

7. **NestJS queda fuera del camino crítico en todas las fases actuales.** El concepto de un backend de dominio en Railway (tier gratuito) sigue siendo válido para una fase futura si el producto necesita persistencia multiusuario, autenticación institucional o un API pública. Esa decisión se documenta en un ADR separado cuando se inicie.

8. **La Anthropic API de pago no se usa en esta fase.** Se evalúa únicamente si el chatbot del sitio web de INAPI la requiere (decisión de producto futura, no de arquitectura actual).

## Consecuencias

- **Positivo:** pipeline completo operable desde el día 1 sin infraestructura adicional; el equipo de auditoría puede usar Claude Code Pro desde sus máquinas sin depender de servicios desplegados.
- **Positivo:** el contexto acumulado en `CLAUDE.md` y las Skills funciona como "memoria de proyecto" persistente entre sesiones, sin base de datos.
- **Positivo:** los Hooks garantizan que ningún JSON malformado entre al repo; la validación es automática y transparente al auditor.
- **Negativo:** Claude Code Pro requiere WSL; en equipos Windows sin WSL disponible (p. ej. PC de oficina) solo se puede trabajar en documentación y frontend. La implementación de las Fases 1–4 del procedimiento queda para el entorno con WSL.
- **Negativo:** el historial de auditorías y la autenticación multiusuario están fuera de alcance hasta que exista un backend persistente (fase futura).
- **Neutral:** el contrato JSON canónico ([ADR 0004](0004-llm-checklist-evaluation-and-versioning.md)) y la validación Zod siguen siendo la fuente de verdad; Claude Code los respeta mediante los Hooks y el contexto del `CLAUDE.md`.

## Relación con otros ADR

- **Supersede a (capa orquestación):** [ADR 0005](0005-api-backend-nestjs-prisma.md) — NestJS como orquestador. El concepto de backend persistente en Railway queda abierto para una fase futura.
- **Supersede a (junto con ADR 0008):** [ADR 0006](0006-lc-evaluation-python-claude-aws.md) — servicio Python + AWS + Claude API.
- **Complementa a:** [ADR 0008](0008-typescript-sobre-python-para-rag.md) (TypeScript para RAG) y [ADR 0010](0010-rag-local-chroma-xenova-transformers.md) (especificación del RAG local).
- **Sigue vigente:** [ADR 0004](0004-llm-checklist-evaluation-and-versioning.md) — contrato JSON, validación Zod, `checklist_version` y `prompt_version`.
