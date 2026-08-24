# Prompt 2 — Criterios LC, hitos/tareas META MEI y correcciones

## Qué es

Guía de **cómo aplicar los 51 criterios** `LC-*`, cómo se anclan a **hitos y tareas** del Plan de Transformación Digital (META MEI / OpenProject), cómo proponer correcciones según severidad, y cómo obtener texto original y ubicación con Playwright.

## Objetivo

Que la evaluación sea completa (51 filas), trazable a hito/tarea PTD, y accionable para quien edita el CMS.

## Cableado

| Pieza | Relación |
| --- | --- |
| `../CLAUDE.md` | §2 indicadores, §5 reglas, §17 subagentes, §20–§22 |
| `05-audit-maestro-url.md` | Ejecuta este contrato en Pasos B–D |
| `06-calibracion-hallazgos.md` | Ajustes persistentes que modifican juicios |
| `../skills/03-instrucciones-subagentes-instrumentos.md` | Cómo lanzar 1 subagente = 1 indicador |
| `../skills/02-lenguaje-entrega-cms.md` | Cómo redactar propuesta/justificación |
| `data/checklist-criteria-lc-ptd.json` | 51 criterios (fuente de score) |
| `data/checklist-editorial-ptd-v2.json` | Hito → Tarea → Indicador → Pregunta |
| `docs/checklist-ptd-v2-mapa.md` | Mapa IEW ↔ IESD |
| `src/lib/ptd-hito-tarea-por-criterio.ts` | Columnas Hito/Tarea PTD en UI/Excel/PDF |

**Entrega (UI/PDF/Excel):** columnas **Hito PTD** / **Tarea PTD** desde `ptd-hito-tarea-por-criterio.ts` + `checklist-editorial-ptd-v2.json`.

| Criterios | Hito | Tarea |
| --- | --- | --- |
| Fiabilidad `LC-1.1.1-*` | **500** | **499** |
| Completitud `LC-1.1.2-*` | **492** | **491** (única ancla PTD; sí se muestra) |
| Lenguaje plano `LC-1.1.3-*` | **496** | **495** |
| Redacción `LC-1.1.5-*` | **494** | **493** |
| Privacidad RUN/teléfonos `LC-1.1.7-01/02` | **505** | **503** |
| Privacidad ARCO `LC-1.1.7-03` | **505** | **504** (solo esta pregunta) |
| Sensibles identidad menores `LC-1.1.8-01` | **513** | **510** |
| Sensibles aptitud menores `LC-1.1.8-02` | **513** | **511** |
| Sensibles susceptibilidad `LC-1.1.8-03` | **513** | **512** |

**Sin solape:** el Hito **494** solo lleva Redacción (`1.1.5`); el Hito **496** solo lleva Lenguaje plano (`1.1.3`); Tarea **504** solo ARCO; tareas **510/511/512** una pregunta cada una. El resto de preguntas del bloque meta **492/491** se anclan a hitos operativos donde también figuran (p. ej. Fiabilidad/Actualización → 500). No mostrar 492/491 salvo Completitud.

## Los 51 criterios y los instrumentos

- **15 indicadores únicos** (IEW dimensión 1). El IESD (dimensión 5) repite **13** con códigos `5.x.x`.
- **Exclusivos IEW:** `1.1.8` Contenidos sensibles · `1.3.1` Visualización.
- Cada pregunta única del catálogo es un id `LC-*`. La misma pregunta bajo varios hitos PTD se responde **una** vez por URL.
- En la entrega (UI/Excel/PDF) cada fila muestra **Hito PTD** y **Tarea PTD** asociados (pueden ser varios, unidos con ` | `).

## Estados y severidad → lo que ve el equipo

| JSON `estado` + `severidad` | Etiqueta UI/Excel |
| --- | --- |
| `cumple` | Cumple |
| `incumple` + `baja` | Cumple con observaciones |
| `incumple` + `media` | Medianamente cumple |
| `incumple` + `alta` | No cumple |
| `no_aplica` | No aplica (exige `comentario`) |

**Cobertura 1:1:** todo `incumple` → ≥1 fila en `sustituciones[]` con remedio realista.

## Correcciones según severidad

| Severidad | Enfoque de la propuesta |
| --- | --- |
| **alta** | Corrección prioritaria: texto o elemento concreto; ubicación humana clara; impacto ciudadano alto |
| **media** | Corrección importante pero no bloqueante; propuesta pegable o instrucción CMS precisa |
| **baja** | Observación menor; mejora de claridad/tono sin dramatizar |

Tipos: Sustitución · Inserción · Eliminación · Reorden · Enlace/rótulo (ver CLAUDE.md §12).

## Playwright: texto original y ubicación

1. Inventario visible `T001…` (capa R = redacción, capa U = formato/chrome).
2. `cita_textual` / `original` = literal que ve el ciudadano (nunca solo `<title>`/`<meta>`).
3. `ubicacion_pantalla` = ruta humana: «Pie de página › bloque contacto › enlace».
4. `linea` / `html_linea_aprox` = apoyo TI, secundario.
5. Si no hay texto (ausencia de fecha, PDF sin peso): `"—"` o `(ausencia)` + justificación clara — **no inventar** citas.

## Subagentes (evaluación)

**Antes:** Paso D0 — análisis textual ascendente (CLAUDE.md §17.1bis + Prompt 7 + skill `06`).

Luego Claude ejecuta **en orden** un **subagente por indicador** (15 únicos), cada uno con el mapa D0. Cada uno responde **todas** las preguntas `LC-*` de ese indicador (IEW + variantes IESD aplicables). Detalle: CLAUDE.md §17.1 y skill `03-…`.

## Salida

Mapa D0 + tabla mental de 51 evaluaciones + borrador de `sustituciones[]` por indicador, listo para consolidar y pasar por los **sub-subagentes de entrega** (§17.2).
