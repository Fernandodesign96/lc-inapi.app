# ADR 0010 — RAG local con Chroma y @xenova/transformers (dos colecciones aisladas)

## Estado

Aceptado — 2026-07-21

## Contexto

El pipeline de auditoría necesita que Claude Code Pro pueda consultar:
1. Las fuentes normativas que definen los criterios (Calidad Web 2.0, Meta MEI, Lenguaje Claro Chile, UI Kit Gobierno, instrumentos de evaluación).
2. El historial de auditorías previas para detectar patrones recurrentes y mantener consistencia editorial.

Opciones evaluadas para proveer este contexto de forma semántica:

| Opción | Motivo de descarte |
|---|---|
| Pinecone / Qdrant Cloud | Datos institucionales salen a servidores externos — inaceptable |
| Weaviate local | Más complejo de operar; Chroma es suficiente para el volumen actual |
| pgvector en Supabase | Requiere backend Supabase activo; no disponible en Fase 0–3 |
| Embeddings en Python | Descartado por [ADR 0008](0008-typescript-sobre-python-para-rag.md) |
| Solo contexto en `CLAUDE.md` | Insuficiente para el volumen de los PDFs normativos (~600 páginas agregadas) |

## Decisión

### Base vectorial

**Chroma** corre como proceso local independiente del lenguaje cliente:
- Desarrollo: `chroma run --path ./rag/chroma_db --port 8000` en WSL.
- Producción: proceso en el servidor TI de INAPI (Octavio); la carpeta `rag/chroma_db/` se copia desde el equipo de desarrollo — no es necesario reingestar.
- `rag/chroma_db/` está en `.gitignore`; los vectores no se versionan en el repo.

### Modelo de embeddings

`@xenova/transformers` (NPM) con el modelo **`Xenova/paraphrase-multilingual-MiniLM-L12-v2`**:
- ~400 MB, descarga única en la primera ejecución.
- Corre 100 % offline en CPU después de la descarga.
- Sin llamadas a APIs externas durante la generación de embeddings.
- Soporte nativo para español e inglés (multilingüe, 50+ idiomas).

### Dos colecciones completamente aisladas

El aislamiento es **arquitectónico** (scripts de ingesta separados, colecciones Chroma distintas), no solo una regla de configuración.

**Colección A — documentos normativos** (`coleccion_a`):
- Fuente: carpeta `documentos/` (en `.gitignore`; solo existe localmente y en servidor TI).
- Contenido: `calidad-web-2.0.pdf`, `meta-mei.pdf`, `ui-kit-gobierno-3.0.1.pdf`, `instrumento-evaluacion-sitios-web.pdf`, `instrumento-evaluacion-servicios-digitales-transaccionales.pdf`, `lenguaje-claro-recomendaciones.pdf`.
- Script de ingesta: `rag/ingest-a.ts`.
- Propósito: permitir que Claude Code busque fundamentos normativos para justificar evaluaciones de criterios.

**Colección B — material de trabajo del repo** (`coleccion_b`):
- Fuente: archivos versionados en el propio repo.
- Contenido: `data/checklist-criteria.json`, `data/claude-audits/**/*.json`, `data/claude-audits/urls-clarity/*.json`, `prompts/claude-code/*.md` (cuando existan), `prompts/devtools/*.md` (cuando existan), `docs/adr/*.md`.
- Script de ingesta: `rag/ingest-b.ts`.
- Propósito: permitir que Claude Code consulte el checklist v1.1, busque precedentes de auditorías previas y recupere decisiones arquitectónicas.

### Datos que NUNCA entran al RAG

- RUT/RUN de usuarios o solicitantes.
- Solicitudes de marca o expedientes de tramitación.
- Resultados del buscador de anterioridades.
- Credenciales, tokens de sesión o cualquier secreto.
- Datos personales de usuarios de los trámites (si aparecen en HTML capturado, se detectan como incumplimiento del criterio G1 pero no se almacenan en la colección).

### Workspace `rag/`

```
rag/
├── package.json        ← dependencias: chromadb, @xenova/transformers, langchain
├── tsconfig.json
├── ingest-a.ts         ← ingesta colección A (PDFs normativos)
├── ingest-b.ts         ← ingesta colección B (material del repo)
├── query.ts            ← prueba y validación de las colecciones
├── mcp-server.ts       ← servidor MCP que Claude Code consume
└── chroma_db/          ← generado al ingestar; en .gitignore
    ├── coleccion_a/
    └── coleccion_b/
```

### Retrieval

Retrieval semántico denso por defecto de Chroma (sin híbrido BM25+Dense en esta fase). Justificación:
- El retriever denso es suficiente para los documentos normativos.
- La búsqueda exacta de códigos de criterio (D7, A1, etc.) la resuelve Claude Code directamente desde `checklist-criteria.json` en su contexto, sin necesidad de RAG.
- El híbrido se evalúa solo si el retrieval simple no encuentra bien los criterios en pruebas reales.

### Orden de ingesta recomendado

1. `bun run ingest:b` primero — los datos ya existen en el repo, no requiere archivos externos.
2. `bun run ingest:a` segundo — requiere que los PDFs estén en `documentos/` localmente.

## Consecuencias

- **Positivo:** ningún dato interno sale a internet; cumple con las políticas de datos de INAPI.
- **Positivo:** los vectores se generan una sola vez y se copian al servidor TI; no hay que reingestar en producción.
- **Positivo:** la separación arquitectónica entre Colección A y B impide mezclar fuentes normativas con datos de trabajo por error de configuración.
- **Negativo:** el modelo (~400 MB) requiere una descarga inicial con conexión a internet; en redes corporativas con restricciones puede necesitar descarga previa fuera de la red.
- **Negativo:** si los PDFs normativos se actualizan, hay que reingestar la Colección A manualmente (`bun run ingest:a`).
- **Neutral:** Chroma requiere un proceso corriendo en el puerto 8000; en producción hay que asegurar que el proceso esté levantado como servicio en el servidor TI.

## Relación con otros ADR

- **Complementa a:** [ADR 0008](0008-typescript-sobre-python-para-rag.md) (TypeScript para RAG) y [ADR 0009](0009-claude-code-pro-como-orquestador.md) (Claude Code Pro como orquestador).
- **No altera:** [ADR 0004](0004-llm-checklist-evaluation-and-versioning.md) — el contrato JSON canónico y la validación Zod siguen siendo la fuente de verdad de la salida del pipeline.
