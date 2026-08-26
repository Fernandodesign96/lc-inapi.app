# CLAUDE.md — Contexto permanente del proyecto lc-inapi-app

Eres el asistente técnico del proyecto **lc-inapi-app**: aplicativo de auditoría editorial con IA para INAPI (Instituto Nacional de Propiedad Industrial, Chile).

## Qué es este documento

Constitución operativa de Claude Code en este repo: dominio, checklist **51** `LC-*`, **reglas permanentes**, workflows, arquitectura de **análisis textual ascendente (§17.1bis)** + **subagentes (15 indicadores)** + **sub-subagentes (5 de entrega)**, sesión autenticada, calibración y entrega CMS/META MEI.

## Para qué se utiliza

Cargarlo al inicio de cada sesión de auditoría/orquestación. Define *qué está permitido*, *cómo se puntúa* y *cómo se habla con prompts, skills, RAG y frontend*.

## Objetivo

Que toda auditoría nueva sea v3.0 (solo `LC-*`), con estados cerrados, severidad→etiquetas UI, propuestas CMS-first y 1 URL por sesión.

## Importancia en la orquestación Claude Code

Sin este archivo no hay contrato compartido. Los prompts ejecutan; las skills especializan; **este archivo regula**. Las «Reglas» son §5 y calibraciones §16–§23 (no hay carpeta `/rules`). **Subagentes** y **sub-subagentes** se definen en **§17**.

## Mapa de cableado `.claude/` (conversan entre sí)

| Pieza | Rol |
| --- | --- |
| **Este `CLAUDE.md`** | Reglas §5 · **§17** · Workflows §12–§14 · §19–§23 |
| `prompts/01-orquestacion-stack.md` | Playwright, Chroma, Xenova, LangChain, ingest A/B |
| `prompts/02-criterios-hitos-correcciones.md` | 51 criterios, hitos/tareas, severidad, captura |
| `prompts/03-entrega-resultados.md` | Textos CMS, validación, UI/PDF/Excel |
| `prompts/04-cableado-claude-md.md` | Cómo leer este archivo y cablear el grafo |
| `prompts/05-audit-maestro-url.md` | **Maestro** (1 URL = Pasos A–F; también cola META MEI y muestra oro) |
| `prompts/06-calibracion-hallazgos.md` | Calibración persistente (leer siempre) |
| `prompts/07-analisis-texto-ascendente.md` | Análisis palabra→párrafo (Paso D0) |
| `skills/01-documentos-rag-ingest.md` | Documentos, RAG, ingestas |
| `skills/02-lenguaje-entrega-cms.md` | Lenguaje no técnico |
| `skills/03-instrucciones-subagentes-instrumentos.md` | 15 subagentes por indicador |
| `skills/04-xenova-langchain-rendimiento.md` | Vectores y chunks |
| `skills/05-calibracion-persistente.md` | Aplicar Prompt 6 en todas las URLs |
| `skills/06-analisis-texto-ascendente.md` | Instrucciones al subagente §17.1bis |
| `diagrams/workflow_diagram.md` | Diagrama del workflow |
| **Frontend / MEI** | Consumen JSON (`/auditar`, Excel, PDF) |

**Prompts y skills antiguos** (`audit-una-url` / `audit-lote` / `audit-oro-s22`, `auditoria-lc` / `auditoria-calidad-web` / `pesquisa-criterios`) fueron **retirados**: usar solo `prompts/01`…`07` y `skills/01`…`06`.

Flujo mental: **Prompt 5 → CLAUDE.md + Prompt 6 → skills → §17.1bis (texto ascendente) → 15 subagentes (orden) → 5 sub-subagentes (entrega) → JSON → UI/PDF/Excel**.

Carga este archivo al inicio de cada sesión. Skills en `.claude/skills/`. Diagrama: `.claude/diagrams/workflow_diagram.md`.

---

## 1. Dominio del proyecto

- **Qué hace:** automatiza la auditoría de **Lenguaje claro** del Checklist Editorial INAPI PTD v2.0 / catálogo máquina **v3.0** — **51 preguntas únicas** (criterios) agrupadas en **15 indicadores IEW** (sitios web) y **13 indicadores IESD** (servicios digitales), sobre URLs de `inapi.cl` y `tramites.inapi.cl`. Fuentes: `docs/Checklist_Editorial_INAPI_v2_0_actualizado.docx`, `data/checklist-criteria-lc-ptd.json`, `data/checklist-editorial-ptd-v2.json` (§23). Usabilidad (18) y Seguridad (10) catalogadas para después del Excel LC.
- **Resultado de cada auditoría:** un JSON canónico con 7 secciones (ver §4) que alimenta el frontend en `/auditar/resultado` y genera un informe PDF institucional.
- **Estado actual (ago 2026):** Fases 0–3 en WSL (Playwright + RAG + **§17.1bis + 15 subagentes + 5 sub-subagentes**). Nomenclatura vigente = `LC-*`. Fase 3.3: captura autenticada (`docs/fase-3-3-captura-auth-claveunica.md`).

---

## 2. Checklist PTD-LC v3.0 — 51 criterios por indicadores

**Fuente de verdad (auditorías nuevas):** `data/checklist-criteria-lc-ptd.json` · `version_checklist: "3.0"` · exactamente **51** filas en `criterios_evaluados[]`.

**Nomenclatura:** `{Indicador} {código IEW/IESD} — Criterio: {pregunta del instrumento}`.  
**ID máquina:** `LC-{código}-{nn}` (ej. `LC-1.1.1-01`). En `sustituciones[].criterio_id` y en la UI/Excel usar el **id** + el `display_label` del catálogo.

**Obligatorio:** ejecutar siempre las **51** preguntas únicas aplicables a la URL (no inventar un 52.º; no omitir exclusivas del instrumento). Conteos: **39** ambos · **10** solo IEW · **2** solo IESD (el listado UX «8 solo IEW» agrupa sensibles×3 como un tema). `LC-5.2.4-01` (rótulos/CTA) cuenta en **ambos**.

JSON históricos `version_checklist: "2.1"` (47 A–H) y `"1.1"` (39) siguen válidos en validación; **no** emitir A1–H1 en auditorías nuevas.

### 2.1 Instrumento sitios web (IEW §1) — 15 indicadores

| Indicador | Código | Nivel | Criterios (IDs) |
| --- | --- | --- | --- |
| Fiabilidad | 1.1.1 | Imprescindible | LC-1.1.1-01 |
| Completitud | 1.1.2 | Imprescindible | LC-1.1.2-01 … 04 |
| Lenguaje plano | 1.1.3 | Imprescindible | LC-1.1.3-01 … 06 |
| Actualización | 1.1.4 | Imprescindible | LC-1.1.4-01 |
| Redacción y ortografía | 1.1.5 | Imprescindible | LC-1.1.5-01 … 03 (03 solo IEW) |
| Propiedad intelectual | 1.1.6 | Imprescindible | LC-1.1.6-01 … 02 (02 solo IEW) |
| Privacidad y datos personales | 1.1.7 | Imprescindible | LC-1.1.7-01 … 03 (01–02 solo IEW) |
| Contenidos sensibles | 1.1.8 | Imprescindible | LC-1.1.8-01 … 03 (solo IEW) |
| Claridad | 1.2.1 | Esperable | LC-1.2.1-01 … 05 |
| Concisión | 1.2.2 | Esperable | LC-1.2.2-01 … 05 |
| Legibilidad | 1.2.3 | Esperable | LC-1.2.3-01 … 03 |
| Escritura para la web | 1.2.4 | Esperable | LC-1.2.4-01 … 08 (06 solo IEW) |
| Visualización de la información | 1.3.1 | Deseable | LC-1.3.1-01 (solo IEW) |
| Objetividad | 1.3.2 | Deseable | LC-1.3.2-01 … 02 (02 solo IEW) |
| Archivo | 1.3.3 | Deseable | LC-1.3.3-01 |

### 2.2 Instrumento servicios digitales (IESD §5) — 13 indicadores

| Indicador | Código | Nivel | Notas |
| --- | --- | --- | --- |
| Fiabilidad | 5.1.1 | Imprescindible | Mismo criterio que 1.1.1 |
| Completitud | 5.1.2 | Imprescindible | Mismos que 1.1.2 |
| Lenguaje plano | 5.1.3 | Imprescindible | Mismos que 1.1.3 |
| Actualización | 5.1.4 | Imprescindible | Mismo que 1.1.4 |
| Redacción y ortografía | 5.1.5 | Imprescindible | Sin pregunta de conectores |
| Propiedad intelectual | 5.1.6 | Imprescindible | Sin anti-redifusión |
| Privacidad y datos personales | 5.1.7 | Imprescindible | Solo ARCO (sin RUN/teléfonos) |
| Claridad | 5.2.1 | Esperable | + variante `LC-5.2.1-01` (servicio digital) |
| Concisión | 5.2.2 | Esperable | + variante `LC-5.2.2-01` (inicio+trámite) |
| Legibilidad | 5.2.3 | Esperable | Mismos que 1.2.3 |
| Escritura para la web | 5.2.4 | Esperable | + rótulos `LC-5.2.4-01` (**ambos** sitioweb/trámites, C-2026-08-25c); sin enlaces relacionados |
| Objetividad | 5.3.1 | Deseable | Sin el 80 % hechos |
| Archivo | 5.3.2 | Deseable | Mismo que 1.3.3 |

*No hay indicador IESD equivalente a Contenidos sensibles (1.1.8) ni Visualización (1.3.1).*

### Umbrales de aceptación

| % cumplimiento (sobre criterios aplicables) | Estado |
| --- | --- |
| ≤ 80 % | `rechazado` |
| 81 – 90 % | `aceptado_con_observaciones` |
| ≥ 91 % | `aprobado` |

### Calibraciones acordadas con UX (ids v3.0)

- **LC-1.1.7-01 / RUN:** RUT de **persona jurídica pública** (ej. `65.999.669-3` de INAPI en footer) → `cumple`. RUN de persona natural en **HTML estático público** → `incumple`, `severidad: alta`.
- **Sesión autenticada (`captura_con_sesion: true`):** datos del solicitante logueado en formularios **no** son incumplimiento de privacidad — son esperables. Evaluar etiquetas, ayudas y claridad del trámite. Ver §19.
- **LC-1.2.4-05 — mayúsculas:** ítems `ACCESOS` y `BUSCADOR` de la cabecera global de `www.inapi.cl` quedan **excluidos** (plantilla). Aplicar en el resto y en `tramites.inapi.cl`.
- **LC-1.1.4-01 — fecha:** si no hay fecha visible, `(ausencia)` en `cita_textual` y proponer línea visible. **Nunca** sustituir por `©año` del footer. **Ausencia total → `severidad: alta` (No cumple)** (C-2026-08-25f); no usar `media`.
- **LC-1.1.2-03 — datos clave:** aplica a páginas informativas/institucionales con cuerpo; **no** marcar `no_aplica` por «no es trámite» (eso es `LC-1.1.2-04` / criterio 13) — C-2026-08-25e. Si Texto = «No hay texto que cumpla…» → **`severidad: alta` (No cumple)** — C-2026-08-25g.
- **LC-1.3.1-01 — visualización / apoyos visuales:** responde **solo** «¿hay íconos, imágenes, gráficos o infografías para presentar datos?». Si la portada (u otra URL) ya muestra banners, tarjetas con foto, íconos de sección, gráficos → **`cumple`**, citando en `comentario` qué apoyos se vieron. **`incumple`** solo si faltan apoyos donde los datos lo requieren («faltan gráficos/íconos/imágenes…»). **Prohibido** incumplir este id por `alt` vacío, `alt` genérico, enlace solo-ícono o WCAG: eso **no** es la pregunta del instrumento; anotar en `nota_final_tic` (lenguaje CMS) si conviene, **sin** fila de `sustituciones[]` bajo `LC-1.3.1-01` y **sin** bajar el %. No marcar `incumple` porque Playwright “no encontró” un apoyo que sí es visible: reintentar captura o declarar duda, no inventar fallo.
- **Títulos, subtítulos, tooltips y jerga visible (LC-1.1.3-03 + LC-1.2.4-02):** el lenguaje plano y los «títulos claros» aplican al **rótulo que se escanea primero** (H1–H3, títulos de tarjeta/sección, ítems de menú, tooltips, textos de íconos), no solo a párrafos largos. Un término legal o técnico como único encabezado (**ej. «Observancia»**) **incumple** jerga / título claro aunque debajo haya un subtítulo explicativo: el subtítulo ayuda, pero quien solo lee el título sigue sin entender. Propuesta CMS: cambiar el título a lenguaje cotidiano **o** dejar el término + glosa breve en el mismo bloque de título (no solo en un párrafo lejano). Revisar también «Dominio Público», «Sistema de Madrid», «Sello de Origen», etc. en menú y secciones. Mismo nodo título → un primario (§20.3); no duplicar el mismo `propuesto` en filas independientes.
- **Texto + apoyos visuales (escaneo / pirámide, no “diseño UI”):** LC-1.2.4-01/03 evalúan si lo importante se ve primero y si se puede escanear (títulos + tarjetas + íconos que guían). **No** convertir el % LC en auditoría de arquitectura de información completa (peso tipográfico, grilla, jerarquía visual fina): eso es **Usabilidad** (§23); si hay desorden grave que impide entender el mensaje, anotar en `nota_final_tic` en lenguaje CMS y, si aplica, amarrar solo a escaneo/pirámide con evidencia de muro de texto o bloques sin encabezado.
- **LC-1.1.2-01 vs título visible:** fidelidad título↔contenido sobre el **H1 visible**, no `<title>`/`<meta>` (fuera de entrega).
- **LC-1.1.2-02 vs LC-1.1.2-04:** páginas vacías / «En construcción» vs suficiencia para autonomía en trámites (`applicability`).
- **LC-1.2.2-02 vs LC-1.2.2-01:** longitud por párrafo vs cantidad de párrafos del cuerpo.
- **LC-1.2.4-06 vs posición de enlace:** presencia de **enlaces relacionados** internos (no solo menú).
- **LC-1.1.3-01 (Legible):** documentar en `comentario` el resultado; sin medición → incumplir o justificar `no_aplica`.
- **Citas:** usar `IEW` / `IESD` / `RLC` / `MEI` del campo `source`. No inventar `CW`.

---

## 3. Rutas clave del repositorio

| Ruta | Descripción |
| --- | --- |
| `data/checklist-criteria-lc-ptd.json` | **Fuente vigente** — 51 criterios LC v3.0 (indicadores IEW/IESD) |
| `data/checklist-criteria.json` | Histórico v2.1 (47 A–H) — solo JSON ya emitidos |
| `docs/Checklist_Editorial_INAPI_v2_0_actualizado.docx` | Checklist editorial humano (hitos/tareas) — RAG |
| `docs/Checklist_Editorial_INAPI_v2_0_actualizado.extracted.md` | Texto extraído del Word para ingesta RAG |
| `data/checklist-editorial-ptd-v2.json` | Hitos PTD → tareas → preguntas + conteos |
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
| `docs/flujo-piloto-10-urls-claude-mvp.md` | Runbook META MEI / Clarity / Prompt 5 / fixture histórico |
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
    { "id": "LC-1.1.1-01", "estado": "cumple|incumple|no_aplica", "severidad": "baja|media|alta", "comentario": "...", "cita_textual": "..." }
  ],
  "resumen": { "total": 51, "cumple": 0, "incumple": 0, "no_aplica": 0, "porcentaje": 0.0 },
  "version_checklist": "3.0",
  "resumen_ejecutivo": "...",
  "observaciones_lc_por_severidad": {
    "alta": [],
    "media": [],
    "baja": []
  },
  "sustituciones": [
    { "linea": "T007", "html_linea_aprox": "HTML-L10", "ubicacion_pantalla": "Cuerpo › bajo el título principal › primer párrafo", "original": "...", "propuesto": "...", "criterio_id": "LC-1.1.2-01", "motivo": "..." }
  ],
  "nota_final_tic": "Instrucciones para TI al implementar las sustituciones..."
}
```

### Campos legacy (piloto jun 2026 — 9 URLs operativas)

Los JSONs del piloto en `data/claude-audits/` usan los nombres `criterios_evaluados` (array), `criterios_no_aplica`, `criterios_aplicables`, `criterios_aprobados`, `porcentaje_cumplimiento`, `estado_aceptacion`, `texto_propuesto`, `observaciones_lc`, `tipo_pagina` y `fecha_evaluacion`. Son válidos; no migrar sin ADR.

**Validación:** `bun run validate:claude-audits` — ejecuta automáticamente vía Hook al guardar.

---

## 5. Reglas permanentes

- **NUNCA inventar criterios** — solo los **51** de `data/checklist-criteria-lc-ptd.json` en auditorías nuevas. Históricos: 47 (v2.1) o 39 (v1.1).
- **Estado de criterio (JSON):** SOLO `"cumple"` | `"incumple"` | `"no_aplica"`. Sin otros valores ni `null`.
- **Presentación en UI/Excel (derivada, no es un cuarto estado JSON):** cuando `estado = "incumple"`, la clave `severidad` determina cómo se muestra al equipo:
  | `estado` | `severidad` | Etiqueta de presentación (MEI / UI) | Significado operativo |
  | --- | --- | --- | --- |
  | `cumple` | *(omitir)* | Cumple | Responde la pregunta del instrumento con evidencia positiva |
  | `incumple` | `baja` | **Cumple con observaciones** | Hay corrección menor; no bloquea publicación, pero **sí** exige fila en `sustituciones[]` |
  | `incumple` | `media` | **Medianamente cumple** | Hallazgo relevante; corregir en esta iteración; fila en `sustituciones[]` |
  | `incumple` | `alta` | **No cumple** | Bloqueante o grave; prioridad alta; fila en `sustituciones[]` |
  | `no_aplica` | *(omitir)* | No aplica | La pregunta no cabe en esta URL; `comentario` obligatorio |
- **`severidad`:** SOLO si `estado = "incumple"`. Valores: `"baja"` \| `"media"` \| `"alta"`. Omitir la clave en `cumple` y `no_aplica`. Nunca `null`.
- **Contar cada criterio UNA SOLA VEZ** por URL para el **%** (estado cumple/incumple/no_aplica), independientemente de cuántas ocurrencias de texto haya.
- **Cobertura 1:1 obligatoria:** cada `incumple` (incluidos «cumple con observaciones» y «medianamente cumple») → **al menos** una entrada en `sustituciones[]`. Si el mismo `LC-*` falla en **varios textos distintos** (4 títulos, cobertura + atajos, varias oraciones…), crear **una fila de sustitución por cada texto** localizable — no fusionarlas en una sola. UI / PDF / Excel muestran **todas** esas correcciones (mismo `criterio_id`, N filas de entrega). La propuesta debe ser **coherente y realista**: decir *dónde* mirar en pantalla (lenguaje CMS), *qué* pegar o configurar, y *por qué* — aunque la corrección implique HTML o layout. Si no hay texto original que reemplazar, usar tipo Inserción/Eliminación con instrucción clara para CMS o TI (ver §12).
- **Umbrales de aceptación de la URL:** ≤ 80 % → `rechazado` · 81–90,9 % → `aceptado_con_observaciones` · ≥ 91 % → `aprobado`.
- **LC-1.1.7-01 / RUN y datos personales:** RUT de persona jurídica pública (ej. INAPI en pie) = `cumple`. RUN o nombre de persona natural en HTML **público** estático = `incumple` + `severidad: "alta"`. En **sesión autenticada** (sección **§19** de este archivo — reglas para pantallas post-login): datos del solicitante en su formulario = esperados; evaluar claridad de etiquetas/ayudas, no la sola presencia del dato.
- **LC-1.1.4-01 / fecha:** ausencia de fecha de publicación o actualización **visible** = `incumple`. Nunca sustituir por `©año` del footer.
- **LC-1.1.5-01 vs LC-1.1.2-01:** ortografía/tildes/capitalización/texto de desarrollo visible = Redacción (`LC-1.1.5-*`). Fidelidad del **H1 visible** al contenido = Completitud (`LC-1.1.2-01`). **Prohibido** usar `<title>`/`<meta>` como evidencia.

### 5.1 Alcance de commits y calibraciones retroactivas (obligatorio)

*Evita menús «¿commitear / revertir / dejar?» y working trees sucios entre URLs META MEI.*

1. **Una URL = un alcance de escritura de auditoría.** Solo crear/actualizar el JSON de la URL en curso + su cableado (`claude-audits-launch.ts` / `mei-meta-mei-urls.ts`) + DEVLOG de esa URL. **Prohibido** editar JSON de otras URLs “de paso” durante la auditoría, salvo el punto 2.
2. **Calibración vigente ⇒ consistencia automática.** Si una entrada `estado: vigente` del Prompt 6 (o skill `05`) implica corregir URLs **ya auditadas** de la misma fecha/serie (p. ej. quitar `Tnnn` / `applicability` / encabezado Criterio—Instrumento de `comentario`; subir `severidad` a `alta` cuando Texto = ausencia total; reescribir `no_aplica` del criterio 15 en lenguaje ciudadano):
   - Aplícala de inmediato a esas URLs.
   - **No preguntes** si “fue autorizado”: Prompt 6 + skill `05` **ya autorizan** la consistencia en toda la muestra.
   - Commitea **en el mismo turno**, commits separados preferidos:
     - `fix(audits): consistencia calibración C-… en URLs ya cerradas`
     - `feat|fix(entrega): …` si tocaste capa de entrega / prompts / skills
     - `feat(audits): …` la URL nueva de este turno
   - **Nunca** dejes esos cambios como `modified` sin commit ni abras un menú de opciones al usuario.
3. **Capa de entrega** (`criterio-entrega-campos.ts`, `ubicacion-pantalla-cms.ts`, Prompt 6, skills): si la refuerzas por un hallazgo de esta URL, es parte del mismo turno. Correr tests + `bun run validate:claude-audits` antes del commit. **No** revertir calibraciones previas (p. ej. 25d…h) al editar `launch.ts`.
4. **Commit automático (sin preguntar)** para limpiezas que solo aplican calibración vigente: quitar `Tnnn` / `applicability` / IEW-IESD sueltos / encabezado Criterio N—Instrumento M de campos CMS; ausencia total → `severidad: alta`; criterio 15 en lenguaje ciudadano. Eso es **opción 1 siempre**.
5. **Solo pregunta al usuario** si el cambio es ambiguo o destructivo: bajar % reinterpretando un criterio **sin** calibración vigente; borrar `sustituciones[]` o voltear `cumple`↔`incumple` sin evidencia nueva de Playwright; `push --force` / `reset --hard`; tocar URLs fuera de la serie META MEI en curso.
6. **Working tree al cerrar la URL:** `git status` limpio (salvo `frontend/next-env.d.ts` autogenerado). Si status muestra JSON de otras URLs modificados → incluirlos en el commit de consistencia **antes** de decir «listo».

---

## 6. Patrones sistémicos conocidos (transversales a todas las URLs)

Verificar siempre antes de dar por terminada la auditoría. En `sustituciones[]` / `motivo` / `ubicacion_pantalla`: **priorizar lenguaje CMS** (dónde se ve en pantalla y qué debe cambiar el editor); la referencia técnica (`_Layout.cshtml`, línea HTML) es apoyo para TI, no el mensaje principal.

| Patrón | Criterio | Cómo comunicarlo a CMS (y apoyo TI) |
| --- | --- | --- |
| Mayúsculas en navbar | LC-1.2.4-05 | «En el menú lateral, los rótulos MI INAPI / TRAMITACIÓN / PAGOS / SERVICIOS están solo en mayúsculas. Cambiar a mayúscula inicial (ej. «Tramitación») para facilitar la lectura.» TI: suele venir del layout compartido. |
| «Titulos» sin tilde; «Patentes PCT» | LC-1.1.5-01 / LC-1.1.3-05 | «En el menú de Patentes, corregir «Titulos» → «Títulos». Expandir PCT la primera vez o añadir ayuda/tooltip.» |
| Botones `OK` / `Aceptar` / rótulos ambiguos | LC-5.2.4-01 (todas las URLs) | «En el cuadro de diálogo, el botón «OK» no dice qué se acepta. Cambiar a un texto claro, p. ej. «Aceptar selección» o «Confirmar y continuar».» TI: modal del layout compartido. En sitioweb: lo mismo para «Más», «LINK EXTERNO», atajos opacos. |
| PDF sin formato/peso/descripción | LC-1.2.4-07 / LC-1.2.4-08 | «Junto al enlace del documento, mostrar título + formato + peso + breve descripción (ej. «Guía de marcas (PDF, 245 KB) — …»).» |
| Sin fecha de actualización | LC-1.1.4-01 | «Bajo el título de la página, añadir una línea visible: «Actualizado: DD de mes de AAAA». El © del pie no cuenta como fecha de contenido.» |
| Título principal genérico o desalineado | LC-1.1.2-01 | «El título principal de la página debe describir el contenido específico. Evaluar solo ese título visible; no el de la pestaña del navegador.» |
| PCT en menú sin expansión | LC-1.1.3-05 | «La primera vez que aparece PCT en el menú, definirla (tooltip, glosa o página destino), sin convertir el ítem en un párrafo largo.» |
| ¿Hay apoyos visuales para datos? | **LC-1.3.1-01** (solo esta pregunta) | Pregunta del instrumento: ¿se usan íconos, imágenes, gráficos o infografías para presentar datos? Si en pantalla hay banners, tarjetas con imagen, íconos de guía, gráficos → **`cumple`**. Si la página es solo texto corrido sin esos apoyos y los datos lo pedían → `incumple` («faltan imágenes/íconos/gráficos…»). **`no_aplica`** si no hay datos que requieran apoyo visual. **No** usar este id para texto alternativo (`alt`), nombres de enlace solo-ícono ni WCAG: eso es Usabilidad/accesibilidad (§23), opcional en `nota_final_tic` en lenguaje CMS, **sin** descontar el % LC. |

---

## 7. Flujo de trabajo en el frontend

El resultado de cada auditoría alimenta `/auditar/resultado`, que muestra **7 secciones**:

| # | Sección | Fuente en JSON |
| --- | --- | --- |
| 1 | Datos de Auditoría | `id`, `url`, `fecha`, `evaluador_uid`, `tipo_pagina` |
| 2 | Resumen | `resumen` (`total`, `cumple`, `incumple`, `no_aplica`, `porcentaje`) |
| 3 | Pasos a seguir | `estado_aceptacion` / `resumen.porcentaje` → umbral → copy UI |
| 4 | **51** criterios evaluados (v3.0) | `criterios` (tabla completa con estado y severidad) |
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
| **Claude Code (agente raíz)** | Orquestador único | Lanza §17.1bis + 15 subagentes + 5 sub-subagentes §17, consolida §20, escribe JSON, valida, cablea. **No** evaluar los 51 criterios solo en el raíz. |
| **Playwright MCP** | Captura una vez | `navigate` → HTML a disco → snapshot a11y → `evaluate` estilos si legibilidad (`LC-1.2.3-*`) es dudosa → abrir modales de 1 clic. **No** re-navegar por cada grupo. |
| **Chroma / RAG MCP** | Fundamento + precedentes | Colección A por `source` del criterio; Colección B = checklist v3.0 + Word/mapa PTD + auditorías/ADRs. Consultas puntuales; **no** volcar PDFs enteros al chat. |
| **Skills** | Especialización | `01`–`05` (documentos/RAG, lenguaje CMS, subagentes, Xenova, calibración). |

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

| Componente | Tecnología | Qué es y qué función cumple |
| --- | --- | --- |
| **Frontend** | Next.js 16 + TypeScript + Bun (`./frontend/`) | Aplicación web del MVP: pantallas `/auditar`, resultado, PDF/Excel. En local, las API routes de Next actúan también como backend ligero. Despliegue típico en Vercel. |
| **Orquestador IA** | Claude Code Pro (terminal / WSL) | Agente que lee este `CLAUDE.md`, lanza subagentes, usa MCP y escribe el JSON canónico. No es un servicio Nest separado en el flujo local actual (ADR 0009). |
| **Captura HTML** | Playwright MCP (`npx @playwright/mcp@latest`) | Navegador automatizado: abre la URL real, obtiene el DOM renderizado (no solo el HTML «Ver código fuente»), snapshots de accesibilidad y, si hace falta, estilos computados. |
| **Embeddings** | `@xenova/transformers` — modelo `paraphrase-multilingual-MiniLM-L12-v2` | Librería que convierte texto a vectores numéricos **en la CPU local** (sin enviar PDFs a la nube). Permite buscar “parecido semántico” en el RAG (ADR 0010). |
| **Base vectorial** | Chroma local (`./rag/chroma_db`, puerto 8000) | Almacén de esos vectores + fragmentos de texto. Colección A = normativa; Colección B = checklist/auditorías/ADRs del repo. Los datos no salen de la máquina INAPI. |
| **Pipeline RAG** | Scripts TypeScript en `./rag/` (ingesta + consulta; patrón tipo LangChain) | **LangChain.js** (o el flujo equivalente en este repo) orquesta “leer documento → trocear → embeber → guardar/consultar”. No sustituye el juicio editorial: solo recupera fragmentos útiles para fundamentar. |
| **RAG MCP** | `bun rag/mcp-server.ts` | Puente: Claude Code llama herramientas (`rag_search_normativa`, `rag_search_precedentes`) y el servidor consulta Chroma. |
| **Validación de contratos** | **Zod** + `validate-claude-audits.ts` + **Hooks** de Claude Code | **Zod** = esquema TypeScript que define la forma exacta del JSON (ids, estados, conteos). El script valida todos los JSON del repo. Los **hooks** son disparadores locales que pueden rechazar un guardado si el JSON no cumple el contrato. |
| **Runtime** | Bun | Ejecutor JS/TS del monorepo (`bun install`, `bun run …`), más rápido que Node para scripts del proyecto. |

Referencias: `docs/ARCHITECTURE.md` · `docs/PROPUESTA_TECNICA_INTEGRAL.md` · `docs/adr/`.

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

**Diferencia DOM renderizado vs Ctrl+U:** en URLs Trámites el JS inyectado desde BE modifica el DOM; la línea 1000 de Ctrl+U puede no coincidir con el código fuente TI. Usar siempre DOM como fuente de verdad editorial y `fragmento_busqueda` como ancla para TI (ver `docs/flujo-piloto-10-urls-claude-mvp.md` §4).

**Ranks pendientes TI (sin forzar auditoría):** 8, 11, 13, 15 — ver `docs/fase-3-3-captura-auth-claveunica.md` §3.

---

## 12. Workflow — Auditoría completa de una URL

*Flujo canónico: **`.claude/prompts/05-audit-maestro-url.md`** (1 URL = 1 sesión).*  
*Multi-sesión META MEI: repetir Prompt 5 (una URL por sesión). Calibración viva: `06-calibracion-hallazgos.md`.*

**Cómo leer «§N»:** sección de este `CLAUDE.md`. §17 = texto ascendente + subagentes + sub-subagentes; §20 = evidencia; §22 = entrega CMS.

### Paso 1 — Preparación
- Identificar **una** URL y `tipo_pagina` (`sitioweb` | `tramites`).
- Confirmar stack (Prompt 1): Playwright MCP, Chroma, ingestas al día.
- Obtener HTML (Playwright §11 / §8).
- Si sesión autenticada: `captura_con_sesion: true` y §19.
- Leer **Prompt 6** + skill `05` (calibraciones vigentes).
- ¿JSON previo? → reauditar; id anterior a `history[]`.

### Paso 2 — Inventario + evaluación (§17)
Plantilla Prompt 5. Entregar:
- Inventario `T001…` capas **R** y **U** (skill `01` / inventario visible).
- **Análisis textual ascendente** (palabra→párrafo) — §17.1bis + Prompt 7 + skill `06` (Paso D0).
- **15 subagentes en orden** (un indicador tras otro) — §17.1 + skill `03` (consumen el mapa D0).
- Luego **5 sub-subagentes de entrega** — §17.2 + skills `02`/`05`.
- Tabla de **51** criterios + `sustituciones[]` consolidadas por el agente raíz.

### Paso 3 — Segunda pasada (JSON canónico)
Reglas de contrato (Prompt 3 + §22):
- Exactamente **51 objetos** en `criterios_evaluados[]` (v3.0), orden del catálogo LC-PTD.
- **Estado JSON:** SOLO `"cumple"` | `"incumple"` | `"no_aplica"`.
- **`severidad`:** SOLO si `incumple` (`baja` / `media` / `alta`). Omitir en cumple/no_aplica.
- **Cobertura 1:1:** cada `incumple` → ≥1 fila en `sustituciones[]`, CMS-first.
- Resumen numérico coherente; Clarity: bloque `clarity_meta` si aplica.

### Tipos de propuesta en `sustituciones[]`

Cada fila debe ser **User Experience primero**: un editor CMS debe saber *dónde mirar en pantalla* y *qué hacer*, sin necesitar ser desarrollador. La línea HTML (Ctrl+U / `html_linea_aprox`) es **obligatoria como apoyo**, pero **secundaria** frente a `ubicacion_pantalla` en lenguaje humano.

| Tipo | Cuándo usarlo | `original` (evidencia) | `propuesto` (lenguaje CMS + apoyo TI) |
| --- | --- | --- | --- |
| **Sustitución** | El texto ya está en pantalla y debe cambiar | Literal visible (o HTML con entidades si hace falta a TI) | Texto corregido en lenguaje claro, listo para pegar en el CMS |
| **Inserción** | Falta un elemento: fecha, intro, glosa de sigla, descripción de imagen | `"(ausencia)"` o `"(no existe en la página)"` | Instrucción + bloque de texto a **añadir** (dónde en pantalla: bajo el título, junto al enlace, etc.) |
| **Eliminación** | Hay que quitar algo: texto de desarrollo, dato personal indebido, enlace confuso | Fragmento literal visible | Instrucción clara: «Quitar este texto/elemento de [zona]» + nota en `motivo` (TI puede leer «eliminar nodo» como apoyo) |
| **Reorden / estructura** | El contenido existe pero en mal orden (pirámide invertida `LC-1.2.4-01`) | Lo que hoy aparece primero | Qué debe ir primero (párrafo de propósito) y dónde reubicarlo en la página |
| **Enlace / rótulo** | El texto del enlace o botón no describe la acción/destino (`LC-5.2.4-01`, etc.) | Texto actual del enlace/botón | Rótulo descriptivo; si el destino técnico no puede renombrarse, explicarlo en `motivo` en lenguaje claro |

**Reglas de estilo de las propuestas:**
- Lenguaje claro, voz activa; sin jerga de orquestación ni selectores CSS como único mensaje.
- **Prioridad de localización:** (1) `ubicacion_pantalla` humana (zona › bloque › elemento), (2) luego `linea` / `html_linea_aprox` / fragmento para TI.
- Una fila por cambio localizable; no agrupar criterios distintos salvo párrafo continuo del mismo nodo.
- No inventar pesos en KB/MB; pedir que el CMS complete formato/peso reales.
- Orden sugerido del array: por orden del catálogo `LC-*` o por aparición en pantalla.

**Regla para `no_aplica` con propuesta excepcional:** si el criterio no aplica hoy pero podría incorporarse en una mejora futura, documentar en `comentario` — **no** crear fila en `sustituciones[]` salvo acuerdo explícito con Equipo UX.

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

Regla: `claudeAuditId` / `id` vigente = **última** auditoría; ids previos en `history[]` + meta. Ver Prompt 5 Paso F.

### Paso 5 — Commit y DEVLOG

Seguir **§5.1** (alcance + consistencia de calibración sin preguntar).

```bash
# URL nueva
git add data/claude-audits/... frontend/src/lib/claude-audits-launch.ts src/lib/mei-export/mei-meta-mei-urls.ts
git commit -m "feat(audits): agregar auditoría {slug-url} — {estado_aceptacion} {porcentaje}%"

# Si Prompt 6 vigente obligó a retocar URLs ya cerradas o la capa de entrega:
# fix(audits): consistencia calibración C-… en URLs ya cerradas
# feat|fix(entrega): …

# Añadir entrada en docs/development/DEVLOG.md (formato .agents/workflows/devlog-standard.md)
git status   # debe quedar limpio (salvo next-env.d.ts)
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
| 4 | **51** criterios evaluados v3.0 (tabla completa por indicadores) |
| 5 | Observaciones por severidad (`observaciones_lc_por_severidad`) |
| 6 | Texto propuesto (tabla `sustituciones[]`) |
| 7 | Nota para TI (`nota_final_tic`) |

### Troubleshooting
- Si el botón PDF no aparece: verificar que el JSON existe en `data/claude-audits/` y que el parámetro `?claudeAudit={id}` está en la URL del resultado.
- Si el PDF falla en Vercel: verificar que `LC_REPO_ROOT` apunta al directorio raíz del monorepo y que `data/claude-audits/` está incluido en el árbol de despliegue.
- Si `@react-pdf` lanza error de fuentes: las fuentes Roboto deben estar disponibles en el servidor (ver `frontend/src/app/api/claude-audits/[id]/export/pdf/route.ts`).

---

## 14. Workflow — Conjunto de URLs (multi-sesión)

*Aplica desde Fase 3. **Sin archivo aparte de lote:** repetir Prompt `05-audit-maestro-url.md` (una URL por sesión). Orden META MEI: `src/lib/mei-export/mei-meta-mei-urls.ts`.*

### Política de tamaño (obligatoria)

| Caso | Tamaño | Cómo |
| --- | --- | --- |
| META MEI / reauditoría con calibración **§20** | **1 URL por sesión** | Pegar Prompt `05-audit-maestro-url.md` (+ leer Prompt 6) |
| Dos páginas hermanas | **Máx. 2** | Solo si la 1ª cerró `validate` + commit |
| Smoke Clarity ligero | Hasta 5 (legacy) | Verificar tras cada URL; no apilar consolidaciones |

**Prohibido** en entregas MEI / profundidad §20: un solo prompt maestro con 3–5 URLs.

### Preparación del conjunto
1. Definir la lista ordenada (p. ej. `mei-meta-mei-urls.ts` órdenes 1…N).
2. Verificar Playwright MCP + RAG MCP (`claude mcp list`; Chroma en `:8000`).
3. HTMLs en `auditorias/htmls/` o `auditorias/lote-{fecha}/`.

### Ejecución
- Por cada URL ejecutar el ciclo completo:
  - **§12** — workflow de una URL (preparación → inventario → JSON → validate → cable → commit)
  - **§17** — §17.1bis (texto ascendente) + 15 subagentes (indicadores) + 5 sub-subagentes (entrega)
  - **§20** — calibración VISIBLE / patrones / cruces / gate de evidencia
  - **§21** — playbook de herramientas para criterios críticos (fecha, documentos, H1, etc.)
- **No** abrir la siguiente URL hasta cerrar la actual.
- El agente raíz orquesta; los 5 sub-subagentes son **por URL**, no un subagente “por URL” que haga los 51 solo.

### Verificación
- Tras cada URL: `bun run validate:claude-audits` + commit(s) según **§5.1** (consistencia de calibración incluida si aplica; **sin** menú commit/revertir/dejar).
- Al cerrar: `git status` limpio (salvo `next-env.d.ts`).
- No abrir la siguiente URL con working tree sucio de limpiezas de Prompt 6.
```bash
bun run validate:claude-audits
```
- Coherencia `%` / `estado_aceptacion`; cobertura `incumple` ↔ `sustituciones[]`; agrupados **§20.3** (cruces mismo nodo).

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
bun run rag/query.ts "criterio LC-1.2.4-05 mayúsculas"  # probar consulta semántica

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

## 16. Política de `no_aplica` — cuándo usar cada criterio (ids v3.0)

| Criterio | Usar `no_aplica` cuando... | Ejemplo |
| --- | --- | --- |
| LC-1.1.2-04 | No hay textos de trámite / autonomía del trámite no aplica | Página informativa de `www.inapi.cl` |
| LC-1.1.3-01 | No hay texto principal medible (página vacía / solo UI sin cuerpo) | Pantalla de error mínima |
| LC-1.1.3-05 | No aparecen siglas ni acrónimos en el contenido evaluado | Página sin siglas |
| LC-1.1.7-01 | No hay listados de personas con RUN | Página sin listados |
| LC-1.1.7-03 / ARCO | Pantalla interna post-login sin expectativa de publicar política ARCO en esa vista (ver §19) | Wizard autenticado |
| LC-1.1.8-* | No hay menores ni contenidos sensibles en la página | Mayoría del inventario |
| LC-1.2.1-05 | No hay listas de requisitos de servicios | Home/portal sin requisitos |
| LC-1.2.2-05 | El texto tiene menos de 4 párrafos continuos | Home con tarjetas cortas |
| LC-1.2.4-06 | No aplica enlaces relacionados (p. ej. solo trámite IESD sin sitio informativo) | Según `applicability` |
| LC-5.2.1-01 / LC-5.2.2-01 | Variantes solo IESD en página `sitioweb` informativa pura | Noticia institucional |
| ~~LC-5.2.4-01~~ | **No** usar `no_aplica` por «informativa»: rótulos/CTA aplican siempre (C-2026-08-25c) | — |
| LC-1.2.4-07 / 08 | No hay documentos descargables | Página sin PDFs |
| LC-1.3.1-01 | No hay datos que requieran apoyos visuales (página solo narrativa) | Nota sin cifras/datos a ilustrar. **No** marcar `no_aplica` ni `incumple` por problemas de `alt` |
| LC-1.3.3-01 | No hay versiones anteriores / archivo publicado | Mayoría de URLs |

**ARCO** = derechos de **A**cceso, **R**ectificación, **C**ancelación/eliminación, **O**posición (y bloqueo) de datos personales (Ley de protección de la vida privada). Criterio máquina: `LC-1.1.7-03`.

**Regla de oro:** `no_aplica` = el supuesto del criterio no existe en la página. No usar `no_aplica` para ocultar un incumplimiento evidente.

**Propuesta excepcional:** si hoy no aplica pero podría incorporarse en una mejora (ej. resumen inicial cuando crezca el contenido — `LC-1.2.2-05`), documentar en `comentario`. No crear `sustituciones[]` sin acuerdo UX.

---

## 17. Arquitectura: texto ascendente + subagentes (indicadores) + sub-subagentes (entrega)

*Fase 3+. Requiere Playwright MCP + RAG MCP.*  
*Prompt canónico: `prompts/05-audit-maestro-url.md`. Skills `01`–`06`. Diagrama: `diagrams/workflow_diagram.md`.*

### Motivación

1. **No omitir jerga ni bloques incompletos:** primero recorrer el VISIBLE de palabra/concepto → párrafo (§17.1bis).  
2. **Evaluar** los 51 criterios con la misma granularidad que los **instrumentos** IEW/IESD (un indicador a la vez, en orden).  
3. **Entregar** resultados pulidos para CMS/UX/Excel con cinco especialistas de calidad de salida.  
4. No mezclar “quién mapea el texto”, “quién puntúa el indicador” y “quién redacta la fila para humanos”.

### 17.1bis Subagente — Análisis textual ascendente (ANTES de los 15)

*Obligatorio en cada URL (Prompt 5 Paso **D0**). Contrato: `prompts/07-analisis-texto-ascendente.md`. Skill: `06-analisis-texto-ascendente.md`.*

Recorre el inventario R+U en orden **ascendente de granularidad** y produce un **mapa** de unidades + diagnósticos + propuestas CMS. Los 15 subagentes **consumen** ese mapa; no lo sustituyen.

| Nivel | Unidad | Pregunta guía | Corrección típica |
| --- | --- | --- | --- |
| 1 | Palabra / concepto | ¿Lo entiende un ciudadano? | Cambiar el concepto **o** agregar definición/descripción breve |
| 2 | Frase breve | ¿Hay un concepto opaco dentro? | Explicar el concepto *in situ* (paréntesis, guiones, glosa) |
| 3 | Oración | ¿Deja dudas por términos no descriptivos? | Reescribir **y** precisar (tasas, derechos, tramitación…) |
| 4 | Párrafo / etapas | ¿Es «preciso» pero las partes no se explican? | Describir cada etapa: qué ocurre, qué hace el usuario, por qué |
| 5 | Forma | Extensión, una idea, escaneo, negritas… | Ajustar forma **sin** dejar de explicar conceptos |

**Ejemplos canónicos (Prompt 6 / Marcas–Portada):** «Observancia»; «Tipo de cobertura»; oración de tasas/derechos; párrafo de tres etapas del registro.

**Salida:** mapa `unidad_id | nivel | texto | ubicación | criterios_candidatos | diagnóstico | propuesta_cms | contexto_superior`.  
**No** calcula % global ni escribe el JSON de 51 filas.

### 17.1 Subagentes — 15 indicadores únicos (evaluación, SECUENCIAL)

| # | Nombre | IEW | IESD | Notas |
| --- | --- | --- | --- | --- |
| 1 | Fiabilidad | 1.1.1 | 5.1.1 | Dual |
| 2 | Completitud | 1.1.2 | 5.1.2 | Dual |
| 3 | Lenguaje plano | 1.1.3 | 5.1.3 | Dual |
| 4 | Actualización | 1.1.4 | 5.1.4 | Dual |
| 5 | Redacción y ortografía | 1.1.5 | 5.1.5 | Dual |
| 6 | Propiedad intelectual | 1.1.6 | 5.1.6 | Dual |
| 7 | Privacidad y datos personales | 1.1.7 | 5.1.7 | Dual |
| 8 | Contenidos sensibles | 1.1.8 | — | **Solo IEW** |
| 9 | Claridad | 1.2.1 | 5.2.1 | Dual (+ variante IESD) |
| 10 | Concisión | 1.2.2 | 5.2.2 | Dual (+ variante IESD) |
| 11 | Legibilidad | 1.2.3 | 5.2.3 | Dual |
| 12 | Escritura para la web | 1.2.4 | 5.2.4 | Dual (+ rótulos IESD) |
| 13 | Visualización de la información | 1.3.1 | — | **Solo IEW** |
| 14 | Objetividad | 1.3.2 | 5.3.1 | Dual |
| 15 | Archivo | 1.3.3 | 5.3.2 | Dual |

- **15** indicadores únicos · **13** también en IESD · **2** exclusivos IEW (1.1.8, 1.3.1).  
- Cada subagente responde **todas** las preguntas `LC-*` de su indicador (catálogo v3.0).  
- Recibe el **mapa §17.1bis** además del inventario; contrasta cada `LC-*` con las unidades relevantes.  
- **Orden estricto 1→15.** No iniciar el siguiente hasta cerrar el actual.  
- Plantilla de instrucción: skill `03-instrucciones-subagentes-instrumentos.md`.

### 17.2 Sub-subagentes — 5 de calidad de entrega (después de los 15)

Trabajan sobre el borrador de 51 filas (+ `sustituciones[]`). Pueden correr en paralelo entre sí.

| # | Responsabilidad |
| --- | --- |
| **1 — Campos de evidencia** | Completar y alinear texto en pantalla, corrección propuesta, ubicación, justificación |
| **2 — Lenguaje ciudadano** | Reescribir sin jerga TI/desarrollo (skill `02`) |
| **3 — Veracidad y realismo** | Preciso, claro, humano; sin inventar defectos (§20.6 / §22.9); aplica Prompt 6 |
| **4 — Estructura Excel/tablas** | Filas ordenadas, jerarquía, casillas no vacías, coherencia con columnas UI/PDF/Excel (Prompt 3) |
| **5 — Higiene y datos sensibles** | Condiciones de uso, privacidad/ARCO, contenidos sensibles, §18–§19 |

### Flujo completo (por URL)

```
Agente raíz (Claude Code)
│
├── [A] Prompt 1 — stack (Playwright, Chroma, Xenova, LangChain, ingest)
├── [B] Captura UNA vez + inventario R+U
├── [C] Prompt 6 + skills 01/04/05 — catálogo + RAG + calibración
│
├── [D0] SUBAGENTE §17.1bis — análisis textual ascendente (Prompt 7 + skill 06)
│
├── [D] 15 SUBAGENTES en orden (indicador 1 → 15)     ← evaluación (usan mapa D0)
│
├── [E] 5 SUB-SUBAGENTES de entrega (1–5)             ← calidad de resultado
│
├── [F] Consolidar 51 filas · validate · cable UI/PDF/Excel · commit
└── Si hay hallazgo nuevo de calibración → actualizar Prompt 6
```

### Reglas de consolidación (agente raíz)

- Captura **una** vez; inventario compartido.  
- **D0 antes de D:** no lanzar los 15 sin el mapa de texto ascendente.  
- Sin solapar criterios entre subagentes.  
- Unir `sustituciones[]`; conflictos mismo nodo → §20.3.  
- Completitud: 51 filas; cobertura 1:1 incumple↔sustituciones.  
- Gate §22 / sub-subagentes 1–4 antes de validar.  
- No cerrar hasta terminar **D0 +** los 15 subagentes **y** los 5 sub-subagentes.

### Por qué 1 URL por Prompt 5

Contexto no saturado, evaluación por indicador sin mezclar páginas, entrega CMS coherente, RAG anclado a esa URL. El lote solo encadena Prompt 5.

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

| Variable | Entorno | Función |
| --- | --- | --- |
| `LC_REPO_ROOT` | Vercel / producción (a veces local) | Ruta absoluta a la **raíz del monorepo** (`lc-inapi.app`). Las API de PDF/Excel y los loaders buscan `data/claude-audits/` y catálogos relativos a esa raíz. Si el proceso arranca con otro `cwd`, sin esta variable no encuentra los JSON. Ver `docs/despliegue/despliegue-hibrido.md`. |
| `CHROMA_PORT` | Local / servidor TI | Puerto HTTP donde escucha el servidor Chroma del RAG (por defecto **8000**). El MCP `rag-auditoria` y los scripts `rag/ingest-*.ts` / `query.ts` usan ese puerto para embeber y consultar. Configurar en `.env.local` solo si no usas el valor por defecto. |

### Checklist antes de cada push a `main`

- [ ] No hay `console.log` con URLs, tokens ni datos de usuarios.
- [ ] Ningún archivo `.env*` real en el staging area (`git status`).
- [ ] Los JSONs canónicos no contienen datos personales reales del solicitante (solo `evaluador_uid` del auditor y placeholders en citas).
- [ ] `rag/chroma_db/` y `documentos/` no aparecen en el staging area.
- [ ] `bun run validate:claude-audits` pasa sin errores.
- [ ] `bun run typecheck:all` pasa sin errores.
- [ ] `bun run lint` pasa sin errores.
- [ ] `bun run build` pasa sin errores (build de frontend/Next antes de merge y despliegue).

---

## 19. Auditorías con sesión autenticada (`captura_con_sesion: true`)

*Aplica a pantallas de `tramites.inapi.cl` capturadas tras login ClaveÚnica o Clave INAPI (Fase 3.3). Documentación operativa: `docs/fase-3-3-captura-auth-claveunica.md`.*

### Cuándo activar

- La URL solo es accesible con sesión activa (formularios de trámite, escritos, solicitudes guardadas, etc.).
- El HTML contiene datos del **usuario logueado** en campos, tablas o resúmenes de trámite.

### Qué NO hacer

- **No** marcar `incumple` en `LC-1.1.7-01` solo porque aparece el RUT, nombre, correo o marca del solicitante en su propio formulario.
- **No** proponer sustituciones que eliminen o reemplacen datos de sesión del usuario.
- **No** transcribir valores reales en `cita_textual`, `original`, `propuesto`, `observaciones_lc` ni en el inventario Tnnn del JSON.
- **No** usar `severidad: "alta"` en privacidad por datos esperables del flujo transaccional.

### Qué SÍ evaluar (por indicador / criterio v3.0)

| Criterio / grupo | Enfoque en pantalla autenticada |
| --- | --- |
| **LC-1.1.7-01 / 02** | ¿Se exponen datos de **terceros** sin justificación? ¿Hay datos personales fuera del formulario (p. ej. pie estático)? Datos del solicitante en su trámite → `cumple`, salvo exposición indebida |
| **LC-1.1.7-03 (ARCO)** | Suele ser `no_aplica` en vistas post-login internas (§16); si la pantalla debe informar derechos ARCO, evaluar con evidencia. ARCO = acceso, rectificación, cancelación/eliminación, oposición (y bloqueo) |
| **LC-1.1.6-*** | Condiciones de uso / licencia del layout — igual que URLs públicas |
| **Lenguaje plano / Claridad / Concisión** (`LC-1.1.3-*`, `LC-1.2.1-*`, `LC-1.2.2-*`) | Claridad de **etiquetas**, ayudas e instrucciones — citar la etiqueta, nunca el valor del input |
| **Escritura web / rótulos** (`LC-1.2.4-*`, `LC-5.2.4-01`) | CTAs, PDFs descriptivos, rótulos de acción del flujo |
| **Completitud / Actualización / Ortografía** (`LC-1.1.2-*`, `LC-1.1.4-01`, `LC-1.1.5-*`) | Suficiencia del trámite, fechas institucionales, ortografía del copy **institucional** |

### Anonimización obligatoria en salidas

Objetivo: auditar claridad y estructura **sin filtrar PII**. Aplicar con rigor (no bastan frases vagas).

| Campo JSON | Regla operativa (hacer / no hacer) |
| --- | --- |
| Inventario `Tnnn` | **Hacer:** rol del campo + etiqueta. Ej.: `T042 [R]: «[valor de sesión — no transcribir]» (contexto: campo «RUT del solicitante» prellenado)`. **No:** pegar RUT, nombre, correo, marca o expediente reales. |
| `cita_textual` | **Hacer:** evidencia sin PII. Placeholders fijos si hace falta: `[RUT del solicitante]`, `[nombre de marca]`. **No:** citar el valor tipeado/prellenado. |
| `original` / `propuesto` | **Hacer:** solo copy institucional (etiquetas, ayudas, botones, instrucciones). **No:** borrar/reescribir el valor de sesión; si el problema es claridad, se cambia la etiqueta/ayuda. |
| `motivo` / `comentario` | **Hacer:** fallo de lenguaje claro o privacidad de terceros + ubicación en pantalla. **No:** narrar el expediente del solicitante. |
| `texto_capturado` | **Hacer:** resumen del inventario anonimizado (T001…). **No:** volcado HTML con PII. |
| `observaciones_lc*` / `nota_final_tic` | Mismas reglas: sin PII; sí acción CMS. |

Si un valor real ya entró al borrador: **reescribir antes** de validate/commit.

### Ejemplo de comentario correcto — `LC-1.1.7-01` (sesión autenticada)

```
LC-1.1.7-01 cumple: la pantalla muestra datos del solicitante solo en campos del trámite
(etiquetas «RUT», «Nombre solicitante», «Marca»). No se exponen datos de terceros ni
información personal fuera del contexto transaccional esperado.
```

### Ejemplo de comentario correcto — claridad de etiqueta (sin nombrar datos)

```
LC-1.1.3-03 incumple (severidad media → «Medianamente cumple» en UI): la etiqueta del campo
de clasificación Niza no explica qué debe ingresar la persona; solo muestra el código sin
glosa. Propuesta: añadir texto de ayuda bajo el campo (sin mencionar el valor ingresado).
```

### Instrucción para el Grupo 5 (sub-subagente PI / Privacidad / Sensibles)

Al lanzar el Grupo 5 con `captura_con_sesion: true`, incluir explícitamente:

> «Evalúa `LC-1.1.6-*`, `LC-1.1.7-*` y `LC-1.1.8-*` según CLAUDE.md §19. Los datos del solicitante logueado en formularios NO son incumplimiento de `LC-1.1.7-01`. Anonimiza toda cita. Evalúa etiquetas, ayudas y estructura del formulario. ARCO = `LC-1.1.7-03`.»

### Chroma / RAG en sesión autenticada

Chroma **no** accede a la URL ni al HTML de sesión. El RAG MCP solo aporta normativa (A) y precedentes anonimizados del repo (B). Consultar precedentes de URLs similares del mismo tipo de formulario, no fragmentos con PII.

---

## 20. Calibración META MEI — puntaje, VISIBLE, patrones y cruces

*Aplica a reauditorías META MEI y a auditorías nuevas con `version_checklist: "3.0"` (51 LC). JSON históricos v2.1 siguen las mismas reglas de VISIBLE/patrones.*

### 20.1 Solo contenido visible (impacto en %)

| Evidencia | ¿Descuenta %? | Entrega |
| --- | --- | --- |
| Texto/UI visible o modal abrible con un clic (incl. **H1** visible) | Sí (`incumple`) | Sustitución + `ubicacion_pantalla`; **siempre** en tabla UI/PDF/Excel (**51** filas v3.0) |
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

Si varios criterios (p. ej. Claridad/Concisión `LC-1.2.1-*` / `LC-1.2.2-*`, o Lenguaje plano + Concisión) apuntan al **mismo** `original`/`propuesto` y al **mismo** nodo visible:

1. Una sola fila en `sustituciones[]` con `criterio_id` = **primario** y `criterios_relacionados: [...]`.
2. Prioridad sugerida de primario (ajustar con Equipo UX si hace falta): requisitos en infinitivo (`LC-1.2.1-05`) > una idea por párrafo (`LC-1.2.2-03`) > oraciones simples (`LC-1.2.2-04`) > estructura FAQ (`LC-1.2.1-01`) > Legible (`LC-1.1.3-01`).
3. Primario → `incumple` (descuenta). Elegir `severidad` según gravedad (`baja`/`media`/`alta` → presentación Cumple con observaciones / Medianamente cumple / No cumple).
4. Secundarios → `incumple` + `agrupado_en: "<primario>"` (justificación propia; **no** descuentan en `summarizeEvaluations`).
5. En UI/PDF/Excel: mostrar los ids `LC-*` relacionados y las justificaciones juntas, en lenguaje CMS.

### 20.4 Justificación obligatoria en `no_aplica`

Los **51** criterios (v3.0) aparecen siempre en pantalla, PDF y Excel. Históricos v2.1: 47 filas A–H.

- `no_aplica` **debe** llevar `comentario` breve (por qué no aplica en esta URL).
- Auditorías históricas sin comentario muestran «Sin justificación registrada» hasta reauditar.

### 20.5 Lenguaje de resumen y nota TI

`resumen_ejecutivo` y `nota_final_tic` deben redactarse en **lenguaje claro** (párrafos cortos, sin jerga de orquestación ni códigos HTML innecesarios). La UI/PDF además formatean párrafos para lectura.

### 20.6 Gate de evidencia y hallazgos distintos

Cada criterio es una **pregunta del instrumento**. Antes de emitir estado:

| Estado JSON | `severidad` | Presentación UI | Exigencia mínima |
| --- | --- | --- | --- |
| `cumple` | omitir | Cumple | Evidencia positiva (Tnnn, atributo, estilo, o ausencia documentada de problema). **Prohibido** «parece bien» / omisión. |
| `incumple` | `baja` | Cumple con observaciones | Evidencia + fila en `sustituciones[]` con `ubicacion_pantalla` humana y propuesta accionable (corrección menor). |
| `incumple` | `media` | Medianamente cumple | Idem; hallazgo relevante para esta iteración. |
| `incumple` | `alta` | No cumple | Idem; prioridad alta / bloqueante. |
| `no_aplica` | omitir | No aplica | `comentario` breve obligatorio (§20.4). |

**Hallazgos distintos:** preferir que cada `incumple` aporte un descubrimiento distinto. Si varios criterios chocan con el **mismo** nodo/texto → §20.3 (primario + `agrupado_en`). No reutilizar el mismo `propuesto` genérico en filas independientes sin agrupación.

**Criterios de formato / chrome (no solo redacción):** escaneabilidad (`LC-1.2.4-03`), espacio entre párrafos (`LC-1.2.3-01`), alineación (`LC-1.2.3-02`), fecha (`LC-1.1.4-01`), documentos (`LC-1.2.4-07/08`) — inventariar capa **U** y, si hace falta, Playwright `evaluate` / a11y (ver §21). No marcar legibilidad como `no_aplica` por defecto «es CSS».

---

## 21. Playbook por criterio crítico (herramientas)

*Complementa §8 (MCP) y §17. Usar en reauditorías 1-URL (Prompt 5).*

| Criterio | Evidencia preferida | Herramienta |
| --- | --- | --- |
| **LC-1.2.4-03** (escaneo) | Encabezados, listas, negritas / muro de texto | Inventario U + a11y (roles heading/list) |
| **LC-1.2.3-01** (espacio) | Márgenes/separación entre bloques de cuerpo | `getComputedStyle` en párrafos principales |
| **LC-1.2.3-02** (alineación) | Texto a la izquierda vs centrado/justificado en cuerpo | `getComputedStyle` en contenedor de texto |
| **LC-1.1.4-01** (fecha) | Fecha de publicación o última modificación **visible** | Inventario U; ©año footer ≠ fecha |
| **LC-1.1.2-01** (título↔contenido) | H1 visible vs contenido | Inventario R; nunca `<title>` |
| **LC-1.2.4-07 / 08** (documentos) | Título + formato + peso + descripción | DOM enlaces; no inventar KB/MB |
| **LC-1.3.1-01** (apoyos visuales) | ¿Hay íconos/imágenes/gráficos/infografías **visibles** que presenten o acompañen datos? | Inventario U + vista Playwright: contar apoyos visibles. **Sí hay** → `cumple`. **No** confundir con calidad de `alt` (fuera del % LC). Si la herramienta “no ve” un banner que sí está en pantalla, **no** incumplir: reintentar captura o anotar duda en `comentario`, no castigar por ceguera de herramienta. |
| **LC-1.1.3-05** (siglas) | Primera aparición definida (tooltip/glosa/destino) | Inventario R; propuesta sutil en menú |

Claude Code orquesta; Playwright captura y mide; Chroma fundamenta y trae precedentes; el skill fija el juicio editorial.

---

## 22. Entrega legible para quien implementa (editor CMS / TIC no IA)

*Obligatorio en reauditorías 1-URL y JSON nuevo v3.0. Complementa §17, §20.5 y Prompt 5.*


### 22.1 Audiencia

Quien lee `ubicacion_pantalla`, `propuesto`, `motivo`, `comentario`, `resumen_ejecutivo` y `nota_final_tic` **no** es el orquestador: es una persona que corrige textos en Sitefinity / CMS o en el layout compartido. Escribir para esa persona.

**Prohibido en esos campos (mensaje principal):** jerga de orquestación («sub-subagente», «§17», «capa R/U», «gate §20.6», «Chroma», «mapa D0», «análisis textual ascendente», «Prompt 6/7», códigos `C-YYYY-…`); códigos `LC-*` e IEW/IESD (`1.1.3 / 5.1.3`); sintaxis HTML/DOM como si fuera el hallazgo; ubicaciones o citas solo con ids de inventario (`T042`, `T008–T011`) **sin** literal ni ruta humana.

**Referencias entre criterios:** «el criterio 4», «los criterios 6 y 24» (numeración 1…51). **Encabezado:** `Criterio N: … — Instrumento M: Nombre` — ej. `— Instrumento 3: Lenguaje plano`.

Escribir lo que la persona **ve** y **debe cambiar** en el CMS. La ancla HTML / `Tnnn` / `LC-*` queda en JSON técnico (`html_linea_aprox`, `criterio_id`), **nunca** como mensaje principal de entrega.

### 22.2 Cada criterio = pregunta del instrumento

Antes de fijar el estado, el subagente debe poder responder en una frase la **pregunta** del criterio (`criterion` / `verification` / `display_label` en `data/checklist-criteria-lc-ptd.json`).

| Estado | Qué debe quedar claro en `comentario` (o en `motivo` de la sustitución) |
| --- | --- |
| `cumple` | Qué se vio que demuestra el sí (ej. «Hay título principal “Marcas” alineado al contenido»). |
| `incumple` + `severidad` | Qué falla + qué cambiar. En UI: `baja`→Cumple con observaciones · `media`→Medianamente cumple · `alta`→No cumple. |
| `no_aplica` | Por qué la pregunta no tiene sentido en esta URL (ya exigido en §20.4). |

La fila en `sustituciones[]` **no reemplaza** la respuesta a la pregunta: la traduce a una acción editable.

### 22.3 Plantilla obligatoria de cada fila en `sustituciones[]`

| Campo | Regla |
| --- | --- |
| `ubicacion_pantalla` | Ruta humana **obligatoria y específica**: `Zona › elemento › «rótulo»`. Ej.: `Pie de página › enlace «Política de privacidad»`; `Portada › zona superior destacada › título principal '…'`; `Pie de página › bloque «Dónde estamos»`. **Prohibido:** solo `Tnnn`, solo HTML, o vaguedades (`el enlace`, `el bloque`, `En la página…`). Ver calibración C-2026-08-24. |
| `original` | Cita corta del texto **visible** a corregir (o descripción de ausencia: «(sin fecha de actualización visible)»). Si el criterio **cumple**, el comentario (y, en entrega, Texto en pantalla) debe citar esa evidencia — no dejar vacío/`—` mientras la justificación habla de nodos internos. |
| `propuesto` | Texto **listo para pegar** en el CMS, o instrucción inequívoca («Añadir bajo el título: “Actualizado: DD de mes de AAAA”»). **Sin** meta-comentarios tipográficos o de proceso entre paréntesis («formato de oración, consistente con…», «según Prompt…»). Si habla de formato tipográfico, usar §22.3bis. |
| `motivo` | 1–3 frases: (1) respuesta a la pregunta del criterio (cumple / medianamente / no), (2) por qué, con literales o zona humana, (3) si es patrón de sitio (`patron_sistema: true`), decir «corregir una vez en el layout / componente compartido». Sin `Tnnn` ni «mapa D0». |
| `linea` / `html_linea_aprox` | Secundarios para TIC; no sustituyen a `ubicacion_pantalla` ni aparecen en justificación de entrega. |

### 22.3bis Tipografía, pesos y formato (UI · PDF · Excel)

Cuando el hallazgo o la corrección hable de títulos, alineación, negrita, cursiva u otros estilos, **usar palabras claras** (sin H1/H2/H3, CSS ni inglés técnico) y el literal entre comillas simples:

| Hablar de… | Forma canónica (ejemplos) |
| --- | --- |
| Título principal | `título principal 'Marcas'` |
| Subtítulo / sección | `subtítulo 'Cómo solicitar'` · `título de apartado '…'` |
| Alineación | `Alineado a la izquierda` · `Justificado` |
| Peso / estilo | `el texto en negrita '…'` · `el texto en cursiva '…'` · `el texto sin negrita '…'` |
| Zonas frecuentes | `zona superior destacada` · `ventana emergente` · `pie de página` · `cabecera` |

**Prohibido en entrega:** `H1`/`H2`/`H3`, `hero`, `modal`, `footer`, `(bold)`, `(align left)`, etc.  
Aplicar en `comentario`, `motivo`, `propuesto`, `ubicacion_pantalla` y campos derivados. La capa de entrega (`normalizarLenguajeTipografiaCms` en `criterio-entrega-campos`) normaliza frases frecuentes al exportar; las auditorías nuevas deben redactar ya en este formato.

### 22.4 Ejemplos (malo → bueno)

**Ubicación**

- Malo: `T015` / `HTML-L420` / `el enlace` / `El bloque` / `En la página (ubicación exacta no registrada…)`
- Bueno: `Menú superior › grupo Patentes › enlace «PCT»`
- Bueno: `Pie de página › enlace «Uso de los Contenidos de este Sitio»`
- Bueno: `Sección «Para Informarse», tarjeta «Cómo registrar una marca»`
- Bueno: `Sección «Trámites», títulos bajo cada tarjeta`

**Texto en pantalla (entrega)**

- Malo en PDF/Excel: `(ausencia)`
- Bueno: `No hay texto que cumpla con este requisito` (en JSON puede quedar `(ausencia)`)
- Malo si `cumple`: `—` + justificación «tarjetas T008–T011…»
- Bueno si `cumple`: citar el literal o el rótulo visible que demuestra el sí
- Malo (C-2026-08-25d): `Texto en pantalla: ¿Los signos de puntuación empleados facilitan la lectura del documento?` (pregunta del criterio)
- Bueno: solo el literal de la página (p. ej. `Para Informarse`); el encabezado `Criterio N: «pregunta» — Instrumento M` va **solo** en el título de la fila, nunca dentro de los 4 campos CMS

**Propuesto**

- Malo: `Mejorar la redacción con lenguaje claro y voz activa.`
- Malo: `Solicitud nueva / Títulos y certificados (formato de oración, consistente con Renovación y Anotación)`
- Bueno: `Protege tu marca en Chile: revisa si ya existe y presenta la solicitud en línea.`
- Bueno (Trámites): unificar títulos en formato de oración **y** añadir bajo cada tarjeta una frase de qué es el trámite (p. ej. bajo «Anotación»: «Registra cambios en una marca ya inscrita»).

**Motivo**

- Malo: `Incumple LC-1.1.3-02 según skill; evidencia capa R. Mapa D0 (Prompt 6).`
- Bueno: `La pregunta pide un tono cercano. El texto actual usa voz distante y no dice qué puede hacer la persona. El propuesto dice la acción en presente.`
- Bueno (secundario agrupado): `Medianamente cumple concisión: la tarjeta «Cómo registrar una marca» concentra tres etapas en una sola oración larga. La lista numerada del criterio de lenguaje plano ya define los términos; aquí basta exigir una idea por paso y frases cortas.`


### 22.5 Instrucción extra al lanzar cada sub-subagente (§17)

Añadir siempre al brief del grupo:

> «Redacta `ubicacion_pantalla`, `propuesto`, `motivo` y `comentario` para un editor CMS (CLAUDE.md §22 completo, esp. §22.8–§22.11). Cada criterio responde la pregunta del instrumento con evidencia; `comentario` nunca vacío. `propuesto` = texto pegable o instrucción concreta (documentos: título+formato+peso+desc; fecha visible; siglas en menú con propuesta sutil). Realismo: no forzar datos clave (qué/cómo/dónde) en atajos de navegación ni correcciones sin necesidad real. Priorizar lenguaje CMS; la línea HTML es apoyo para TI.»

### 22.6 Consolidación (agente raíz)

Antes de `validate:claude-audits`, revisar una muestra de sustituciones: si `propuesto` es vago o `ubicacion_pantalla` es solo técnica, **reescribir** esas filas. `resumen_ejecutivo` / `nota_final_tic` siguen §20.5 + §22.1.

### 22.7 Relación con Checklist Editorial PTD / instrumentos IEW–IESD

**Fuente PTD (hitos → tareas → preguntas):** `docs/Checklist_Editorial_INAPI_v2_0_actualizado.docx` + catálogo máquina `data/checklist-editorial-ptd-v2.json`.  
**Inventario IEW/IESD por pregunta:** `docs/checklist-ptd-v2-mapa.md`.  
**Motor de score / Excel / UI (nuevas):** `data/checklist-criteria-lc-ptd.json` (**51** criterios LC v3.0). Históricos: `checklist-criteria.json` (47 A–H).

META MEI **2026** = solo **Lenguaje claro** (Dimensión 1 / CL1). Usabilidad y Seguridad están en el Word/JSON pero **no** entran al % §17 hasta el cierre de año (ver §23).

### 22.8 Ninguna casilla vacía (entrega a quien corrige)

En la entrega (UI / PDF / Excel MEI y en el JSON canónico) **ningún campo útil al implementador puede quedar en blanco** por “ya cumple” o “no aplica”.

| Estado / categoría presentación | Qué debe quedar escrito |
| --- | --- |
| `cumple` | `comentario` con evidencia de **qué se vio** (1–3 frases). |
| `incumple` + `severidad: baja` (UI: Cumple con observaciones) | `comentario` + fila en `sustituciones[]` con ubicación CMS + `propuesto` accionable (corrección menor). |
| `incumple` + `severidad: media` (UI: Medianamente cumple) | Idem; hallazgo de esta iteración. |
| `incumple` + `severidad: alta` (UI: No cumple) | Idem; prioridad alta. |
| `no_aplica` | `comentario` obligatorio (§20.4) explicando por qué la pregunta no cabe. |

**Coherencia instrucción ↔ herramienta:** si el criterio exige algo operativo (ej. «usar herramienta de validación ortográfica» / Legible `LC-1.1.3-01`), el `motivo` y el `propuesto` deben nombrar **cómo** hacerlo (herramienta sugerida o paso en el CMS) y **por qué**. Una fila que dice “no usa corrector” sin decir qué hacer queda **inválida** por vaguedad.

### 22.9 Realismo: no forzar correcciones donde el criterio no aplica al tipo de elemento

Evaluar **todos** los criterios ≠ inventar un defecto en cada atajo o ítem de menú.

| Criterio / caso | Regla de realismo |
| --- | --- |
| **LC-1.1.2-03** (qué / cómo / dónde / cuándo / para quién) | Aplicar a **párrafos, oraciones o recuadros informativos** del cuerpo (incl. páginas institucionales / hubs / Portada). **No** exigir resumen en ítems cortos de menú/navegación. **Prohibido** `no_aplica` solo porque «no es un trámite» (C-2026-08-25e); eso es `LC-1.1.2-04`. |
| **LC-1.1.4-01** (fecha) | Sin fecha visible → `incumple` + **`severidad: alta`** (No cumple). `media` solo si la fecha es parcial/ambigua, no si falta por completo (C-2026-08-25f). |
| **LC-1.1.3-05** (siglas en menú) | Puede incumplir si la sigla aparece sin definición. Preferir propuestas **sutiles** (tooltip/`title`, glosa, definición en destino). |
| **Claridad/Concisión/Legibilidad sobre navegación** | No tratar labels de menú como “oraciones” o “párrafos” a reescribir. |
| Páginas con poco texto | Es válido `no_aplica` o `cumple` con comentario breve; **no** fabricar `incumple` para “llenar” el checklist. |

### 22.10 Cruces (§20.3) + justificación propia, sin forzar el mismo nodo

Si varios criterios apuntan al **mismo** nodo/texto: primario descuenta; secundarios con `agrupado_en` / `criterios_relacionados` (§20.3). Cada uno mantiene **lógica de justificación propia** (responde su pregunta).

**Propuesto no repetido (C-2026-08-25):** el bloque largo de reescritura CMS vive **una vez** (criterio primario). Secundarios **no** pegar el mismo texto: justificación = respuesta a *su* pregunta; `propuesto` (si hace falta) = enfoque / tipo de palabras / estructura alineada a esa pregunta (concisión ≠ jerga ≠ lista).

**Pero:** no cruzar criterios solo para “aplicar los 51”. Si un criterio **no tiene necesidad real** de corrección en ese elemento (ej. Completitud/datos clave sobre un atajo de tres palabras), no inventar `incumple` ni un `propuesto` idéntico forzado. Preferir `cumple` con evidencia o `no_aplica` con comentario.

### 22.11 Plantillas de `propuesto` para ausencias frecuentes

**Fecha (`LC-1.1.4-01`)** — si no hay fecha visible:

- `estado`: `incumple` · `severidad`: **`alta`** (presentación: No cumple). No usar `media` si la ausencia es total (C-2026-08-25f).
- `ubicacion_pantalla`: zona donde debe ir (ej. «Bajo el título principal › línea de metadatos de la página»).
- `propuesto` (instrucción): `Añadir texto visible: «Publicado: DD de mes de AAAA» o «Actualizado: DD de mes de AAAA» (usar la fecha real de publicación/revisión).`
- No usar solo el © del pie como sustituto de fecha de actualización.

**Documento descargable (`LC-1.2.4-07` + `LC-1.2.4-08`)** — el `propuesto` debe cubrir **siempre** título + formato + peso + descripción:

Formato de ejemplo:

`Documento de solicitud de patentes (PDF, 245 KB) — Guía para solicitar una patente en Chile.`

Si Claude Code **no puede** conocer formato o peso exactos (enlace roto, descarga bloqueada, sin headers):

- `propuesto`: incluir título + descripción + instrucción explícita: `Especificar formato (p. ej. PDF) y peso en KB o MB junto al enlace; no dejar solo el nombre del archivo.`
- `motivo`: decir qué faltó medir y que el CMS debe completar formato/peso reales.
- **Prohibido** inventar KB/MB.

**Atajo / ítem de menú** — `ubicacion_pantalla` debe nombrar la zona del menú y el label exacto; `propuesto` = texto corto pegable **o** instrucción de interacción (tooltip WCAG), no un párrafo de cuerpo editorial.

### 22.12 Gate de consolidación §22 (agente raíz) — checklist duro

Antes de `validate:claude-audits`, el agente raíz **rechaza y reescribe** si encuentra:

1. `comentario` vacío en cualquier criterio (incluido `cumple`).
2. Sustitución con `ubicacion_pantalla` solo técnica, `propuesto` vago («mejorar claridad»), o `motivo` sin responder la pregunta del instrumento.
3. Completitud/datos clave aplicado solo a labels de navegación sin cuerpo informativo.
4. Documentos sin mención de título + formato + peso + descripción (o instrucción de completar formato/peso).
5. Criterio operativo (ortografía, legibilidad, corrector) sin **cómo** hacerlo efectivo.
6. `incumple` sin necesidad real en el tipo de elemento (forzado).
7. Entrega con `Tnnn`, «mapa D0», «Prompt N», `C-YYYY-…`, **`LC-*`** o códigos `1.1.x / 5.1.x` en texto/ubicación/propuesto/justificación.
8. Mismo `propuesto` largo copiado en criterios secundarios del mismo nodo (debe diferenciarse por la pregunta).
9. `cumple` con Texto en pantalla `—` / vacío cuando la justificación ya describe evidencia visible.
10. `propuesto` del tipo «Corregir incumplimiento de …» sin texto CMS ni paso de medición accionable.
11. Encabezado de criterio con «Dimensión: … 1.1.3» o paréntesis `(Instrumento: …)` en vez de `— Instrumento M: Nombre`.
12. Pregunta del criterio (o `Criterio N: «…» — Instrumento M`) dentro de Texto en pantalla / ubicación / propuesto / justificación (C-2026-08-25d).
13. `LC-1.1.2-03` en `no_aplica` solo porque «no es trámite» (C-2026-08-25e).
14. `LC-1.1.4-01` con ausencia total de fecha y `severidad` distinta de `alta` (C-2026-08-25f).
15. `LC-1.1.2-03` (u otro) con Texto «No hay texto que cumpla…» y `severidad` distinta de `alta` (C-2026-08-25g).
16. Entrega con `Tnnn`, `applicability`, IEW/IESD sueltos, o ubicación con «(indicar Cabecera…)» (C-2026-08-25h).
17. Negritas ausentes en párrafos citados con `severidad` distinta de `alta`, o Texto `(sin negrita…)` en vez del literal (C-2026-08-25j).
18. Explicaciones entre paréntesis mezcladas con otro texto en los 4 campos CMS (C-2026-08-25j).
19. Texto en pantalla = cita entre comillas **negada** en la justificación (p. ej. Cumple + Texto «en construcción» cuando el comentario dice que *no* hay «en construcción») (C-2026-08-25k).
20. Texto/original = meta entre paréntesis del tipo `(once párrafos…)` / `(estructura actual…)` en vez de literales de pantalla (C-2026-08-25k).

---

## 23. Orquestación PTD: Hito → Tarea → Pregunta (META MEI 2026 = LC)

*Obligatorio en reauditorías 1-URL a partir de la calibración con `Checklist_Editorial_INAPI_v2_0_actualizado.docx`.*

### 23.1 Fuentes

| Artefacto | Rol |
| --- | --- |
| `docs/Checklist_Editorial_INAPI_v2_0_actualizado.docx` | Checklist editorial humano: hitos PTD, tareas, preguntas IEW/IESD |
| `docs/Checklist_Editorial_INAPI_v2_0_actualizado.extracted.md` | Texto del Word para RAG Colección B |
| `data/checklist-editorial-ptd-v2.json` | Hitos PTD → tareas → preguntas + conteos |
| `docs/checklist-ptd-v2-mapa.md` | Cruce IEW↔IESD por indicador |
| `data/checklist-criteria-lc-ptd.json` | **51** filas LC v3.0 = score, UI, PDF, Excel MEI |
| `data/checklist-criteria.json` | Histórico 47 A–H (no usar en auditorías nuevas) |

### 23.1.1 Preguntas únicas IEW/IESD (sin duplicar entre instrumentos)

| Dimensión | Total único | Ambos | Solo IEW | Solo IESD | ¿En % §17 ahora? |
| --- | --- | --- | --- | --- | --- |
| **Lenguaje claro** | **51** | 39 | 10 | 2 | **Sí** — JSON canónico = 51 filas `LC-*` |
| **Usabilidad** | **18** | 16 | 1 | 1 | **No** (post-Excel LC) |
| **Seguridad** | **10** | 9 | 1 | 0 | **No** (salvo solape **LC-1.1.7-03**) |
| **Total 3 dimensiones** | **79** | 65 | 10 | 4 | — |

**Nota conteo LC:** el listado UX «8 solo IEW» agrupa «Contenidos sensibles ×3» como un tema; en filas son 10 exclusivas IEW (38+10+3=51).

**LC — exclusivas:** IEW = conectores, anti-redifusión, RUN, teléfonos/direcciones, sensibles (×3), 80 % hechos vs adjetivos, enlaces relacionados, visualización 1.3.1; IESD = variante claridad «servicio digital», variante concisión inicio+trámite. **Rótulos de enlace descriptivos (`LC-5.2.4-01`) aplican a ambos** (C-2026-08-25c).  
**Usabilidad — exclusivas:** IEW = botones de video; IESD = anclar interacciones si autenticado.  
**Seguridad — exclusiva IEW:** directorios internos no listables.

Al auditar LC, cubrir las **51** preguntas únicas aplicables a la URL. La misma pregunta bajo varios hitos PTD se responde **una** vez.

### 23.2 Alcance temporal

| Dimensión PTD | Proyecto | Auditoría Claude Code ahora | Después (fin 2026 / 2027–28) |
| --- | --- | --- | --- |
| Contenido y lenguaje claro | PTD-D2.1-CL1 | **Sí** — 51 criterios por indicadores | Mantener |
| Usabilidad | PTD-D2.1-US2 | **No** puntuar ni mezclar en % LC | Tras Excel LC coherente |
| Seguridad | PTD-D2.1-SE8 | **No** (salvo solape editorial **LC-1.1.7-03** ARCO) | Tras Usabilidad o en paralelo acordado |

### 23.3 Flujo por URL (además de §17)

1. Cargar `data/checklist-criteria-lc-ptd.json` (**51** criterios) y, para contexto de hitos, `data/checklist-editorial-ptd-v2.json` (dimensión CL1).
2. **Paso D0** (§17.1bis): mapa textual ascendente (Prompt 7). Luego, para cada **Indicador → Criterio (pregunta)**: responder con evidencia visible; agrupar trabajo por §17.1. Cobertura = **51** preguntas únicas aplicables.
3. Si la misma pregunta se repite en varias tareas del Word: **una** evidencia por URL.
4. Consolidar en exactamente **51** `criterios_evaluados` (ids `LC-*`) + `sustituciones[]` (§20 + §22). `version_checklist: "3.0"`.
5. En `nota_final_tic` / `resumen_ejecutivo`: cobertura PTD-LC v3.0 (51); sin score Usabilidad (18) ni Seguridad (10).
6. **Prohibido:** filas Usabilidad/Seguridad en el JSON canónico; emitir A1–H1 en auditorías nuevas.

### 23.4 Asignación orientativa Hito LC → grupos §17

| Hitos PTD (LC) | Énfasis (indicadores) | Grupos |
| --- | --- | --- |
| 492 (Completitud), 500, 509, 515*, 517, 519 | Completitud, Actualización, Escritura web, Archivo, Visualización | 1, 4 |
| 494 (solo Redacción), 496 (solo Lenguaje plano), 498 | Redacción `1.1.5`, Lenguaje plano `1.1.3`, Claridad, Concisión | 2, 3 |
| 502, 505 (503 RUN/tel · 504 ARCO), 513 (510/511/512) | PI, Privacidad, Sensibles | 5 |
| 507 | Legibilidad | 4 |

\*Visualización y sensibles: `no_aplica` / nota si no hay datos/menores — no forzar `incumple` vacío.

### 23.5 Gate de consolidación PTD-LC (agente raíz)

Antes de `validate:claude-audits`:

1. Exactamente **51** filas `LC-*` en orden del catálogo; cada una con `comentario` (§22.8).
2. Exclusivas IESD restantes (`LC-5.2.2-01`): aplicar en trámites/servicio digital; en sitioweb informativo → `no_aplica` justificado en lenguaje ciudadano. **`LC-5.2.1-01` (claridad servicio digital) y `LC-5.2.4-01` (rótulos/CTA) se evalúan en sitioweb y trámites** (C-2026-08-25h / C-2026-08-25c).
3. No omitir fecha (`LC-1.1.4-01`), documentos (`LC-1.2.4-07/08`), siglas (`LC-1.1.3-05`), datos clave (`LC-1.1.2-03`) con realismo §22.9–§22.11.
4. Confirmar que **no** se añadieron Usabilidad (18) ni Seguridad (10) al % de los **51**.
