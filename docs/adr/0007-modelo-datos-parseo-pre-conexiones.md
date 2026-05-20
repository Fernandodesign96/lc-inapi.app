# ADR 0007 — Modelo lógico de datos, formato de entrada y parseo (pre-conexiones)

## Estado

**Borrador / propuesto** — 2026-05-20. Documento de **alineación previa a reunión** con responsable de datos / **Equipo UX**: consolida lo ya establecido en el repositorio y lista decisiones pendientes. **No** sustituye migraciones Prisma ni implementación Nest/Lambda hasta ratificación; tras la reunión se actualizarán [DATABASE.md](../DATABASE.md), [ARCHITECTURE.md](../ARCHITECTURE.md) y, si aplica, [ADR 0006](0006-lc-evaluation-python-claude-aws.md).

## Contexto

Requisito explícito de trabajo antes de abordar **conexiones** entre servicios: disponer de una **estructura** de cómo se conformará la base de datos — **formato de entrada**, **parseo** necesario, **campos** y **tipo de dato** de cada uno — y solo entonces pasar a cablear integraciones.

En el proyecto ya existen: modelo orientativo en [DATABASE.md](../DATABASE.md), contratos Zod en [`src/schemas/checklist.ts`](../../src/schemas/checklist.ts), decisión de evaluación LLM y versionado en [ADR 0004](0004-llm-checklist-evaluation-and-versioning.md), API de dominio en [ADR 0005](0005-api-backend-nestjs-prisma.md), topología Python + Claude + AWS en [ADR 0006](0006-lc-evaluation-python-claude-aws.md) y flujo en [ARCHITECTURE.md](../ARCHITECTURE.md). Este ADR **reúne** en un solo lugar el panorama **lógico** (entidades, origen de datos, parseo) explícitamente **antes** del detalle de conexiones (auth Nest ↔ API Gateway, VPC, etc.).

## Lo ya establecido (no renegociar sin nueva ADR)

1. **Escritura en Postgres:** por defecto **solo NestJS + Prisma** persisten auditorías y resultados; el servicio Python **entrega** JSON validado y **no** escribe en Supabase salvo decisión futura documentada ([DATABASE.md](../DATABASE.md) §1, [ADR 0006](0006-lc-evaluation-python-claude-aws.md)).
2. **Contrato de salida de evaluación:** JSON compatible con los criterios del checklist; validación con **Zod** en TypeScript (`criterionEvaluationSchema` × 39, agregado con `strictAuditRecordSchema` cuando corresponda el registro completo) y política de **reintento** o degradación si falla el parseo ([ADR 0004](0004-llm-checklist-evaluation-and-versioning.md)).
3. **Versionado:** `checklist_version` y `prompt_version` deben persistirse junto a cada ejecución de evaluación ([ADR 0004](0004-llm-checklist-evaluation-and-versioning.md), [DATABASE.md](../DATABASE.md) §2 `audits`).
4. **39 filas lógicas** por auditoría en detalle de criterios, o equivalente validado en `jsonb` ([DATABASE.md](../DATABASE.md) §2 y alternativa `results` en el mismo §).
5. **Topología objetivo:** Nest ↔ (REST/JSON) API Gateway ↔ Lambda (Python) ↔ Claude API ([ADR 0006](0006-lc-evaluation-python-claude-aws.md), [ARCHITECTURE.md](../ARCHITECTURE.md) §1.1).

## 1. Diagrama lógico (entidades y cardinalidad)

Orientativo para discusión con BD; nombres de tabla alineados a [DATABASE.md](../DATABASE.md) §2.

```mermaid
erDiagram
  checklist_versions ||--o{ audits : "version_checklist"
  audits ||--|{ audit_criterion_results : "39 criterios"
  audits ||--o| url_index : "opcional last_audit_id"

  checklist_versions {
    uuid id PK
    text version UK
    text title
    jsonb criteria_json
    timestamptz created_at
  }

  audits {
    uuid id PK
    text url
    text domain
    timestamptz evaluated_at
    uuid evaluator_user_id FK
    text checklist_version
    text prompt_version
    text captured_text
    jsonb summary
    text observaciones_lc
    text proposed_text
    int duration_ms
    timestamptz created_at
  }

  audit_criterion_results {
    uuid audit_id PK_FK
    text criterion_id PK
    text estado
    text cita_textual
    text severidad
    text comentario
  }

  url_index {
    text url PK
    text screen_name
    uuid last_audit_id FK
    int priority
    text notes
  }
```

**Nota:** En el contrato Zod actual (`auditRecordSchema`), los identificadores usan nombres en español en parte del agregado (`fecha_evaluacion`, `evaluador_uid`, `version_checklist`, `texto_capturado`, `texto_propuesto`, `observaciones_lc`). En Postgres se documentaron columnas en inglés (`evaluated_at`, `evaluator_user_id`, `captured_text`, `proposed_text`, …). La **tabla de mapeo** del §3 fija el puente parseo ↔ columnas.

## 2. Mapeo Zod (`strictAuditRecordSchema`) ↔ columnas `audits` + `summary`

| Campo lógico (Zod / JSON) | Tipo en Zod | Columna / destino SQL (orientativo) | Origen | Nullable / notas |
| --- | --- | --- | --- | --- |
| `id` | `string` min 1 | `audits.id` (uuid generado por Nest al crear) | Sistema (Nest) al insertar | PK; el string Zod de mocks puede mapearse a uuid en persistencia. |
| `url` | `string` url | `audits.url` | Captura / usuario | Obligatorio; normalización acordada con TI. |
| `fecha_evaluacion` | `string` datetime ISO | `audits.evaluated_at` | Sistema (Nest al cerrar evaluación) | Obligatorio en persistencia. |
| `evaluador_uid` | email o string | `audits.evaluator_user_id` | Auth Supabase (`auth.users`) | Obligatorio cuando exista login. |
| `version_checklist` | `string` | `audits.checklist_version` | Catálogo / request | Obligatorio; FK lógica a `checklist_versions.version` si se usa tabla. |
| *(no en Zod hoy)* | — | `audits.prompt_version` | Servicio Python / configuración Nest | Obligatorio en Fase 2 según ADR 0004; hoy no está en `auditRecordSchema` — **reunión: añadir al contrato o solo a capa persistida.** |
| `texto_capturado` | `string` | `audits.captured_text` | Captura (scraping o pegado) | Obligatorio; límites y retención en [DATABASE.md](../DATABASE.md) §6. |
| `criterios_evaluados` | array length 39 | `audit_criterion_results` × 39 **o** `audits.results` jsonb | **Principalmente salida LLM** (tras prompt); validado con Zod | Obligatorio; decisión normalizado vs jsonb (§5). |
| `criterios_aprobados` | `number` | `summary.criterios_aprobados` **y/o** derivado de hijos | **Calculado** (`summarizeEvaluations`) | En `strictAuditRecordSchema` debe coincidir con el array; en BD puede denormalizarse en `summary`. |
| `criterios_aplicables` | `number` | idem | Calculado | idem |
| `criterios_no_aplica` | `number` | idem | Calculado | idem |
| `porcentaje_cumplimiento` | `number` 0–100 | idem | Calculado | Fórmula en `summarizeEvaluations` (N/A excluidos del denominador). |
| `estado_aceptacion` | enum | idem | Calculado | `rechazado` / `aceptado_con_observaciones` / `aprobado`. |
| `texto_propuesto` | `string` opcional | `audits.proposed_text` | LLM o editor | Nullable. |
| `observaciones_lc` | `string` opcional | `audits.observaciones_lc` | LLM o editor | Nullable. |
| `tiempo_evaluacion_segundos` | `number` opcional | `audits.duration_ms` / 1000 o columna dedicada | Sistema | Opcional; convención reunión: segundos vs ms. |

## 3. Mapeo por criterio: `criterionEvaluationSchema` ↔ `audit_criterion_results`

| Campo lógico (Zod) | Tipo en Zod | Columna SQL | Origen | Nullable / notas |
| --- | --- | --- | --- | --- |
| `id` | enum A1…H1 | `criterion_id` | Catálogo + fila LLM | PK compuesta con `audit_id`. |
| `estado` | enum | `estado` | LLM | Obligatorio. |
| `cita_textual` | `string` opcional | `cita_textual` | LLM | Nullable. |
| `severidad` | enum baja/media/alta opcional | `severidad` | LLM / reglas post-proceso | Nullable; reglas de negocio con **Equipo UX**. |
| `comentario` | `string` opcional | `comentario` | LLM | Nullable. |

## 4. Flujo de parseo (viñetas, orden lógico)

1. **Cliente → Nest:** solicitud de auditoría con URL (y/o texto ya capturado), identidad del evaluador y metadatos acordados (versión de checklist visible para el cliente o fijada por servidor).
2. **Nest:** persiste o actualiza registro de auditoría en borrador con `captured_text` y estados intermedios si el producto lo requiere; invoca servicio de **captura** si aún no hay texto (fuera del alcance detallado de este ADR; ver ADR 0004 deuda Cheerio vs Playwright).
3. **Nest → Lambda (Python):** cuerpo REST/JSON con texto a evaluar, `checklist_version`, `prompt_version`, y criterios o referencia al catálogo que deba embeber el prompt (formato exacto **pendiente** de anexo OpenAPI o ejemplo en reunión).
4. **Lambda → Claude:** prompt con **formato de salida obligatorio** (JSON compatible con el contrato; [ADR 0004](0004-llm-checklist-evaluation-and-versioning.md)).
5. **Lambda → Nest:** respuesta JSON; Nest (o Lambda, según política acordada) valida estructura; en el camino feliz Nest usa **`parseStrictAuditRecord`** en TypeScript con el payload o lo traduce desde un DTO intermedio.
6. **Nest:** si la validación falla, aplica **reintentos acotados** o marca fallo sin completar `audits` / borra borrador — **política exacta pendiente** (§6).
7. **Nest → Postgres:** transacción Prisma: insert/upsert `audits` + 39 filas en `audit_criterion_results` **o** un solo update con `summary` + `results` jsonb según decisión §5.

## 5. Ejemplos mínimos de JSON (ilustrativos, sujetos a reunión)

**Salida esperada del servicio de evaluación hacia Nest** (debe poder validarse contra `strictAuditRecordSchema` tras mapeo de nombres si se usan alias en inglés en wire):

```json
{
  "id": "uuid-audit-en-borrador",
  "url": "https://tramites.inapi.cl/ejemplo",
  "fecha_evaluacion": "2026-05-22T12:00:00.000Z",
  "evaluador_uid": "usuario@inapi.cl",
  "version_checklist": "1.1",
  "texto_capturado": "Texto plano evaluado…",
  "criterios_evaluados": [
    { "id": "A1", "estado": "cumple" },
    { "id": "A2", "estado": "incumple", "cita_textual": "…", "severidad": "media", "comentario": "…" }
  ],
  "criterios_aprobados": 0,
  "criterios_aplicables": 0,
  "criterios_no_aplica": 0,
  "porcentaje_cumplimiento": 0,
  "estado_aceptacion": "rechazado",
  "observaciones_lc": null,
  "texto_propuesto": null,
  "tiempo_evaluacion_segundos": 12
}
```

*(El ejemplo numérico anterior es incompleto a propósito: un registro real debe incluir las **39** entradas en `criterios_evaluados` y contadores coherentes; sirve solo como anclaje de forma.)*

## 6. Fallos de validación y persistencia

- [ADR 0004](0004-llm-checklist-evaluation-and-versioning.md): si falla Zod, reintento acotado o degradación a “revisión manual requerida”.
- **Pendiente reunión:** ¿se guarda registro de **intento fallido** (log, tabla `audit_failures`, solo observabilidad)? ¿Se deja fila `audits` en estado `failed` con `captured_text` pero sin resultados?

## 7. Decisiones pendientes (checklist para la reunión)

Marcar en la reunión cada ítem como **cerrado**, **cambio a documentar** o **nueva ADR**.

### 7.1 Modelo físico ([DATABASE.md](../DATABASE.md))

| Tema | Ya en doc | Pendiente |
| --- | --- | --- |
| Tabla hija `audit_criterion_results` vs columna `results jsonb` en `audits` | Trade-off descrito | Elección definitiva para MVP |
| `prompt_version` en contrato Zod wire vs solo columna BD | Columna en `audits` | ¿Extender `auditRecordSchema`? |
| Mapeo snake_case inglés en API pública vs campos español Zod | Este ADR §2 | Convención única wire JSON |
| `domain` derivado de `url` | check constraint en DATABASE | ¿Trigger / aplicación? |

### 7.2 Servicios y parseo ([ADR 0006](0006-lc-evaluation-python-claude-aws.md))

| Tema | Ubicación ADR 0006 | Pendiente |
| --- | --- | --- |
| Lambda vs ECS (timeouts, payload) | Preguntas abiertas | Cierre con TI |
| Pydantic en Python vs validación solo en Nest | Preguntas abiertas | Cierre |
| Auth Nest → API Gateway | Preguntas abiertas | Cierre |
| Confirmación “solo Nest escribe BD” | Decisión | Reconfirmar |

### 7.3 Producto / Equipo UX

- Reglas de **severidad** y **comentario** por criterio (obligatoriedad, solo en `incumple`, etc.).
- Retención máxima y anonimización de fragmentos en `cita_textual` / `captured_text` ([DATABASE.md](../DATABASE.md) §6).

## 8. Relación con otros ADR y documentos

| Artefacto | Rol respecto a 0007 |
| --- | --- |
| [0003](0003-contract-first-mocking-with-zod.md) | Contract-first y mocks; base del uso de Zod. |
| [0004](0004-llm-checklist-evaluation-and-versioning.md) | Formato salida LLM, versionado prompt, reintentos. |
| [0005](0005-api-backend-nestjs-prisma.md) | Nest + Prisma como dueño de persistencia. |
| [0006](0006-lc-evaluation-python-claude-aws.md) | Conexiones AWS y frontera Python; **posterior** al cierre lógico de §7. |
| [DATABASE.md](../DATABASE.md) | Tablas orientativas; 0007 propone matriz hasta alinear. |
| [`src/schemas/checklist.ts`](../../src/schemas/checklist.ts) | Fuente de verdad actual del JSON estricto. |

## Consecuencias

- **Positivo:** un solo documento para reunión de alineación BD / parseo sin mezclar aún detalle de redes y claves.
- **Negativo:** duplicación temporal con DATABASE/ARCHITECTURE hasta propagar cambios tras la reunión.
- **Siguiente paso:** tras ratificación, actualizar migraciones Prisma, ampliar contrato Zod si se acuerda (`prompt_version` en wire, etc.) y marcar este ADR como **Aceptado** con fecha.
