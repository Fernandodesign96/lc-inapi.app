# Diagrama de orquestación — Claude Code (lc-inapi-app)

## Qué es

Mapa visual del workflow PTD-LC v3.0 (**51** `LC-*`): prompts 01–07, skills 01–06, **§17.1bis** (texto ascendente), **15 subagentes** (indicadores) y **5 sub-subagentes** (entrega).

## Cableado `.claude/`

| Pieza | Rol |
| --- | --- |
| `CLAUDE.md` | Constitución · §5 · **§17** · §12 · §19–§23 |
| `prompts/01`…`07` | Orquestación → criterios → entrega → cableado → **maestro** → calibración → **texto ascendente** |
| `skills/01`…`06` | Documentos/RAG · lenguaje CMS · subagentes · Xenova · calibración · texto ascendente |
| Texto ascendente | §17.1bis — palabra→párrafo (Paso D0) |
| Subagentes | §17.1 — un indicador IEW/IESD por vez (orden 1→15) |
| Sub-subagentes | §17.2 — calidad de textos, tono, veracidad, Excel, higiene |
| Frontend / MEI | Consumen JSON |

```mermaid
flowchart TB
  subgraph hub[".claude"]
    CM[CLAUDE.md]
    P5[05-audit-maestro-url]
    P6[06-calibracion]
    P7[07-texto-ascendente]
    P1[01-stack]
    P2[02-criterios]
    P3[03-entrega]
    P4[04-cableado]
    S1[skill-01]
    S2[skill-02]
    S3[skill-03]
    S4[skill-04]
    S5[skill-05]
    S6[skill-06]
  end
  U[Usuario] --> P5
  P5 --> CM
  P5 --> P6
  P5 --> P7
  P5 --> P1
  P5 --> P2
  P5 --> P3
  P5 --> P4
  P5 --> S1
  P5 --> S2
  P5 --> S3
  P5 --> S4
  P5 --> S5
  P5 --> S6
```

## Flujo 1 URL

```mermaid
flowchart LR
  A[Stack + Playwright] --> B[Inventario R+U]
  B --> C[Calibración + RAG]
  C --> D0[Texto ascendente §17.1bis]
  D0 --> D[15 subagentes en orden]
  D --> E[5 sub-subagentes entrega]
  E --> F[JSON + validate]
  F --> G[UI / PDF / Excel]
```

## Etapa D0 — Análisis textual ascendente

Palabra/concepto → frase → oración → párrafo/etapas → forma.  
Prompt: `07-analisis-texto-ascendente.md` · Skill: `06-analisis-texto-ascendente.md` · CLAUDE.md §17.1bis.

## Etapa D — Subagentes (evaluación)

Orden: Fiabilidad → … → Archivo (tabla CLAUDE.md §17.1).  
Skill: `03-instrucciones-subagentes-instrumentos.md`. Consumen el mapa D0.

## Etapa E — Sub-subagentes (entrega)

1 Evidencia · 2 Lenguaje · 3 Veracidad · 4 Estructura Excel · 5 Higiene/sensibles.  
Skills: `02`, `05` · Prompt `03`.

## Multi-URL

Repetir Prompt 5 una vez por URL (orden `mei-meta-mei-urls.ts`). Leer Prompt 6 y ejecutar D0 en cada sesión.

## Recordatorio

**Prompts disparan · CLAUDE.md regula · skills especializan · D0 mapea texto · subagentes evalúan · sub-subagentes pulen · RAG fundamenta · frontend muestra.**

- Maestro: `../prompts/05-audit-maestro-url.md`  
- Calibración: `../prompts/06-calibracion-hallazgos.md`  
- Texto ascendente: `../prompts/07-analisis-texto-ascendente.md`
