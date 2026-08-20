# -*- coding: utf-8 -*-
from pathlib import Path

p = Path(".claude/CLAUDE.md")
t = p.read_text(encoding="utf-8")

# Section 3 table row
t = t.replace(
    "| `data/checklist-criteria.json` | Fuente de verdad — 47 criterios v2.1 (enunciado, verificación, fuente, applicability) |",
    "| `data/checklist-criteria-lc-ptd.json` | **Fuente vigente** — 51 criterios LC v3.0 (indicadores IEW/IESD) |\n"
    "| `data/checklist-criteria.json` | Histórico v2.1 (47 A–H) — solo JSON ya emitidos |\n"
    "| `docs/Checklist_Editorial_INAPI_v2_0_actualizado.docx` | Checklist editorial humano (hitos/tareas) — RAG |\n"
    "| `docs/Checklist_Editorial_INAPI_v2_0_actualizado.extracted.md` | Texto extraído del Word para ingesta RAG |\n"
    "| `data/checklist-editorial-ptd-v2.json` | Hitos PTD → tareas → preguntas + conteos |",
)

t = t.replace(
    '    { "id": "A1", "estado": "cumple|incumple|no_aplica", "severidad": "baja|media|alta", "comentario": "...", "cita_textual": "..." }\n'
    "  ],\n"
    '  "resumen": { "total": 47, "cumple": 0, "incumple": 0, "no_aplica": 0, "porcentaje": 0.0 },',
    '    { "id": "LC-1.1.1-01", "estado": "cumple|incumple|no_aplica", "severidad": "baja|media|alta", "comentario": "...", "cita_textual": "..." }\n'
    "  ],\n"
    '  "resumen": { "total": 51, "cumple": 0, "incumple": 0, "no_aplica": 0, "porcentaje": 0.0 },',
)

t = t.replace(
    "- **NUNCA inventar criterios** — solo los 47 de `data/checklist-criteria.json` (o 39 si se reabre una auditoría histórica v1.1).",
    "- **NUNCA inventar criterios** — solo los **51** de `data/checklist-criteria-lc-ptd.json` en auditorías nuevas. Históricos: 47 (v2.1) o 39 (v1.1).",
)

t = t.replace(
    "| 4 | 47 criterios evaluados (v2.1) | `criterios` (tabla completa con estado y severidad) |",
    "| 4 | **51** criterios evaluados (v3.0) | `criterios` (tabla completa con estado y severidad) |",
)

t = t.replace(
    "- Tabla de 47 criterios v2.1 + `sustituciones[]` consolidadas por el agente raíz.",
    "- Tabla de **51** criterios v3.0 + `sustituciones[]` consolidadas por el agente raíz.",
)

t = t.replace(
    "- Exactamente **47 objetos** en `criterios_evaluados[]` (v2.1), orden A1…H1 (incluye A6–A9, B8, C8, C9, F6). Auditorías históricas v1.1: 39 objetos.",
    "- Exactamente **51 objetos** en `criterios_evaluados[]` (v3.0), orden del catálogo LC-PTD. Históricos: 47 (v2.1) o 39 (v1.1).",
)

t = t.replace(
    "no un subagente “por URL” que haga los 47 solo.",
    "no un subagente “por URL” que haga los 51 solo.",
)

# §17 groups
old_17 = """### Motivación

Evaluar los 47 criterios en una sola pasada puede sacrificar profundidad en secciones complejas (B/C lingüística, F/G compliance). Esta arquitectura delega cada grupo de secciones a un sub-subagente especializado, garantizando análisis robusto y consistente.

### 5 grupos temáticos

| Grupo | Secciones | Criterios | Foco |
| --- | --- | --- | --- |
| **1 — Estructura y Objetividad** | A + E | A1–A9, E1–E4 | Organización, completitud (A6–A8), escaneabilidad (A9), fechas, títulos |
| **2 — Lenguaje y Redacción** | B + C | B1–B8, C1–C9 | Voz activa, tuteo, siglas, legibilidad B8, FAQ (C8), conteo párrafos (C9) |
| **3 — Mecánica** | D | D1–D7 | Ortografía, puntuación, formato visual, mayúsculas sostenidas |
| **4 — Enlaces** | F | F1–F6 | CTAs, PDFs con descripción (F4), enlaces relacionados (F6) |
| **5 — Datos y Archivo** | G + H | G1–G3, H1 | Datos personales, derechos ARCO, versiones archivadas |"""

new_17 = """### Motivación

Evaluar los **51** criterios en una sola pasada puede sacrificar profundidad. Esta arquitectura delega grupos de **indicadores** a sub-subagentes especializados.

### 5 grupos temáticos (por indicadores LC)

| Grupo | Indicadores | IDs (orientativo) | Foco |
| --- | --- | --- | --- |
| **1 — Fiabilidad / Completitud / Actualización / Objetividad / Archivo / Visualización** | 1.1.1, 1.1.2, 1.1.4, 1.3.1–1.3.3 (+ IESD 5.1.1/5.1.2/5.1.4/5.3.x) | LC-1.1.1-*, LC-1.1.2-*, LC-1.1.4-*, LC-1.3.* | Fuente, completitud, fechas, objetividad, archivo, apoyos visuales |
| **2 — Lenguaje plano** | 1.1.3 / 5.1.3 | LC-1.1.3-01…06 | Legible, tono, jerga, abreviaturas, siglas, tono positivo |
| **3 — Redacción / Claridad / Concisión** | 1.1.5, 1.2.1, 1.2.2 (+ variantes IESD) | LC-1.1.5-*, LC-1.2.1-*, LC-5.2.1-01, LC-1.2.2-*, LC-5.2.2-01 | Ortografía, conectores, FAQ, concisión |
| **4 — Legibilidad / Escritura web** | 1.2.3, 1.2.4 / 5.2.3, 5.2.4 | LC-1.2.3-*, LC-1.2.4-*, LC-5.2.4-01 | Espaciado, alineación, listas, pirámide, negritas, enlaces/PDF/rótulos |
| **5 — PI / Privacidad / Sensibles** | 1.1.6–1.1.8 / 5.1.6–5.1.7 | LC-1.1.6-*, LC-1.1.7-*, LC-1.1.8-* | Licencias, ARCO, RUN/teléfonos, contenidos sensibles |"""

if old_17 not in t:
    print("MISS §17 block")
else:
    t = t.replace(old_17, new_17)
    print("OK §17")

t = t.replace(
    "│       - 47 criterios orden A1…H1; cruces §20.3; patron_sistema §20.2",
    "│       - 51 criterios orden catálogo LC-PTD; cruces §20.3; patron_sistema §20.2",
)
t = t.replace(
    "- **Sin superposición de criterios:** un criterio → un grupo. E4 = Grupo 1; D1 = Grupo 3. METADATA fuera de alcance.",
    "- **Sin superposición de criterios:** un criterio → un grupo. METADATA fuera de alcance.",
)
t = t.replace(
    "- **Completitud:** 47 filas; cobertura 1:1 `incumple` ↔ sustituciones (salvo agrupados §20.3 documentados).",
    "- **Completitud:** 51 filas; cobertura 1:1 `incumple` ↔ sustituciones (salvo agrupados §20.3 documentados).",
)
t = t.replace(
    "4. Secciones a evaluar (ej. «SOLO A1–A9 y E1–E4»).",
    "4. Indicadores a evaluar (ej. «SOLO Fiabilidad/Completitud/Actualización/Objetividad/Archivo/Visualización»).",
)
t = t.replace(
    "3. `captura_con_sesion: true|false` — si `true`, §19 (Grupo 5 crítico en G1–G3).",
    "3. `captura_con_sesion: true|false` — si `true`, §19 (Grupo 5 crítico en privacidad/ARCO).",
)
t = t.replace(
    "7. Énfasis Grupo 1: A9, E3, E4=H1. Grupo 3: D3/D4 con estilo si dudoso. Grupo 4: F4 completo (4 elementos).",
    "7. Énfasis Grupo 1: fecha (LC-1.1.4-01), completitud. Grupo 4: documentos (título+formato+peso+desc). Grupo 2: Legible.",
)

old_skills = """| Grupo | Skill principal | Secciones del checklist |
| --- | --- | --- |
| Grupo 1 (A+E) | `auditoria-lc.md` §A y §E | Estructura y Objetividad |
| Grupo 2 (B+C) | `auditoria-lc.md` §B y §C | Lenguaje y Redacción |
| Grupo 3 (D) | `auditoria-lc.md` §D | Mecánica |
| Grupo 4 (F) | `auditoria-lc.md` §F | Enlaces |
| Grupo 5 (G+H) | `auditoria-lc.md` §G y §H | Datos y Archivo |"""

new_skills = """| Grupo | Skill principal | Indicadores |
| --- | --- | --- |
| Grupo 1 | `auditoria-lc.md` (Fiabilidad…Visualización) | 1.1.1, 1.1.2, 1.1.4, 1.3.x |
| Grupo 2 | `auditoria-lc.md` (Lenguaje plano) | 1.1.3 / 5.1.3 |
| Grupo 3 | `auditoria-lc.md` (Redacción/Claridad/Concisión) | 1.1.5, 1.2.1, 1.2.2 |
| Grupo 4 | `auditoria-lc.md` (Legibilidad/Escritura web) | 1.2.3, 1.2.4 |
| Grupo 5 | `auditoria-lc.md` (PI/Privacidad/Sensibles) | 1.1.6–1.1.8 |"""

if old_skills not in t:
    print("MISS skills table")
else:
    t = t.replace(old_skills, new_skills)
    print("OK skills")

t = t.replace(
    "| Profundidad en B/C (lingüística) | Media — comparte contexto con 47 criterios | Alta — el agente se concentra solo en su grupo |",
    "| Profundidad lingüística | Media — comparte contexto con 51 criterios | Alta — el agente se concentra solo en su grupo |",
)
t = t.replace(
    "| Riesgo de conflicto entre criterios | Alto (D1 vs E4, G1 vs A5) | Bajo — la asignación por grupo elimina la ambigüedad |",
    "| Riesgo de conflicto entre criterios | Alto (misma evidencia en varios indicadores) | Bajo — un criterio → un grupo |",
)

# §20
t = t.replace(
    "## 20. Calibración META MEI v2.1 — puntaje, VISIBLE, patrones y cruces\n\n"
    '*Aplica a reauditorías de las 10 URLs META MEI y a auditorías nuevas con `version_checklist: "2.1"`.*',
    "## 20. Calibración META MEI — puntaje, VISIBLE, patrones y cruces\n\n"
    '*Aplica a reauditorías META MEI y a auditorías nuevas con `version_checklist: "3.0"` (51 LC). JSON históricos v2.1 siguen las mismas reglas de VISIBLE/patrones.*',
)
t = t.replace(
    "| Texto/UI visible o modal abrible con un clic (incl. **H1**) | Sí (`incumple`) | Sustitución + `ubicacion_pantalla`; **siempre** en tabla UI/PDF/Excel (47 filas) |",
    "| Texto/UI visible o modal abrible con un clic (incl. **H1** visible) | Sí (`incumple`) | Sustitución + `ubicacion_pantalla`; **siempre** en tabla UI/PDF/Excel (**51** filas v3.0) |",
)
t = t.replace(
    "Los **47** criterios aparecen siempre en pantalla, PDF y Excel.",
    "Los **51** criterios (v3.0) aparecen siempre en pantalla, PDF y Excel. Históricos v2.1: 47 filas A–H.",
)

t = t.replace(
    "(`criterion` / `verification` en `data/checklist-criteria.json`, alineada al Checklist Editorial PTD / IEW–IESD–RLC).",
    "(`criterion` / `verification` / `display_label` en `data/checklist-criteria-lc-ptd.json`).",
)

t = t.replace(
    "**Motor de score / Excel / UI:** `data/checklist-criteria.json` (47 criterios A–H v2.1).",
    "**Motor de score / Excel / UI (nuevas):** `data/checklist-criteria-lc-ptd.json` (**51** criterios LC v3.0). Históricos: `checklist-criteria.json` (47 A–H).",
)

t = t.replace(
    "no cruzar criterios solo para “aplicar los 47”. Si un criterio **no tiene necesidad real** de corrección en ese elemento (ej. A7 sobre un atajo de tres palabras)",
    "no cruzar criterios solo para “aplicar los 51”. Si un criterio **no tiene necesidad real** de corrección en ese elemento (ej. Completitud/datos clave sobre un atajo de tres palabras)",
)

# §23 rewrite key parts
t = t.replace(
    "| `data/checklist-editorial-ptd-v2.json` | Misma estructura + **`conteos_preguntas_unicas`** + mapeo a A–H |\n"
    "| `docs/checklist-ptd-v2-mapa.md` | Cruce IEW↔IESD y notas de exclusivas |\n"
    "| `data/checklist-criteria.json` | **47** filas A–H = score, UI, PDF, Excel MEI |",
    "| `data/checklist-editorial-ptd-v2.json` | Hitos PTD → tareas → preguntas + conteos |\n"
    "| `docs/checklist-ptd-v2-mapa.md` | Cruce IEW↔IESD por indicador |\n"
    "| `data/checklist-criteria-lc-ptd.json` | **51** filas LC v3.0 = score, UI, PDF, Excel MEI |\n"
    "| `data/checklist-criteria.json` | Histórico 47 A–H (no usar en auditorías nuevas) |",
)

t = t.replace(
    "| **Lenguaje claro** | **51** | 40 | 8 | 3 | **Sí** → consolidar en 47 A–H |",
    "| **Lenguaje claro** | **51** | 38 | 10 | 3 | **Sí** — JSON canónico = 51 filas (sin consolidar a A–H) |",
)

t = t.replace(
    "| Contenido y lenguaje claro | PTD-D2.1-CL1 | **Sí** — recorrer hitos LC; consolidar en 47 A–H | Mantener |",
    "| Contenido y lenguaje claro | PTD-D2.1-CL1 | **Sí** — 51 criterios por indicadores | Mantener |",
)

t = t.replace(
    "| Seguridad | PTD-D2.1-SE8 | **No** (salvo solape editorial **G2** política de privacidad) | Tras Usabilidad o en paralelo acordado |",
    "| Seguridad | PTD-D2.1-SE8 | **No** (salvo solape editorial **LC-1.1.7-03** ARCO / política de privacidad) | Tras Usabilidad o en paralelo acordado |",
)

old_flow = """1. Cargar `data/checklist-editorial-ptd-v2.json` → dimensión `CL1` (`en_motor_meta_mei_2026: true`) y `conteos_preguntas_unicas.lenguaje_claro` (**51** únicas).
2. Para cada **Hito → Tarea → Indicador → Pregunta** de LC: responder con evidencia visible (sí / no / no aplica) en el razonamiento del grupo dueño del motor mapeado (`mapeo_indicador_lc_a_motor_v21`). Cobertura objetivo = las **51** preguntas únicas aplicables (no contar dos veces la misma pregunta repetida entre hitos).
3. Si la misma pregunta se repite en varias tareas: **una** evidencia por URL; reutilizar en todos los hitos que la citan.
4. Consolidar en exactamente **47** `criterios_evaluados` (A1…H1) + `sustituciones[]` (§20 + §22).
5. En `nota_final_tic` o `resumen_ejecutivo`: mencionar cobertura Checklist Editorial PTD v2.0 — preguntas únicas LC (hasta 51) → 47 A–H; sin score Usabilidad (18) ni Seguridad (10).
6. **Prohibido** en esta fase: filas extra de Usabilidad/Seguridad en el JSON canónico, o bajar el % LC por hallazgos solo de UI Kit / cabeceras HTTP."""

new_flow = """1. Cargar `data/checklist-criteria-lc-ptd.json` (**51** criterios) y, para contexto de hitos, `data/checklist-editorial-ptd-v2.json` (dimensión CL1).
2. Para cada **Indicador → Criterio (pregunta)**: responder con evidencia visible; agrupar trabajo por grupos §17. Cobertura = **51** preguntas únicas aplicables (no duplicar la misma pregunta entre hitos PTD).
3. Si la misma pregunta se repite en varias tareas del Word: **una** evidencia por URL.
4. Consolidar en exactamente **51** `criterios_evaluados` (ids `LC-*`) + `sustituciones[]` (§20 + §22). `version_checklist: "3.0"`.
5. En `nota_final_tic` / `resumen_ejecutivo`: cobertura PTD-LC v3.0 (51); sin score Usabilidad (18) ni Seguridad (10).
6. **Prohibido:** filas Usabilidad/Seguridad en el JSON canónico; emitir A1–H1 en auditorías nuevas."""

if old_flow not in t:
    print("MISS flow 23.3")
else:
    t = t.replace(old_flow, new_flow)
    print("OK flow")

t = t.replace(
    """### 23.4 Asignación orientativa Hito LC → grupos §17

| Hitos PTD (LC) | Énfasis | Grupos |
| --- | --- | --- |
| 492, 500, 509 (estructura/docs), 515*, 517, 519 | A, E, F4, H1 | 1, 4, 5 |
| 494, 496, 498 | B, C, D1–D2 | 2, 3 |
| 502, 505, 513* | G (+ sensibles en nota) | 5 |
| 507 | D3–D5 | 3 |

\\*Visualización (515) y sensibles (513): evaluar si aplica; si no hay datos/menores, `no_aplica` / nota — no forzar `incumple` vacío.

### 23.5 Gate de consolidación PTD-LC (agente raíz)

Antes de `validate:claude-audits`:

1. Revisar `mapeo_indicador_lc_a_motor_v21`: cada indicador LC con motor no vacío tiene evidencia en los A–H correspondientes; cobertura alineada a las **51** preguntas únicas aplicables.
2. Preguntas marcadas exclusivas IESD en trámites (rótulos de enlace, variantes FAQ/concisión): aplicar si `tipo_pagina` / URL lo amerita; en sitioweb puro, no forzar la variante trámite.
3. No omitir E3, F4, B3, A7 con realismo §22.9–§22.11.
4. Confirmar que **no** se añadieron puntuaciones de Usabilidad (18) ni Seguridad técnica (10) al % de los 47.""",
    """### 23.4 Asignación orientativa Hito LC → grupos §17

| Hitos PTD (LC) | Énfasis (indicadores) | Grupos |
| --- | --- | --- |
| 492, 500, 509, 515*, 517, 519 | Completitud, Actualización, Escritura web, Archivo, Visualización | 1, 4 |
| 494, 496, 498 | Lenguaje plano, Claridad, Concisión, Redacción | 2, 3 |
| 502, 505, 513* | PI, Privacidad, Sensibles | 5 |
| 507 | Legibilidad | 4 |

\\*Visualización y sensibles: `no_aplica` / nota si no hay datos/menores — no forzar `incumple` vacío.

### 23.5 Gate de consolidación PTD-LC (agente raíz)

Antes de `validate:claude-audits`:

1. Exactamente **51** filas `LC-*` en orden del catálogo; cada una con `comentario` (§22.8).
2. Exclusivas IESD (`LC-5.2.1-01`, `LC-5.2.2-01`, `LC-5.2.4-01`): aplicar en trámites/servicio digital; en sitioweb informativo → `no_aplica` justificado si no caben.
3. No omitir fecha (`LC-1.1.4-01`), documentos (`LC-1.2.4-07/08`), siglas (`LC-1.1.3-05`), datos clave (`LC-1.1.2-03`) con realismo §22.9–§22.11.
4. Confirmar que **no** se añadieron Usabilidad (18) ni Seguridad (10) al % de los **51**.""",
)

p.write_text(t, encoding="utf-8")
print("done", p)
