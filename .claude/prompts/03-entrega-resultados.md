# Prompt 3 — Generación de resultados (UI · PDF · Excel · validación)

## Qué es

Guía de **cómo Claude Code genera y entrega** el resultado de una URL: textos propuestos entendibles, validación del JSON, y coherencia entre **pantalla `/auditar/resultado`**, **PDF** y **Excel MEI**.

## Objetivo

Que jefatura / Equipo UX lean el mismo mensaje en los tres canales, sin jerga de desarrollo.

## Cableado

| Pieza | Relación |
| --- | --- |
| `../CLAUDE.md` | §4 contrato JSON, §12 Pasos 3–5, §22 entrega CMS |
| `05-audit-maestro-url.md` | Pasos E–F |
| `../skills/02-lenguaje-entrega-cms.md` | Redacción no técnica |
| `../skills/03-…` + §17.2 | Sub-subagentes 1–5 de calidad de entrega |
| `../prompts/07-…` + skill `06` + §17.1bis | Mapa textual que alimenta las propuestas |
| `src/lib/criterio-entrega-campos.ts` | Campos compartidos UI/PDF/Excel |
| `src/lib/ptd-hito-tarea-por-criterio.ts` | Hito/Tarea PTD al final de cada fila |
| `src/lib/mei-export/*` | Excel detalle |
| `frontend/.../resultado/page.tsx` · `informe-piloto-pdf-document.tsx` | UI y PDF |
| `bun run validate:claude-audits` | Gate Zod |

---

## Orden de columnas (UI + PDF) — alineado al Excel

1. Instrumento de evaluación  
2. Estado  
3. Texto en pantalla  
4. Corrección propuesta  
5. Ubicación en pantalla  
6. Comentario / justificación  
7. Criterio  
8. **Hito PTD**  
9. **Tarea PTD**  

Excel detalle añade Página, Dirección, Categoría y Línea/ref. técnica; las columnas de evidencia y PTD siguen la misma lógica.

## Lenguaje de entrega (obligatorio)

- Audiencia: editor CMS / UX / jefatura — **no** desarrollador.
- Prohibido en `propuesto` / `motivo` / `comentario` / `ubicacion_pantalla`: «subagente», «§17», selectores CSS como único mensaje, HTML crudo como hallazgo.
- Casillas no vacías (§22.8). Realismo (§22.9): no forzar defectos donde el criterio no cabe.

## Validación JSON

```bash
# Guardar en:
# data/claude-audits/{sitioweb|tramites}/{YYYY-MM-DD}/{id}.json

bun run validate:claude-audits
```

Requisitos v3.0: exactamente **51** filas `LC-*` en `criterios_evaluados`, estados cerrados, severidad solo en `incumple`, cobertura ≥1 sustitución por cada `incumple`.

**Varias correcciones por criterio:** si un mismo `LC-*` incumple en textos distintos, el JSON lleva **N** entradas en `sustituciones[]` con el mismo `criterio_id`. UI, PDF y Excel (`buildSustitucionesPorCriterio` + `mei-row-builder`) emiten **N filas de entrega** — no solo la primera. El % sigue contando el criterio una sola vez.

## Cableado UI

Tras validar, actualizar launch / META MEI (`mei-meta-mei-urls.ts`, `claude-audits-launch.ts`, `clarity-audits-launch.ts` según la serie) para que `/auditar` muestre «Disponible».

## Sub-subagentes de entrega (después de evaluar)

Ver CLAUDE.md §17.2: cinco especialistas que pulen textos, tono ciudadano, veracidad, estructura Excel y higiene/datos sensibles **antes** de validar y commitear.

## Salida

JSON canónico válido + filas listas para UI/PDF/Excel + commit atómico de la URL.
