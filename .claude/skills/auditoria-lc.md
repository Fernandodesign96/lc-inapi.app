# Skill: Auditoría Lenguaje Claro PTD-LC v3.0

## Qué es este documento

Skill operativa de **evaluación editorial**: inventario visible (capas R+U), los **51** criterios `LC-*`, estados/severidad, sustituciones CMS-first y checklist antes de emitir el JSON canónico.

## Para qué se utiliza

- Que el **agente raíz** y **cada sub-subagente (§17)** sepan cómo puntuar sin inventar nomenclatura A–H.
- Que las propuestas lleguen en lenguaje entendible para CMS/Sitefinity (§22).

## Objetivo

Garantizar auditorías v3.0 coherentes: 51 filas, cobertura 1:1 `incumple`→`sustituciones[]`, evidencia VISIBLE, realismo y validación previa al commit.

## Importancia en la orquestación Claude Code

Es la skill **obligatoria** en toda auditoría. Sin ella, prompts y sub-subagentes no comparten el mismo procedimiento de evaluación. Se carga automáticamente al pegar `audit-una-url.md` / oro / lote y en cada grupo 1–5.

## Cableado (conversa con)

| Pieza | Relación |
| --- | --- |
| `../CLAUDE.md` | Constitución: §2 checklist, **§5 reglas**, §12 workflow, **§17 sub-subagentes**, §19–§23 |
| `../prompts/audit-una-url.md` | Prompt canónico que ordena Pasos A–F y exige esta skill |
| `../prompts/audit-lote.md` / `audit-oro-s22.md` | Delegan evaluación aquí vía `audit-una-url` |
| `auditoria-calidad-web.md` | Fundamento normativo de comentarios |
| `pesquisa-criterios.md` | RAG A/B y catálogo cuando hay duda |
| `../diagrams/workflow_diagram.md` | Vista del grafo completo |
| Frontend | Tras Paso F: JSON → `/auditar`, Excel MEI, PDF (no evalúa criterios) |

**Reglas** = CLAUDE.md §5 (no hay carpeta `/rules` aparte). **Sub-subagentes** = CLAUDE.md §17 + Paso D del prompt.

Fuente de verdad de criterios: `./data/checklist-criteria-lc-ptd.json` (**51** / indicadores IEW·IESD)  
Schemas: `./src/schemas/claude-audit-pilot.ts`, `./src/schemas/url-audit.ts`  
**PTD LC 2026:** Word + `checklist-editorial-ptd-v2.json` + **51** filas. **No** A–H en auditorías nuevas. US **18** / SE **10** fuera del % (§23).  
**Histórico:** `data/checklist-criteria.json` (47 A–H) solo JSON ya emitidos.

---

## Cuándo activar
Cuando se pida auditar una URL, procesar un HTML o generar un JSON canónico.
**Obligatoria** en los 5 sub-subagentes (CLAUDE.md §17) y en el agente raíz al consolidar.
Complementar con `auditoria-calidad-web.md` (norma) y `pesquisa-criterios.md` (RAG/precedentes).

---

## Fase 0 — Inventario de incidencias (dos capas)

Antes de evaluar criterios, generar inventario completo de nodos **visibles**:

```
T001 [R|U] [HTML-L{n}]: «texto literal» (contexto: navbar / H1 / párrafo / botón / footer / fecha / PDF)
T002 [R|U] [HTML-L{n}]: «texto literal» (contexto: ...)
...
```

| Capa | Qué inventariar | Sirve sobre todo a |
| --- | --- | --- |
| **R** Redacción | H1–H3, párrafos, CTAs, menús, footer, modales, glosas | Lenguaje plano, Claridad, Concisión, Completitud |
| **U** Chrome UI / formato | Fechas visibles, listas/viñetas, alineación, espacios, enlaces PDF (título/formato/peso/desc), **presencia** de imágenes/íconos/gráficos (no calidad de `alt`), encabezados de escaneo | Legibilidad, Escritura web, Actualización, Archivo, Visualización (LC-1.3.1-01 = ¿hay apoyos?) |

**Reglas del inventario:**
- **Alcance = solo contenido visible en pantalla** para el ciudadano. **No** inventariar ni evaluar `<title>`, `<meta description>`, `<meta keywords>`, Open Graph ni otros nodos de capa METADATA del `<head>`.
- Numerar ocurrencias de texto **visible** en orden de aparición.
- Incluir siempre: `<h1>`–`<h3>`, primer párrafo del cuerpo, botones, menú, footer, fecha **si es visible**, enlaces a documentos.
- **No** usar el `<title>` de la pestaña como evidencia de fidelidad del título: usar el **H1 visible**. En comentarios, preferir «no se usó el título de pestaña ni metadatos del head».
- Para series Clarity: incluir el bloque del encabezado del servicio **visible**.
- Si falta un elemento esperado: `(ausencia de H1)`, `(ausencia de fecha)`, `(PDF sin peso)`, etc.
- Los `html_linea_aprox` alimentan `sustituciones[]` y deben corresponder al HTML capturado del nodo visible.
- En cada sustitución de **sitioweb**, completar `ubicacion_pantalla` en lenguaje no técnico. La ref. técnica (`linea` / `html_linea_aprox`) es secundaria para TI.
- Marcar `capa: "VISIBLE"` cuando sea claro. Nunca hallazgos solo METADATA.
- **Calibración META MEI (CLAUDE.md §20–§21):** patrones Layout → `patron_sistema: true`; gate de evidencia antes de `cumple`; cruces §20.3 solo si mismo nodo; cada `no_aplica` con `comentario`.

### Pantallas con sesión autenticada (`captura_con_sesion: true`)

Ver `CLAUDE.md` §19. Reglas adicionales para el inventario:

- **Valores de campos del usuario logueado** (RUT, nombre, correo, marca, expediente): registrar como  
  `T042 [R] [HTML-L512]: «[valor de sesión — no transcribir]» (contexto: campo «RUT del solicitante» prellenado)`.
- **Sí inventariar** etiquetas, placeholders de ayuda, textos de instrucción, títulos de sección y botones — con el texto literal institucional.
- **No** incluir en `original`/`propuesto` de sustituciones valores reales del solicitante.

---

## Fase 1 — Evaluación de los 51 criterios (checklist PTD-LC v3.0)

### Orden de evaluación para sub-subagentes (§17 de CLAUDE.md)

| Grupo | Indicadores | Criterios | Sub-subagente |
|---|---|---|---|
| Grupo 1 | Fiabilidad, Completitud, Actualización, Objetividad, Archivo, Visualización | LC-1.1.1-*, LC-1.1.2-*, LC-1.1.4-*, LC-1.3.* | Sub-subagente 1 |
| Grupo 2 | Lenguaje plano | LC-1.1.3-01…06 | Sub-subagente 2 |
| Grupo 3 | Redacción, Claridad, Concisión | LC-1.1.5-*, LC-1.2.1-*, LC-5.2.1-01, LC-1.2.2-*, LC-5.2.2-01 | Sub-subagente 3 |
| Grupo 4 | Legibilidad, Escritura web | LC-1.2.3-*, LC-1.2.4-*, LC-5.2.4-01 | Sub-subagente 4 |
| Grupo 5 | PI, Privacidad, Sensibles | LC-1.1.6-*, LC-1.1.7-*, LC-1.1.8-* | Sub-subagente 5 |

Para pasada única (sin sub-subagentes): evaluar en orden del catálogo `checklist-criteria-lc-ptd.json`. Preferir siempre §17 + `audit-una-url.md`.

### Procedimiento por criterio

1. Identificar la definición exacta en `data/checklist-criteria-lc-ptd.json` por `id` (usar `display_label` en entrega).
2. Consultar RAG colección A: fundamento normativo (`source`).
3. Consultar RAG colección B: precedentes + Word/mapa PTD.
4. Aplicar la definición al inventario R+U (y estilos/a11y si §21 lo pide).
5. **Gate de evidencia (§20.6):** no emitir `cumple` sin evidencia positiva; todo `incumple` (incl. severidad baja/media = cumple con observaciones / medianamente cumple) exige cita/Tnnn + sustitución en lenguaje CMS; `no_aplica` exige `comentario`. Nunca `null` en claves de estado.
6. Registrar UNA evidencia representativa por criterio. Preferir hallazgos **distintos**; si es el mismo nodo → §20.3.
7. **Entrega humana (§22):** **ninguna casilla vacía.** Todo criterio lleva `comentario`. Si `incumple` → `ubicacion_pantalla` (CMS primero), `original`, `propuesto` accionable y `motivo`; la línea HTML es secundaria.
8. **Realismo:** no forzar `incumple` donde el criterio no cabe (datos clave en labels de menú; reescritura de oraciones sobre atajos). Preferir `cumple`/`no_aplica` o propuestas sutiles (siglas → tooltip).
9. **PTD LC (§23):** cubrir las **51** preguntas; `version_checklist: "3.0"`. No puntuar Usabilidad (18) ni Seguridad (10).

---

## Entrega legible (§22) — checklist rápido por criterio y por sustitución

Antes de devolver el grupo al agente raíz:

**Por cada criterio (51):**

- [ ] ¿`comentario` no vacío responde la **pregunta** del instrumento?
- [ ] ¿El juicio es **realista** para el tipo de nodo (cuerpo vs menú vs CTA vs PDF)?
- [ ] Si pide herramienta/proceso (ortografía, legibilidad): ¿dice **cómo** hacerlo?

**Por cada fila de `sustituciones[]`:**

- [ ] ¿`ubicacion_pantalla` es entendible para CMS (zona › bloque › elemento) **antes** que la línea HTML?
- [ ] ¿`propuesto` se puede **pegar** o es instrucción inequívoca (no “mejorar claridad”)?
- [ ] ¿Documentos: título + formato + peso + descripción, o instrucción de completar formato/peso sin inventar KB?
- [ ] ¿Fecha: instrucción de fecha visible bajo título (no solo © del pie)?
- [ ] ¿Siglas en menú: propuesta sutil (tooltip/`title`/destino) sin congestionar el ítem?
- [ ] ¿`motivo` = pregunta + fallo + (si aplica) patrón de layout, en lenguaje claro?
- [ ] ¿`criterio_id` es un id `LC-*` (no A1–H1)?
- [ ] Si `incumple`: ¿hay `severidad` (`baja`/`media`/`alta`) alineada a la gravedad?

- [ ] ¿Sin jerga §17 / Tnnn como única ubicación / selectores CSS?

Mapa PTD editorial (LC / Usabilidad / Seguridad) por indicadores: `docs/checklist-ptd-v2-mapa.md`.  
Catálogo Hito→Tarea→Pregunta: `data/checklist-editorial-ptd-v2.json` · criterios máquina: `data/checklist-criteria-lc-ptd.json` · orquestación CLAUDE.md **§23**.

## Los 51 criterios — referencia por indicadores

**No** usar A1–H1 en auditorías nuevas. Definición completa (pregunta, `display_label`, applicability, criticidad) en `data/checklist-criteria-lc-ptd.json`.

| Indicador | Códigos | IDs | Calibración rápida |
| --- | --- | --- | --- |
| Fiabilidad | 1.1.1 / 5.1.1 | LC-1.1.1-01 | Autoría INAPI visible en encabezado/pie |
| Completitud | 1.1.2 / 5.1.2 | LC-1.1.2-01…04 | Título↔contenido; sin «en construcción»; datos clave en cuerpo (no menú); autonomía trámites |
| Lenguaje plano | 1.1.3 / 5.1.3 | LC-1.1.3-01…06 | Legible; tono; **jerga también en H2/menú/tooltip** (ej. «Observancia»); abreviaturas; siglas (tooltip en menú); tono positivo |
| Actualización | 1.1.4 / 5.1.4 | LC-1.1.4-01 | Fecha visible; nunca © del pie |
| Redacción y ortografía | 1.1.5 / 5.1.5 | LC-1.1.5-01…03 | Ortografía; puntuación; conectores (solo IEW) |
| Propiedad intelectual | 1.1.6 / 5.1.6 | LC-1.1.6-01…02 | Licencia/condiciones; anti-redifusión (solo IEW) |
| Privacidad | 1.1.7 / 5.1.7 | LC-1.1.7-01…03 | RUN/teléfonos (solo IEW); ARCO; RUT institucional = cumple; sesión auth §19 |
| Contenidos sensibles | 1.1.8 | LC-1.1.8-01…03 | Solo IEW; `no_aplica` si no hay menores/sensibles |
| Claridad | 1.2.1 / 5.2.1 | LC-1.2.1-01…05 + LC-5.2.1-01 | FAQ; voz activa; SVP; infinitivo; variante IESD en trámites |
| Concisión | 1.2.2 / 5.2.2 | LC-1.2.2-01…05 + LC-5.2.2-01 | Brevedad; ≤8 líneas; una idea; resumen; variante IESD |
| Legibilidad | 1.2.3 / 5.2.3 | LC-1.2.3-01…03 | Espacio; alineación izq.; listas/tablas |
| Escritura para la web | 1.2.4 / 5.2.4 | LC-1.2.4-01…08 + LC-5.2.4-01 | Pirámide; **títulos claros** (rótulo escaneable, no solo subtítulo); escaneo texto+tarjetas; negritas; mayúsculas; enlaces rel. (IEW); rótulos (IESD); PDF |
| Visualización | 1.3.1 | LC-1.3.1-01 | Solo IEW; apoyos visuales |
| Objetividad | 1.3.2 / 5.3.1 | LC-1.3.2-01…02 | Neutro; 80 % hechos (solo IEW) |
| Archivo | 1.3.3 / 5.3.2 | LC-1.3.3-01 | Versiones no vigentes rotuladas |

**Estados JSON:** solo `cumple` | `incumple` | `no_aplica` (nunca `null`).  
**Severidad** solo en `incumple`: `baja` → UI «Cumple con observaciones» · `media` → «Medianamente cumple» · `alta` → «No cumple». Cada `incumple` exige `sustituciones[]` con lenguaje CMS primero (ubicación en pantalla) y ancla HTML como apoyo TI. Ver CLAUDE.md §5 y §20.6.

---

## Umbrales de aceptación

| Rango | Estado |
|---|---|
| `porcentaje_cumplimiento` ≤ 80% | **rechazado** |
| 81% – 90.9% | **aceptado con observaciones** |
| ≥ 91% | **aprobado** |

**Fórmula:** `porcentaje_cumplimiento = criterios_aprobados / criterios_aplicables × 100`  
donde `criterios_aplicables = 51 − criterios_no_aplica` (v3.0) y los agrupados (`agrupado_en`) no descuentan.  
Históricos: 47 (v2.1) o 39 (v1.1).

`no_aplica` **NO entra en el denominador**.

---

## Fase 2 — Validación antes de emitir JSON

Verificar ANTES de escribir el JSON final:

- [ ] ¿Hay exactamente **51 objetos** en `criterios_evaluados[]`, orden del catálogo LC-PTD?
- [ ] ¿`cumple + incumple + no_aplica = 51` exactamente?
- [ ] ¿`version_checklist` es `"3.0"`?
- [ ] ¿**Cada** criterio tiene `comentario` no vacío (§22.8), también los `cumple`?
- [ ] ¿Cada `incumple` tiene al menos una entrada en `sustituciones[]`?
- [ ] ¿Cada sustitución tiene `ubicacion_pantalla` humana + `propuesto` accionable + `motivo` coherente (§22)?
- [ ] ¿Ids `LC-*` (nunca A1–H1)? ¿Sin forzar datos clave solo sobre menú; sin inventar KB en PDFs?
- [ ] ¿El porcentaje usa la fórmula correcta (un decimal)?
- [ ] ¿Todo hallazgo en `observaciones_lc_por_severidad` tiene fila equivalente en `sustituciones[]`?
- [ ] ¿El `id` del archivo sigue el patrón `{slug-url}_{YYYY-MM-DD}`?
- [ ] ¿`severidad` solo existe en criterios con `estado = "incumple"`?
- [ ] ¿No hay `null` en ningún campo del JSON?
- [ ] Si `captura_con_sesion: true`: ¿ningún valor real del solicitante en `cita_textual`, `original` o `propuesto`?
- [ ] ¿`resumen_ejecutivo` y `nota_final_tic` son legibles para TIC/CMS sin jerga de orquestación?

---

## Patrones sistémicos transversales — verificar SIEMPRE

Estos patrones aparecen en la mayoría de URLs del inventario INAPI (componentes compartidos `_Layout.cshtml`, menús globales):

| Criterio | Patrón | Cómo comunicarlo a CMS |
|---|---|---|
| LC-1.2.4-05 | MAYÚSCULAS en navbar | «En el menú, cambiar MI INAPI / TRAMITACIÓN / … a mayúscula inicial para facilitar la lectura.» (origen típico: layout compartido) |
| LC-1.1.5-01 | «Titulos» sin tilde | «En el menú de Patentes, corregir «Titulos» → «Títulos».» |
| LC-5.2.4-01 / rótulos | Botones «OK» / «Aceptar» / «Más» | «Cambiar el botón a un texto que diga la acción, p. ej. «Aceptar selección».» |
| LC-1.2.4-07/08 | PDFs incompletos | «Junto al enlace: título + formato + peso + breve descripción.» |
| LC-1.1.4-01 | Sin fecha visible | «Bajo el título, añadir «Actualizado: DD de mes de AAAA». El © del pie no basta.» |
| LC-1.1.2-01 | H1 genérico | «El título grande de la página debe describir el contenido; no usar el de la pestaña.» |
| LC-1.1.3-03 | Jerga en título de sección / menú | «Cambiar el título «Observancia» por un rótulo cotidiano, o añadir en el mismo bloque: «Observancia: cómo proteger tu propiedad industrial». Un subtítulo abajo no basta si el título solo no se entiende.» |
| LC-1.2.4-02 | Título opaco aunque haya subtítulo | «El título de sección debe ser claro por sí mismo al escanear la página.» |
| LC-1.3.1-01 | Faltan apoyos visuales donde hay datos | «Añadir íconos, imágenes, gráficos o infografías que ayuden a entender los datos (no confundir con texto alternativo de accesibilidad).» |

### Calibración LC-1.3.1-01 (Visualización — IEW 1.3.1)

**Pregunta exacta:** ¿Se utilizan apoyos visuales (íconos, imágenes, gráficos, infografías) para presentar datos?

| Evidencia en pantalla | Estado |
| --- | --- |
| Hay banners, tarjetas con imagen, íconos de guía, gráficos, infografías | **`cumple`** — listar en `comentario` qué se vio |
| Página con datos/cifras/servicios **sin** ningún apoyo visual | **`incumple`** — `propuesto` en lenguaje CMS: «faltan imágenes/íconos/gráficos…» |
| No hay datos que ilustrar (texto narrativo puro) | **`no_aplica`** |

**Prohibido bajo este id:** incumplir por `alt` vacío/ausente, `alt` genérico («Login»), enlace de logo sin nombre accesible, o WCAG. Eso **no** responde la pregunta. Si conviene, una nota breve en `nota_final_tic` en lenguaje de pantalla («en el pie, el logo del organismo X no tiene nombre legible»), **fuera del %**.

**Herramientas:** si Playwright no “ve” un banner que sí está visible, **no** incumplir: reintentar captura o anotar duda. Nunca castigar al sitio por límite de la herramienta.

### Calibración — títulos, subtítulos, tooltips y jerga (LC-1.1.3-03 · LC-1.2.4-02)

**Alcance del inventario R:** además de párrafos, inventariar **siempre** H1–H3 / títulos de tarjeta / ítems de menú visibles / tooltips o textos de ayuda visibles al abrir un control.

| Situación | Criterio | Estado típico |
| --- | --- | --- |
| Encabezado solo con término legal/técnico (ej. «Observancia») y la explicación está **solo** en un subtítulo o párrafo aparte | LC-1.1.3-03 (jerga) + LC-1.2.4-02 (título no claro) | `incumple` — mismo nodo → §20.3 (primario jerga o títulos claros) |
| Título en lenguaje cotidiano + subtítulo que amplía | Ambos | `cumple` |
| Menú con «Observancia», «Dominio Público», «Sistema de Madrid» sin glosa en primera aparición | LC-1.1.3-03 / a veces LC-1.1.3-05 si es sigla | Evaluar; propuesta CMS en el ítem o destino |
| Tooltip o texto de ícono con jerga | LC-1.1.3-03 | Igual que un párrafo |
| Falta subtítulo/H2 donde hay muro de bloques sin jerarquía | LC-1.2.4-02 / LC-1.2.4-03 | `incumple` si no se puede escanear |

**Propuesta CMS (ejemplo Observancia):**  
`ubicacion_pantalla`: «Portada — bloque Observancia, título de la sección».  
`original`: «Observancia».  
`propuesto`: «Protege tu propiedad industrial» **o** «Observancia: herramientas para proteger tu propiedad industrial en Chile».  
`motivo`: «Quien solo lee el título ve un término legal; el subtítulo ayuda, pero el rótulo principal debe entenderse al escanear.»

### Texto + apoyos visuales vs arquitectura de información

| En el motor LC (puntúa) | Fuera del % (nota Usabilidad / `nota_final_tic`) |
| --- | --- |
| LC-1.3.1-01: ¿existen apoyos visuales? | Peso tipográfico, grilla, “equilibrio” visual fino |
| LC-1.2.4-01 / 03: lo importante arriba; se puede escanear con títulos + tarjetas/íconos | Rediseño completo de layout / UI Kit |
| LC-1.1.3-* / 1.2.4-02: textos de títulos y de apoyo en claro | — |

Si imagen e ícono **acompañan** un título claro → refuerza escaneo (`cumple` en 1.2.4-03). Si hay muchas imágenes pero el título sigue siendo jerga → el problema es **lenguaje del título**, no “falta de imagen”.

**Nota:** cuando el hallazgo es sistémico (layout), `motivo` / `patron_sistema: true` debe indicar que el cambio en `_Layout.cshtml` afecta a todas las páginas del sitio.

---

## Output — rutas de guardado

| Serie | Ruta |
|---|---|
| Trámites | `data/claude-audits/tramites/{YYYY-MM-DD}/{id}.json` |
| Sitio Web | `data/claude-audits/sitioweb/{YYYY-MM-DD}/{id}.json` |

Formato del `id`: `{slug-de-la-url}_{YYYY-MM-DD}`
Ejemplos reales del repo:
- `tramites-inapi-cl_2026-06-07`
- `buscadormarcas-inapi-cl-marca-buscar-marca_2026-06-05`
- `tramites-inapi-cl-account-login_2026-06-11`

Después de guardar:
```bash
bun run validate:claude-audits
# Cablear frontend si aplica (launch + mei-meta-mei-urls) — ver audit-una-url Paso F
git add data/claude-audits/...
git commit -m "feat(audits): agregar auditoría {slug-url} — {estado_aceptacion} {porcentaje}%"
# Opcional: cd rag && bun run ingest:b
```

Ver diagrama de orquestación: `../diagrams/workflow_diagram.md`.
