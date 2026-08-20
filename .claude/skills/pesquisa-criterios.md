# Skill: Pesquisa de Criterios

## Qué es este documento

Skill de **investigación puntual**: cómo leer el catálogo `LC-*`, cuándo abrir RAG Colección A (norma) o B (precedentes), y cómo armar un `comentario` sólido sin volcar PDFs enteros al chat.

## Para qué se utiliza

- Resolver dudas del tipo «qué dice el criterio X» o «¿incumple o `no_aplica`?».
- Buscar cómo se evaluó el mismo `LC-*` en una URL ya auditada.
- Guiar al agente raíz y a los sub-subagentes **antes** de fijar estado/severidad.

## Objetivo

Acelerar pesquisas correctas: JSON de catálogo primero, RAG después, lectura directa de auditorías cuando hace falta, siempre con nomenclatura v3.0.

## Importancia en la orquestación Claude Code

Es el puente entre **evaluación** (`auditoria-lc`) y **fundamento** (`auditoria-calidad-web` + Chroma). Sin pesquisa disciplinada, el RAG se usa mal (queries A–H obsoletas, lotes mezclados, PII en Colección B).

## Cableado (conversa con)

| Pieza | Relación |
| --- | --- |
| `../CLAUDE.md` | §5 reglas, §8 MCP, §16 `no_aplica`, §18–§19 seguridad/sesión, §23 alcance |
| `auditoria-lc.md` | Consume el resultado de la pesquisa para puntuar |
| `auditoria-calidad-web.md` | Mapa de PDFs / `source` que alimentan queries A |
| `../prompts/audit-una-url.md` | Paso C obliga catálogo + RAG; subagentes pueden invocar esta skill |
| `../prompts/audit-lote.md` / `audit-oro-s22.md` | Queries ancladas a **una** URL por sesión |
| `../diagrams/workflow_diagram.md` | Etapa RAG |
| `rag/ingest-b.ts` / `rag/README.md` | Qué indexa Colección B; re-ingestar tras cambios |

**Reglas** = CLAUDE.md §5. **Sub-subagentes** = §17 (llaman pesquisa cuando dudan de su bloque).

ADR: `docs/adr/0010-rag-local-chroma-xenova-transformers.md`

---

## Cuándo activar
- Cuando se pida «qué dice el criterio X».
- Cuando se quiera buscar en documentos normativos o precedentes de auditorías previas.
- Antes de evaluar un criterio específico en una nueva URL.
- Cuando haya dudas sobre si un hallazgo incumple o es borde de `no_aplica`.
- Cuando se quiera saber cómo se evaluó un criterio en una URL ya auditada.
- Cuando el Paso C de `audit-una-url.md` pide fundamento o precedente.

---

## Fuente primaria: `checklist-criteria-lc-ptd.json`

**SIEMPRE consultar primero `./data/checklist-criteria-lc-ptd.json`.**

Este archivo es la **fuente de verdad** de los **51** criterios LC (v3.0): indicador, pregunta (`criterion` / `display_label`), `source`, `applicability` y criticidad.

Histórico A–H: `./data/checklist-criteria.json` (solo para interpretar JSON ya emitidos v2.1).

No usar solo el RAG para criterios — el JSON es la fuente de verdad.

Al citar un criterio hacia Equipo UX / TIC, preferir el `display_label` y el formato de entrega §22 de CLAUDE.md.

```json
// Estructura de cada criterio en el JSON v3.0:
{
  "id": "LC-1.1.3-05",
  "indicator_name": "Lenguaje plano",
  "display_label": "Lenguaje plano 1.1.3 / 5.1.3 — Criterio: ¿Se define cada sigla…?",
  "criterion": "¿Se define cada sigla y acrónimo…?",
  "applicability": "ambos"
}
```

El campo `source` indica los documentos normativos donde se puede ampliar la definición en el RAG:
- `RLC` = Recomendaciones de Lenguaje Claro (`lenguaje-claro-recomendaciones.pdf`)
- `IEW` = Instrumento de evaluación de sitios web
- `IESD` = Instrumento de evaluación de servicios digitales transaccionales
- `MEI` = Meta MEI (`meta-mei.pdf`) — compromiso institucional
- `CW` = **legado v1.1** (si aparece en auditorías antiguas → meta-mei.pdf + IEW/IESD)

**Estados al decidir tras la pesquisa:** solo `cumple` \| `incumple` \| `no_aplica` (nunca `null`). Si `incumple`, proponer `severidad` baja/media/alta (UI: Cumple con observaciones / Medianamente cumple / No cumple) y borrador de sustitución CMS-first para `auditoria-lc`.

---

## RAG Colección A — contexto normativo

**Propósito:** buscar en los documentos normativos que definen los criterios.

**Documentos ingresados en Colección A** (fuente: `docs/adr/0010`):
- `meta-mei.pdf` — compromiso MEI; complementar con IEW/IESD
- `lenguaje-claro-recomendaciones.pdf` — guía de lenguaje claro Chile (`RLC`)
- `instrumento-evaluacion-sitios-web.pdf` (`IEW`)
- `instrumento-evaluacion-servicios-digitales-transaccionales.pdf` (`IESD`)
- `ui-kit-gobierno-3.0.1.pdf` — componentes de diseño del Gobierno (`UI`, opcional)

**Cuándo usar Colección A:**
- Para citar la fuente normativa exacta en el `comentario` del criterio.
- Para justificar por qué algo es incumplimiento severo vs leve (`severidad`).
- Cuando el criterio tiene `source` con `IEW`/`IESD`/`RLC`/`MEI` y necesitamos la cita completa.
- Para fundamentar una recomendación en `nota_final_tic` (lenguaje CMS + apoyo TI).

**Query recomendada:** `"{código LC-*} {concepto}"`

Ejemplos:
```
"LC-1.2.4-05 mayúsculas encabezados menú"
"LC-1.1.3-05 siglas acrónimos primera aparición"
"LC-1.1.4-01 fecha actualización contenidos"
"LC-1.2.4-07 documentos enlazados formato peso PDF"
"LC-1.1.7-01 datos personales RUN publicación web"
"LC-1.2.4-01 pirámide invertida propósito página"
```

**Cómo citar el resultado en el JSON:**
```json
"comentario": "Según IEW/IESD 5.1.3, las siglas deben definirse la primera vez que aparecen..."
```

---

## RAG Colección B — precedentes de auditorías

**Propósito:** buscar cómo se evaluó un criterio en URLs ya auditadas y detectar patrones recurrentes.

**Contenido de Colección B** (`rag/ingest-b.ts` — re-ejecutar tras actualizar catálogo/mapa/Word/auditorías):
- `data/checklist-criteria-lc-ptd.json` — **51** LC v3.0
- `data/checklist-editorial-ptd-v2.json` — Hitos → Tareas → Preguntas (LC activa; US/SE catalogadas)
- `data/checklist-criteria.json` — histórico 47 A–H
- `data/claude-audits/**/*.json` — auditorías (v3.0 = 51; históricas 47/39)
- `docs/adr/*.md`
- `docs/Checklist_Editorial_INAPI_v2_0_actualizado.extracted.md` + mapa `docs/checklist-ptd-v2-mapa.md`

**Cuándo usar Colección B:**
- Antes de evaluar una URL que comparte dominio/layout con una ya auditada.
- Borde `incumple` vs `no_aplica`.
- Calibración `LC-1.1.7-01` (RUT institucional vs persona natural).
- Formulación de `sustituciones[]` / `ubicacion_pantalla` CMS en un caso similar.

**Query recomendada:** `"{código LC-*} {url o contexto}"`

```
"LC-5.2.4-01 botones modal tramites.inapi.cl"
"LC-1.1.7-01 RUT institucional persona jurídica cumple"
"LC-1.2.4-05 mayúsculas navbar layout"
"LC-1.1.4-01 ausencia fecha actualización"
"LC-1.1.3-05 PCT patentes definición primera vez"
"LC-1.1.5-01 Titulos sin tilde menú Patentes"
```

**Lectura directa de JSONs canónicos:**
```bash
# Nuevos LC-*; históricos pueden tener A–H
cat data/claude-audits/sitioweb/.../www-inapi-cl_....json | jq '.criterios_evaluados[] | select(.id == "LC-1.1.7-01")'
```

---

## Flujo de pesquisa combinada (A + B)

```
1. Leer definición en checklist-criteria-lc-ptd.json → source
2. RAG A: "{LC-*} {concepto}" → cita normativa
3. RAG B: "{LC-*} {url-similar}" → precedente
4. Comparar HTML actual → cumple / incumple / no_aplica (+ severidad si incumple)
5. Redactar comentario + borrador de propuesta CMS para auditoria-lc / sub-subagente
```

Ejemplo de comentario bien fundamentado:
```
"LC-1.2.4-05: Según IEW/IESD escritura para la web, evitar palabras solo en mayúsculas excepto
siglas reconocidas. Los grupos del menú MI INAPI, TRAMITACIÓN, PAGOS, SERVICIOS están en
mayúsculas totales. Patrón ya documentado en auditorías previas del portal. Comunicar a CMS:
cambiar a mayúscula inicial; TI: suele venir del layout compartido."
```

---

## Cuándo NO necesitas el RAG

- Para los **51** criterios LC v3.0: basta con `checklist-criteria-lc-ptd.json` + `auditoria-lc.md` + Word/mapa PTD (§23).
- Patrones sistémicos: `auditoria-lc.md` y CLAUDE.md §6.
- `no_aplica`: primero CLAUDE.md §16.
- **Sesión autenticada:** RAG no sustituye §19. No ingresar HTML con PII a Colección B.

---

## Estado del RAG — verificación previa

```bash
curl -s http://localhost:8000/api/v1/heartbeat
# Si no responde:
chroma run --path ./rag/chroma_db --port 8000
# Re-ingesta tras cambios de catálogo/docs/auditorías:
cd rag && bun run ingest:b
```

Sin RAG:
```bash
rg '"id": "LC-1.1.3-05"' data/claude-audits/
rg "LC-1.2.4-05|mayúsculas" docs/ .claude/
```

Ver `../diagrams/workflow_diagram.md`.
