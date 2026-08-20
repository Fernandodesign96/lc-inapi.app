# Plantilla: Auditoría profunda de UNA URL (prompt maestro canónico)

> **Default META MEI / reauditoría §20:** una sesión Claude Code = **una URL**.
> Para 2 URLs hermanas (opcional) o lotes legacy, ver `audit-lote.md` (máx. 2 recomendado; 5 solo smoke).
> Referencias: `.claude/CLAUDE.md` §12, §17, §20, §21, **§22**, **§23** · skills `auditoria-lc.md` · `data/checklist-editorial-ptd-v2.json` · mapa `docs/checklist-ptd-v2-mapa.md`.

---

## Prerrequisitos

```bash
claude mcp list          # playwright + rag-auditoria activos
chroma run --path ./rag/chroma_db --port 8000 &   # terminal aparte
bun run validate:claude-audits   # baseline OK antes de empezar
```

---

## Prompt a pegar en Claude Code

Audita **exactamente UNA URL** con máxima profundidad (CLAUDE.md §12 + §17 + §20 + §21).
No abras una segunda URL hasta `validate:claude-audits` + commit de esta.

### URL objetivo

TODO: completar

- URL: https://…
- `tipo_pagina`: sitioweb | tramites
- `fecha`: YYYY-MM-DD
- `slug`: …
- `id`: `{slug}_{fecha}`
- Serie / rol META MEI (si aplica): orden N · …
- `captura_con_sesion`: true | false
- Id previo a `history[]` (si reauditoría): …

### Principio rector

Cada criterio A–H responde **preguntas del Checklist Editorial PTD v2.0** (Hito → Tarea → Indicador → Pregunta en `data/checklist-editorial-ptd-v2.json`, Dimensión LC) y del instrumento IEW/IESD (`docs/checklist-ptd-v2-mapa.md`). Debes **responderlas con evidencia**, no solo proponer un texto genérico. La fila en `sustituciones[]` es la consecuencia editorial de un `incumple`.

**Alcance META MEI 2026:** solo **Lenguaje claro** (**51** criterios / indicadores IEW·IESD, `version_checklist: "3.0"`). No puntuar Usabilidad (**18**) ni Seguridad (**10**) en el % (CLAUDE.md §23).

**Audiencia:** quien implementa correcciones en Sitefinity/CMS. **Ninguna casilla vacía** (§22.8). **Realismo** (§22.9).

### Paso A — Captura (Playwright MCP, una vez)

Usar las capacidades del MCP al máximo:

1. `playwright_navigate` → URL (esperar red estable / contenido principal).
2. `playwright_get_content` (o evaluate) → guardar HTML en `auditorias/htmls/{slug}_{fecha}.html`.
3. **Snapshot de accesibilidad** (árbol a11y / roles / nombres): guardar resumen en el inventario o anexo breve en `nota_final_tic` si ayuda a H1/alts/estructura.
4. Si hace falta para D4/D3/C5: `evaluate` con `getComputedStyle` en bloques principales (alineación, márgenes, tipografía).
5. Para F4: listar enlaces a documentos; si el copy no trae peso, anotar ausencia de «(PDF, X KB)» — no inventar MB.
6. Modales abribles con un clic (contacto/login): abrirlos y capturar texto visible (§20.1).

**Prohibido:** reiniciar navegación 5 veces (una por grupo). Una captura compartida.

### Paso B — Inventario en dos capas (agente raíz)

Generar `texto_capturado` (T001…) con **dos capas explícitas**:

| Capa | Qué inventariar | Sirve a |
| --- | --- | --- |
| **R** Redacción | H1–H3, párrafos, CTAs, menús, footer, modales, glosas | B, C, parte A/E/F |
| **U** Chrome UI / formato | Fechas visibles, listas/viñetas, alineación, espacios, enlaces PDF (título/formato/peso/desc), `alt`, encabezados de escaneo | Legibilidad, Escritura web, Actualización, Archivo |

Solo **VISIBLE**. Sin `<title>` / `<meta>` / OG como evidencia de criterios.

### Paso C — RAG + catálogo PTD LC (antes de los subagentes)

1. Cargar `data/checklist-criteria-lc-ptd.json` (**51** criterios) y, para hitos, `data/checklist-editorial-ptd-v2.json` (CL1).
2. Colección **A**: fundamento del `source` de los criterios dudosos del grupo.
3. Colección **B**: precedentes + Word/mapa PTD (`Checklist_Editorial_…extracted.md`, `checklist-ptd-v2-mapa.md`).
4. No volcar PDFs enteros al chat: consultas puntuales vía MCP RAG.

### Paso D — 5 sub-subagentes en paralelo (§17)

Cada uno recibe: inventario R+U, URL, tipo, fecha, sesión, §20/§21, skill de su sección.

| Grupo | Criterios | Énfasis de evidencia |
| --- | --- | --- |
| 1 | LC-1.1.1-*, LC-1.1.2-*, LC-1.1.4-*, LC-1.3.* | Completitud, fecha visible, objetividad, archivo, visualización |
| 2 | LC-1.1.3-01…06 | Lenguaje plano / Legible / siglas |
| 3 | LC-1.1.5-*, LC-1.2.1-*, LC-5.2.1-01, LC-1.2.2-*, LC-5.2.2-01 | Ortografía, claridad, concisión |
| 4 | LC-1.2.3-*, LC-1.2.4-*, LC-5.2.4-01 | Legibilidad; PDF 4 elementos; rótulos IESD |
| 5 | LC-1.1.6-*, LC-1.1.7-*, LC-1.1.8-* | §19 si sesión; PI; ARCO; sensibles |

**Instrucción obligatoria a cada subagente:**

> Evalúa SOLO tus criterios (CLAUDE.md §20–§23 + skill auditoria-lc). Usa ids `LC-*` y `display_label` de `checklist-criteria-lc-ptd.json`. Para **cada** id: (1) estado que responde la pregunta, (2) `comentario` **no vacío**, (3) si `incumple` → sustitución §22. No puntúes Usabilidad/Seguridad. Realismo §22.9. No calcules el % total ni escribas el JSON completo.

### Paso E — Consolidación (agente raíz)

1. Unir → exactamente **51** criterios orden del catálogo LC-PTD; `version_checklist: "3.0"`.
2. Aplicar §20.3 cruces solo si **toda** la evidencia del secundario es el mismo nodo/texto que el primario (`agrupado_en` / `criterios_relacionados`).
3. `patron_sistema: true` en shell Layout (sigue descontando).
4. Cobertura 1:1 `incumple` ↔ `sustituciones[]` (salvo agrupados documentados).
5. **Pase §22 duro (§22.12) + gate PTD-LC (§23.5):** reescribir si hay `comentario` vacío, ubicación solo técnica, propuesto genérico; confirmar **51** filas y **cero** score de Usabilidad/Seguridad.
6. Calcular % / `estado_aceptacion` con `summarizeEvaluations` (respetar agrupados).
7. `resumen_ejecutivo` y `nota_final_tic` en lenguaje claro (§20.5 + §22); cobertura PTD-LC **51**; sin score US (**18**) / SE (**10**).

### Paso F — Guardado, cableado, validación, commit

```bash
# JSON: data/claude-audits/{sitioweb|tramites}/{fecha}/{id}.json
bun run validate:claude-audits
# Cablear: claude-audits-launch.ts y/o clarity-audits-launch.ts + mei-meta-mei-urls.ts si META MEI
bun run typecheck:all   # si hubo cableado TS
```

Commit atómico **por esta URL** (español, conventional commits).
Opcional al final del día: `bun run rag/ingest-b.ts`.

### Criterio de cierre de sesión

Solo entonces el usuario puede lanzar el prompt de la **siguiente** URL.
Reportar: `%`, estado, ids, si hubo agrupaciones §20, hallazgos D4/E3/F4/A9.

---

## Notas

- Si Playwright MCP timeout: reiniciar Claude; fallback HTML a disco (evaluate / script) documentado en sesiones previas.
- Chroma **no** navega URLs; solo normativa y precedentes.
- No commitear `frontend/next-env.d.ts`.
