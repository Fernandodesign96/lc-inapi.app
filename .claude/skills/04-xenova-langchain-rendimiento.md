# Skill 4 — Xenova, LangChain.js y rendimiento del RAG

## Qué es

Skill para que Claude Code entienda **cómo** `@xenova/transformers` convierte texto en vectores y cómo **LangChain.js** arma *chunks*, de modo que las búsquedas RAG sean rápidas y útiles (sin sustituir la lectura del catálogo en disco).

## Cuándo activar

- Consultas RAG lentas o irrelevantes.  
- Tras re-ingestar A/B.  
- Prompt 1 / Paso C del maestro cuando se explique el stack.

## Cableado

| Pieza | Relación |
| --- | --- |
| `../prompts/01-orquestacion-stack.md` | Orquesta Chroma + ingest |
| `01-documentos-rag-ingest.md` | Qué se indexa |
| `rag/ingest-a.ts` · `rag/ingest-b.ts` | Pipelines |
| ADR 0010 | Decisión embeddings locales |

## Idea en lenguaje claro

1. **LangChain.js** lee el archivo (PDF/MD/JSON) y lo parte en trozos (*chunks*) con solape para no cortar ideas a la mitad.  
2. **Xenova** calcula un vector (lista de números) por chunk — embeddings en CPU, sin API de pago.  
3. **Chroma** guarda vector + texto + metadatos (colección A o B).  
4. En la auditoría, una **query** se vectoriza igual y Chroma devuelve los trozos más parecidos.

## Cómo agilizar el análisis

- Queries **cortas y ancladas**: código `LC-*`, nombre de indicador, o frase del criterio — no “audita todo el sitio”.  
- Preferir **pocas** consultas puntuales por indicador dudoso, no un barrido masivo.  
- Si los resultados suenan a versión vieja del checklist → re-ejecutar `ingest:b`.  
- No pegar chunks enteros al JSON de entrega; usarlos solo para fundamentar el `comentario`.

## Qué no hace esta skill

No puntúa criterios. No reemplaza Playwright. No inventa evidencia visual.
