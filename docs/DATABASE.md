# Capa de datos (Supabase / PostgreSQL)
## MVP — Aplicativo de Auditoría de Lenguaje Claro INAPI

| Metadatos | Detalle |
| --- | --- |
| **Versión** | 0.2 |
| **Motor** | PostgreSQL (hosted por Supabase) |
| **ORM (servicio API)** | **Prisma** (ver [ADR 0005](adr/0005-api-backend-nestjs-prisma.md)) |

---

## 1. Principios

- **Versionado explícito** del checklist y del prompt (`checklist_version`, `prompt_version`).
- **39 filas lógicas** por auditoría en evaluación detallada (o JSON validado con Zod en una columna `jsonb` + constraints).
- **RLS** obligatorio antes de exponer a usuarios no-service.

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
| `prompt_version` | `text` | |
| `captured_text` | `text` | Contenido evaluado (considerar límites y retención) |
| `summary` | `jsonb` | `{ criterios_aprobados, criterios_aplicables, criterios_no_aplica, porcentaje_cumplimiento, estado_aceptacion }` |
| `proposed_text` | `text` nullable | |
| `duration_ms` | `int` nullable | |
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

**Alternativa MVP rápida:** una sola columna `results jsonb` en `audits` con array de 39 elementos validado en aplicación. Trade-off: menos SQL declarativo, más simplicidad. Documentar elección en ADR.

### `url_index` (opcional, para dashboard “20 URLs prioritarias”)

| Columna | Tipo |
| --- | --- |
| `url` | `text` PK |
| `screen_name` | `text` |
| `last_audit_id` | `uuid` nullable |
| `priority` | `int` |

---

## 3. Row Level Security (ejemplo orientativo)

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

## 4. Migración desde JSON del repo

1. Sembrar `checklist_versions` desde `data/checklist-criteria.json` validado con Zod.
2. Los mocks de UI pueden leer del mismo JSON hasta conectar Supabase.
3. Tras primera migración SQL, considerar pipeline que exporte JSON desde BD para QA.

---

## 5. Retención y privacidad

- Definir política de borrado para `captured_text` (ej. 90 días) salvo requerimiento documental.
- Evitar almacenar datos personales innecesarios capturados por scraping.

---

*Este esquema es orientativo; la migración final debe acompañarse de ADR y revisiones de TI INAPI.*
