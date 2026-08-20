# Skill: Auditoría Calidad Web — Marco Normativo INAPI

## Qué es este documento

Skill de **fundamento normativo**: explica qué regulan IEW, IESD, RLC, Meta MEI y UI Kit, y cómo citarlos en comentarios / notas TIC sin confundir el alcance de la auditoría LC.

## Para qué se utiliza

- Justificar *por qué* un `LC-*` incumple según el instrumento (no solo describir el texto malo).
- Redactar `nota_final_tic` y `resumen_ejecutivo` con citas de gobierno.
- Orientar consultas a **RAG Colección A** (PDFs en `documentos/`).

## Objetivo

Que cada juicio editorial esté anclado al marco INAPI/PMG-MEI y a los campos `source` del catálogo v3.0.

## Importancia en la orquestación Claude Code

Complementa —no sustituye— a `auditoria-lc.md`. Los sub-subagentes y el raíz la cargan cuando necesitan cita normativa o distinguir sitioweb vs trámites vs sesión autenticada. Sin ella, los comentarios tienden a ser vagos o a usar `CW` deprecado.

## Cableado (conversa con)

| Pieza | Relación |
| --- | --- |
| `../CLAUDE.md` | §1 dominio, §2 criterios, §8 MCP/RAG, §16 `no_aplica`, §19 sesión, §23 alcance |
| `auditoria-lc.md` | Evaluación y estados; esta skill aporta el *porqué* normativo |
| `pesquisa-criterios.md` | Ejecuta las queries RAG A/B que esta skill recomienda |
| `../prompts/audit-una-url.md` | Paso C (RAG) + instrucción a subagentes de cargar esta skill si hace falta |
| `../prompts/audit-lote.md` / `audit-oro-s22.md` | Misma cadena vía prompt canónico |
| `../diagrams/workflow_diagram.md` | Etapa RAG / fundamento |
| RAG Colección A | PDFs normativos (`rag/README.md`, ADR 0010) |

**Reglas** = CLAUDE.md §5. **Sub-subagentes** = §17 (Grupo 5 + todos cuando citan `source`).

ADR: `docs/adr/0010-rag-local-chroma-xenova-transformers.md`

---

## Cuándo activar
- Cuando se necesite fundamentar por qué un criterio incumple desde el marco normativo.
- Cuando se redacte la `nota_final_tic` y se quieran citar estándares de gobierno.
- Cuando se evalúe una página de servicio digital transaccional (`tramites.inapi.cl`) y aplique el instrumento MEI/IESD.
- Cuando se requiera contexto normativo (`IEW`/`IESD`/`RLC`/`MEI` del checklist v3.0) o UI Kit.
- Cuando se trace un hito/tarea del Checklist Editorial PTD hacia criterios `LC-*` — ver `data/checklist-criteria-lc-ptd.json`, `data/checklist-editorial-ptd-v2.json` y `docs/checklist-ptd-v2-mapa.md`.

**Nota de alcance META MEI 2026:** el motor §17 evalúa **Lenguaje claro** (**51** criterios v3.0). Usabilidad (**18**) y Seguridad (**10**) del Word/JSON **no** se puntúan aún (CLAUDE.md §23).

---

## 1. Mapa normativo — qué cubre cada documento

| Documento (PDF en `documentos/`) | Abreviatura en `source` | Qué regula | Relevante para |
|---|---|---|---|
| Instrumento de Evaluación de Sitios Web | `IEW` | Calidad de sitios web informativos | Indicadores LC §1 (1.1.x–1.3.x) |
| Instrumento de Evaluación de Servicios Digitales Transaccionales | `IESD` | Servicios/trámites digitales | Indicadores LC §5 (5.1.x–5.3.x) |
| Recomendaciones de Lenguaje Claro | `RLC` | Lenguaje claro, estructura, enlaces | Lenguaje plano, Claridad, Escritura web |
| **Meta MEI** (`meta-mei.pdf`) | `MEI` | Compromiso institucional PMG-MEI | Contexto de hitos; no sustituye IEW/IESD |
| UI Kit Gobierno 3.0.1 | `UI` | Diseño visual / componentes | Complemento de legibilidad (fuera de alcance editorial frecuente) |

**v3.0:** citar `IEW`/`IESD`/`RLC`/`MEI` del campo `source` en `checklist-criteria-lc-ptd.json`. La sigla `CW` queda deprecada.

---

## 2. Relación fuente normativa ↔ criterio (v3.0)

Usar el campo `source` de cada fila en `data/checklist-criteria-lc-ptd.json` (51 criterios). No mantener tabla A1–H1 aquí: está obsoleta para auditorías nuevas.

## 3. Marco IEW / IESD

El catálogo v3.0 usa numeración del instrumento (p. ej. `IEW 1.1.3`, `IESD 5.1.2`). Orientación:

| Dimensión | Indicadores | Contenido |
|---|---|---|
| **Completitud / contenido clave** | 1.1.2 / 5.1.2 | Sin «en construcción»; datos qué/cómo/dónde/cuándo/quién; autonomía del trámite; título fiel |
| **Lenguaje plano** | 1.1.3 / 5.1.3 | Legible, jerga, siglas, tono |
| **Claridad / Concisión** | 1.2.1–1.2.2 / 5.2.1–5.2.2 | FAQ, oraciones, párrafos, resumen |
| **Legibilidad / Escritura web** | 1.2.3–1.2.4 / 5.2.3–5.2.4 | Espacio, listas, pirámide, PDF, rótulos |
| **Autoría / fechas / objetividad / archivo** | 1.1.1, 1.1.4, 1.3.2–1.3.3 | Fuente, fecha visible, neutro, versiones |
| **PI / Privacidad / Sensibles** | 1.1.6–1.1.8 / 5.1.6–5.1.7 | Licencias, ARCO, RUN, sensibles |

**PDFs a consultar:** `instrumento-evaluacion-sitios-web.pdf`, `instrumento-evaluacion-servicios-digitales-transaccionales.pdf`, `lenguaje-claro-recomendaciones.pdf`. `meta-mei.pdf` = compromiso MEI, no cita primaria de cada fila.

---

## 4. Meta MEI — documento principal de calidad web / servicios digitales

El **Meta MEI** (`meta-mei.pdf`) documenta el **compromiso institucional** PMG-MEI. En v3.0, la fuente primaria de cada criterio es `IEW`/`IESD`/`RLC` según el campo `source`; MEI no sustituye esos instrumentos.

**Foco del Meta MEI en el checklist INAPI:**
- **Lenguaje plano:** voz activa, tuteo, siglas, tono positivo — peso aumentado en tramitación.
- **Claridad / Concisión:** párrafos de una idea, presente simple, oraciones simples — especialmente para instrucciones de formularios.
- **Redacción y ortografía:** errores en contexto de trámites generan desconfianza institucional.

**Prioridad entrega 2026 (acuerdo Equipo UX):** lenguaje claro e instrucciones de tramitación; concisión en pasos; ortografía en interfaz de trámite.

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
- `tramites` **públicas:** aplicar Meta MEI con mayor peso en lenguaje plano / claridad / ortografía; RUN ajeno en HTML estático = incumple (`LC-1.1.7-01`).
- `tramites` **con sesión (`captura_con_sesion: true`):** privacidad calibrada en `CLAUDE.md` §19 — datos del solicitante = esperados; evaluar claridad de etiquetas y ayudas; ARCO = `LC-1.1.7-03`.
- `sitioweb`: aplicar IEW (15 indicadores LC); exclusivas IEW cuando correspondan.
- `buscador`: herramienta interactiva; varios criterios de cuerpo editorial pueden ser `no_aplica`.

**Estados / severidad (igual que auditoria-lc):** solo `cumple` \| `incumple` \| `no_aplica`; `severidad` baja/media/alta en incumple → UI Cumple con observaciones / Medianamente cumple / No cumple. Propuestas en lenguaje CMS (§22).

---

## 6. Cómo citar fuentes normativas en los JSONs

En el campo `comentario` del criterio:
```json
"comentario": "Según IEW/IESD 5.2.4, deben evitarse palabras escritas únicamente en mayúsculas excepto siglas reconocidas. Los grupos del menú MI INAPI, TRAMITACIÓN, PAGOS, SERVICIOS están en mayúsculas totales."
```

En el campo `nota_final_tic` (para TI INAPI), preferir primero mensaje CMS y luego apoyo técnico:
```
"En el menú superior, pasar los grupos de MAYÚSCULAS a mayúscula inicial (LC-1.2.4-05, IEW/IESD escritura web). Suele estar en el layout compartido: al corregirlo una vez, mejora todas las páginas del portal."
```

En el `resumen_ejecutivo`:
```
"La evaluación aplica el Checklist Editorial INAPI PTD-LC v3.0 (51 criterios por indicadores IEW/IESD) con citas IEW, IESD, RLC y MEI."
```

---

## 7. Consulta al RAG colección A — guía práctica

Para obtener la cita normativa exacta antes de redactar el comentario (detalle de queries: `pesquisa-criterios.md`):

```
RAG colección A — query: "IEW 1.2.4 mayúsculas tipografía encabezados"
→ Fragmento IEW/IESD (y/o RLC) sobre mayúsculas.

RAG colección A — query: "RLC siglas acrónimos primera vez"
→ Párrafo de lenguaje-claro-recomendaciones.pdf

RAG colección A — query: "MEI criterio lenguaje claro trámite digital"
→ Fragmento de meta-mei.pdf sobre redacción en tramitación
```

**Si el RAG no está disponible:** usar los campos `source` de `checklist-criteria-lc-ptd.json` y formular el comentario indicando la sección del estándar sin cita textual.

Ver `../diagrams/workflow_diagram.md` §5 (etapa RAG).
