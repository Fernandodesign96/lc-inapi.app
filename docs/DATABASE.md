# Capa de datos — MVP LC INAPI

| Metadatos | Detalle |
| --- | --- |
| **Versión** | 1.0.0 |
| **Fecha** | 2026-08-21 |
| **Persistencia vigente** | Archivos JSON en el repositorio |
| **Orquestación** | [ADR 0009](adr/0009-claude-code-pro-como-orquestador.md) |
| **Parseo / embeddings** | [ADR 0007](adr/0007-modelo-datos-parseo-pre-conexiones.md) (Xenova + LangChain.js) |
| **Contrato** | Zod — [ADR 0003](adr/0003-contract-first-mocking-with-zod.md) |

---

## 1. Principios (hoy)

- **Fuente de verdad de auditorías:** `data/claude-audits/**/*.json` con `version_checklist: "3.0"` y **51** filas `LC-*`.  
- **Catálogo:** `data/checklist-criteria-lc-ptd.json`.  
- **Jobs:** `data/jobs/*.json` (cola worker).  
- **Sin login, sin Nest, sin Prisma, sin Postgres operativo.**  
- Embeddings del RAG: **@xenova/transformers** → Chroma (vectores en `rag/chroma_db/`, gitignore).

### Propuesta antigua (no implementar)

| Idea histórica | Estado |
| --- | --- |
| Supabase Postgres + Auth + RLS | Obsoleta ([ADR 0002](adr/0002-stack-next-bun-supabase.md)) |
| Tablas `audits` / `audit_criterion_results` vía Nest | Obsoleta ([ADR 0006](adr/0006-lc-evaluation-python-claude-aws.md)) |
| 39 filas A–H en SQL | Reemplazado por 51 `LC-*` en JSON |

El resto de este archivo, si menciona columnas SQL, es **solo archivo histórico** para no perder el diseño de mayo 2026.

---

## 2. Modelo vigente (archivos)

### 2.1 Catálogo de criterios

| Campo lógico | Ejemplo / notas |
| --- | --- |
| `id` | `LC-1.1.1-01` … (51 ids) |
| Indicador IEW/IESD | p. ej. 1.1.3 / 5.1.3 |
| Texto de pregunta | Instrumento PTD |
| Versión catálogo | `3.0` en auditorías nuevas |

### 2.2 Registro de auditoría (JSON canónico)

Validado por `strictAuditRecordSchema` / adaptador piloto:

- Metadatos: `url`, fecha, auditor (texto libre), `version_checklist`  
- `criterios_evaluados`: length **51**  
- Resumen: aprobados, aplicables, N/A, `%`, estado aceptación  
- Bloques entrega: observaciones, sustituciones, nota TIC (según schema)

### 2.3 Job on-demand

Ver [contratos-audit-jobs.md](contratos-audit-jobs.md). Resultado exitoso → mismo JSON de auditoría.

### 2.4 RAG (no es “BD de producto”)

| Pieza | Rol |
| --- | --- |
| Colección A | Normativa (PDFs) |
| Colección B | Repo (criterios, mapas, auditorías previas) |
| Xenova | Texto → vector |
| LangChain.js | Troceo / pipeline ingest |
| Chroma | Almacén vectorial local |

---

## 3. Apéndice — diseño SQL histórico (no operativo)

> Conservado solo como referencia. **No migrar ni implementar** en el MVP.

Tablas orientativas de 2026-05: `checklist_versions`, `audits`, `audit_criterion_results`, `url_index`, con 39 criterios A–H y `evaluator_user_id` → Auth.  
Sustituido por JSON + 51 `LC-*` + nombre libre de auditor.

---

## 4. Privacidad

- No versionar PII real en fixtures ni citas.  
- `documentos/` y `chroma_db/` fuera de git.  
- Detalle: [SECURITY.md](SECURITY.md).
