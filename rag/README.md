# RAG local — lc-inapi-app

Dos colecciones Chroma aisladas para auditoría LC INAPI.
Referencia arquitectónica: [`docs/adr/0010-rag-local-chroma-xenova-transformers.md`](../docs/adr/0010-rag-local-chroma-xenova-transformers.md)

---

## Colecciones

| Colección | Fuente | Propósito |
|---|---|---|
| `coleccion_a` | `../documentos/*.pdf` (local, no en repo) | Fundamentos normativos (CW 2.0, Meta MEI, RLC, UI Kit) |
| `coleccion_b` | Archivos del repo (`data/`, `docs/adr/`) | Checklist, precedentes de auditorías, ADRs |

---

## Setup inicial

### 1. Instalar dependencias

Ejecutar **desde `rag/`**:

```bash
cd rag/
bun install
```

### 2. Instalar Chroma

```bash
pip install chromadb
# o con pipx:
pipx install chromadb
```

### 3. Levantar Chroma

Ejecutar **desde la raíz del repo** (`lc-inapi-app/`), en una terminal aparte que quede corriendo:

```bash
chroma run --path ./rag/chroma_db --port 8000
```

### 4. Ingestar Colección B (datos del repo — sin prerequisitos externos)

Ejecutar **desde `rag/`**:

```bash
bun run ingest:b
```

### 5. Ingestar Colección A (requiere PDFs en `../documentos/`)

Coloca los PDFs normativos en la carpeta `documentos/` en la raíz del repo (nunca al repo, está en `.gitignore`):

```
documentos/
├── calidad-web-2.0.pdf
├── meta-mei.pdf
├── lenguaje-claro-recomendaciones.pdf
├── ui-kit-gobierno-3.0.1.pdf
├── instrumento-evaluacion-sitios-web.pdf
└── instrumento-evaluacion-servicios-digitales-transaccionales.pdf
```

Ejecutar **desde `rag/`**:

```bash
bun run ingest:a
```

### 6. Registrar el MCP en Claude Code Pro

```bash
claude mcp add rag-auditoria bun /home/fernando/projects/lc-inapi-app/rag/mcp-server.ts
```

> Ajusta la ruta absoluta si el repo está en otra ubicación.

---

## Uso

### Probar queries manualmente (desde `rag/`)

```bash
# Colección B (precedentes) — por defecto
bun run query "criterio D7 encabezados mayúsculas"
bun run query "G1 RUT institucional persona jurídica cumple" coleccion_b 5

# Colección A (normativa)
bun run query "CW 5.2.4 tipografía mayúsculas" coleccion_a 3
bun run query "Meta MEI criterio redacción lenguaje claro tramitación" coleccion_a
```

### Herramientas MCP disponibles para Claude Code Pro

Una vez registrado con `claude mcp add`, Claude puede invocar:

| Herramienta | Colección | Para qué |
|---|---|---|
| `rag_search_normativa` | A | Fundamentos en CW 2.0, Meta MEI, RLC, UI Kit |
| `rag_search_precedentes` | B | Precedentes en auditorías previas y ADRs |

---

## Estructura

```
rag/
├── package.json
├── tsconfig.json
├── pdf-parse.d.ts    ← declaración de tipos local para pdf-parse
├── ingest-a.ts       ← PDFs normativos → coleccion_a
├── ingest-b.ts       ← datos del repo  → coleccion_b
├── query.ts          ← prueba manual de queries
├── mcp-server.ts     ← servidor MCP (stdio JSON-RPC)
├── README.md         ← este archivo
└── chroma_db/        ← generado al ingestar; en .gitignore
```

---

## Seguridad

- `chroma_db/` y `documentos/` están en `.gitignore` — nunca se versionan
- Embeddings 100 % offline (`@xenova/transformers` en CPU)
- Ningún dato sale a internet
- Ver [`docs/SECURITY.md`](../docs/SECURITY.md) para la política completa
