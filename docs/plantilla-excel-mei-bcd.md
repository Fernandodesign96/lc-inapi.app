# Plantilla Excel — Entrega MEI (criterios B, C, D)

| Metadatos | Detalle |
| --- | --- |
| **Fecha** | 2026-06-28 (actualizado 2026-06-27) |
| **Uso** | Copiar a Excel/Google Sheets para entrega con Bernarda (hitos MEI 30-jun-2026) |
| **Alcance** | Ortografía (D1), redacción (C), lenguaje claro (B), mayúsculas (D7) |
| **Stack** | [`stack-orquestación.md`](stack-orquestación.md) |

---

## 1. Columnas (encabezado fila 1)

| # | Nombre columna | Descripción |
| --- | --- | --- |
| A | `num` | Correlativo (1, 2, 3…) |
| B | `url` | URL canónica auditada |
| C | `tipo_pagina` | `tramites` \| `sitioweb` |
| D | `ubicacion_contextual` | Ruta de navegación humana (ej. «Menú principal desktop › Títulos y certificados») |
| E | `capa` | `VISIBLE` \| `METADATA` \| `SISTEMA` |
| F | `texto_original` | Texto literal visible o en `<title>` |
| G | `texto_propuesto` | Redacción en lenguaje claro |
| H | `criterio_id` | Un solo id: B1–B7, C1–C7, D1, D7, etc. |
| I | `motivo` | Una frase: por qué corrige el criterio |
| J | `fragmento_busqueda` | Snippet HTML único para «Buscar en todo el proyecto» (con `class`/`id`/`href`) |
| K | `html_linea_aprox` | Opcional — línea Ctrl+U aproximada |
| L | `duplicado_de` | Si aplica: referencia a otra fila (ej. «menú mobile fila 12») |
| M | `origen_probable` | `html-estatico` \| `dom-renderizado` \| `backend-i18n` \| `vista-razor` \| `bundle-js` |
| N | `requiere_validacion_tic` | `si` \| `no` — término legal, encoding, estilo menú |
| O | `estado` | `pendiente` \| `aprobado` \| `implementado` \| `rechazado-tic` |
| P | `notas_tic` | Comentarios para implementación (entidades, no cambiar `onclick`, etc.) |
| Q | `fecha_auditoria` | DD-MM-AAAA (ej. `27-06-2026`) |
| R | `auditor` | Fernando Arriagada Castillo |

---

## 2. TSV para pegar en Excel

Copiar desde la línea de encabezado hasta el final del bloque → Pegar especial en Excel (texto delimitado por tabulaciones).

```tsv
num	url	tipo_pagina	ubicacion_contextual	capa	texto_original	texto_propuesto	criterio_id	motivo	fragmento_busqueda	html_linea_aprox	duplicado_de	origen_probable	requiere_validacion_tic	estado	notas_tic	fecha_auditoria	auditor
1	https://tramites.inapi.cl/...	tramites	<title> — pestaña navegador	METADATA	Clasificador de Productos y Servicios INAPI — Portal de Trámites: Marcas, Patentes y máss	Clasificador de Productos y Servicios INAPI — Portal de Trámites: Marcas, Patentes y más	D1	Error de digitación: sobra una «s».	<title>Clasificador de Productos y Servicios INAPI — Portal de Trámites: Marcas, Patentes y máss</title>	~L31		dom-renderizado	no	pendiente		no	27-06-2026	Fernando Arriagada Castillo
2	https://tramites.inapi.cl/...	tramites	Menú principal desktop › ítem patentes	VISIBLE	Titulos y Certificados Patentes	Títulos y certificados de patentes	D1	Falta tilde en «Títulos».	<a class="nav-link" href="...">Titulos y Certificados Patentes</a>	~L471		dom-renderizado	si	pendiente	Validar capitalización con TI si el menú exige estilo título.	27-06-2026	Fernando Arriagada Castillo
3	https://tramites.inapi.cl/...	tramites	Menú mobile › ítem patentes	VISIBLE	Titulos y Certificados Patentes	Títulos y certificados de patentes	D1	Misma corrección que desktop.	<a class="nav-link" href="...">Titulos y Certificados Patentes</a>	~L906	fila 2	dom-renderizado	si	pendiente	Duplicado menú mobile.	27-06-2026	Fernando Arriagada Castillo
4	https://tramites.inapi.cl/...	tramites	Menú lateral › sección usuario	VISIBLE	MI INAPI	Mi INAPI	D7	Mayúsculas sostenidas; tono más cercano (B6).	>MI INAPI<	~L127-130		dom-renderizado	no	pendiente		27-06-2026	Fernando Arriagada Castillo
5	https://tramites.inapi.cl/...	tramites	Menú lateral › anotaciones	VISIBLE	Anotaciones Guardadas Marcas	Tus solicitudes de cambio guardadas	C2	«Anotación» es término burocrático.	...Anotaciones Guardadas Marcas...	~L145-150		dom-renderizado	si	pendiente	Confirmar con TI si el término legal debe mantenerse en backend.	27-06-2026	Fernando Arriagada Castillo
6	https://tramites.inapi.cl/...	tramites	Menú lateral › escritos	VISIBLE	Escritos Guardados de Marcas	Tus borradores de documentos	C2	«Escritos» es jerga legal.	...Escritos Guardados de Marcas...	~L151-156		dom-renderizado	si	pendiente		27-06-2026	Fernando Arriagada Castillo
7	https://tramites.inapi.cl/...	tramites	Menú lateral › encabezado sección	VISIBLE	TRAMITACIÓN	Trámites	D7	Mayúsculas sostenidas; más directo.	>TRAMITACI&#211;N<	~L157-160		backend-i18n	no	pendiente	Entidad &#211; en fuente.	27-06-2026	Fernando Arriagada Castillo
8	https://tramites.inapi.cl/...	tramites	Menú › oposición	VISIBLE	Presentar Demanda de Oposición	Oponerse al registro de una marca	B2	Traduce acción legal a acción ciudadana clara.	...Presentar Demanda de Oposici&#243;n...	~L193-198		dom-renderizado	si	pendiente	Validar con área jurídica si el label debe ser literal legal.	27-06-2026	Fernando Arriagada Castillo
9	https://tramites.inapi.cl/...	tramites	Breadcrumb / nav	VISIBLE	Home	Inicio	C3	Anglicismo innecesario.	<a class="nav-link" href="/"><span class="fa fa-home"></span>&nbsp; Home</a>	~L503		dom-renderizado	no	pendiente	No modificar href ni clases.	27-06-2026	Fernando Arriagada Castillo
10	https://tramites.inapi.cl/...	tramites	Modal clasificador Niza › botón	VISIBLE	Ok	Aceptar selección	B6	Texto de botón no describe la acción.	<button type="button" class="btn btn-primary" onclick="CopyNizaSelection()" data-dismiss="modal">Ok</button>	~L1575		dom-renderizado	no	pendiente	No cambiar onclick ni data-dismiss.	27-06-2026	Fernando Arriagada Castillo
```

---

## 3. Reglas de llenado

1. **Una fila por ocurrencia** — menú desktop y mobile son filas distintas.
2. **Solo B, C, D** en esta plantilla (MEI); criterios A/E/F/G/H van al JSON MVP completo.
3. **`fragmento_busqueda`** es el campo que TI usa primero; `html_linea_aprox` es auxiliar.
4. Marcar **`requiere_validacion_tic = si`** cuando la propuesta pueda chocar con norma, i18n o estilo de menú.
5. **`estado`:** solo pasar a `aprobado` tras revisión con Bernarda; TI marca `implementado`.

---

## 4. Puente Excel → JSON MVP

Al cerrar una URL para el MVP, cada fila Excel aprobada puede mapearse a una entrada `sustituciones[]`:

| Excel | JSON MVP |
| --- | --- |
| `texto_original` | `original` |
| `texto_propuesto` | `propuesto` |
| `criterio_id` | `criterio_id` |
| `motivo` | `motivo` |
| `html_linea_aprox` | `html_linea_aprox` |
| `num` o ancla | `linea` (ej. `MEI-001`, `T042`) |

Campos Excel exclusivos (`fragmento_busqueda`, `ubicacion_contextual`) se documentan en `nota_final_tic` del JSON hasta extender el schema.

---

## 5. Nombre de archivo sugerido

`entrega-mei-bcd-inapi_DD-MM-YYYY.xlsx` — una hoja por URL o una hoja maestra con columna `url`.
