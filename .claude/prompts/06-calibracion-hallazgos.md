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

### C-2026-11-04a — Consistencia origen ↔ destino (hubs y páginas de detalle)

- **Origen:** revisión manual UX oct-2026 (Portada, Marcas, Sala de Prensa): las tarjetas «Para informarse», Observancia, PCT y noticias resumen un contenido que vive en otra URL. Corregir solo el hub deja la página de destino desactualizada (p. ej. `/marcas` vs `/marcas/para-informarse?acordeon=1`; menú «Observancia» vs `/protege-tu-idea/pirateria-y-falsificacion`; «PCT» vs `/pct`).
- **Regla:**
  1. En **hubs** (Marcas, Patentes, Portada, Sala de Prensa) el Paso A/B debe inventariar los enlaces informativos de 1 clic (tarjetas, atajos, menú) y **abrir con Playwright la URL de destino** para leer título (H1), miga de pan y cuerpo. **No** es una segunda auditoría de 51 criterios: es evidencia para alinear copy.
  2. Si se propone un texto en el origen (definición, etapas, tasas, glosa de concepto), el mismo `propuesto` debe **indicar replicarlo** en la página de destino (H1, miga de pan, primer párrafo o acordeón). `ubicacion_pantalla` de esta URL = zona del origen; en `motivo` / `nota_final_tic`: «Aplicar el mismo texto en [URL destino]».
  3. **Datos clave (criterio 12):** evaluar el par origen+destino juntos. Si el hub cubre qué/cómo y el destino ya responde dónde/para quién/cuánto, no inventar un recuadro duplicado en el hub; si **ninguna** de las dos lo cubre, proponer el complemento en el hub **y** en el destino.
  4. **Texto en pantalla** de esta auditoría = solo literales **visibles en la URL auditada**. Lo leído en el destino no se cita como si estuviera aquí (sigue C-2026-08-25l). Sirve para no contradecir ni omitir la página hermana.
  5. Sigue **una URL = un JSON**. La página de destino se reaudita en su propia sesión; el origen ya deja el copy alineado para el CMS.
- **Ejemplo malo:** reescribir «Qué es una marca» solo en `/marcas` y dejar el acordeón de «Para informarse» con la definición jurídica antigua.
- **Ejemplo bueno:** misma definición cotidiana en la tarjeta del hub y en `/marcas/para-informarse`; H1 de `/pct` = «PCT: Tratado de Cooperación en materia de Patentes» + miga de pan alineada.
- **Aplica a:** todas las sitioweb con atajos/tarjetas hacia otra URL del mismo sitio.
- **estado:** vigente

### C-2026-11-04b — Datos clave incompletos: añadir dónde, para quién, cuándo y cuánto (`LC-1.1.2-03`)

- **Origen:** Marcas «Para Informarse» (qué es / cómo registrar / tasas) y Portada / Sala de Prensa sin recuadro. Las tarjetas actuales cubren **qué** y **cómo**; faltan **dónde**, **quiénes**, **cuándo** y **cuánto** (p. ej. publicación en el Diario Oficial como pago aparte; 1 UTM / 2 UTM).
- **Regla (complementa C-2026-08-25e y C-2026-08-21 tasas):**
  1. No basta reescribir el párrafo que ya existe. Si faltan dimensiones del criterio 12 → **inserción** (título que anticipe, frase bajo la tarjeta, o recuadro). Ausencia total de resumen → `severidad: alta`.
  2. En hubs de trámite informativo (Marcas/Patentes), el título genérico «Para Informarse» no anticipa contenido: proponer p. ej. «Todo sobre las marcas: qué son, sus ventajas, cómo registrarlas y cuánto cuesta» (homólogo en Patentes).
  3. Tasas: listar **todos** los pagos del ciclo (solicitud, publicación, concesión), no solo «inicio y final».
  4. En listado de noticias: un recuadro breve bajo «Noticias» (qué se publica, para quién, cómo ver anteriores) **además** de la fecha de la página.
  5. En Portada: además de atajos, un resumen de servicios (qué, cómo, dónde, cuándo, para quién).
- **Ejemplo malo:** cambiar solo la definición jurídica de «marca» y dejar tasas sin montos ni publicación.
- **Ejemplo bueno:** tarjeta «Cómo registrar… y quiénes pueden»: tres etapas + personas naturales/jurídicas; «Pago de solicitud y registro»: 1 UTM / 2 UTM + Diario Oficial.
- **Aplica a:** sitioweb informativas (hubs, portada, sala de prensa, destinos «para informarse»).
- **estado:** vigente

### C-2026-11-04c — Conservar conceptos oficiales + glosa; no reescribir misión/visión/valores

- **Origen:** revisión Portada / Marcas / Sala de Prensa. Equipo UX: Observancia, Sistema de Madrid, Sello de Origen, Dominio Público, PCT y homólogos **deben conservar el nombre**; la claridad va en explicación, no en sustituir el término. Misión, visión y valores institucionales **no se reescriben** (texto ligado a la ley).
- **Regla:**
  1. **Menú / atajos** (ítems cortos): el rótulo oficial se mantiene. Añadir **texto de ayuda al pasar el cursor** (`title` / tooltip visible; no es `alt` de imagen). Ej.: «PCT: Tratado de Cooperación en materia de Patentes»; «Sistema de Madrid: registra tu marca en otros países»; «Sello de Origen: distingue productos típicos de una zona de Chile»; «Dominio público: buscador de patentes que ya se pueden usar libremente»; «Conecta: muestra tu innovación protegida a posibles interesados»; «Aprende: cursos y capacitaciones sobre propiedad industrial».
  2. **H1 y título de bloque** de la página de destino: **mismo concepto + glosa en el mismo título** (ej. «Observancia: protege tu marca o patente»; «PCT: Tratado de Cooperación en materia de Patentes»). Luego el cuerpo responde qué / cómo / dónde / para quién (C-2026-11-04a/b).
  3. **Observancia** en menú: preferir glosa en el mismo rótulo («Observancia: defiende tus derechos de propiedad industrial») o subtítulo visible; no reemplazar «Observancia» por una frase que borre el nombre.
  4. **CTA genéricos** («Conoce más», «Acceder»): **sí** cambiar el rótulo para decir el destino (no basta hover). Ej. menú «Conoce más» → «Qué es la propiedad intelectual e industrial»; banner Observancia → «Conoce cómo protegerte de la piratería y la falsificación».
  5. **Misión, visión, valores** y demás copy **legal/institucional fijado por ley:** no proponer reescritura por lenguaje plano. `cumple` (o no puntuar el bloque como defecto de jerga) y, si hace falta, una línea en `nota_final_tic`: el texto no se altera por mandato institucional. **Prohibido** `incumple` solo porque el estilo es formal.
  6. Nombre de la institución en pie: no inventar una corrección de mayúsculas sobre «industrial» / «Industrial» distinta de lo que Equipo UX fije; si hay duda, no abrir un `incumple` de redacción sobre el nombre legal.
- **Ejemplo malo:** menú «Observancia» → «Herramientas contra la piratería» (se pierde el concepto oficial).
- **Ejemplo bueno:** menú conserva «Observancia» + glosa; H1 de destino con el mismo par término+explicación; cuerpo con datos clave.
- **Aplica a:** todas las sitioweb (menú global = patrón de sitio).
- **estado:** vigente

### C-2026-11-04d — Fecha de actualización visible en el pie (`LC-1.1.4-01`)

- **Origen:** revisión Portada / Marcas / Sala de Prensa: Equipo UX ubicó «Actualizado: DD de mes de AAAA» **en el footer**, junto a «©2026 INAPI. Todos los derechos reservados.»
- **Regla (actualiza C-2026-08-25f / C-2026-08 fecha):**
  1. El **©año solo** sigue **sin** contar como fecha de actualización.
  2. Una línea **propia** «Actualizado: DD de mes de AAAA» (fecha real) **sí cumple**, aunque esté en el pie. Proponer esa ubicación (no insistir solo «bajo el H1») salvo que la página ya tenga fecha de listado/noticia que deba coexistir.
  3. En un **listado de noticias**, las fechas de cada tarjeta no sustituyen la fecha de la **página**; puede ir en pie o bajo el subtítulo «Noticias», en línea propia.
  4. Ausencia total → `incumple` + `severidad: alta`.
- **Aplica a:** todas.
- **estado:** vigente

### C-2026-11-04e — Botón «LINK EXTERNO»: eliminar, no solo relabelar

- **Origen:** revisión Marcas (panel de acceso/registro). El botón `a.btn.rojo` con texto «LINK EXTERNO» apunta a `href="#"`: no redirige y está en mayúscula sostenida.
- **Regla:**
  1. Si el control no tiene destino real → propuesta tipo **eliminación**, no un rótulo más claro hacia ninguna parte.
  2. En `ubicacion_pantalla`: panel de acceso y registro «INAPI» › junto a «Usuario Frecuente» y «Registro». En apoyo TI (`html_linea_aprox` / `nota_final_tic`): `header › div.box-login › div.contenido-login › a.btn.rojo` (`body.cbp-spmenu-push > div.wrapper > header > div.container > div.box-login > div.contenido-login > a.btn.rojo`).
  3. Patrón de sitio: una corrección en el layout cubre todas las URLs.
- **Aplica a:** todas las `www.inapi.cl` con el panel de login.
- **estado:** vigente

### C-2026-11-04f — Noticias y listados: lenguaje claro persistente; fechas con «de»; «Home» → «Inicio»

- **Origen:** revisión Sala de Prensa y Portada (Novedades). El listado rota; las noticias salen de pantalla pero siguen publicadas por fecha.
- **Regla:**
  1. Corregir título, bajada y cuerpo de las noticias **aunque ya no estén en el listado vigente**; el CMS debe aplicarlas al artículo. Las **nuevas** noticias se redactan así desde el origen: sin jerga jurídico-técnica sin glosa; siglas desarrolladas en la primera aparición de **cada** tarjeta (se leen sueltas); oraciones cortas; negrita en datos clave del extracto.
  2. Fechas de tarjetas: «Martes 20 **de** octubre de 2026» (preposición «de» entre día y mes). Patrón de plantilla CMS.
  3. Miga de pan: «Home» → «Inicio» (patrón de sitio).
  4. Títulos/migas/pestañas/botones del listado: no mayúscula sostenida (siguen excluidos `ACCESOS` y `BUSCADOR`).
  5. Listas con viñetas usadas como **ejemplo visual** (p. ej. cuenta pública) no se tratan como «párrafos» del criterio de extensión si se distinguen tipográficamente del cuerpo.
  6. Unificar «propiedad industrial» vs «propiedad intelectual» en la misma noticia si el título dice una y el extracto la otra.
- **Aplica a:** Portada (Novedades), Sala de Prensa, detalle de noticia, buscador de noticias.
- **estado:** vigente

### C-2026-11-05a — Plazos/canales con evidencia; copy CMS (no consejos); título ≠ mayúsculas; SIAC

- **Origen:** corrección post-auditoría Formulario Contacto SIAC (URL 10) y Portal de Trámites (URL 11) con evidencia operativa (correo automático al enviar; compromiso de respuesta no superior a 4 días hábiles; disclaimer de datos junto al formulario).
- **Regla:**
  1. **Plazos, canales y confirmaciones:** solo con evidencia operativa o literal visible en pantalla. **Prohibido** placeholders tipo `[N] días hábiles`, números inventados o «plazo a confirmar» como si fueran copy final.
  2. **Corrección propuesta = copy CMS** (texto pegable) o instrucción con literales («Añadir…», «Reemplazar… por…»). **Prohibido** meta-consejos («Hacer que la secuencia…», «asegurar que…», «mejorar la coherencia…») sin el texto exacto de cada ventana/bloque.
  3. **Formulario SIAC (y análogos):** si hay evidencia de correo automático + compromiso de 4 días hábiles, reflejarlos en intro, FAQ, modal de confirmación y aviso sin sesión. El modal debe mostrar el **número generado** (formato tipo `SIAC…`) y el plazo; no dejar el número vacío en el propuesto.
  4. **Disclaimer de datos:** junto a RUT / campos personales, con enlace a Política de privacidad; no basta el enlace genérico del pie.
  5. **Título visible en mayúsculas:** fidelidad del título (`LC-1.1.2-01` / criterio 10) ≠ mayúsculas sostenidas (`LC-1.2.4-05` / criterio 40). Si el título identifica el contenido, el 10 puede `cumple`; tipografía tipográfica queda solo en el 40.
  6. Sigue vigente C-2026-08-26a: complementar o agrupar solo si el `propuesto` es idéntico; intro ≠ FAQ ≠ confirmación ≠ placeholders.
- **Ejemplo malo:** propuesto «Hacer que la secuencia de ventanas sea coherente…» / «Recibirá respuesta en [N] días hábiles» / criterio 10 `incumple` solo por mayúsculas del H1.
- **Ejemplo bueno:** textos CMS del aviso sin sesión y de la confirmación con número `SIAC…` + «4 días hábiles»; criterio 10 `cumple` citando el título visible; mayúsculas en criterio 40.
- **Aplica a:** trámites/formularios con plazos o confirmación; toda URL al redactar propuestas.
- **estado:** vigente

### C-2026-11-05b — ClaveÚnica (Estado): no modificar texto ni forma del botón/widget

- **Origen:** revisión Portal de Trámites / accesos con botón «ClaveÚnica»: el componente de acceso lo entrega el Estado (plataforma Clave Única), no el equipo TI de INAPI.
- **Regla:**
  1. **Prohibido** proponer cambios de texto, espaciado tipográfico, color, tamaño, icono o layout del **botón/widget de Clave Única** (p. ej. «ClaveÚnica» → «Clave Única»).
  2. Si el único hallazgo de un criterio es ese botón → `no_aplica` (o `cumple` si el resto del criterio ya está OK) con justificación ciudadana: el control lo define el Estado; fuera del alcance de correcciones CMS/TI INAPI.
  3. **Sí** se pueden corregir textos **editoriales** de INAPI que mencionen Clave Única en párrafos, ayudas o enlaces propios (p. ej. «Obtener Clave Única en claveunica.gob.cl»), siempre que no alteren el botón/widget del Estado.
  4. Anotar en `nota_final_tic` si conviene: «Botón Clave Única: sin propuesta; propiedad del Estado.»
- **Ejemplo malo:** fila `sustituciones[]` con original `ClaveÚnica` / propuesto `Clave Única` sobre el botón de acceso.
- **Ejemplo bueno:** no crear esa fila; criterio de ortografía `cumple` o `no_aplica` según el resto de la página.
- **Aplica a:** todas las URLs con acceso Clave Única (trámites y sitioweb).
- **estado:** vigente

### C-2026-11-05c — Fecha de actualización solo en el pie, junto al ©

- **Origen:** entrega TI / Word de correcciones: la fecha no debe proponerse bajo el H1 ni junto al encabezado del formulario.
- **Regla (refuerza y precisa C-2026-11-04d):**
  1. La línea «Actualizado: DD de mes de AAAA» va **únicamente** al final del pie de página, **al lado** de «©AAAA INAPI. Todos los derechos reservados» (mismo bloque de pie).
  2. **Prohibido** proponerla bajo el título principal, bajo el encabezado del formulario, en el masthead o en un bloque intermedio del cuerpo.
  3. El © solo **no** cuenta como fecha de contenido; hace falta la línea «Actualizado:…» junto a él.
- **Ejemplo malo:** «Añadir Actualizado… junto al encabezado del formulario / bajo el H1».
- **Ejemplo bueno:** «Añadir en el pie, junto a «©2026 INAPI. Todos los derechos reservados»: Actualizado: DD de mes de AAAA».
- **Aplica a:** todas.
- **estado:** vigente

### C-2026-11-09a — Mismo texto/nodo: una solicitud con propuesta final completa

- **Origen:** revisión Word SIAC (URL 10): varias filas reescribían el mismo párrafo introductorio, el mismo modal de confirmación o el mismo aviso de mantenimiento con propuestas encadenadas (la última anulaba a la anterior).
- **Regla (refuerza §20.3 y C-2026-08-26a para entrega Word/TI):**
  1. Si varios criterios apuntan al **mismo texto visible**, **mismo nodo** o **misma sección localizable**, hay **una sola** fila de solicitud de corrección (o una sola fila en `sustituciones[]` del primario + `criterios_relacionados` / secundarios con `agrupado_en`).
  2. El `propuesto` debe ser la **propuesta final más completa y detallada** (no una cadena de borradores: primero un ajuste superficial y luego otro que lo vuelve a cambiar).
  3. En Observaciones / `motivo` del primario: listar **todos** los hitos y criterios cubiertos («Checklist Hito X - Criterio Y; Hito Z - Criterio W») y cuántas correcciones del grupo son.
  4. **Prohibido** entregar N filas Word independientes que, al aplicarse en orden, reescriban el mismo literal varias veces.
  5. Sigue vigente C-2026-08-22: textos **distintos** del mismo `LC-*` (nodos distintos) → N filas. Esta calibración solo aplica cuando el **literal/nodo** es el mismo.
  6. En avisos HTML de sistemas: la entrega incluye HTML original + HTML propuesto (misma cáscara id/class) + vista tipográfica; no inventar ids/clases nuevas.
- **Ejemplo malo:** tres filas sobre «Puede enviar consultas…» con tres `propuesto` sucesivos incompletos.
- **Ejemplo bueno:** una fila con el párrafo introductorio final (ámbito + seguimiento + FAQ si aplica) y Observaciones que nombran los tres criterios.
- **Aplica a:** todas (prioridad trámites / SIAC / avisos).
- **estado:** vigente

### C-2026-11-09b — Avisos de sistemas: plantilla editorial + HTML de entrega

- **Origen:** calibración del Word/PDF/Excel de `avisos-sistemas-tramites_2026-11-09`: IDs consecutivos parecían «saltarse» números porque se agrupaba por literal exacto (fechas distintas = filas distintas); TI necesita HTML listo para pegar y ver tipografía.
- **Regla:**
  1. **Agrupar IDs** cuando el mensaje es la **misma plantilla editorial**: ignorar diferencias solo de **día / fecha / hora** (y anclas relativas «mañana», «este jueves», etc.). Listar **todos** los IDs del grupo en la casilla, sin repetir y ordenados.
  2. **Separar filas** si hay diferencias evidentes de **palabras, conceptos, tono o forma de dirigirse** a la persona (p. ej. «Debemos informar…» vs «Nos dirigimos a ustedes…»; con/sin «datacenter»; MFA vs mantención).
  3. IDs ausentes en el Excel fuente no se inventan (huecos reales del corpus).
  4. Columna **Contenido a modificar/agregar**: (a) HTML propuesto completo para copy-paste TI (conservar `id`/`class`/cáscara); (b) debajo, **vista en pantalla** con pesos tipográficos del HTML (negrita, cursiva, subrayado, enlaces, viñetas, color). Si el color del texto es blanco/casi blanco, mostrar con **fondo de contraste** legible.
  5. Columna **Texto anuncio**: HTML original representativo del grupo (no solo texto plano).
- **Aplica a:** auditoría de avisos de sistemas (entrega Word/PDF/Excel/UI).
- **estado:** vigente

### C-2026-08-22 — Aplicabilidad IEW/IESD en URLs `tramites`

- **Origen:** primera URL `tipo_pagina: "tramites"` migrada a v3.0 en esta serie (Formulario Contacto SIAC, META MEI orden 10).
- **Regla:** el campo `applicability` de cada criterio en `data/checklist-criteria-lc-ptd.json` es normativo, no orientativo:
  - `applicability: "sitioweb"` (10 exclusivas IEW: LC-1.1.5-03, LC-1.1.6-02, LC-1.1.7-01, LC-1.1.7-02, LC-1.1.8-01/02/03, LC-1.2.4-06, LC-1.3.1-01, LC-1.3.2-02) → **`no_aplica`** en toda URL `tipo_pagina: "tramites"`, con `comentario`: «Este criterio es exclusivo del instrumento IEW (sitioweb) según el catálogo v3.0; esta URL es tramites (instrumento IESD), por lo que no corresponde evaluarlo aquí.» No es un `no_aplica` para evadir un incumplimiento (§16): es exclusión estructural del catálogo, documentada y simétrica en ambos sentidos.
  - `applicability: "tramites"` (exclusiva restante IESD: `LC-5.2.2-01` concisión inicio+trámite) → evaluar en `tramites`; en `sitioweb` → `no_aplica` con **justificación ciudadana** (sin escribir la palabra `applicability` ni siglas sueltas). **`LC-5.2.1-01` ya no es exclusiva:** ver C-2026-08-25h (aplica en hubs de trámite / sitioweb con servicio digital).
  - `applicability: "ambos"` → evaluar igual en los dos tipos de página. **Incluye `LC-5.2.4-01`** (rótulos/CTA) y **`LC-5.2.1-01`** (claridad servicio digital) — ver C-2026-08-25c / C-2026-08-25h.
- **Cómo aplicar:** al iniciar el Paso D en una URL `tramites`, filtrar primero los 10 exclusivos IEW a `no_aplica`; evaluar **`LC-5.2.2-01`** (exclusiva trámites) y también **`LC-5.2.1-01`** / **`LC-5.2.4-01`** (ambos) antes de lanzar los 15 subagentes. En los 4 campos CMS: **sin** `applicability`, **sin** siglas IEW/IESD sueltas y **sin** `Tnnn` (C-2026-08-25h); si hace falta nombrar el instrumento: nombre completo + sigla.

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

### C-2026-08-26a — No repetir correcciones entre criterios; revisar hallazgos previos al avanzar

- **Origen:** revisión Formulario Contacto SIAC (URL 10): criterios 12, 13 y 15 repetían el mismo párrafo introductorio, el mismo modal de confirmación y justificaciones casi idénticas (autonomía + FAQ + datos clave mezclados). La tercera fila del 13 era un eco del 15; el 15 estaba `agrupado_en` el 13 y reutilizaba las mismas filas vía `criterios_relacionados`.
- **Causa raíz:** al puntuar el criterio N, no se revisó lo ya escrito en criterios 1…N−1 (texto, ubicación, propuesto, justificación, agrupaciones). Se reutilizó el mismo `propuesto`/`motivo` aunque la **pregunta** del instrumento era otra.
- **Regla (obligatoria en Pasos D y E):**
  1. **Antes** de fijar `incumple` + filas de `sustituciones[]` de un criterio nuevo, **releer** las filas y justificaciones ya cerradas de criterios anteriores (mismo turno / mismo JSON en construcción).
  2. Si el hallazgo toca la misma zona, la corrección nueva debe ser **complementaria** (otro ángulo, otro nodo, otro detalle accionable) o el criterio debe ir `agrupado_en` el primario **solo** cuando el `propuesto` es **exactamente el mismo** (§20.3). **Prohibido** `criterios_relacionados` que hagan reaparecer en la UI la misma corrección bajo otra pregunta.
  3. La **justificación** responde **solo** la pregunta de ese criterio (datos clave ≠ autonomía ≠ organización FAQ ≠ escaneo ≠ negrita). No pegar el párrafo genérico de autonomía bajo claridad del servicio digital, ni viceversa.
  4. Varias filas del **mismo** `criterio_id`: cada una = nodo o defecto distinto (p. ej. en autonomía: 1) seguimiento en intro, 2) modal de confirmación, 3) placeholders/ayudas de campos). **Prohibido** dos filas con el mismo literal y el mismo `propuesto`.
  5. Ejemplos de foco distinto en formularios:
     - **Datos clave (12):** qué / cómo / cuándo / para quién en el resumen.
     - **Autonomía (13):** pasos tras enviar, ayudas para completar campos (placeholders con ejemplos; «Seleccione una opción» sin `...`), número de atención usable.
     - **FAQ servicio digital (15):** bloque de preguntas frecuentes anticipadas y secuencia coherente de ventanas; **no** copiar el `propuesto` de 13 ni el de subtítulos del 37/38.
- **Ejemplo malo:** 13 y 15 con las mismas 3 correcciones (intro + modal ×2) y justificación clonada.
- **Ejemplo bueno:** 12 = plazo/para quién en intro; 13 = seguimiento + modal con número + placeholders; 15 = bloque FAQ + secuencia de modales; 37/38 = subtítulos/separación visual sin repetir el bloque FAQ.
- **Aplica a:** todas (crítico en trámites y en cualquier URL con varios criterios sobre el mismo formulario/artículo).
- **estado:** vigente

### C-2026-08-25l — Escaneo (38) ≠ negritas (39); literales solo de esta URL

- **Origen:** revisión Noticia cifra patentes (URL 9):
  1. Criterio 38 (`LC-1.2.4-03` escaneo visual) mostraba 3 correcciones: la 1 mezclaba negrita con escaneo y estaba `agrupado_en` el criterio 39; las 2 y 3 eran filas de negrita (`LC-1.2.4-04`) enlazadas con `criterios_relacionados`, por lo que la UI las repetía bajo el 38.
  2. Criterio 39 tenía dos filas sobre el **mismo** párrafo (primer párrafo) porque la fila de escaneo y la de negrita compartían nodo vía cruce incorrecto.
  3. Criterio 48 (`LC-1.3.1-01`) usaba como Texto el `alt` «Premio Europeo… biofiltro…» (no es texto visible del ciudadano) y una justificación desalineaada de los gráficos reales de **esta** página.
- **Causa raíz:** (a) forzar §20.3 / `agrupado_en` / `criterios_relacionados` entre criterios cuya **corrección propuesta es distinta** (estructura/jerarquía vs negrita); (b) contaminar Texto/Justificación con `alt` no visible, notas editoriales o literales de **otra URL** / JSON previo.
- **Regla:**
  1. **Criterio 38 = escaneo / jerarquía visual:** subtítulos, listas con viñetas, recuadros, iconografía de apartados, tipografía de bloques. **Prohibido** proponer negrita como corrección del 38 (eso es solo el **39**). **Prohibido** `agrupado_en` el 39 o `criterios_relacionados` hacia/desde el 39 cuando el `propuesto` no es el mismo.
  2. **Criterio 39 = negrita:** una fila de `sustituciones[]` por **párrafo/nodo distinto**; no dos filas del mismo párrafo. No enlazar esas filas al 38.
  3. **Literales solo de la URL auditada:** en Texto, Ubicación, Corrección propuesta y Justificación, mencionar **únicamente** lo que aparece textual y literal (o como apoyo visual verificable) en **esa** URL. **Prohibido** copiar `alt`/títulos/párrafos/cifras de otra URL, de un JSON anterior de otra noticia, o inventar apoyos que no estén en el DOM actual. El `alt` no visible **no** es «Texto en pantalla».
  4. Si un carrusel tiene imagen/temática errónea, documentarlo en `nota_final_tic` (editorial), **no** como evidencia falsa del criterio 48.
- **Ejemplo malo:** 38 con `agrupado_en: LC-1.2.4-04` + propuesto «…o destacarlas con negrita…» + filas 39 con `criterios_relacionados: [LC-1.2.4-03]`; 48 con Texto = alt de biofiltro.
- **Ejemplo bueno:** 38 primario con propuesto de subtítulos/listas/recuadro; 39 con N filas de negrita en N párrafos distintos; 48 Cumple citando los gráficos/imágenes intercalados visibles en esta noticia.
- **Aplica a:** todas (esp. noticias detalle y cualquier reauditoría con JSON previo).
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
- **Ejemplo bueno:** citar el rótulo ambiguo («Más», «Anotación») + ubicación + propuesta descriptiva. Si el control es «LINK EXTERNO» a `href="#"` → **eliminar** (C-2026-11-04e), no inventar un destino.
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
- **Regla:** en cada URL, **antes** de los 15 subagentes, ejecutar Prompt **7** + skill **06** (§17.1bis): analizar de menor a mayor granularidad; conceptos oficiales = **nombre + glosa** (C-2026-11-04c); no «pulir» jerga sin explicar; si un párrafo lista etapas, describir qué ocurre y completar dónde/quién/cuánto si faltan (C-2026-11-04b). En hubs, contrastar destino (C-2026-11-04a). El mapa D0 alimenta a los 15 indicadores.
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
  1. Título **«Observancia»** (o solo jerga legal como rótulo) → incumplir lenguaje plano / escritura web (`LC-1.1.3-03`, `LC-1.2.4-02` u homologables). **Propuesta vigente (C-2026-11-04c):** conservar el término oficial **y** añadir glosa en el mismo bloque o H1 (ej. «Observancia: protege tu marca o patente»). **No** sustituir el nombre por una frase que lo borre.
  2. Subtítulo **«Conoce y utiliza las herramientas de protección de la Propiedad Intelectual en Chile»** → evaluar claridad/cercanía; si «Propiedad Intelectual» / formulación densa no ayuda al público general → `incumple` + propuesta más llana (qué protege, para quién).
- **Aplica a:** Portada y bloques homólogos en sitioweb.
- **estado:** vigente

### C-2026-08-21 — Términos técnicos/jurídicos: no basta «pulir» la frase (`LC-1.1.3-*`, claridad, completitud)

- **Origen:** revisión Marcas (`/marcas`) — tasas/derechos y etapas del procedimiento.
- **Regla:** si el texto usa conceptos INAPI/jurídicos (**tasas**, **derechos**, **examen de forma**, **examen de fondo**, **extracto**, **Diario Oficial**, etc.), **no** alcanza con reordenar o acortar la oración dejando la misma jerga. La propuesta CMS debe:
  1. **Nombres oficiales de programa/figura** (Observancia, Sistema de Madrid, Sello de Origen, Dominio Público, PCT): **conservar** + glosa (C-2026-11-04c). **No** reemplazar el nombre.
  2. Otros términos (tasas, derechos, extracto, exámenes): **definir o describir en breve** qué es y para qué sirve (1–2 frases), en el mismo bloque; reemplazo cotidiano solo si el término **no** es el nombre oficial de un servicio o figura legal.
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

- **Regla:** sin fecha visible → `(ausencia)` / `(sin fecha de actualización visible)` + propuesta de línea visible. **Nunca** usar `©año` **solo** como fecha de actualización. **Sí** cumple una línea propia «Actualizado: DD de mes de AAAA» en el pie, junto al copyright (C-2026-11-04d). **Severidad:** ausencia total → `alta` (No cumple); ver C-2026-08-25f.

### C-2026-08 — Visualización / apoyos (`LC-1.3.1-01`)

- **Regla:** solo pregunta si hay íconos/imágenes/gráficos para datos. Si ya hay banners/tarjetas/íconos → `cumple`. **No** incumplir por `alt` vacío (anotar en nota TIC si hace falta, sin bajar el % por ese id).

### C-2026-08 — Mayúsculas plantilla home (`LC-1.2.4-05`)

- **Regla:** ítems `ACCESOS` y `BUSCADOR` de cabecera global `www.inapi.cl` **excluidos**. Aplicar el criterio en el resto y en trámites.

### C-2026-08 — Título con jerga (`LC-1.1.3-03` + `LC-1.2.4-02`)

- **Regla:** un término legal solo como H1/título de tarjeta (ej. «Observancia») incumple aunque debajo haya subtítulo. Propuesta vigente: **término oficial + glosa** en el mismo bloque/H1 (C-2026-11-04c), no borrar el nombre. *(Complementada por C-2026-08-21 Portada Observancia.)*

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

Lista mental de reglas vigentes aplicadas a la URL en curso (hasta **C-2026-11-05c**); si surge un hallazgo nuevo en la sesión, proponer el bloque a añadir aquí antes del commit.
