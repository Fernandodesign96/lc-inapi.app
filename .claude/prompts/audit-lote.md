# Plantilla: Auditoría de lote de URLs con sub-subagentes

> Copia y pega este prompt directamente en Claude Code Pro (bash).
> Completa las secciones marcadas con `TODO` antes de enviar.
> Referencia arquitectónica: `.claude/CLAUDE.md` §14 (lote), §17 (sub-subagentes) y §19 (sesión autenticada).

---

## Prerrequisitos (verificar antes de lanzar)

```bash
claude mcp list          # confirmar que playwright y rag-auditoria aparecen como activos
chroma run --path ./rag/chroma_db --port 8000 &   # dejar corriendo en terminal aparte
```

**URLs post-login:** crear sesión una vez con `playwright codegen --save-storage=auditorias/.auth/tramites-session.json` y capturar con `bun run capture:tramites-html` (ver `docs/fase-3-3-captura-auth-claveunica.md`).

## Prompt a pegar en Claude Code Pro

Vamos a auditar el siguiente lote de URLs con la arquitectura de sub-subagentes (CLAUDE.md §17).

### URLs del lote

TODO: reemplazar con las URLs reales (máximo 5)

1. https://tramites.inapi.cl/...   (tipo_pagina: tramites | serie: clarity | rank: N | captura_con_sesion: true|false)
2. https://tramites.inapi.cl/...   (tipo_pagina: tramites | serie: clarity | rank: N | captura_con_sesion: true|false)
3. ...

### Instrucciones de ejecución

Para CADA URL, ejecuta el siguiente flujo de forma secuencial (termina una URL antes de empezar la siguiente):

**Paso 1 — Captura HTML (una sola vez por URL)**

- **URLs públicas:** Playwright MCP → `playwright_navigate` → `playwright_get_content` → guardar en `auditorias/htmls/{slug}_{fecha}.html`
- **URLs post-login (`captura_con_sesion: true`):** `bun run capture:tramites-html -- --url "..." --slug "..." --date "YYYY-MM-DD"` (requiere `auditorias/.auth/tramites-session.json`)
- Compartir el HTML como `texto_capturado` anonimizado (inventario T001…) con los 5 sub-subagentes
- Si `captura_con_sesion: true`, aplicar **CLAUDE.md §19** en todos los grupos (especialmente Grupo 5)

**Paso 2 — 5 Sub-subagentes en paralelo**

Lanzar los 5 sub-subagentes simultáneamente, cada uno con:
- El `texto_capturado` completo (inventario anonimizado si hay sesión)
- La URL, `tipo_pagina`, `fecha` y `captura_con_sesion`
- Su sección asignada del checklist:

  | Sub-subagente | Secciones | Skill |
  |---|---|---|
  | Grupo 1 | A1–A5, E1–E4 | auditoria-lc.md §A,§E + auditoria-calidad-web.md |
  | Grupo 2 | B1–B7, C1–C7 | auditoria-lc.md §B,§C + auditoria-calidad-web.md |
  | Grupo 3 | D1–D7        | auditoria-lc.md §D + auditoria-calidad-web.md |
  | Grupo 4 | F1–F5        | auditoria-lc.md §F + auditoria-calidad-web.md |
  | Grupo 5 | G1–G3, H1    | auditoria-lc.md §G,§H + **CLAUDE.md §19** si sesión |

Instrucción a cada sub-subagente:
> "Evalúa SOLO los criterios de tu sección. Entrega ÚNICAMENTE: (1) el array `criterios_evaluados[]` de tu sección + (2) el array `sustituciones[]` correspondiente. No calcules resumen total ni escribas JSON completo. Si `captura_con_sesion: true`, anonimiza citas y no marques G1 por datos del solicitante en su formulario."

Para precedentes, cargar `pesquisa-criterios.md` y consultar RAG MCP Colección B antes de evaluar.

**Paso 3 — Consolidación (agente raíz)**
- Unir los 5 arrays de criterios → exactamente 39 entradas, orden A1…H1
- Unir todos los `sustituciones[]`; si hay conflicto en la misma `linea`, retener `severidad` más alta
- Calcular: `criterios_aprobados`, `criterios_aplicables`, `porcentaje_cumplimiento`, `estado_aceptacion`
- Verificar: 39 criterios exactos + cobertura 1:1 `incumple` ↔ `sustituciones[]`
- Verificar anonimización si `captura_con_sesion: true`

**Paso 4 — Guardado y validación**
- Ruta: `data/claude-audits/{tramites|sitioweb}/{YYYY-MM-DD}/{slug-url}_{YYYY-MM-DD}.json`
- Ejecutar: `bun run validate:claude-audits` (debe pasar sin errores)

**Paso 5 — Commit por URL**
```bash
git add data/claude-audits/tramites/...   # o sitioweb/
git commit -m "feat(audits): agregar auditoría {slug-url} — {estado} {porcentaje}%"
```

### Una vez completado el lote

```bash
bun run validate:claude-audits   # verificación final de todos los JSONs
bun run rag/ingest-b.ts          # reindexar precedentes si hay JSON nuevos
git log --oneline -5             # confirmar commits del lote
```

Reportar al finalizar:
- URLs auditadas con su `porcentaje_cumplimiento` y `estado_aceptacion`
- Si usaron `captura_con_sesion: true`
- Cualquier criterio que requiera calibración con el Equipo UX (G1, D7, E3)

---

## Notas de uso

- **Límite:** máximo 5 URLs por lote antes de verificar resultados.
- **No lanzar el Paso 3** hasta que los 5 sub-subagentes hayan entregado su output.
- **Sin RAG:** si Chroma no está corriendo, los sub-subagentes operan con `CLAUDE.md` + skills solamente (degradado).
- **Chroma no navega URLs** — solo aporta normativa y precedentes durante el análisis.
- **Ranks pendientes TI (no auditar):** 8, 11, 13, 15 — ver `docs/fase-3-3-captura-auth-claveunica.md` §3.
- **HTMLs del lote:** `auditorias/htmls/` (versionar `.html`/`.txt`; revisar que no contengan PII antes de commit).
