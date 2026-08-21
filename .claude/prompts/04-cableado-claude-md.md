# Prompt 4 — Uso de CLAUDE.md y cableado de archivos

## Qué es

Guía de **cómo Claude Code debe leer `CLAUDE.md`** y cablear prompts, skills, diagramas, datos y frontend. Evita sesiones “sueltas” que olvidan reglas o archivos.

## Objetivo

Que toda auditoría parta de la constitución del repo y respete el grafo de dependencias.

## Cableado (mapa maestro)

```
Usuario / Equipo UX
        │
        ▼
05-audit-maestro-url.md  ←── se pega en Claude Code
        │
        ├── lee CLAUDE.md (reglas §5, §12, §17, §19–§23)
        ├── aplica 06-calibracion-hallazgos.md (siempre)
        ├── usa Prompt 1 (stack) + Skill 01/04 (RAG)
        ├── usa Prompt 2 (criterios/hitos) + Skill 03 (subagentes)
        ├── usa Prompt 3 (entrega) + Skill 02/05
        ├── diagrama: diagrams/workflow_diagram.md
        ├── datos: checklist-criteria-lc-ptd.json · checklist-editorial-ptd-v2.json
        └── salida → data/claude-audits/ → UI / PDF / Excel
```

| Archivo | Rol |
| --- | --- |
| `../CLAUDE.md` | **Regula** — qué está permitido y cómo se puntúa |
| `01`…`06` prompts | **Disparan** etapas (orquestación → maestro → calibración) |
| `skills/01`…`05` | **Especializan** (documentos, lenguaje, subagentes, vectores, persistencia) |
| `diagrams/workflow_diagram.md` | Vista gráfica del mismo contrato |
| `data/*` + `src/schemas/*` | Verdad de criterios y validación Zod |
| Frontend / MEI export | **Muestran**; no auditan |

## Reglas de lectura

1. Al inicio de sesión: cargar `CLAUDE.md` completo (o §1–§5 + §12 + §17 + §20–§23 como mínimo).
2. **Antes** de marcar estados: leer `06-calibracion-hallazgos.md` + skill `05-calibracion-persistente.md`.
3. No inventar rutas: si un archivo no existe, no “simularlo”; reportar y usar el canónico.
4. Preferir siempre los nombres numerados `prompts/01`…`06` y `skills/01`…`05` (no hay prompts `audit-*` ni skills `auditoria-*` / `pesquisa-*` legacy).
5. Multi-URL META MEI: una sesión = Prompt 5 por URL (orden en `mei-meta-mei-urls.ts`); leer Prompt 6 en cada una.

## Salida

Confirmación de cableado leído + lista de archivos que se usarán en la sesión, luego ejecutar Prompt 5.
