# Skill: Auditoría Lenguaje Claro PTD-LC v3.0

Fuente de verdad de criterios: `./data/checklist-criteria-lc-ptd.json` (**51** criterios / indicadores IEW·IESD)
Fuente de verdad de schemas: `./src/schemas/claude-audit-pilot.ts` y `./src/schemas/url-audit.ts`
Referencia operativa: `.claude/CLAUDE.md` (especialmente §2, §5, §8, §12, §16, §17, §20, §21, **§22**, **§23**)
Plantilla canónica: `.claude/prompts/audit-una-url.md`
**PTD LC (META MEI 2026):** Word `docs/Checklist_Editorial_INAPI_v2_0_actualizado.docx` + `data/checklist-editorial-ptd-v2.json` + catálogo **51** filas. **No** consolidar a A–H. Usabilidad **18** y Seguridad **10** fuera del % (§23).
**Histórico:** `data/checklist-criteria.json` (47 A–H) solo para JSON ya emitidos.

---

## Cuándo activar
Cuando se pida auditar una URL, procesar un HTML o generar un JSON canónico de auditoría.
También se carga automáticamente en los sub-subagentes de cada grupo temático (ver §17 de CLAUDE.md).

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
| **U** Chrome UI / formato | Fechas visibles, listas/viñetas, alineación, espacios, enlaces PDF (título/formato/peso/desc), `alt`, encabezados de escaneo | Legibilidad, Escritura web, Actualización, Archivo |

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
5. **Gate de evidencia (§20.6):** no emitir `cumple` sin evidencia positiva; `incumple` exige cita/Tnnn + sustitución; `no_aplica` exige `comentario`.
6. Registrar UNA evidencia representativa por criterio. Preferir hallazgos **distintos**; si es el mismo nodo → §20.3.
7. **Entrega humana (§22):** **ninguna casilla vacía.** Todo criterio lleva `comentario`. Si `incumple` → `ubicacion_pantalla`, `original`, `propuesto` accionable y `motivo`.
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

- [ ] ¿Un editor CMS sabría **dónde** mirar solo con `ubicacion_pantalla` (zona › bloque › elemento)?
- [ ] ¿`propuesto` se puede **pegar** o es instrucción inequívoca (no “mejorar claridad”)?
- [ ] ¿Documentos: título + formato + peso + descripción, o instrucción de completar formato/peso sin inventar KB?
- [ ] ¿Fecha: instrucción de fecha visible bajo título (no solo © del pie)?
- [ ] ¿Siglas en menú: propuesta sutil (tooltip/`title`/destino) sin congestionar el ítem?
- [ ] ¿`motivo` = pregunta + fallo + (si aplica) patrón de layout / WCAG?
- [ ] ¿`criterio_id` es un id `LC-*` (no A1–H1)?

- [ ] ¿Sin jerga §17 / Tnnn como única ubicación / selectores CSS?

Mapa PTD editorial (LC / Usabilidad / Seguridad) por indicadores: `docs/checklist-ptd-v2-mapa.md`.  
Catálogo Hito→Tarea→Pregunta: `data/checklist-editorial-ptd-v2.json` · criterios máquina: `data/checklist-criteria-lc-ptd.json` · orquestación CLAUDE.md **§23**.

## Los 51 criterios — referencia por indicadores

**No** usar A1–H1 en auditorías nuevas. Definición completa (pregunta, `display_label`, applicability, criticidad) en `data/checklist-criteria-lc-ptd.json`.

| Indicador | Códigos | IDs | Calibración rápida |
| --- | --- | --- | --- |
| Fiabilidad | 1.1.1 / 5.1.1 | LC-1.1.1-01 | Autoría INAPI visible en encabezado/pie |
| Completitud | 1.1.2 / 5.1.2 | LC-1.1.2-01…04 | Título↔contenido; sin «en construcción»; datos clave en cuerpo (no menú); autonomía trámites |
| Lenguaje plano | 1.1.3 / 5.1.3 | LC-1.1.3-01…06 | Legible; tono; jerga; abreviaturas; siglas (tooltip en menú); tono positivo |
| Actualización | 1.1.4 / 5.1.4 | LC-1.1.4-01 | Fecha visible; nunca © del pie |
| Redacción y ortografía | 1.1.5 / 5.1.5 | LC-1.1.5-01…03 | Ortografía; puntuación; conectores (solo IEW) |
| Propiedad intelectual | 1.1.6 / 5.1.6 | LC-1.1.6-01…02 | Licencia/condiciones; anti-redifusión (solo IEW) |
| Privacidad | 1.1.7 / 5.1.7 | LC-1.1.7-01…03 | RUN/teléfonos (solo IEW); ARCO; RUT institucional = cumple; sesión auth §19 |
| Contenidos sensibles | 1.1.8 | LC-1.1.8-01…03 | Solo IEW; `no_aplica` si no hay menores/sensibles |
| Claridad | 1.2.1 / 5.2.1 | LC-1.2.1-01…05 + LC-5.2.1-01 | FAQ; voz activa; SVP; infinitivo; variante IESD en trámites |
| Concisión | 1.2.2 / 5.2.2 | LC-1.2.2-01…05 + LC-5.2.2-01 | Brevedad; ≤8 líneas; una idea; resumen; variante IESD |
| Legibilidad | 1.2.3 / 5.2.3 | LC-1.2.3-01…03 | Espacio; alineación izq.; listas/tablas |
| Escritura para la web | 1.2.4 / 5.2.4 | LC-1.2.4-01…08 + LC-5.2.4-01 | Pirámide; títulos; escaneo; negritas; mayúsculas; enlaces rel. (IEW); rótulos (IESD); PDF título+formato+peso+desc |
| Visualización | 1.3.1 | LC-1.3.1-01 | Solo IEW; apoyos visuales |
| Objetividad | 1.3.2 / 5.3.1 | LC-1.3.2-01…02 | Neutro; 80 % hechos (solo IEW) |
| Archivo | 1.3.3 / 5.3.2 | LC-1.3.3-01 | Versiones no vigentes rotuladas |

Severidad (`baja`/`media`/`alta`) solo en `incumple`. Estados: `cumple` | `incumple` | `no_aplica` (+ comentario siempre).

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

| Criterio | Patrón | Origen probable |
|---|---|---|
| LC-1.2.4-05 | MAYÚSCULAS en navbar: MI INAPI, TRAMITACIÓN, PAGOS, SERVICIOS | `_Layout.cshtml` — navbar global |
| LC-1.1.5-01 | «Titulos» sin tilde en menú de Patentes | `_Layout.cshtml` — menú de Patentes |
| LC-5.2.4-01 / rótulos | Botones «OK» / «Aceptar» / «Más» ambiguos | Modales / CTAs globales |
| LC-1.2.4-07/08 | PDFs sin título/formato/peso/descripción | Sección documentos |
| LC-1.1.4-01 | Ausencia de fecha de actualización visible | Sin componente de fecha |
| LC-1.1.2-01 | H1 visible genérico o desalineado | No usar `<title>` del head |
| LC-1.1.3-05 | PCT en menú de Patentes sin expansión contextual | Menú de Patentes |
| LC-1.3.1-01 | Imágenes sin apoyo visual / `alt` débil | Layout |

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
bun run validate:claude-audits   # debe pasar sin errores
git add data/claude-audits/...
git commit -m "feat(audits): agregar auditoría {slug-url} — {estado_aceptacion} {porcentaje}%"
```
