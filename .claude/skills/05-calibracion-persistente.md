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
7. Si la sesión descubre un patrón nuevo validado con evidencia: **proponer** bloque nuevo en Prompt 6 (plantilla del propio archivo).  
8. No contradecir una calibración vigente sin acuerdo explícito documentado (nueva entrada que supersede la anterior).

## Efecto deseado

Misma rigurosidad en META MEI 1…10: less “olvido” entre Portada y SIAC; más coherencia en Excel/UI/PDF; % puede bajar si se recuperan hallazgos omitidos por atajo.
