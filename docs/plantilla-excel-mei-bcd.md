# Plantilla Excel — Entrega MEI (criterios B, C, D)

| Metadatos | Detalle |
| --- | --- |
| **Fecha** | 2026-06-28 (actualizado 2026-07-29 — META MEI 10 URLs + Fuentes + reauditoría §17) |
| **Uso** | Entrega MEI: manual (TSV §2) o **automatizada** (`bun run export:mei-xlsx` / API / UI) |
| **Alcance** | Hitos H01–H13 (actividades MEI 1–16); filas desde auditorías Clarity vigentes + evidencia H01/H11 |
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
| R | `auditor` | equipo de desarrollo |

---

## 2. TSV para pegar en Excel

Copiar desde la línea de encabezado hasta el final del bloque → Pegar especial en Excel (texto delimitado por tabulaciones).

```tsv
num	url	tipo_pagina	ubicacion_contextual	capa	texto_original	texto_propuesto	criterio_id	motivo	fragmento_busqueda	html_linea_aprox	duplicado_de	origen_probable	requiere_validacion_tic	estado	notas_tic	fecha_auditoria	auditor
1	https://tramites.inapi.cl/...	tramites	<title> — pestaña navegador	METADATA	Clasificador de Productos y Servicios INAPI — Portal de Trámites: Marcas, Patentes y máss	Clasificador de Productos y Servicios INAPI — Portal de Trámites: Marcas, Patentes y más	D1	Error de digitación: sobra una «s».	<title>Clasificador de Productos y Servicios INAPI — Portal de Trámites: Marcas, Patentes y máss</title>	~L31		dom-renderizado	no	pendiente		no	27-06-2026	equipo de desarrollo
2	https://tramites.inapi.cl/...	tramites	Menú principal desktop › ítem patentes	VISIBLE	Titulos y Certificados Patentes	Títulos y certificados de patentes	D1	Falta tilde en «Títulos».	<a class="nav-link" href="...">Titulos y Certificados Patentes</a>	~L471		dom-renderizado	si	pendiente	Validar capitalización con TI si el menú exige estilo título.	27-06-2026	equipo de desarrollo
3	https://tramites.inapi.cl/...	tramites	Menú mobile › ítem patentes	VISIBLE	Titulos y Certificados Patentes	Títulos y certificados de patentes	D1	Misma corrección que desktop.	<a class="nav-link" href="...">Titulos y Certificados Patentes</a>	~L906	fila 2	dom-renderizado	si	pendiente	Duplicado menú mobile.	27-06-2026	equipo de desarrollo
4	https://tramites.inapi.cl/...	tramites	Menú lateral › sección usuario	VISIBLE	MI INAPI	Mi INAPI	D7	Mayúsculas sostenidas; tono más cercano (B6).	>MI INAPI<	~L127-130		dom-renderizado	no	pendiente		27-06-2026	equipo de desarrollo
5	https://tramites.inapi.cl/...	tramites	Menú lateral › anotaciones	VISIBLE	Anotaciones Guardadas Marcas	Tus solicitudes de cambio guardadas	C2	«Anotación» es término burocrático.	...Anotaciones Guardadas Marcas...	~L145-150		dom-renderizado	si	pendiente	Confirmar con TI si el término legal debe mantenerse en backend.	27-06-2026	equipo de desarrollo
6	https://tramites.inapi.cl/...	tramites	Menú lateral › escritos	VISIBLE	Escritos Guardados de Marcas	Tus borradores de documentos	C2	«Escritos» es jerga legal.	...Escritos Guardados de Marcas...	~L151-156		dom-renderizado	si	pendiente		27-06-2026	equipo de desarrollo
7	https://tramites.inapi.cl/...	tramites	Menú lateral › encabezado sección	VISIBLE	TRAMITACIÓN	Trámites	D7	Mayúsculas sostenidas; más directo.	>TRAMITACI&#211;N<	~L157-160		backend-i18n	no	pendiente	Entidad &#211; en fuente.	27-06-2026	equipo de desarrollo
8	https://tramites.inapi.cl/...	tramites	Menú › oposición	VISIBLE	Presentar Demanda de Oposición	Oponerse al registro de una marca	B2	Traduce acción legal a acción ciudadana clara.	...Presentar Demanda de Oposici&#243;n...	~L193-198		dom-renderizado	si	pendiente	Validar con área jurídica si el label debe ser literal legal.	27-06-2026	equipo de desarrollo
9	https://tramites.inapi.cl/...	tramites	Breadcrumb / nav	VISIBLE	Home	Inicio	C3	Anglicismo innecesario.	<a class="nav-link" href="/"><span class="fa fa-home"></span>&nbsp; Home</a>	~L503		dom-renderizado	no	pendiente	No modificar href ni clases.	27-06-2026	equipo de desarrollo
10	https://tramites.inapi.cl/...	tramites	Modal clasificador Niza › botón	VISIBLE	Ok	Aceptar selección	B6	Texto de botón no describe la acción.	<button type="button" class="btn btn-primary" onclick="CopyNizaSelection()" data-dismiss="modal">Ok</button>	~L1575		dom-renderizado	no	pendiente	No cambiar onclick ni data-dismiss.	27-06-2026	equipo de desarrollo
```

---

## 3. Reglas de llenado

1. **Una fila por ocurrencia** — menú desktop y mobile son filas distintas.
2. **Solo B, C, D** en esta plantilla (MEI); criterios A/E/F/G/H van al JSON MVP completo.
3. **`fragmento_busqueda`** es el campo que TI usa primero; `html_linea_aprox` es auxiliar.
4. Marcar **`requiere_validacion_tic = si`** cuando la propuesta pueda chocar con norma, i18n o estilo de menú.
5. **`estado`:** solo pasar a `aprobado` tras revisión con Equipo UX; TI marca `implementado`.

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

`entrega-mei-calidad-web_YYYY-MM-DD.xlsx` (o `…_H02.xlsx` por hito) — generado por `bun run export:mei-xlsx` en `data/exports/` (gitignored).

---

## 6. Exportación automatizada — formato plantilla MEI institucional (jul-2026)

| Componente | Ruta / comando |
| --- | --- |
| Catálogo PTD | `data/mei-calidad-web/catalog.json` + `src/schemas/mei-calidad-web-catalog.ts` |
| Motor filas + Excel | `src/lib/mei-export/` (`mei-hitos.ts`, `mei-row-builder.ts`, `mei-xlsx-writer.ts`) |
| CLI | `bun run export:mei-xlsx` · `bun run export:mei-xlsx -- --hito=H02` |
| API (Next) | `GET /api/mei-calidad-web/export/[hitoId]/xlsx` · `GET /api/mei-calidad-web/export/completo.xlsx` |
| UI | `/auditar/mei-calidad-web` → dimensiones → subdimensiones → tablero trimestral |

### Pestañas del libro (por hito y entrega completa)

Cada export genera **5 pestañas**:

| Pestaña | Contenido |
| --- | --- |
| **Índice** | Título «Auditoría Lenguaje Claro — INAPI»; columnas URL #, Sección, Página, Dirección, Rol META MEI, Fecha, N° incumplimientos; fila TOTAL |
| **CheckList** | Criterio \| enunciado \| cita fuente; filtrado por hito; H01 o alcance con H01 → A1–H1 completo |
| **Fuentes** | Hito \| Dimensión \| Criterio \| Enunciado \| Cita checklist \| Documento(s) Colección A (`RLC`→lenguaje-claro-recomendaciones.pdf, `CW`→meta-mei.pdf) |
| **web INAPI** | Bloques por URL `tipo_pagina === sitioweb` |
| **sitio TRAMITES** | Bloques por URL `tipo_pagina === tramites` |

### Muestra de URLs (META MEI — jul-2026)

Por defecto el export usa las **10 URLs compromiso jefatura** (`src/lib/mei-export/mei-meta-mei-urls.ts`), no la serie Clarity 13. Flag CLI: `--urls=clarity` para la muestra Clarity.

| # | URL (rol) | Auditoría vigente | % LC (ref.) |
| --- | --- | --- | --- |
| 1 | `www.inapi.cl/` (portada) | `www-inapi-cl_2026-07-22` | 54,5 % |
| 2 | `/marcas` (menú) | `www-inapi-cl-marcas_2026-06-05` | 48,5 % |
| 3 | `/patentes` (menú) | `www-inapi-cl-patentes_2026-07-29` (§17) | 42,9 % |
| 4 | `/acerca-de/inapi` | `www-inapi-cl-acerca-de-inapi_2026-06-07` | 34,3 % |
| 5 | buscador noticias | `www-inapi-cl-buscador-noticias_2026-06-07` | 34,5 % |
| 6 | `/marcas/tramites/solicitud-nueva` | `www-inapi-cl-marcas-tramites-solicitud-nueva_2026-06-07` | 44,8 % |
| 7 | `/sala-de-prensa/noticias` | `www-inapi-cl-sala-de-prensa-noticias_2026-06-07` | 45,5 % |
| 8 | noticia Cuenta Pública | `www-inapi-cl-noticia-cuenta-publica-2026_2026-07-29` (§17) | 60,0 % |
| 9 | noticia cifra patentes | `www-inapi-cl-noticia-cifra-patentes-nacionales_2026-07-29` (§17) | 65,7 % |
| 10 | `tramites.inapi.cl/siac` | `tramites-inapi-cl-siac_2026-06-07` | 51,5 % |

**H02:** criterios B1–B7 + C1–C7 + D1–D7 sobre esas 10 URLs. Export regenerado 2026-07-29 tras §17: ~173 filas de incumplimiento en alcance H02.

**Entrega completa:** unión de hitos `completado` (H01+H02) en el mismo formato; pestaña Fuentes con los **39 criterios** y documentos de origen.

**Regenerar localmente (gitignored):**

```bash
bun run export:mei-xlsx -- --hito=H02
# completo H01+H02 vía API UI o buildMeiWorkbookWithStats({ hitoIds: ["H01","H02"] })
```

Columnas de detalle (web / trámites): Página \| Dirección \| **Categoría** (Cumple / Cumple con observaciones / Medianamente cumple / No cumple / No aplica) \| Texto en pantalla \| Corrección propuesta \| Ubicación \| Justificación \| Criterio \| CheckList \| Línea/ref.

Las hojas de detalle listan los **47** criterios por URL (como MVP/PDF), agrupados en secciones por categoría de presentación MEI.

**H01:** evidencia documental — Índice con nota N/A; CheckList + Fuentes completos; hojas URL con mensaje N/A.

**Reglas de descarga en UI/API:** botón Excel habilitado solo si el ítem hito en catálogo tiene `estado: completado` y `excelHitoId` no nulo.

**Despliegue (Vercel):** el catálogo vive en la raíz del monorepo (`data/mei-calidad-web/`). Definir `LC_REPO_ROOT` o incluir `data/` en el build; si falta, la UI muestra `error.tsx` legible.

---

## 7. Nombre de archivo manual (histórico)

`entrega-mei-bcd-inapi_DD-MM-YYYY.xlsx` — una hoja por URL o una hoja maestra con columna `url` (flujo DevTools §2).

---

## 8. Columnas técnicas internas (motor)

El motor sigue generando `MeiExcelRow` ampliado (`MEI_EXCEL_COLUMNS` en `mei-row-builder.ts`) y el writer MEI institucional proyecta ese modelo a las 4 pestañas anteriores.