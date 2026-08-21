# Mapa: instrumentos IEW/IESD (LC · Usabilidad · Seguridad) → catálogo LC v3.0

## Fuentes canónicas (orden de autoridad)

| Prioridad | Artefacto | Rol |
| --- | --- | --- |
| 1 | `docs/Checklist_Editorial_INAPI_v2_0_actualizado.docx` | Checklist editorial PTD: **Hito → Tarea → Pregunta** (IEW/IESD) |
| 1 | `docs/Checklist_Editorial_INAPI_v2_0_actualizado.extracted.md` | Texto del Word para RAG |
| 1 | `data/checklist-editorial-ptd-v2.json` | Misma estructura para Claude Code (hitos) |
| 2 | Este documento | Inventario pregunta-a-pregunta IEW↔IESD y exclusivas |
| 3 | `data/checklist-criteria-lc-ptd.json` | **51** criterios LC v3.0 = score, UI, PDF, Excel MEI |
| — | `data/checklist-criteria.json` | Histórico 47 A–H (no usar en auditorías nuevas) |

**Orquestación:** `.claude/CLAUDE.md` §17 + §20 + §22 + **§23** · `.claude/prompts/audit-una-url.md` · skill `auditoria-lc.md`.

**META MEI 2026:** auditar solo **Lenguaje claro** — **51 preguntas únicas** (38 ambos · 10 solo IEW · 3 solo IESD) → JSON canónico con **51** filas `LC-*` (`version_checklist: "3.0"`).  
**Catalogadas (fuera del % ahora):** Usabilidad **18** · Seguridad **10** · total tres dimensiones **79**.

**Instrumentos SGD (SISIB / Secretaría de Gobierno Digital, 2024):**

| Código | Documento | Dimensiones |
| --- | --- | --- |
| **IEW** | *Instrumento de evaluación de calidad para sitios web* | LC = **§1** (15 indicadores) · Usabilidad = **§2** · Seguridad = **§8** |
| **IESD** | *Instrumento de evaluación de calidad para servicios digitales transaccionales* | Usabilidad = **§1** · LC = **§5** (13 indicadores) · Seguridad = **§7** |

## Para qué sirve este documento

1. Listar **todas las preguntas de chequeo** de Lenguaje claro, Usabilidad y Seguridad en **ambos** instrumentos.
2. Decir a jefatura / Equipo UX / TIC qué evalúa Claude Code hoy (LC → **51** criterios por indicadores) y qué queda fuera del % §17.
3. Complementar el Word/JSON cuando haga falta el detalle IEW↔IESD.

## Compromiso institucional vs motor

| Dimensión | Proyecto PTD | Preguntas únicas IEW/IESD | Año | ¿En el motor §17 hoy? |
| --- | --- | --- | --- | --- |
| Contenido y lenguaje claro | PTD-D2.1-CL1 | **51** (38 ambos · 10 IEW · 3 IESD) | **2026** (META MEI) | **Sí** — 51 filas `LC-*` |
| Usabilidad | PTD-D2.1-US2 | **18** (16 ambos · 1 IEW · 1 IESD) | post-Excel LC / 2027 | **No** |
| Seguridad | PTD-D2.1-SE8 | **10** (9 ambos · 1 IEW) | cierre año / 2028 | **No** (salvo solape ARCO / LC-1.1.7-03) |
| **Total** | — | **79** (65 · 10 · 4) | — | — |

*Nota:* la columna «Motor» con códigos A–H en tablas de detalle es **referencia histórica**. El id vigente es el del catálogo `checklist-criteria-lc-ptd.json` (`LC-*`).

El Excel MEI usa **5 categorías de presentación** derivadas de `estado` + `severidad` del motor LC (47 filas). Eso **no** implica evaluación automática de Usabilidad/Seguridad.

## Cómo leer las tablas

- **IEW `n.n.n`** = sitios web · **IESD `n.n.n`** = servicios digitales / trámites.
- Columna **Motor:** id A1–H1 si la pregunta refuerza el checklist v2.1; `—` si está fuera del motor 2026.
- Preguntas casi idénticas en ambos instrumentos se listan **una vez** con códigos duales (`IEW 1.1.1` / `IESD 5.1.1`). Si difieren, se anota la variante.
- «No aplica» del instrumento: solo cuando el propio chequeo lo permite; en JSON canónico, `no_aplica` exige `comentario` (§20.4 / §22.8).

---

# A. Contenido y lenguaje claro

- **IEW:** dimensión **1**  
- **IESD:** dimensión **5**

## A.1 Imprescindibles

### Fiabilidad — IEW `1.1.1` / IESD `5.1.1` → **E2**

| # | Pregunta de chequeo | Instrumento |
| --- | --- | --- |
| 1 | ¿Es fácil reconocer la fuente o autoría de la información publicada? (p. ej. nombre de la institución en encabezado o pie; firma de unidad; «Fuente: …») | Ambos (IESD resume el ejemplo al encabezado/pie) |

### Completitud — IEW `1.1.2` / IESD `5.1.2` → **A5, A6, A7, A8** (+ **E4** para fidelidad título↔contenido)

| # | Pregunta de chequeo | Instrumento | Motor |
| --- | --- | --- | --- |
| 1 | ¿Los contenidos representan de manera fiel lo enunciado en su título? | Ambos | **E4**, refuerzo A |
| 2 | ¿Se cumple con la recomendación de no incluir páginas sin contenido, contenido incompleto o «En construcción»? | Ambos | **A6** |
| 3 | ¿El texto destaca los datos clave de la información? (qué, cómo, dónde, cuándo y para quién, o recuadro con fechas importantes) | Ambos | **A7** (realismo §22.9: cuerpo/recuadros, no labels de menú) |
| 4 | En textos referidos a trámites, ¿se brinda información suficiente para que las personas usuarias puedan realizarlos autónomamente? («No aplica» si no hay textos de trámites) | Ambos | **A8** (`no_aplica` en sitioweb informativo) |

### Lenguaje plano — IEW `1.1.3` / IESD `5.1.3` → **B1–B8** (B8 = Legible)

| # | Pregunta de chequeo | Instrumento | Motor |
| --- | --- | --- | --- |
| 1 | ¿El lenguaje está orientado a que una persona pueda entender el contenido, aun con mayor dificultad de comprensión lectora? (p. ej. Legible: ≥3/5 indicadores «Normal») | Ambos | **B8** |
| 2 | ¿El tono y voz son amables, respetuosos y cercanos con las personas usuarias? | Ambos | **B6** |
| 3 | ¿La redacción prescinde de la jerga técnica o legal? (equivalentes claros; evitar solo «Ley N°…» sin tema) | Ambos | **B2**, **B7** |
| 4 | ¿Se evitan abreviaturas, extranjerismos, eufemismos, modismos o términos rebuscados en al menos un 50% de los contenidos revisados? | Ambos | **B4** |
| 5 | ¿Se define cada sigla y acrónimo y se emplean solo si es necesario? («No aplica» si no hay siglas) | Ambos | **B3** (en menú: propuestas sutiles §22.9) |
| 6 | ¿Los contenidos están escritos en tono positivo (qué se puede hacer), evitando enfocar desde el «no se puede»? | Ambos | **B5** |

### Actualización — IEW `1.1.4` / IESD `5.1.4` → **E3**

| # | Pregunta de chequeo | Instrumento |
| --- | --- | --- |
| 1 | ¿Los contenidos están actualizados y muestran información vigente al año en curso? (fecha de publicación o última actualización expresa) | Ambos |

*Nota:* el © del pie **no** sustituye fecha de actualización (§22.11).

### Redacción y ortografía — IEW `1.1.5` / IESD `5.1.5` → **D1, D2** (+ conectores)

| # | Pregunta de chequeo | Instrumento | Motor |
| --- | --- | --- | --- |
| 1 | ¿Son correctas la ortografía (literal, acentual y puntual) y la gramática? (corrector: Word, Docs, LanguageTool; >1 error → no cumple) | Ambos | **D1** |
| 2 | ¿Los signos de puntuación facilitan la lectura? (privilegiar puntos seguidos frente a comas encadenadas) | Ambos | **D2** |
| 3 | ¿Las frases se relacionan entre sí por medio de conectores? (p. ej. «A su vez,», «Sin embargo,») | **Solo IEW** | Refuerzo D2 / redacción C |

### Propiedad intelectual — IEW `1.1.6` / IESD `5.1.6` → **G3**

| # | Pregunta de chequeo | Instrumento |
| --- | --- | --- |
| 1 | ¿El sitio cuenta con información de permisos de uso de sus contenidos? (copyright / Creative Commons / condiciones de uso) | Ambos |
| 2 | ¿Se evita la redifusión de material protegido por derechos de autor sin autorización? | **Solo IEW** |

### Privacidad y datos personales — IEW `1.1.7` / IESD `5.1.7` → **G1, G2**

| # | Pregunta de chequeo | Instrumento | Motor |
| --- | --- | --- | --- |
| 1 | Si hay listados de personas, ¿se evita publicar sus RUN? («No aplica» si no hay listados) | **Solo IEW** | **G1** |
| 2 | ¿El sitio protege la privacidad al no publicar direcciones ni teléfonos particulares? | **Solo IEW** | **G1** |
| 3 | ¿Existe información sobre cómo ejercer derechos ARCO (acceso, rectificación, cancelación/eliminación, oposición, bloqueo)? | Ambos | **G2** |

### Contenidos sensibles — IEW `1.1.8` → fuera del núcleo A–H habitual

| # | Pregunta de chequeo | Instrumento | Motor |
| --- | --- | --- | --- |
| 1 | Si publica información sobre menores, ¿se protege su identidad en textos y fotografías? («No aplica» si no hay menores) | **Solo IEW** | Anotar en `nota_final_tic` si aparece |
| 2 | ¿El contenido es apto para ser leído por menores de edad? | **Solo IEW** | Idem |
| 3 | ¿Se evita material que afecte la susceptibilidad o menoscabe a las personas? (Ley 19.628) | **Solo IEW** | Idem |

*IESD §5 no incluye este indicador en imprescindibles.*

## A.2 Esperables

### Claridad — IEW `1.2.1` / IESD `5.2.1` → **C8, B1, C1–C4, C7** (+ parte **A7**)

| # | Pregunta de chequeo | Instrumento | Motor |
| --- | --- | --- | --- |
| 1 | ¿Los contenidos están estructurados como respuestas a preguntas frecuentes de las personas usuarias? *(IESD: «¿La información del servicio digital está organizada…?»)* | Ambos (redacción levemente distinta) | **C8** |
| 2 | ¿Las palabras, frases y conceptos tienen un lenguaje claro para las personas usuarias? | Ambos | **B2** / claridad general |
| 3 | ¿Predomina el tiempo presente simple y la voz activa? | Ambos | **B1**, **C2** |
| 4 | ¿Las oraciones siguen sujeto-verbo-predicado? | Ambos | **C1** |
| 5 | Cuando se listan requisitos de servicios a la ciudadanía, ¿se usa modo infinitivo? («No aplica» si no hay listas de requisitos) | Ambos | **C7** |

### Concisión — IEW `1.2.2` / IESD `5.2.2` → **C3–C6, C9**

| # | Pregunta de chequeo | Instrumento | Motor |
| --- | --- | --- | --- |
| 1 | ¿Los textos son breves y usan frases cortas? *(IEW: p. ej. 2–8 párrafos por página; IESD: página de inicio y desarrollo del trámite)* | Ambos | **C9** / concisión |
| 2 | En escritorio, ¿los párrafos tienen menos de 8 líneas? | Ambos | **C5** |
| 3 | ¿Se explica una idea por párrafo? | Ambos | **C4** |
| 4 | ¿Las oraciones son simples y directas, sin exceso de palabras? | Ambos | **C3** |
| 5 | Si hay texto de ≥4 párrafos, ¿hay un resumen al inicio? («No aplica» si no hay textos largos) | Ambos | **C6** |

### Legibilidad — IEW `1.2.3` / IESD `5.2.3` → **D3, D4, D5**

| # | Pregunta de chequeo | Instrumento | Motor |
| --- | --- | --- | --- |
| 1 | ¿Hay espacio entre los párrafos? | Ambos | **D3** |
| 2 | ¿El texto está alineado a la izquierda? | Ambos | **D4** |
| 3 | ¿Se utilizan listas numeradas, viñetas o tablas para ordenar la información? | Ambos | **D5** |

### Escritura para la web — IEW `1.2.4` / IESD `5.2.4` → **A1–A3, A9, D6, D7, F1–F4, F6**

| # | Pregunta de chequeo | Instrumento | Motor |
| --- | --- | --- | --- |
| 1 | ¿Se aplica el modelo de «pirámide invertida» (de lo más a lo menos importante)? | Ambos | **A2** |
| 2 | ¿Páginas bien organizadas, con títulos y subtítulos claros? | Ambos | **A1**, **A3** |
| 3 | ¿Es fácil escanear visualmente los contenidos? | Ambos | **A9** |
| 4 | ¿Se usan negritas para destacar palabras clave de cada párrafo? | Ambos | **D6** |
| 5 | ¿Se evitan frases escritas únicamente en mayúsculas? | Ambos | **D7** |
| 6 | ¿Se vinculan contenidos del mismo sitio con enlaces relacionados? | **Solo IEW** | **F6** |
| 7 | ¿Los textos de los enlaces (rótulos) son descriptivos / CTA claros, evitando «Haga clic aquí» o «Más»? | **Solo IESD** | **F1**, **F2**, **F3** |
| 8 | Cuando se enlazan documentos, ¿se especifican título, formato y peso? (los tres; «No aplica» si no hay documentos) | Ambos | **F4** (parte) |
| 9 | ¿Se entrega una breve descripción de los documentos enlazados? («No aplica» si no hay documentos) | Ambos | **F4** (parte) |

*F4 en el motor exige los **cuatro** elementos (título + formato + peso + descripción); §22.11 si no se puede medir peso/formato.*

## A.3 Deseables

### Visualización de la información — IEW `1.3.1` → **LC-1.3.1-01**

| # | Pregunta de chequeo | Instrumento | Motor |
| --- | --- | --- | --- |
| 1 | ¿Se utilizan apoyos visuales (íconos, imágenes, gráficos, infografías) para presentar datos? («No aplica» si no hay datos que los requieran) | **Solo IEW** | **LC-1.3.1-01** — evalúa **presencia** de apoyos. Texto alternativo / WCAG ≠ esta pregunta (Usabilidad; fuera del % §23). |

### Objetividad — IEW `1.3.2` / IESD `5.3.1` → **E1**

| # | Pregunta de chequeo | Instrumento | Motor |
| --- | --- | --- | --- |
| 1 | ¿Los contenidos son objetivos y con redacción neutra, sin reflejar la opinión de quien los escribió? | Ambos | **E1** |
| 2 | ¿En al menos un 80% de los contenidos se privilegian datos y hechos sobre adjetivos calificativos? | **Solo IEW** | **E1** |

### Archivo — IEW `1.3.3` / IESD `5.3.2` → **H1**

| # | Pregunta de chequeo | Instrumento |
| --- | --- | --- |
| 1 | Si hay versiones anteriores de contenidos, ¿están rotuladas como archivo no vigente? (p. ej. «Requisitos de postulación 2015»; «No aplica» si no hay versiones) | Ambos |

---

# B. Usabilidad

- **IEW:** dimensión **2**  
- **IESD:** dimensión **1**  
- **Motor §17 2026:** **fuera** del % de los 47. No inventar scores de usabilidad en la auditoría LC. Si hace falta muestra 2026: anexo cualitativo / skill separado.

## B.1 Imprescindibles

### Coherencia y estandarización — IEW `2.1.1` / IESD `1.1.1`

| # | Pregunta de chequeo | Instrumento |
| --- | --- | --- |
| 1 | ¿Se respeta la organización del sitio/servicio y su consistencia en todas las páginas? (menú global / pasos del trámite en la misma posición) | Ambos (IEW: «sitio web»; IESD: «servicio digital») |
| 2 | En sitios del gobierno central, ¿se usan componentes del UI Kit del Gobierno Digital? («No aplica» si no es gobierno central) | Ambos |
| 3 | ¿Los iconos son comprensibles sin texto adicional y siguen convenciones? («No aplica» si no hay iconos) | Ambos |

### Diseño estético y minimalista — IEW `2.1.2` / IESD `1.1.2`

| # | Pregunta de chequeo | Instrumento |
| --- | --- | --- |
| 1 | ¿Los llamados a la acción y botones están claramente destacados (forma/color)? | Ambos |

### Diagnóstico y corrección de errores — IEW `2.1.3` / IESD `1.1.3`

| # | Pregunta de chequeo | Instrumento |
| --- | --- | --- |
| 1 | ¿Los mensajes de alerta ante error brindan información clara del problema y una vía de solución? (p. ej. 404 con alternativas; probar URL falsa) | Ambos |
| 2 | ¿Los mensajes de error no interfieren con la navegación? (p. ej. cerrar con Esc; «No aplica» si no hay mensajes) | Ambos |

*Solape editorial:* redacción de mensajes de error puede reforzar criterios **B/C/F3** en la auditoría LC, sin puntuar Usabilidad.

### Ventanas modales o emergentes — IEW `2.1.4` / IESD `1.1.4`

| # | Pregunta de chequeo | Instrumento |
| --- | --- | --- |
| 1 | ¿Se puede navegar sin interrupciones de modales/pop-up que tapen el contenido? | Ambos |
| 2 | Tras cerrar el modal/pop-up, ¿queda guardada esa decisión y no reaparece al navegar? («No aplica» si no hay modales) | Ambos |

### Mensajes de error — IEW `2.1.5` / IESD `1.1.5`

| # | Pregunta de chequeo | Instrumento |
| --- | --- | --- |
| 1 | Ante un mensaje de error, ¿se ofrecen soluciones claras y efectivas? («No aplica» si no hay mensajes) | Ambos |
| 2 | Ante error técnico inesperado, ¿hay información clara en vez de «Intente más tarde» / «Comuníquese con el administrador»? («No aplica» si no hay mensajes) | Ambos |

## B.2 Esperables

### Similitud del sistema con el mundo real — IEW `2.2.1` / IESD `1.2.1`

| # | Pregunta de chequeo | Instrumento |
| --- | --- | --- |
| 1 | ¿La información está en orden lógico y con zonas bien delimitadas? (encabezado, menú, contenido, pie) | Ambos |

### Control y libertad para la persona usuaria — IEW `2.2.2` / IESD `1.2.2`

| # | Pregunta de chequeo | Instrumento |
| --- | --- | --- |
| 1 | ¿Las páginas permiten avanzar o retroceder sin quedar atrapadas, con opciones claras para continuar o finalizar? | Ambos |
| 2 | Si al ingresar aparece un mensaje a pantalla completa (modal/pop-up), ¿tiene cierre fácilmente identificable («Cerrar» / «X»)? («No aplica» si no hay) | Ambos |
| 3 | ¿Los videos cuentan con todos sus botones de reproducción? («No aplica» si no hay videos) | **Solo IEW** |

## B.3 Deseables

### Reducción del esfuerzo cognitivo — IEW `2.3.1` / IESD `1.3.1`

| # | Pregunta de chequeo | Instrumento |
| --- | --- | --- |
| 1 | ¿Es visible el favicon del sitio en la pestaña del navegador? | Ambos |
| 2 | ¿Se ofrece ayuda en contexto (definición de acrónimos, «?») en lugar de un tutorial largo? («No aplica» según naturaleza del contenido / interfaz autoexplicativa — ver redacción de cada instrumento) | Ambos |

### Flexibilidad y eficiencia de uso — IEW `2.3.2` / IESD `1.3.2`

| # | Pregunta de chequeo | Instrumento |
| --- | --- | --- |
| 1 | ¿Hay opciones para ordenar y filtrar resultados y tablas? («No aplica» si no hay resultados/tablas) | Ambos |
| 2 | Si la persona está autenticada, ¿puede destacar o anclar las interacciones más frecuentes? («No aplica» si no requiere autenticación) | **Solo IESD** |

---

# C. Seguridad

- **IEW:** dimensión **8**  
- **IESD:** dimensión **7**  
- **Motor §17 2026:** **fuera** del orquestador editorial (SSL, cabeceras, directorios). Excepción de **contenido:** enlace a política de privacidad → **G2**.

## C.1 Imprescindibles

### Certificado SSL válido y vigente — IEW `8.1.1` / IESD `7.1.1`

| # | Pregunta de chequeo | Instrumento |
| --- | --- | --- |
| 1 | ¿El sitio usa HTTPS en la URL? | Ambos |
| 2 | ¿El certificado SSL/TLS es válido? («La conexión es segura» en Chrome; guía VII) | Ambos |

### Redirección HTTP → HTTPS — IEW `8.1.2` / IESD `7.1.2`

| # | Pregunta de chequeo | Instrumento |
| --- | --- | --- |
| 1 | ¿Al acceder por HTTP se redirige a HTTPS? | Ambos |

### Bloqueo de enmascarado — IEW `8.1.3` / IESD `7.1.3`

| # | Pregunta de chequeo | Instrumento |
| --- | --- | --- |
| 1 | ¿La cabecera `X-Frame-Options` es `DENY` o `SAMEORIGIN`? (verificar en securityheaders.com) | Ambos |

### Directorios desactivados — IEW `8.1.4`

| # | Pregunta de chequeo | Instrumento |
| --- | --- | --- |
| 1 | ¿El servidor no lista el contenido de directorios? (probar URL de carpeta de imagen sin el archivo) | **Solo IEW** |

*IESD §7 no incluye este indicador en el bloque de Seguridad leído del PDF.*

## C.2 Esperables

### Política de privacidad — IEW `8.2.1` / IESD `7.2.1` → refuerzo **G2**

| # | Pregunta de chequeo | Instrumento | Motor |
| --- | --- | --- | --- |
| 1 | ¿Hay un enlace a la política de privacidad? | Ambos | **G2** |
| 2 | ¿Ese enlace está en el pie de cada página? («No aplica» si no hay enlace) | Ambos | **G2** |

## C.3 Deseables

### Prevención de ataques MIME — IEW `8.3.1` / IESD `7.3.1`

| # | Pregunta de chequeo | Instrumento |
| --- | --- | --- |
| 1 | ¿`X-Content-Type-Options: nosniff`? (securityheaders.com) | Ambos |

### Límite de referencias Referrer-Policy — IEW `8.3.2` / IESD `7.3.2`

| # | Pregunta de chequeo | Instrumento |
| --- | --- | --- |
| 1 | ¿`Referrer-Policy` con valor `strict-origin`? (securityheaders.com) | Ambos |

### Aviso de uso de cookies — IEW `8.3.3` / IESD `7.3.3`

| # | Pregunta de chequeo | Instrumento |
| --- | --- | --- |
| 1 | ¿Hay información clara sobre cookies (tipos, finalidades, control)? | Ambos |

---

# Resumen de diferencias IEW ↔ IESD (estas tres dimensiones)

| Tema | Solo IEW (sitios) | Solo IESD (trámites) |
| --- | --- | --- |
| LC | `1.1.5` conectores; `1.1.6` anti-redifusión; `1.1.7` RUN/teléfonos; `1.1.8` sensibles; `1.2.4` enlaces relacionados; `1.3.1` apoyos visuales; `1.3.2` 80% hechos | `5.2.4` rótulos de enlace descriptivos; matices de concisión en flujo de trámite |
| Usabilidad | `2.2.2` botones de video | `1.3.2` anclar interacciones si autenticado |
| Seguridad | `8.1.4` directorios desactivados | — |

Numeración dual habitual en Word PTD Equipo UX: **IEW `1.x` ↔ IESD `5.x`** (LC), **IEW `2.x` ↔ IESD `1.x`** (Usabilidad), **IEW `8.x` ↔ IESD `7.x`** (Seguridad).

---

# Relación con el motor v2.1 y la entrega

| Capa | Rol |
| --- | --- |
| Este mapa (preguntas IEW/IESD) | Qué pregunta el instrumento oficial |
| `checklist-criteria.json` + skill | Qué responde Claude Code fila a fila (47) |
| CLAUDE.md §22 | Cómo redactar `comentario` / `ubicacion_pantalla` / `propuesto` / `motivo` para CMS |

Regla operativa de entrega: §22.8–§22.12 (ninguna casilla vacía; realismo A7/B3; plantillas E3/F4).

**Checklist Editorial v2.1** (`documentos/…`, gitignored) = pauta operativa del motor.  
**Word PTD v2.0 Equipo UX** = vista de hitos/compromisos MEI.  
**Este archivo** = puente pregunta-a-pregunta hacia ambos.

---

# Próximos pasos

1. Reauditorías META MEI con §22 + **§23** (51 criterios `LC-*`, `version_checklist: "3.0"`); muestra oro: `.claude/prompts/audit-oro-s22.md`.
2. Generar Excel MEI coherente de las 10 URLs tras esas auditorías LC.
3. **Después:** incorporar Usabilidad y Seguridad (mismas fuentes Word/JSON) para cierre de año — skills/catálogo separados, sin contaminar el % LC hasta decisión explícita.
4. Doc requisitos TI entendible (flujo MVP) — pendiente de producto.
