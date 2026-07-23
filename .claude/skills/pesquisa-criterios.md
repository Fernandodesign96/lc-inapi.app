# Skill: Pesquisa de Criterios

Referencia operativa: `.claude/CLAUDE.md` §8 (MCP servers) y §5 (Reglas permanentes)
ADR de referencia: `docs/adr/0010-rag-local-chroma-xenova-transformers.md`

---

## Cuándo activar
- Cuando se pida «qué dice el criterio X».
- Cuando se quiera buscar en documentos normativos o precedentes de auditorías previas.
- Antes de evaluar un criterio específico en una nueva URL.
- Cuando haya dudas sobre si un hallazgo incumple o es borde de `no_aplica`.
- Cuando se quiera saber cómo se evaluó un criterio en una URL ya auditada.

---

## Fuente primaria: `checklist-criteria.json`

**SIEMPRE consultar primero `./data/checklist-criteria.json`.**

Este archivo es la **fuente de verdad** de los 39 criterios. Tiene la definición exacta de cada criterio, su sección, su instrucción de verificación y la fuente normativa que lo respalda (`source`).

No usar solo el RAG para criterios — el JSON es la fuente de verdad.

```json
// Estructura de cada criterio en el JSON:
{
  "id": "B3",
  "section_id": "B",
  "section_title": "Lenguaje claro",
  "criterion": "Las siglas y acrónimos están definidos la primera vez que aparecen",
  "verification": "\"Nomenclatura de Clasificación de Niza (NCL)\" en lugar de solo \"NCL\"",
  "source": "RLC §7, CW 5.1.3"
}
```

El campo `source` indica los documentos normativos donde se puede ampliar la definición en el RAG:
- `RLC` = Recomendaciones de Lenguaje Claro (Chile)
- `CW` = Calidad Web 2.0 (Gobierno de Chile)
- `META-MEI` = instrumento de evaluación MEI

---

## RAG Colección A — contexto normativo

**Propósito:** buscar en los documentos normativos que definen los criterios.

**Documentos ingresados en Colección A** (fuente: `docs/adr/0010`):
- `calidad-web-2.0.pdf` — estándar del Gobierno de Chile para sitios web
- `meta-mei.pdf` — instrumento de evaluación de servicios digitales transaccionales MEI
- `lenguaje-claro-recomendaciones.pdf` — guía de lenguaje claro Chile
- `ui-kit-gobierno-3.0.1.pdf` — componentes de diseño del Gobierno
- `instrumento-evaluacion-sitios-web.pdf`
- `instrumento-evaluacion-servicios-digitales-transaccionales.pdf`

**Cuándo usar Colección A:**
- Para citar la fuente normativa exacta en el `comentario` del criterio.
- Para justificar por qué algo es incumplimiento severo vs leve.
- Cuando el criterio tiene `source: "CW 5.x.x"` o `"RLC §x"` y necesitamos la cita completa.
- Para fundamentar una recomendación en `nota_final_tic`.

**Query recomendada:** `"{código criterio} {concepto}"`

Ejemplos de queries efectivas:
```
"D7 encabezados mayúsculas accesibilidad"
"B3 siglas acrónimos primera aparición"
"E3 fecha actualización contenidos"
"F4 documentos enlazados formato peso PDF"
"G1 datos personales RUT publicación web"
"A1 pirámide invertida propósito página"
```

**Cómo citar el resultado en el JSON:**
```json
"comentario": "Según CW 5.1.3, las siglas deben definirse la primera vez que aparecen..."
```

---

## RAG Colección B — precedentes de auditorías

**Propósito:** buscar cómo se evaluó un criterio en URLs ya auditadas y detectar patrones recurrentes.

**Contenido de Colección B** (fuente: `docs/adr/0010`):
- `data/checklist-criteria.json` — los 39 criterios del checklist
- `data/claude-audits/**/*.json` — 9 JSONs canónicos del piloto (junio 2026)
- `data/claude-audits/urls-clarity/*.json` — serie Clarity (5 URLs disponibles jun 2026)
- `docs/adr/*.md` — decisiones arquitectónicas del proyecto

**URLs ya auditadas en Colección B (piloto jun 2026):**
- `tramites-inapi-cl` (57.6% → rechazado)
- `tramites-inapi-cl-siac` (57.6% → rechazado)
- `tramites-inapi-cl-account-login` (serie Clarity)
- `tramites-inapi-cl-estadosdiariosmarcas` (serie Clarity)
- `tramites-inapi-cl-notificaciones` (serie Clarity)
- `tramites-inapi-cl-trademark-trademarkannotation` (serie Clarity)
- `tramites-inapi-cl-trademark-trademarkapplication-indextrademark` (serie Clarity)
- `buscadormarcas-inapi-cl-marca-buscar-marca` (39.4% → rechazado)

**Cuándo usar Colección B:**
- Antes de evaluar una URL que comparte dominio con una ya auditada (patrones del `_Layout.cshtml`).
- Cuando un criterio parece borde entre `incumple` y `no_aplica` y quiero ver cómo se decidió antes.
- Para verificar la calibración de G1 (RUT institucional vs persona natural).
- Para revisar cómo se formularon las `sustituciones[]` en un caso similar.

**Query recomendada:** `"{código criterio} {url o contexto}"`

Ejemplos de queries efectivas:
```
"F3 botones modal tramites.inapi.cl"
"G1 RUT institucional persona jurídica cumple"
"D7 mayúsculas navbar layout"
"E3 ausencia fecha actualización"
"B3 PCT patentes definicion primera vez"
"D1 Titulos sin tilde menu Patentes"
```

**Lectura directa de JSONs canónicos** (más rápido que el RAG para casos específicos):
```bash
# Ver criterios evaluados de una URL específica
cat data/claude-audits/tramites-inapi-cl_2026-06-07.json | jq '.criterios_evaluados[] | select(.id == "G1")'
```

---

## Flujo de pesquisa combinada (A + B)

Para justificar una evaluación con máxima solidez:

```
1. Leer la definición en checklist-criteria.json → obtener el campo `source`
2. RAG colección A: buscar "{code} {concept}" → cita normativa completa
3. RAG colección B: buscar "{code} {url-similar}" → ver precedente de evaluación
4. Comparar HTML actual con el precedente → decidir incumple / cumple / no_aplica
5. Redactar `comentario` con la cita normativa + referencia al precedente
```

Ejemplo de comentario bien fundamentado:
```
"D7: Según CW 5.2.4, evitar palabras solo en mayúsculas excepto siglas reconocidas. 
Los grupos del menú MI INAPI, TRAMITACIÓN, PAGOS, SERVICIOS están en mayúsculas 
totales (T006, T011, T019, T024). Patrón ya documentado en tramites-inapi-cl_2026-06-07 
(D7 media, 4 ocurrencias). Origen: _Layout.cshtml transversal a todas las páginas del 
portal de tramites."
```

---

## Cuándo NO necesitas el RAG

- Para los 39 criterios del checklist: basta con `checklist-criteria.json` + esta skill.
- Para los patrones sistémicos (D7, D1, F3, F4, E3, E4, B3, H1): están documentados en `auditoria-lc.md` con las calibraciones INAPI ya incorporadas.
- Para decidir `no_aplica`: consultar primero la sección §16 de `CLAUDE.md` antes de abrir el RAG.

---

## Estado del RAG — verificación previa

Antes de usar el RAG MCP, confirmar que Chroma está levantado:

```bash
# Verificar que Chroma responde
curl -s http://localhost:8000/api/v1/heartbeat

# Si no responde, levantarlo:
chroma run --path ./rag/chroma_db --port 8000
```

Si el RAG no está disponible, hacer la pesquisa directamente sobre los archivos del repo:
```bash
# Buscar en los JSONs canónicos
grep -r '"id": "B3"' data/claude-audits/ | head -5

# Buscar en docs
rg "criterio D7" docs/
```
