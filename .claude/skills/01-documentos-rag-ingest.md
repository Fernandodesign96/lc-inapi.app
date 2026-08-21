# Skill 1 — Documentos, RAG e ingestas A/B

## Qué es

Skill para **inventariar, leer, analizar, invocar y actualizar** documentos del proyecto: normas, checklist, hitos META MEI, JSON de auditorías y lo indexado en Chroma.

## Cuándo activar

- Antes de puntuar un criterio dudoso.
- Tras cambiar catálogo, mapa, Word o PDFs (re-ingesta).
- Cuando haga falta citar un instrumento o precedente.

## Cableado

| Pieza | Relación |
| --- | --- |
| `../prompts/01-orquestacion-stack.md` | Arranque Chroma / ingest |
| `../prompts/05-audit-maestro-url.md` | Paso C |
| `04-xenova-langchain-rendimiento.md` | Cómo se vectorizan los chunks |
| `data/checklist-criteria-lc-ptd.json` | 51 criterios |
| `data/checklist-editorial-ptd-v2.json` | Hitos / tareas |
| `docs/checklist-ptd-v2-mapa.md` · Word / `.extracted.md` | Instrumentos y mapa |
| Colección A / B | Normativa vs repo |

## Inventario de fuentes (prioridad)

1. **Catálogo máquina** `checklist-criteria-lc-ptd.json` — ids y enunciados del score.  
2. **Checklist editorial PTD** JSON + Word — Hito → Tarea → Pregunta.  
3. **Mapa** `checklist-ptd-v2-mapa.md` — IEW ↔ IESD.  
4. **Colección A** — PDFs en `documentos/` (RLC, IQ Web, MEI…).  
5. **Colección B** — catálogo, mapa, extracted, JSON auditorías, ADRs.  
6. **JSON canónicos** en `data/claude-audits/` — precedentes de la misma URL o patrón.

## Cómo invocar

1. Disco primero (leer el JSON/MD).  
2. Si falta fundamento: `rag_search_normativa` (A) o `rag_search_precedentes` (B) — queries cortas con código `LC-*` o indicador.  
3. Citar `source` del catálogo en el comentario cuando aporte.  
4. Tras editar fuentes B: `cd rag && bun run ingest:b`. Fuentes A (PDFs): `ingest:a`.

## Actualizar documentos

- No reescribir normas PDF en el chat.  
- Hallazgos de calibración → Prompt `06` (no solo el chat).  
- Nunca indexar HTML con PII de sesión.
