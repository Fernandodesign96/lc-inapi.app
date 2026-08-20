# Skill: Auditoría Calidad Web — Marco Normativo INAPI

Referencia operativa: `.claude/CLAUDE.md` §1 (dominio) y §2 (criterios)
ADR de referencia: `docs/adr/0010-rag-local-chroma-xenova-transformers.md`
Colección RAG A: fuentes normativas ingresadas en `rag/chroma_db/coleccion_a/`

---

## Cuándo activar
- Cuando se necesite fundamentar por qué un criterio incumple desde el marco normativo.
- Cuando se redacte la `nota_final_tic` y se quieran citar estándares de gobierno.
- Cuando se evalúe una página de servicio digital transaccional (portal `tramites.inapi.cl`) y aplique el instrumento MEI.
- Cuando se requiera contexto normativo (citas `IEW`/`IESD`/`RLC`/`MEI` del checklist v2.1), o el UI Kit Gobierno.
- Cuando se trace un hito/tarea del Checklist Editorial PTD (v2.0) hacia criterios A–H — ver `docs/checklist-ptd-v2-mapa.md`.

**Nota de alcance 2026:** el motor §17 evalúa **Lenguaje claro / contenido editorial** (47 criterios). Las dimensiones Usabilidad y Seguridad del PTD editorial v2.0 **no** se evalúan aún en los sub-subagentes; el mapa documenta el puente para no confundir alcances.

---

## 1. Mapa normativo — qué cubre cada documento

| Documento (PDF en `documentos/`) | Abreviatura en `source` | Qué regula | Relevante para |
|---|---|---|---|
| Instrumento de Evaluación de Sitios Web (`instrumento-evaluacion-sitios-web.pdf`) | `IEW` | Calidad de sitios web informativos | A, B, C, D, E, F, G, H (citas IEW) |
| Instrumento de Evaluación de Servicios Digitales Transaccionales (`instrumento-evaluacion-servicios-digitales-transaccionales.pdf`) | `IESD` | Servicios/trámites digitales | A6–A8 (trámites), B–H en `tramites.inapi.cl` |
| Recomendaciones de Lenguaje Claro (`lenguaje-claro-recomendaciones.pdf`) | `RLC` | Lenguaje claro, estructura, enlaces | A1–A5, A9, B1–B3, B7, F1–F5 |
| **Meta MEI** (`meta-mei.pdf`) | `MEI` | Compromiso institucional PMG-MEI (no sustituye IEW/IESD) | Contexto de hitos; no es la cita primaria de cada criterio v2.1 |
| UI Kit Gobierno 3.0.1 (`ui-kit-gobierno-3.0.1.pdf`) | `UI` | Diseño visual / componentes | Complemento D3/D4/D6 (fuera de alcance editorial frecuente) |

**v2.1:** la sigla genérica `CW` queda **deprecada** en el catálogo. Auditorías históricas v1.1 pueden seguir citando `CW` (legado → consultar `meta-mei.pdf` + IEW/IESD).

---

## 2. Relación fuente normativa ↔ criterio (v2.1)

Derivado del campo `source` en `data/checklist-criteria.json` (47 criterios):

| Criterio | Fuente (`source`) |
|---|---|
| A1 | RLC §5 |
| A2 | RLC §4, IEW 5.2.4, IESD 5.2.4 |
| A3 | RLC §4,§5, IEW 5.2.4 |
| A4 | RLC §1 |
| A5 | RLC §4 |
| A6 | IEW 1.1.2, IESD 5.1.2 |
| A7 | IEW 1.1.2, IESD 5.1.2 |
| A8 | IESD 5.1.2 |
| A9 | IEW 1.2.4, IESD 5.2.4, RLC §1 |
| B1 | RLC §7, IEW 5.2.1, IESD 5.2.1 |
| B2 | RLC §7,§8, IEW 5.1.3, IESD 5.1.3 |
| B3 | RLC §7, IEW 5.1.3, IESD 5.1.3 |
| B4 | IEW 5.1.3, IESD 5.1.3 |
| B5 | IEW 5.1.3, IESD 5.1.3 |
| B6 | IEW 5.2.1, IESD 5.2.1 |
| B7 | RLC §8 |
| B8 | IEW 5.1.3, IESD 5.1.3 |
| C1 | IEW 5.2.1, IESD 5.2.1 |
| C2 | IEW 5.2.1, IESD 5.2.1 |
| C3 | IEW 5.2.2, IESD 5.2.2 |
| C4 | IEW 5.2.2, IESD 5.2.2 |
| C5 | IEW 5.2.2, IESD 5.2.2 |
| C6 | IEW 5.2.2, IESD 5.2.2 |
| C7 | IEW 5.2.1, IESD 5.2.1 |
| C8 | IEW 1.2.1, IESD 5.2.1 |
| C9 | IEW 1.2.2, IESD 5.2.2 |
| D1 | IEW 5.1.5, IESD 5.1.5 |
| D2 | IEW 5.1.5, IESD 5.1.5 |
| D3 | IEW 5.2.3, IESD 5.2.3 |
| D4 | IEW 5.2.3, IESD 5.2.3 |
| D5 | IEW 5.2.3, IESD 5.2.3 |
| D6 | IEW 5.2.4, IESD 5.2.4 |
| D7 | IEW 5.2.4, IESD 5.2.4 |
| E1 | IEW 5.3.1, IESD 5.3.1 |
| E2 | IEW 5.1.1, IESD 5.1.1 |
| E3 | IEW 5.1.4, IESD 5.1.4 |
| E4 | IEW 5.1.2, IESD 5.1.2 |
| F1 | RLC §9 |
| F2 | RLC §9, IEW 5.2.4, IESD 5.2.4 |
| F3 | RLC §9, IEW 5.2.4, IESD 5.2.4 |
| F4 | RLC §9, IEW 5.2.4, IESD 5.2.4 |
| F5 | RLC §9 |
| F6 | IEW 1.2.4, IESD 5.2.4 |
| G1 | IEW 5.1.7, IESD 5.1.7 |
| G2 | IEW 5.1.7, IESD 5.1.7 |
| G3 | IEW 5.1.6, IESD 5.1.6 |
| H1 | IEW 5.3.2, IESD 5.3.2 |

---

## 3. Marco IEW / IESD (reemplazo de citas `CW`)

El checklist v2.1 usa numeración del instrumento (p. ej. `IEW 5.1.3`, `IESD 5.1.2`). Orientación:

| Dimensión | Secciones del checklist | Contenido |
|---|---|---|
| **Completitud / contenido clave** | A6, A7, A8, E4 | Sin «en construcción»; datos qué/cómo/dónde/cuándo/quién; autonomía del trámite; título fiel |
| **Lenguaje y legibilidad** | B1–B8 | Voz activa, jerga, siglas, tono, Legible ≥3/5 |
| **Redacción y FAQ** | C1–C9 | Oraciones, párrafos, resumen, FAQ, 2–8 párrafos |
| **Formato** | D1–D7 | Ortografía, puntuación, listas, negritas, mayúsculas |
| **Autoría / fechas** | E1–E3 | Objetividad, autoría, fecha visible |
| **Enlaces** | F1–F6 | CTAs, PDF con descripción, enlaces relacionados |
| **Datos / archivo** | G1–G3, H1 | Privacidad, ARCO, condiciones de uso, versiones |

**PDFs a consultar:** `instrumento-evaluacion-sitios-web.pdf`, `instrumento-evaluacion-servicios-digitales-transaccionales.pdf`, `lenguaje-claro-recomendaciones.pdf`. `meta-mei.pdf` = compromiso MEI, no cita primaria de cada fila.

---

## 4. Meta MEI — documento principal de calidad web / servicios digitales

El **Meta MEI** (`meta-mei.pdf`) documenta el **compromiso institucional** PMG-MEI. En v2.1, la fuente primaria de cada criterio es `IEW`/`IESD`/`RLC` según el campo `source`; MEI no sustituye esos instrumentos.

**Foco del Meta MEI en el checklist INAPI:**
- **Sección B** (lenguaje claro): voz activa, tuteo, siglas, tono positivo — peso aumentado en tramitación.
- **Sección C** (redacción): párrafos de una idea, presente simple, oraciones simples — especialmente para instrucciones de formularios.
- **Sección D** (mecánica): ortografía, tipografía — errores en contexto de trámites generan desconfianza institucional.

**Criterios MEI que INAPI priorizó para la entrega jun 2026 (acuerdo con Equipo UX/jefatura de proyecto):**
- B: lenguaje claro en instrucciones de tramitación
- C: redacción concisa en pasos del proceso
- D: ortografía y tipografía sin errores en interfaz de trámite

**Páginas del inventario donde aplica Meta MEI con mayor peso:**
- `tramites.inapi.cl/` (landing del portal)
- `tramites.inapi.cl/Account/Login`
- `tramites.inapi.cl/Trademark/TrademarkApplication/...`
- `tramites.inapi.cl/EstadosDiariosMarcas`
- `tramites.inapi.cl/Notificaciones`

---

## 5. Contexto institucional INAPI

**INAPI** = Instituto Nacional de Propiedad Industrial (Chile), organismo técnico del Estado dependiente del Ministerio de Economía.

**Tipos de páginas auditadas:**
| `tipo_pagina` | Descripción | Dominio |
|---|---|---|
| `sitioweb` | Páginas informativas del sitio principal | `www.inapi.cl` |
| `tramites` | Portal de tramitación digital | `tramites.inapi.cl` |
| `buscador` | Buscador de marcas y patentes | `buscadormarcas.inapi.cl` |

**Relevancia del tipo para criterios:**
- `tramites` **públicas:** aplicar Meta MEI con mayor peso en B, C, D; G1 según HTML estático (RUN/nombre ajeno = incumple).
- `tramites` **con sesión (`captura_con_sesion: true`):** G1 calibrado en `CLAUDE.md` §19 — datos del solicitante en formulario = esperados; evaluar claridad de etiquetas y ayudas (B, C, F).
- `sitioweb`: aplicar IEW; verificar A1–A9 (estructura editorial).
- `buscador`: aplicar criterios de herramienta interactiva; A4/A5 frecuentemente `no_aplica`.

---

## 6. Cómo citar fuentes normativas en los JSONs

En el campo `comentario` del criterio:
```json
"comentario": "Según IEW/IESD 5.2.4, deben evitarse palabras escritas únicamente en mayúsculas excepto siglas reconocidas. Los grupos del menú MI INAPI, TRAMITACIÓN, PAGOS, SERVICIOS están en mayúsculas totales."
```

En el campo `nota_final_tic` (para TI INAPI):
```
"Las correcciones de D7 aplican al _Layout.cshtml según el estándar Calidad Web 2.0 §5.2.4 del Gobierno de Chile. Afectan a todas las páginas del portal de tramitación que usan este layout compartido."
```

En el `resumen_ejecutivo`:
```
"La evaluación aplica el Checklist Editorial INAPI v2.1 (47 criterios) con citas IEW, IESD, RLC y MEI."
```

---

## 7. Consulta al RAG colección A — guía práctica

Para obtener la cita normativa exacta antes de redactar el comentario:

```
RAG colección A — query: "IEW 5.2.4 mayúsculas tipografía encabezados"
→ Resultado esperado: fragmento de IEW/IESD (y/o RLC) que sustente la regla de mayúsculas.

RAG colección A — query: "RLC §7 siglas acrónimos primera vez"
→ Resultado esperado: párrafo del PDF lenguaje-claro-recomendaciones.pdf

RAG colección A — query: "MEI criterio lenguaje claro trámite digital"
→ Resultado esperado: fragmento del instrumento meta-mei.pdf sobre redacción en tramitación
```

**Si el RAG no está disponible:** usar los campos `source` del `checklist-criteria.json` como referencia bibliográfica y formular el comentario indicando la sección del estándar sin cita textual.
