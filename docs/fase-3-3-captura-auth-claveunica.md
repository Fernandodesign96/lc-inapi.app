# Fase 3.3 — Captura autenticada (ClaveÚnica) y calibración de datos de sesión

**Última actualización:** 2026-07-23  
**Rama de trabajo:** `feat/audit-remaining-urls`  
**Entorno objetivo:** PC casa — WSL2 + Chroma + Playwright + Claude Code Pro

---

## 1. Objetivo

Completar auditorías LC sobre pantallas de `tramites.inapi.cl` que **solo son visibles tras iniciar sesión** (ClaveÚnica o Clave INAPI), sin tratar los datos personales del solicitante autenticado como incumplimientos editoriales graves.

Esta fase **no sustituye** la Fase 3 (flujo end-to-end validado en jul-2026). La extiende con:

1. Captura HTML con **sesión reutilizable** (`storageState` de Playwright).
2. Calibración de criterios **G1–G3** y reglas de redacción en JSON para **pantallas post-login**.
3. Separación explícita entre URLs **auditables con sesión** y URLs **pendientes de coordinación TI**.

---

## 2. Qué hace cada componente (Chroma no navega URLs)

| Componente | Rol | ¿Necesita login INAPI? |
| --- | --- | --- |
| **Playwright** (MCP o script local) | Navega la URL y extrae el DOM renderizado | **Sí** — mediante `storageState` tras login manual |
| **Chroma / RAG MCP** | Consulta normativa (Colección A) y precedentes del repo (Colección B) | **No** — no accede a internet ni a tramites.inapi.cl |
| **Claude Code** | Orquesta captura → RAG → sub-subagentes → JSON canónico | No directamente; usa los MCP anteriores |
| **`validate:claude-audits`** | Valida contrato Zod del JSON | No |

Flujo:

```
Login manual (una vez) → storageState en auditorias/.auth/
        ↓
Script o Playwright MCP → HTML en auditorias/htmls/
        ↓
Claude Code + RAG MCP (Chroma :8000) → 39 criterios con calibración §19 CLAUDE.md
        ↓
JSON en data/claude-audits/tramites/{fecha}/ → validate → commit
```

---

## 3. Inventario Clarity — estado jul-2026

| Categoría | Ranks | Acción |
| --- | --- | --- |
| **Auditadas** (JSON en repo) | 1–7, 9–10, 12, 14, 16–17 | Mantener; opcional re-captura Playwright con sesión para DOM actualizado |
| **Auditables con sesión** (Fase 3.3) | 5–7 (re-auditoría DOM), futuras pantallas post-login accesibles por URL directa | WSL + `storageState` + flujo §12–§19 de `CLAUDE.md` |
| **Pendiente TI / sin acceso** | **8**, **11**, **13**, **15** | No forzar auditoría; estado `Pendiente TI` en fichas mock; discusión con Octavio / equipo técnico |

### Motivo de bloqueo (ranks pendientes TI)

| Rank | URL | Bloqueo |
| --- | --- | --- |
| 8 | `/Login/claveunica` | Redirección a ClaveÚnica externa; pantalla de onboarding no reproducible sin flujo institucional |
| 11 | `.../SuccessConfirmation` | Solo tras presentar escritos en trámite activo |
| 13 | `.../TrademarkApplication/Confirmation` | Modal de confirmación de pago al final del flujo |
| 15 | `.../TrademarkRenewalApplication` | Sin acceso operativo documentado (jul-2026); requiere coordinación TI |

---

## 4. Procedimiento WSL — sesión ClaveÚnica

### 4.1 Prerrequisitos

```bash
chroma run --path ./rag/chroma_db --port 8000 &   # terminal aparte
claude mcp list                                    # playwright + rag-auditoria Connected
bun x playwright install chromium                  # primera vez en WSL
```

### 4.2 Crear o renovar sesión (login manual, una vez)

```bash
bun x playwright codegen https://tramites.inapi.cl/Account/Login \
  --save-storage=auditorias/.auth/tramites-session.json
```

1. Completar login con **ClaveÚnica** (o Clave INAPI) en el navegador que se abre.
2. Verificar que llegas al portal autenticado.
3. Cerrar la ventana — Playwright guarda cookies en `auditorias/.auth/tramites-session.json`.

**Seguridad:** ese archivo contiene cookies de sesión activa. Está en `.gitignore`. No commitear ni compartir.

### 4.3 Capturar HTML de una URL protegida

```bash
bun run capture:tramites-html -- \
  --url "https://tramites.inapi.cl/Trademark/TrademarkSavedApplications" \
  --slug "tramites-inapi-cl-trademark-trademarksavedapplications" \
  --date "2026-07-23"
```

Salida: `auditorias/htmls/{slug}_{date}.html`

Si el MCP de Playwright no acepta `storageState`, usar **siempre** este script para URLs post-login y pasar el HTML guardado a Claude Code.

### 4.4 Auditar con Claude Code

1. Cargar skills `auditoria-lc.md` y `pesquisa-criterios.md`.
2. Indicar explícitamente: `captura_con_sesion: true` (ver `CLAUDE.md` §19).
3. Ejecutar arquitectura de sub-subagentes (§17) o plantilla `.claude/prompts/audit-lote.md`.
4. Guardar JSON en `data/claude-audits/tramites/{YYYY-MM-DD}/{id}.json`.
5. `bun run validate:claude-audits`.

### 4.5 Tras cada lote

```bash
bun run rag/ingest-b.ts    # reindexar precedentes si hay JSON nuevos
```

---

## 5. Calibración — datos personales en pantallas autenticadas

Cuando el HTML incluye **datos del usuario logueado** (RUT, nombre, correo, nombre de marca en trámite, etc.):

| Regla | Detalle |
| --- | --- |
| **No es incumplimiento G1** | La presencia de datos del solicitante en campos de formulario o resúmenes de trámite es **esperada** en pantallas post-login |
| **Sí evaluar G1** | Datos de **otras personas** en HTML estático público, o exposición indebida fuera del contexto del formulario |
| **Evaluar claridad** | Etiquetas, ayudas, orden de campos, instrucciones (B, C, F) — sin citar valores reales |
| **Anonimizar salidas** | En `cita_textual`, `original`, `propuesto` y `texto_capturado` del JSON: usar placeholders (`[RUT del solicitante]`, `[nombre de marca en trámite]`) |
| **No ingestar al RAG** | HTML con sesión activa no se ingesta en Colección B; solo JSON anonimizado validado |

Referencia normativa completa: `.claude/CLAUDE.md` §19 y `.claude/skills/auditoria-lc.md` § «Pantallas con sesión autenticada».

---

## 6. Qué se puede hacer hoy en PC empresa (sin WSL / sin Chroma)

| Tarea | ¿Posible? |
| --- | --- |
| Documentación, calibraciones en skills y `CLAUDE.md` | ✅ |
| Actualizar fichas mock (estado Pendiente TI) | ✅ |
| Commits, PRs, `typecheck:all`, validación JSON existentes | ✅ |
| Playwright MCP en URLs **públicas** (sin Chroma) | ✅ parcial |
| Captura con ClaveÚnica + auditoría RAG completa | ❌ — requiere WSL + Chroma |
| Script `capture:tramites-html` con sesión real | ❌ — ejecutar en WSL |

---

## 7. Coordinación TI (ranks 8, 11, 13, 15)

Solicitar a TI INAPI (cuando corresponda):

- Cuenta o entorno de **pruebas** con trámites en estados conocidos (confirmación, pago, renovación).
- Política sobre **almacenamiento local** de `storageState` en equipos de auditoría.
- Captura asistida de HTML para pantallas de flujo no reproducibles sin trámite real.

Hasta entonces: mantener ranks en **Pendiente TI** sin JSON forzado en el MVP.

---

## 8. Referencias

| Documento | Contenido |
| --- | --- |
| [`.claude/CLAUDE.md`](../.claude/CLAUDE.md) §11, §19 | Workflow captura auth y calibración sesión |
| [`.claude/prompts/audit-lote.md`](../.claude/prompts/audit-lote.md) | Plantilla de lote actualizada |
| [`docs/ROADMAP.md`](ROADMAP.md) | Fases 2–3 completadas; Fase 3.3 pendiente implementación |
| [`docs/SECURITY.md`](SECURITY.md) §3 | `storageState`, anonimización, RAG |
| [`src/scripts/capture-tramites-html.ts`](../src/scripts/capture-tramites-html.ts) | Script de captura con sesión |
