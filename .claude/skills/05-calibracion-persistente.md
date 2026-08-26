# Skill 5 — Calibración persistente e inteligencia entre URLs

## Qué es

Skill que hace a Claude Code **persistente**: aplicar en todas las URLs los hallazgos, correcciones y optimizaciones acordados tras revisiones manuales.

## Cuándo activar

- **Siempre** en Prompt 5 Paso C (junto con Prompt 6).  
- Tras una revisión UX de resultados (actualizar Prompt 6).  
- Al detectar el mismo error repetido en varias páginas.

## Cableado

| Pieza | Relación |
| --- | --- |
| `../prompts/06-calibracion-hallazgos.md` | **Fuente de verdad** de reglas vigentes |
| `../prompts/05-audit-maestro-url.md` | Lectura obligatoria |
| `../prompts/07-analisis-texto-ascendente.md` | Método D0 que evita omitir jerga |
| `../skills/06-analisis-texto-ascendente.md` | Cómo ejecutar D0 |
| `../CLAUDE.md` | §2 calibraciones de producto · §17.1bis |
| Sub-subagente 3 | Refuerza veracidad alineada a calibraciones |

## Procedimiento

1. **Leer** todas las entradas `estado: vigente` del Prompt 6.  
2. **Aplicar** antes de fijar `cumple`/`incumple` en criterios afectados.  
3. **Reauditoría:** precedentes / JSON antiguos = apoyo; **nunca** sustituyen captura Playwright + inventario + **D0 (§17.1bis)** + 15+5 sobre el DOM actual (ver Prompt 6 C-2026-08-21 / C-2026-08-22).  
4. **Jerga INAPI:** no «pulir» tasas/examen de forma/fondo/cobertura sin definir o reemplazar (Prompt 6 Marcas); usar el mapa D0 (Prompt 7).  
5. **Varias correcciones por criterio:** si el mismo `LC-*` falla en varios textos, el JSON debe tener N filas en `sustituciones[]`; UI/PDF/Excel las muestran todas (Prompt 6 C-2026-08-22 entrega).  
6. **Ubicación CMS (C-2026-08-24):** `ubicacion_pantalla` = `Zona › elemento › «rótulo»`; prohibido «el enlace» / «el bloque». Entrega: ausencia → «No hay texto que cumpla con este requisito». PDF editorial **sin** «Nota para el equipo TI».  
7. **Entrega solo literales (C-2026-08-25 / 25b):** sin `Tnnn` / mapa D0 / Prompt N / `C-YYYY` / **`LC-*`** / códigos IEW-IESD en campos CMS; referencias «criterio N»; encabezado `— Instrumento M: Nombre`; `cumple` con evidencia; propuestas accionables (nunca «Corregir incumplimiento de LC-…»); Trámites Marcas → frases/subtítulo.  
8. **Rótulos/CTA (`LC-5.2.4-01`, C-2026-08-25c):** evaluar en **todas** las URLs (sitioweb y trámites); prohibido `no_aplica` solo por «página informativa».  
9. **Texto ≠ pregunta (C-2026-08-25d):** «Texto en pantalla» / ubicación / propuesto / justificación **nunca** llevan la pregunta del criterio ni el encabezado `Criterio N: «…» — Instrumento M`; solo literales de la página.  
10. **Datos clave vs trámites (C-2026-08-25e):** `LC-1.1.2-03` (criterio 12) aplica a informativas/institucionales; **prohibido** `no_aplica` por «no es trámite». Ese argumento es solo de `LC-1.1.2-04` (criterio 13).  
11. **Fecha ausente = No cumple (C-2026-08-25f):** sin fecha visible → `incumple` + `severidad: alta` (nunca `media` / Medianamente cumple si la ausencia es total).  
12. **Ausencia total = No cumple (C-2026-08-25g):** si Texto en pantalla es «No hay texto que cumpla…» (p. ej. datos clave sin recuadro) → `severidad: alta`, no `media`.  
13. **Entrega ciudadana (C-2026-08-25h):** sin `Tnnn`, `applicability`, IEW/IESD sueltos ni instrucciones «(indicar Cabecera…)» en los 4 campos; criterio 15 se evalúa en hubs de trámite con justificación clara si no hay FAQ.  
14. **Negritas + paréntesis (C-2026-08-25j):** sin negrita en los párrafos citados → `severidad: alta`; Texto = literales reales, no `(sin negrita…)`. Prohibido explicaciones entre paréntesis salvo que todo el campo sea una sola frase parentética de ausencia.  
15. **Citas negadas / meta (C-2026-08-25k):** no volcar a Texto citas entre comillas que la narración niega; no usar meta `(once párrafos…)` como Texto/original.  
16. Si la sesión descubre un patrón nuevo validado con evidencia: **proponer** bloque nuevo en Prompt 6 (plantilla del propio archivo).  
17. No contradecir una calibración vigente sin acuerdo explícito documentado (nueva entrada que supersede la anterior).  
18. **Consistencia + commits (CLAUDE.md §5.1):** si una calibración vigente implica retocar URLs ya cerradas o la capa de entrega, **aplicar + commitear en el mismo turno** (commits separados). **Prohibido** dejar `modified` sin commit o preguntar «¿commitear / revertir / dejar?» para limpiezas de calibración vigente.

## Efecto deseado

Misma rigurosidad en META MEI 1…10: less “olvido” entre Portada y SIAC; más coherencia en Excel/UI/PDF; % puede bajar si se recuperan hallazgos omitidos por atajo.
