# Prompt 7 — Análisis textual ascendente (palabra → párrafo)

## Qué es

Contrato para examinar el contenido **VISIBLE** de la URL **unidad por unidad**, en orden **ascendente de granularidad**: palabra/concepto → frase breve → frase larga → oración → párrafo (y bloques mayores si aplica). En cada nivel se decide si algún criterio `LC-*` aplica y qué corrección CMS proponer.

## Para qué

Evitar que Claude Code «salte» jerga, títulos cortos o etapas sin explicar. Fuerza a mirar primero el término técnico y, con contexto creciente, construir una propuesta que **defina, reemplace o desarrolle** lo que el ciudadano no entiende — no solo pulir la redacción.

## Objetivo

Un mapa de unidades textuales + hallazgos provisionales que alimente a los **15 subagentes** (§17.1) y a los **5 sub-subagentes** de entrega (§17.2), con la misma rigurosidad en Portada, Marcas, Patentes, etc.

## Importancia

Complementa Prompt 6 (calibraciones Marcas/Portada: tasas, etapas, cobertura, Observancia). Sin este pase, se siguen pasando por alto palabras sueltas y bloques «entendibles» pero incompletos.

## Cableado

| Pieza | Relación |
| --- | --- |
| `05-audit-maestro-url.md` | Paso **D0** (antes de los 15 indicadores) |
| `../skills/06-analisis-texto-ascendente.md` | Cómo instruir al subagente |
| `../CLAUDE.md` | **§17.1bis** Subagente de análisis textual ascendente |
| `06-calibracion-hallazgos.md` | Reglas de jerga / tasas / títulos / cobertura |
| `02-criterios-hitos-correcciones.md` | Qué criterios pueden aplicar por nivel |
| Inventario R+U (Paso B) | Entrada: textos VISIBLE ya listados |

## Niveles (orden obligatorio)

| Nivel | Qué es | Pregunta guía | Corrección típica |
| --- | --- | --- | --- |
| **1. Palabra / concepto** | Término suelto o rótulo (ej. «Observancia», «tasas», «Cobertura») | ¿Lo entiende un ciudadano la primera vez? | **O** cambiar el concepto a lenguaje cotidiano **O** agregar definición/descripción breve (paréntesis, guiones, glosa visible) |
| **2. Frase breve** | 2–6 palabras (ej. «Tipo de cobertura») | ¿La frase es clara aunque un concepto dentro no lo sea? | Explicar el concepto opaco *in situ*; no dejar solo el rótulo |
| **3. Frase larga / oración** | Oración completa (ej. pagos de tasas en dos etapas) | ¿Tiene sentido global pero deja dudas por términos no descriptivos? | Reescribir **y** precisar (qué es tasa/derecho/tramitación; cuándo se paga) |
| **4. Párrafo / lista de etapas** | Varias oraciones o lista numerada | ¿Es «preciso» pero las partes internas no se explican? | Describir cada etapa/parte: qué ocurre, qué hace el usuario, por qué importa; definir jerga interna |
| **5. Criterios de forma** | Sobre la misma unidad | Extensión, densidad, una idea por párrafo, negritas, escaneabilidad (`LC-1.2.2-*`, `LC-1.2.3-*`, `LC-1.2.4-*`, etc.) | Ajustar forma **sin** eliminar la obligación de explicar conceptos |

## Método (por cada unidad del inventario)

1. **Identificar** la unidad más pequeña opaca (palabra/concepto técnico-jurídico INAPI).  
2. **Subir de nivel**: ver si esa unidad vive en frase → oración → párrafo.  
3. **Acumular contexto** hasta tener suficiente para proponer.  
4. **Elegir criterio(s)** `LC-*` aplicables (lenguaje plano, claridad, completitud, escritura web, concisión, legibilidad…).  
5. **Proponer** según Prompt 6: reemplazo **o** definición; etapas/pagos **completos y descritos**; títulos que anticipen contenido; atajos con descripción breve.  
6. **Registrar** en el mapa de salida (no escribir aún el JSON final de 51 filas).

## Salida del pase (mapa para Paso D)

Para cada hallazgo textual:

```
unidad_id | nivel (1–5) | texto_literal | ubicacion_pantalla
criterios_candidatos: LC-…
diagnostico: …
propuesta_cms: …   # reemplazo y/o definición/descripción; realista §22
contexto_superior: frase/oración/párrafo que la contiene (si aplica)
```

El agente raíz y los subagentes 1–15 **deben consumir este mapa**; no descartarlo por «detalle».

## Prohibido

- Saltar directo al párrafo sin haber mirado palabras/conceptos opacos.  
- «Pulir» la oración dejando la misma jerga sin definir.  
- Inventar defectos fuera del VISIBLE.  
- Usar JSON antiguos como atajo (Prompt 6 reauditoría completa).
