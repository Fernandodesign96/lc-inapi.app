# Plantilla: Auditoría de lote de URLs con sub-subagentes

> Copia y pega este prompt directamente en Claude Code Pro (bash).
> Completa las secciones marcadas con `TODO` antes de enviar.
> Referencia arquitectónica: `.claude/CLAUDE.md` §14 (lote) y §17 (sub-subagentes).

---

## Prerrequisitos (verificar antes de lanzar)

```bash
claude mcp list          # confirmar que playwright y rag-auditoria aparecen como activos
chroma run --path ./rag/chroma_db --port 8000 &   # dejar corriendo en terminal aparte

```
## Prompt a pegar en Claude Code Pro

Vamos a auditar el siguiente lote de URLs con la arquitectura de sub-subagentes (CLAUDE.md §17).

### URLs del lote

TODO: reemplazar con las URLs reales (máximo 5)

1. https://tramites.inapi.cl/...   (tipo_pagina: tramites | serie: clarity | rank: N)
2. https://tramites.inapi.cl/...   (tipo_pagina: tramites | serie: clarity | rank: N)
3. ...

### Instrucciones de ejecución

Para CADA URL, ejecuta el siguiente flujo de forma secuencial (termina una URL antes de empezar la siguiente):

**Paso 1 — Captura HTML (una sola vez por URL)**
- Usar Playwright MCP: `playwright_navigate` → `playwright_get_content`
- Guardar el HTML capturado como `texto_capturado` para compartirlo con los 5 sub-subagentes

**Paso 2 — 5 Sub-subagentes en paralelo**
Lanzar los 5 sub-subagentes simultáneamente, cada uno con:
- El `texto_capturado` completo
- La URL, tipo_pagina y fecha de hoy (TODO: reemplazar fecha)
- Su sección asignada del checklist:

  | Sub-subagente | Secciones | Skill |
  |---|---|---|
  | Grupo 1 | A1–A5, E1–E4 | auditoria-lc.md §A,§E + auditoria-calidad-web.md |
  | Grupo 2 | B1–B7, C1–C7 | auditoria-lc.md §B,§C + auditoria-calidad-web.md |
  | Grupo 3 | D1–D7        | auditoria-lc.md §D + auditoria-calidad-web.md |
  | Grupo 4 | F1–F5        | auditoria-lc.md §F + auditoria-calidad-web.md |
  | Grupo 5 | G1–G3, H1    | auditoria-lc.md §G,§H + auditoria-calidad-web.md |

Instrucción a cada sub-subagente:
> "Evalúa SOLO los criterios de tu sección. Entrega ÚNICAMENTE: (1) el array `criterios_evaluados[]` de tu sección + (2) el array `sustituciones[]` correspondiente. No calcules resumen total ni escribas JSON completo."

Para precedentes, cargar `pesquisa-criterios.md` y consultar RAG MCP Colección B antes de evaluar.

**Paso 3 — Consolidación (agente raíz)**
- Unir los 5 arrays de criterios → exactamente 39 entradas, orden A1…H1
- Unir todos los `sustituciones[]`; si hay conflicto en la misma `linea`, retener `severidad` más alta
- Calcular: `criterios_aprobados`, `criterios_aplicables`, `porcentaje_cumplimiento`, `estado_aceptacion`
- Verificar: 39 criterios exactos + cobertura 1:1 `incumple` ↔ `sustituciones[]`

**Paso 4 — Guardado y validación**
- Ruta: `data/claude-audits/urls-clarity/{slug-url}_{YYYY-MM-DD}.json`
- Ejecutar: `bun run validate:claude-audits` (debe pasar sin errores)

**Paso 5 — Commit por URL**
```bash
git add data/claude-audits/urls-clarity/{id}.json
git commit -m "feat(audits): agregar auditoría {slug-url} — {estado} {porcentaje}%"
```

### Una vez completado el lote

```bash
bun run validate:claude-audits   # verificación final de todos los JSONs
git log --oneline -5             # confirmar commits del lote
```

Reportar al finalizar:
- URLs auditadas con su `porcentaje_cumplimiento` y `estado_aceptacion`
- Cualquier criterio que requiera calibración con el Equipo UX (G1, D7, E3)

---

## Notas de uso

- **Límite:** máximo 5 URLs por lote antes de verificar resultados.
- **No lanzar el Paso 3** hasta que los 5 sub-subagentes hayan entregado su output.
- **Sin RAG:** si Chroma no está corriendo, los sub-subagentes operan con `CLAUDE.md` + skills solamente (Fase 0 degradada).
- **HTMLs del lote:** se guardan en `auditorias/lote-{fecha}/` (en `.gitignore`).
