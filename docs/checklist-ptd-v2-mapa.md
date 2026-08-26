# Mapa: instrumentos IEW/IESD (LC · Usabilidad · Seguridad) → catálogo LC v3.0

**Última actualización:** 2026-08-24

## Fuentes canónicas (orden de autoridad)

| Prioridad | Artefacto | Rol |
| --- | --- | --- |
| 1 | `docs/Checklist_Editorial_INAPI_v2_0_actualizado.docx` | Checklist editorial PTD: **Hito → Tarea → Pregunta** (IEW/IESD) |
| 1 | `docs/Checklist_Editorial_INAPI_v2_0_actualizado.extracted.md` | Texto del Word para RAG |
| 1 | `data/checklist-editorial-ptd-v2.json` | Misma estructura para Claude Code (hitos) + anclaje entrega |
| 2 | Este documento | Inventario pregunta-a-pregunta IEW↔IESD y exclusivas |
| 3 | `data/checklist-criteria-lc-ptd.json` | **51** criterios LC v3.0 = score, UI, PDF, Excel MEI |
| — | `data/checklist-criteria.json` | Histórico 47 A–H (no usar en auditorías nuevas) |
| — | `src/lib/ptd-hito-tarea-por-criterio.ts` | Columnas **Hito PTD** / **Tarea PTD** en UI/Excel/PDF |

**Orquestación:** `.claude/CLAUDE.md` §17 + §20 + §22 + **§23** · `.claude/prompts/05-audit-maestro-url.md` · prompts `01`…`07` · skills `01`…`06`.

**META MEI 2026:** auditar solo **Lenguaje claro** — **51 preguntas únicas** (39 ambos · 10 solo IEW · 2 solo IESD) → JSON canónico con **51** filas `LC-*` (`version_checklist: "3.0"`).  
`LC-5.2.4-01` (rótulos/CTA) cuenta en **ambos** (C-2026-08-25c).  
**Catalogadas (fuera del % ahora):** Usabilidad **18** · Seguridad **10** · total tres dimensiones **79**.

### Anclaje entrega Hito / Tarea PTD (UI · Excel · PDF)

Fuente operativa: `data/checklist-editorial-ptd-v2.json` → `src/lib/ptd-hito-tarea-por-criterio.ts`.

**Reglas:** sin solape **494 ↔ 496** (494 = solo Redacción `1.1.5`; 496 = solo Lenguaje plano `1.1.3`). Tarea **504** = solo ARCO. Tareas **510 / 511 / 512** = una pregunta de Contenidos sensibles cada una. **Hito 492 / Tarea 491** no se muestran en entrega (checklist meta ya implementado); Completitud → **498/497**.

#### Leyenda Hito ↔ Tarea (dimensión CL1)

| Hito PTD | Tarea PTD |
| --- | --- |
| **494** — El sitio publica contenidos redactados en lenguaje claro, sin errores ortográficos ni gramaticales, cumpliendo estándares de calidad en la redacción. | **493** — Corregir y prevenir errores de redacción y ortografía en los contenidos del sitio, aplicando criterios de lenguaje claro en la redacción, e implementar controles editoriales que aseguren la aplicación de estos criterios en las nuevas publicaciones. |
| **496** — Los contenidos del sitio están redactados en lenguaje claro, positivo y cercano, libres de tecnicismos innecesarios y con siglas o acrónimos definidos. | **495** — Redactar y mantener los contenidos del sitio en lenguaje claro, positivo y cercano, evitando tecnicismos, abreviaturas o expresiones confusas, y definiendo las siglas y acrónimos cuando se utilicen. |
| **498** — El sitio publica contenidos presentados de manera clara y concisa, evitando redundancias y ambigüedades en la información. | **497** — Ajustar los contenidos del sitio para que transmitan la información de manera clara y concisa, eliminando redundancias o ambigüedades. |
| **500** — Cada página del sitio muestra la fuente de autoría y la fecha de actualización de los contenidos. | **499** — Configurar en el CMS campos obligatorios de autoría y fecha de actualización y mostrar estos datos en el sitio. |
| **502** — El sitio muestra de manera visible las condiciones de uso de sus contenidos. | **501** — Establecer y publicar en el sitio web las condiciones de uso de los contenidos, indicando permisos y restricciones de forma clara y accesible. |
| **505** — El sitio web evita la publicación de RUN, direcciones y teléfonos personales, e informa de manera clara cómo las personas pueden ejercer sus derechos sobre sus datos. | **503** — Eliminar y prevenir la publicación de RUN, direcciones y teléfonos personales mediante pauta editorial y control previo de contenidos. |
| **505** — El sitio web evita la publicación de RUN, direcciones y teléfonos personales, e informa de manera clara cómo las personas pueden ejercer sus derechos sobre sus datos. | **504** — Incorporar una sección que informe cómo ejercer derechos sobre datos personales (acceso, rectificación, eliminación, oposición y bloqueo), conforme a la Ley sobre Protección de la Vida Privada. |
| **507** — El sitio web presenta textos alineados a la izquierda y párrafos con espaciado. | **506** — Asegurarse que los textos se publiquen alineados a la izquierda y con espaciado entre párrafos. |
| **509** — Todos los documentos enlazados en el sitio web muestran título, formato, peso y una breve descripción. | **508** — Configurar en el CMS campos obligatorios para título, formato, peso y descripción de cada documento, y corregir los enlaces existentes que no incluyan esta información. |
| **513** — El sitio no publica contenidos que expongan la identidad de menores de edad, incluyan expresiones inadecuadas para ellos ni exhiban información que vulnere la dignidad o vida privada de las personas. | **510** — Revisar y editar los contenidos del sitio para resguardar la identidad de menores de edad en textos e imágenes, e incorporar controles preventivos que impidan publicar información que los exponga. |
| **513** — El sitio no publica contenidos que expongan la identidad de menores de edad, incluyan expresiones inadecuadas para ellos ni exhiban información que vulnere la dignidad o vida privada de las personas. | **511** — Revisar y ajustar los contenidos del sitio para eliminar expresiones inadecuadas o no aptas para menores de edad. |
| **513** — El sitio no publica contenidos que expongan la identidad de menores de edad, incluyan expresiones inadecuadas para ellos ni exhiban información que vulnere la dignidad o vida privada de las personas. | **512** — Revisar y eliminar del sitio los contenidos que exhiban información que pueda menoscabar a las personas (por ejemplo, datos sobre su salud, creencias religiosas, ideología política, vida sexual o características físicas). |
| **515** — El sitio web presenta sus datos acompañados de apoyos visuales. | **514** — Incorporar apoyos visuales como íconos, imágenes, gráficos o infografías para presentar los datos publicados en el sitio web. |
| **517** — Los contenidos publicados del sitio web están redactados de forma objetiva y neutra. | **516** — Reescribir contenidos para asegurar redacción objetiva y neutra, privilegiando datos y hechos por sobre opiniones o adjetivos calificativos. |
| **519** — El sitio web presenta las versiones anteriores de contenidos rotuladas como documentos de archivo no vigentes. | **518** — Rotular las versiones anteriores de contenidos como documentos de archivo no vigentes, indicando claramente el año o periodo al que corresponden. |

#### Catálogo completo — 51 criterios `LC-*` → Hito / Tarea

| Id | Pregunta (resumen) | Hito PTD | Tarea PTD |
| --- | --- | --- | --- |
| `LC-1.1.1-01` | ¿Es fácil reconocer la fuente o autoría de la información publicada? Por ejempl… | **500** — Cada página del sitio muestra la fuente de autoría y la fecha de actualización de los contenidos. | **499** — Configurar en el CMS campos obligatorios de autoría y fecha de actualización y mostrar estos datos en el sitio. |
| `LC-1.1.2-01` | ¿Los contenidos representan de manera fiel lo enunciado en su título? | **498** — El sitio publica contenidos presentados de manera clara y concisa, evitando redundancias y ambigüedades en la información. | **497** — Ajustar los contenidos del sitio para que transmitan la información de manera clara y concisa, eliminando redundancias o ambigüedades. |
| `LC-1.1.2-02` | ¿Se cumple con la recomendación de no incluir páginas sin contenido, contenido … | **498** — El sitio publica contenidos presentados de manera clara y concisa, evitando redundancias y ambigüedades en la información. | **497** — Ajustar los contenidos del sitio para que transmitan la información de manera clara y concisa, eliminando redundancias o ambigüedades. |
| `LC-1.1.2-03` | ¿El texto destaca los datos clave de la información? Por ejemplo: se presenta u… | **498** — El sitio publica contenidos presentados de manera clara y concisa, evitando redundancias y ambigüedades en la información. | **497** — Ajustar los contenidos del sitio para que transmitan la información de manera clara y concisa, eliminando redundancias o ambigüedades. |
| `LC-1.1.2-04` | En el caso de textos referidos a trámites, ¿se brinda información suficiente pa… | **498** — El sitio publica contenidos presentados de manera clara y concisa, evitando redundancias y ambigüedades en la información. | **497** — Ajustar los contenidos del sitio para que transmitan la información de manera clara y concisa, eliminando redundancias o ambigüedades. |
| `LC-1.1.3-01` | ¿El lenguaje utilizado está orientado a que una persona pueda entender el conte… | **496** — Los contenidos del sitio están redactados en lenguaje claro, positivo y cercano, libres de tecnicismos innecesarios y con siglas o acrónimos definidos. | **495** — Redactar y mantener los contenidos del sitio en lenguaje claro, positivo y cercano, evitando tecnicismos, abreviaturas o expresiones confusas, y definiendo las siglas y acrónimos cuando se utilicen. |
| `LC-1.1.3-02` | ¿El tono y voz son amables, respetuosos y cercanos con las personas usuarias? | **496** — Los contenidos del sitio están redactados en lenguaje claro, positivo y cercano, libres de tecnicismos innecesarios y con siglas o acrónimos definidos. | **495** — Redactar y mantener los contenidos del sitio en lenguaje claro, positivo y cercano, evitando tecnicismos, abreviaturas o expresiones confusas, y definiendo las siglas y acrónimos cuando se utilicen. |
| `LC-1.1.3-03` | ¿La redacción prescinde de la jerga técnica o legal? | **496** — Los contenidos del sitio están redactados en lenguaje claro, positivo y cercano, libres de tecnicismos innecesarios y con siglas o acrónimos definidos. | **495** — Redactar y mantener los contenidos del sitio en lenguaje claro, positivo y cercano, evitando tecnicismos, abreviaturas o expresiones confusas, y definiendo las siglas y acrónimos cuando se utilicen. |
| `LC-1.1.3-04` | ¿Se evitan abreviaturas, extranjerismos, eufemismos, modismos o términos muy es… | **496** — Los contenidos del sitio están redactados en lenguaje claro, positivo y cercano, libres de tecnicismos innecesarios y con siglas o acrónimos definidos. | **495** — Redactar y mantener los contenidos del sitio en lenguaje claro, positivo y cercano, evitando tecnicismos, abreviaturas o expresiones confusas, y definiendo las siglas y acrónimos cuando se utilicen. |
| `LC-1.1.3-05` | ¿Se define cada sigla y acrónimo y se emplean solo si es necesario? | **496** — Los contenidos del sitio están redactados en lenguaje claro, positivo y cercano, libres de tecnicismos innecesarios y con siglas o acrónimos definidos. | **495** — Redactar y mantener los contenidos del sitio en lenguaje claro, positivo y cercano, evitando tecnicismos, abreviaturas o expresiones confusas, y definiendo las siglas y acrónimos cuando se utilicen. |
| `LC-1.1.3-06` | ¿Los contenidos están escritos en tono positivo indicando lo que se puede hacer… | **496** — Los contenidos del sitio están redactados en lenguaje claro, positivo y cercano, libres de tecnicismos innecesarios y con siglas o acrónimos definidos. | **495** — Redactar y mantener los contenidos del sitio en lenguaje claro, positivo y cercano, evitando tecnicismos, abreviaturas o expresiones confusas, y definiendo las siglas y acrónimos cuando se utilicen. |
| `LC-1.1.4-01` | ¿Los contenidos están actualizados y muestran información vigente al año en cur… | **500** — Cada página del sitio muestra la fuente de autoría y la fecha de actualización de los contenidos. | **499** — Configurar en el CMS campos obligatorios de autoría y fecha de actualización y mostrar estos datos en el sitio. |
| `LC-1.1.5-01` | ¿Son correctas la ortografía —literal, acentual y puntual— y la gramática en lo… | **494** — El sitio publica contenidos redactados en lenguaje claro, sin errores ortográficos ni gramaticales, cumpliendo estándares de calidad en la redacción. | **493** — Corregir y prevenir errores de redacción y ortografía en los contenidos del sitio, aplicando criterios de lenguaje claro en la redacción, e implementar controles editoriales que aseguren la aplicación de estos criterios en las nuevas publicaciones. |
| `LC-1.1.5-02` | ¿Los signos de puntuación empleados facilitan la lectura del documento? | **494** — El sitio publica contenidos redactados en lenguaje claro, sin errores ortográficos ni gramaticales, cumpliendo estándares de calidad en la redacción. | **493** — Corregir y prevenir errores de redacción y ortografía en los contenidos del sitio, aplicando criterios de lenguaje claro en la redacción, e implementar controles editoriales que aseguren la aplicación de estos criterios en las nuevas publicaciones. |
| `LC-1.1.5-03` | ¿Las frases se relacionan entre sí por medio de conectores? Por ejemplo: «A su … | **494** — El sitio publica contenidos redactados en lenguaje claro, sin errores ortográficos ni gramaticales, cumpliendo estándares de calidad en la redacción. | **493** — Corregir y prevenir errores de redacción y ortografía en los contenidos del sitio, aplicando criterios de lenguaje claro en la redacción, e implementar controles editoriales que aseguren la aplicación de estos criterios en las nuevas publicaciones. |
| `LC-1.1.6-01` | ¿El sitio cuenta con información de permisos de uso de sus contenidos en algún … | **502** — El sitio muestra de manera visible las condiciones de uso de sus contenidos. | **501** — Establecer y publicar en el sitio web las condiciones de uso de los contenidos, indicando permisos y restricciones de forma clara y accesible. |
| `LC-1.1.6-02` | ¿Se evita la redifusión de material protegido por derechos de autor sin autoriz… | **502** — El sitio muestra de manera visible las condiciones de uso de sus contenidos. | **501** — Establecer y publicar en el sitio web las condiciones de uso de los contenidos, indicando permisos y restricciones de forma clara y accesible. |
| `LC-1.1.7-01` | Si se mencionan listados de personas, ¿se evita la publicación de sus RUN en el… | **505** — El sitio web evita la publicación de RUN, direcciones y teléfonos personales, e informa de manera clara cómo las personas pueden ejercer sus derechos sobre sus datos. | **503** — Eliminar y prevenir la publicación de RUN, direcciones y teléfonos personales mediante pauta editorial y control previo de contenidos. |
| `LC-1.1.7-02` | ¿El sitio protege la privacidad al no publicar direcciones ni teléfonos particu… | **505** — El sitio web evita la publicación de RUN, direcciones y teléfonos personales, e informa de manera clara cómo las personas pueden ejercer sus derechos sobre sus datos. | **503** — Eliminar y prevenir la publicación de RUN, direcciones y teléfonos personales mediante pauta editorial y control previo de contenidos. |
| `LC-1.1.7-03` | ¿Existe información sobre cómo las personas usuarias pueden ejercer los derecho… | **505** — El sitio web evita la publicación de RUN, direcciones y teléfonos personales, e informa de manera clara cómo las personas pueden ejercer sus derechos sobre sus datos. | **504** — Incorporar una sección que informe cómo ejercer derechos sobre datos personales (acceso, rectificación, eliminación, oposición y bloqueo), conforme a la Ley sobre Protección de la Vida Privada. |
| `LC-1.1.8-01` | Si el sitio publica información sobre menores de edad, ¿se protege la identidad… | **513** — El sitio no publica contenidos que expongan la identidad de menores de edad, incluyan expresiones inadecuadas para ellos ni exhiban información que vulnere la dignidad o vida privada de las personas. | **510** — Revisar y editar los contenidos del sitio para resguardar la identidad de menores de edad en textos e imágenes, e incorporar controles preventivos que impidan publicar información que los exponga. |
| `LC-1.1.8-02` | ¿El contenido es apto para ser leído por menores de edad? | **513** — El sitio no publica contenidos que expongan la identidad de menores de edad, incluyan expresiones inadecuadas para ellos ni exhiban información que vulnere la dignidad o vida privada de las personas. | **511** — Revisar y ajustar los contenidos del sitio para eliminar expresiones inadecuadas o no aptas para menores de edad. |
| `LC-1.1.8-03` | ¿El sitio evita exhibir material que pueda afectar la susceptibilidad de las pe… | **513** — El sitio no publica contenidos que expongan la identidad de menores de edad, incluyan expresiones inadecuadas para ellos ni exhiban información que vulnere la dignidad o vida privada de las personas. | **512** — Revisar y eliminar del sitio los contenidos que exhiban información que pueda menoscabar a las personas (por ejemplo, datos sobre su salud, creencias religiosas, ideología política, vida sexual o características físicas). |
| `LC-1.2.1-01` | ¿Los contenidos están estructurados como respuestas a las preguntas frecuentes … | **498** — El sitio publica contenidos presentados de manera clara y concisa, evitando redundancias y ambigüedades en la información. | **497** — Ajustar los contenidos del sitio para que transmitan la información de manera clara y concisa, eliminando redundancias o ambigüedades. |
| `LC-5.2.1-01` | ¿La información del servicio digital está organizada de manera que responda cla… | **498** — El sitio publica contenidos presentados de manera clara y concisa, evitando redundancias y ambigüedades en la información. | **497** — Ajustar los contenidos del sitio para que transmitan la información de manera clara y concisa, eliminando redundancias o ambigüedades. |
| `LC-1.2.1-02` | ¿Las palabras, frases y conceptos utilizados tienen un lenguaje claro para las … | **498** — El sitio publica contenidos presentados de manera clara y concisa, evitando redundancias y ambigüedades en la información. | **497** — Ajustar los contenidos del sitio para que transmitan la información de manera clara y concisa, eliminando redundancias o ambigüedades. |
| `LC-1.2.1-03` | ¿Predomina el tiempo presente simple y la voz activa de los verbos? | **498** — El sitio publica contenidos presentados de manera clara y concisa, evitando redundancias y ambigüedades en la información. | **497** — Ajustar los contenidos del sitio para que transmitan la información de manera clara y concisa, eliminando redundancias o ambigüedades. |
| `LC-1.2.1-04` | ¿Las oraciones están ordenadas según la forma sujeto-verbo-predicado? | **498** — El sitio publica contenidos presentados de manera clara y concisa, evitando redundancias y ambigüedades en la información. | **497** — Ajustar los contenidos del sitio para que transmitan la información de manera clara y concisa, eliminando redundancias o ambigüedades. |
| `LC-1.2.1-05` | Cuando se listan requisitos en contenidos referidos a servicios a la ciudadanía… | **498** — El sitio publica contenidos presentados de manera clara y concisa, evitando redundancias y ambigüedades en la información. | **497** — Ajustar los contenidos del sitio para que transmitan la información de manera clara y concisa, eliminando redundancias o ambigüedades. |
| `LC-1.2.2-01` | ¿Los textos son breves y utilizan frases cortas en su redacción (al menos 2 y c… | **498** — El sitio publica contenidos presentados de manera clara y concisa, evitando redundancias y ambigüedades en la información. | **497** — Ajustar los contenidos del sitio para que transmitan la información de manera clara y concisa, eliminando redundancias o ambigüedades. |
| `LC-5.2.2-01` | ¿Los textos, tanto de la página de inicio como del desarrollo del trámite, son … | **498** — El sitio publica contenidos presentados de manera clara y concisa, evitando redundancias y ambigüedades en la información. | **497** — Ajustar los contenidos del sitio para que transmitan la información de manera clara y concisa, eliminando redundancias o ambigüedades. |
| `LC-1.2.2-02` | Al revisar el sitio web en versión de escritorio, ¿los párrafos son cortos, con… | **498** — El sitio publica contenidos presentados de manera clara y concisa, evitando redundancias y ambigüedades en la información. | **497** — Ajustar los contenidos del sitio para que transmitan la información de manera clara y concisa, eliminando redundancias o ambigüedades. |
| `LC-1.2.2-03` | ¿Se explica una idea por párrafo? | **498** — El sitio publica contenidos presentados de manera clara y concisa, evitando redundancias y ambigüedades en la información. | **497** — Ajustar los contenidos del sitio para que transmitan la información de manera clara y concisa, eliminando redundancias o ambigüedades. |
| `LC-1.2.2-04` | ¿Las oraciones son simples y directas, evitando el exceso de palabras? | **498** — El sitio publica contenidos presentados de manera clara y concisa, evitando redundancias y ambigüedades en la información. | **497** — Ajustar los contenidos del sitio para que transmitan la información de manera clara y concisa, eliminando redundancias o ambigüedades. |
| `LC-1.2.2-05` | Si existe un texto extenso —de cuatro o más párrafos—, ¿hay un resumen al inici… | **498** — El sitio publica contenidos presentados de manera clara y concisa, evitando redundancias y ambigüedades en la información. | **497** — Ajustar los contenidos del sitio para que transmitan la información de manera clara y concisa, eliminando redundancias o ambigüedades. |
| `LC-1.2.3-01` | ¿Hay espacio entre los párrafos? | **507** — El sitio web presenta textos alineados a la izquierda y párrafos con espaciado. | **506** — Asegurarse que los textos se publiquen alineados a la izquierda y con espaciado entre párrafos. |
| `LC-1.2.3-02` | ¿El texto está alineado a la izquierda? | **507** — El sitio web presenta textos alineados a la izquierda y párrafos con espaciado. | **506** — Asegurarse que los textos se publiquen alineados a la izquierda y con espaciado entre párrafos. |
| `LC-1.2.3-03` | ¿Se utilizan listas numeradas, viñetas o tablas para presentar la información m… | **507** — El sitio web presenta textos alineados a la izquierda y párrafos con espaciado. | **506** — Asegurarse que los textos se publiquen alineados a la izquierda y con espaciado entre párrafos. |
| `LC-1.2.4-01` | ¿Los contenidos del sitio aplican el modelo de «pirámide invertida» que los est… | **509** — Todos los documentos enlazados en el sitio web muestran título, formato, peso y una breve descripción. | **508** — Configurar en el CMS campos obligatorios para título, formato, peso y descripción de cada documento, y corregir los enlaces existentes que no incluyan esta información. |
| `LC-1.2.4-02` | ¿Las páginas están bien organizadas, con títulos claros y subtítulos que facili… | **509** — Todos los documentos enlazados en el sitio web muestran título, formato, peso y una breve descripción. | **508** — Configurar en el CMS campos obligatorios para título, formato, peso y descripción de cada documento, y corregir los enlaces existentes que no incluyan esta información. |
| `LC-1.2.4-03` | ¿Es fácil escanear visualmente los contenidos? | **509** — Todos los documentos enlazados en el sitio web muestran título, formato, peso y una breve descripción. | **508** — Configurar en el CMS campos obligatorios para título, formato, peso y descripción de cada documento, y corregir los enlaces existentes que no incluyan esta información. |
| `LC-1.2.4-04` | ¿Se utilizan negritas para destacar palabras clave de cada párrafo? | **509** — Todos los documentos enlazados en el sitio web muestran título, formato, peso y una breve descripción. | **508** — Configurar en el CMS campos obligatorios para título, formato, peso y descripción de cada documento, y corregir los enlaces existentes que no incluyan esta información. |
| `LC-1.2.4-05` | ¿Se evitan las frases escritas únicamente en mayúsculas? | **509** — Todos los documentos enlazados en el sitio web muestran título, formato, peso y una breve descripción. | **508** — Configurar en el CMS campos obligatorios para título, formato, peso y descripción de cada documento, y corregir los enlaces existentes que no incluyan esta información. |
| `LC-1.2.4-06` | ¿Se vinculan contenidos del mismo sitio a través de enlaces relacionados? | **509** — Todos los documentos enlazados en el sitio web muestran título, formato, peso y una breve descripción. | **508** — Configurar en el CMS campos obligatorios para título, formato, peso y descripción de cada documento, y corregir los enlaces existentes que no incluyan esta información. |
| `LC-5.2.4-01` | ¿Los textos de los enlaces (rótulos) son descriptivos del contenido o sitio al … | **509** — Todos los documentos enlazados en el sitio web muestran título, formato, peso y una breve descripción. | **508** — Configurar en el CMS campos obligatorios para título, formato, peso y descripción de cada documento, y corregir los enlaces existentes que no incluyan esta información. |
| `LC-1.2.4-07` | Cuando se enlazan documentos, ¿se especifican el título, formato y peso? Por ej… | **509** — Todos los documentos enlazados en el sitio web muestran título, formato, peso y una breve descripción. | **508** — Configurar en el CMS campos obligatorios para título, formato, peso y descripción de cada documento, y corregir los enlaces existentes que no incluyan esta información. |
| `LC-1.2.4-08` | ¿Se entrega una breve descripción de los documentos enlazados para mejorar su c… | **509** — Todos los documentos enlazados en el sitio web muestran título, formato, peso y una breve descripción. | **508** — Configurar en el CMS campos obligatorios para título, formato, peso y descripción de cada documento, y corregir los enlaces existentes que no incluyan esta información. |
| `LC-1.3.1-01` | ¿Se utilizan apoyos visuales como íconos, imágenes, gráficos o infografías para… | **515** — El sitio web presenta sus datos acompañados de apoyos visuales. | **514** — Incorporar apoyos visuales como íconos, imágenes, gráficos o infografías para presentar los datos publicados en el sitio web. |
| `LC-1.3.2-01` | ¿Los contenidos tienen información objetiva y presentan una redacción neutra, s… | **517** — Los contenidos publicados del sitio web están redactados de forma objetiva y neutra. | **516** — Reescribir contenidos para asegurar redacción objetiva y neutra, privilegiando datos y hechos por sobre opiniones o adjetivos calificativos. |
| `LC-1.3.2-02` | ¿En al menos un 80% de los contenidos se privilegia exponer datos y hechos por … | **517** — Los contenidos publicados del sitio web están redactados de forma objetiva y neutra. | **516** — Reescribir contenidos para asegurar redacción objetiva y neutra, privilegiando datos y hechos por sobre opiniones o adjetivos calificativos. |
| `LC-1.3.3-01` | Si el sitio presenta versiones anteriores de contenidos, ¿están rotuladas clara… | **519** — El sitio web presenta las versiones anteriores de contenidos rotuladas como documentos de archivo no vigentes. | **518** — Rotular las versiones anteriores de contenidos como documentos de archivo no vigentes, indicando claramente el año o periodo al que corresponden. |

**Resumen por indicador:**

| Criterios | Hito PTD | Tarea PTD |
| --- | --- | --- |
| Fiabilidad `LC-1.1.1-*` | **500** — Cada página del sitio muestra la fuente de autoría y la fecha de actualización de los contenidos. | **499** — Configurar en el CMS campos obligatorios de autoría y fecha de actualización y mostrar estos datos en el sitio. |
| Completitud `LC-1.1.2-*` | **498** — El sitio publica contenidos presentados de manera clara y concisa, evitando redundancias y ambigüedades en la información. | **497** — Ajustar los contenidos del sitio para que transmitan la información de manera clara y concisa, eliminando redundancias o ambigüedades. |
| Lenguaje plano `LC-1.1.3-*` | **496** — Los contenidos del sitio están redactados en lenguaje claro, positivo y cercano, libres de tecnicismos innecesarios y con siglas o acrónimos definidos. | **495** — Redactar y mantener los contenidos del sitio en lenguaje claro, positivo y cercano, evitando tecnicismos, abreviaturas o expresiones confusas, y definiendo las siglas y acrónimos cuando se utilicen. |
| Actualización `LC-1.1.4-*` | **500** — Cada página del sitio muestra la fuente de autoría y la fecha de actualización de los contenidos. | **499** — Configurar en el CMS campos obligatorios de autoría y fecha de actualización y mostrar estos datos en el sitio. |
| Redacción y ortografía `LC-1.1.5-*` | **494** — El sitio publica contenidos redactados en lenguaje claro, sin errores ortográficos ni gramaticales, cumpliendo estándares de calidad en la redacción. | **493** — Corregir y prevenir errores de redacción y ortografía en los contenidos del sitio, aplicando criterios de lenguaje claro en la redacción, e implementar controles editoriales que aseguren la aplicación de estos criterios en las nuevas publicaciones. |
| Propiedad intelectual `LC-1.1.6-*` | **502** — El sitio muestra de manera visible las condiciones de uso de sus contenidos. | **501** — Establecer y publicar en el sitio web las condiciones de uso de los contenidos, indicando permisos y restricciones de forma clara y accesible. |
| Privacidad `LC-1.1.7-01/02` → **503**; `LC-1.1.7-03` ARCO → **504** | **505** — El sitio web evita la publicación de RUN, direcciones y teléfonos personales, e informa de manera clara cómo las personas pueden ejercer sus derechos sobre sus datos. | RUN/tel: **503** — Eliminar y prevenir la publicación de RUN, direcciones y teléfonos personales mediante pauta editorial y control previo de contenidos.<br>ARCO: **504** — Incorporar una sección que informe cómo ejercer derechos sobre datos personales (acceso, rectificación, eliminación, oposición y bloqueo), conforme a la Ley sobre Protección de la Vida Privada. |
| Contenidos sensibles `LC-1.1.8-01`→**510**; `-02`→**511**; `-03`→**512** | **513** — El sitio no publica contenidos que expongan la identidad de menores de edad, incluyan expresiones inadecuadas para ellos ni exhiban información que vulnere la dignidad o vida privada de las personas. | **510** — Revisar y editar los contenidos del sitio para resguardar la identidad de menores de edad en textos e imágenes, e incorporar controles preventivos que impidan publicar información que los exponga.<br>**511** — Revisar y ajustar los contenidos del sitio para eliminar expresiones inadecuadas o no aptas para menores de edad.<br>**512** — Revisar y eliminar del sitio los contenidos que exhiban información que pueda menoscabar a las personas (por ejemplo, datos sobre su salud, creencias religiosas, ideología política, vida sexual o características físicas). |
| Claridad `LC-1.2.1-*` / `LC-5.2.1-01` | **498** — El sitio publica contenidos presentados de manera clara y concisa, evitando redundancias y ambigüedades en la información. | **497** — Ajustar los contenidos del sitio para que transmitan la información de manera clara y concisa, eliminando redundancias o ambigüedades. |
| Concisión `LC-1.2.2-*` / `LC-5.2.2-01` | **498** — El sitio publica contenidos presentados de manera clara y concisa, evitando redundancias y ambigüedades en la información. | **497** — Ajustar los contenidos del sitio para que transmitan la información de manera clara y concisa, eliminando redundancias o ambigüedades. |
| Legibilidad `LC-1.2.3-*` | **507** — El sitio web presenta textos alineados a la izquierda y párrafos con espaciado. | **506** — Asegurarse que los textos se publiquen alineados a la izquierda y con espaciado entre párrafos. |
| Escritura web `LC-1.2.4-*` / `LC-5.2.4-01` | **509** — Todos los documentos enlazados en el sitio web muestran título, formato, peso y una breve descripción. | **508** — Configurar en el CMS campos obligatorios para título, formato, peso y descripción de cada documento, y corregir los enlaces existentes que no incluyan esta información. |
| Visualización `LC-1.3.1-01` | **515** — El sitio web presenta sus datos acompañados de apoyos visuales. | **514** — Incorporar apoyos visuales como íconos, imágenes, gráficos o infografías para presentar los datos publicados en el sitio web. |
| Objetividad `LC-1.3.2-*` | **517** — Los contenidos publicados del sitio web están redactados de forma objetiva y neutra. | **516** — Reescribir contenidos para asegurar redacción objetiva y neutra, privilegiando datos y hechos por sobre opiniones o adjetivos calificativos. |
| Archivo `LC-1.3.3-01` | **519** — El sitio web presenta las versiones anteriores de contenidos rotuladas como documentos de archivo no vigentes. | **518** — Rotular las versiones anteriores de contenidos como documentos de archivo no vigentes, indicando claramente el año o periodo al que corresponden. |

**Instrumentos SGD (SISIB / Secretaría de Gobierno Digital, 2024):**

| Código | Documento | Dimensiones |
| --- | --- | --- |
| **IEW** | *Instrumento de evaluación de calidad para sitios web* | LC = **§1** (15 indicadores) · Usabilidad = **§2** · Seguridad = **§8** |
| **IESD** | *Instrumento de evaluación de calidad para servicios digitales transaccionales* | Usabilidad = **§1** · LC = **§5** (13 indicadores) · Seguridad = **§7** |

## Para qué sirve este documento

1. Listar **todas las preguntas de chequeo** de Lenguaje claro, Usabilidad y Seguridad en **ambos** instrumentos.
2. Decir a jefatura / Equipo UX / TIC qué evalúa Claude Code hoy (LC → **51** criterios por indicadores) y qué queda fuera del % §17.
3. Mostrar el **Hito / Tarea PTD** de entrega por cada criterio `LC-*` (columnas del Excel/UI/PDF).
4. Complementar el Word/JSON cuando haga falta el detalle IEW↔IESD.

## Compromiso institucional vs motor

| Dimensión | Proyecto PTD | Preguntas únicas IEW/IESD | Año | ¿En el motor §17 hoy? |
| --- | --- | --- | --- | --- |
| Contenido y lenguaje claro | PTD-D2.1-CL1 | **51** (38 ambos · 10 IEW · 3 IESD) | **2026** (META MEI) | **Sí** — 51 filas `LC-*` |
| Usabilidad | PTD-D2.1-US2 | **18** (16 ambos · 1 IEW · 1 IESD) | post-Excel LC / 2027 | **No** |
| Seguridad | PTD-D2.1-SE8 | **10** (9 ambos · 1 IEW) | cierre año / 2028 | **No** (salvo solape ARCO / LC-1.1.7-03) |
| **Total** | — | **79** (65 · 10 · 4) | — | — |

*Nota:* la columna «Motor» con códigos A–H en tablas de detalle es **referencia histórica**. El id vigente es el del catálogo `checklist-criteria-lc-ptd.json` (`LC-*`).

El Excel MEI usa **5 categorías de presentación** derivadas de `estado` + `severidad` del motor LC (**51** filas `LC-*` en auditorías v3.0). Eso **no** implica evaluación automática de Usabilidad/Seguridad.

## Cómo leer las tablas

- **IEW `n.n.n`** = sitios web · **IESD `n.n.n`** = servicios digitales / trámites.
- Columna **Id:** criterio máquina `LC-*` (v3.0). Variantes solo IESD: `LC-5.2.x-01`.
- Columnas **Hito** / **Tarea:** anclaje PTD en entrega (UI/Excel/PDF); ver tabla completa arriba.
- Columna **Motor:** id A1–H1 si la pregunta refuerza el checklist v2.1 histórico; `—` si está fuera.
- Preguntas casi idénticas en ambos instrumentos se listan **una vez** con códigos duales (`IEW 1.1.1` / `IESD 5.1.1`). Si difieren, se anota la variante.
- «No aplica» del instrumento: solo cuando el propio chequeo lo permite; en JSON canónico, `no_aplica` exige `comentario` (§20.4 / §22.8).

---

# A. Contenido y lenguaje claro

- **IEW:** dimensión **1**  
- **IESD:** dimensión **5**

## A.1 Imprescindibles

### Fiabilidad — IEW `1.1.1` / IESD `5.1.1` → **E2**

- **Hito:** **500** — Cada página del sitio muestra la fuente de autoría y la fecha de actualización de los contenidos.
- **Tarea:** **499** — Configurar en el CMS campos obligatorios de autoría y fecha de actualización y mostrar estos datos en el sitio.

| # | Id | Pregunta de chequeo | Instrumento | Hito | Tarea |
| --- | --- | --- | --- | --- | --- |
| 1 | `LC-1.1.1-01` | ¿Es fácil reconocer la fuente o autoría de la información publicada? (p. ej. nombre de la institución en encabezado o pie; firma de unidad; «Fuente: …») | Ambos (IESD resume el ejemplo al encabezado/pie) | **500** — Cada página del sitio muestra la fuente de autoría y la fecha de actualización de los contenidos. | **499** — Configurar en el CMS campos obligatorios de autoría y fecha de actualización y mostrar estos datos en el sitio. |

### Completitud — IEW `1.1.2` / IESD `5.1.2` → **A5–A8** (+ **E4**)

- **Hito:** **498** — El sitio publica contenidos presentados de manera clara y concisa, evitando redundancias y ambigüedades en la información.
- **Tarea:** **497** — Ajustar los contenidos del sitio para que transmitan la información de manera clara y concisa, eliminando redundancias o ambigüedades.
- **Nota:** el Hito meta **492**/Tarea **491** ya no figura en el Checklist Editorial Word ni en UI/PDF/Excel.

| # | Id | Pregunta de chequeo | Instrumento | Hito | Tarea | Motor |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `LC-1.1.2-01` | ¿Los contenidos representan de manera fiel lo enunciado en su título? | Ambos | **498** — El sitio publica contenidos presentados de manera clara y concisa, evitando redundancias y ambigüedades en la información. | **497** — Ajustar los contenidos del sitio para que transmitan la información de manera clara y concisa, eliminando redundancias o ambigüedades. | **E4**, refuerzo A |
| 2 | `LC-1.1.2-02` | ¿Se cumple con la recomendación de no incluir páginas sin contenido, contenido incompleto o «En construcción»? | Ambos | **498** — El sitio publica contenidos presentados de manera clara y concisa, evitando redundancias y ambigüedades en la información. | **497** — Ajustar los contenidos del sitio para que transmitan la información de manera clara y concisa, eliminando redundancias o ambigüedades. | **A6** |
| 3 | `LC-1.1.2-03` | ¿El texto destaca los datos clave de la información? (qué, cómo, dónde, cuándo y para quién, o recuadro con fechas importantes) | Ambos | **498** — El sitio publica contenidos presentados de manera clara y concisa, evitando redundancias y ambigüedades en la información. | **497** — Ajustar los contenidos del sitio para que transmitan la información de manera clara y concisa, eliminando redundancias o ambigüedades. | **A7** (realismo §22.9: cuerpo/recuadros, no labels de menú) |
| 4 | `LC-1.1.2-04` | En textos referidos a trámites, ¿se brinda información suficiente para que las personas usuarias puedan realizarlos autónomamente? («No aplica» si no hay textos de trámites) | Ambos | **498** — El sitio publica contenidos presentados de manera clara y concisa, evitando redundancias y ambigüedades en la información. | **497** — Ajustar los contenidos del sitio para que transmitan la información de manera clara y concisa, eliminando redundancias o ambigüedades. | **A8** (`no_aplica` en sitioweb informativo) |

### Lenguaje plano — IEW `1.1.3` / IESD `5.1.3` → **B1–B8**

- **Hito:** **496** — Los contenidos del sitio están redactados en lenguaje claro, positivo y cercano, libres de tecnicismos innecesarios y con siglas o acrónimos definidos.
- **Tarea:** **495** — Redactar y mantener los contenidos del sitio en lenguaje claro, positivo y cercano, evitando tecnicismos, abreviaturas o expresiones confusas, y definiendo las siglas y acrónimos cuando se utilicen.

| # | Id | Pregunta de chequeo | Instrumento | Hito | Tarea | Motor |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `LC-1.1.3-01` | ¿El lenguaje está orientado a que una persona pueda entender el contenido, aun con mayor dificultad de comprensión lectora? (p. ej. Legible: ≥3/5 indicadores «Normal») | Ambos | **496** — Los contenidos del sitio están redactados en lenguaje claro, positivo y cercano, libres de tecnicismos innecesarios y con siglas o acrónimos definidos. | **495** — Redactar y mantener los contenidos del sitio en lenguaje claro, positivo y cercano, evitando tecnicismos, abreviaturas o expresiones confusas, y definiendo las siglas y acrónimos cuando se utilicen. | **B8** |
| 2 | `LC-1.1.3-02` | ¿El tono y voz son amables, respetuosos y cercanos con las personas usuarias? | Ambos | **496** — Los contenidos del sitio están redactados en lenguaje claro, positivo y cercano, libres de tecnicismos innecesarios y con siglas o acrónimos definidos. | **495** — Redactar y mantener los contenidos del sitio en lenguaje claro, positivo y cercano, evitando tecnicismos, abreviaturas o expresiones confusas, y definiendo las siglas y acrónimos cuando se utilicen. | **B6** |
| 3 | `LC-1.1.3-03` | ¿La redacción prescinde de la jerga técnica o legal? (equivalentes claros; evitar solo «Ley N°…» sin tema) | Ambos | **496** — Los contenidos del sitio están redactados en lenguaje claro, positivo y cercano, libres de tecnicismos innecesarios y con siglas o acrónimos definidos. | **495** — Redactar y mantener los contenidos del sitio en lenguaje claro, positivo y cercano, evitando tecnicismos, abreviaturas o expresiones confusas, y definiendo las siglas y acrónimos cuando se utilicen. | **B2**, **B7** |
| 4 | `LC-1.1.3-04` | ¿Se evitan abreviaturas, extranjerismos, eufemismos, modismos o términos rebuscados en al menos un 50% de los contenidos revisados? | Ambos | **496** — Los contenidos del sitio están redactados en lenguaje claro, positivo y cercano, libres de tecnicismos innecesarios y con siglas o acrónimos definidos. | **495** — Redactar y mantener los contenidos del sitio en lenguaje claro, positivo y cercano, evitando tecnicismos, abreviaturas o expresiones confusas, y definiendo las siglas y acrónimos cuando se utilicen. | **B4** |
| 5 | `LC-1.1.3-05` | ¿Se define cada sigla y acrónimo y se emplean solo si es necesario? («No aplica» si no hay siglas) | Ambos | **496** — Los contenidos del sitio están redactados en lenguaje claro, positivo y cercano, libres de tecnicismos innecesarios y con siglas o acrónimos definidos. | **495** — Redactar y mantener los contenidos del sitio en lenguaje claro, positivo y cercano, evitando tecnicismos, abreviaturas o expresiones confusas, y definiendo las siglas y acrónimos cuando se utilicen. | **B3** (en menú: propuestas sutiles §22.9) |
| 6 | `LC-1.1.3-06` | ¿Los contenidos están escritos en tono positivo (qué se puede hacer), evitando enfocar desde el «no se puede»? | Ambos | **496** — Los contenidos del sitio están redactados en lenguaje claro, positivo y cercano, libres de tecnicismos innecesarios y con siglas o acrónimos definidos. | **495** — Redactar y mantener los contenidos del sitio en lenguaje claro, positivo y cercano, evitando tecnicismos, abreviaturas o expresiones confusas, y definiendo las siglas y acrónimos cuando se utilicen. | **B5** |

### Actualización — IEW `1.1.4` / IESD `5.1.4` → **E3**

- **Hito:** **500** — Cada página del sitio muestra la fuente de autoría y la fecha de actualización de los contenidos.
- **Tarea:** **499** — Configurar en el CMS campos obligatorios de autoría y fecha de actualización y mostrar estos datos en el sitio.

| # | Id | Pregunta de chequeo | Instrumento | Hito | Tarea |
| --- | --- | --- | --- | --- | --- |
| 1 | `LC-1.1.4-01` | ¿Los contenidos están actualizados y muestran información vigente al año en curso? (fecha de publicación o última actualización expresa) | Ambos | **500** — Cada página del sitio muestra la fuente de autoría y la fecha de actualización de los contenidos. | **499** — Configurar en el CMS campos obligatorios de autoría y fecha de actualización y mostrar estos datos en el sitio. |

*Nota:* el © del pie **no** sustituye fecha de actualización (§22.11).

### Redacción y ortografía — IEW `1.1.5` / IESD `5.1.5` → **D1, D2**

- **Hito:** **494** — El sitio publica contenidos redactados en lenguaje claro, sin errores ortográficos ni gramaticales, cumpliendo estándares de calidad en la redacción.
- **Tarea:** **493** — Corregir y prevenir errores de redacción y ortografía en los contenidos del sitio, aplicando criterios de lenguaje claro en la redacción, e implementar controles editoriales que aseguren la aplicación de estos criterios en las nuevas publicaciones.

| # | Id | Pregunta de chequeo | Instrumento | Hito | Tarea | Motor |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `LC-1.1.5-01` | ¿Son correctas la ortografía (literal, acentual y puntual) y la gramática? (corrector: Word, Docs, LanguageTool; >1 error → no cumple) | Ambos | **494** — El sitio publica contenidos redactados en lenguaje claro, sin errores ortográficos ni gramaticales, cumpliendo estándares de calidad en la redacción. | **493** — Corregir y prevenir errores de redacción y ortografía en los contenidos del sitio, aplicando criterios de lenguaje claro en la redacción, e implementar controles editoriales que aseguren la aplicación de estos criterios en las nuevas publicaciones. | **D1** |
| 2 | `LC-1.1.5-02` | ¿Los signos de puntuación facilitan la lectura? (privilegiar puntos seguidos frente a comas encadenadas) | Ambos | **494** — El sitio publica contenidos redactados en lenguaje claro, sin errores ortográficos ni gramaticales, cumpliendo estándares de calidad en la redacción. | **493** — Corregir y prevenir errores de redacción y ortografía en los contenidos del sitio, aplicando criterios de lenguaje claro en la redacción, e implementar controles editoriales que aseguren la aplicación de estos criterios en las nuevas publicaciones. | **D2** |
| 3 | `LC-1.1.5-03` | ¿Las frases se relacionan entre sí por medio de conectores? (p. ej. «A su vez,», «Sin embargo,») | **Solo IEW** | **494** — El sitio publica contenidos redactados en lenguaje claro, sin errores ortográficos ni gramaticales, cumpliendo estándares de calidad en la redacción. | **493** — Corregir y prevenir errores de redacción y ortografía en los contenidos del sitio, aplicando criterios de lenguaje claro en la redacción, e implementar controles editoriales que aseguren la aplicación de estos criterios en las nuevas publicaciones. | Refuerzo D2 / redacción C |

### Propiedad intelectual — IEW `1.1.6` / IESD `5.1.6` → **G3**

- **Hito:** **502** — El sitio muestra de manera visible las condiciones de uso de sus contenidos.
- **Tarea:** **501** — Establecer y publicar en el sitio web las condiciones de uso de los contenidos, indicando permisos y restricciones de forma clara y accesible.

| # | Id | Pregunta de chequeo | Instrumento | Hito | Tarea |
| --- | --- | --- | --- | --- | --- |
| 1 | `LC-1.1.6-01` | ¿El sitio cuenta con información de permisos de uso de sus contenidos? (copyright / Creative Commons / condiciones de uso) | Ambos | **502** — El sitio muestra de manera visible las condiciones de uso de sus contenidos. | **501** — Establecer y publicar en el sitio web las condiciones de uso de los contenidos, indicando permisos y restricciones de forma clara y accesible. |
| 2 | `LC-1.1.6-02` | ¿Se evita la redifusión de material protegido por derechos de autor sin autorización? | **Solo IEW** | **502** — El sitio muestra de manera visible las condiciones de uso de sus contenidos. | **501** — Establecer y publicar en el sitio web las condiciones de uso de los contenidos, indicando permisos y restricciones de forma clara y accesible. |

### Privacidad y datos personales — IEW `1.1.7` / IESD `5.1.7` → **G1, G2**

- **Hito:** **505** — El sitio web evita la publicación de RUN, direcciones y teléfonos personales, e informa de manera clara cómo las personas pueden ejercer sus derechos sobre sus datos.
- **Tarea 503 (RUN / teléfonos):** **503** — Eliminar y prevenir la publicación de RUN, direcciones y teléfonos personales mediante pauta editorial y control previo de contenidos.
- **Tarea 504 (solo ARCO):** **504** — Incorporar una sección que informe cómo ejercer derechos sobre datos personales (acceso, rectificación, eliminación, oposición y bloqueo), conforme a la Ley sobre Protección de la Vida Privada.

| # | Id | Pregunta de chequeo | Instrumento | Hito | Tarea | Motor |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `LC-1.1.7-01` | Si hay listados de personas, ¿se evita publicar sus RUN? («No aplica» si no hay listados) | **Solo IEW** | **505** — El sitio web evita la publicación de RUN, direcciones y teléfonos personales, e informa de manera clara cómo las personas pueden ejercer sus derechos sobre sus datos. | **503** — Eliminar y prevenir la publicación de RUN, direcciones y teléfonos personales mediante pauta editorial y control previo de contenidos. | **G1** |
| 2 | `LC-1.1.7-02` | ¿El sitio protege la privacidad al no publicar direcciones ni teléfonos particulares? | **Solo IEW** | **505** — El sitio web evita la publicación de RUN, direcciones y teléfonos personales, e informa de manera clara cómo las personas pueden ejercer sus derechos sobre sus datos. | **503** — Eliminar y prevenir la publicación de RUN, direcciones y teléfonos personales mediante pauta editorial y control previo de contenidos. | **G1** |
| 3 | `LC-1.1.7-03` | ¿Existe información sobre cómo ejercer derechos ARCO (acceso, rectificación, cancelación/eliminación, oposición, bloqueo)? | Ambos | **505** — El sitio web evita la publicación de RUN, direcciones y teléfonos personales, e informa de manera clara cómo las personas pueden ejercer sus derechos sobre sus datos. | **504** — Incorporar una sección que informe cómo ejercer derechos sobre datos personales (acceso, rectificación, eliminación, oposición y bloqueo), conforme a la Ley sobre Protección de la Vida Privada. | **G2** |

### Contenidos sensibles — IEW `1.1.8`

- **Hito:** **513** — El sitio no publica contenidos que expongan la identidad de menores de edad, incluyan expresiones inadecuadas para ellos ni exhiban información que vulnere la dignidad o vida privada de las personas.
- **Tarea 510:** **510** — Revisar y editar los contenidos del sitio para resguardar la identidad de menores de edad en textos e imágenes, e incorporar controles preventivos que impidan publicar información que los exponga. — pregunta identidad de menores
- **Tarea 511:** **511** — Revisar y ajustar los contenidos del sitio para eliminar expresiones inadecuadas o no aptas para menores de edad. — pregunta aptitud para menores
- **Tarea 512:** **512** — Revisar y eliminar del sitio los contenidos que exhiban información que pueda menoscabar a las personas (por ejemplo, datos sobre su salud, creencias religiosas, ideología política, vida sexual o características físicas). — pregunta susceptibilidad / dignidad

| # | Id | Pregunta de chequeo | Instrumento | Hito | Tarea | Motor |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `LC-1.1.8-01` | Si publica información sobre menores, ¿se protege su identidad en textos y fotografías? («No aplica» si no hay menores) | **Solo IEW** | **513** — El sitio no publica contenidos que expongan la identidad de menores de edad, incluyan expresiones inadecuadas para ellos ni exhiban información que vulnere la dignidad o vida privada de las personas. | **510** — Revisar y editar los contenidos del sitio para resguardar la identidad de menores de edad en textos e imágenes, e incorporar controles preventivos que impidan publicar información que los exponga. | Anotar en `nota_final_tic` si aparece |
| 2 | `LC-1.1.8-02` | ¿El contenido es apto para ser leído por menores de edad? | **Solo IEW** | **513** — El sitio no publica contenidos que expongan la identidad de menores de edad, incluyan expresiones inadecuadas para ellos ni exhiban información que vulnere la dignidad o vida privada de las personas. | **511** — Revisar y ajustar los contenidos del sitio para eliminar expresiones inadecuadas o no aptas para menores de edad. | Idem |
| 3 | `LC-1.1.8-03` | ¿Se evita material que afecte la susceptibilidad o menoscabe a las personas? (Ley 19.628) | **Solo IEW** | **513** — El sitio no publica contenidos que expongan la identidad de menores de edad, incluyan expresiones inadecuadas para ellos ni exhiban información que vulnere la dignidad o vida privada de las personas. | **512** — Revisar y eliminar del sitio los contenidos que exhiban información que pueda menoscabar a las personas (por ejemplo, datos sobre su salud, creencias religiosas, ideología política, vida sexual o características físicas). | Idem |

*IESD §5 no incluye este indicador en imprescindibles.*

## A.2 Esperables

### Claridad — IEW `1.2.1` / IESD `5.2.1` → **C8, B1, C1–C4, C7**

- **Hito:** **498** — El sitio publica contenidos presentados de manera clara y concisa, evitando redundancias y ambigüedades en la información.
- **Tarea:** **497** — Ajustar los contenidos del sitio para que transmitan la información de manera clara y concisa, eliminando redundancias o ambigüedades.

| # | Id | Pregunta de chequeo | Instrumento | Hito | Tarea | Motor |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `LC-1.2.1-01` | ¿Los contenidos están estructurados como respuestas a preguntas frecuentes de las personas usuarias? | Ambos | **498** — El sitio publica contenidos presentados de manera clara y concisa, evitando redundancias y ambigüedades en la información. | **497** — Ajustar los contenidos del sitio para que transmitan la información de manera clara y concisa, eliminando redundancias o ambigüedades. | **C8** |
| — | `LC-5.2.1-01` | *(IESD)* ¿La información del servicio digital está organizada de manera que responda claramente a las preguntas frecuentes…? | **Solo IESD** (variante) | **498** — El sitio publica contenidos presentados de manera clara y concisa, evitando redundancias y ambigüedades en la información. | **497** — Ajustar los contenidos del sitio para que transmitan la información de manera clara y concisa, eliminando redundancias o ambigüedades. | Variante trámite |
| 2 | `LC-1.2.1-02` | ¿Las palabras, frases y conceptos tienen un lenguaje claro para las personas usuarias? | Ambos | **498** — El sitio publica contenidos presentados de manera clara y concisa, evitando redundancias y ambigüedades en la información. | **497** — Ajustar los contenidos del sitio para que transmitan la información de manera clara y concisa, eliminando redundancias o ambigüedades. | **B2** / claridad general |
| 3 | `LC-1.2.1-03` | ¿Predomina el tiempo presente simple y la voz activa? | Ambos | **498** — El sitio publica contenidos presentados de manera clara y concisa, evitando redundancias y ambigüedades en la información. | **497** — Ajustar los contenidos del sitio para que transmitan la información de manera clara y concisa, eliminando redundancias o ambigüedades. | **B1**, **C2** |
| 4 | `LC-1.2.1-04` | ¿Las oraciones siguen sujeto-verbo-predicado? | Ambos | **498** — El sitio publica contenidos presentados de manera clara y concisa, evitando redundancias y ambigüedades en la información. | **497** — Ajustar los contenidos del sitio para que transmitan la información de manera clara y concisa, eliminando redundancias o ambigüedades. | **C1** |
| 5 | `LC-1.2.1-05` | Cuando se listan requisitos de servicios a la ciudadanía, ¿se usa modo infinitivo? («No aplica» si no hay listas de requisitos) | Ambos | **498** — El sitio publica contenidos presentados de manera clara y concisa, evitando redundancias y ambigüedades en la información. | **497** — Ajustar los contenidos del sitio para que transmitan la información de manera clara y concisa, eliminando redundancias o ambigüedades. | **C7** |

### Concisión — IEW `1.2.2` / IESD `5.2.2` → **C3–C6, C9**

- **Hito:** **498** — El sitio publica contenidos presentados de manera clara y concisa, evitando redundancias y ambigüedades en la información.
- **Tarea:** **497** — Ajustar los contenidos del sitio para que transmitan la información de manera clara y concisa, eliminando redundancias o ambigüedades.

| # | Id | Pregunta de chequeo | Instrumento | Hito | Tarea | Motor |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `LC-1.2.2-01` | ¿Los textos son breves y usan frases cortas? (IEW: p. ej. 2–8 párrafos por página) | Ambos | **498** — El sitio publica contenidos presentados de manera clara y concisa, evitando redundancias y ambigüedades en la información. | **497** — Ajustar los contenidos del sitio para que transmitan la información de manera clara y concisa, eliminando redundancias o ambigüedades. | **C9** / concisión |
| — | `LC-5.2.2-01` | *(IESD)* ¿Los textos, tanto de la página de inicio como del desarrollo del trámite, son breves…? | **Solo IESD** (variante) | **498** — El sitio publica contenidos presentados de manera clara y concisa, evitando redundancias y ambigüedades en la información. | **497** — Ajustar los contenidos del sitio para que transmitan la información de manera clara y concisa, eliminando redundancias o ambigüedades. | Variante trámite |
| 2 | `LC-1.2.2-02` | En escritorio, ¿los párrafos tienen menos de 8 líneas? | Ambos | **498** — El sitio publica contenidos presentados de manera clara y concisa, evitando redundancias y ambigüedades en la información. | **497** — Ajustar los contenidos del sitio para que transmitan la información de manera clara y concisa, eliminando redundancias o ambigüedades. | **C5** |
| 3 | `LC-1.2.2-03` | ¿Se explica una idea por párrafo? | Ambos | **498** — El sitio publica contenidos presentados de manera clara y concisa, evitando redundancias y ambigüedades en la información. | **497** — Ajustar los contenidos del sitio para que transmitan la información de manera clara y concisa, eliminando redundancias o ambigüedades. | **C4** |
| 4 | `LC-1.2.2-04` | ¿Las oraciones son simples y directas, sin exceso de palabras? | Ambos | **498** — El sitio publica contenidos presentados de manera clara y concisa, evitando redundancias y ambigüedades en la información. | **497** — Ajustar los contenidos del sitio para que transmitan la información de manera clara y concisa, eliminando redundancias o ambigüedades. | **C3** |
| 5 | `LC-1.2.2-05` | Si hay texto de ≥4 párrafos, ¿hay un resumen al inicio? («No aplica» si no hay textos largos) | Ambos | **498** — El sitio publica contenidos presentados de manera clara y concisa, evitando redundancias y ambigüedades en la información. | **497** — Ajustar los contenidos del sitio para que transmitan la información de manera clara y concisa, eliminando redundancias o ambigüedades. | **C6** |

### Legibilidad — IEW `1.2.3` / IESD `5.2.3` → **D3, D4, D5**

- **Hito:** **507** — El sitio web presenta textos alineados a la izquierda y párrafos con espaciado.
- **Tarea:** **506** — Asegurarse que los textos se publiquen alineados a la izquierda y con espaciado entre párrafos.

| # | Id | Pregunta de chequeo | Instrumento | Hito | Tarea | Motor |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `LC-1.2.3-01` | ¿Hay espacio entre los párrafos? | Ambos | **507** — El sitio web presenta textos alineados a la izquierda y párrafos con espaciado. | **506** — Asegurarse que los textos se publiquen alineados a la izquierda y con espaciado entre párrafos. | **D3** |
| 2 | `LC-1.2.3-02` | ¿El texto está alineado a la izquierda? | Ambos | **507** — El sitio web presenta textos alineados a la izquierda y párrafos con espaciado. | **506** — Asegurarse que los textos se publiquen alineados a la izquierda y con espaciado entre párrafos. | **D4** |
| 3 | `LC-1.2.3-03` | ¿Se utilizan listas numeradas, viñetas o tablas para ordenar la información? | Ambos | **507** — El sitio web presenta textos alineados a la izquierda y párrafos con espaciado. | **506** — Asegurarse que los textos se publiquen alineados a la izquierda y con espaciado entre párrafos. | **D5** |

### Escritura para la web — IEW `1.2.4` / IESD `5.2.4` → **A1–A3, A9, D6, D7, F1–F4, F6**

- **Hito:** **509** — Todos los documentos enlazados en el sitio web muestran título, formato, peso y una breve descripción.
- **Tarea:** **508** — Configurar en el CMS campos obligatorios para título, formato, peso y descripción de cada documento, y corregir los enlaces existentes que no incluyan esta información.

| # | Id | Pregunta de chequeo | Instrumento | Hito | Tarea | Motor |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `LC-1.2.4-01` | ¿Se aplica el modelo de «pirámide invertida» (de lo más a lo menos importante)? | Ambos | **509** — Todos los documentos enlazados en el sitio web muestran título, formato, peso y una breve descripción. | **508** — Configurar en el CMS campos obligatorios para título, formato, peso y descripción de cada documento, y corregir los enlaces existentes que no incluyan esta información. | **A2** |
| 2 | `LC-1.2.4-02` | ¿Páginas bien organizadas, con títulos y subtítulos claros? | Ambos | **509** — Todos los documentos enlazados en el sitio web muestran título, formato, peso y una breve descripción. | **508** — Configurar en el CMS campos obligatorios para título, formato, peso y descripción de cada documento, y corregir los enlaces existentes que no incluyan esta información. | **A1**, **A3** |
| 3 | `LC-1.2.4-03` | ¿Es fácil escanear visualmente los contenidos? | Ambos | **509** — Todos los documentos enlazados en el sitio web muestran título, formato, peso y una breve descripción. | **508** — Configurar en el CMS campos obligatorios para título, formato, peso y descripción de cada documento, y corregir los enlaces existentes que no incluyan esta información. | **A9** |
| 4 | `LC-1.2.4-04` | ¿Se usan negritas para destacar palabras clave de cada párrafo? | Ambos | **509** — Todos los documentos enlazados en el sitio web muestran título, formato, peso y una breve descripción. | **508** — Configurar en el CMS campos obligatorios para título, formato, peso y descripción de cada documento, y corregir los enlaces existentes que no incluyan esta información. | **D6** |
| 5 | `LC-1.2.4-05` | ¿Se evitan frases escritas únicamente en mayúsculas? | Ambos | **509** — Todos los documentos enlazados en el sitio web muestran título, formato, peso y una breve descripción. | **508** — Configurar en el CMS campos obligatorios para título, formato, peso y descripción de cada documento, y corregir los enlaces existentes que no incluyan esta información. | **D7** |
| 6 | `LC-1.2.4-06` | ¿Se vinculan contenidos del mismo sitio con enlaces relacionados? | **Solo IEW** | **509** — Todos los documentos enlazados en el sitio web muestran título, formato, peso y una breve descripción. | **508** — Configurar en el CMS campos obligatorios para título, formato, peso y descripción de cada documento, y corregir los enlaces existentes que no incluyan esta información. | **F6** |
| 7 | `LC-5.2.4-01` | ¿Los textos de los enlaces (rótulos) son descriptivos / CTA claros, evitando «Haga clic aquí» o «Más»? | **Ambos** (sitioweb y trámites; C-2026-08-25c) | **509** — Todos los documentos enlazados en el sitio web muestran título, formato, peso y una breve descripción. | **508** — Configurar en el CMS campos obligatorios para título, formato, peso y descripción de cada documento, y corregir los enlaces existentes que no incluyan esta información. | **F1**, **F2**, **F3** |
| 8 | `LC-1.2.4-07` | Cuando se enlazan documentos, ¿se especifican título, formato y peso? (los tres; «No aplica» si no hay documentos) | Ambos | **509** — Todos los documentos enlazados en el sitio web muestran título, formato, peso y una breve descripción. | **508** — Configurar en el CMS campos obligatorios para título, formato, peso y descripción de cada documento, y corregir los enlaces existentes que no incluyan esta información. | **F4** (parte) |
| 9 | `LC-1.2.4-08` | ¿Se entrega una breve descripción de los documentos enlazados? («No aplica» si no hay documentos) | Ambos | **509** — Todos los documentos enlazados en el sitio web muestran título, formato, peso y una breve descripción. | **508** — Configurar en el CMS campos obligatorios para título, formato, peso y descripción de cada documento, y corregir los enlaces existentes que no incluyan esta información. | **F4** (parte) |

*F4 en el motor exige los **cuatro** elementos (título + formato + peso + descripción); §22.11 si no se puede medir peso/formato.*

## A.3 Deseables

### Visualización de la información — IEW `1.3.1` → **LC-1.3.1-01**

- **Hito:** **515** — El sitio web presenta sus datos acompañados de apoyos visuales.
- **Tarea:** **514** — Incorporar apoyos visuales como íconos, imágenes, gráficos o infografías para presentar los datos publicados en el sitio web.

| # | Id | Pregunta de chequeo | Instrumento | Hito | Tarea | Motor |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `LC-1.3.1-01` | ¿Se utilizan apoyos visuales (íconos, imágenes, gráficos, infografías) para presentar datos? («No aplica» si no hay datos que los requieran) | **Solo IEW** | **515** — El sitio web presenta sus datos acompañados de apoyos visuales. | **514** — Incorporar apoyos visuales como íconos, imágenes, gráficos o infografías para presentar los datos publicados en el sitio web. | Evalúa **presencia** de apoyos. Texto alternativo / WCAG ≠ esta pregunta (Usabilidad; fuera del % §23). |

### Objetividad — IEW `1.3.2` / IESD `5.3.1` → **E1**

- **Hito:** **517** — Los contenidos publicados del sitio web están redactados de forma objetiva y neutra.
- **Tarea:** **516** — Reescribir contenidos para asegurar redacción objetiva y neutra, privilegiando datos y hechos por sobre opiniones o adjetivos calificativos.

| # | Id | Pregunta de chequeo | Instrumento | Hito | Tarea | Motor |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `LC-1.3.2-01` | ¿Los contenidos son objetivos y con redacción neutra, sin reflejar la opinión de quien los escribió? | Ambos | **517** — Los contenidos publicados del sitio web están redactados de forma objetiva y neutra. | **516** — Reescribir contenidos para asegurar redacción objetiva y neutra, privilegiando datos y hechos por sobre opiniones o adjetivos calificativos. | **E1** |
| 2 | `LC-1.3.2-02` | ¿En al menos un 80% de los contenidos se privilegian datos y hechos sobre adjetivos calificativos? | **Solo IEW** | **517** — Los contenidos publicados del sitio web están redactados de forma objetiva y neutra. | **516** — Reescribir contenidos para asegurar redacción objetiva y neutra, privilegiando datos y hechos por sobre opiniones o adjetivos calificativos. | **E1** |

### Archivo — IEW `1.3.3` / IESD `5.3.2` → **H1**

- **Hito:** **519** — El sitio web presenta las versiones anteriores de contenidos rotuladas como documentos de archivo no vigentes.
- **Tarea:** **518** — Rotular las versiones anteriores de contenidos como documentos de archivo no vigentes, indicando claramente el año o periodo al que corresponden.

| # | Id | Pregunta de chequeo | Instrumento | Hito | Tarea |
| --- | --- | --- | --- | --- | --- |
| 1 | `LC-1.3.3-01` | Si hay versiones anteriores de contenidos, ¿están rotuladas como archivo no vigente? (p. ej. «Requisitos de postulación 2015»; «No aplica» si no hay versiones) | Ambos | **519** — El sitio web presenta las versiones anteriores de contenidos rotuladas como documentos de archivo no vigentes. | **518** — Rotular las versiones anteriores de contenidos como documentos de archivo no vigentes, indicando claramente el año o periodo al que corresponden. |

---

# B. Usabilidad

- **IEW:** dimensión **2**  
- **IESD:** dimensión **1**  
- **Motor §17 2026:** **fuera** del % LC. **Sin** columnas Hito/Tarea PTD de entrega LC (no hay filas `LC-*` para Usabilidad). Si hace falta muestra 2026: anexo cualitativo / skill separado.

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
- **Motor §17 2026:** **fuera** del orquestador editorial (SSL, cabeceras, directorios). Excepción de **contenido:** enlace a política de privacidad → **G2** / `LC-1.1.7-03` (Hito **505** / Tarea **504**). **Sin** filas propias de Hito/Tarea para chequeos técnicos de Seguridad.

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

# Relación con el motor v3.0 y la entrega

| Capa | Rol |
| --- | --- |
| Este mapa (preguntas IEW/IESD + **Hito/Tarea**) | Qué pregunta el instrumento y a qué compromiso PTD se ancla en entrega |
| `checklist-criteria-lc-ptd.json` + `ptd-hito-tarea-por-criterio.ts` | 51 filas `LC-*` + columnas Hito/Tarea en UI/Excel/PDF |
| `checklist-criteria.json` (histórico) | 47 A–H — no usar en auditorías nuevas |
| CLAUDE.md §22–§23 | Cómo redactar entrega CMS y cobertura PTD-LC |

Regla operativa de entrega: §22.8–§22.12 (ninguna casilla vacía; realismo A7/B3; plantillas E3/F4).

**Checklist Editorial v2.1** (`documentos/…`, gitignored) = pauta operativa histórica.  
**Word PTD v2.0 Equipo UX** = vista de hitos/compromisos MEI.  
**Este archivo** = puente pregunta-a-pregunta + anclaje Hito/Tarea hacia ambos.

---

# Próximos pasos

1. Reauditorías META MEI con §22 + **§23** (51 criterios `LC-*`, `version_checklist: "3.0"`); muestra oro: Prompt `05` + Prompt `06` (énfasis §22).
2. Generar Excel MEI coherente de las 10 URLs tras esas auditorías LC.
3. **Después:** incorporar Usabilidad y Seguridad (mismas fuentes Word/JSON) para cierre de año — skills/catálogo separados, sin contaminar el % LC hasta decisión explícita.
4. Doc requisitos TI entendible (flujo MVP) — pendiente de producto.
