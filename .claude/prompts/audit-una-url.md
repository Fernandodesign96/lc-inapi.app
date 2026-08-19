# Plantilla: Auditoría profunda de UNA URL (prompt maestro canónico)

> **Default META MEI / reauditoría §20:** una sesión Claude Code = **una URL**.
> Para 2 URLs hermanas (opcional) o lotes legacy, ver `audit-lote.md` (máx. 2 recomendado; 5 solo smoke).
> Referencias: `.claude/CLAUDE.md` §12, §17, §20, §21 · skills `auditoria-lc.md`.

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

Cada criterio del checklist es una **pregunta del instrumento** (IEW/IESD/RLC). Debes **responderla con evidencia**, no solo proponer un texto genérico. La fila en `sustituciones[]` es la consecuencia editorial de un `incumple`, no el sustituto de la pregunta.

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
| **U** Chrome UI / formato | Fechas visibles, listas/viñetas, alineación, espacios, enlaces PDF (título/formato/peso/desc), `alt`, encabezados de escaneo | D3–D5, D4, A9, E3, F4, H1 |

Solo **VISIBLE**. Sin `<title>` / `<meta>` / OG como evidencia de criterios.

### Paso C — RAG (antes de los subagentes)

Por URL (agente raíz o cada grupo, sin saturar):

1. Colección **A**: fundamento del `source` de los criterios dudosos del grupo.
2. Colección **B**: precedentes de la misma URL o patrón (home, marcas, formulario…).
3. No volcar PDFs enteros al chat: consultas puntuales vía MCP RAG.

### Paso D — 5 sub-subagentes en paralelo (§17)

Cada uno recibe: inventario R+U, URL, tipo, fecha, sesión, §20/§21, skill de su sección.

| Grupo | Criterios | Énfasis de evidencia |
| --- | --- | --- |
| 1 | A1–A9, E1–E4 | Estructura, A9 escaneo, E3 fecha visible, E4 = H1 |
| 2 | B1–B8, C1–C9 | Lenguaje; no marcar `cumple` sin releer citas |
| 3 | D1–D7 | Typos + D3/D4 con estilo computado si es dudoso |
| 4 | F1–F6 | F4 completo (4 elementos); F6 relacionados |
| 5 | G1–G3, H1 | §19 si sesión; alts / archivo |

**Instrucción obligatoria a cada subagente:**

> Evalúa SOLO tus criterios. Para **cada** id: (1) estado, (2) evidencia concreta (Tnnn, atributo, estilo, ausencia) o `no_aplica` con `comentario`, (3) si `incumple` → fila(s) en `sustituciones[]` con `ubicacion_pantalla` (sitioweb) y `capa: "VISIBLE"`. Prohibido `cumple` por omisión o “parece bien”. No calcules el % total ni escribas el JSON completo.

### Paso E — Consolidación (agente raíz)

1. Unir → exactamente **47** criterios orden A1…H1.
2. Aplicar §20.3 cruces solo si **toda** la evidencia del secundario es el mismo nodo/texto que el primario (`agrupado_en` / `criterios_relacionados`).
3. `patron_sistema: true` en shell Layout (sigue descontando).
4. Cobertura 1:1 `incumple` ↔ `sustituciones[]` (salvo agrupados documentados).
5. Calcular % / `estado_aceptacion` con `summarizeEvaluations` (respetar agrupados).
6. `resumen_ejecutivo` y `nota_final_tic` en lenguaje claro (§20.5).

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
