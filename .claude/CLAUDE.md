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

---

## 11. Workflow — Captura HTML con Playwright MCP

*Aplica desde Fase 1. En Fase 0 usar Ctrl+U manual o HTML adjunto en prompt.*

1. Verificar que el servidor Playwright MCP está activo (`claude mcp list`).
2. Llamar `playwright_navigate` con la URL objetivo.
3. Esperar carga completa — usar `networkidle` o pausa de 2 s tras `DOMContentLoaded`.
4. Llamar `playwright_get_content` → obtener HTML del DOM renderizado (no Ctrl+U).
5. Guardar en `auditorias/htmls/{slug-url}_{YYYY-MM-DD}.html` (crear carpeta si no existe).
6. **Nunca** subir HTMLs al repo — `auditorias/htmls/` está en `.gitignore`.
7. Si la URL requiere autenticación (ej. `tramites.inapi.cl/Account/Login`), capturar solo la pantalla pre-login salvo que existan credenciales de sesión configuradas en `.env.local`.

**Diferencia DOM renderizado vs Ctrl+U:** en URLs Trámites el JS inyectado desde BE modifica el DOM; la línea 1000 de Ctrl+U puede no coincidir con el código fuente TI. Usar siempre DOM como fuente de verdad editorial y `fragmento_busqueda` como ancla para TI (ver `docs/stack-orquestación.md` §3).

---

## 12. Workflow — Auditoría completa de una URL

*Flujo de referencia. Ver prompts detallados en `docs/flujo-piloto-10-urls-claude-mvp.md` §3.1–§3.2.*

### Paso 1 — Preparación
- Identificar URL objetivo y `tipo_pagina` (`sitioweb` | `tramites`).
- Obtener HTML (Playwright MCP §11, o Ctrl+U si Fase 0).
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

### Paso 4 — Validación y guardado
```bash
# Guardar el JSON en la ruta correcta
# Piloto:   data/claude-audits/{id}.json
# Clarity:  data/claude-audits/urls-clarity/{id}.json

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

---

## 17. Seguridad y datos sensibles

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

- RUT/RUN, nombres, correos o teléfonos de personas naturales.
- Solicitudes de marca o expedientes de tramitación.
- Resultados del buscador de anterioridades de marcas.
- Credenciales, tokens de sesión, claves API o secretos de cualquier tipo.
- Si aparecen datos personales en HTML capturado → registrar como incumplimiento G1 pero **no almacenar** el fragmento en el RAG.

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
- [ ] Los JSONs canónicos no contienen datos personales reales (solo `evaluador_uid` del auditor).
- [ ] `rag/chroma_db/` y `documentos/` no aparecen en el staging area.
- [ ] `bun run validate:claude-audits` pasa sin errores.
- [ ] `bun run typecheck:all` pasa sin errores.