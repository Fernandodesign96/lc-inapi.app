# CLAUDE.md — Contexto permanente del proyecto lc-inapi-app

Eres el asistente técnico del proyecto **lc-inapi-app**: aplicativo de auditoría editorial con IA para INAPI (Instituto Nacional de Propiedad Industrial, Chile).

Carga este archivo al inicio de cada sesión. Para conocimiento especializado, carga las Skills en `.claude/skills/`.

---

## 1. Dominio del proyecto

- **Qué hace:** automatiza la auditoría del Checklist Editorial INAPI v1.1 (39 criterios A1–H1) sobre URLs de `inapi.cl` y `tramites.inapi.cl`.
- **Resultado de cada auditoría:** un JSON canónico con 7 secciones (ver §4) que alimenta el frontend en `/auditar/resultado` y genera un informe PDF institucional.
- **Estado actual (jul 2026):** Fases 0–3 completadas en WSL (Playwright + RAG + flujo sub-subagentes). Fase 3.3 en curso: captura autenticada ClaveÚnica y calibración de datos de sesión (`docs/fase-3-3-captura-auth-claveunica.md`). MVP: 9 URLs piloto + 13/17 serie Clarity con JSON.

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

- **G1 — RUT institucional:** RUT de **persona jurídica pública** (ej. `65.999.669-3` de INAPI en footer) → `cumple`. RUN o nombre de usuario de persona natural en **HTML estático público** → `incumple`, `severidad: alta`.
- **G1 — pantallas con sesión autenticada (`captura_con_sesion: true`):** los datos del **solicitante logueado** (RUT, nombre, correo, marca en trámite, etc.) en campos de formulario o resúmenes **no son incumplimiento G1** — son esperables. Evaluar si la **estructura del formulario** (etiquetas, ayudas, orden, claridad de instrucciones) permite completar el trámite sin ambigüedad. Ver §19.
- **D7 — mayúsculas en cabecera global:** los ítems `ACCESOS` y `BUSCADOR` de la cabecera global de `www.inapi.cl` quedan **excluidos** de D7 (restricción de estilo de plantilla). Aplicar D7 con normalidad en el resto de la página y en todas las URLs de `tramites.inapi.cl`.
- **E3 — fecha de publicación:** si no hay fecha visible en la página, registrar `(ausencia)` en `cita_textual` y proponer insertar una línea visible. Cobertura mínima 1:1. **Nunca** sustituir por `©año` del footer — el año de copyright no es fecha de actualización del contenido.
- **D1 vs E4:** D1 cubre errores tipográficos, falta de tildes, capitalización incorrecta y texto de desarrollo sin eliminar. E4 es exclusivamente el elemento `<title>` con guiones que no describe el contenido de la página. Son criterios distintos; no confundir.

---

## 3. Rutas clave del repositorio

| Ruta | Descripción |
| --- | --- |
| `data/checklist-criteria.json` | Fuente de verdad — 39 criterios con enunciado, verificación y fuente normativa |
| `data/claude-audits/tramites/{YYYY-MM-DD}/` | JSONs Meta MEI Trámites (piloto + Clarity) |
| `data/claude-audits/sitioweb/{YYYY-MM-DD}/` | JSONs Meta MEI Sitio Web (piloto + Clarity) |
| `auditorias/htmls/` | HTMLs capturados por Playwright (`.html`/`.txt` versionados; auxiliares binarios ignorados) |
| `auditorias/.auth/` | `storageState` de sesión ClaveÚnica — **solo local**; `*.json` en `.gitignore` |
| `docs/fase-3-3-captura-auth-claveunica.md` | Fase 3.3: captura autenticada, ranks pendientes TI, WSL vs PC empresa |
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
- **G1 — RUT institucional:** persona jurídica pública = `cumple`. RUN/nombre en HTML **público** estático = `incumple alta`. En **sesión autenticada** (§19): datos del solicitante en formulario = esperados; evaluar claridad de etiquetas/ayudas, no la presencia del dato.
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

---

## 11. Workflow — Captura HTML con Playwright

*Aplica desde Fase 1. En Fase 0 usar Ctrl+U manual o HTML adjunto en prompt.*

### URLs públicas (sin login)

1. Verificar que el servidor Playwright MCP está activo (`claude mcp list`).
2. Llamar `playwright_navigate` con la URL objetivo.
3. Esperar carga completa — usar `networkidle` o pausa de 2 s tras `DOMContentLoaded`.
4. Llamar `playwright_get_content` → obtener HTML del DOM renderizado (no Ctrl+U).
5. Guardar en `auditorias/htmls/{slug-url}_{YYYY-MM-DD}.html`.

### URLs post-login (`tramites.inapi.cl` con sesión ClaveÚnica)

El MCP de Playwright **no reutiliza** la sesión de tu Chrome ni de Ctrl+U. Usar **storageState**:

1. **Una vez por sesión (WSL):** login manual y guardar estado:
   ```bash
   bun x playwright codegen https://tramites.inapi.cl/Account/Login \
     --save-storage=auditorias/.auth/tramites-session.json
   ```
2. **Captura por URL:**
   ```bash
   bun run capture:tramites-html -- --url "https://tramites.inapi.cl/..." \
     --slug "{slug-url}" --date "YYYY-MM-DD"
   ```
3. Pasar el HTML guardado al flujo de auditoría §12 con `captura_con_sesion: true` (§19).
4. **Nunca** commitear `auditorias/.auth/*.json` — contiene cookies activas.

Si el MCP no acepta `storageState`, el script local es la vía obligatoria para URLs autenticadas.

**Diferencia DOM renderizado vs Ctrl+U:** en URLs Trámites el JS inyectado desde BE modifica el DOM; la línea 1000 de Ctrl+U puede no coincidir con el código fuente TI. Usar siempre DOM como fuente de verdad editorial y `fragmento_busqueda` como ancla para TI (ver `docs/stack-orquestación.md` §3).

**Ranks pendientes TI (sin forzar auditoría):** 8, 11, 13, 15 — ver `docs/fase-3-3-captura-auth-claveunica.md` §3.

---

## 12. Workflow — Auditoría completa de una URL

*Flujo de referencia. Ver prompts detallados en `docs/flujo-piloto-10-urls-claude-mvp.md` §3.1–§3.2.*

### Paso 1 — Preparación
- Identificar URL objetivo y `tipo_pagina` (`sitioweb` | `tramites`).
- Obtener HTML (Playwright §11, script `capture:tramites-html` si post-login, o Ctrl+U si Fase 0).
- Si la captura fue con sesión autenticada: marcar `captura_con_sesion: true` y aplicar §19 en todos los sub-subagentes.
- Para serie Clarity: leer metadatos en `data/ux/clarity-fichas-mock.json` (rank, `nombre_ui`, `visitas_ref`).
- ¿Existe JSON previo para la misma URL y mismo HTML? → Copiar, actualizar `id`/`fecha`/`clarity_meta`, conservar criterios y sustituciones.

### Paso 2 — Primera pasada (inventario + evaluación en prosa)
Prompt §3.1 del flujo. Entregar:
- Inventario `T001: «texto» (contexto)` de todos los nodos relevantes.
- Tabla de 39 criterios (id, estado, severidad si incumple, comentario, `cita_textual`).
- Resumen numérico preliminar + lista de sustituciones.

### Paso 3 — Segunda pasada (JSON canónico)
Prompt §3.2 del flujo. Reglas de contrato:
- Exactamente **39 objetos** en `criterios_evaluados[]`, orden A1…H1.
- Estado: SOLO `"cumple"` | `"incumple"` | `"no_aplica"`. Sin otros valores ni `null`.
- `severidad` SOLO si `estado = "incumple"` — omitir la clave en `cumple`/`no_aplica`.
- `cita_textual`: omitir la clave si no hay cita (nunca `null`).
- Cobertura 1:1 obligatoria: cada `incumple` → al menos una fila en `sustituciones[]`.
- Todo hallazgo en `observaciones_lc_por_severidad` DEBE tener fila equivalente en `sustituciones[]`.
- Resumen numérico coherente con el array: `criterios_aprobados` = conteo de `"cumple"`.
- `porcentaje_cumplimiento` = `criterios_aprobados / criterios_aplicables × 100` (un decimal).
- Para serie Clarity: añadir bloque `clarity_meta` con `serie`, `rank`, `nombre_ui`, `ruta_etiqueta`, `visitas_ref`, `encargado_ref`.

### Tipos de propuesta en `sustituciones[]`

Cada fila en `sustituciones[]` debe corresponder a **uno** de estos cinco tipos:

| Tipo | Cuándo usarlo | `original` | `propuesto` |
| --- | --- | --- | --- |
| **Sustitución** | El texto existe y debe cambiar | Literal del HTML (con entidades `&#243;`, etc.) | Texto corregido en lenguaje claro |
| **Inserción** | El elemento no existe: falta fecha, intro, glosa de sigla, `alt` en imagen | `"(ausencia)"` o `"(no existe en HTML)"` | Bloque literal que TI debe insertar |
| **Eliminación** | El fragmento debe quitarse: texto de dev, RUT redundante, `LINK EXTERNO` | Fragmento literal | `"(eliminar nodo)"` + nota en `motivo` |
| **Reorden / estructura** | El contenido existe pero en orden incorrecto (A2 pirámide invertida) | Titular técnico que aparece primero | Párrafo de propósito que debe ir antes; `html_linea_aprox` del bloque contenedor |
| **Enlace / slug** | F1, F3: nombre del enlace ≠ nombre del destino | Texto del enlace actual | Texto descriptivo del destino; si el slug no puede renombrarse, anotarlo en `motivo` |

**Reglas de estilo de las propuestas:**
- Lenguaje claro, voz activa, sin mayúsculas en toda la palabra salvo siglas reconocidas (PCT, INAPI, OMPI).
- Una fila por cambio localizable; no agrupar criterios distintos en una fila salvo párrafo continuo (ej. T432–T435 como bloque único).
- No inventar pesos en MB para documentos; usar solo `"(PDF)"` si no se conoce el peso exacto en el CMS.
- Orden sugerido del array: por sección A→H o por `linea` (Tnnn) ascendente.

**Regla para `no_aplica` con propuesta excepcional:** si un criterio es `no_aplica` por la estructura actual de la página, pero TI podría incorporar el elemento en una mejora futura, documentar la recomendación en el campo `comentario` del criterio — **no** crear fila en `sustituciones[]` salvo que sea una mejora explícitamente acordada con UX/Bernarda.

### Paso 4 — Validación y guardado
```bash
# Guardar el JSON en la ruta correcta
# Convención: data/claude-audits/{tramites|sitioweb}/{YYYY-MM-DD}/{id}.json
# El id sigue siendo {slug}_{YYYY-MM-DD}; la fecha del path debe coincidir con el sufijo del id.

bun run validate:claude-audits   # debe pasar sin errores
```

### Paso 5 — Commit y DEVLOG
```bash
git add data/claude-audits/...
git commit -m "feat(audits): agregar auditoría {slug-url} — {estado_aceptacion} {porcentaje}%"
# Añadir entrada en docs/development/DEVLOG.md (formato .agents/workflows/devlog-standard.md)
```

---

## 13. Workflow — Generación del PDF del informe

*El PDF está implementado desde Fase C (jun 2026). No requiere código nuevo.*

### Generar PDF desde la UI (flujo normal)
1. Navegar a `/auditar/resultado?claudeAudit={id}&url={url}`.
2. Hacer clic en **«Descargar informe PDF»** (botón visible cuando hay `?claudeAudit=`).
3. El PDF se genera server-side desde `GET /api/claude-audits/[id]/export/pdf`.

### API directa
```
GET /api/claude-audits/{id}/export/pdf
```
- Nombre del archivo de descarga: `informe-lc-{slug-url}-{fecha}.pdf` (lógica en `frontend/src/lib/informe-piloto-filename.ts`).
- Misma allowlist que `GET /api/claude-audits/[id]`.
- Motor: `@react-pdf/renderer`, `runtime = nodejs`.

### Contenido del PDF (mismos 7 bloques de `/auditar/resultado`)
| Bloque | Contenido |
| --- | --- |
| 1 | Datos de Auditoría (`url`, checklist, cumplimiento, fecha, evaluador) |
| 2 | Resumen (`resumen_ejecutivo`) |
| 3 | Pasos a seguir (según `estado_aceptacion`) |
| 4 | 39 criterios evaluados (tabla completa) |
| 5 | Observaciones por severidad (`observaciones_lc_por_severidad`) |
| 6 | Texto propuesto (tabla `sustituciones[]`) |
| 7 | Nota para TI (`nota_final_tic`) |

### Troubleshooting
- Si el botón PDF no aparece: verificar que el JSON existe en `data/claude-audits/` y que el parámetro `?claudeAudit={id}` está en la URL del resultado.
- Si el PDF falla en Vercel: verificar que `LC_REPO_ROOT` apunta al directorio raíz del monorepo y que `data/claude-audits/` está incluido en el árbol de despliegue.
- Si `@react-pdf` lanza error de fuentes: las fuentes Roboto deben estar disponibles en el servidor (ver `frontend/src/app/api/claude-audits/[id]/export/pdf/route.ts`).

---

## 14. Workflow — Lote de URLs con subagentes en paralelo

*Aplica desde Fase 3 (flujo completo automatizado).*

### Preparación del lote
1. Definir la lista de URLs objetivo (extraer de `data/ux/clarity-fichas-mock.json` o del inventario).
2. Verificar que Playwright MCP y RAG MCP están activos.
3. Crear un directorio de trabajo temporal `auditorias/lote-{fecha}/` para HTMLs del lote.

### Ejecución con subagentes
- Crear **un subagente por URL**; cada uno ejecuta el workflow §12 de forma independiente.
- Sincronización: el sistema de archivos es el canal — cada subagente escribe su JSON en `data/claude-audits/` al terminar.
- **No lanzar el siguiente subagente hasta que el anterior haya guardado su JSON** para evitar condiciones de carrera.
- Límite recomendado: lotes de **5 URLs máximo** antes de verificar resultados.

### Verificación del lote
```bash
bun run validate:claude-audits   # verifica todos los JSONs del directorio
```
- Revisar que `porcentaje_cumplimiento` y `estado_aceptacion` son coherentes entre sí.
- Revisar que no hay criterios duplicados (`incumple` en arreglo + fila en `sustituciones[]`).

### Commit del lote
```bash
git add data/claude-audits/
git commit -m "feat(audits): agregar lote {N} URLs — serie Clarity ranks {A}–{B}"
```

---

## 15. Comandos de referencia rápida

```bash
# ── Captura autenticada (Fase 3.3) ─────────────────────────────────────────
bun x playwright codegen https://tramites.inapi.cl/Account/Login \
  --save-storage=auditorias/.auth/tramites-session.json
bun run capture:tramites-html -- --url "https://..." --slug "..." --date "YYYY-MM-DD"

# ── Validación ─────────────────────────────────────────────────────────────
bun run validate:claude-audits            # valida todos los JSONs del repo
bun run typecheck:all                     # TypeScript + lint completo (CI)

# ── RAG (Fase 2+) ──────────────────────────────────────────────────────────
chroma run --path ./rag/chroma_db --port 8000   # levantar Chroma (dejar corriendo)
bun run rag/ingest-b.ts                   # ingestar colección B (datos del repo)
bun run rag/ingest-a.ts                   # ingestar colección A (PDFs normativos)
bun run rag/query.ts "criterio D7"        # probar consulta semántica

# ── MCP ────────────────────────────────────────────────────────────────────
claude mcp add playwright npx @playwright/mcp@latest
claude mcp add rag-auditoria bun /ruta/absoluta/rag/mcp-server.ts
claude mcp list                           # verificar servidores activos y estado

# ── Frontend ───────────────────────────────────────────────────────────────
cd frontend && bun run dev                # servidor local (puerto 3000)
bun run build                             # build de producción
bun run lint                              # linter

# ── Git (convención) ───────────────────────────────────────────────────────
git log --oneline -10                     # ver últimos commits
git stash push -u -m "descripcion"        # guardar cambios con untracked
git push origin main                      # subir a remoto
```

---

## 16. Política de `no_aplica` — cuándo usar cada criterio

| Criterio | Usar `no_aplica` cuando... | Ejemplo |
| --- | --- | --- |
| A4 | La página es un formulario, pantalla de estado o panel de tramitación sin bloques de texto editorial | `tramites.inapi.cl/Trademark/TrademarkApplication` |
| A5 | No hay texto institucional o de relleno visible — solo contenido funcional | Páginas de sólo formulario |
| C6 | El texto tiene menos de 4 párrafos continuos en la página | Home con secciones tipo tarjeta corta |
| C7 | No hay listas de requisitos en la página | Páginas de portal/home sin listados de pasos |
| D3 | El espaciado entre párrafos es criterio CSS/visual — declarar fuera del alcance editorial en esta auditoría | Aplica a casi todas las páginas |
| D4 | La alineación del texto es criterio CSS/visual — fuera del alcance editorial | Aplica a casi todas las páginas |
| D6 | No hay texto corrido extenso que requiera destacar palabras clave con negritas | Páginas tipo portal con titulares cortos |
| G2 | La página es interna o transaccional sin exposición pública de política de privacidad | Pantallas de tramitación post-login |
| H1 | No hay versiones anteriores publicadas ni rótulos de contenido archivado | La mayoría de URLs del inventario |

**Regla de oro:** `no_aplica` = el criterio no puede evaluarse porque el supuesto del criterio no existe en la página. No usar `no_aplica` para evitar marcar un incumplimiento evidente.

**Regla de `no_aplica` con propuesta excepcional:** si el criterio no aplica por la estructura actual pero TI podría incorporarlo en una mejora futura (ej. C6 — la página hoy tiene 3 párrafos, pero al ampliar contenido necesitará resumen inicial), documentar la recomendación en `comentario`. No crear fila en `sustituciones[]` salvo que esté acordado explícitamente con UX/Bernarda.

---

## 17. Arquitectura de sub-subagentes por grupo de secciones

*Aplica desde Fase 3 (flujo completo automatizado). Requiere Playwright MCP + RAG MCP activos.*

### Motivación

Evaluar los 39 criterios en una sola pasada puede sacrificar profundidad en secciones complejas (B/C lingüística, F/G compliance). Esta arquitectura delega cada grupo de secciones a un sub-subagente especializado, garantizando análisis robusto y consistente.

### 5 grupos temáticos

| Grupo | Secciones | Criterios | Foco |
| --- | --- | --- | --- |
| **1 — Estructura y Objetividad** | A + E | A1–A5, E1–E4 | Organización de contenido, pirámide invertida, fechas, títulos representativos |
| **2 — Lenguaje y Redacción** | B + C | B1–B7, C1–C7 | Voz activa, tuteo, siglas, oraciones simples, párrafos de una idea |
| **3 — Mecánica** | D | D1–D7 | Ortografía, puntuación, formato visual, mayúsculas sostenidas |
| **4 — Enlaces** | F | F1–F5 | Descriptividad de CTAs, coherencia nombre/destino, PDFs con formato |
| **5 — Datos y Archivo** | G + H | G1–G3, H1 | Datos personales, derechos ARCO, versiones archivadas |

### Flujo completo (por URL)

```
Agente raíz
│
├── [1] Playwright MCP → captura HTML → texto_capturado (compartido)
│
├── [2] Sub-subagente Grupo 1 (A+E) ← texto_capturado + skill auditoria-lc §A,§E
├── [3] Sub-subagente Grupo 2 (B+C) ← texto_capturado + skill auditoria-lc §B,§C
├── [4] Sub-subagente Grupo 3 (D)   ← texto_capturado + skill auditoria-lc §D
├── [5] Sub-subagente Grupo 4 (F)   ← texto_capturado + skill auditoria-lc §F
└── [6] Sub-subagente Grupo 5 (G+H) ← texto_capturado + skill auditoria-lc §G,§H
        │
        ↓ (cada uno entrega: array de criterios de su sección + sustituciones parciales)
        │
├── [7] Agente raíz consolida los 5 outputs:
│       - Une los 5 arrays → exactamente 39 criterios, orden A1…H1
│       - Une todos los sustituciones[] de los 5 grupos
│       - Calcula resumen numérico (criterios_aprobados, porcentaje, estado_aceptacion)
│       - Escribe el JSON canónico completo
│
└── [8] validate:claude-audits (Hook automático)
```

### Reglas de consolidación (agente raíz — paso 7)

- **El `texto_capturado` se captura UNA SOLA VEZ** y se pasa como contexto a los 5 sub-subagentes. No capturar el HTML 5 veces.
- **Sin superposición de criterios:** cada criterio es evaluado por exactamente un grupo. Si hay duda (ej. E4 vs D1 para el `<title>`): E4 es de Grupo 1, D1 de Grupo 3.
- **Consolidación de `sustituciones[]`:** unir los arrays de los 5 grupos. Si dos grupos proponen cambio para el mismo `linea`, el agente raíz retiene la propuesta del grupo con `severidad` más alta y anota el conflicto en `nota_final_tic`.
- **Verificación de completitud antes de cerrar:** contar filas en `criterios_evaluados[]` = 39; verificar cobertura 1:1 entre `incumple` y `sustituciones[]`.
- **No lanzar el paso 7 hasta que los 5 sub-subagentes hayan entregado su output.**

### Instrucción de contexto para cada sub-subagente

Al lanzar cada sub-subagente, incluir siempre:
1. El `texto_capturado` completo (HTML inventariado T001…).
2. La URL, `tipo_pagina` y `fecha` de la auditoría.
3. Flag `captura_con_sesion: true|false` — si `true`, aplicar §19 (Grupo 5 es crítico para G1–G3).
4. Las secciones del checklist que debe evaluar (ej. "Evalúa SOLO los criterios A1–A5 y E1–E4").
5. La instrucción: "Entrega SOLO el array de criterios de tu sección + el array de sustituciones[] correspondiente. No calcules el resumen total."
6. La calibración aplicable a su sección (ver §2 y §19 de este CLAUDE.md).

### Skill que carga cada sub-subagente

| Grupo | Skill principal | Secciones del checklist |
| --- | --- | --- |
| Grupo 1 (A+E) | `auditoria-lc.md` §A y §E | Estructura y Objetividad |
| Grupo 2 (B+C) | `auditoria-lc.md` §B y §C | Lenguaje y Redacción |
| Grupo 3 (D) | `auditoria-lc.md` §D | Mecánica |
| Grupo 4 (F) | `auditoria-lc.md` §F | Enlaces |
| Grupo 5 (G+H) | `auditoria-lc.md` §G y §H | Datos y Archivo |

Para fundamentos normativos de cualquier sección, cargar también `auditoria-calidad-web.md`.
Para precedentes históricos, cargar `pesquisa-criterios.md` y consultar RAG MCP Colección B.

### Ventajas vs una sola pasada

| Aspecto | Pasada única | Sub-subagentes (5 grupos) |
| --- | --- | --- |
| Profundidad en B/C (lingüística) | Media — comparte contexto con 39 criterios | Alta — el agente se concentra solo en 14 criterios |
| Consistencia en D (typos masivos) | Puede perder ocurrencias | Grupo dedicado — revisa el HTML íntegro solo para D |
| Trazabilidad de errores | Difícil aislar qué sección falló | Error acotado al grupo que lo produjo |
| Tiempo total | Más rápido | Más lento (paralelo), pero más preciso |
| Riesgo de conflicto entre criterios | Alto (D1 vs E4, G1 vs A5) | Bajo — la asignación por grupo elimina la ambigüedad |

---

## 18. Seguridad y datos sensibles

Referencia completa: `docs/SECURITY.md`.

### Garantías arquitectónicas del stack local IA (Fases 0–4)

| Garantía | Mecanismo |
| --- | --- |
| Ningún documento interno sale a internet | Todo corre en WSL; Chroma es proceso local (puerto 8000) |
| PDFs normativos no versionados | `documentos/` en `.gitignore`; solo existe localmente y en servidor TI |
| Vectores no versionados | `rag/chroma_db/` en `.gitignore` |
| Embeddings offline | `@xenova/transformers` corre 100 % en CPU tras descarga inicial |
| Claude Code no envía PDFs a Anthropic | Los documentos se leen como texto en el contexto local de WSL |
| Colecciones A y B aisladas | Scripts separados (`ingest-a.ts` / `ingest-b.ts`); barrera arquitectónica |

### Datos que NUNCA entran al RAG ni al repo

- RUT/RUN, nombres, correos o teléfonos de personas naturales **como valores literales** en JSON canónicos, commits o Colección B.
- Solicitudes de marca o expedientes de tramitación identificables.
- Resultados del buscador de anterioridades de marcas.
- Credenciales, tokens de sesión (`auditorias/.auth/*.json`), claves API o secretos de cualquier tipo.
- HTML crudo de capturas con sesión activa en el RAG — solo JSON **anonimizado** validado puede reingestarse en Colección B.

### `storageState` y capturas autenticadas

- `auditorias/.auth/tramites-session.json` — generado por `playwright codegen --save-storage`; en `.gitignore`.
- Renovar la sesión cuando expire o redirija a login.
- En JSON canónico: **anonimizar** todo dato del solicitante en `cita_textual`, `original`, `propuesto` y resumen de `texto_capturado` (placeholders: `[RUT del solicitante]`, `[nombre de marca]`).

### Reglas de higiene en commits y fixtures

- **Secretos:** nunca en `NEXT_PUBLIC_*`, variables de entorno visibles, ni commits. Solo en `.env.local` (en `.gitignore`).
- **Fixtures y datos UX:** usar personas y documentos ficticios o anonimizados (acordado con TI/legal). No incluir RUN, nombres propios reales ni volcados de BD en `data/`.
- **`evaluador_uid` en fixtures:** usar `"fixture@inapi.cl"` o el nombre real solo si el JSON es un canónico de producción validado.
- **API fixtures (`GET /api/audit-fixtures/[fixtureId]`):** la ruta tiene allowlist de `fixtureId` — no exponer path traversal.

### Variables de entorno requeridas

| Variable | Entorno | Descripción |
| --- | --- | --- |
| `LC_REPO_ROOT` | Vercel / producción | Ruta raíz del monorepo; requerida si el `cwd` en runtime no es la raíz (ver `docs/despliegue/despliegue-hibrido.md`) |
| `CHROMA_PORT` | Local / servidor TI | Puerto de Chroma (defecto `8000`); configurar en `.env.local` |

### Checklist antes de cada push a `main`

- [ ] No hay `console.log` con URLs, tokens ni datos de usuarios.
- [ ] Ningún archivo `.env*` real en el staging area (`git status`).
- [ ] Los JSONs canónicos no contienen datos personales reales del solicitante (solo `evaluador_uid` del auditor y placeholders en citas).
- [ ] `rag/chroma_db/` y `documentos/` no aparecen en el staging area.
- [ ] `bun run validate:claude-audits` pasa sin errores.
- [ ] `bun run typecheck:all` pasa sin errores.

---

## 19. Auditorías con sesión autenticada (`captura_con_sesion: true`)

*Aplica a pantallas de `tramites.inapi.cl` capturadas tras login ClaveÚnica o Clave INAPI (Fase 3.3). Documentación operativa: `docs/fase-3-3-captura-auth-claveunica.md`.*

### Cuándo activar

- La URL solo es accesible con sesión activa (formularios de trámite, escritos, solicitudes guardadas, etc.).
- El HTML contiene datos del **usuario logueado** en campos, tablas o resúmenes de trámite.

### Qué NO hacer

- **No** marcar `incumple` en G1 solo porque aparece el RUT, nombre, correo o marca del solicitante en su propio formulario.
- **No** proponer sustituciones que eliminen o reemplacen datos de sesión del usuario.
- **No** transcribir valores reales en `cita_textual`, `original`, `propuesto`, `observaciones_lc` ni en el inventario Tnnn del JSON.
- **No** usar severidad `alta` en G1 por datos esperables del flujo transaccional.

### Qué SÍ evaluar (por criterio)

| Criterio | Enfoque en pantalla autenticada |
| --- | --- |
| **G1** | ¿Se exponen datos de **terceros** sin justificación? ¿Hay datos personales fuera del contexto del formulario (p. ej. en pie de página estático)? Los datos del solicitante en su trámite → `cumple` o evaluar solo si la **exposición es indebida** |
| **G2** | `no_aplica` en pantallas transaccionales post-login (ya calibrado en §16) |
| **G3** | Copyright / condiciones institucionales del layout — igual que URLs públicas |
| **B1–B7, C1–C7** | Claridad de etiquetas de campo, ayudas contextuales, instrucciones de pasos — citar la **etiqueta**, no el valor del input |
| **F1–F5** | CTAs y enlaces del flujo de trámite; descriptividad de botones de envío/confirmación |
| **A1–A5, D, E** | Estructura de la pantalla, títulos, fechas visibles, ortografía de copy **institucional** (no de valores ingresados por el usuario) |

### Anonimización obligatoria en salidas

| Campo JSON | Regla |
| --- | --- |
| Inventario `Tnnn` | `«[valor de sesión — no transcribir]» (contexto: campo «RUT del solicitante» prellenado)` |
| `cita_textual` | Referir tipo de dato y ubicación: «Campo «Nombre de la marca» con etiqueta clara y ayuda contextual» |
| `original` / `propuesto` en sustituciones | Solo copy **institucional** editable (etiquetas, placeholders de ayuda, textos de instrucción). Nunca el valor del usuario |
| `texto_capturado` | Resumen del inventario anonimizado (T001…), no volcado literal del HTML con PII |

### Ejemplo de comentario G1 correcto (sesión autenticada)

```
G1 cumple: la pantalla muestra datos del solicitante en campos de formulario acotados al trámite
(etiquetas «RUT», «Nombre solicitante», «Marca»). No se exponen datos de terceros ni información
fuera del contexto transaccional esperado.
```

### Ejemplo de comentario B2 correcto (evaluar claridad sin nombrar datos)

```
B2 incumple media: la etiqueta del campo de clasificación Niza no explica qué debe ingresar el
usuario; solo muestra el código sin glosa. Propuesta: añadir texto de ayuda bajo el campo.
```

### Instrucción para el Grupo 5 (sub-subagente G+H)

Al lanzar el sub-subagente del Grupo 5 con `captura_con_sesion: true`, incluir explícitamente:

> «Evalúa G1–G3 según CLAUDE.md §19. Los datos del solicitante logueado en formularios NO son incumplimiento G1. Anonimiza toda cita. Evalúa si las etiquetas, ayudas y estructura del formulario son entendibles para completar el trámite.»

### Chroma / RAG en sesión autenticada

Chroma **no** accede a la URL ni al HTML de sesión. El RAG MCP solo aporta normativa (A) y precedentes anonimizados del repo (B). Consultar precedentes de URLs similares del mismo tipo de formulario, no fragmentos con PII.