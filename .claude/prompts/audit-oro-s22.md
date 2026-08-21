# Prompt: URLs “estándar de oro” (§22 + mapa PTD)

## Qué es este documento

Plantillas de prompt para una **muestra calibrada** (estándar de oro) orientada a Equipo UX: copy CMS accionable + cobertura completa de las **51** preguntas LC.

## Para qué se utiliza

Fijar URL/slug/id/énfasis de Portada (orden 1), noticia cifra (orden **9**) y una tabla rápida para las demás órdenes META MEI — siempre con la profundidad de `audit-una-url.md`.

## Objetivo

Producir auditorías de referencia que resistan revisión “en voz alta” con editores CMS (dónde mirar, qué pegar).

## Importancia en la orquestación Claude Code

No reemplaza el prompt canónico: lo **especializa** con ids y énfasis UX. Mal interpretarlo (tratar el 2.º bloque como “paso 2 = Marcas”) rompe la cola META MEI.

## Cableado (conversa con)

| Pieza | Relación |
| --- | --- |
| `audit-una-url.md` | Flujo A–F + Principio rector (obligatorio) |
| `audit-lote.md` | Cola completa 1…10 si se audita toda la serie |
| `../CLAUDE.md` | **§22** entrega CMS; **§23** alcance; **§5** reglas; **§17** sub-subagentes |
| `../skills/auditoria-lc.md` (+ calidad-web, pesquisa) | Evaluación y fundamento |
| `../diagrams/workflow_diagram.md` | Vista general |
| Frontend / `mei-meta-mei-urls.ts` | Cable tras validate+commit |

**Reglas** = CLAUDE.md §5. **Sub-subagentes** = §17 vía `audit-una-url` Paso D.

> Prerrequisitos: `claude mcp list`, Chroma `:8000`, Colección B al día (`cd rag && bun run ingest:b` si cambió catálogo/mapa/Word).

**Orden META MEI:** 1 Portada → 2 Marcas → 3 Patentes → … → 9 noticia cifra → 10 SIAC.  
Bloques «URL 1» / segundo bloque de **este** archivo = plantillas oro (órdenes **1** y **9**), no el recorrido paso a paso.

---

## Contrato común (toda URL oro)

- Ids **`LC-*`** únicamente; `version_checklist: "3.0"`; **51** filas. A–H = solo JSON históricos.
- Estados JSON: solo `cumple` \| `incumple` \| `no_aplica` (nunca `null`).
- Todo `incumple` lleva `severidad` `baja` \| `media` \| `alta` → UI: Cumple con observaciones / Medianamente cumple / No cumple; y **≥1** fila en `sustituciones[]`.
- CMS primero (`ubicacion_pantalla`); HTML/Ctrl+U secundario. Ninguna casilla vacía (§22.8). Realismo (§22.9).
- Gate §22.12 + validate + cable + commit **antes** de la siguiente URL.

---

## Prompt (URL 1 — Portada · orden META MEI 1)

Audita **exactamente UNA URL** como **estándar de oro** META MEI (CLAUDE.md §12 + §17 + §20 + §21 + **§22 completo**, esp. §22.8–§22.12, + **§23**).

Lee antes de capturar:

- `.claude/prompts/audit-una-url.md` (flujo A–F + Principio rector)
- `.claude/skills/auditoria-lc.md`
- `data/checklist-criteria-lc-ptd.json` (51 criterios LC v3.0)
- `data/checklist-editorial-ptd-v2.json` (hitos PTD CL1)
- `docs/checklist-ptd-v2-mapa.md`
- `docs/Checklist_Editorial_INAPI_v2_0_actualizado.docx` / `.extracted.md` (referencia humana; ya en RAG Colección B tras `ingest:b`)

### URL objetivo

- URL: https://www.inapi.cl/
- `tipo_pagina`: sitioweb
- `fecha`: 2026-08-21
- `slug`: www-inapi-cl
- `id`: www-inapi-cl_2026-08-21
- Serie META MEI: **orden 1** · Portada
- `captura_con_sesion`: false
- Id previo → `history[]`: www-inapi-cl_2026-08-20

### Énfasis de esta sesión (reunión UX)

1. **Ninguna casilla vacía:** los **51** criterios llevan `comentario` (también `cumple` / `no_aplica`).
2. **`ubicacion_pantalla`:** ruta humana (zona › bloque › elemento) **antes** que línea HTML — menú, atajo, cuerpo, pie.
3. **`propuesto` accionable:** texto pegable o instrucción clara para editor CMS/Sitefinity; si es menú/atajo, detalle suficiente sin jerga de orquestación.
4. **Realismo:** no aplicar «datos clave» (qué/cómo/dónde…) a labels de navegación; evaluar en párrafos/recuadros del cuerpo.
5. **Siglas en menú (`LC-1.1.3-05`):** si incumple, preferir tooltip / `title` / glosa / definición en destino (WCAG), sin congestionar el ítem.
6. **Fecha (`LC-1.1.4-01`):** si falta fecha visible, instrucción bajo el H1; © del pie **no** basta.
7. **Documentos (`LC-1.2.4-07/08`):** título + formato + peso + descripción; si no mides peso/formato, pedir que se especifiquen — no inventar KB.
8. **Severidad:** en todo `incumple` usar `baja`/`media`/`alta` + fila en `sustituciones[]` (también «cumple con observaciones» / «medianamente cumple»).
9. Cruces §20.3 solo con necesidad real (mismo nodo/texto); justificación propia por criterio; sin forzar defectos.
10. **§23:** cubrir las **51** preguntas LC; **no** puntuar Usabilidad (18) ni Seguridad (10).
11. Patrones sistémicos (modales OK/Aceptar, H1 genérico, mayúsculas de menú): explicarlos en lenguaje CMS en `motivo` / `nota_final_tic`. **LC-1.3.1-01:** si hay banners/íconos/imágenes → `cumple`; no incumplir por texto alternativo (fuera del %; nota CMS opcional).
12. **Lenguaje CMS (§22):** en `original`/`propuesto`/`motivo` no abrir con `alt=`, `<img`, `href=` ni selectores CSS; describir lo que se ve en pantalla.
13. **Títulos/secciones:** revisar jerga legal en encabezados (ej. «Observancia») aunque exista subtítulo explicativo (LC-1.1.3-03 + LC-1.2.4-02). Igual en menú, tooltips y otras URLs.
14. **Apoyos visuales + texto:** LC-1.3.1-01 = presencia; jerarquía/escaneo = LC-1.2.4-01/03. No puntuar arquitectura de información fina (Usabilidad).

Flujo: captura Playwright (HTML + a11y) → inventario R+U (§ Paso B) → RAG A/B (§ Paso C) → 5 sub-subagentes (§17) → consolidación + **gate §22.12** →  
`data/claude-audits/sitioweb/2026-08-21/www-inapi-cl_2026-08-21.json` → `bun run validate:claude-audits` → cablear `claude-audits-launch.ts` + `mei-meta-mei-urls.ts` → commit atómico.

**No abras otra URL hasta cerrar esta.**

---

## Prompt (URL — Noticia detalle · orden META MEI 9)

> **Nombre en este archivo:** «segundo bloque oro». **Orden en la serie META MEI: 9.**  
> Lanzar solo tras commit de la URL que estés cerrando antes en tu cola (si sigues el recorrido 1…10, eso implica haber cerrado 1–8; si solo muestras oro Portada+noticia, tras commit de Portada).

Misma profundidad §22 / §23 y mismo contrato común. Sustituir bloque URL:

- URL: https://www.inapi.cl/sala-de-prensa/detalle-noticia/chile-alcanza-su-mayor-cifra-de-solicitudes-de-patentes-nacionales-en-mas-de-una-decada
- `tipo_pagina`: sitioweb
- `fecha`: 2026-08-21
- `slug`: www-inapi-cl-noticia-cifra-patentes-nacionales
- `id`: www-inapi-cl-noticia-cifra-patentes-nacionales_2026-08-21
- Serie META MEI: **orden 9** · Últimas noticias (detalle 2/2)
- `captura_con_sesion`: false
- Id previo → `history[]`: www-inapi-cl-noticia-cifra-patentes-nacionales_2026-08-20

### Énfasis extra (noticia)

- Cuerpo editorial: completitud / claridad / concisión (`LC-1.1.2-*`, `LC-1.2.1-*`, `LC-1.2.2-*`).
- Fecha de publicación **visible** (`LC-1.1.4-01`).
- Enlaces y documentos si existen (`LC-1.2.4-07/08`, rótulos).
- Siglas en **texto** del cuerpo vs siglas en menú (propuestas distintas; realismo §22.9).
- H1 visible alineado al contenido (nunca `<title>` como evidencia).

JSON: `data/claude-audits/sitioweb/2026-08-21/www-inapi-cl-noticia-cifra-patentes-nacionales_2026-08-21.json`

---

## Plantilla rápida — otras órdenes (2–8, 10)

Copiar el Prompt de Portada y reemplazar:

| Orden | URL / nota | Énfasis típico |
| --- | --- | --- |
| 2 Marcas | `/marcas` | Menú/atajos, completitud del servicio, documentos, siglas |
| 3 Patentes | `/patentes` | Igual + jerga PI / siglas PCT etc. |
| 4 Acerca de | `/acerca-de/inapi` | Completitud institucional, objetividad, fecha |
| 5 Buscador noticias | query noticias | Resultados visibles, rótulos, escaneo |
| 6 Solicitud Nueva | `/marcas/tramites/solicitud-nueva` | Info del trámite; no inventar datos de formulario |
| 7 Listado noticias | `/sala-de-prensa/noticias` | Listados, fechas, enlaces descriptivos |
| 8 Noticia 1/2 | Cuenta Pública (ver `mei-meta-mei-urls.ts`) | Igual que orden 9 |
| 10 SIAC | `tramites.inapi.cl/siac` | `tramites`; §19 si hay sesión; ARCO `LC-1.1.7-03` |

Cola completa: `audit-lote.md`.

---

## Criterio de aceptación de la muestra oro

Antes de mostrar a Equipo UX, el agente raíz confirma:

- [ ] **51** `comentario` no vacíos; ids `LC-*`; `version_checklist: "3.0"`
- [ ] Estados sin `null`; cada `incumple` con `severidad` + `sustituciones[]`
- [ ] Muestra de 5+ sustituciones leídas “en voz alta”: un editor CMS sabría **dónde** y **qué** pegar
- [ ] Cero «datos clave» inventados solo sobre menú
- [ ] Documentos/fecha conforme §22.11 / playbook §21 si aplican
- [ ] Sin score US/SE; cruces §20.3 solo mismo nodo
- [ ] `validate:claude-audits` OK + commit por URL
- [ ] RAG Colección B re-ingestada si se indexarán estos JSON como precedentes
