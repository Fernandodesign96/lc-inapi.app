# Prompt 6 — Calibración persistente (hallazgos de revisiones manuales)

## Qué es

Registro **vivo** de hallazgos, correcciones y acuerdos de calibración que Claude Code **debe leer en cada auditoría** (Prompt 5, Paso C) y aplicar a **todas** las URLs.

## Para qué

Que los ajustes acordados con Equipo UX / jefatura (revisión manual de resultados) no se pierdan entre sesiones: el maestro se vuelve más preciso con el tiempo.

## Objetivo

Persistencia inteligente: misma regla en Portada, Marcas, SIAC, etc., sin redescubrir el error cada vez — **sin** usar auditorías antiguas como atajo que omita el análisis completo.

## Cableado

| Pieza | Relación |
| --- | --- |
| `05-audit-maestro-url.md` | Lectura obligatoria en Paso C |
| `07-analisis-texto-ascendente.md` | Método palabra→párrafo (Paso D0 / §17.1bis) |
| `../skills/05-calibracion-persistente.md` | Cómo aplicar y actualizar este archivo |
| `../skills/06-analisis-texto-ascendente.md` | Cómo lanzar el subagente de texto |
| `../CLAUDE.md` | §2 calibraciones UX, §17.1bis, §20–§22 |
| `02-criterios-hitos-correcciones.md` | Juicio por criterio |
| DEVLOG / PRs | Origen humano de cada entrada |

## Regla de mantenimiento

1. Tras cada revisión manual de UI/PDF/Excel, **añadir o actualizar** una entrada aquí (fecha, criterio, regla, ejemplo).  
2. No borrar historia: marcar entradas obsoletas como `estado: supersedido` y apuntar a la nueva.  
3. Skill `05` resume el procedimiento; **este archivo** guarda los hechos.

---

## Entradas vigentes (actualizar en cada hallazgo)

### C-2026-08-22 — Aplicabilidad IEW/IESD en URLs `tramites`

- **Origen:** primera URL `tipo_pagina: "tramites"` migrada a v3.0 en esta serie (Formulario Contacto SIAC, META MEI orden 10).
- **Regla:** el campo `applicability` de cada criterio en `data/checklist-criteria-lc-ptd.json` es normativo, no orientativo:
  - `applicability: "sitioweb"` (10 exclusivas IEW: LC-1.1.5-03, LC-1.1.6-02, LC-1.1.7-01, LC-1.1.7-02, LC-1.1.8-01/02/03, LC-1.2.4-06, LC-1.3.1-01, LC-1.3.2-02) → **`no_aplica`** en toda URL `tipo_pagina: "tramites"`, con `comentario`: «Este criterio es exclusivo del instrumento IEW (sitioweb) según el catálogo v3.0; esta URL es tramites (instrumento IESD), por lo que no corresponde evaluarlo aquí.» No es un `no_aplica` para evadir un incumplimiento (§16): es exclusión estructural del catálogo, documentada y simétrica en ambos sentidos.
  - `applicability: "tramites"` (exclusiva restante IESD: `LC-5.2.2-01` concisión inicio+trámite) → evaluar en `tramites`; en `sitioweb` → `no_aplica` con **justificación ciudadana** (sin escribir la palabra `applicability` ni siglas sueltas). **`LC-5.2.1-01` ya no es exclusiva:** ver C-2026-08-25h (aplica en hubs de trámite / sitioweb con servicio digital).
  - `applicability: "ambos"` → evaluar igual en los dos tipos de página. **Incluye `LC-5.2.4-01`** (rótulos/CTA) y **`LC-5.2.1-01`** (claridad servicio digital) — ver C-2026-08-25c / C-2026-08-25h.
- **Cómo aplicar:** al iniciar el Paso D en una URL `tramites`, filtrar primero los 10 exclusivos IEW a `no_aplica` y activar los 2 exclusivos IESD restantes como evaluables antes de lanzar los 15 subagentes.

### C-2026-08-25e — Datos clave (`LC-1.1.2-03`, criterio 12) ≠ autonomía de trámites (`LC-1.1.2-04`, criterio 13)

- **Origen:** revisión Acerca de INAPI — el criterio 12 (`¿El texto destaca los datos clave…?`) se marcó `no_aplica` con el argumento de que la página «no es un trámite»; ese argumento corresponde al criterio 13, no al 12. Mismo error en Portada.
- **Regla:**
  1. **Criterio 12 / `LC-1.1.2-03` (datos clave: qué, cómo, dónde, cuándo, para quién o recuadro equivalente):** aplica a páginas **informativas e institucionales** con cuerpo propio (Acerca de, hubs Marcas/Patentes, Portada, buscadores con contenido editorial, etc.). Si falta el resumen/recuadro → `incumple` + fila en `sustituciones[]` (texto, ubicación, propuesto, justificación). **Prohibido** `no_aplica` solo porque «no es un trámite» o «no es un servicio digital».
  2. **Criterio 13 / `LC-1.1.2-04` (autonomía para realizar trámites):** sí pregunta por textos referidos a **trámites**. En sitioweb institucional sin pasos de trámite → `no_aplica` justificado es correcto.
  3. Realismo §22.9 se mantiene: no exigir el recuadro en **ítems cortos de menú/navegación** solos; sí exigirlo cuando hay párrafos, tarjetas informativas, hub de sección o pantallas de resultados.
  4. **Severidad (C-2026-08-25g):** si en entrega el Texto en pantalla es ausencia total («No hay texto que cumpla con este requisito» / `(no existe en pantalla)`) → **`severidad: alta` (No cumple)**. No usar `media` / Medianamente cumple cuando no hay ningún texto que cumpla.
- **Ejemplo malo:** `no_aplica` en Acerca de INAPI: «no es un trámite ni un servicio con pasos operativos».
- **Ejemplo bueno:** `incumple` + `alta` + propuesta de recuadro «Qué es / Cómo / Dónde / Cuándo / Para quién» (o, en buscador: conteo de resultados + campo visible); criterio 13 sigue en `no_aplica` en URLs sin trámite.
- **Aplica a:** todas (sitioweb y trámites).
- **estado:** vigente

### C-2026-08-25k — Citas negadas ≠ texto en pantalla; sin meta entre paréntesis como literales

- **Origen:** revisión Noticia Cuenta Pública (URL 8): criterio 11 (`LC-1.1.2-02`) en Cumple con Texto `en construcción` porque la justificación decía «no hay señales … ni de «en construcción»» y el extractor de comillas volcó esa cita negada; criterio 38 (`LC-1.2.4-03`) con Texto `(once párrafos de texto corrido…)` — meta descriptiva entre paréntesis, no literal de pantalla.
- **Regla:**
  1. **Citas entre comillas negadas** (p. ej. «no hay… «en construcción»», «ni de «próximamente»», «No se observan textos de tipo «…»») **no** son Texto en pantalla. Si el criterio **cumple**, citar evidencia positiva real (título, bajada, bloque visible) o `—` si no hay literal útil; **nunca** el defecto que se niega.
  2. **Texto / original** no pueden ser meta-descripciones entre paréntesis del tipo `(once párrafos…)`, `(estructura actual…)`, `(sin negrita…)`. Citar literales del cuerpo o de la zona evaluada. Única excepción parentética: campo cuyo **único** contenido es una frase de ausencia total sin literal citable (`(ausencia)`, `(sin fecha de actualización visible)`, `(no existe en pantalla)`).
  3. En **propuesto / justificación**, preferir prosa o rayas em dash antes que «(por ejemplo …)» cuando se listan ejemplos (coherente con 25j).
  4. No duplicar el mismo párrafo en justificación (motivo ≈ comentario → uno solo).
- **Ejemplo malo:** Cumple · Texto `en construcción` · Justificación «…no hay señales de «en construcción»».
- **Ejemplo bueno:** Cumple · Texto = título de la noticia · Justificación que niega «en construcción» sin volcarla al Texto.
- **Aplica a:** todas.
- **estado:** vigente

### C-2026-08-25j — Negritas ausentes = No cumple; sin explicaciones entre paréntesis en entrega

- **Origen:** revisión Sala de Prensa — Noticias (URL 7), criterio 39 (`LC-1.2.4-04`): se entregó como «Cumple con observaciones» (`severidad: baja`) con Texto `(sin negrita en los tres extractos)` pese a que existen los tres textos de las tarjetas y ninguno cumple el requisito de negrita.
- **Regla:**
  1. Si hay párrafos/textos evaluables **y ninguno** usa negrita para destacar palabras clave → `incumple` + **`severidad: alta` (No cumple)**. No usar `baja` / Cumple con observaciones cuando la ausencia de negrita es total en los textos citados.
  2. **Texto en pantalla** = los literales reales de esos párrafos o columnas de texto (p. ej. los tres textos bajo la fecha en las tarjetas de noticia), unidos con ` · ` si hay varios. **Prohibido** sustituirlos por meta `(sin negrita en los tres extractos)`.
  3. **Ubicación:** nombrar la zona humana con precisión (p. ej. `Cuerpo › las tres tarjetas de noticia › columna de texto bajo la fecha`), no solo «extractos» sin contexto.
  4. **Paréntesis en entrega (texto / ubicación / propuesto / justificación):** **prohibido** meter explicaciones o meta-comentarios entre paréntesis junto a otro texto (`… (sin negrita)`, `… (por ejemplo: …)`, `… (usar la fecha real…)`). **Única excepción:** cuando el **único** contenido del campo es una sola frase entre paréntesis que marca ausencia total sin literal citable (p. ej. `(sin fecha de actualización visible)` / `(no existe en pantalla)`). Si hay texto visible que citar, se cita el literal y la ausencia de negrita va en la justificación en prosa, no entre paréntesis.
- **Ejemplo malo:** `Texto: (sin negrita en los tres extractos)` · presentación Cumple con observaciones.
- **Ejemplo bueno:** `Texto: «Constanza Vargas García, bioquímica…» · «La herramienta… 148 productos…» · «La medida beneficia… Japón…»` · `severidad: alta` · Ubicación: columna de texto de las tres tarjetas.
- **Aplica a:** todas.
- **estado:** vigente

### C-2026-08-25i — Consistencia de calibración: aplicar + commit sin preguntar

- **Origen:** tras URLs 6 y 7, Claude Code dejó JSON de URLs ya cerradas y capa de entrega en `modified` sin commit y abrió menús «¿commitear / revertir / dejar?».
- **Regla:** ver **CLAUDE.md §5.1** y Prompt 5 Paso F. Calibración vigente = autorización para consistencia en la muestra; commit de consistencia + commit de entrega + commit de la URL nueva en el mismo turno; working tree limpio al cerrar.
- **Aplica a:** todas las sesiones de auditoría 1-URL.
- **estado:** vigente

### C-2026-08-25h — Entrega sin jerga de orquestación; claridad servicio digital (criterio 15) en lenguaje ciudadano

- **Origen:** revisión Solicitud Nueva (URL 6) — justificación del criterio 15 con `applicability`, «variante IESD», texto «tramites» inventado; ubicación con instrucción «(indicar Cabecera…)»; y riesgo de reaparecer `T010`/`T020` en justificación. Fecha ausente otra vez vista como «Medianamente cumple».
- **Regla (campos CMS: texto / ubicación / corrección / justificación):**
  1. **Prohibido** en entrega: `Tnnn`, `applicability`, `tipo_pagina` técnico, `mapa D0`, Prompt N, `C-YYYY`, `LC-*`, y acrónimos sueltos **IEW / IESD / META MEI**. Si hace falta nombrar un instrumento o muestra: **nombre completo primero** y la sigla entre paréntesis (ej. «Instrumento de Evaluación de Servicios Digitales (IESD)»). Preferir no usar la sigla si el texto ciudadano basta.
  2. **Ubicación:** ruta real `Zona › elemento › «rótulo»`. **Prohibido** pegar instrucciones al auditor («indicar Cabecera…», «describir en auditorías nuevas…»).
  3. **Criterio 15 (`LC-5.2.1-01`)** — claridad del servicio digital / preguntas frecuentes: `applicability: "ambos"`. En páginas que hablan de trámites o enlazan a `tramites.inapi.cl`, **evaluar** el contenido (no marcar `no_aplica` solo por «es sitioweb»). Si **no hay** preguntas frecuentes ni respuestas (listas, tablas, desplegables, etc.) — alineado al criterio 14 — → `no_aplica` con justificación ciudadana, p. ej.: «No se encontraron elementos visuales o texto que haga referencia a preguntas frecuentes… En consecuencia con el criterio anterior…».
  4. Si el criterio **sí** pregunta por contenido de trámite presente en la URL → completar texto, ubicación, corrección (si incumple) y justificación con literales visibles.
  5. **Fecha / ausencia total** (refuerzo 25f/25g): Texto «No hay texto que cumpla…» → **`severidad: alta` (No cumple)**, nunca «Medianamente cumple».
- **Ejemplo malo:** `Justificación: El campo applicability es «tramites» (IESD)…` · `Ubicación: … (indicar Cabecera…)` · `…(T020)`.
- **Ejemplo bueno:** `Justificación: No se encontraron elementos visuales o texto que haga referencia a preguntas frecuentes…` · `Ubicación: Cuerpo › junto a las tarjetas de acción`.
- **Aplica a:** todas.
- **estado:** vigente

### C-2026-08-25g — Ausencia total de texto que cumpla → No cumple (`severidad: alta`) en datos clave (y análogo)

- **Origen:** revisión Buscador de noticias — criterio 12 con Texto «No hay texto que cumpla con este requisito» pero presentación «Medianamente cumple» (`severidad: media`). Mismo patrón en Portada / Marcas / Acerca de.
- **Regla:** cuando el defecto es que **no existe** el texto/control requerido (entrega = ausencia / «No hay texto que cumpla…»), la severidad es **`alta` → No cumple**. «Medianamente cumple» (`media`) queda para incumplimientos **parciales** (hay texto, pero incompleto o deficiente). Alineado a C-2026-08-25f (fecha).
- **Aplica a:** todas; en especial `LC-1.1.2-03` y cualquier criterio con ausencia total documentada en Texto en pantalla.
- **estado:** vigente

### C-2026-08-25f — Fecha de actualización ausente (`LC-1.1.4-01`, criterio 27) = No cumple (`severidad: alta`)

- **Origen:** revisión Acerca de INAPI — sin fecha visible se entregó como «Medianamente cumple» (`incumple` + `severidad: media`) pese a que no existe ningún texto que cumpla el requisito.
- **Regla:**
  1. Si **no hay** fecha de publicación ni de última actualización visible → `incumple` + **`severidad: alta`** (UI/PDF/Excel: **No cumple**). **Prohibido** `media` / «Medianamente cumple» cuando la ausencia es total.
  2. `©año` del pie **nunca** cuenta como fecha de actualización (regla ya vigente).
  3. Entrega obligatoria: Texto = `(sin fecha de actualización visible)` / mensaje de ausencia; Ubicación = dónde debe ir la línea; Propuesto = «Añadir texto visible: Actualizado: DD de mes de AAAA…»; Justificación = ausencia total + que el copyright no reemplaza.
  4. `severidad: media` (Medianamente cumple) solo si hay fecha visible pero **parcialmente** insuficiente (p. ej. año solo, fecha ambigua, o vigente en un bloque y ausente en el contenido principal evaluado) — no cuando no hay nada.
- **Ejemplo malo:** `incumple` + `media` + «(sin fecha de actualización visible)».
- **Ejemplo bueno:** `incumple` + `alta` + misma evidencia y propuesta CMS.
- **Aplica a:** todas.
- **estado:** vigente

### C-2026-08-25d — Texto en pantalla ≠ pregunta del criterio (ni encabezado Instrumento)

- **Origen:** revisión Acerca de INAPI / criterios 2 y 3 (y patrón en las 5 URLs META MEI) — en «Texto en pantalla», «Ubicación», «Corrección» y «Justificación» aparecía la pregunta del instrumento (`¿Los signos de puntuación…?`, `¿Las frases se relacionan…?`) porque el `comentario` empezaba con el encabezado de fila `Criterio N: «pregunta» — Instrumento M: Nombre.` y la capa de entrega extraía esa cita como si fuera literal de la página.
- **Regla:**
  1. El encabezado `Criterio N: «pregunta» — Instrumento M: Nombre` **solo** en el título de la fila (UI/PDF). **Prohibido** copiarlo dentro de `comentario`, `motivo`, `cita_textual`, `original`, `propuesto` o `ubicacion_pantalla`.
  2. **Texto en pantalla** = solo literales **visibles en la página** (o `(ausencia)` / mensaje de ausencia). **Nunca** la pregunta del criterio ni el nombre del instrumento.
  3. **Ubicación / corrección / justificación** tampoco deben repetir esa pregunta como si fuera rótulo en pantalla.
  4. Si `cumple`/`no_aplica` y no hay cita real de la página → Texto = `—` (o ausencia legible) y justificación = análisis sin el encabezado de fila.
  5. Capa de entrega (`criterio-entrega-campos.ts`): filtra preguntas del catálogo y hace strip del encabezado Criterio/Instrumento (defensa en profundidad).
- **Ejemplo malo:** `Texto en pantalla: ¿Los signos de puntuación empleados facilitan la lectura del documento? · Para Informarse`
- **Ejemplo bueno:** `Texto en pantalla: Para Informarse` · Justificación: «Las tarjetas de «Para Informarse» usan puntuación simple…» (sin «Criterio 14: … — Instrumento 5»).
- **Aplica a:** todas (UI · PDF · Excel). No exige reauditoría completa de las 5 URLs: basta regenerar entrega con el código corregido; reauditoría puntual solo si se quiere enriquecer citas reales donde quedó `—`.
- **estado:** vigente

### C-2026-08-25c — Rótulos / enlaces / CTA descriptivos (`LC-5.2.4-01`) aplican a TODAS las URLs

- **Origen:** revisión Patentes (META MEI orden 3) y patrón repetido en Portada/Marcas/Acerca de/Buscador — se marcó `no_aplica` con «esta URL es informativa, no un servicio digital».
- **Regla:** el criterio 42 (`LC-5.2.4-01`) pregunta si los **textos de enlaces, botones y llamados a la acción** describen el destino o la acción (evitar «Haga clic aquí», «Más», «LINK EXTERNO», etc.). Eso **aplica en sitioweb y en trámites**: menú, tarjetas, atajos, ventanas emergentes, pies de página, resultados de búsqueda, CTAs de trámite. **Prohibido** `no_aplica` solo porque la página sea «informativa» o «no sea un flujo de trámite».
  - Catálogo: `applicability: "ambos"` (ya no `tramites`).
  - Evaluar: `cumple` / `incumple` (+ sustituciones) según evidencia visible; `no_aplica` solo si **no hay ningún enlace ni botón** evaluable en la vista (caso extremo).
  - Propuesta CMS: rótulo que diga qué hace o a dónde lleva (ej. «Consultar fecha de pago», «Solicitar certificado», «Ver requisitos de patente»).
- **Ejemplo malo:** `Justificación: Esta URL es informativa… la variante de rótulos para servicios digitales no corresponde.`
- **Ejemplo bueno:** citar el rótulo ambiguo («Más», «Anotación», «LINK EXTERNO») + ubicación + propuesta descriptiva.
- **Aplica a:** todas.
- **estado:** vigente

### C-2026-08-21 — Reauditoría completa: precedentes ≠ atajo

- **Origen:** revisión manual Portada (META MEI orden 1) tras orquestación §17 / prompts 01–07.
- **Regla:** JSON previos, `history[]`, Colección B / RAG de precedentes y calibraciones son **solo contexto de apoyo** (tono, patrones, umbrales). **Prohibido** copiar estados `cumple`/`incumple`/`no_aplica` de una auditoría anterior sin re-evaluar la captura **actual**. Cada reauditoría exige: Playwright (HTML + DOM visible) de nuevo → inventario R+U completo → **Paso D0 (texto ascendente §17.1bis)** → 15 subagentes → 5 sub-subagentes. No «acelerar» omitiendo bloques (modal, hero, secciones, footer) porque «ya se evaluaron antes».
- **Efecto esperado:** el % puede **bajar** si se recuperan incumplimientos antes omitidos; eso es correcto.
- **Aplica a:** todas las URLs (reauditorías y nuevas).
- **estado:** vigente

### C-2026-08-22 — Análisis textual ascendente obligatorio (palabra → párrafo)

- **Origen:** omisiones recurrentes en Marcas/Portada (Observancia, cobertura, tasas/derechos, etapas del registro) pese a calibraciones puntuales.
- **Regla:** en cada URL, **antes** de los 15 subagentes, ejecutar Prompt **7** + skill **06** (§17.1bis): analizar de menor a mayor granularidad; proponer reemplazo **o** definición/descripción; no «pulir» jerga sin explicar; si un párrafo lista etapas, describir qué ocurre en cada una. El mapa D0 alimenta a los 15 indicadores.
- **Aplica a:** todas.
- **estado:** vigente

### C-2026-08-22 — Entrega multi-corrección: N textos que incumplen el mismo LC-* → N filas

- **Origen:** Patentes (`/patentes`) — el mismo criterio (p. ej. `LC-1.1.3-03` jerga, `LC-1.2.4-05` mayúsculas, `LC-1.2.4-07` documentos) fallaba en varios textos distintos de la misma página (varios términos técnicos, varios títulos en mayúscula sostenida, varios PDF sin formato/peso).
- **Regla:** cuando un mismo `criterio_id` incumple en **varios textos/nodos distintos** de la URL, crear **una fila de `sustituciones[]` por texto** (no fusionar varios defectos en una sola fila «para ahorrar»). Solo se agrupa (`agrupado_en`) cuando la fila **comparte exactamente el mismo nodo y la misma corrección** con otro criterio (§20.3); si el criterio tiene evidencia independiente en otro nodo, permanece **primario** aunque una de sus instancias también aparezca agrupada. UI/PDF/Excel deben poder mostrar todas las filas de un mismo `criterio_id`.
- **Ejemplo bueno:** `LC-1.2.4-05` con 5 filas de sustitución (modal de búsqueda, botón de panel, 3 encabezados de sección) en vez de una sola fila que diga «varias mayúsculas en la página».
- **Ejemplo malo:** resumir 3 documentos sin formato/peso en una sola fila de `sustituciones[]` cuando cada uno tiene una ubicación en pantalla distinta.
- **Aplica a:** todas.
- **estado:** vigente

### C-2026-08-21 — Rigor UX: no degradar a `no_aplica` / cumple débil por «detalle»

- **Origen:** mismos hallazgos Portada (modal Contacto, hero, Observancia).
- **Regla:** textos, títulos, subtítulos e iconografía **visibles** que afectan comprensión ciudadana son evaluables. **Prohibido** marcar `no_aplica` o `cumple` genérico solo porque el hallazgo «ya salió en un JSON viejo» o porque parece menor. Si el criterio pregunta por lenguaje plano, redacción, claridad, concisión, escritura web, completitud o legibilidad y el texto/ícono está a la vista → aplicar el criterio y, si incumple, **sustitución** con propuesta CMS (§22).
- **Aplica a:** todas.
- **estado:** vigente

### C-2026-08-21 — Portada: modal «¿Quieres contactarnos?»

- **Origen:** revisión Portada `https://www.inapi.cl/`.
- **Regla:** el modal de Contacto (título «¿Quieres contactarnos?», canal preferido, teléfono `(56 2) 2 887 0400`, horarios L–J 09:00–18:00 / V 09:00–17:00, `inapi@inapi.cl`, «Tu consulta será atendida por un especialista.», dirección Av. Libertador Bernardo O'Higgins 194, Santiago, horario presencial 09:00–14:00, **iconos** de guía) es contenido **VISIBLE** obligatorio en el inventario R+U y en los subagentes aplicables (p. ej. completitud, lenguaje plano, claridad, escritura web, datos clave, tono). Abrir/capturar el modal en Playwright si hace falta para ver el DOM. Evaluar íconos como apoyos/etiquetas si el criterio lo pide (`LC-1.3.1-01` solo si aplica visualización de datos; no forzar incumple por `alt` vacío — ver entrada Visualización).
- **Ejemplo malo:** omitir el modal porque no está en el JSON previo o porque el scrape inicial no lo abrió.
- **Aplica a:** Portada y cualquier URL sitioweb con el mismo modal de layout.
- **estado:** vigente

### C-2026-08-21 — Portada: hero «Te queremos ayudar…»

- **Origen:** revisión Portada.
- **Regla:** el título visible **«Te queremos ayudar a utilizar la propiedad industrial»** (y equivalentes del hero) se evalúa con rigor de **lenguaje plano / redacción / claridad / escritura web** (`LC-1.1.3-*`, `LC-1.1.5-*`, `LC-1.2.1-*`, `LC-1.2.4-*` según encaje). Si suena genérico, técnico o poco accionable para ciudadano → `incumple` + propuesta cercana (qué puede hacer la persona en INAPI), no `cumple` por inercia.
- **Aplica a:** Portada; misma lógica en héroes de otras páginas sitioweb.
- **estado:** vigente

### C-2026-08-21 — Portada: bloque Observancia (título + subtítulo)

- **Origen:** revisión Portada (refuerza calibración de jerga en título).
- **Regla:**
  1. Título **«Observancia»** (o solo jerga legal como rótulo) → incumplir lenguaje plano / escritura web (`LC-1.1.3-03`, `LC-1.2.4-02` u homologables): proponer título cotidiano o término + glosa en el mismo bloque.
  2. Subtítulo **«Conoce y utiliza las herramientas de protección de la Propiedad Intelectual en Chile»** → evaluar claridad/cercanía; si «Propiedad Intelectual» / formulación densa no ayuda al público general → `incumple` + propuesta más llana (qué protege, para quién).
- **Aplica a:** Portada y bloques homólogos en sitioweb.
- **estado:** vigente

### C-2026-08-21 — Términos técnicos/jurídicos: no basta «pulir» la frase (`LC-1.1.3-*`, claridad, completitud)

- **Origen:** revisión Marcas (`/marcas`) — tasas/derechos y etapas del procedimiento.
- **Regla:** si el texto usa conceptos INAPI/jurídicos (**tasas**, **derechos**, **examen de forma**, **examen de fondo**, **extracto**, **Diario Oficial**, etc.), **no** alcanza con reordenar o acortar la oración dejando la misma jerga. La propuesta CMS debe:
  1. Preferir **reemplazo** por lenguaje cotidiano cuando el término no sea indispensable; **o**
  2. Si el concepto debe conservarse: **definir o describir en breve** qué es y para qué sirve (1–2 frases claras), en el mismo bloque o como glosa visible.
- **Ejemplo malo:** «pagos de tasas o derechos…» → «pagos de tasas…» (sigue sin explicar qué es una tasa).
- **Ejemplo bueno:** explicar qué pagos existen, cuándo se pagan y qué cubren (p. ej. presentación, publicación, registro), en lenguaje ciudadano.
- **Aplica a:** todas (esp. páginas de trámites/información de marcas y patentes).
- **estado:** vigente

### C-2026-08-21 — Marcas: «Tasas nacionales» y etapas del procedimiento (completitud + lenguaje plano)

- **Origen:** revisión Marcas — bloque de pagos y «tres etapas» del registro.
- **Regla:**
  1. Si se habla de **pagos/tasas**, el contenido debe hacer **visibles todos los pagos relevantes del ciclo** de solicitud de marca (incl. p. ej. publicación en el Diario Oficial), no solo «inicio» y «final», si en la misma página o flujo existen otros cobros. Si faltan → `incumple` completitud / datos clave + propuesta que liste y explique cada pago.
  2. Cada etapa del procedimiento (**ingreso y examen de forma**, **publicación del extracto en el Diario Oficial**, **examen de fondo**) debe llevar **descripción breve** entendible a quien lee por primera vez (qué ocurre, qué entrega el ciudadano, qué revisa INAPI). No dejar solo el rótulo técnico, aunque la lista numerada esté «bien redactada».
- **Aplica a:** `/marcas` y páginas homólogas de procedimiento/tasas.
- **estado:** vigente

### C-2026-08-21 — Títulos de sección que no anticipan el contenido

- **Origen:** revisión Marcas — «Para Informarse», «Buscadores».
- **Regla:** el título visible debe **anticipar el contenido** que sigue. Si es genérico o corto:
  - «Para Informarse» → proponer título que diga *qué* se informa (guías, requisitos, tipos de marca, etc.).
  - «Buscadores» → proponer algo más específico (p. ej. «Herramientas de búsqueda» o equivalente que diga *qué* se busca).
  Criterios típicos: escritura web / claridad / pirámide o fidelidad título↔contenido según encaje.
- **Aplica a:** todas las sitioweb.
- **estado:** vigente

### C-2026-08-21 — Enlaces/rótulos ambiguos (ej. «Anotación»)

- **Origen:** revisión Marcas — «Anotación» / «Anotación (registrar cambios en una marca ya inscrita)».
- **Regla:** si el rótulo o la glosa entre paréntesis **no deja claro** la acción o el destino, `incumple`. La corrección debe ser **realista**: no inventar jerga; usar **conector o frase de acción** que especifique qué ocurre al hacer clic (quién, qué cambio, sobre qué marca). Evitar propuestas genéricas que solo reformulan la misma ambigüedad.
- **Aplica a:** todas.
- **estado:** vigente

### C-2026-08-21 — Bloques «tipos / cobertura» sin subtítulo ni descripciones (Marcas)

- **Origen:** revisión Marcas — bloque naranja «MARCAS SEGÚN SU TIPO» (atajos: marca comercial, colectiva, certificación, frase de propaganda; «Tipo de Marca» / «Tipo de Cobertura» con +).
- **Regla:**
  1. Título de bloque amplio (p. ej. «Marcas según su tipo») → proponer **subtítulo breve** que profundice el propósito del bloque.
  2. Atajos solo con nombre del tipo → cada uno debe tener **descripción corta** (qué es / para quién).
  3. «Tipo de Cobertura» (u homólogos) → el ciudadano no sabe qué es; proponer **descripción** de la subsección: qué es la cobertura, para qué sirve y por qué importa en una solicitud de marca.
- **Aplica a:** `/marcas` y bloques UI similares (tipos + expandibles sin texto).
- **estado:** vigente

### C-2026-08 — RUN institucional vs persona natural (`LC-1.1.7-01`)

- **Regla:** RUT de persona jurídica pública (ej. INAPI en footer) → `cumple`. RUN de persona natural en HTML público → `incumple`, severidad `alta`.
- **Aplica a:** todas las URLs sitioweb/tramites públicas.

### C-2026-08 — Fecha de actualización (`LC-1.1.4-01`)

- **Regla:** sin fecha visible → `(ausencia)` / `(sin fecha de actualización visible)` + propuesta de línea visible. **Nunca** usar `©año` del footer como “fecha de actualización”. **Severidad:** ausencia total → `alta` (No cumple); ver C-2026-08-25f.

### C-2026-08 — Visualización / apoyos (`LC-1.3.1-01`)

- **Regla:** solo pregunta si hay íconos/imágenes/gráficos para datos. Si ya hay banners/tarjetas/íconos → `cumple`. **No** incumplir por `alt` vacío (anotar en nota TIC si hace falta, sin bajar el % por ese id).

### C-2026-08 — Mayúsculas plantilla home (`LC-1.2.4-05`)

- **Regla:** ítems `ACCESOS` y `BUSCADOR` de cabecera global `www.inapi.cl` **excluidos**. Aplicar el criterio en el resto y en trámites.

### C-2026-08 — Título con jerga (`LC-1.1.3-03` + `LC-1.2.4-02`)

- **Regla:** un término legal solo como H1/título de tarjeta (ej. «Observancia») incumple aunque debajo haya subtítulo. Propuesta: título cotidiano o término + glosa en el mismo bloque. *(Complementada por C-2026-08-21 Portada Observancia.)*

### C-2026-08 — Evidencia solo VISIBLE

- **Regla:** no usar `<title>` / `<meta>` como prueba de título o contenido. Fidelidad título↔contenido sobre **H1 visible**.

### C-2026-08 — Sesión autenticada

- **Regla:** con `captura_con_sesion: true`, datos del solicitante en formularios **no** son incumplimiento de privacidad; evaluar etiquetas y claridad (§19).

---

### C-2026-08-24 — Ubicación en pantalla detallada + ausencia legible (PDF/Excel)

- **Origen:** revisión manual Portada (PDF/Excel): ubicaciones vagas («el enlace», «el bloque», «En la página (ubicación exacta no registrada…)») y «Texto en pantalla: (ausencia)».
- **Regla (entrega CMS):**
  1. **`ubicacion_pantalla` obligatoria y específica** siempre que haya texto (o ausencia de requisito). Formato: `Zona › elemento › «rótulo o literal»` (ej. `Pie de página › enlace «Política de privacidad»`; `Portada › zona superior destacada › título principal «…»`; `Pie de página › bloque «Dónde estamos»`). **Prohibido:** una sola palabra (`enlace`, `bloque`), frases cortas sin zona (`el enlace`, `El bloque de accesos`), o «en la página» sin ruta. En entrega: sin H1/hero/modal.
  2. En `comentario` / `motivo` nombrar **zona + tipo de control + rótulo** para que la capa de entrega (`ubicacion-pantalla-cms.ts`) no tenga que adivinar.
  3. **Texto en pantalla** si no hay literal que cumpla: en JSON puede seguir `(ausencia)`; en **UI/PDF/Excel** se muestra `No hay texto que cumpla con este requisito`.
  4. **PDF:** no incluir la sección «Nota para el equipo TI» (`nota_final_tic` puede existir en JSON/UI, pero no en el PDF de entrega editorial).
- **Ejemplo malo → bueno:**
  - Malo: `Ubicación: el enlace` / `Texto: (ausencia)`
  - Bueno: `Ubicación: Pie de página › enlace «Uso de los Contenidos de este Sitio»` / `Texto: No hay texto que cumpla con este requisito`
- **Aplica a:** todas (UI, PDF, Excel).
- **estado:** vigente

### C-2026-08-22 — Entrega: todas las correcciones por criterio (UI/PDF/Excel)

- **Origen:** revisión Excel Marcas — faltaban títulos («Para Informarse», «Buscadores»), cobertura, atajos de tipos; solo se veía la 1ª sustitución del `criterio_id`.
- **Regla:** un `LC-*` puede tener **N** filas en `sustituciones[]` (un texto localizable = una corrección), sin límite a «la primera». Entrega (`criterio-entrega-campos` + Excel/UI/PDF) muestra **todas**. No fusionar títulos/conceptos distintos en una sola propuesta. El % cuenta el criterio una vez; más incumplimientos reales en textos distintos → más filas de entrega (y el % puede bajar si aparecen más `incumple`).
- **Aplica a:** todas.
- **estado:** vigente

### C-2026-08-25 — Entrega CMS: solo literales; sin nomenclatura interna (salvo `LC-*`)

- **Origen:** revisión manual URL 2 Marcas (`/marcas`) — justificación con `T008`–`T011`, «mapa D0», «Prompt 6/7», `C-2026-08-21/22`; propuestas con meta-comentarios («formato de oración, consistente con…»).
- **Regla (campos visibles: texto en pantalla, ubicación, corrección propuesta, justificación/comentario):**
  1. **Prohibido** nomenclatura del repositorio u orquestación: `Tnnn`, `HTML-L…`, «mapa D0», «análisis textual ascendente», «Prompt N», `C-YYYY-…`, «capa R/U», «subagente», «§N», Chroma, etc. **Permitido solo** códigos de criterio `LC-*` (y, si hace falta, el nombre de la dimensión en lenguaje claro).
  2. Nombrar **siempre el literal** o la zona humana: ej. `Sección «Para Informarse», tarjeta «Cómo registrar una marca»`; `Sección «Trámites», títulos bajo cada tarjeta`; `ventana emergente «¿Quieres contactarnos?»`. Nunca «las tarjetas T008–T011».
  3. Si `cumple`: **Texto en pantalla** = cita(s) o descripción corta de lo que evidencia el sí (no dejar `—` con justificación que nombra nodos internos).
  4. **Corrección propuesta** = texto/instrucción pegable en el CMS. **Prohibido** añadir entre paréntesis meta-comentarios de estilo editorial («formato de oración», «consistente con Renovación…», «según Prompt…»). Eso va, si hace falta, en la justificación en lenguaje ciudadano.
  5. **Propuestas no repetidas:** si varios criterios tocan el mismo nodo (§20.3), **un solo** `propuesto` completo vive en el criterio **primario**. Los secundarios (`agrupado_en` o relacionados) **no** copian el mismo bloque: su justificación responde **su** pregunta (sí/no, cumple/no) y su `propuesto` (si aplica) da **enfoque, tipo de palabras, estructura o detalle** alineado a esa pregunta (p. ej. concisión → «frases cortas; una idea por paso»; lista → «usar lista numerada»; jerga → «definir cada término en la misma tarjeta»).
  6. Criterios de sí/no / existe / cumple: la pareja propuesta + justificación debe **robustecer la respuesta a la pregunta**, no reciclar el texto de otro criterio.
- **Ejemplo malo → bueno (ubicación/evidencia):**
  - Malo: `Justificación: Las tarjetas T008–T011… El mapa D0… (Prompt 6, C-2026-08-21).`
  - Bueno: `Ubicación: Sección «Para Informarse», tarjeta «Cómo registrar una marca». Texto: «El procedimiento para registrar…». Justificación: la tarjeta usa una sola oración larga con términos no explicados; por eso medianamente cumple concisión.`
- **Aplica a:** todas (esp. reauditoría Marcas y siguientes META MEI).
- **estado:** **superseded** por C-2026-08-25b (sin `LC-*` en entrega)

### C-2026-08-25b — Entrega sin ninguna nomenclatura; Instrumento N; criterios 1…51

- **Origen:** revisión Patentes — propuesta «Corregir incumplimiento de LC-1.1.3-01»; encabezados «(Dimensión: Lenguaje plano — Lenguaje plano 1.1.3 / 5.1.3)».
- **Regla (UI · PDF · Excel de entrega):**
  1. **Prohibido** en texto/ubicación/propuesto/justificación: `LC-*`, códigos IEW/IESD (`1.1.3`, `5.1.3`), `Tnnn`, mapa D0, Prompt N, `C-YYYY-…`, Layout/header como jerga, etc.
  2. Referencias cruzadas: «el criterio 4», «los criterios 6 y 24» (numeración simple 1…51), nunca `LC-1.1.3-01`.
  3. Encabezado de criterio: `Criterio N: «pregunta» — Instrumento M: Nombre` — ej. `— Instrumento 3: Lenguaje plano`, `— Instrumento 1: Fiabilidad`. **Sin** paréntesis ni «Dimensión: … 1.1.3 / 5.1.3».
  4. **Corrección propuesta** = texto o instrucción CMS accionable. **Prohibido** «Corregir incumplimiento de LC-…» / «Corregir incumplimiento de criterio N» sin decir *qué* escribir o *cómo* medir.
  5. Legibilidad (criterio de lenguaje orientado a comprensión lectora / Legible): si falta medición, el `propuesto` debe pedir reescritura en lenguaje cotidiano **y** comprobar con herramienta de lectura fácil; no bastar con nombrar el incumplimiento.
- **Ejemplo malo → bueno (propuesto):**
  - Malo: `Corregir incumplimiento de LC-1.1.3-01.`
  - Bueno: `Reescribir la tarjeta «Requisitos para obtener una patente» en oraciones cortas; comprobar con Legible hasta al menos tres de cinco indicadores en dificultad Normal.`
- **Aplica a:** todas.
- **estado:** vigente

### C-2026-08-25 — Marcas: sección «Trámites» — más que unificar mayúsculas

- **Origen:** revisión Marcas — títulos «Solicitud Nueva» / «Títulos y Certificados» (Title Case) frente a «Renovación» / «Anotación»; propuesta que solo unificaba a formato de oración.
- **Regla:** unificar mayúsculas **no basta** si rótulos como «Renovación» o «Anotación» siguen opacos. Preferir en la propuesta CMS:
  1. **Frase breve** bajo cada uno de los cuatro trámites (qué es / para quién / qué logra la persona); **y/o**
  2. Un **subtítulo** de la sección que diga qué son esos trámites en conjunto.
  La justificación debe nombrar la **brecha de claridad** (rótulos sin explicación), no solo la inconsistencia tipográfica. Evitar en `propuesto` el meta «(formato de oración, consistente con…)».
- **Aplica a:** `/marcas` y bloques homólogos de atajos de trámites.
- **estado:** vigente

### C-2026-08-25 — Documentos del mismo carrusel: una fila por documento, no una fila combinada

- **Origen:** revisión Marcas — el JSON del 2026-08-22 resumió los tres documentos del carrusel institucional del pie («Plan de Acción de Cumplimiento 2025», «Teletrabajo», «Código de Ética INAPI 2026») en una sola fila de `sustituciones[]`, pese a que la propia entrada C-2026-08-22 «Entrega multi-corrección» ya advertía que esto es el «ejemplo malo».
- **Regla:** cuando varios documentos comparten el mismo `criterio_id` (formato/peso/descripción, `LC-1.2.4-07`/`08`) pero cada uno tiene su propio título y enlace, crear **una fila por documento**, no una fila que los liste juntos. Cada fila usa `criterios_relacionados` para el criterio agrupado (`LC-1.2.4-08`).
- **Aplica a:** todas las URLs con carruseles o listados de documentos descargables.
- **estado:** vigente

## Plantilla para nuevas entradas

```markdown
### C-YYYY-MM-DD — Título corto (`LC-…`)

- **Origen:** revisión manual URL … / reunión UX …
- **Regla:** …
- **Ejemplo bueno / malo:** …
- **Aplica a:** todas | solo sitioweb | solo tramites | URL concreta
- **estado:** vigente
```

## Salida al leer este prompt

Lista mental de reglas vigentes aplicadas a la URL en curso (… **C-2026-08-25d…j** incluidas); si surge un hallazgo nuevo en la sesión, proponer el bloque a añadir aquí antes del commit.
