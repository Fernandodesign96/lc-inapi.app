# Ejemplo de informe LC → fixture (rechazado) — Notificaciones Marcas

**Propósito:** documentar **un informe editorial completo** (texto capturado, criterios, resumen, texto propuesto) como **referencia humana** para construir el primer archivo JSON bajo `data/audit-fixtures/` en la implementación del ítem **Fixtures de auditoría** ([`docs/ROADMAP.md`](../ROADMAP.md) Fase 1). No sustituye la validación automática: el JSON final debe pasar `strictAuditRecordSchema` en [`src/schemas/checklist.ts`](../../src/schemas/checklist.ts).

**Auditoría de referencia:** Checklist Editorial INAPI **v1.1** (39 criterios; orden oficial `CRITERION_IDS` en código).

**Capturas de pantalla:** las imágenes del informe original se entregaron en el hilo de trabajo (Cursor). Si el equipo desea versionarlas en git, conviene copiarlas a una carpeta p. ej. `docs/ux/assets/notificaciones-marcas-audit/` y enlazarlas desde aquí.

---

## 1. Identificación y métricas

| Campo | Valor |
| --- | --- |
| **Nombre (producto)** | Notificaciones Marcas |
| **URL evaluada** | `https://tramites.inapi.cl/Notificaciones` |
| **Visitas Clarity (referencia ~130 días)** | 79.775 |
| **Fecha de evaluación (informe)** | 11/05/2026 |
| **Evaluador** | Fernando Arriagada Castillo |
| **Criterios aprobados** | 16 de **29** aplicables |
| **Criterios no aplicables** | 10 |
| **% de cumplimiento (sobre aplicables)** | **55,2 %** |
| **Estado de aceptación** | **Rechazado** (`rechazado` en contrato) |

**Comprobación del porcentaje:** \(16 / 29\) × 100 = 55,172… → redondeo a un decimal según contrato: `Math.round((16/29)*1000)/10` = **55,2** (coherente con [`summarizeEvaluations`](../../src/schemas/checklist.ts)).

---

## 2. Texto actual capturado (para campo `texto_capturado` del registro)

Texto plano agregado para el mock/fixture; resume lo que ve el usuario en las vistas relevantes (modal, sin filtros, con filtros, pie).

### 2.1 Modal «Advertencia» (al cargar)

Este mensaje aparece al cargar la página:

**Título:** Advertencia

**Cuerpo:**

Las notificaciones electrónicas disponibles como cortesía en esta plataforma, así como los avisos de alerta por correo electrónico, no reemplazan la notificación legal, la cual se realiza por el estado diario (Art. 13 de la Ley 19.039).

La Ley obliga a notificar electrónicamente solo la demanda de oposición, la observación de fondo y la resolución que acepta el registro solicitado. Para otras resoluciones, el interesado debe revisar siempre los estados diarios disponibles en https://tramites.inapi.cl/EstadosDiariosMarcas.

Para más información consulte la Resolución Exenta 138, Instructivo del Sistema de Tramitación Electrónica del INAPI, numerales 11 a 13.

**Acción:** [Botón: OK]

### 2.2 Vista principal sin desplegar filtros

Trámites y Servicios • Notificaciones Electrónicas [Botón: MARCAS] [Botón: PATENTES] Fernando Ignacio Arriagada Castillo

Pestañas: [Marcas (Seleccionada)] [Patentes]

Sección: Notificaciones Electrónicas de Marcas

Enlace de acción: > Mostrar filtros de búsqueda

**Resultados:** No se encontraron resultados.

### 2.3 Vista con formulario desplegado

Notificaciones Electrónicas de Marcas ∨ Ocultar filtros de búsqueda

En esta pantalla puede revisar las notificaciones enviadas por INAPI (Marcas)

**Campos del formulario**

- Número de Solicitud: [Ingrese número de solicitud]
- Fecha de notificación: [Ingrese fecha de inicio] [Ingrese fecha de fin]
- Titular/Solicitante: [Ingrese titular/solicitante]

**Información del usuario notificado**

- RUN Notificado: 18.618.492-0
- Nombre: Fernando Ignacio Arriagada Castillo
- Última actualización de notificaciones: 11/05/2026 08:00:00 a. m.

**Acciones:** [Botón: BUSCAR] [Botón: LIMPIAR] [Botón naranja: VER ESTADO DIARIO MARCAS]

**Resultados:** No se encontraron resultados.

### 2.4 Pie de página (común)

Institución: Instituto Nacional de Propiedad Industrial | INAPI - Chile

Contacto: Carabineros de Chile N° 195, Santiago, Chile | Tel: (56 2) 2 887 0400 | inapi@inapi.cl

Versión: v 2.3.83.0

---

## 3. Resumen editorial y observaciones generales

**Observaciones (para `observaciones_lc` u hilo de demo):** la pantalla de notificaciones concentra el mayor número de hallazgos del grupo (13 criterios incumplidos entre 29 aplicables). Destacan: modal de advertencia denso, jerga legal sin acompañamiento, frases largas y mezcla de ideas; exposición del RUN completo; duplicidad de titulares entre estados con/sin filtros; mayúsculas sostenidas en controles; enlaces poco descriptivos en contexto.

---

## 4. Criterios que no aplican (10)

Justificación breve según informe; en JSON cada uno va con `estado: "no_aplica"`.

| ID | Motivo (resumen) |
| --- | --- |
| **B7** | Sin frases de relleno corporativo detectadas en el foco evaluado. |
| **C6** | El modal se compone de párrafos breves; no aplica resumen ejecutivo adicional en el sentido del criterio. |
| **C7** | No hay listado de requisitos en infinitivo que evaluar en esta pantalla. |
| **D6** | Uso de negrita razonable (p. ej. en referencias normativas), no excesivo. |
| **E2** | Autoría institucional clara en cabecera y pie. |
| **E4** | El título representa el contenido de la pantalla. |
| **F1** | CTAs son acciones funcionales, no duplican nombres de página destino en el sentido del criterio. |
| **G2** | Información ARCO vía política de privacidad enlazada en pie. |
| **G3** | Términos de uso enlazados en pie. |
| **H1** | No hay versiones previas de contenido comparables. |

---

## 5. Criterios aplicables — incumplidos (13)

En JSON: `estado: "incumple"` y rellenar `severidad` / `comentario` alineados al informe y a [`criterionEvaluationSchema`](../../src/schemas/checklist.ts).

| # | ID | Severidad (ref.) | Problema (resumen) |
| --- | --- | --- | --- |
| 1 | **D7** | Alta | Mayúsculas sostenidas en cabeceras, pestañas y botones (p. ej. MARCAS, PATENTES, BUSCAR, LIMPIAR, VER ESTADO DIARIO MARCAS). |
| 2 | **B2** | Alta | Jerga legal densa en el modal sin definiciones (notificación legal, estado diario, demanda de oposición, etc.). |
| 3 | **B3** | Media | Siglas y referencias (INAPI, Resolución Exenta 138) sin primera definición en contexto. |
| 4 | **B1** | Media | Voz pasiva predominante en tramos del modal y formulario. |
| 5 | **C3** | Media | Oración muy larga (>50 palabras) sin subdivisión en el modal. |
| 6 | **C4** | Media | Modal mezcla tres ideas: aviso legal, casos de notificación electrónica obligatoria, remisión a manual. |
| 7 | **A3** | Baja | Titulares duplicados o redundantes entre vista sin filtros y con filtros. |
| 8 | **D5** | Baja | Bloque de campos sin estructura clara de enumeración (listas/tablas) para lo que debe completarse. |
| 9 | **G1** | Alta | RUN completo visible (minimización de datos personales). |
| 10 | **E3** | Baja | Falta fecha de actualización visible para el contenido editorial global de la página (más allá de “última actualización de notificaciones”). |
| 11 | **F3** | Media | CTA en mayúsculas y destino del enlace poco explicitado. |
| 12 | **F4** | Baja | Enlace en modal sin contexto de apertura / formato / peso cuando aplica. |
| 13 | **E1** | Baja | Referencia obsoleta a «Twitter» en pie (marca renombrada). |

*(La tabla ampliada del informe con citas textuales fila a fila quedó en las capturas del expediente; al implementar, copiar comentarios literales desde ahí si se requiere máxima fidelidad.)*

---

## 6. Criterios aplicables — cumplen (16)

Estado `cumple` en JSON. Lista de IDs **aplicables** que **no** figuran en la sección 5:

**A1, A2, A4, A5, B4, B5, B6, C1, C2, C5, D1, D2, D3, D4, F2, F5**

(Es decir: del conjunto aplicable declarado en el informe, se excluyen los 13 incumplidos de la sección 5.)

**Conjunto aplicable explícito (29)** según informe, para cruzar con código:

A1, A2, A3, A4, A5, B1, B2, B3, B4, B5, B6, C1, C2, C3, C4, C5, D1, D2, D3, D4, D5, D7, E1, E3, F2, F3, F4, F5, G1.

---

## 7. Texto propuesto (para campo `texto_propuesto`)

Versión editorial de reescritura; formato libre en el contrato (string). Resumen estructurado:

**Encabezado**

- Trámites y Servicios — Notificaciones Electrónicas
- [Marcas] [Patentes] Fernando Arriagada

#### Aviso importante (modal inicial)

Las notificaciones electrónicas y los avisos por correo no reemplazan la notificación legal oficial.

La notificación legal se hace por **estado diario** (Art. 13, Ley 19.039).

Solo se notifican electrónicamente:

- La demanda de oposición
- La observación de fondo
- La resolución que acepta el registro

Para todos los demás casos, revise siempre los estados diarios en tramites.inapi.cl/EstadosDiariosMarcas.

[Más información en la Resolución Exenta 138]  
[Entendido]

#### Notificaciones electrónicas de marcas

[Marcas (seleccionada)] [Patentes]

[Mostrar filtros de búsqueda ▼]

En esta pantalla puede revisar las notificaciones que INAPI le envió.

**Filtros**

- Número de solicitud: [Campo de texto]
- Fecha de notificación desde: [Fecha]
- Fecha de notificación hasta: [Fecha]
- Titular o solicitante: [Campo de texto]

**Datos del usuario**

- Nombre: Fernando Arriagada Castillo
- RUN: 18.•••.•••-0 (parcialmente oculto)
- Última actualización: 11/05/2026 08:00

[Buscar] [Limpiar] [Ver estado diario de marcas]

**Resultados:** No se encontraron resultados con los filtros aplicados.

[Footer institucional estándar — ver formato URL 3]

---

## 8. Sugerencia de identificador de fixture (implementación)

| Uso | Valor sugerido |
| --- | --- |
| **Nombre de archivo** | `audit_fixture_notificaciones_marcas_rechazado.json` (o convención acordada en `data/audit-fixtures/README.md`) |
| **Campo `id` dentro del JSON** | Mismo slug estable, p. ej. `audit_fixture_notificaciones_marcas_rechazado` |
| **Query UI** | `?fixture=audit_fixture_notificaciones_marcas_rechazado` (cuando exista selector / API) |

---

## 9. Relación con otros fixtures de la Fase 1

Este documento cubre **solo la franja rechazada (≤80 %)** con evidencia de informe real.

Los fixtures para **81–90 %** y **≥91 %** deben documentarse con el **mismo esquema de secciones** cuando existan informes cerrados para las URLs candidatas; ver plan versionado en [`docs/development/plan-fixtures-auditoria-fase1.md`](../development/plan-fixtures-auditoria-fase1.md) y la tabla de prioridades en [`inventario-urls-clarity.md`](inventario-urls-clarity.md).

---

*Documento creado para alinear informe editorial humano con el contrato `StrictAuditRecord`. Última revisión: 2026-05-21.*
