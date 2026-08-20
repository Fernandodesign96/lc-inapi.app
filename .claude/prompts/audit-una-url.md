# Plantilla: Auditoría profunda de UNA URL (prompt maestro canónico)

## Qué es este documento

Prompt **maestro canónico** que Claude Code pega/ejecuta para auditar **exactamente una URL** de INAPI con el checklist PTD-LC v3.0 (51 criterios `LC-*`).

## Para qué se utiliza

Definir de punta a punta: captura Playwright → inventario R+U → RAG → 5 sub-subagentes → consolidación CMS → validate → cable frontend → commit.

## Objetivo

Entregar un JSON canónico válido, accionable para editores CMS y cableado a `/auditar`, Excel MEI y PDF — sin mezclar otras URLs en la misma sesión.

## Importancia en la orquestación Claude Code

Es el **núcleo ejecutable**. `audit-lote.md` y `audit-oro-s22.md` delegan aquí. Sin este prompt no hay contrato único de Pasos A–F ni instrucción homogénea a los sub-subagentes.

## Cableado (conversa con)

| Pieza | Relación |
| --- | --- |
| `../CLAUDE.md` | Constitución: **reglas §5**, workflow §12, **sub-subagentes §17**, §19–§23 |
| `../skills/auditoria-lc.md` | Skill obligatoria (inventario + 51 criterios + estados/severidad) |
| `../skills/auditoria-calidad-web.md` | Fundamento IEW/IESD/RLC/MEI |
| `../skills/pesquisa-criterios.md` | Queries RAG A/B y catálogo |
| `audit-lote.md` | Coordinador multi-sesión que invoca este archivo por URL |
| `audit-oro-s22.md` | Muestra oro con la misma profundidad |
| `../diagrams/workflow_diagram.md` | Diagrama del grafo |
| Frontend | Paso F: `claude-audits-launch.ts`, `clarity-audits-launch.ts`, `mei-meta-mei-urls.ts` → `/auditar` |

**Reglas** = CLAUDE.md §5 (no hay `/rules` aparte). **Sub-subagentes** = CLAUDE.md §17 + Paso D de este prompt.

> Multi-sesión / cola 1…10: `audit-lote.md`. Muestra oro UX: `audit-oro-s22.md`.  
> Datos: `data/checklist-criteria-lc-ptd.json` (51) · `data/checklist-editorial-ptd-v2.json` · `docs/checklist-ptd-v2-mapa.md`.

**Cómo leer «§N»:** cada referencia apunta a una **sección numerada de `.claude/CLAUDE.md`**.

| Ref. | Sección | Qué despliega |
| --- | --- | --- |
| **§12** | Workflow una URL | Captura → inventario → JSON → validate → cable → commit |
| **§17** | Sub-subagentes | 5 grupos por indicadores `LC-*` |
| **§19** | Sesión autenticada | Anonimización; ARCO = `LC-1.1.7-03` |
| **§20** | Calibración | Solo VISIBLE; patrones; cruces; gate evidencia |
| **§21** | Playbook herramientas | Fecha, PDF, H1, estilos, a11y |
| **§22** | Entrega CMS | Copy accionable; casillas no vacías; realismo |
| **§23** | Alcance PTD-LC | Solo 51 LC en el %; US 18 / SE 10 fuera |

---

## Prerrequisitos

```bash
claude mcp list          # playwright + rag-auditoria activos
chroma run --path ./rag/chroma_db --port 8000   # terminal aparte
bun run validate:claude-audits                  # baseline OK
# Si catálogo / mapa / Word / auditorías cambiaron:
cd rag && bun run ingest:b && cd ..
```

---

## Prompt a pegar en Claude Code

Audita **exactamente UNA URL** con máxima profundidad (CLAUDE.md §12 + §17 + §20 + §21 + §22 + §23; §19 si sesión).
No abras una segunda URL hasta `validate:claude-audits` + commit de esta.

### URL objetivo

TODO: completar

- URL: https://…
- `tipo_pagina`: sitioweb | tramites
- `fecha`: YYYY-MM-DD
- `slug`: …
- `id`: `{slug}_{fecha}`
- Serie / rol META MEI (si aplica): orden N · … (ver `mei-meta-mei-urls.ts` / `audit-lote.md`)
- `captura_con_sesion`: true | false
- Id previo a `history[]` (si reauditoría): …

### Principio rector

Esta auditoría **responde preguntas de evaluación**, no inventa copy genérico. Cada id `LC-*` de las **51** filas en `data/checklist-criteria-lc-ptd.json` (`version_checklist: "3.0"`) es una pregunta del Checklist Editorial PTD (Hito → Tarea → Indicador → Pregunta en `data/checklist-editorial-ptd-v2.json`) y del instrumento IEW/IESD (`docs/checklist-ptd-v2-mapa.md`). Usa `display_label` en la entrega. Los códigos A–H de JSON históricos son **solo referencia**; las auditorías nuevas emiten **únicamente** `LC-*`.

**Alcance META MEI 2026:** solo Dimensión **Lenguaje claro** (51 criterios / indicadores). **No** puntuar Usabilidad (**18**) ni Seguridad (**10**) en el % (CLAUDE.md §23).

**Estados JSON (cerrados):** solo `"cumple"` \| `"incumple"` \| `"no_aplica"`. Nunca `null` ni otros valores. En todo `incumple` obligatorio `severidad`: `"baja"` \| `"media"` \| `"alta"` (omitir la clave en cumple/no_aplica). Presentación MEI/UI (derivada, no es un 4.º estado):

| `estado` + `severidad` | Etiqueta que ve el equipo |
| --- | --- |
| `cumple` | Cumple |
| `incumple` + `baja` | Cumple con observaciones |
| `incumple` + `media` | Medianamente cumple |
| `incumple` + `alta` | No cumple |
| `no_aplica` | No aplica |

«Cumple con observaciones» y «Medianamente cumple» **siguen siendo** `incumple` en JSON: exigen evidencia, `comentario` y al menos una fila en `sustituciones[]`.

**Cobertura 1:1:** cada `incumple` → ≥1 entrada en `sustituciones[]`, con propuesta **coherente y realista** (qué cambiar, dónde en pantalla, cómo lo aplica CMS o TI). Si no hay texto original: Inserción / Eliminación / instrucción explícita — nunca un `incumple` sin remedio accionable.

**Tipos de propuesta (CLAUDE.md §12):** Sustitución · Inserción · Eliminación · Reorden/estructura · Enlace/rótulo. Siempre **UX/CMS primero**; línea HTML (Ctrl+U) como apoyo TI.

**Audiencia y lenguaje (§22):** el lector primario es editor CMS / UX en Sitefinity, no desarrollador. Priorizar `ubicacion_pantalla` humana (zona › bloque › elemento); `linea` / `html_linea_aprox` es **apoyo TI**, secundario. `propuesto`, `motivo` y `comentario` en lenguaje de experiencia de usuario. **Ninguna casilla vacía** (§22.8). **Realismo** (§22.9): no forzar defectos donde el criterio no cabe (p. ej. «datos clave» solo sobre labels de menú).

**Evidencia (§20.6):** `cumple` solo con evidencia positiva en contenido **VISIBLE**; `no_aplica` solo con justificación; prohibido usar `<title>` / `<meta>` como prueba de título o contenido (usar H1 visible). Gate §22.12 antes de validar/commitear.

### Paso A — Captura (Playwright MCP, una vez)

Usar las capacidades del MCP al máximo (CLAUDE.md §8 / §11 / §21):

1. `playwright_navigate` → URL (esperar red estable / contenido principal).
2. `playwright_get_content` (o evaluate) → guardar HTML en `auditorias/htmls/{slug}_{fecha}.html`.
3. **Snapshot de accesibilidad** (árbol a11y / roles / nombres): resumen en inventario o anexo breve en `nota_final_tic` (H1 visible, alts, listas, headings).
4. Si hace falta para legibilidad (`LC-1.2.3-*`) o longitud de párrafo (`LC-1.2.2-02`): `evaluate` con `getComputedStyle` en bloques principales (no citar selectores CSS como único mensaje al CMS).
5. Para documentos (`LC-1.2.4-07/08`): listar enlaces visibles; si el copy no trae peso/formato, anotar **ausencia** — no inventar KB/MB.
6. Modales abribles con un clic (contacto/login): abrirlos y capturar texto **visible** (§20.1).
7. Si `captura_con_sesion: true`: no volcar PII al chat ni al HTML que se reingeste; aplicar §19 desde el inventario.

**Prohibido:** reiniciar navegación 5 veces (una por grupo). Una captura compartida para los 5 sub-subagentes.

### Paso B — Inventario en dos capas (agente raíz)

Antes de evaluar criterios (§17 / Pasos C–D), generar el inventario compartido `texto_capturado` (`T001…`) con **dos capas explícitas**. Formato (skill `auditoria-lc.md` Fase 0; CLAUDE.md §12 Paso 2 + §17):

```
T001 [R|U] [HTML-L{n}]: «texto literal» (contexto: navbar / H1 / párrafo / botón / footer / fecha / PDF)
T002 [R|U] [HTML-L{n}]: «texto literal» (contexto: ...)
```

| Capa | Qué inventariar | Sirve sobre todo a (indicadores `LC-*`) |
| --- | --- | --- |
| **R** Redacción | H1–H3, párrafos, CTAs, menús, footer, modales, glosas de siglas, textos de ayuda | Lenguaje plano (`LC-1.1.3-*`), Claridad/Concisión (`LC-1.2.1-*`, `LC-1.2.2-*`), Completitud (`LC-1.1.2-*`), Redacción (`LC-1.1.5-*`) |
| **U** Chrome UI / formato | Fechas **visibles**, listas/viñetas, alineación, espacios, enlaces a documentos (título / formato / peso / descripción), `alt`, encabezados útiles para escaneo, rótulos de botones | Legibilidad (`LC-1.2.3-*`), Escritura web (`LC-1.2.4-*`, `LC-5.2.4-01`), Actualización (`LC-1.1.4-01`), Archivo / Visualización (`LC-1.3.*`) |

**Reglas del inventario (obligatorias):**

1. **Alcance = solo VISIBLE** para el ciudadano. **No** inventariar ni usar como evidencia `<title>`, `<meta description>`, keywords, Open Graph ni otros nodos METADATA del `<head>`.
2. Numerar ocurrencias de texto visible en orden de aparición. Incluir siempre: H1–H3, primer párrafo del cuerpo, botones/CTAs, menú, footer, fecha si existe, enlaces a documentos, modales abribles con un clic (§20.1).
3. Fidelidad de título = **H1 visible**, nunca el título de pestaña.
4. Si falta un elemento esperado: marcar ausencia explícita — `(ausencia de H1)`, `(ausencia de fecha)`, `(PDF sin peso)`, `(imagen sin alt descriptivo)`, etc.
5. Cada `Tnnn` anclado a `html_linea_aprox` del HTML (apoyo TI). La entrega CMS usará `ubicacion_pantalla` humana en Pasos E / §22.
6. Hallazgos solo METADATA = fuera de alcance.
7. **Calibración (§20):** patrones de layout compartido — listar la ocurrencia visible con contexto claro (luego `patron_sistema: true`). Series Clarity: encabezado del servicio **visible**.
8. Si `captura_con_sesion: true` (**§19**): no transcribir valores reales del solicitante. Usar `«[valor de sesión — no transcribir]»` + etiqueta. Sí inventariar etiquetas, placeholders, instrucciones, títulos y botones institucionales.

**Salida:** inventario R+U completo y compartido. **No** emitir aún estados ni JSON canónico.

### Paso C — RAG + catálogo PTD LC (antes de los subagentes)

El RAG **no** sustituye leer los catálogos en disco. Antes de lanzar los 5 grupos:

1. **Cargar en contexto (archivos vigentes del repo):**
   - `data/checklist-criteria-lc-ptd.json` — **51** criterios LC v3.0 (ids / `display_label` / `source`)
   - `data/checklist-editorial-ptd-v2.json` — hitos PTD (CL1; inventarios US **18** / SE **10** catalogados, **sin** puntuarlos)
   - `docs/checklist-ptd-v2-mapa.md` + `docs/Checklist_Editorial_INAPI_v2_0_actualizado.extracted.md` (o Word) según necesidad
2. **Colección A** (`rag_search_normativa`): fundamento del `source` de criterios dudosos. Consultas **puntuales**; no volcar PDFs enteros.
3. **Colección B** (`rag_search_precedentes`): última ingesta de `rag/ingest-b.ts` — catálogo LC v3.0 + histórico v2.1; JSON hitos + Word extraído + mapa; JSONs en `data/claude-audits/{sitioweb,tramites}/`; ADRs `docs/adr/`.
4. **Re-ingesta** si esos archivos cambiaron: con Chroma en `:8000`, `cd rag && bun run ingest:b`. Sin re-ingestar → fragmentos obsoletos.
5. **Prohibido en B:** HTML con PII de sesión; literales de personas naturales. Solo JSON anonimizado (§18–§19).
6. Anclar queries a **esta** URL / patrón (1 URL por sesión). Preferir ids `LC-*` en la query.

### Paso D — 5 sub-subagentes en paralelo (§17)

Cada uno recibe: inventario R+U completo, URL, `tipo_pagina`, fecha, `captura_con_sesion`, calibración §20/§21/§22/§23, y skills:

- **Obligatoria:** `../skills/auditoria-lc.md`
- **Norma / citas:** `../skills/auditoria-calidad-web.md` cuando haga falta fundamento `source`
- **RAG / precedentes:** `../skills/pesquisa-criterios.md` ante duda de estado o severidad

Diagrama de esta etapa: `../diagrams/workflow_diagram.md` §6.

| Grupo | Indicadores | Criterios | Énfasis de evidencia |
| --- | --- | --- | --- |
| 1 | Fiabilidad, Completitud, Actualización, Objetividad, Archivo, Visualización | LC-1.1.1-*, LC-1.1.2-*, LC-1.1.4-*, LC-1.3.* | Completitud; fecha visible (§21); objetividad; archivo; apoyos visuales |
| 2 | Lenguaje plano | LC-1.1.3-01…06 | Legible; tono; jerga; abreviaturas; siglas; tono positivo |
| 3 | Redacción, Claridad, Concisión | LC-1.1.5-*, LC-1.2.1-*, LC-5.2.1-01, LC-1.2.2-*, LC-5.2.2-01 | Ortografía; conectores; FAQ; concisión |
| 4 | Legibilidad, Escritura web | LC-1.2.3-*, LC-1.2.4-*, LC-5.2.4-01 | Espaciado/alineación; PDF 4 elementos; pirámide; rótulos IESD |
| 5 | PI, Privacidad, Sensibles | LC-1.1.6-*, LC-1.1.7-*, LC-1.1.8-* | §19 si sesión; PI; **ARCO** (`LC-1.1.7-03`); sensibles |

**Instrucción obligatoria a cada subagente:**

> Evalúa SOLO tus criterios (CLAUDE.md §20–§23 + skill auditoria-lc). Usa ids `LC-*` y `display_label` de `checklist-criteria-lc-ptd.json`. Para **cada** id: (1) estado `cumple`\|`incumple`\|`no_aplica` (nunca null), (2) si `incumple` → `severidad` baja/media/alta (= Cumple con observaciones / Medianamente cumple / No cumple en UI) + sustitución §22 con `ubicacion_pantalla` CMS primero, (3) `comentario` **no vacío**. Prohibido `cumple` por omisión. No puntúes Usabilidad/Seguridad. Realismo §22.9. No calcules el % total ni escribas el JSON completo. Entrega solo tus filas + `sustituciones[]` de tu grupo.

**No consolidar** hasta que los 5 grupos entreguen output.

### Paso E — Consolidación (agente raíz)

1. Unir → exactamente **51** criterios en orden del catálogo LC-PTD; `version_checklist: "3.0"`.
2. Cruces **§20.3** solo si **toda** la evidencia del secundario es el mismo nodo/texto que el primario (`agrupado_en` / `criterios_relacionados`). El primario descuenta; documentar en lenguaje CMS.
3. `patron_sistema: true` en shell Layout (sigue descontando); `motivo` entendible para CMS (dónde lo ve el ciudadano + qué pedir a TI si es transversal).
4. Cobertura 1:1 `incumple` ↔ `sustituciones[]` (también severidad baja/media). CMS primero; HTML después. Tipos: Sustitución / Inserción / Eliminación / Reorden / Enlace-rótulo.
5. Todo hallazgo en `observaciones_lc_por_severidad` debe tener fila equivalente en `sustituciones[]`.
6. **Pase §22 duro (§22.12) + gate PTD-LC (§23.5):** reescribir si hay `comentario` vacío, ubicación solo técnica (`T042` sin ruta humana), o `propuesto` genérico; confirmar **51** filas y **cero** score US/SE. Nunca `null` en estados.
7. Calcular % / `estado_aceptacion` con `summarizeEvaluations` (respetar agrupados).
8. `resumen_ejecutivo` y `nota_final_tic` en lenguaje claro (§20.5 + §22); cobertura PTD-LC **51**; sin score US (**18**) / SE (**10**). Sin jerga de orquestación («sub-subagente», «capa R/U») en campos orientados a CMS.

### Paso F — Guardado, cableado, validación, commit

```bash
# JSON: data/claude-audits/{sitioweb|tramites}/{fecha}/{id}.json
bun run validate:claude-audits
# Cablear: claude-audits-launch.ts y/o clarity-audits-launch.ts
# META MEI: mei-meta-mei-urls.ts (auditId vigente; previo en history[])
bun run typecheck:all   # si hubo cableado TS
# Antes de push a main (checklist CLAUDE.md): bun run lint && bun run build
```

Commit atómico **por esta URL** (español, conventional commits).
Al cerrar el día o tras varios JSON nuevos: `cd rag && bun run ingest:b` para que Colección B indexe precedentes actualizados.

### Criterio de cierre de sesión

Solo entonces el usuario puede lanzar el prompt de la **siguiente** URL (`audit-lote.md` / siguiente orden META MEI / siguiente bloque oro).

Reportar: `%`, `estado_aceptacion`, conteo cumple/incumple/no_aplica, ids `LC-*` con severidad si incumple, si hubo agrupaciones §20.3, hallazgos clave (fecha / documentos / escaneo / siglas / privacidad).

---

## Notas

- Si Playwright MCP timeout: reiniciar Claude; fallback HTML a disco (evaluate / script) documentado en sesiones previas.
- Chroma **no** navega URLs; solo normativa (A) y precedentes del repo (B).
- No commitear `frontend/next-env.d.ts` ni `auditorias/.auth/*`.
- Ranks Clarity pendientes TI: no auditar hasta habilitación.
- «URL 2» en `audit-oro-s22.md` = orden META MEI **9** (noticia), no Marcas (orden 2).
