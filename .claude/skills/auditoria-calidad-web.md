# Skill: Auditoría Calidad Web — Marco Normativo INAPI

Referencia operativa: `.claude/CLAUDE.md` §1 (dominio) y §2 (criterios)
ADR de referencia: `docs/adr/0010-rag-local-chroma-xenova-transformers.md`
Colección RAG A: fuentes normativas ingresadas en `rag/chroma_db/coleccion_a/`

---

## Cuándo activar
- Cuando se necesite fundamentar por qué un criterio incumple desde el marco normativo.
- Cuando se redacte la `nota_final_tic` y se quieran citar estándares de gobierno.
- Cuando se evalúe una página de servicio digital transaccional (portal `tramites.inapi.cl`) y aplique el instrumento MEI.
- Cuando se requiera contexto sobre el marco de calidad web (citas `CW` del checklist), el Meta MEI o el UI Kit Gobierno.

---

## 1. Mapa normativo — qué cubre cada documento

| Documento (PDF en `documentos/`) | Abreviatura en `source` | Qué regula | Relevante para |
|---|---|---|---|
| **Meta MEI** (`meta-mei.pdf`) — documento principal | `META-MEI` / `CW`* | Instrumento de evaluación de servicios digitales y marco de calidad web institucional que fundamenta el checklist | A1–H1; peso especial en `tramites.inapi.cl` (B, C, D) |
| Recomendaciones de Lenguaje Claro (`lenguaje-claro-recomendaciones.pdf`) | `RLC` | Guía de escritura en lenguaje claro para comunicaciones del Estado | B1–B7, C1–C7, F1–F5 (especialmente F2, F3) |
| Instrumento de Evaluación de Sitios Web (`instrumento-evaluacion-sitios-web.pdf`) | `IEW` | Revisión de sitios web informativos del Estado | A1–A5, E1–E4, G1–G3 |
| Instrumento de Evaluación de Servicios Digitales Transaccionales (`instrumento-evaluacion-servicios-digitales-transaccionales.pdf`) | `IESD` | Revisión de servicios digitales con transacciones (formularios, pagos) | F1–F5, G1–G3, flujos de tramitación |
| UI Kit Gobierno 3.0.1 (`ui-kit-gobierno-3.0.1.pdf`) | `UI-KIT` | Componentes de diseño, accesibilidad visual, patrones de interacción | D3, D4, D6, D7 (criterios visuales) |

\* Las citas `CW` / `CW 5.x.x` en `checklist-criteria.json` **no** apuntan a un PDF separado «Calidad Web 2.0». Son referencias al marco de calidad web que vive principalmente en **Meta MEI** y se complementa con RLC, IEW e IESD.

---

## 2. Relación fuente normativa ↔ criterio

Derivado del campo `source` en `data/checklist-criteria.json`:

| Criterio | Fuente principal | Referencia específica |
|---|---|---|
| A1 | CW | §5 — Estructura del contenido |
| A2 | CW, RLC | §4, §5 / CW 5.2.4 |
| A3 | CW, RLC | §4, §5 / CW 5.2.4 |
| A4 | RLC | §1 |
| A5 | RLC | §4 |
| B1 | RLC, CW | §7 / CW 5.2.1 |
| B2 | RLC, CW | §7, §8 / CW 5.1.3 |
| B3 | RLC, CW | §7 / CW 5.1.3 |
| B4 | CW | 5.1.3 |
| B5 | CW | 5.1.3 |
| B6 | CW | 5.2.1 |
| B7 | RLC | §8 |
| C1 | CW | 5.2.1 |
| C2 | CW | 5.2.1 |
| C3 | CW | 5.2.2 |
| C4 | CW | 5.2.2 |
| C5 | CW | 5.2.2 |
| C6 | CW | 5.2.2 |
| C7 | CW | 5.2.1 |
| D1 | CW | 5.1.5 |
| D2 | CW | 5.1.5 |
| D3 | CW | 5.2.3 |
| D4 | CW | 5.2.3 |
| D5 | CW | 5.2.3 |
| D6 | CW | 5.2.4 |
| D7 | CW | 5.2.4 |
| E1 | CW | 5.3.1 |
| E2 | CW | 5.1.1 |
| E3 | CW | 5.1.4 |
| E4 | CW | 5.1.2 |
| F1 | RLC | §9 |
| F2 | RLC, CW | §9 / CW 5.2.4 |
| F3 | RLC, CW | §9 / CW 5.2.4 |
| F4 | CW | 5.2.4 |
| F5 | RLC | §9 |
| G1 | CW | 5.1.7 |
| G2 | CW | 5.1.7 |
| G3 | CW | 5.1.6 |
| H1 | CW | 5.3.2 |

---

## 3. Marco de calidad web (referencias `CW` en el checklist)

El checklist v1.1 cita secciones tipo `CW 5.1.x` / `CW 5.2.x`. Esas etiquetas organizan el marco de **calidad web institucional** en dimensiones que se mapean al checklist:

| Dimensión (etiqueta CW) | Secciones del checklist | Contenido |
|---|---|---|
| **5.1 Contenido** | E2 (5.1.1), E4 (5.1.2), B2–B4 (5.1.3), E3 (5.1.4), D1–D2 (5.1.5), G3 (5.1.6), G1–G2 (5.1.7) | Autoría, representatividad del título, lenguaje, fecha, ortografía, datos personales |
| **5.2 Estructura y presentación** | B1, B6, C1–C2 (5.2.1), C3–C6 (5.2.2), D3–D5 (5.2.3), D6–D7, A1–A3, F2–F4 (5.2.4) | Voz activa, oraciones, párrafos, formato, negritas, mayúsculas, enlaces |
| **5.3 Veracidad y objetividad** | E1 (5.3.1), H1 (5.3.2) | Sin opiniones, archivo de versiones |
| **Pirámide invertida y estructura** | A1–A5 | RLC §1–§9 complementa estructura y redacción |
| **Servicios transaccionales** | F1–F5, G1–G3 (META-MEI / IESD) | Especialmente relevante para `tramites.inapi.cl` |

**Documento PDF principal para fundamentar esas citas:** `meta-mei.pdf`. Complementos: `lenguaje-claro-recomendaciones.pdf`, `instrumento-evaluacion-sitios-web.pdf`, `instrumento-evaluacion-servicios-digitales-transaccionales.pdf`.

---

## 4. Meta MEI — documento principal de calidad web / servicios digitales

El **Meta MEI** (`meta-mei.pdf`) es el **documento normativo principal** del marco de calidad web en este proyecto: fundamenta la evaluación editorial de servicios digitales del Estado y es la fuente PDF a consultar primero cuando el checklist cite `CW` o criterios de tramitación.

**Foco del Meta MEI en el checklist INAPI:**
- **Sección B** (lenguaje claro): voz activa, tuteo, siglas, tono positivo — peso aumentado en tramitación.
- **Sección C** (redacción): párrafos de una idea, presente simple, oraciones simples — especialmente para instrucciones de formularios.
- **Sección D** (mecánica): ortografía, tipografía — errores en contexto de trámites generan desconfianza institucional.

**Criterios MEI que INAPI priorizó para la entrega jun 2026 (acuerdo con Bernarda/Álvaro):**
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
- `sitioweb`: aplicar Calidad Web 2.0 completo; verificar A1–A5 (estructura editorial).
- `buscador`: aplicar criterios de herramienta interactiva; A4/A5 frecuentemente `no_aplica`.

---

## 6. Cómo citar fuentes normativas en los JSONs

En el campo `comentario` del criterio:
```json
"comentario": "Según CW 5.2.4, deben evitarse palabras escritas únicamente en mayúsculas excepto siglas reconocidas. Los grupos del menú MI INAPI, TRAMITACIÓN, PAGOS, SERVICIOS están en mayúsculas totales."
```

En el campo `nota_final_tic` (para TI INAPI):
```
"Las correcciones de D7 aplican al _Layout.cshtml según el estándar Calidad Web 2.0 §5.2.4 del Gobierno de Chile. Afectan a todas las páginas del portal de tramitación que usan este layout compartido."
```

En el `resumen_ejecutivo`:
```
"La evaluación aplica el Checklist Editorial INAPI v1.1 basado en Calidad Web 2.0 (Gobierno de Chile), Recomendaciones de Lenguaje Claro y el instrumento Meta MEI para servicios transaccionales."
```

---

## 7. Consulta al RAG colección A — guía práctica

Para obtener la cita normativa exacta antes de redactar el comentario:

```
RAG colección A — query: "CW 5.2.4 mayúsculas tipografía encabezados"
→ Resultado esperado: fragmento de `meta-mei.pdf` (y/o RLC) que sustente la regla de mayúsculas; la etiqueta `CW 5.2.4` del checklist es la referencia conceptual, no un PDF aparte.

RAG colección A — query: "RLC §7 siglas acrónimos primera vez"
→ Resultado esperado: párrafo del PDF lenguaje-claro-recomendaciones.pdf

RAG colección A — query: "MEI criterio lenguaje claro trámite digital"
→ Resultado esperado: fragmento del instrumento meta-mei.pdf sobre redacción en tramitación
```

**Si el RAG no está disponible:** usar los campos `source` del `checklist-criteria.json` como referencia bibliográfica y formular el comentario indicando la sección del estándar sin cita textual.
