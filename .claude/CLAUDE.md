# CLAUDE.md — Contexto permanente del proyecto lc-inapi-app

Eres el asistente técnico del proyecto **lc-inapi-app**: aplicativo de auditoría editorial con IA para INAPI (Instituto Nacional de Propiedad Industrial, Chile).

Carga este archivo al inicio de cada sesión. Para conocimiento especializado, carga las Skills en `.claude/skills/`.

---

## 1. Dominio del proyecto

- **Qué hace:** automatiza la auditoría del Checklist Editorial INAPI v2.1 (47 criterios A1–H1) sobre URLs de `inapi.cl` y `tramites.inapi.cl`.
- **Resultado de cada auditoría:** un JSON canónico con 7 secciones (ver §4) que alimenta el frontend en `/auditar/resultado` y genera un informe PDF institucional.
- **Estado actual (jul 2026):** Fases 0–3 completadas en WSL (Playwright + RAG + flujo sub-subagentes). Fase 3.3 en curso: captura autenticada ClaveÚnica y calibración de datos de sesión (`docs/fase-3-3-captura-auth-claveunica.md`). MVP: 9 URLs piloto + 13/17 serie Clarity con JSON.

---

## 2. Checklist v2.1 — 47 criterios

| Sección | IDs | Título |
| --- | --- | --- |
| A | A1–A9 | Estructura y organización del contenido |
| B | B1–B8 | Lenguaje claro |
| C | C1–C9 | Redacción y concisión |
| D | D1–D7 | Ortografía, gramática y formato |
| E | E1–E4 | Objetividad, autoría y fiabilidad |
| F | F1–F6 | Enlaces y referencias |
| G | G1–G3 | Datos personales y propiedad intelectual |
| H | H1 | Archivo y versionado |

**Fuente de verdad:** `data/checklist-criteria.json` (incluye `criterion`, `verification`, `source` y `applicability` por criterio). Nuevas auditorías: **47** filas y `version_checklist: "2.1"`. Las JSON históricas v1.1 (39) siguen válidas.

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
- **D1 vs E4:** D1 cubre errores tipográficos, falta de tildes, capitalización incorrecta y texto de desarrollo sin eliminar **en contenido visible**. E4 es el **H1 visible** que no describe el contenido específico. **No** evaluar ni inventariar `<title>` / `<meta>` (fuera de alcance de entrega).
- **A5 vs A8:** A5 penaliza **exceso** (relleno institucional). A8 exige **suficiencia** para autonomía en trámites (`applicability: tramites`). No son opuestos del mismo hallazgo.
- **C5 vs C9:** C5 mide **longitud** por párrafo; C9 mide **cantidad** de párrafos del cuerpo (2–8).
- **F5 vs F6:** F5 es **posición** del enlace; F6 es presencia de **enlaces relacionados** internos (no solo menú).
- **B8:** documentar en `comentario` el resultado de Legible (u equivalente); sin medición sobre texto principal → incumplir o justificar `no_aplica`.
- **Citas normativas v2.1:** usar `IEW` / `IESD` / `RLC` / `MEI` del campo `source`. No inventar `CW` en auditorías nuevas.

---

## 3. Rutas clave del repositorio

| Ruta | Descripción |
| --- | --- |
| `data/checklist-criteria.json` | Fuente de verdad — 47 criterios v2.1 (enunciado, verificación, fuente, applicability) |
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
  "evaluador_uid": "equipo de desarrollo",
  "clarity_meta": { "rank": 1, "nombre_ui": "Portal Trámites", "visitas_ref": 1200 },
  "criterios": [
    { "id": "A1", "estado": "cumple|incumple|no_aplica", "severidad": "baja|media|alta", "comentario": "...", "cita_textual": "..." }
  ],
  "resumen": { "total": 47, "cumple": 0, "incumple": 0, "no_aplica": 0, "porcentaje": 0.0 },
  "version_checklist": "2.1",
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

- **NUNCA inventar criterios** — solo los 47 de `data/checklist-criteria.json` (o 39 si se reabre una auditoría histórica v1.1).
- **Estado de criterio:** SOLO `"cumple"` | `"incumple"` | `"no_aplica"`. Sin otros valores.
- **Contar cada criterio UNA SOLA VEZ** por URL, independientemente de cuántas ocurrencias haya.
- **Cobertura 1:1 obligatoria:** cada `incumple` → al menos una entrada en `sustituciones[]`.
- **Umbrales:** ≤ 80 % → `rechazado` · 81–90,9 % → `aceptado_con_observaciones` · ≥ 91 % → `aprobado`.
- **G1 — RUT institucional:** persona jurídica pública = `cumple`. RUN/nombre en HTML **público** estático = `incumple alta`. En **sesión autenticada** (§19): datos del solicitante en formulario = esperados; evaluar claridad de etiquetas/ayudas, no la presencia del dato.
- **E3:** ausencia de fecha de actualización = `incumple`. Nunca sustituir por `©año` del footer.
- **D1 vs E4:** D1 = errores tipográficos, tildes, capitalización, texto de dev sin eliminar (visible). E4 = **H1 visible** que no describe el contenido. **Prohibido** usar `<title>`/`<meta>` como evidencia.

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
| H1 genérico o desalineado | E4 🟡 | Evaluar solo H1 visible; no usar `<title>` del head |
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
| 4 | 47 criterios evaluados (v2.1) | `criterios` (tabla completa con estado y severidad) |
| 5 | Observaciones por severidad | `observaciones_lc_por_severidad` (`alta`, `media`, `baja`) |
| 6 | Texto propuesto | `sustituciones[]` |
| 7 | Nota para TI | `nota_final_tic` |

La ruta de acceso a un resultado es: `/auditar/resultado?claudeAudit={id}&url={url}`.
El PDF se genera bajo demanda desde `GET /api/claude-audits/[id]/export/pdf`.

---

## 8. MCP servers disponibles

| Servidor | Comando de registro | Qué hace |
| --- | --- | --- |
| `playwright` | `claude mcp add playwright npx @playwright/mcp@latest` | Navega URLs, extrae HTML/DOM, a11y snapshot, evaluate (`getComputedStyle`), listar enlaces/PDF |
| `rag-auditoria` | `claude mcp add rag-auditoria bun /ruta/rag/mcp-server.ts` | Consulta semántica sobre Colección A (PDFs normativos) y Colección B (JSONs + ADRs del repo) |

**Playbook de uso (máximo rendimiento por URL):**

| Herramienta | Rol | Qué hacer / qué no |
| --- | --- | --- |
| **Claude Code (agente raíz)** | Orquestador único | Lanza 5 sub-subagentes §17, consolida §20, escribe JSON, valida, cablea. **No** evaluar los 47 criterios solo en el raíz. |
| **Playwright MCP** | Captura una vez | `navigate` → HTML a disco → snapshot a11y → `evaluate` estilos si D3/D4 dudosos → abrir modales de 1 clic. **No** re-navegar por cada grupo. |
| **Chroma / RAG MCP** | Fundamento + precedentes | Colección A por `source` del criterio; Colección B por URL/patrón. Consultas puntuales; **no** volcar PDFs enteros al chat. |
| **Skills** | Especialización | Cada subagente carga `auditoria-lc` de su sección (+ `auditoria-calidad-web` / `pesquisa-criterios` si hace falta). |

**Estado actual:** Playwright MCP y RAG MCP activos en el flujo de producción local. Sin MCP: degradado con `CLAUDE.md` + skills (anotar en DEVLOG).

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

*Flujo canónico de producción: **`.claude/prompts/audit-una-url.md`** (1 URL = 1 sesión Claude Code).*  
*Referencia legacy piloto: `docs/flujo-piloto-10-urls-claude-mvp.md` §3.1–§3.2. Multi-sesión: `audit-lote.md`.*

### Paso 1 — Preparación
- Identificar **una** URL objetivo y `tipo_pagina` (`sitioweb` | `tramites`).
- Obtener HTML (Playwright §11 + playbook §8, script `capture:tramites-html` si post-login, o Ctrl+U si Fase 0).
- Si la captura fue con sesión autenticada: marcar `captura_con_sesion: true` y aplicar §19 en todos los sub-subagentes.
- Para serie Clarity: leer metadatos en `data/ux/clarity-fichas-mock.json` (rank, `nombre_ui`, `visitas_ref`).
- ¿Existe JSON previo para la misma URL? → Reauditar con evidencia nueva; id previo a `history[]` tras cablear el vigente.

### Paso 2 — Inventario en dos capas + evaluación (§17)
Plantilla `audit-una-url.md`. Entregar:
- Inventario `T001…` en capas **R** (redacción) y **U** (chrome UI / formato) — ver skill `auditoria-lc.md`.
- 5 sub-subagentes en paralelo (§17) con gate de evidencia §20.6 / §21.
- Tabla de 47 criterios v2.1 + `sustituciones[]` consolidadas por el agente raíz.

### Paso 3 — Segunda pasada (JSON canónico)
Prompt §3.2 del flujo. Reglas de contrato:
- Exactamente **47 objetos** en `criterios_evaluados[]` (v2.1), orden A1…H1 (incluye A6–A9, B8, C8, C9, F6). Auditorías históricas v1.1: 39 objetos.
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

**Regla para `no_aplica` con propuesta excepcional:** si un criterio es `no_aplica` por la estructura actual de la página, pero TI podría incorporar el elemento en una mejora futura, documentar la recomendación en el campo `comentario` del criterio — **no** crear fila en `sustituciones[]` salvo que sea una mejora explícitamente acordada con Equipo UX.

### Paso 4 — Validación y guardado
```bash
# Guardar el JSON en la ruta correcta
# Convención: data/claude-audits/{tramites|sitioweb}/{YYYY-MM-DD}/{id}.json
# El id sigue siendo {slug}_{YYYY-MM-DD}; la fecha del path debe coincidir con el sufijo del id.

bun run validate:claude-audits   # debe pasar sin errores
```

### Paso 4b — Cablear frontend (no automático)

El JSON en disco y `bun run ingest:b` **no** bastan para la UI. Actualizar:

- `frontend/src/lib/clarity-audits-launch.ts` (serie Clarity / historial `/auditar/historial`)
- `frontend/src/lib/claude-audits-launch.ts` si la URL está en el piloto 9

Regla: `claudeAuditId` / `id` vigente = **última** auditoría; ids previos en `history[]` + meta. Ver `audit-una-url.md` Paso F / `audit-lote.md` (cableado).

### Paso 5 — Commit y DEVLOG
```bash
git add data/claude-audits/... frontend/src/lib/clarity-audits-launch.ts
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
| 4 | 47 criterios evaluados v2.1 (tabla completa) |
| 5 | Observaciones por severidad (`observaciones_lc_por_severidad`) |
| 6 | Texto propuesto (tabla `sustituciones[]`) |
| 7 | Nota para TI (`nota_final_tic`) |

### Troubleshooting
- Si el botón PDF no aparece: verificar que el JSON existe en `data/claude-audits/` y que el parámetro `?claudeAudit={id}` está en la URL del resultado.
- Si el PDF falla en Vercel: verificar que `LC_REPO_ROOT` apunta al directorio raíz del monorepo y que `data/claude-audits/` está incluido en el árbol de despliegue.
- Si `@react-pdf` lanza error de fuentes: las fuentes Roboto deben estar disponibles en el servidor (ver `frontend/src/app/api/claude-audits/[id]/export/pdf/route.ts`).

---

## 14. Workflow — Conjunto de URLs (multi-sesión)

*Aplica desde Fase 3. Plantilla: `.claude/prompts/audit-lote.md`. Canónico por URL: `audit-una-url.md`.*

### Política de tamaño (obligatoria)

| Caso | Tamaño | Cómo |
| --- | --- | --- |
| META MEI / reauditoría §20 | **1 URL por sesión** | Pegar `audit-una-url.md` |
| Dos páginas hermanas | **Máx. 2** | Solo si la 1ª cerró `validate` + commit |
| Smoke Clarity ligero | Hasta 5 (legacy) | Verificar tras cada URL; no apilar consolidaciones |

**Prohibido** en entregas MEI / profundidad §20: un solo prompt maestro con 3–5 URLs.

### Preparación del conjunto
1. Definir la lista ordenada (p. ej. `mei-meta-mei-urls.ts` órdenes 1…N).
2. Verificar Playwright MCP + RAG MCP (`claude mcp list`; Chroma en `:8000`).
3. HTMLs en `auditorias/htmls/` o `auditorias/lote-{fecha}/`.

### Ejecución
- Por cada URL: workflow §12 + §17 + §20 + §21 **completo** (captura → 5 grupos → consolidación → validate → cable → commit atómico).
- **No** abrir la siguiente URL hasta cerrar la actual.
- El agente raíz orquesta; los 5 sub-subagentes son **por URL**, no un subagente “por URL” que haga los 47 solo.

### Verificación
```bash
bun run validate:claude-audits
```
- Coherencia `%` / `estado_aceptacion`; cobertura `incumple` ↔ `sustituciones[]`; agrupados §20.3.

### Commit
Preferir **un commit por URL** (`feat(audits): …`). Lote solo si el usuario lo pide explícitamente.

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
| A8 | La página es `sitioweb` informativa (A8 solo aplica a trámites) | Noticia o página institucional de `www.inapi.cl` |
| B8 | No hay texto principal medible (página vacía / solo UI sin cuerpo) | Pantalla de error mínima |
| C6 | El texto tiene menos de 4 párrafos continuos en la página | Home con secciones tipo tarjeta corta |
| C7 | No hay listas de requisitos en la página | Páginas de portal/home sin listados de pasos |
| C9 | No hay cuerpo editorial con párrafos (solo formulario/estado) | Wizard de trámite sin texto introductorio |
| D3 | El espaciado entre párrafos es criterio CSS/visual — declarar fuera del alcance editorial en esta auditoría | Aplica a casi todas las páginas |
| D4 | La alineación del texto es criterio CSS/visual — fuera del alcance editorial | Aplica a casi todas las páginas |
| D6 | No hay texto corrido extenso que requiera destacar palabras clave con negritas | Páginas tipo portal con titulares cortos |
| G2 | La página es interna o transaccional sin exposición pública de política de privacidad | Pantallas de tramitación post-login |
| H1 | No hay versiones anteriores publicadas ni rótulos de contenido archivado | La mayoría de URLs del inventario |

**Regla de oro:** `no_aplica` = el criterio no puede evaluarse porque el supuesto del criterio no existe en la página. No usar `no_aplica` para evitar marcar un incumplimiento evidente.

**Regla de `no_aplica` con propuesta excepcional:** si el criterio no aplica por la estructura actual pero TI podría incorporarlo en una mejora futura (ej. C6 — la página hoy tiene 3 párrafos, pero al ampliar contenido necesitará resumen inicial), documentar la recomendación en `comentario`. No crear fila en `sustituciones[]` salvo que esté acordado explícitamente con Equipo UX.

---

## 17. Arquitectura de sub-subagentes por grupo de secciones

*Aplica desde Fase 3 (flujo completo automatizado). Requiere Playwright MCP + RAG MCP activos.*

### Motivación

Evaluar los 47 criterios en una sola pasada puede sacrificar profundidad en secciones complejas (B/C lingüística, F/G compliance). Esta arquitectura delega cada grupo de secciones a un sub-subagente especializado, garantizando análisis robusto y consistente.

### 5 grupos temáticos

| Grupo | Secciones | Criterios | Foco |
| --- | --- | --- | --- |
| **1 — Estructura y Objetividad** | A + E | A1–A9, E1–E4 | Organización, completitud (A6–A8), escaneabilidad (A9), fechas, títulos |
| **2 — Lenguaje y Redacción** | B + C | B1–B8, C1–C9 | Voz activa, tuteo, siglas, legibilidad B8, FAQ (C8), conteo párrafos (C9) |
| **3 — Mecánica** | D | D1–D7 | Ortografía, puntuación, formato visual, mayúsculas sostenidas |
| **4 — Enlaces** | F | F1–F6 | CTAs, PDFs con descripción (F4), enlaces relacionados (F6) |
| **5 — Datos y Archivo** | G + H | G1–G3, H1 | Datos personales, derechos ARCO, versiones archivadas |

### Flujo completo (por URL)

```
Agente raíz (Claude Code — orquestador)
│
├── [1] Playwright MCP (una vez): navigate → HTML → a11y → evaluate estilos si hace falta
│       → inventario capas R + U (texto_capturado compartido)
├── [1b] RAG MCP: consultas A/B puntuales (fundamento + precedentes de la URL)
│
├── [2–6] Cinco sub-subagentes EN PARALELO (cada uno SOLO su grupo)
│       + skill de sección + gate evidencia §20.6 / §21
│
├── [7] Agente raíz consolida:
│       - 47 criterios orden A1…H1; cruces §20.3; patron_sistema §20.2
│       - resumen con summarizeEvaluations; resumen_ejecutivo / nota_final_tic §20.5
│       - JSON canónico + cable launch si aplica
│
└── [8] bun run validate:claude-audits → commit atómico de esta URL
```

### Reglas de consolidación (agente raíz — paso 7)

- **Captura UNA SOLA VEZ** (Playwright); inventario R+U compartido. No re-navegar por grupo.
- **Sin superposición de criterios:** un criterio → un grupo. E4 = Grupo 1; D1 = Grupo 3. METADATA fuera de alcance.
- **`sustituciones[]`:** unir; si mismo `linea` y conflicto, retención por severidad + nota en `nota_final_tic`.
- **Completitud:** 47 filas; cobertura 1:1 `incumple` ↔ sustituciones (salvo agrupados §20.3 documentados).
- **Legibilidad §22:** reescribir filas con `propuesto` vago o `ubicacion_pantalla` solo técnica antes de validar.
- **No consolidar** hasta que los 5 grupos entreguen output.

### Instrucción de contexto para cada sub-subagente

Al lanzar cada sub-subagente, incluir siempre:
1. Inventario R+U completo (`T001…`).
2. URL, `tipo_pagina`, `fecha`.
3. `captura_con_sesion: true|false` — si `true`, §19 (Grupo 5 crítico en G1–G3).
4. Secciones a evaluar (ej. «SOLO A1–A9 y E1–E4»).
5. «Entrega SOLO criterios de tu sección + `sustituciones[]`. No calcules el % total.»
6. Calibración §2, §19, §20, §21: **prohibido `cumple` por omisión**; cada estado con evidencia o `comentario` en `no_aplica`.
7. Énfasis Grupo 1: A9, E3, E4=H1. Grupo 3: D3/D4 con estilo si dudoso. Grupo 4: F4 completo (4 elementos).
8. **Entrega humana §22:** `ubicacion_pantalla` / `propuesto` / `motivo` / `comentario` legibles para editor CMS; cada criterio responde la pregunta del instrumento; `propuesto` pegable o instrucción concreta.

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
| Profundidad en B/C (lingüística) | Media — comparte contexto con 47 criterios | Alta — el agente se concentra solo en su grupo |
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
| **B1–B8, C1–C9** | Claridad de etiquetas de campo, ayudas contextuales, instrucciones de pasos — citar la **etiqueta**, no el valor del input |
| **F1–F6** | CTAs, PDFs descriptivos y enlaces relacionados del flujo de trámite |
| **A1–A9, D, E** | Estructura, completitud/autonomía (A6–A8), escaneabilidad, títulos, fechas, ortografía de copy **institucional** |

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

---

## 20. Calibración META MEI v2.1 — puntaje, VISIBLE, patrones y cruces

*Aplica a reauditorías de las 10 URLs META MEI y a auditorías nuevas con `version_checklist: "2.1"`.*

### 20.1 Solo contenido visible (impacto en %)

| Evidencia | ¿Descuenta %? | Entrega |
| --- | --- | --- |
| Texto/UI visible o modal abrible con un clic (incl. **H1**) | Sí (`incumple`) | Sustitución + `ubicacion_pantalla`; **siempre** en tabla UI/PDF/Excel (47 filas) |
| `<title>`, `<meta>`, OG, keywords | No | `no_aplica` en vista de entrega (con marca); la fila del criterio **sigue visible** |
| Nodo en DOM oculto / off-screen / no disparado | No | Nota TI sin `incumple` |
| Snippet de índice no mostrado en esa URL | No | Nota TI / CMS |

En comentarios de criterios visibles, no escribir literales `<title>`/`<meta>` al negar su uso (falso positivo del filtro). Preferir: «no se usó el título de pestaña ni metadatos del head».

### 20.2 Patrones de Layout (shell)

Hallazgos de header, footer, modal de contacto/login, buscador global:

- **Sí descuentan** en cada URL (el ciudadano los ve ahí).
- Marcar `patron_sistema: true` en la sustitución.
- En `motivo` / `comentario`: «Patrón de sitio: corregir en el origen (Layout / modal compartido); al publicar se corrige en todas las URLs.»

### 20.3 Criterios cruzados (mismo texto propuesto)

Si C1/C3/C4 (o B8/C3, etc.) apuntan al **mismo** `original`/`propuesto`:

1. Una sola fila en `sustituciones[]` con `criterio_id` = **primario** y `criterios_relacionados: [...]`.
2. Prioridad sugerida de primario: C7 > C4 > C3 > C1 > B8 (ajustar con Equipo UX si hace falta).
3. Primario → `incumple` (descuenta).
4. Secundarios → `incumple` + `agrupado_en: "<primario>"` (mostrar justificación; **no** descuentan en `summarizeEvaluations`).
5. En UI/PDF/Excel: mostrar «C1, C3, C4» y las justificaciones juntas.

### 20.4 Justificación obligatoria en `no_aplica`

Los **47** criterios aparecen siempre en pantalla, PDF y Excel.

- `no_aplica` **debe** llevar `comentario` breve (por qué no aplica en esta URL).
- Auditorías históricas sin comentario muestran «Sin justificación registrada» hasta reauditar.

### 20.5 Lenguaje de resumen y nota TI

`resumen_ejecutivo` y `nota_final_tic` deben redactarse en **lenguaje claro** (párrafos cortos, sin jerga de orquestación ni códigos HTML innecesarios). La UI/PDF además formatean párrafos para lectura.

### 20.6 Gate de evidencia y hallazgos distintos

Cada criterio es una **pregunta del instrumento**. Antes de emitir estado:

| Estado | Exigencia mínima |
| --- | --- |
| `cumple` | Evidencia positiva (Tnnn, atributo, estilo, o ausencia documentada de problema). **Prohibido** «parece bien» / omisión. |
| `incumple` | Evidencia concreta + fila en `sustituciones[]` con `ubicacion_pantalla` (sitioweb) y `capa: "VISIBLE"`. |
| `no_aplica` | `comentario` breve obligatorio (§20.4). |

**Hallazgos distintos:** preferir que cada `incumple` aporte un descubrimiento distinto (nodo, atributo o problema). Si varios criterios chocan con el **mismo** nodo/texto → solo entonces §20.3 (primario + `agrupado_en`). No reutilizar el mismo `propuesto` genérico en filas independientes sin agrupación.

**Criterios de formato / chrome (no solo redacción):** A9, D3, D4, E3, F4 — inventariar capa **U** y, si hace falta, Playwright `evaluate` / a11y (ver §21). No marcar D3/D4 como `no_aplica` por defecto «es CSS».

---

## 21. Playbook por criterio crítico (herramientas)

*Complementa §8 y §17. Usar en reauditorías 1-URL (`audit-una-url.md`).*

| Criterio | Evidencia preferida | Herramienta |
| --- | --- | --- |
| **A9** | Encabezados, listas, negritas / muro de texto | Inventario U + a11y (roles heading/list) |
| **D3** | Márgenes/padding entre bloques de cuerpo | `getComputedStyle` en párrafos principales |
| **D4** | `text-align` left vs center/justify en cuerpo | `getComputedStyle` en contenedor de texto |
| **E3** | Fecha de publicación o última modificación **visible** | Inventario U; ©año footer ≠ fecha |
| **E4** | H1 visible vs contenido | Inventario R; nunca `<title>` |
| **F4** | Título + formato + peso + descripción en cada doc | DOM enlaces; no inventar MB |
| **H1** | `alt` / archivo / versiones | a11y names + DOM |

Claude Code orquesta; Playwright captura y mide; Chroma fundamenta y trae precedentes; el skill fija el juicio editorial.

---

## 22. Entrega legible para quien implementa (editor CMS / TIC no IA)

*Obligatorio en reauditorías 1-URL y en cualquier JSON nuevo v2.1. Complementa §17, §20.5 y `audit-una-url.md`.*

### 22.1 Audiencia

Quien lee `ubicacion_pantalla`, `propuesto`, `motivo`, `comentario`, `resumen_ejecutivo` y `nota_final_tic` **no** es el orquestador: es una persona que corrige textos en Sitefinity / CMS o en el layout compartido. Escribir para esa persona.

**Prohibido en esos campos:** jerga de orquestación («sub-subagente», «§17», «capa R/U», «gate §20.6», «Chroma»), literales de código innecesarios (`getComputedStyle`, selectores CSS), y ubicaciones solo técnicas (`T042`, `HTML-L512`) sin descripción humana.

### 22.2 Cada criterio = pregunta del instrumento

Antes de fijar el estado, el subagente debe poder responder en una frase la **pregunta** del criterio (`criterion` / `verification` en `data/checklist-criteria.json`, alineada al Checklist Editorial PTD / IEW–IESD–RLC).

| Estado | Qué debe quedar claro en `comentario` (o en `motivo` de la sustitución) |
| --- | --- |
| `cumple` | Qué se vio que demuestra el sí (ej. «Hay H1 visible “Marcas” alineado al contenido»). |
| `incumple` | Qué falla respecto a la pregunta + qué hay que cambiar. |
| `no_aplica` | Por qué la pregunta no tiene sentido en esta URL (ya exigido en §20.4). |

La fila en `sustituciones[]` **no reemplaza** la respuesta a la pregunta: la traduce a una acción editable.

### 22.3 Plantilla obligatoria de cada fila en `sustituciones[]`

| Campo | Regla |
| --- | --- |
| `ubicacion_pantalla` | Ruta humana: zona → bloque → elemento. Ej.: «Menú superior › Patentes › ítem PCT»; «Pie de página › bloque de contacto»; «Cuerpo › primer párrafo bajo el H1». **Nunca** solo `Tnnn` o solo línea HTML. |
| `original` | Cita corta del texto **visible** a corregir (o descripción de ausencia: «(sin fecha de actualización visible)»). |
| `propuesto` | Texto **listo para pegar** en el CMS, o instrucción inequívoca («Añadir bajo el título: “Actualizado: DD de mes de AAAA”»). Sin meta-comentarios («debería mejorarse la claridad»). |
| `motivo` | 1–3 frases: (1) respuesta a la pregunta del criterio, (2) por qué el original no cumple, (3) si es patrón de sitio (`patron_sistema: true`), decir «corregir una vez en el layout / componente compartido». |
| `linea` / `html_linea_aprox` | Secundarios para TIC; no sustituyen a `ubicacion_pantalla`. |

### 22.4 Ejemplos (malo → bueno)

**Ubicación**

- Malo: `T015` / `HTML-L420` / `nav.navbar > li:nth-child(3)`
- Bueno: `Menú superior › grupo Patentes › enlace «PCT»`

**Propuesto**

- Malo: `Mejorar la redacción con lenguaje claro y voz activa.`
- Bueno: `Protege tu marca en Chile: revisa si ya existe y presenta la solicitud en línea.`

**Motivo**

- Malo: `Incumple B1 según skill; evidencia capa R.`
- Bueno: `La pregunta pide voz activa y mensaje entendible. El texto actual usa voz pasiva y no dice qué puede hacer la persona. El propuesto dice la acción en presente.`

### 22.5 Instrucción extra al lanzar cada sub-subagente (§17)

Añadir siempre al brief del grupo:

> «Redacta `ubicacion_pantalla`, `propuesto`, `motivo` y `comentario` para un editor CMS (CLAUDE.md §22). Cada criterio debe responder la pregunta del instrumento con evidencia. `propuesto` = texto pegable o instrucción concreta; ubicación = ruta en pantalla, no solo Tnnn.»

### 22.6 Consolidación (agente raíz)

Antes de `validate:claude-audits`, revisar una muestra de sustituciones: si `propuesto` es vago o `ubicacion_pantalla` es solo técnica, **reescribir** esas filas. `resumen_ejecutivo` / `nota_final_tic` siguen §20.5 + §22.1.

### 22.7 Relación con Checklist Editorial PTD (v2.0)

El documento *Checklist Editorial INAPI v2.0* (local en `documentos/`, no versionado) organiza hitos PTD de **Lenguaje claro**, **Usabilidad** y **Seguridad**. El motor §17 y `checklist-criteria.json` v2.1 cubren la dimensión **Contenido y Lenguaje claro** (47 criterios A–H). Usabilidad y Seguridad quedan **fuera** de la evaluación automática actual; ver mapa en `docs/checklist-ptd-v2-mapa.md`.