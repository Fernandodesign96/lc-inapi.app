# Skill 2 — Lenguaje de entrega (CMS / Equipo UX / jefatura)

## Qué es

Skill para escribir **resultados entendibles** para personas que no son de desarrollo ni TI: texto en pantalla, corrección propuesta, ubicación, justificación, resúmenes y notas.

## Cuándo activar

- Al rellenar `sustituciones[]` y comentarios.  
- En los **sub-subagentes 1 y 2** de entrega (§17.2).  
- Antes de `validate:claude-audits` (gate legibilidad).

## Cableado

| Pieza | Relación |
| --- | --- |
| `../CLAUDE.md` | §22 entrega CMS |
| `../prompts/03-entrega-resultados.md` | Columnas UI/PDF/Excel |
| `../prompts/05-audit-maestro-url.md` | Paso E |
| Sub-subagente 2 | Dueño principal de esta skill |

## Reglas de redacción

| Campo | Cómo escribirlo |
| --- | --- |
| **Texto en pantalla** | Literal que ve el ciudadano, o `No hay texto que cumpla con este requisito` (JSON interno: `(ausencia)`) / `—` si no hay evidencia que citar |
| **Corrección propuesta** | Texto listo para pegar en el CMS, o instrucción «Añadir / Quitar / Mover…» |
| **Ubicación en pantalla** | Ruta humana **zona › elemento › «rótulo»** (ej. `Pie de página › enlace «Política de privacidad»`). **Nunca** solo `T042`, un selector CSS, ni palabras sueltas (`el enlace`, `el bloque`). Obligatoria y específica si hay Texto en pantalla. |
| **Justificación / motivo** | Una o dos frases: por qué incumple o por qué cumple el criterio |
| **Resumen / nota TIC** | Problema + qué hacer; TI al final si hace falta ancla técnica |

## Tipografía, pesos y formato (obligatorio al mencionarlos)

Si se habla de títulos, alineación, negrita, cursiva u otros estilos, usar el rol + literal + término CMS (ES + EN):

| Concepto | Forma canónica |
| --- | --- |
| Título principal | `título H1 'x'` |
| Subtítulo | `subtítulo h2 'y'` · `subtítulo h3 '…'` |
| Alineación | `Alineado a la izquierda (align left)` · `Justificado (justify)` |
| Estilos | `el texto en negrita (bold) 'x'` · `el texto en cursiva (italic) 'y'` · `el texto sin negrita 'x'` |

Ejemplo bueno: «Cambiar el título H1 'Observancia' a lenguaje cotidiano; dejar el texto en negrita (bold) 'INAPI' en el pie.»  
La entrega (UI/PDF/Excel) pasa por `normalizarLenguajeTipografiaCms` para unificar frases frecuentes.

## Prohibido

Jerga de orquestación, HTML como único hallazgo, “cumple según skill”, mensajes vacíos, inventar KB de PDFs.

## Chequeo rápido

Si Equipo UX no entiende la fila en 10 segundos → reescribir con esta skill.
