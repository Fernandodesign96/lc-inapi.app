# Contratos API — `audit-jobs` y claim del worker local

**Estado:** especificación (Fase 4 paso 3) — 2026-08-17  
**Arquitectura:** [ADR 0011](adr/0011-worker-local-on-demand-vercel.md)  
**Orquestación:** [ADR 0009](adr/0009-claude-code-pro-como-orquestador.md) — Claude Code §17 **sin** cambiar skills/MCP  
**Implementación:** Fase 4 paso 4 (`feat/mvp-audit-jobs-worker`)

---

## 1. Principios

| Regla | Detalle |
| --- | --- |
| Vercel | Solo UI + Route Handlers delgados. **No** corre §17 ni Playwright largo. |
| Worker PC | Reclama jobs, ejecuta Claude Code §17, escribe resultado, marca `done`/`failed`. |
| Horario | `America/Santiago`, **08:00–18:00**. Fuera de ventana → estado `outside_hours` (mensaje claro en UI). |
| Auth MVP | Sin login. Mitigación opcional: secreto compartido worker ↔ API (`X-Worker-Secret`). |
| UX | La UI **no** muestra JSON/HTML crudo ni obliga al funcionario a copiar ids. El `id` del job puede vivir en query/poll interno. |
| Dominios URL | Solo `inapi.cl` / `tramites.inapi.cl` (misma regla que el formulario actual). |
| Checklist | Nuevas auditorías: `version_checklist: "2.1"`, **47** criterios. |

---

## 2. Modelo de job (persistencia)

Persistencia inicial: un archivo JSON por job en `data/jobs/{id}.json` **o** fila en SQLite local (decidir en paso 4; el contrato HTTP es el mismo).

### Estados

| `status` | Significado |
| --- | --- |
| `queued` | En cola; el worker puede reclamarlo. |
| `outside_hours` | Creado fuera de 8–18; no reclamar hasta ventana laboral (entonces → `queued` o el worker lo ignora hasta promoción). |
| `running` | Reclamado por un worker. |
| `done` | Auditoría terminada; hay resultado. |
| `failed` | Error recuperable/no; ver `errorMessage`. |

### Campos (lógico)

```ts
type AuditJobStatus =
  | "queued"
  | "outside_hours"
  | "running"
  | "done"
  | "failed"

type AuditJob = {
  id: string // ulid o uuid
  url: string
  auditorNombre: string // texto libre
  status: AuditJobStatus
  createdAt: string // ISO-8601
  updatedAt: string
  claimedAt?: string
  workerId?: string
  finishedAt?: string
  errorMessage?: string // mensaje seguro para UI (sin stack)
  /** Id del JSON canónico cuando status === done (p. ej. slug_YYYY-MM-DD). */
  auditId?: string
  /** Zona usada para la decisión de horario. */
  timezone: "America/Santiago"
}
```

Promoción `outside_hours` → `queued`: al inicio de la ventana laboral (cron del worker o al primer `claim` del día).

---

## 3. `POST /api/audit-jobs`

Crea un job desde la UI (Continuar).

### Request

```json
{
  "url": "https://www.inapi.cl/",
  "auditorNombre": "equipo de desarrollo"
}
```

| Campo | Validación |
| --- | --- |
| `url` | URL https; host permitido `*.inapi.cl` / `tramites.inapi.cl` |
| `auditorNombre` | string 1–120 caracteres, trim; sin HTML |

### Response 201 (dentro de horario)

```json
{
  "id": "01J…",
  "status": "queued",
  "createdAt": "2026-08-18T12:05:00.000-04:00",
  "message": "Tu auditoría quedó en cola. Puede demorar entre 10 y 40 minutos."
}
```

### Response 201 (fuera de horario)

```json
{
  "id": "01J…",
  "status": "outside_hours",
  "createdAt": "2026-08-18T20:10:00.000-04:00",
  "message": "El servicio de auditoría opera de lunes a viernes de 8:00 a 18:00 (hora Chile). Intenta nuevamente en ese horario."
}
```

**Decisión MVP:** sí se **persiste** el job con `outside_hours` (trazabilidad); el worker no lo ejecuta hasta promoverlo a `queued`.

### Errores

| HTTP | Cuándo |
| --- | --- |
| 400 | URL/nombre inválidos |
| 429 | (opcional) demasiados jobs `queued`/`running` |
| 500 | fallo de persistencia |

---

## 4. `GET /api/audit-jobs/:id`

Poll de estado para `/auditar/procesando`.

### Response 200

```json
{
  "id": "01J…",
  "status": "running",
  "url": "https://www.inapi.cl/",
  "auditorNombre": "equipo de desarrollo",
  "createdAt": "…",
  "updatedAt": "…",
  "message": "Auditoría en curso…"
}
```

Mensajes sugeridos por estado (copy UI):

| status | `message` orientativo |
| --- | --- |
| `queued` | En cola; te avisamos al terminar el análisis. |
| `outside_hours` | Fuera de horario laboral (8:00–18:00). |
| `running` | Auditoría en curso (puede demorar 10–40 min). |
| `done` | Lista; puedes ver el resultado. |
| `failed` | No se pudo completar; `errorMessage` breve. |

### Errores

| HTTP | Cuándo |
| --- | --- |
| 404 | id desconocido |

**Nota UX:** la pantalla de procesando hace poll cada N segundos; al `done` navega a resultado **sin** mostrar el id al usuario (salvo debug).

---

## 5. `GET /api/audit-jobs/:id/result`

Disponible cuando `status === "done"`.

### Response 200

```json
{
  "id": "01J…",
  "status": "done",
  "url": "https://www.inapi.cl/",
  "auditorNombre": "equipo de desarrollo",
  "finishedAt": "…",
  "auditId": "www-inapi-cl_2026-08-18",
  "historial": {
    "url": "https://www.inapi.cl/",
    "entradas": [
      {
        "fecha": "2026-08-18",
        "auditorNombre": "equipo de desarrollo",
        "auditId": "www-inapi-cl_2026-08-18",
        "porcentajeCumplimiento": 45.5,
        "estadoAceptacion": "rechazado"
      }
    ]
  },
  "descargas": {
    "resultadoPath": "/auditar/resultado?claudeAudit=www-inapi-cl_2026-08-18",
    "pdfPath": "/api/claude-audits/www-inapi-cl_2026-08-18/export/pdf"
  }
}
```

- Reutilizar APIs existentes de informe/PDF cuando el JSON ya esté en `data/claude-audits/…` y cableado en launch.
- `historial.entradas`: otras auditorías previas de la misma URL (desde launch/history o índice de jobs `done`); si no hay índice aún, array con la entrada actual.
- Si `status !== done` → **409** con el mismo shape de estado que GET `:id`.

---

## 6. Claim del worker (sin tocar skills/MCP)

El worker **no** reimplementa §17. Solo:

1. Reclama un job `queued`.
2. Invoca Claude Code con el flujo ya documentado (Playwright + 5 sub-subagentes + `validate:claude-audits` + cableado launch + `ingest:b` según runbook).
3. Escribe el JSON canónico en la ruta habitual.
4. Actualiza el job a `done` (`auditId`) o `failed`.

### `POST /api/audit-jobs/claim`

Header obligatorio MVP:

```http
X-Worker-Secret: <secreto compartido en env del PC y de Vercel>
```

Body opcional:

```json
{ "workerId": "pc-casa-fernando" }
```

### Response 200 (hay trabajo)

```json
{
  "id": "01J…",
  "url": "https://www.inapi.cl/",
  "auditorNombre": "equipo de desarrollo",
  "status": "running",
  "claimedAt": "…"
}
```

Semántica: atómico — solo un worker obtiene el job; pasa `queued` → `running`.

### Response 204

No hay jobs `queued` (o solo `outside_hours`).

### `POST /api/audit-jobs/:id/complete`

Header `X-Worker-Secret`.

```json
{
  "ok": true,
  "auditId": "www-inapi-cl_2026-08-18"
}
```

o

```json
{
  "ok": false,
  "errorMessage": "La captura Playwright falló tras 2 reintentos"
}
```

→ `done` / `failed`.

### Qué **no** hace el worker vía API

- No recibe el HTML completo ni el JSON de 47 criterios en el claim (los genera Claude Code en el PC).
- No modifica `.claude/skills/*` ni `CLAUDE.md` §17.
- No llama Anthropic API HTTP operativa.

### Bucle local sugerido (paso 4)

```text
cada 30–60 s (solo 8–18 America/Santiago):
  claim → si 200: claude §17(url) → validate → complete
  si 204: dormir
```

Fuera de 8–18: el worker puede dormir o solo promover `outside_hours` → `queued` al abrir la ventana.

---

## 7. Mapa UI ↔ API

| Pantalla | Acción |
| --- | --- |
| `/auditar` Continuar | `POST /api/audit-jobs` → redirect `procesando?jobId=` |
| `/auditar/procesando` | poll `GET /api/audit-jobs/:id` → si `done`, ir a resultado |
| Resultado / historial | `GET …/result` + rutas PDF/Excel existentes |
| (interno PC) | `claim` + `complete` |

---

## 8. Fuera de alcance de este documento

- Código de Route Handlers y script worker (paso 4).
- Túnel Cloudflare/Tailscale (spike paso 4).
- Nest/Prisma/Supabase Auth.
- Exponer listado admin de todos los jobs en UI MVP.

---

## 9. Criterio de aceptación del paso 3

- [x] Contratos anteriores documentados en repo.
- [ ] Revisados en PR; listos para implementar Zod + handlers en paso 4.
