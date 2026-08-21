# ADR 0007 — Parseo, embeddings (@xenova/transformers) y forma de los datos

## Estado

**Aceptado en lo vigente — 2026-08-21**  
(El borrador 2026-05 sobre Nest ↔ Lambda ↔ Postgres queda como **propuesta antigua**.)

## 1. Aviso al lector

Este ADR ya **no** describe cómo cablear Nest, AWS, API Gateway, Lambda ni Pydantic.  
Eso fue una propuesta previa: **no se implementará** (ver tabla §5).

Aquí se explica, en lenguaje claro:

1. Cómo el texto se **parte (parseo / chunking)** antes de indexar.  
2. Cómo **@xenova/transformers** convierte ese texto en **embeddings** (vectores).  
3. Cómo **LangChain.js** ordena ese pipeline en TypeScript.  
4. Cómo el **JSON de auditoría** (51 `LC-*`) se parsea/valida con **Zod** (contrato de producto).

El diseño de **colecciones Chroma A/B y MCP** está en [ADR 0010](0010-rag-local-chroma-xenova-transformers.md); aquí no se repite el RAG completo.

---

## 2. Dos “parseos” distintos (no confundir)

| Tipo | Qué es | Herramienta | Resultado |
| --- | --- | --- | --- |
| **A. Parseo / troceo para embeddings** | Cortar PDFs y markdown en fragmentos manejables | Scripts `rag/ingest-a.ts`, `rag/ingest-b.ts` + **LangChain.js** | Textos listos para vectorizar |
| **B. Parseo del JSON de auditoría** | Comprobar que el informe cumple el contrato | **Zod** (`src/schemas/…`, `validate:claude-audits`) | JSON aceptado o rechazado |

Claude Code **lee** HTML de Playwright y **escribe** JSON; Xenova **no** evalúa criterios LC — solo ayuda a buscar contexto semántico en el RAG.

---

## 3. Embeddings con @xenova/transformers (detalle)

### 3.1 ¿Qué es un embedding?

Un embedding es una **lista de números** (vector) que representa el “sentido” de un trozo de texto.  
Dos frases parecidas quedan **cerca** en ese espacio; dos temas distintos quedan lejos.  
Así Chroma puede responder: “¿qué fragmentos se parecen a esta pregunta sobre títulos en mayúsculas?”.

### 3.2 Modelo elegido

| Dato | Valor |
| --- | --- |
| Paquete | `@xenova/transformers` (NPM, corre en **Bun/Node**) |
| Modelo | `Xenova/paraphrase-multilingual-MiniLM-L12-v2` |
| Tamaño aprox. | ~400 MB (descarga **una vez**) |
| Ejecución | **CPU local**, 100 % offline después de descargar |
| Idiomas | Multilingüe (incluye español) |
| APIs externas en runtime | **Ninguna** — no se envían PDFs a la nube para embeber |

### 3.3 Flujo de un fragmento

```text
Texto del PDF o del repo
    → troceo (tamaño/solape definidos en ingest)
    → Xenova: texto → vector
    → Chroma guarda vector + texto + metadatos (colección A o B)
```

En consulta (vía MCP RAG):

```text
Pregunta del subagente / skill
    → Xenova: pregunta → vector
    → Chroma: busca vecinos cercanos
    → Devuelve fragmentos (no el PDF entero)
```

### 3.4 Por qué importa para INAPI

- Los PDFs normativos **no** viajan a Anthropic ni a un servicio de embeddings cloud.  
- El mismo runtime TypeScript del monorepo (ADR 0008) evita un microservicio Python solo para vectores.  
- Claude Code recibe **citas cortas** útiles para fundamentar `comentario` / notas, no 600 páginas crudas.

---

## 4. LangChain.js en el parseo de ingesta

**LangChain.js** no orquesta la auditoría LC (eso es Claude Code).  
En este repo se usa como **utilidad del pipeline de ingesta**:

| Paso | Rol típico de LangChain.js |
| --- | --- |
| Cargar / normalizar texto | Unificar entradas desde PDF extraído o markdown del repo |
| Splitters | Dividir en chunks con tamaño y overlap coherentes |
| Encadenar | Pasar cada chunk a la función de embedding (Xenova) y al writer de Chroma |

Scripts:

- `rag/ingest-a.ts` — Colección A (PDFs en `documentos/`, gitignore).  
- `rag/ingest-b.ts` — Colección B (catálogo LC v3.0, mapa PTD, Word extraído, JSON de auditorías, ADRs, etc.).

Detalle de colecciones y aislamiento: [ADR 0010](0010-rag-local-chroma-xenova-transformers.md).

---

## 5. Propuestas antiguas — qué eran y por qué no se implementan

| Propuesta antigua | Qué se proponía | Por qué ya no se implementará |
| --- | --- | --- |
| **Python + HuggingFace** | Embeddings / motor en Python | Stack unificado TS/Bun; Xenova cubre embeddings offline ([ADR 0008](0008-typescript-sobre-python-para-rag.md)) |
| **Pydantic** | Validar JSON en Lambda Python | Zod ya valida en el monorepo ([ADR 0003](0003-contract-first-mocking-with-zod.md)) |
| **Nest + Prisma** | API de dominio y escritura SQL | MVP sin login; JSON en GitHub; Claude Code escribe el resultado |
| **AWS API Gateway + Lambda** | Hosting del motor LC | Costo/TI; Claude Code local ([ADR 0006](0006-lc-evaluation-python-claude-aws.md), [0011](0011-worker-local-on-demand-vercel.md)) |
| **Claude API** | Llamadas HTTP de pago por evaluación | Suscripción Claude Code institucional |
| **Postgres / tablas `audits` × 39** | Modelo ER de mayo 2026 | Persistencia = archivos canónicos; catálogo ahora **51** `LC-*` |
| **OpenAPI Nest ↔ Lambda** | Contrato entre servicios | Un solo proceso orquestador + Zod |

---

## 6. Forma lógica de los datos de auditoría (MVP)

Sin tablas SQL productivas. La “fila” de negocio es un **archivo JSON**:

| Concepto | Dónde vive | Notas 2026-08 |
| --- | --- | --- |
| Catálogo 51 criterios | `data/checklist-criteria-lc-ptd.json` | IDs `LC-*`, v3.0 |
| Auditoría por URL | `data/claude-audits/{sitioweb\|tramites}/{fecha}/*.json` | Validado Zod |
| Jobs on-demand | `data/jobs/*.json` | Cola worker ([contratos-audit-jobs.md](../contratos-audit-jobs.md)) |
| Fixtures mock | `data/audit-fixtures/` | UI sin auditoría real |

Campos clave del informe (parseo Zod): `version_checklist: "3.0"`, 51 evaluaciones, `%`, estado de aceptación, sustituciones, observaciones CMS.

IDs históricos A1–H1 / 39 / 47 = **solo legado**; no usar en auditorías nuevas.

---

## 7. Flujo vigente (parseo + embeddings + auditoría)

```text
1. ingest:a / ingest:b  →  LangChain trocea  →  Xenova embebe  →  Chroma
2. Claude Code + Playwright  →  HTML de la URL
3. Claude Code + RAG MCP     →  fragmentos A/B (ya vectorizados)
4. §17 sub-subagentes        →  51 filas LC-*
5. Zod validate              →  JSON en data/claude-audits/
6. Next / PDF / Excel        →  entrega
```

---

## 8. Relación con otros documentos

| Documento | Rol |
| --- | --- |
| [ADR 0010](0010-rag-local-chroma-xenova-transformers.md) | RAG, colecciones, MCP, qué entra/no entra |
| [ADR 0003](0003-contract-first-mocking-with-zod.md) | Contrato Zod del JSON |
| [ADR 0004](0004-llm-checklist-evaluation-and-versioning.md) | LLM orquestador + Playwright |
| [ADR 0006](0006-lc-evaluation-python-claude-aws.md) | Propuesta AWS/Nest **archivada** |
| [DATABASE.md](../DATABASE.md) | Nota: Postgres = histórico / no operativo |

## Consecuencias

- **Positivo:** parseo y embeddings explicables, locales y alineados al monorepo.  
- **Negativo:** quien lea versiones viejas de este ADR verá ER Nest; usar siempre la cabecera 2026-08-21.  
- **Siguiente paso documental:** no reabrir Prisma/migraciones; mantener catálogo LC v3.0 y scripts de ingesta.
