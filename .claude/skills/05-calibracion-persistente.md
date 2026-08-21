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
| `../CLAUDE.md` | §2 calibraciones de producto |
| Sub-subagente 3 | Refuerza veracidad alineada a calibraciones |

## Procedimiento

1. **Leer** todas las entradas `estado: vigente` del Prompt 6.  
2. **Aplicar** antes de fijar `cumple`/`incumple` en criterios afectados.  
3. **Reauditoría:** precedentes / JSON antiguos = apoyo; **nunca** sustituyen captura Playwright + inventario + 15+5 sobre el DOM actual (ver Prompt 6 C-2026-08-21).  
4. Si la sesión descubre un patrón nuevo validado con evidencia: **proponer** bloque nuevo en Prompt 6 (plantilla del propio archivo).  
5. No contradecir una calibración vigente sin acuerdo explícito documentado (nueva entrada que supersede la anterior).

## Efecto deseado

Misma rigurosidad en META MEI 1…10: less “olvido” entre Portada y SIAC; más coherencia en Excel/UI/PDF; % puede bajar si se recuperan hallazgos omitidos por atajo.
