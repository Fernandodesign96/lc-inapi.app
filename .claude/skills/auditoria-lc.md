# Skill: Auditoría Lenguaje Claro v2.1

Fuente de verdad de criterios: `./data/checklist-criteria.json`
Fuente de verdad de schemas: `./src/schemas/claude-audit-pilot.ts` y `./src/schemas/url-audit.ts`
Referencia operativa: `.claude/CLAUDE.md` (especialmente §2, §5, §12, §16, §17)

---

## Cuándo activar
Cuando se pida auditar una URL, procesar un HTML o generar un JSON canónico de auditoría.
También se carga automáticamente en los sub-subagentes de cada grupo temático (ver §17 de CLAUDE.md).

---

## Fase 0 — Inventario de incidencias

Antes de evaluar criterios, generar inventario completo de nodos relevantes del HTML:

```
T001 [HTML-L{n}]: «texto literal» (contexto: navbar / H1 / párrafo / botón / footer)
T002 [HTML-L{n}]: «texto literal» (contexto: ...)
...
```

**Reglas del inventario:**
- **Alcance = solo contenido visible en pantalla** para el ciudadano. **No** inventariar ni evaluar `<title>`, `<meta description>`, `<meta keywords>`, Open Graph ni otros nodos de capa METADATA del `<head>`.
- Numerar ocurrencias de texto **visible** en orden de aparición (H1–H3, menús, párrafos, botones, footer, fechas visibles, etc.).
- Incluir siempre: `<h1>`–`<h3>`, primer párrafo del cuerpo principal, botones de acción, items del menú, footer con copyright, fecha **si es visible**.
- **No** usar el `<title>` de la pestaña del navegador como evidencia de E4: E4 se evalúa sobre el **H1 visible** (y encabezados visibles relacionados).
- Para series Clarity: incluir el bloque del encabezado del servicio **visible**.
- Si no existe un elemento esperado visible (fecha, H1, alt en imagen): registrarlo como `(ausencia de H1)`, `(ausencia de fecha)`, etc.
- Los `html_linea_aprox` del inventario son los que se usan en `sustituciones[]`; deben corresponder al HTML real capturado **del nodo visible**.
- En cada sustitución de **sitioweb**, completar `ubicacion_pantalla` en lenguaje no técnico: p. ej. «En el título principal (H1)», «En el subtítulo de la sección Noticias», «En el menú superior › Marcas». La ref. técnica (`linea` / `html_linea_aprox`) es secundaria para TI.
- Marcar `capa: "VISIBLE"` en evaluaciones/sustituciones cuando sea claro. Nunca emitir hallazgos con evidencia solo de METADATA.
- **Calibración META MEI (CLAUDE.md §20):** patrones Layout → `patron_sistema: true` (siguen descontando); no visibles → sin `incumple`; mismo texto propuesto → un primario + `criterios_relacionados` / `agrupado_en`; cada `no_aplica` con `comentario` breve.

### Pantallas con sesión autenticada (`captura_con_sesion: true`)

Ver `CLAUDE.md` §19. Reglas adicionales para el inventario:

- **Valores de campos del usuario logueado** (RUT, nombre, correo, marca, expediente): registrar como  
  `T042 [HTML-L512]: «[valor de sesión — no transcribir]» (contexto: campo «RUT del solicitante» prellenado)`.
- **Sí inventariar** etiquetas, placeholders de ayuda, textos de instrucción, títulos de sección y botones — con el texto literal institucional.
- **No** incluir en `original`/`propuesto` de sustituciones valores reales del solicitante.

---

## Fase 1 — Evaluación de los 47 criterios (checklist v2.1)

### Orden de evaluación para sub-subagentes (§17 de CLAUDE.md)

| Grupo | Secciones | Criterios | Sub-subagente asignado |
|---|---|---|---|
| Grupo 1 | A + E | A1–A9, E1–E4 | Sub-subagente 1 |
| Grupo 2 | B + C | B1–B8, C1–C9 | Sub-subagente 2 |
| Grupo 3 | D | D1–D7 | Sub-subagente 3 |
| Grupo 4 | F | F1–F6 | Sub-subagente 4 |
| Grupo 5 | G + H | G1–G3, H1 | Sub-subagente 5 |

Para pasada única (sin sub-subagentes): evaluar en orden A1 → H1.

### Procedimiento por criterio

1. Identificar la definición exacta en `data/checklist-criteria.json` por `id`.
2. Consultar RAG colección A: fundamento normativo del criterio (`source` del JSON).
3. Consultar RAG colección B: precedentes de la URL o de URLs con el mismo patrón.
4. Aplicar la definición al HTML capturado.
5. Registrar UNA evidencia representativa por criterio (la más grave si hay varias ocurrencias).

---

## Los 47 criterios — referencia completa con calibraciones

### Sección A — Estructura y organización del contenido (A1–A9)

| ID | Criterio | Verificación | Calibración INAPI |
|---|---|---|---|
| A1 | El mensaje más importante está en la parte superior | ¿El primer párrafo comunica el propósito de la página? | Alta: ausencia de H1 o H4 como único encabezado |
| A2 | Modelo de pirámide invertida | Lo más importante arriba, detalles abajo | Media si el cuerpo empieza con contexto legal en vez de propósito |
| A3 | Secciones lógicas con encabezados informativos | No hay bloques de texto continuos sin títulos | Alta si ningún H1/H2/H3 en la página; solo H4 o sin encabezados |
| A4 | ≤110 palabras por sección o contenido fragmentado | Contar palabras del bloque continuo más largo | Baja si se supera en una sección |
| A5 | Solo incluye información necesaria para la tarea | Sin texto institucional, marketing o relleno | Baja: versiones técnicas (`v 2.3.89.0`), modales desactualizados |
| A6 ★ | Sin páginas «en construcción» ni contenido manifiestamente incompleto | Placeholders, «próximamente», secciones vacías | Alta si hay placeholders visibles; distinto de A5 (exceso vs ausencia) |
| A7 ★ | Destaca datos clave: qué, cómo, dónde, cuándo, para quién | Resumen/recuadro o identificación fácil en el texto | Media si el usuario debe inferir plazos/canales sin ayuda visual |
| A8 ★ | Trámites: información suficiente para autonomía | Requisitos, pasos, plazos y canales en la página | Solo `tramites` (`applicability`); `no_aplica` en sitioweb informativo; distinto de A5 |
| A9 ★ | Escaneabilidad (formato F) | Negritas, listas y encabezados permiten escanear | Media si solo hay muro de texto sin anclas visuales |

**`no_aplica` en sección A:**
- A4: `no_aplica` cuando la página es formulario o pantalla de estado sin bloques editoriales.
- A5: `no_aplica` cuando la página es funcional pura sin contenido editorial visible.
- A8: `no_aplica` en páginas `sitioweb` (solo aplica a trámites).
- A6/A7/A9: casi siempre aplicables en páginas con cuerpo editorial.

---

### Sección B — Lenguaje claro (B1–B8)

| ID | Criterio | Verificación | Calibración INAPI / Patrón conocido |
|---|---|---|---|
| B1 | Voz activa | Buscar «se debe», «será», «deberá ser» | Media: «puede hacerlo con su Clave Única» antepone complemento |
| B2 | Palabras comunes, sin jerga burocrática | «resolución», «acto administrativo», «requirente» | Media: PCT, TGR, NCL sin expandir |
| B3 | Siglas y acrónimos definidos la primera vez | «Nomenclatura de Clasificación de Niza (NCL)» | **Alta transversal:** PCT en menú de Patentes sin definir |
| B4 | Sin extranjerismos ni abreviaturas | ≥50% del contenido en español | Baja: «OK» en botones de modales |
| B5 | Tono positivo | «Para registrar tu marca, ingresa» ≠ «NO podrás sin clave» | Generalmente cumple en INAPI |
| B6 | Tono amable, cercano y consistente (tuteo) | Sin mezcla de registros en la misma pantalla | Media: mezcla «usted» formal con imperativo distante |
| B7 | Sin lenguaje formal sin sentido | Sin «valor agregado», «buenas prácticas» | Generalmente cumple en INAPI |
| B8 ★ | Legibilidad ≥3/5 indicadores «Normal» (Legible u equiv.) | Documentar resultado de herramienta en comentario/JSON | Media si no hay evidencia de medición; `no_aplica` solo si no hay texto principal medible |

**`no_aplica` en sección B:** no aplica en ningún criterio B salvo páginas completamente sin texto editorial (B8: sin texto principal medible).

---

### Sección C — Redacción y concisión (C1–C9)

| ID | Criterio | Verificación | Calibración INAPI |
|---|---|---|---|
| C1 | Orden sujeto-verbo-predicado | «Las personas interesadas deben enviar el formulario» ✓ | Media: complementos circunstanciales antepuestos |
| C2 | Predomina presente simple | «Este formulario acredita…» | Generalmente cumple |
| C3 | Oraciones simples y directas | Una idea por oración | Media si hay oraciones de >30 palabras |
| C4 | Cada párrafo, una sola idea | Si hay dos ideas: separar en dos párrafos | Media en páginas con párrafos informativos mixtos |
| C5 | Párrafos <8 líneas en escritorio (o 4 en angostas) | Contar visualmente | Baja |
| C6 | Si ≥4 párrafos, incluye resumen al inicio | Solo aplica a textos extensos | `no_aplica` si <4 párrafos o secciones tipo tarjeta corta |
| C7 | Requisitos en modo infinitivo; campos con formato esperado | «Ser mayor de 18 años», «Enviar la solicitud» | `no_aplica` si no hay listas de requisitos |
| C8 ★ | Estructura tipo FAQ / respuestas a preguntas del usuario | No solo descripción institucional del servicio | Media en páginas solo institucionales |
| C9 ★ | Entre 2 y 8 párrafos de texto principal | Contar párrafos del cuerpo (sin menús/pies) | Distinto de C5; `no_aplica` en pantallas solo formulario sin cuerpo |

**`no_aplica` en sección C:**
- C6: `no_aplica` cuando el texto tiene menos de 4 párrafos continuos.
- C7: `no_aplica` cuando no hay listas de requisitos en la página.
- C9: `no_aplica` en pantallas sin cuerpo editorial (solo formulario/estado).

---

### Sección D — Ortografía, gramática y formato (D1–D7)

| ID | Criterio | Verificación | Calibración INAPI / Patrón conocido |
|---|---|---|---|
| D1 | Sin errores ortográficos | Revisar íntegro el inventario | **Alta transversal:** «Titulos» sin tilde en menú de Patentes (L471, L900). No confundir D1 (typos/tildes) con E4 (solo `<title>` con guiones) |
| D2 | Puntuación facilita la lectura | Puntos seguidos > comas encadenadas | Baja |
| D3 | Espacio entre párrafos | Verificar visualmente | `no_aplica`: criterio CSS/visual, fuera del alcance editorial |
| D4 | Texto alineado a la izquierda | No centrado ni justificado | `no_aplica`: criterio CSS/visual, fuera del alcance editorial |
| D5 | Listas o tablas para enumeraciones | Sin enumeraciones con comas en texto corrido | Baja |
| D6 | Negritas para palabras clave | Máximo una negrita por párrafo | `no_aplica` si no hay texto corrido extenso |
| D7 | Sin frases en MAYÚSCULAS SOSTENIDAS | «Ingrese aquí» ✓ / «INGRESE AQUÍ» ✗ | **Media transversal:** MI INAPI, TRAMITACIÓN, PAGOS, SERVICIOS en navbar (transversal a `_Layout.cshtml`) |

**`no_aplica` en sección D:**
- D3: casi siempre `no_aplica` (criterio visual/CSS).
- D4: casi siempre `no_aplica` (criterio visual/CSS).
- D6: `no_aplica` si no hay texto corrido extenso con palabras clave.

**Distinción D1 vs E4:** D1 = errores tipográficos y faltas de ortografía en texto **visible**; E4 = el **H1 visible** no es representativo del contenido (no evaluar el `<title>` del head).

---

### Sección E — Objetividad, autoría y fiabilidad (E1–E4)

| ID | Criterio | Verificación | Calibración INAPI / Patrón conocido |
|---|---|---|---|
| E1 | Sin opiniones ni adjetivos calificativos | Sin «excelente servicio», «moderna plataforma» | Generalmente cumple |
| E2 | Fuente o autoría identificable | Nombre de la institución en encabezado o pie | Cumple: INAPI siempre visible |
| E3 | Fecha de publicación o última modificación visible | Verificar en la página | **Alta transversal:** ausencia total de fecha en casi todas las páginas del inventario; ©año en footer NO equivale a fecha de actualización |
| E4 ↑ | El **H1 visible** representa fielmente el contenido específico | No genérico de área ni promesa distinta; **no** evaluar `<title>`/`<meta>` | Media: H1 genérico o desalineado del contenido |

**`no_aplica` en sección E:** ningún criterio E es `no_aplica` salvo páginas sin texto institucional alguno.

---

### Sección F — Enlaces y referencias (F1–F6)

| ID | Criterio | Verificación | Calibración INAPI / Patrón conocido |
|---|---|---|---|
| F1 | Nombre del enlace = nombre de la página de destino | «Solicitar marca» → lleva a página «Solicitar marca» | Baja: verificar CTAs principales |
| F2 | Sin «Haz clic aquí», «Más», «Ver más» o «Acceder» repetido vacío | Usar enlaces descriptivos | Baja |
| F3 | Enlaces, botones y mensajes de sistema significativos | «Consultar fecha de pago» ≠ «Consultar» | **Media transversal:** botones «Aceptar» y «OK» en modales de `_Layout.cshtml` |
| F4 ↑ | Documentos: título, formato, peso y breve descripción | Los cuatro elementos presentes | **Alta transversal:** PDFs sin formato/peso/descripción |
| F5 | Enlaces fuera del texto corrido que se debe leer | Al final del párrafo o como CTA | Baja |
| F6 ★ | Enlaces relacionados al mismo sitio (no solo menú global) | ≥1 enlace interno relevante de contexto | Distinto de F5 (posición vs destino); Baja/Media según página |

---

### Sección G — Datos personales y propiedad intelectual (G1–G3)

| ID | Criterio | Verificación | Calibración INAPI |
|---|---|---|---|
| G1 | Sin RUT, teléfonos ni direcciones de personas naturales | Buscar patrones en copy **institucional** y exposición indebida | **HTML público:** RUT institucional (persona jurídica pública) = `cumple`; RUN/nombre en HTML estático = `incumple alta`. **Sesión autenticada (§19):** datos del solicitante en su formulario = **esperados**; evaluar exposición indebida de terceros o datos fuera del contexto del trámite |
| G2 | Información sobre derechos ARCO visible | Enlace o sección en política de privacidad | `no_aplica` en páginas internas/transaccionales post-login |
| G3 | Condiciones de uso publicadas | Copyright o licencia Creative Commons | Generalmente cumple en INAPI |

**Grupo 5 (sub-subagente G+H) con `captura_con_sesion: true`:**

Instrucción obligatoria al lanzar el agente:

> Evalúa G1–G3 según CLAUDE.md §19. No marques incumple en G1 por RUT, nombre, correo o marca del usuario en campos de su trámite. Evalúa si etiquetas, ayudas y orden del formulario son entendibles. Anonimiza todas las citas y sustituciones.

| Situación | G1 | Severidad típica |
|---|---|---|
| RUT del solicitante en campo de formulario propio | `cumple` | — |
| Nombre de marca en trámite activo del usuario | `cumple` | — |
| RUN de tercero en listado público sin anonimizar | `incumple` | alta |
| Etiqueta de campo ambigua («Dato 1», sin ayuda) | Evaluar en B2/C1, no G1 | media |
| Copy institucional con error ortográfico en etiqueta | D1, no G1 | según D1 |

---

### Sección H — Archivo y versionado (H1)

| ID | Criterio | Verificación | Calibración INAPI |
|---|---|---|---|
| H1 | Versiones anteriores publicadas rotuladas como archivo | «Requisitos de postulación 2024 (archivo)» | `no_aplica` en la mayoría de URLs del inventario (no tienen versiones publicadas) |

---

## Umbrales de aceptación

| Rango | Estado |
|---|---|
| `porcentaje_cumplimiento` ≤ 80% | **rechazado** |
| 81% – 90.9% | **aceptado con observaciones** |
| ≥ 91% | **aprobado** |

**Fórmula:** `porcentaje_cumplimiento = criterios_aprobados / criterios_aplicables × 100`
donde `criterios_aplicables = 47 − criterios_no_aplica` (v2.1) y `criterios_aprobados = count("cumple")`.
En auditorías históricas v1.1 usar `39 − criterios_no_aplica`.
`no_aplica` **NO entra en el denominador**.

---

## Fase 2 — Validación antes de emitir JSON

Verificar ANTES de escribir el JSON final:

- [ ] ¿Hay exactamente **47 objetos** en `criterios_evaluados[]`, ordenados A1…H1 (v2.1)?
- [ ] ¿`cumple + incumple + no_aplica = 47` exactamente?
- [ ] ¿`version_checklist` es `"2.1"`?
- [ ] ¿Cada `incumple` tiene al menos una entrada en `sustituciones[]`?
- [ ] ¿El porcentaje usa la fórmula correcta? (`cumple / (cumple + incumple) × 100`, un decimal)
- [ ] ¿Todo hallazgo en `observaciones_lc_por_severidad` tiene fila equivalente en `sustituciones[]`?
- [ ] ¿El `id` del archivo sigue el patrón `{slug-url}_{YYYY-MM-DD}`?
- [ ] ¿`severidad` solo existe en criterios con `estado = "incumple"`?
- [ ] ¿No hay `null` en ningún campo del JSON?
- [ ] Si `captura_con_sesion: true`: ¿ningún valor real del solicitante en `cita_textual`, `original` o `propuesto`?

---

## Patrones sistémicos transversales — verificar SIEMPRE

Estos 8 patrones aparecen en la mayoría de URLs del inventario INAPI y provienen de componentes compartidos (`_Layout.cshtml`, menús globales):

| Criterio | Patrón | Origen probable |
|---|---|---|
| D7 | MAYÚSCULAS en navbar: MI INAPI, TRAMITACIÓN, PAGOS, SERVICIOS | `_Layout.cshtml` — navbar global |
| D1 | «Titulos» sin tilde en menú de Patentes | `_Layout.cshtml` — menú de Patentes |
| F3 | Botones «OK» / «Aceptar» en modales | `_Layout.cshtml` — modales globales |
| F4 | PDFs sin indicación de formato/peso | Toda la sección de documentos del sitio |
| E3 | Ausencia de fecha de actualización visible | No hay componente de fecha en el layout |
| E4 | H1 visible genérico o desalineado | No usar `<title>` del head |
| B3 | PCT en menú de Patentes sin expansión contextual | `_Layout.cshtml` — menú de Patentes |
| H1 | Imágenes sin atributo `alt` descriptivo | Múltiples componentes del layout |

**Nota:** cuando D7, D1, F3, E4 y B3 son sistémicos (provienen del layout), el campo `motivo` en `sustituciones[]` debe indicar que el cambio es en `_Layout.cshtml` y afecta a todas las páginas del sitio.

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
bun run validate:claude-audits   # debe pasar sin errores
git add data/claude-audits/...
git commit -m "feat(audits): agregar auditoría {slug-url} — {estado_aceptacion} {porcentaje}%"
```
