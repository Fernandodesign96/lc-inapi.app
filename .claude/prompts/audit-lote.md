# Plantilla: Lote de URLs (orquestación multi-sesión)

## Qué es este documento

Coordinador de **varias sesiones** Claude Code para auditar un conjunto de URLs (p. ej. META MEI órdenes 1…10) **sin** mezclar evaluaciones en un solo prompt.

## Para qué se utiliza

Ordenar la cola (Portada → Marcas → Patentes → …), fijar política de tamaño (1 URL por sesión) y recordar validate/cable/commit entre páginas.

## Objetivo

Completar un lote con aislamiento por URL, mismos contratos LC v3.0 y cableado frontend coherente (`history[]` + id vigente).

## Importancia en la orquestación Claude Code

Evita el anti-patrón “3–5 URLs de golpe”. No evalúa criterios por sí mismo: **delega siempre** en `audit-una-url.md`.

## Cableado (conversa con)

| Pieza | Relación |
| --- | --- |
| `audit-una-url.md` | Ejecutor real (Pasos A–F) por cada URL |
| `audit-oro-s22.md` | Ejemplos oro; aviso: su «URL 2» = orden META MEI **9** |
| `../CLAUDE.md` | §14 multi-sesión; **reglas §5**; **sub-subagentes §17**; §20–§23 |
| `../skills/auditoria-lc.md` (+ calidad-web, pesquisa) | Cargadas vía `audit-una-url` en cada sesión |
| `../diagrams/workflow_diagram.md` | Diagrama multi-URL |
| `src/lib/mei-export/mei-meta-mei-urls.ts` | Orden 1…10 y `auditId` |
| Frontend launch TS | Cable tras cada commit |

**Reglas** = CLAUDE.md §5. **Sub-subagentes** = §17 (cinco por URL, no uno por URL del lote).

> Preferir siempre `audit-una-url.md` para META MEI. Máx. **2** URLs hermanas en la misma sesión solo si la 1.ª cerró validate+commit.

**Referencias CLAUDE.md (cómo leer «§N»):** cada «§N» es una sección de `.claude/CLAUDE.md`.

| Ref. | Sección | Qué pide / ejecuta |
| --- | --- | --- |
| **§12** | Workflow de una URL | Preparación → inventario → JSON → validate → cable → commit |
| **§14** | Conjunto multi-sesión | Política de tamaño + ejecución URL tras URL (este archivo) |
| **§17** | Sub-subagentes | 5 grupos por indicadores `LC-*` |
| **§19** | Sesión autenticada | Anonimización; ARCO = `LC-1.1.7-03` |
| **§20** | Calibración | Solo VISIBLE; patrones; cruces; gate evidencia |
| **§21** | Playbook herramientas | Fecha, documentos, H1, etc. |
| **§22** | Entrega CMS | Copy accionable |
| **§23** | Alcance PTD-LC | Solo 51 LC; sin score US/SE |

Fuente de orden META MEI: `src/lib/mei-export/mei-meta-mei-urls.ts`.

---

## Política de tamaño (obligatoria)

| Caso | Tamaño | Cómo |
| --- | --- | --- |
| Reauditoría META MEI / profundidad §20–§23 | **1 URL por sesión** | Pegar `audit-una-url.md` (o bloque de `audit-oro-s22.md` adaptado) **una vez por URL** |
| Dos páginas muy similares (ej. 2 noticias detalle) | **Máx. 2** | Misma sesión **solo** si la 1.ª terminó `validate:claude-audits` + commit atómico |
| Smoke / Clarity ligero | Hasta 5 (legacy) | Verificar tras cada URL; **no** apilar consolidaciones ni mezclar inventarios |

**Prohibido** en entregas MEI: un solo prompt maestro con 3–5 URLs “de una vez”.

---

## Orden recomendado META MEI (1 → 10)

Auditar **una a una** en este orden (no saltar a la noticia del oro como si fuera la “URL 2” del recorrido):

| Orden | Nombre UI | URL (resumen) | `tipo_pagina` |
| --- | --- | --- | --- |
| 1 | Portada / inicio INAPI | `https://www.inapi.cl/` | sitioweb |
| 2 | Marcas | `https://www.inapi.cl/marcas` | sitioweb |
| 3 | Patentes | `https://www.inapi.cl/patentes` | sitioweb |
| 4 | Acerca de INAPI | `https://www.inapi.cl/acerca-de/inapi` | sitioweb |
| 5 | Buscador de noticias | buscador `searchQuery=noticias` | sitioweb |
| 6 | Solicitud Nueva (Marcas) | `/marcas/tramites/solicitud-nueva` | sitioweb |
| 7 | Sala de Prensa — Noticias | `/sala-de-prensa/noticias` | sitioweb |
| 8 | Noticia detalle 1/2 | Cuenta Pública Participativa 2026 | sitioweb |
| 9 | Noticia detalle 2/2 | Cifra histórica patentes nacionales | sitioweb |
| 10 | Formulario Contacto SIAC | `https://tramites.inapi.cl/siac` | tramites |

Por cada fila: completar el bloque «URL objetivo» de `audit-una-url.md` (fecha, slug, id, `history[]`, `captura_con_sesion`).

---

## Prerrequisitos

```bash
claude mcp list          # playwright + rag-auditoria
chroma run --path ./rag/chroma_db --port 8000   # terminal aparte
bun run validate:claude-audits                  # baseline OK
# Si catálogo 51 / mapa / Word / auditorías cambiaron desde la última ingesta:
cd rag && bun run ingest:b && cd ..
```

---

## Prompt coordinador (lista de trabajo)

Vas a auditar el siguiente conjunto **en orden**. Para **cada** URL:

1. Pegar / ejecutar el flujo completo de **`audit-una-url.md`** (Principio rector + Pasos A→F).
2. Aplicar CLAUDE.md **§12 + §17 + §20 + §21 + §22 + §23** (y **§19** si `captura_con_sesion: true`).
3. Emitir JSON v3.0: **51** filas `LC-*`, `version_checklist: "3.0"`. Estados solo `cumple` \| `incumple` \| `no_aplica` (nunca `null`). Todo `incumple` (incl. UI «Cumple con observaciones» / «Medianamente cumple» vía `severidad` baja/media) → fila en `sustituciones[]` con lenguaje **CMS primero**.
4. `bun run validate:claude-audits` → cablear launch + `mei-meta-mei-urls.ts` si META MEI → **commit atómico de esa URL**.
5. **Solo entonces** abrir la siguiente URL. No reutilizar inventario ni estados de la URL anterior (sí se pueden citar patrones Layout ya documentados en `nota_final_tic` / Colección B).

### URLs de este lote

TODO: completar (respetar política de tamaño):

1. orden N · https://… · tipo · fecha · slug · sesión true/false · id previo history
2. (solo si política permite 2 en la misma sesión)

### Reglas de aislamiento

- **No** compartir contexto de evaluación entre URLs (inventario R+U, `criterios_evaluados`, % distinto por página).
- **Sí** consultar RAG Colección B por precedentes de *esa* URL o del mismo patrón sistémico (queries con ids `LC-*`).
- Tras cada URL: validate obligatorio.
- Al cerrar el conjunto: tabla resumen `orden | URL | % | estado_aceptacion | id JSON | agrupaciones §20.3`; opcional `cd rag && bun run ingest:b` para indexar los JSON nuevos.

### Cableado frontend (Paso F de `audit-una-url.md`)

Tras cada JSON válido:

1. Actualizar `frontend/src/lib/claude-audits-launch.ts` y/o `clarity-audits-launch.ts` (`claudeAuditId` vigente; previos en `history[]`).
2. Si META MEI: `src/lib/mei-export/mei-meta-mei-urls.ts` (`auditId` + flag `reauditoriaEnProceso` si aplica).
3. `bun run typecheck:all` (y, antes de push a main: `bun run lint` + `bun run build` — CLAUDE.md checklist).
4. Commit atómico **por URL** (español, conventional commits). No lote-commit salvo pedido explícito del usuario.

---

## Criterio de cierre del lote

- [ ] Cada URL del conjunto tiene JSON 51×`LC-*` + validate OK + commit propio
- [ ] Ninguna URL siguiente se abrió antes del cierre de la anterior
- [ ] Cable UI/META MEI coherente (id vigente ≠ history)
- [ ] Sin score US/SE; sin códigos A–H en auditorías nuevas
- [ ] Colección B re-ingestada si se quiere RAG al día con los JSON recién cerrados

---

## Notas

- El límite histórico de 5 URLs en un prompt queda **deprecado** para entregas MEI; solo smoke.
- Sin RAG MCP: degradado con `CLAUDE.md` + skills (anotar en DEVLOG).
- Ranks Clarity pendientes TI (p. ej. 8, 11, 13, 15): no auditar hasta habilitación.
- «URL 2» en `audit-oro-s22.md` = **orden META MEI 9** (noticia), no el paso 2 del recorrido (Marcas).
