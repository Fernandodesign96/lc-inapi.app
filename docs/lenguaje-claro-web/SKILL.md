---
name: lenguaje-claro-web
description: Evalúa una página web (una sola URL, sin páginas internas) con los criterios imprescindibles, esperables y deseables de "Contenido y lenguaje claro". Pide siempre capturas de pantalla (una o varias según el largo de la página), responde preguntas Sí/No/No aplica, calcula puntaje 0-3 por indicador y % de cumplimiento por nivel y global, entrega SIEMPRE el informe de cambios necesarios en un archivo Excel y las capturas anotadas con colores (rojo imprescindibles, amarillo esperables, verde deseables). Úsalo siempre que el usuario dé una URL y pida evaluar, auditar, revisar o puntuar su lenguaje claro, claridad, lenguaje plano, redacción o ortografía, o mencione "criterios imprescindibles", "esperables" o "deseables", aunque no diga "skill" ni "pauta".
---

# Evaluación de Contenido y Lenguaje Claro (Imprescindibles, Esperables y Deseables)

Evalúa **solo la página que el usuario entrega** (la URL exacta, normalmente la portada) con los indicadores de la pauta usando sus preguntas de chequeo exactas:

- **Imprescindibles (1.1.1 a 1.1.8):** 8 indicadores.
- **Esperables (1.2.1 a 1.2.4):** claridad, concisión, legibilidad y escritura para la web.
- **Deseables (1.3.1 a 1.3.3):** visualización de la información, objetividad y archivo.

Por defecto evalúa **los tres niveles**; si el usuario pide solo uno o dos, evalúa solo esos. El resultado replica la planilla: respuesta por pregunta, puntaje por indicador, comentarios, % de cumplimiento **por nivel** y, cuando se evalúan los tres, un % global.

## Flujo de trabajo

### 1. Obtener la página y pedir las capturas
Evalúa únicamente la URL que entregó el usuario. **No sigas enlaces ni abras páginas internas** (menú, noticias, política de privacidad, términos de uso, preguntas frecuentes, etc.), aunque la evaluación quede más acotada: el usuario quiere el resultado de esa página, y mezclar otras páginas lo distorsionaría.

1. Con `web_fetch`, abre la URL entregada, una sola vez.
2. Anota la URL evaluada: es la evidencia de todo el informe.
3. Si la página bloquea la lectura (login, JavaScript puro, errores), dilo y no inventes contenido.
4. Puedes **observar los enlaces presentes en la página** (por ejemplo, "Política de privacidad" o "Uso de los contenidos" en el pie), pero sin abrirlos: su existencia es evidencia, su contenido no.
5. **Pide siempre las capturas de pantalla si el usuario no las adjuntó.** Es obligatorio en toda evaluación, aunque el usuario no lo mencione. El texto extraído no muestra el diseño (mayúsculas, alineación, negritas, espacios, imágenes), y varias preguntas dependen de eso. No bloquees el trabajo: entrega igualmente el informe preliminar en Excel y, en esa misma respuesta, incluye este mensaje (ajústalo al caso):

> Para verificar lo visual adjunta capturas de pantalla de la página, en versión escritorio:
> - **Página corta:** una captura.
> - **Página larga:** varias, de arriba hacia abajo, una por cada pantalla de desplazamiento y con un pequeño traslape para no perder contenido. Incluye el encabezado y el pie. También sirve una sola captura de página completa (en Chrome: F12, luego Ctrl+Mayús+P y «Capture full size screenshot»).
> - Súbelas en orden. Si evalúas varias páginas, indica a cuál corresponde cada una.

Cuando el usuario las envíe, vuelve a emitir el informe: completa las preguntas que quedaron "No verificable", genera de nuevo el Excel (con `"capturas": true`) y entrega las capturas anotadas (ver "Regla de colores"). Si el usuario dice que no puede adjuntarlas, continúa sin ellas y deja constancia en las limitaciones.

### 2. Responder las preguntas de chequeo
Lee `references/criterios.md` para las preguntas literales (los tres niveles), ejemplos y reglas de decisión de cada indicador. Responde cada pregunta con una de estas opciones:

- **Sí** / **No**
- **No aplica**: solo en las preguntas donde la pauta lo permite (marcadas en el archivo de criterios).
- **No verificable**: cuando no se puede comprobar desde fuera (ver sección de límites). Se excluye del cálculo y se informa aparte.

Principios de juicio:
- **Basa cada respuesta en evidencia observada**, citando la URL y, cuando ayude, una frase breve del sitio. Un "No" necesita un ejemplo concreto; un "Sí" necesita que lo hayas visto en la página evaluada.
- **Ante la duda real, responde "No"** si el criterio exige que algo exista visiblemente (fuente, fecha, política de privacidad) y no aparece en la página evaluada. Indica que "no se encontró en la página evaluada". Cuando el criterio se cumple con un enlace visible (p. ej. política de privacidad en el pie de página), basta el enlace; deja constancia de que no se abrió.
- Los comentarios deben explicar los "No" y los casos matizados, como en la planilla original (ej.: "La redacción es de base legal, con notas explicativas...").
- **Si hay capturas, mandan sobre el texto extraído.** Úsalas para las preguntas visuales: mayúsculas sostenidas (1.2.4 pregunta 5), negritas (1.2.4 pregunta 4), alineación (1.2.3 pregunta 2), largo de párrafos en líneas (1.2.2 pregunta 2), espacios entre párrafos (1.2.3 pregunta 1), apoyos visuales (1.3.1) y formato y peso visibles de documentos (1.2.4 pregunta 7).

### 3. Preparar los datos del informe
No calcules puntajes ni prioridades a mano. Reúne todo en un JSON (ver `assets/ejemplo_informe.json`). Cada página evaluada es un elemento de `paginas`; si se evalúan varias, van en el mismo archivo:

```json
{
  "paginas": [
    {
      "nombre": "Portada",
      "url": "https://ejemplo.cl",
      "fecha": "2026-11-19",
      "capturas": true,
      "respuestas": { "1.1.1": ["Sí"], "1.1.2": ["Sí", "Sí", "Sí", "No"], "1.2.1": ["No", "No", "Sí", "Sí", "No aplica"], "...": [] },
      "comentarios": { "1.1.2": "Los trámites no explican cómo realizarlos en línea." },
      "cambios": [
        { "indicador": "1.1.5", "ubicacion": "Novedades, fecha de cada noticia",
          "problema": "«Miércoles 28 octubre de 2026»: falta «de» y el día va con mayúscula.",
          "cambio": "Escribir «miércoles 28 de octubre de 2026».",
          "verificar": "Las fechas siguen ese formato." }
      ],
      "limitaciones": ["No se abrieron los enlaces del pie."]
    }
  ]
}
```

- **respuestas**: el orden es el de las preguntas en `references/criterios.md`. Incluye los indicadores 1.1.x, 1.2.x, 1.3.x o cualquier combinación; un nivel debe venir completo.
- **cambios**: uno por cada hallazgo a corregir. `indicador` es el código (por ejemplo 1.1.5) o `fuera_de_pauta`. El nivel, el color y la prioridad se calculan solos.
- **capturas**: `true` solo si el usuario adjuntó capturas y las usaste.
- **limitaciones**: lo que no pudiste verificar y los supuestos.

Regla de puntaje (inferida de la planilla de referencia, donde imprescindibles = 19/24 = 79%, esperables = 8/12 = 67% y deseables = 6/9 = 67%): cada indicador vale 0-3 según la proporción de «Sí» entre las preguntas aplicables y verificables (100% → 3; 60% o más → 2; al menos un Sí → 1; ninguno → 0). El % de cada nivel = suma de puntajes / (3 × indicadores evaluados de ese nivel). El % global = preguntas con «Sí» / preguntas aplicables y verificables, sumando los tres niveles (solo se calcula si se evaluaron los tres). Los umbrales son editables en la hoja «Notas» del Excel. Para una revisión rápida de puntajes sin generar el archivo existe `python scripts/score.py respuestas.json`.

### 4. Generar y entregar el informe (siempre en Excel)
El informe se entrega **siempre como archivo Excel**, nunca como tablas pegadas en el chat.

1. Genera la planilla: `python scripts/generar_planilla.py informe.json /mnt/user-data/outputs/informe_lenguaje_claro.xlsx`. El script calcula puntajes, prioridades y fórmulas, recalcula con LibreOffice y avisa si hay errores. Si el recálculo no se pudo hacer, ejecuta `python /mnt/skills/public/xlsx/scripts/recalc.py <archivo>` y revisa que no haya errores antes de entregar.
2. Contenido del Excel (ver «Contenido del informe»): hojas Resumen, Cambios, Detalle, Preguntas y Notas.
3. Entrega con `present_files` el Excel y, si hay capturas, las imágenes anotadas (ver «Regla de colores»).
4. En el chat escribe solo un resumen corto: el % de cada nivel y el global, cuántos cambios hay por prioridad, los tres hallazgos más importantes y los supuestos o límites que condicionan el resultado. No pegues las tablas completas.
5. Si no hay capturas, cierra el mensaje con la solicitud del paso 1.
6. Si el usuario pide además otro formato (Word, PDF), genéralo después con el skill correspondiente; el Excel se entrega igualmente.

## Regla de colores para las capturas

| Color | Qué se marca |
|---|---|
| **Rojo** | Hallazgos de criterios **imprescindibles** (1.1.x) |
| **Amarillo** | Hallazgos de criterios **esperables** (1.2.x) |
| **Verde** | Hallazgos de criterios **deseables** (1.3.x) |
| Gris (opcional) | Observaciones fuera de la pauta |

Reglas:
- Un recuadro por hallazgo, con un número en la etiqueta que se repite en la leyenda al pie. La leyenda dice el indicador (por ejemplo 1.1.5) y el cambio sugerido.
- Si un mismo texto tiene problemas de dos niveles, dibuja dos recuadros (rojo por fuera, amarillo por dentro) con números distintos.
- Se marcan hallazgos a corregir. Si un nivel no tiene hallazgos (por ejemplo, deseables al 100%), puedes marcar en su color lo que cumple, empezando la leyenda con «Cumple», y aclararlo en el mensaje.
- Una imagen anotada por captura, en el mismo orden en que las subió el usuario.

Cómo hacerlo: arma un JSON como `assets/ejemplo_anotaciones.json` y ejecuta `python scripts/anotar_capturas.py especificacion.json`. Para ubicar las coordenadas (píxeles de la imagen original), mira cada captura con la herramienta `view`. Revisa el resultado también con `view` y corrige si una etiqueta tapa a otra o un recuadro quedó corrido. Si un recuadro tapa el texto, usa el campo `ancla` o ajusta las coordenadas.

## Contenido del informe

El informe es un archivo Excel que dice qué hay que cambiar, dónde y cómo. Se escribe en tono neutro: no se dirige a nadie en particular ni indica quién hará los cambios.

Hojas:
- **Resumen**: una fila por página evaluada, con URL, fecha, % de cumplimiento de cada nivel y global, si hubo capturas, y cuántos cambios hay por prioridad.
- **Cambios**: una fila por cambio, con N°, página, ubicación, nivel (con su color), indicador, prioridad, problema detectado (citando el texto actual), cambio necesario (con una redacción propuesta cuando se pueda) y cómo verificar que quedó resuelto.
- **Detalle**: una fila por indicador, con sus puntajes, respuestas y comentario.
- **Preguntas**: cada pregunta de la pauta con su respuesta.
- **Notas**: umbrales de puntaje (editables), colores de las marcas, limitaciones y supuestos.

Prioridad (la asigna el script):
- **Alta**: imprescindibles de indicadores con puntaje 1 o menos.
- **Media**: imprescindibles de indicadores con puntaje 2 y todos los esperables.
- **Baja**: deseables y observaciones fuera de la pauta.

Reglas de redacción de los cambios:
- Cada cambio es una acción concreta y comprobable («Escribir "Mapa del sitio"»), no una opinión («Mejorar los títulos»).
- Las redacciones propuestas son sugerencias: el contenido jurídico o técnico debe validarlo quien corresponda en la institución. Los datos que no conozcas (montos, plazos, pesos de archivos, fechas) van entre corchetes, por ejemplo [peso real], y no se inventan.
- No repitas el mismo cambio en varias filas de una misma página. Si un cambio afecta a todas las páginas (encabezado, pie, plantillas), escríbelo una sola vez en la primera página que lo muestre e indica «Todas las páginas» en la ubicación.

## Límites: qué no se puede verificar con una sola página
Sé transparente en vez de adivinar:
- **Contenido de páginas enlazadas** (política de privacidad, términos de uso, trámites detallados): no se abre. Si la pregunta solo se resuelve leyéndolas, usa "No verificable" o, si el criterio exige que la información esté visible, "No" con el comentario correspondiente.
- **Preguntas sobre trámites, listados de personas o menores de edad**: si la página no contiene textos de ese tipo, responde "No aplica" donde la pauta lo permite.
- **Conectores y puntuación** en páginas con textos muy breves (portadas con frases sueltas): marca "No verificable" si no hay prosa suficiente para juzgar.
- **Búsqueda inversa de imágenes** (1.1.6 pregunta 2): sin herramienta de búsqueda inversa, revisa créditos visibles y marca "No verificable" si no puedes concluir.
- **Corrector ortográfico automático** (1.1.5): revisa tú el texto visible; no cuentes errores de metadatos invisibles. Si encuentras más de un error en el texto visible, es "No".
- **Contenido solo en PDF, imágenes o detrás de login**: indica que no fue evaluado.
- **Legibilidad cuantitativa** (1.1.3): apóyate en longitud de frases y densidad de términos técnicos observada, sin afirmar índices que no calculaste.
- **Propiedades visuales de los esperables**: `web_fetch` entrega el texto, no el diseño renderizado. La alineación a la izquierda (1.2.3 pregunta 2) y el largo en líneas de los párrafos (1.2.2 pregunta 2) no se ven directamente: marca "No verificable" la alineación si no hay evidencia en el HTML, y estima el largo de los párrafos por cantidad de caracteres, avisando que es una estimación. Las negritas, títulos, listas, mayúsculas sostenidas y el formato y peso de documentos enlazados (p. ej. "(PDF 293KB)") sí son visibles en el texto.
- **Archivo** (1.3.3): con una sola página rara vez hay versiones anteriores. Si no ves contenidos de años anteriores ni secciones de archivo, responde "No aplica"; no lo marques "No" por no encontrar un archivo que el criterio no exige.
- **Visualización de la información** (1.3.1): cuenta solo imágenes, íconos, gráficos o infografías que ayuden a presentar datos o información; una foto decorativa no basta. Si la página no presenta datos que requieran apoyo visual, "No aplica".
- **Objetividad** (1.3.2): juzga por el texto visible y cita ejemplos de adjetivos valorativos; el umbral de 80% es aproximado porque no se cuentan todos los contenidos del sitio.
- **Capturas de pantalla**: si no las hay, las preguntas visuales quedan "No verificable" o con una estimación declarada, y debes pedirlas (ver paso 1). Si las hay, priorízalas sobre el texto extraído: este puede diferir de lo que se ve (por ejemplo, mayúsculas que aplica el diseño), y no debes reportar como error de ortografía algo que solo existe en el código. Las capturas solo cubren lo que muestran: si una página es larga y faltan tramos, dilo.
- **Documentos enlazados** (1.2.4 preguntas 7 y 8): evalúa solo los enlaces a documentos que aparecen en la página, sin abrirlos. Para responder "Sí" a la pregunta 7, todos deben mostrar título, formato y peso.
