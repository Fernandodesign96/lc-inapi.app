# CLAUDE.md — Contexto permanente del proyecto lc-inapi-app

Eres el asistente técnico del proyecto **lc-inapi-app**: aplicativo de auditoría editorial con IA para INAPI (Instituto Nacional de Propiedad Industrial, Chile).

Carga este archivo al inicio de cada sesión. Para conocimiento especializado, carga las Skills en `.claude/skills/`.

---

## 1. Dominio del proyecto

- **Qué hace:** automatiza la auditoría del Checklist Editorial INAPI v1.1 (39 criterios A1–H1) sobre URLs de `inapi.cl` y `tramites.inapi.cl`.
- **Resultado de cada auditoría:** un JSON canónico con 7 secciones (ver §4) que alimenta el frontend en `/auditar/resultado` y genera un informe PDF institucional.
- **Estado actual (jul 2026):** Fase 1.5 completada — 9 URLs operativas con JSON, informe y PDF en producción (Vercel). Fase 0 en curso.

---

## 2. Checklist v1.1 — 39 criterios

| Sección | IDs | Título |
| --- | --- | --- |
| A | A1–A5 | Estructura y organización del contenido |
| B | B1–B7 | Lenguaje claro |
| C | C1–C7 | Redacción y concisión |
| D | D1–D7 | Ortografía, gramática y formato |
| E | E1–E4 | Objetividad y fiabilidad |
| F | F1–F5 | Enlaces y referencias |
| G | G1–G3 | Datos personales y propiedad intelectual |
| H | H1 | Archivo y versionado |

**Fuente de verdad:** `data/checklist-criteria.json` (incluye `criterion`, `verification` y `source` por criterio).

### Umbrales de aceptación

| % cumplimiento (sobre criterios aplicables) | Estado |
| --- | --- |
| ≤ 80 % | `rechazado` |
| 81 – 90 % | `aceptado_con_observaciones` |
| ≥ 91 % | `aprobado` |

### Calibraciones acordadas con UX

- **G1 — RUT institucional:** RUT de **persona jurídica pública** (ej. `65.999.669-3` de INAPI en footer) → `cumple`. RUN o nombre de usuario de persona natural en HTML estático → `incumple`, `severidad: alta`.
- **D7 — mayúsculas en cabecera global:** los ítems `ACCESOS` y `BUSCADOR` de la cabecera global de `www.inapi.cl` quedan **excluidos** de D7 (restricción de estilo de plantilla). Aplicar D7 con normalidad en el resto de la página y en todas las URLs de `tramites.inapi.cl`.
- **E3 — fecha de publicación:** si no hay fecha visible en la página, registrar `(ausencia)` en `cita_textual` y proponer insertar una línea visible. Cobertura mínima 1:1. **Nunca** sustituir por `©año` del footer — el año de copyright no es fecha de actualización del contenido.
- **D1 vs E4:** D1 cubre errores tipográficos, falta de tildes, capitalización incorrecta y texto de desarrollo sin eliminar. E4 es exclusivamente el elemento `<title>` con guiones que no describe el contenido de la página. Son criterios distintos; no confundir.

---

## 3. Rutas clave del repositorio

| Ruta | Descripción |
| --- | --- |
| `data/checklist-criteria.json` | Fuente de verdad — 39 criterios con enunciado, verificación y fuente normativa |
| `data/claude-audits/` | JSONs canónicos del piloto (9 URLs, formato `{slug}_{fecha}.json`) |
| `data/claude-audits/urls-clarity/` | JSONs de la serie Clarity (17 ranks) con bloque `clarity_meta` |
| `auditorias/htmls/` | HTMLs capturados por Playwright MCP (crear si no existe; en `.gitignore`) |
| `src/schemas/claude-audit-pilot.ts` | Esquema Zod `strictAuditRecordSchema` — fuente de verdad del contrato JSON |
| `src/schemas/url-audit.ts` | Esquema Zod complementario para auditorías de URL |
| `rag/chroma_db/coleccion_a/` | Vectores de PDFs normativos (generado localmente; en `.gitignore`) |
| `rag/chroma_db/coleccion_b/` | Vectores de JSONs canónicos y ADRs del repo (generado localmente; en `.gitignore`) |
| `docs/adr/` | ADRs 0001–0010 — decisiones arquitectónicas |
| `docs/ARCHITECTURE.md` | AI Stack de 5 capas y flujo principal |
| `docs/PROPUESTA_TECNICA_INTEGRAL.md` | v2.0 — procedimiento de implementación Fases 0–4 |
| `docs/flujo-piloto-10-urls-claude-mvp.md` | Flujo operativo: prompts §3.1–§3.6, calibraciones, JSON canónico |
| `.agents/workflows/git-commit-convention.md` | Convención de commits en español |
| `.agents/workflows/devlog-standard.md` | Formato obligatorio de entradas DEVLOG |

---

## 4. Estructura del JSON canónico (7 secciones)

Cada auditoría produce un archivo `{slug-url}_{YYYY-MM-DD}.json`. La fuente de verdad del contrato es `src/schemas/claude-audit-pilot.ts` y `src/schemas/url-audit.ts`. **NUNCA** modificar el contrato sin actualizar los schemas primero.

### Esquema objetivo (serie Clarity y producción)

```json
{
  "id": "{slug-url}_{YYYY-MM-DD}",
  "url": "https://...",
  "fecha": "YYYY-MM-DD",
  "evaluador_uid": "Fernando Arriagada Castillo",
  "clarity_meta": { "rank": 1, "nombre_ui": "Portal Trámites", "visitas_ref": 1200 },
  "criterios": [
    { "id": "A1", "estado": "cumple|incumple|no_aplica", "severidad": "baja|media|alta", "comentario": "...", "cita_textual": "..." }
  ],
  "resumen": { "total": 39, "cumple": 0, "incumple": 0, "no_aplica": 0, "porcentaje": 0.0 },
  "resumen_ejecutivo": "...",
  "observaciones_lc_por_severidad": {
    "alta": [],
    "media": [],
    "baja": []
  },
  "sustituciones": [
    { "linea": "T007", "html_linea_aprox": "HTML-L10", "original": "...", "propuesto": "...", "criterio_id": "E4", "motivo": "..." }
  ],
  "nota_final_tic": "Instrucciones para TI al implementar las sustituciones..."
}
```

### Campos legacy (piloto jun 2026 — 9 URLs operativas)

Los JSONs del piloto en `data/claude-audits/` usan los nombres `criterios_evaluados` (array), `criterios_no_aplica`, `criterios_aplicables`, `criterios_aprobados`, `porcentaje_cumplimiento`, `estado_aceptacion`, `texto_propuesto`, `observaciones_lc`, `tipo_pagina` y `fecha_evaluacion`. Son válidos; no migrar sin ADR.

**Validación:** `bun run validate:claude-audits` — ejecuta automáticamente vía Hook al guardar.

---

## 5. Reglas permanentes

- **NUNCA inventar criterios** — solo los 39 de `data/checklist-criteria.json`.
- **Estado de criterio:** SOLO `"cumple"` | `"incumple"` | `"no_aplica"`. Sin otros valores.
- **Contar cada criterio UNA SOLA VEZ** por URL, independientemente de cuántas ocurrencias haya.
- **Cobertura 1:1 obligatoria:** cada `incumple` → al menos una entrada en `sustituciones[]`.
- **Umbrales:** ≤ 80 % → `rechazado` · 81–90,9 % → `aceptado_con_observaciones` · ≥ 91 % → `aprobado`.
- **G1 — RUT institucional:** persona jurídica pública = `cumple`. RUN/nombre usuario en HTML estático = `incumple alta`.
- **E3:** ausencia de fecha de actualización = `incumple`. Nunca sustituir por `©año` del footer.
- **D1 vs E4:** D1 = errores tipográficos, tildes, capitalización, texto de dev sin eliminar. E4 = elemento `<title>` con guiones que no describe el contenido. Criterios distintos.

---

## 6. Patrones sistémicos conocidos (transversales a todas las URLs)

Verificar siempre antes de dar por terminada la auditoría:

| Patrón | Criterio | Descripción |
| --- | --- | --- |
| Mayúsculas en navbar | D7 🟡 | `MI INAPI`, `TRAMITACIÓN`, `PAGOS`, `SERVICIOS` en menú lateral Trámites |
| «Titulos» sin tilde, «Patentes PCT» | D1 🔴 | Presentes en menú de varias páginas Trámites |
| Botones `OK` / `Aceptar` en modales | F3 🟡 | Transversal a `_Layout.cshtml`; proponer «Aceptar selección» |
| PDF sin formato/peso | F4 🔴 | Documentos descargables sin indicar `(PDF, X KB)` |
| Ausencia de fecha de actualización | E3 🔴 | Sin fecha visible fuera de noticias individuales |
| `<title>` con guiones | E4 🟡 | Solo nombre institución, no describe la tarea de la página |
| PCT en menú Patentes sin expansión | B3 🔴 | Sigla sin expandir en primera aparición |
| Imágenes sin `alt` descriptivo | H1 🟡 | Imágenes que no tienen atributo `alt` o lo tienen vacío |

---

## 7. Flujo de trabajo en el frontend

El resultado de cada auditoría alimenta `/auditar/resultado`, que muestra **7 secciones**:

| # | Sección | Fuente en JSON |
| --- | --- | --- |
| 1 | Datos de Auditoría | `id`, `url`, `fecha`, `evaluador_uid`, `tipo_pagina` |
| 2 | Resumen | `resumen` (`total`, `cumple`, `incumple`, `no_aplica`, `porcentaje`) |
| 3 | Pasos a seguir | `estado_aceptacion` / `resumen.porcentaje` → umbral → copy UI |
| 4 | 39 criterios evaluados | `criterios` (tabla completa con estado y severidad) |
| 5 | Observaciones por severidad | `observaciones_lc_por_severidad` (`alta`, `media`, `baja`) |
| 6 | Texto propuesto | `sustituciones[]` |
| 7 | Nota para TI | `nota_final_tic` |

La ruta de acceso a un resultado es: `/auditar/resultado?claudeAudit={id}&url={url}`.
El PDF se genera bajo demanda desde `GET /api/claude-audits/[id]/export/pdf`.

---

## 8. MCP servers disponibles

| Servidor | Comando de registro | Qué hace |
| --- | --- | --- |
| `playwright` | `claude mcp add playwright npx @playwright/mcp@latest` | Navega URLs, extrae HTML completo del DOM renderizado |
| `rag-auditoria` | `claude mcp add rag-auditoria bun /ruta/rag/mcp-server.ts` | Consulta semántica sobre Colección A (PDFs normativos) y Colección B (JSONs + ADRs del repo) |

**Estado actual:** Playwright MCP y RAG MCP se configuran en Fase 1 y Fase 2 respectivamente. En sesiones anteriores a esas fases, el contexto viene de `CLAUDE.md` + Skills + archivos del repo.

---

## 9. Convenciones del repo

- **Runtime:** Bun (no npm ni yarn). Instalar con `bun install`, correr scripts con `bun run`.
- **Commits:** en español, Conventional Commits — ver `.agents/workflows/git-commit-convention.md`.
- **Ramas:** una por fase (`feat/claude-md-skills`, `feat/playwright-mcp`, `feat/rag-workspace`, `feat/audit-full-flow`). Nunca mezclar documentación con código ni fases entre sí.
- **DEVLOG:** una entrada por sesión relevante, formato `.agents/workflows/devlog-standard.md`. Las entradas más recientes van arriba.
- **JSON canónicos:** validar siempre con `bun run validate:claude-audits` antes de commitear.
- **Datos sensibles:** `rag/chroma_db/` y `documentos/` en `.gitignore`; nunca al repo.
- **TypeScript en todo:** sin mezclar Python en este repositorio (ADR 0008).

---

## 10. Stack tecnológico

| Componente | Tecnología | Notas |
| --- | --- | --- |
| **Frontend** | Next.js 16 + TypeScript + Bun (`./frontend/`) | Vercel; App Router; Server Components |
| **Orquestador IA** | Claude Code Pro (WSL, terminal) | Suscripción existente; sin API key; cero costo adicional (ADR 0009) |
| **Captura HTML** | Playwright MCP (`npx @playwright/mcp@latest`) | Navegación real de URLs; DOM renderizado (Fase 1) |
| **Embeddings** | `@xenova/transformers` — `Xenova/paraphrase-multilingual-MiniLM-L12-v2` | ~400 MB, offline en CPU, multilingüe (ADR 0010) |
| **Base vectorial** | Chroma local (puerto 8000, `./rag/`) | Datos sensibles no salen de INAPI; copia directa al servidor TI (ADR 0010) |
| **Pipeline RAG** | LangChain.js (TypeScript, `./rag/`) | Colección A (PDFs normativos) + Colección B (JSONs + ADRs) (ADR 0008) |
| **RAG MCP** | `bun rag/mcp-server.ts` | Expone Chroma a Claude Code como herramientas nativas (Fase 2) |
| **Validación contratos** | Zod + `validate-claude-audits.ts` + Hooks | Automatiza la validación al guardar cada JSON |
| **Runtime** | Bun | Coherente con el monorepo existente; `bun.lock` único |

Referencias completas: `docs/ARCHITECTURE.md` · `docs/PROPUESTA_TECNICA_INTEGRAL.md` · `docs/adr/`.