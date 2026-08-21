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

**Entrega (UI/PDF/Excel):** no mostrar **Hito 492** / **Tarea 491** (meta «implementar el checklist» — ya cubierto por los 51 `LC-*`). Las preguntas de ese bloque se anclan a los **otros** hitos/tareas donde también figuran. Completitud (`1.1.2`) solo está bajo 492 en el Word → Hito/Tarea = "—" hasta que se asocie a un hito operativo.

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

Claude ejecuta **en orden** un **subagente por indicador** (15 únicos). Cada uno responde **todas** las preguntas `LC-*` de ese indicador (IEW + variantes IESD aplicables). Detalle: CLAUDE.md §17.1 y skill `03-…`.

## Salida

Tabla mental de 51 evaluaciones + borrador de `sustituciones[]` por indicador, listo para consolidar y pasar por los **sub-subagentes de entrega** (§17.2).
