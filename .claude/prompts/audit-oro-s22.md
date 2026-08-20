# Prompt: URLs “estándar de oro” (§22 + mapa PTD)

> Pegar en Claude Code (una URL por sesión). Objetivo: muestra calibrada para Equipo UX — copy accionable CMS + **todas las preguntas LC** del Checklist Editorial PTD v2.0 (Hito→Tarea→Pregunta).
> Prerrequisitos: `claude mcp list`, Chroma en `:8000`, leer CLAUDE.md **§22 + §23**, `data/checklist-editorial-ptd-v2.json`.

---

## Prompt (URL 1 — Portada)

Audita **exactamente UNA URL** como **estándar de oro** META MEI (CLAUDE.md §12 + §17 + §20 + §21 + **§22 completo**, esp. §22.8–§22.12).

Lee antes de capturar:

- `.claude/skills/auditoria-lc.md`
- `data/checklist-criteria-lc-ptd.json` (51 criterios LC v3.0)
- `data/checklist-editorial-ptd-v2.json` (hitos PTD CL1)
- `docs/checklist-ptd-v2-mapa.md`
- `.claude/prompts/audit-una-url.md` (flujo A–F)
- `docs/Checklist_Editorial_INAPI_v2_0_actualizado.docx` (referencia humana / RAG)

### URL objetivo

- URL: https://www.inapi.cl/
- `tipo_pagina`: sitioweb
- `fecha`: 2026-08-21
- `slug`: www-inapi-cl
- `id`: www-inapi-cl_2026-08-21
- Serie META MEI: orden 1 · Portada
- `captura_con_sesion`: false
- Id previo → `history[]`: www-inapi-cl_2026-08-20

### Énfasis de esta sesión (reunión UX)

1. **Ninguna casilla vacía:** los **51** criterios llevan `comentario` (también `cumple` / `no_aplica`).
2. **`ubicacion_pantalla`:** ruta humana (zona › bloque › elemento), p. ej. menú, atajo, cuerpo, pie — nunca solo Tnnn.
3. **`propuesto` accionable:** texto pegable o instrucción clara y concisa; si es menú/atajo, detalle suficiente para saber qué corregir y dónde.
4. **Realismo:** no aplicar datos clave (qué/cómo/dónde…) a labels de navegación; evaluar en párrafos/recuadros del cuerpo.
5. **Siglas en menú (`LC-1.1.3-05`):** si incumple, preferir tooltip / `title` / glosa / definición en destino (WCAG), sin congestionar el ítem.
6. **Fecha (`LC-1.1.4-01`):** si falta fecha, instrucción bajo el H1; © del pie no basta.
7. **Documentos (`LC-1.2.4-07/08`):** título + formato + peso + descripción; si no mides peso/formato, pedir que se especifiquen — no inventar KB.
8. **Coherencia:** si pides “usar corrector / medir legibilidad”, di **cómo** (herramienta o paso CMS).
9. Cruces §20.3 solo con necesidad real; justificación propia por criterio, sin forzar defectos.
10. **§23:** cubrir las **51** preguntas LC; JSON con **51** filas `LC-*` y `version_checklist: "3.0"`; **no** puntuar Usabilidad (18) ni Seguridad (10).

Flujo: captura Playwright (HTML + a11y) → inventario R+U → RAG → 5 sub-subagentes → consolidación + **gate §22.12** → `data/claude-audits/sitioweb/2026-08-21/www-inapi-cl_2026-08-21.json` → `bun run validate:claude-audits` → cablear launch + `mei-meta-mei-urls.ts` → commit atómico.

No abras una segunda URL hasta cerrar esta.

---

## Prompt (URL 2 — Noticia detalle; lanzar solo tras commit de la 1)

Misma profundidad §22. Sustituir bloque URL:

- URL: https://www.inapi.cl/sala-de-prensa/detalle-noticia/chile-alcanza-su-mayor-cifra-de-solicitudes-de-patentes-nacionales-en-mas-de-una-decada
- `tipo_pagina`: sitioweb
- `fecha`: 2026-08-21
- `slug`: www-inapi-cl-noticia-cifra-patentes-nacionales
- `id`: www-inapi-cl-noticia-cifra-patentes-nacionales_2026-08-21
- Serie META MEI: orden 9 · Últimas noticias (detalle 2/2)
- `captura_con_sesion`: false
- Id previo → `history[]`: www-inapi-cl-noticia-cifra-patentes-nacionales_2026-08-20

Énfasis extra en noticia: cuerpo editorial (completitud/claridad/concisión), fecha de publicación, enlaces/documentos si existen, siglas en texto vs menú.

JSON: `data/claude-audits/sitioweb/2026-08-21/www-inapi-cl-noticia-cifra-patentes-nacionales_2026-08-21.json`

---

## Criterio de aceptación de la muestra oro

Antes de mostrar a Equipo UX, el agente raíz confirma:

- [ ] **51** `comentario` no vacíos; ids `LC-*`; `version_checklist: "3.0"`
- [ ] Muestra de 5+ sustituciones leídas “en voz alta”: un editor CMS sabría dónde y qué pegar
- [ ] Cero “datos clave” inventados solo sobre menú
- [ ] Documentos/fecha conforme §22.11 si aplican
- [ ] `validate:claude-audits` OK + commit por URL
