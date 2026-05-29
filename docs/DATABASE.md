# Capa de datos (Supabase / PostgreSQL)
## MVP — Aplicativo de Auditoría de Lenguaje Claro INAPI

| Metadatos | Detalle |
| --- | --- |
| **Versión** | 0.4.4 |
| **Motor** | PostgreSQL (hosted por Supabase) |
| **ORM (servicio API)** | **Prisma** (ver [ADR 0005](adr/0005-api-backend-nestjs-prisma.md)) |
| **Evaluación LLM** | **Claude API** vía servicio **Python** en **AWS** (API Gateway + Lambda por defecto; ver [ADR 0006](adr/0006-lc-evaluation-python-claude-aws.md) y [propuesta técnica integral](../PROPUESTA_TECNICA_INTEGRAL.md)) |

---

## 1. Principios

- **Escritura en Postgres:** por defecto **solo NestJS + Prisma** persisten auditorías y resultados detallados. El servicio Python devuelve JSON validado al backend; **no** asume escritura directa en Supabase salvo decisión explícita futura (ver §5 de la propuesta técnica integral).
- **Versionado explícito** del checklist y del prompt (`checklist_version`, `prompt_version`).
- **39 filas lógicas** por auditoría en evaluación detallada (o JSON validado con Zod en una columna `jsonb` + constraints).
- **RLS** obligatorio antes de exponer a usuarios no-service.
- **Fase 1 (mock):** no hay tablas productivas obligatorias; el inventario de URLs prioritarias y los **fixtures** de auditoría pueden vivir solo en **repositorio** (`data/`, `docs/ux/`) hasta Fase 2.
- **Modelo lógico y parseo (pre-conexiones):** matriz campo ↔ tipo ↔ origen (captura / LLM / sistema), flujo de validación Zod y checklist de decisiones pendientes para alinear con responsable de datos / **Equipo UX** — ver [ADR 0007](adr/0007-modelo-datos-parseo-pre-conexiones.md). Tras la reunión de cierre, propagar aquí los cambios acordados a tablas y tipos.

---

## 2. Entidades principales

### `checklist_versions`

| Columna | Tipo | Descripción |
| --- | --- | --- |
| `id` | `uuid` PK | |
| `version` | `text` UNIQUE | p. ej. `1.1` |
| `title` | `text` | Nombre legible |
| `criteria_json` | `jsonb` | Espejo validado del catálogo (opcional si los criterios viven solo en repo hasta GA) |
| `created_at` | `timestamptz` | |

### `audits`

| Columna | Tipo | Descripción |
| --- | --- | --- |
| `id` | `uuid` PK | |
| `url` | `text` | URL normalizada |
| `domain` | `text` | `inapi.cl` \| `tramites.inapi.cl` (check constraint) |
| `evaluated_at` | `timestamptz` | |
| `evaluator_user_id` | `uuid` FK → `auth.users` | |
| `checklist_version` | `text` | Debe existir en `checklist_versions` o catálogo embebido |
| `prompt_version` | `text` | Alineado a versión de prompts del servicio Python / [ADR 0004](adr/0004-llm-checklist-evaluation-and-versioning.md) |
| `captured_text` | `text` | Contenido evaluado (considerar límites y retención) |
| `summary` | `jsonb` | `{ criterios_aprobados, criterios_aplicables, criterios_no_aplica, porcentaje_cumplimiento, estado_aceptacion }` |
| `observaciones_lc` | `text` nullable | Resumen editorial de hallazgos (opcional); mismo rol que el campo homónimo en `auditRecordSchema` / `strictAuditRecordSchema` ([`src/schemas/checklist.ts`](../src/schemas/checklist.ts)). |
| `proposed_text` | `text` nullable | Redacción sugerida para la URL (opcional); par con `texto_propuesto` en el contrato Zod. El detalle por criterio puede vivir en `audit_criterion_results`. |
| `duration_ms` | `int` nullable | Incluye tiempo de evaluación LLM cuando se mida end-to-end |
| `created_at` | `timestamptz` | default now() |

### `audit_criterion_results`

Una fila por criterio y auditoría (normalizado; facilita consultas por código).

| Columna | Tipo | Descripción |
| --- | --- | --- |
| `audit_id` | `uuid` FK | |
| `criterion_id` | `char(2)` o `text` | `A1`…`H1` |
| `estado` | `text` | `cumple` \| `incumple` \| `no_aplica` |
| `cita_textual` | `text` nullable | |
| `severidad` | `text` nullable | `baja` \| `media` \| `alta` |
| `comentario` | `text` nullable | |
| PK | (`audit_id`, `criterion_id`) | |

En **Fase 1 (mock en Next)**, la misma semántica debe reflejarse en la **UI de resultado**: la tabla de los 39 criterios debe poder mostrar **severidad** y **comentario** cuando el registro mock los incluya (`criterionEvaluationSchema` en [`src/schemas/checklist.ts`](../src/schemas/checklist.ts)), para paridad visual y contractual con esta tabla antes de existir Postgres.

**Convención de documentación:** las **decisiones sobre modelo de datos**, **parseo** del registro mock y **reglas de negocio** en pantalla (p. ej. cuándo rellenar `severidad` / `comentario`, obligatoriedad frente a Fase 2, mapeo explícito a estas columnas) que surjan de diálogo con el **Equipo UX** deben volcarse en `docs/` — este archivo, [`ARCHITECTURE.md`](ARCHITECTURE.md) y [`docs/development/DEVLOG.md`](development/DEVLOG.md) — para trazabilidad frente a implementación y a migraciones Prisma posteriores.

**Alternativa MVP rápida:** una sola columna `results jsonb` en `audits` con array de 39 elementos validado en aplicación. Trade-off: menos SQL declarativo, más simplicidad. Documentar elección en ADR.

### `url_index` (opcional, para atajos e inventario en `/auditar`)

Tabla o vista para las URLs seguidas por **Calidad Web** (extracto Clarity: **Sitio Web** + **Trámites**) y prioridades LC del equipo editorial, expuestas en UI principalmente desde **`/auditar`**, no desde la home de acceso. En Fase 1 mock: **22 filas** objetivo — ranks 1–20 en `tramites.inapi.cl` (rank 1 = landing portal); ranks 21–22 en `www.inapi.cl` (`type_url: sitioweb`). Campo lógico **`type_url`**: `tramites` | `sitioweb`.

| Columna | Tipo |
| --- | --- |
| `url` | `text` PK |
| `screen_name` | `text` |
| `last_audit_id` | `uuid` nullable |
| `priority` | `int` |
| `notes` | `text` nullable | Referencia a informe o fixture de demo |

En **Fase 1**, la misma información puede documentarse en **`docs/ux/`** (p. ej. [`inventario-urls-clarity.md`](ux/inventario-urls-clarity.md)) o un JSON liviano en **`data/`** sin crear aún la tabla, hasta migración en Fase 2.

---

## 3. Datos en repositorio (pre-Supabase y mocks)

| Ubicación | Uso |
| --- | --- |
| `data/checklist-criteria.json` | Catálogo 39 criterios; validación `validate:checklist` |
| `data/audit-fixtures/*.json` | Auditorías completas mock o volcadas; validación con `strictAuditRecordSchema` vía `bun run validate:audit-fixtures` (también encadenado en `bun run typecheck:all`) |

Los fixtures deben respetar la misma lógica de **porcentaje** y **`estado_aceptacion`** que la aplicación (rechazado ≤80 %, aceptado con observaciones 81–90 %, aprobado ≥91 % sobre criterios aplicables), coherente con [`src/schemas/checklist.ts`](../src/schemas/checklist.ts).

---

## 4. Row Level Security (ejemplo orientativo)

```sql
-- Ejemplo: cada usuario ve solo sus auditorías
alter table audits enable row level security;

create policy audits_select_own
  on audits for select
  using (auth.uid() = evaluator_user_id);

create policy audits_insert_own
  on audits for insert
  with check (auth.uid() = evaluator_user_id);
```

Ajustar cuando existan roles organizacionales (INAPI).

---

## 5. Migración desde JSON del repo

1. Sembrar `checklist_versions` desde `data/checklist-criteria.json` validado con Zod.
2. Opcional: sembrar `url_index` desde lista aprobada por equipo (export desde doc interno o CSV).
3. Los mocks de UI leen fixtures desde `data/audit-fixtures/` hasta conectar Supabase.
4. Tras primera migración SQL, considerar pipeline que exporte JSON desde BD para QA.

---

## 6. Retención y privacidad

- Definir política de borrado para `captured_text` (ej. 90 días) salvo requerimiento documental.
- Evitar almacenar datos personales innecesarios capturados por scraping.

---

*Este esquema es orientativo; la migración final debe acompañarse de ADR y revisiones de TI INAPI. Consolidación lógica previa a conexiones: [ADR 0007](adr/0007-modelo-datos-parseo-pre-conexiones.md).*
