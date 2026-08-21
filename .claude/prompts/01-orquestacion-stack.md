# Prompt 1 — Orquestación del stack (Playwright · RAG · Xenova · LangChain)

## Qué es

Guía de **cómo Claude Code debe orquestar la infraestructura** de auditoría: herramientas MCP, bases vectoriales, embeddings y pipelines de ingesta. No evalúa criterios; prepara el entorno para que el Prompt 5 (maestro) pueda hacerlo bien.

## Objetivo

Que cada sesión arranque con Playwright, Chroma, Xenova y LangChain.js listos, y con colecciones A/B coherentes con el repo.

## Cableado

| Pieza | Relación |
| --- | --- |
| `../CLAUDE.md` | Constitución; §8 MCP, §11 captura, ADR 0010 |
| `02-criterios-hitos-correcciones.md` | Usa la captura Playwright que este prompt prepara |
| `05-audit-maestro-url.md` | Invoca este prompt en el Paso A (prerrequisitos) |
| `../skills/01-documentos-rag-ingest.md` | Cómo leer/actualizar lo indexado |
| `../skills/04-xenova-langchain-rendimiento.md` | Cómo se vectorizan y trocean documentos |
| `rag/README.md` · `rag/ingest-a.ts` · `rag/ingest-b.ts` | Comandos de ingesta |
| `docs/adr/0010-rag-local-chroma-xenova-transformers.md` | Decisión RAG local |
| `../diagrams/workflow_diagram.md` | Vista del grafo |

---

## Stack a orquestar (lenguaje claro)

| Pieza | Qué es | Para qué |
| --- | --- | --- |
| **Claude Code** | Orquestador en el PC/WSL | Lanza captura, RAG, subagentes y escribe JSON |
| **Playwright MCP** | Navegador controlado | Abre la URL, obtiene HTML visible y datos de accesibilidad |
| **Chroma** | Base de vectores local (puerto 8000) | Guarda fragmentos buscables de normas y del repo |
| **LangChain.js** | Tubería de lectura/troceo | Parte PDFs y Markdown en *chunks* antes de indexar |
| **@xenova/transformers** | Modelo de embeddings en CPU | Convierte cada chunk en vector numérico |
| **Ingesta A** | `bun run ingest:a` en `rag/` | Indexa PDFs normativos de `documentos/` (Colección A) |
| **Ingesta B** | `bun run ingest:b` en `rag/` | Indexa catálogo LC, checklist PTD, mapa, Word extraído, JSON, ADRs (Colección B) |
| **MCP `rag-auditoria`** | Puente Claude ↔ Chroma | Herramientas `rag_search_normativa` / `rag_search_precedentes` |

---

## Checklist de arranque (obligatorio antes del maestro)

```bash
claude mcp list
# Debe listar: playwright · rag-auditoria

chroma run --path ./rag/chroma_db --port 8000   # terminal aparte

# Si cambiaron PDFs en documentos/:
cd rag && bun run ingest:a && cd ..

# Si cambiaron catálogo, mapa, Word extraído, auditorías o ADRs:
cd rag && bun run ingest:b && cd ..

bun run validate:claude-audits   # baseline del repo
```

## Reglas de orquestación

1. **Una captura Playwright por URL** — no reiniciar el navegador por cada indicador.
2. **RAG puntual** — consultas cortas a A (norma) o B (precedentes); no volcar PDFs enteros al chat.
3. **Re-ingestar** cuando el contenido fuente cambió; sin eso Claude busca fragmentos viejos.
4. **Sin PII en Colección B** — no indexar HTML de sesión autenticada con datos de personas.
5. El detalle de chunks/embeddings está en la skill `04-xenova-langchain-rendimiento.md`.

## Salida esperada de este prompt

Entorno listo + confirmación breve: MCP activos, Chroma en 8000, última ingesta B (y A si aplica) coherente. Luego continuar con Prompt 5.
