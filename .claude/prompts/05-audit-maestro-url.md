# Prompt 5 — Maestro canónico: auditoría de UNA URL

## Qué es

Prompt **maestro** que se pega/ejecuta en Claude Code para auditar **exactamente una URL** INAPI con el checklist PTD-LC v3.0 (**51** `LC-*`), con rigor y veracidad.

## Para qué

Orquestar de punta a punta: stack → captura → inventario → **análisis textual ascendente (D0)** → **15 subagentes** (un indicador tras otro) → **5 sub-subagentes** de entrega → validación → UI/PDF/Excel → commit.

## Importancia

Es el **único contrato ejecutable por URL**. Los prompts 1–4, 6 y 7 lo alimentan. Para cola META MEI o muestra oro, se reutiliza **este mismo Prompt 5** (no hay prompts aparte de lote/oro).

## Cableado profundo

| Pieza | Relación |
| --- | --- |
| `../CLAUDE.md` | Reglas §5 · workflow §12 · **§17** · §19–§23 |
| `01-orquestacion-stack.md` | Prerrequisitos Playwright/Chroma/Xenova/LangChain |
| `02-criterios-hitos-correcciones.md` | 51 criterios, hitos/tareas, severidad, Playwright |
| `03-entrega-resultados.md` | Textos, validación, UI/PDF/Excel |
| `04-cableado-claude-md.md` | Cómo leer y cablear el grafo |
| `06-calibracion-hallazgos.md` | **Leer siempre** antes de puntuar |
| `07-analisis-texto-ascendente.md` | Contrato del Paso **D0** (palabra→párrafo) |
| `../skills/01-documentos-rag-ingest.md` | Documentos e instrumentos |
| `../skills/02-lenguaje-entrega-cms.md` | Lenguaje ciudadano |
| `../skills/03-instrucciones-subagentes-instrumentos.md` | Lotes por indicador |
| `../skills/04-xenova-langchain-rendimiento.md` | Vectores/chunks |
| `../skills/05-calibracion-persistente.md` | Persistencia de hallazgos |
| `../skills/06-analisis-texto-ascendente.md` | Instrucciones al subagente §17.1bis |
| `../diagrams/workflow_diagram.md` | Diagrama |
| Datos | `data/checklist-criteria-lc-ptd.json` · `checklist-editorial-ptd-v2.json` · mapa |
| Salida | `data/claude-audits/…` · launch TS · MEI |

**Cómo leer «§N»:** sección numerada de `CLAUDE.md`.

---

## Prerrequisitos

Seguir **Prompt 1**. Luego:

```bash
claude mcp list
chroma run --path ./rag/chroma_db --port 8000
bun run validate:claude-audits
# Re-ingestar B (y A) si cambió el contenido fuente — ver Prompt 1
```

Leer **Prompt 4** (cableado) + **Prompt 6** + skill **05** (calibración) + **Prompt 7** + skill **06** (texto ascendente) **antes** del Paso D.

---

## Prompt a pegar en Claude Code

Audita **exactamente UNA URL** con máxima profundidad (CLAUDE.md §12 + §17 + §20 + §21 + §22 + §23; §19 si sesión).
Aplica prompts `01`…`04`, `06` y `07`, y skills `01`…`06`.
No abras una segunda URL hasta `validate:claude-audits` + commit de esta.

### URL objetivo

TODO: completar

- URL: https://…
- `tipo_pagina`: sitioweb | tramites
- `fecha`: YYYY-MM-DD
- `slug`: …
- `id`: `{slug}_{fecha}`
- Serie / rol META MEI (si aplica): orden N · … (`mei-meta-mei-urls.ts`)
- `captura_con_sesion`: true | false
- Id previo a `history[]` (si reauditoría): …

### Principio rector

Responde las **51** preguntas del catálogo v3.0. No inventes copy genérico.
Cada `LC-*` = pregunta del Checklist Editorial PTD (Hito → Tarea → Indicador → Pregunta).
Estados solo: `cumple` | `incumple` | `no_aplica`. Severidad solo en `incumple`.
Cobertura 1:1 `incumple` → `sustituciones[]`. Solo evidencia **VISIBLE**. Entrega CMS-first (§22).
**Alcance 2026:** solo Lenguaje claro (51). No puntuar Usabilidad 18 ni Seguridad 10 (§23).

### Reglas duras de entrega (leer antes de escribir comentario/motivo/ubicacion)

Fallar el gate §22.12 si aparece cualquiera de esto en texto/ubicación/propuesto/justificación:

1. Inventario interno (`T001`, `T010`, `T020`…): **solo** en `texto_capturado` / inventario del Paso B; **nunca** en los 4 campos CMS.
2. Jerga de catálogo: `applicability`, `tipo_pagina` como jerga, `mapa D0`, Prompt N, `C-YYYY-…`, `LC-*`.
3. Siglas sueltas IEW / IESD / META MEI. Si hace falta: «Instrumento de Evaluación de Sitios Web (IEW)», «Instrumento de Evaluación de Servicios Digitales (IESD)», «muestra de evaluación institucional».
4. Instrucciones al auditor dentro de ubicación: «(indicar Cabecera…)», «describir en auditorías nuevas…».
5. Pregunta del criterio como «Texto en pantalla» (C-2026-08-25d).
6. Ausencia total («No hay texto que cumpla…») con `severidad: media` → debe ser **`alta` / No cumple** (C-2026-08-25f/g).
7. Criterio 15 (`LC-5.2.1-01`): evaluar en hubs de trámite; si no hay FAQ → `no_aplica` en lenguaje ciudadano (C-2026-08-25h), no por «es sitioweb/IESD».
8. Criterio 39 (`LC-1.2.4-04` negritas): párrafos sin negrita → `severidad: alta`; Texto = literales reales de esos párrafos/columnas, **nunca** `(sin negrita…)` (C-2026-08-25j).
9. **Paréntesis:** no explicaciones entre paréntesis mezcladas con otro texto. Solo se admite un campo cuyo **único** contenido sea una frase entre paréntesis de ausencia total sin literal citable.
10. **Citas negadas / meta (C-2026-08-25k):** no volcar a Texto comillas que la justificación niega («en construcción», «próximamente»…); no usar `(once párrafos…)` u otras meta-descripciones como Texto/original — citar literales reales.
11. **Escaneo ≠ negritas (C-2026-08-25l):** criterio 38 = subtítulos/listas/recuadros/jerarquía; criterio 39 = negrita en párrafos distintos. No `agrupado_en` ni `criterios_relacionados` cruzados si el `propuesto` no es el mismo. Literales **solo** de esta URL (no alt invisible ni copy de otra URL).
12. **No repetir entre criterios (C-2026-08-26a):** al avanzar al criterio N, releer hallazgos 1…N−1; propuesto/justificación **complementarios** o agrupación §20.3 solo si el propuesto es idéntico. Cada pregunta = foco propio (datos clave ≠ autonomía ≠ FAQ servicio ≠ escaneo).
13. Criterio 42 (rótulos/CTA): evaluar siempre (C-2026-08-25c).
14. Encabezado «Criterio N — Instrumento M» solo en título de fila, no en los 4 campos.
15. Commits: CLAUDE.md §5.1 / C-2026-08-25i.

Leer Prompt 6 completo (hasta **C-2026-08-26a**) + skill 05 ANTES de puntuar.

### Paso A — Stack y captura (Prompt 1)

1. Confirmar MCP Playwright + RAG y Chroma.
2. `playwright_navigate` → HTML → a11y (una sola vez).
3. Guardar HTML en `auditorias/htmls/{slug}_{fecha}.html`.
4. Si sesión: §19 (anonimizar). **Prohibido** reiniciar navegación por indicador.

### Paso B — Inventario R+U (agente raíz)

Formato skill `01` / legado Fase 0 LC:

```
T001 [R|U] [HTML-L{n}]: «texto literal» (contexto: …)
```

Solo VISIBLE. H1 visible (no `<title>`). Ausencias explícitas. Salida: inventario compartido — aún sin JSON final.

### Paso C — Catálogo + RAG + calibración

1. Cargar `checklist-criteria-lc-ptd.json` (51) y `checklist-editorial-ptd-v2.json` (hitos).
2. Leer **`06-calibracion-hallazgos.md`** completo + skill `05`.
3. RAG A/B puntual (skills `01` y `04`) si hay duda normativa o precedente — **solo apoyo**; no copiar estados de JSON antiguos (Prompt 6: reauditoría completa).
4. Skills de apoyo: `02` (tono), `03` (cómo lanzar subagentes), `06` (texto ascendente).
5. Si hay id previo: usarlo para `history[]` y contrastar patrones; **reevaluar todo el DOM actual** (modales, hero, secciones).

### Paso D0 — Análisis textual ascendente (OBLIGATORIO)

Antes de los 15 indicadores: lanzar el **subagente §17.1bis** (Prompt **7** + skill **06**).

1. Recorrer el inventario de **menor a mayor** granularidad: palabra/concepto → frase breve → frase larga/oración → párrafo/etapas → criterios de forma sobre esas unidades.
2. Detectar jerga técnico-jurídica INAPI y bloques «entendibles pero incompletos» (Observancia, cobertura, tasas/derechos, tres etapas, etc.).
3. Por cada unidad: criterios candidatos `LC-*`, diagnóstico, `propuesta_cms` (reemplazo **o** definición/descripción; etapas descritas).
4. Salida: **mapa** compartido para el Paso D. **Prohibido** saltar D0 o empezar los 15 sin ese mapa.

### Paso D — Subagentes por indicador (SECUENCIAL)

Ejecutar **en orden 1→15** un **subagente = un indicador** (CLAUDE.md §17.1 + skill `03`).
Cada subagente:

- Recibe el inventario completo + **mapa D0** + URL + calibraciones.
- Evalúa **todas** las preguntas `LC-*` de su indicador (IEW + IESD aplicable).
- Distingue códigos duales (`1.x.x` / `5.x.x`), exclusivos IEW (`1.1.8`, `1.3.1`) y variantes solo IESD.
- Entrega solo sus filas + borrador de sustituciones. **No** calcula el % total.
- **No** pasar al indicador siguiente hasta cerrar el actual.

Orden fijo: Fiabilidad → Completitud → Lenguaje plano → Actualización → Redacción/ortografía → PI → Privacidad → Contenidos sensibles → Claridad → Concisión → Legibilidad → Escritura web → Visualización → Objetividad → Archivo.

### Paso E — Sub-subagentes de entrega (después de los 15)

Con las 51 filas borrador, lanzar los **5 sub-subagentes** (§17.2) — pueden trabajar en paralelo sobre el mismo borrador:

1. **Campos de evidencia** — texto en pantalla, corrección, ubicación, justificación completos y coherentes; literales humanos (C-2026-08-25); sin `Tnnn`/mapa D0/Prompt en entrega.  
2. **Lenguaje ciudadano** — reescribe sin jerga TI/desarrollo (skill `02`); propuestas sin meta entre paréntesis; no repetir el mismo `propuesto` en criterios secundarios.  
3. **Veracidad y realismo** — preciso, humano, sin inventar defectos (§20.6 / §22.9).  
4. **Estructura Excel/tablas** — filas ordenadas, jerarquía clara, casillas no vacías, alineado a columnas de entrega (Prompt 3).  
5. **Higiene y sensibles** — PI, ARCO, RUN/teléfonos, contenidos sensibles, §18–§19.

El agente raíz consolida: 51 filas orden catálogo, cruces §20.3, `patron_sistema`, resumen, `nota_final_tic`.

### Paso F — Validar, cablear, commit (Prompt 3)

```bash
bun run validate:claude-audits
```

Cablear launch / muestra de evaluación institucional (`mei-meta-mei-urls.ts`).

**Commits (CLAUDE.md §5.1 — obligatorio, sin preguntar):**

1. Si tocaste capa de entrega o Prompt 6/skills → commit `feat|fix(entrega): …` (tests + validate OK).
2. Si una calibración vigente obligó a retocar JSON de URLs **ya cerradas** → commit `fix(audits): consistencia calibración C-…` (**no** abras menú «¿commitear / revertir / dejar?»; Prompt 6 ya autoriza).
3. Commit `feat(audits): …` de **esta** URL + DEVLOG.
4. `git status` limpio antes de decir «listo» (salvo `frontend/next-env.d.ts`).

Si hubo hallazgo **nuevo** de calibración: añadir bloque en Prompt 6 en el mismo turno o el siguiente inmediato.

---

## Multi-URL / muestra oro

- **Cola META MEI (1…11):** una sesión Claude Code = este Prompt 5 con una sola URL del orden en `src/lib/mei-export/mei-meta-mei-urls.ts`. Tras `validate` + commit, abrir la siguiente.
- **Muestra oro UX:** mismo Prompt 5 (p. ej. Portada orden 1 o noticia detalle) con énfasis §22 y lectura obligatoria de Prompt 6 + skill `05` + Prompt 7 + skill `06`.
- **Prohibido:** mezclar varias URLs en un solo pegado del maestro.
