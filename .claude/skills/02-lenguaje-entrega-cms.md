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
| **Texto en pantalla** | Literal que ve el ciudadano (C-2026-08-25d). **Nunca** la pregunta del criterio ni `Criterio N: «…» — Instrumento M`. Si **cumple**, citar lo que evidencia el sí. Si no hay literal que cumpla: `No hay texto que cumpla con este requisito` (JSON interno: `(ausencia)`). Evitar `—` cuando la justificación ya describe nodos visibles. **Negritas (C-2026-08-25j):** si el párrafo existe sin negrita, citar el párrafo completo, no `(sin negrita…)`. **Paréntesis:** no meter explicaciones entre paréntesis; solo un campo cuyo único contenido sea una frase parentética de ausencia. **Citas negadas (C-2026-08-25k):** si la justificación dice que *no* hay «en construcción» / «próximamente», **no** poner esas palabras en Texto; citar evidencia positiva. Prohibido meta `(once párrafos…)` / `(estructura actual…)` como Texto. |
| **Corrección propuesta** | Texto listo para pegar en el CMS, o instrucción «Añadir / Quitar / Mover…». **Sin** meta entre paréntesis («formato de oración…», «consistente con…», «según calibración…»). No repetir el mismo bloque largo en criterios secundarios del mismo nodo: ahí, enfoque alineado a **esa** pregunta. |
| **Ubicación en pantalla** | Ruta humana **zona › elemento › «rótulo»** (ej. `Sección «Para Informarse», tarjeta «Cómo registrar una marca»`; `Pie de página › enlace «Política de privacidad»`). **Nunca** `T042`, `T008–T011`, selectores CSS, ni palabras sueltas (`el enlace`, `el bloque`). |
| **Justificación / motivo** | Responde la pregunta del criterio con literales o zona humana. Referencias: «criterio 4», no `LC-*`. **Prohibido:** mapa D0, Prompt N, C-YYYY, Tnnn, `applicability`, códigos IEW/IESD sueltos (si se nombra un instrumento: nombre completo + sigla). **Prohibido** pegar instrucciones («indicar Cabecera…»). |
| **Resumen / nota TIC** | Problema + qué hacer; TI al final si hace falta ancla técnica |

## Tipografía, pesos y formato (obligatorio al mencionarlos)

Si se habla de títulos, alineación, negrita, cursiva u otros estilos, usar **palabras claras** (sin H1/H2, CSS ni inglés técnico):

| Concepto | Forma canónica |
| --- | --- |
| Título principal | `título principal 'x'` |
| Subtítulo | `subtítulo 'y'` · `título de apartado '…'` |
| Alineación | `Alineado a la izquierda` · `Justificado` |
| Estilos | `el texto en negrita 'x'` · `el texto en cursiva 'y'` · `el texto sin negrita 'x'` |
| Zonas frecuentes | `zona superior destacada` · `ventana emergente` · `pie de página` · `cabecera` |

Ejemplo bueno: «Cambiar el título principal 'Observancia' a lenguaje cotidiano; dejar el texto en negrita 'INAPI' en el pie.»  
La entrega (UI/PDF/Excel) pasa por `normalizarLenguajeTipografiaCms` para unificar frases frecuentes (también convierte H1/hero/modal si el JSON aún los trae).

## Prohibido

Jerga de orquestación, HTML como único hallazgo, “cumple según skill”, mensajes vacíos, inventar KB de PDFs.  
Ids de inventario (`Tnnn`), «mapa D0», «Prompt N», `C-YYYY-…`, códigos `LC-*` e IEW/IESD en campos de entrega.  
Meta-comentarios dentro de la corrección propuesta; «Corregir incumplimiento de LC-…».  
En entrega: **no** usar H1/H2/H3, `hero`, `modal`, `footer`, `bold`, `align left` ni selectores CSS.
Encabezado de criterio: `Criterio N: … — Instrumento M: Nombre` — no «Dimensión: … 1.1.3 / 5.1.3» ni paréntesis.

## Chequeo rápido

Si Equipo UX no entiende la fila en 10 segundos → reescribir con esta skill.
