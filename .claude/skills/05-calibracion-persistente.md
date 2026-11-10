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

1. **Leer** todas las entradas `estado: vigente` del Prompt 6 (**hasta C-2026-11-10a inclusive**).  
2. **Aplicar** antes de fijar `cumple`/`incumple` en criterios afectados.  
3. **Reauditoría:** precedentes / JSON antiguos = apoyo; **nunca** sustituyen captura Playwright + inventario + **D0 (§17.1bis)** + 15+5 sobre el DOM actual (ver Prompt 6 C-2026-08-21 / C-2026-08-22).  
4. **Jerga INAPI:** no «pulir» tasas/examen de forma/fondo/cobertura sin definir. Conceptos oficiales: **mismo nombre + glosa** (C-2026-11-04c); no reescribir misión/visión/valores. Usar el mapa D0 (Prompt 7).  
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
16. **Escaneo ≠ negritas + literales de esta URL (C-2026-08-25l):** 38 ≠ 39; no cruzar filas de negrita al escaneo; una fila de negrita por párrafo distinto; Texto/Ubicación/Propuesto/Justificación solo con lo literal/visible de la URL auditada (prohibido alt no visible o datos de otra URL).  
17. **No repetir entre criterios (C-2026-08-26a):** al cerrar cada criterio, contrastar con filas/justificaciones ya escritas; propuesto/justificación complementarios o agrupación solo si el propuesto es idéntico; rigor a la pregunta del instrumento.  
18. **Origen ↔ destino (C-2026-11-04a):** en hubs, leer la URL de destino (1 clic); alinear definiciones, etapas, tasas y H1/miga; Texto en pantalla = solo esta URL; replicar el propuesto en el destino vía motivo/`nota_final_tic`.  
19. **Datos clave incompletos (C-2026-11-04b):** tarjetas que solo cubren qué/cómo → añadir dónde, para quién, cuándo y cuánto (tasas completas, Diario Oficial). Título «Para Informarse» → título que anticipe el contenido.  
20. **Conceptos oficiales (C-2026-11-04c):** no borrar Observancia, Sistema de Madrid, Sello de Origen, Dominio Público, PCT; glosa al pasar el cursor en menú y término+glosa en H1. CTA genérico sí se cambia. **No** reescribir misión/visión/valores (ley).  
21. **Fecha en el pie (C-2026-11-04d):** «Actualizado: DD de mes de AAAA» junto al © cumple; el © solo no.  
22. **LINK EXTERNO (C-2026-11-04e):** `href="#"` → eliminar (selector del panel login).  
23. **Noticias (C-2026-11-04f):** corregir artículos aunque hayan salido del listado; fechas con «de»; «Home» → «Inicio».  
24. **Plazos/canales + copy CMS (C-2026-11-05a):** plazos/confirmaciones con evidencia ops o literal; propuesto = copy pegable (no «Hacer que…»); título en mayúsculas: fidelidad ≠ tipografía; SIAC: correo automático + 4 días hábiles + disclaimer junto al formulario.  
25. **ClaveÚnica Estado (C-2026-11-05b):** no cambiar texto/forma del botón-widget Clave Única (Estado).  
26. **Fecha en pie (C-2026-11-05c):** «Actualizado:…» solo junto al © del footer.
27. **Mismo texto → propuesta final (C-2026-11-09a):** un nodo/literal = una solicitud Word con el `propuesto` más completo; listar todos los criterios; no encadenar borradores.  
28. **Avisos sistemas (C-2026-11-09b / C-2026-11-10a):** agrupar IDs solo si el copy es el mismo salvo fecha/hora; no unificar el `propuesto`; reforzar TGR/ClaveÚnica/Clave INAPI/MFA/Custodia/etc.; 51 criterios por cada una de las 130 líneas; entrega HTML original + propuesto + vista tipográfica.  
29. Si la sesión descubre un patrón nuevo validado con evidencia: **proponer** bloque nuevo en Prompt 6 (plantilla del propio archivo).  
30. No contradecir una calibración vigente sin acuerdo explícito documentado (nueva entrada que supersede la anterior).  
31. **Consistencia + commits (CLAUDE.md §5.1):** si una calibración vigente implica retocar URLs ya cerradas o la capa de entrega, **aplicar + commitear en el mismo turno** (commits separados). **Prohibido** dejar `modified` sin commit o preguntar «¿commitear / revertir / dejar?» para limpiezas de calibración vigente.

## Efecto deseado

Misma rigurosidad en META MEI 1…11: less “olvido” entre Portada y landing de trámites; más coherencia en Excel/UI/PDF; % puede bajar si se recuperan hallazgos omitidos por atajo.
