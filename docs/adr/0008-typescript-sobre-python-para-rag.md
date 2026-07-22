# ADR 0008 — TypeScript sobre Python para RAG y orquestación

## Estado

Aceptado — 2026-07-21

## Contexto

El [ADR 0006](0006-lc-evaluation-python-claude-aws.md) establecía Python como lenguaje del motor de prompts y análisis LC, con HuggingFace como proveedor de embeddings. Esa decisión asumía un equipo mixto (TypeScript para frontend/API, Python para IA) y una topología AWS con Lambda.

Al replantear el stack en julio 2026, se evaluaron dos caminos:

- **Camino A:** mantener Python para el RAG y la orquestación de IA (LangChain Python, HuggingFace Python, servicio separado).
- **Camino B:** implementar todo en TypeScript con Bun, usando equivalentes NPM maduros para embeddings y orquestación RAG.

El monorepo ya corre íntegramente en TypeScript + Bun: frontend Next.js, esquemas Zod compartidos, scripts de validación. Agregar Python introduciría una segunda toolchain, un entorno virtual que gestionar, dependencias de sistema (librerías C para algunos modelos) y una frontera de tipos entre los dos lenguajes.

Adicionalmente, el proyecto paralelo de Camila (buscador de anterioridades de marcas) ya usa Python + HuggingFace. Mezclar ambos stacks en este repositorio generaría fricción operativa sin beneficio claro.

## Decisión

1. **Todo el RAG y la orquestación se implementan en TypeScript con Bun**, coherente con el monorepo existente. Sin mezclar lenguajes en este repositorio.

2. **Embeddings:** `@xenova/transformers` (NPM) con el modelo `Xenova/paraphrase-multilingual-MiniLM-L12-v2` (~400 MB, descarga única, corre 100 % offline en CPU). Equivale funcionalmente a `sentence-transformers` de Python para textos multilingües.

3. **Pipeline RAG:** `LangChain.js` (NPM) para orquestar las operaciones de ingesta, chunking y retrieval sobre Chroma. Mismo patrón conceptual que LangChain Python, misma API de abstracciones.

4. **Base vectorial:** Chroma corre como proceso local independiente del lenguaje del cliente; el cliente TypeScript se conecta vía HTTP o mediante el SDK oficial `chromadb` (NPM).

5. **Python queda excluido de este repositorio en todas las fases actuales.** Su uso se re-evalúa únicamente si surge un requerimiento específico que no tenga equivalente maduro en el ecosistema NPM/TypeScript.

## Consecuencias

- **Positivo:** toolchain única (Bun); tipos compartidos entre RAG, scripts y frontend sin traducción; sin entorno virtual Python ni dependencias de sistema; CI más simple.
- **Positivo:** `@xenova/transformers` corre en Node.js sin servidor adicional; los embeddings son offline tras la primera descarga del modelo.
- **Negativo:** el ecosistema NPM para IA es menos maduro que Python en algunas áreas; modelos disponibles en Xenova son un subconjunto de HuggingFace Hub.
- **Neutral:** LangChain.js tiene feature parity suficiente para retrieval semántico simple; la búsqueda híbrida BM25+Dense se evalúa en el futuro si el retrieval denso no encuentra bien los criterios.

## Relación con otros ADR

- **Supersede a:** [ADR 0006](0006-lc-evaluation-python-claude-aws.md) en su decisión de usar Python para el motor de análisis.
- **Complementa a:** [ADR 0009](0009-claude-code-pro-como-orquestador.md) (Claude Code Pro como orquestador) y [ADR 0010](0010-rag-local-chroma-xenova-transformers.md) (especificación del RAG local).
- **No altera:** [ADR 0004](0004-llm-checklist-evaluation-and-versioning.md) — el contrato JSON, la validación Zod y el versionado de `checklist_version` siguen siendo la fuente de verdad independientemente del lenguaje de implementación.
