# Skill 3 — Instrucciones a subagentes (instrumentos IEW/IESD)

## Qué es

Skill para que Claude Code dé **instrucciones correctas a los subagentes**: un subagente = un **indicador** de evaluación; reconoce cumple / incumple / no_aplica a partir de lo que Playwright entregó.

## Cuándo activar

- Prompt 5, Paso D (evaluación secuencial).  
- Al armar el mensaje de contexto de cada subagente.

## Cableado

| Pieza | Relación |
| --- | --- |
| `../CLAUDE.md` | §2 tabla indicadores, **§17.1** |
| `../prompts/02-criterios-hitos-correcciones.md` | Contrato de criterios |
| `../prompts/05-audit-maestro-url.md` | Paso D |
| `data/checklist-criteria-lc-ptd.json` | Preguntas por indicador |

## Los 15 subagentes (orden fijo)

| # | Indicador | IEW | IESD | Notas |
| --- | --- | --- | --- | --- |
| 1 | Fiabilidad | 1.1.1 | 5.1.1 | Dual |
| 2 | Completitud | 1.1.2 | 5.1.2 | Dual |
| 3 | Lenguaje plano | 1.1.3 | 5.1.3 | Dual |
| 4 | Actualización | 1.1.4 | 5.1.4 | Dual |
| 5 | Redacción y ortografía | 1.1.5 | 5.1.5 | Dual (IEW tiene conectores) |
| 6 | Propiedad intelectual | 1.1.6 | 5.1.6 | Dual |
| 7 | Privacidad y datos personales | 1.1.7 | 5.1.7 | Dual |
| 8 | Contenidos sensibles | 1.1.8 | — | **Solo IEW** |
| 9 | Claridad | 1.2.1 | 5.2.1 | Dual (+ variante IESD) |
| 10 | Concisión | 1.2.2 | 5.2.2 | Dual (+ variante IESD) |
| 11 | Legibilidad | 1.2.3 | 5.2.3 | Dual |
| 12 | Escritura para la web | 1.2.4 | 5.2.4 | Dual (+ rótulos IESD) |
| 13 | Visualización | 1.3.1 | — | **Solo IEW** |
| 14 | Objetividad | 1.3.2 | 5.3.1 | Dual |
| 15 | Archivo | 1.3.3 | 5.3.2 | Dual |

**Total sin repetir:** 15 indicadores. Preguntas únicas en el score: **51**.

## Plantilla de instrucción al subagente N

```
Eres el subagente del indicador «{nombre}» (IEW {código}[/ IESD {código}]).
URL: … | tipo_pagina: … | captura_con_sesion: …

Inventario R+U (completo): …
Calibraciones vigentes (Prompt 06): …

Evalúa SOLO los criterios LC-* de este indicador listados en checklist-criteria-lc-ptd.json.
Incluye variantes IESD si applicability lo pide.
Para cada uno: cumple | incumple | no_aplica con evidencia VISIBLE de Playwright.
Si incumple: severidad + borrador de sustitución (texto, ubicación humana, propuesta).
No evalúes otros indicadores. No calcules el % global.
Aplica Prompt 06. Entrega filas listas para consolidar.
```

## Reconocer estados desde Playwright

| Señal | Estado típico |
| --- | --- |
| Evidencia positiva visible que responde la pregunta | `cumple` (+ `cita_textual` / ubicación si hay texto) |
| Defecto visible o ausencia de algo obligatorio | `incumple` + severidad + sustitución |
| La página no es del tipo que pregunta el criterio | `no_aplica` + `comentario` breve |
| Solo aparece en METADATA (`<title>`, meta) | Fuera de alcance — no usar como prueba |

## Después de los 15

Pasar el borrador a los **5 sub-subagentes de entrega** (§17.2) — no confundirlos con estos subagentes de indicador.
