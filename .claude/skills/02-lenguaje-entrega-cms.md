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
| **Texto en pantalla** | Literal que ve el ciudadano, o `(ausencia)` / `—` si no hay |
| **Corrección propuesta** | Texto listo para pegar en el CMS, o instrucción «Añadir / Quitar / Mover…» |
| **Ubicación en pantalla** | «Cabecera › menú Marcas › ítem …» — nunca solo `T042` o un selector CSS |
| **Justificación / motivo** | Una o dos frases: por qué incumple o por qué cumple el criterio |
| **Resumen / nota TIC** | Problema + qué hacer; TI al final si hace falta ancla técnica |

## Prohibido

Jerga de orquestación, HTML como único hallazgo, “cumple según skill”, mensajes vacíos, inventar KB de PDFs.

## Chequeo rápido

Si Equipo UX no entiende la fila en 10 segundos → reescribir con esta skill.
