# Plantilla: Lote de URLs (orquestación multi-sesión)

> **Preferir** `.claude/prompts/audit-una-url.md` (una URL = una sesión) para META MEI y reauditorías §20.
> Este archivo solo coordina **varias sesiones** o un máximo de **2 URLs** en la misma sesión si son hermanas y la primera ya cerró limpia.
> Referencias: `.claude/CLAUDE.md` §14, §17, §20, §21.

---

## Política de tamaño (obligatoria)

| Caso | Tamaño | Cómo |
| --- | --- | --- |
| Reauditoría META MEI / §20 | **1 URL** | Pegar `audit-una-url.md` una vez por URL |
| Dos páginas muy similares (ej. 2 noticias) | **Máx. 2** | Misma sesión solo si la 1ª terminó validate+commit |
| Smoke / Clarity ligero | Hasta 5 (legacy) | Verificar tras cada URL; no apilar consolidaciones |

**Prohibido** en reauditoría profunda: lanzar 3–5 URLs en un solo prompt maestro “de una vez”.

---

## Prerrequisitos

```bash
claude mcp list
chroma run --path ./rag/chroma_db --port 8000 &
```

---

## Prompt coordinador (lista de trabajo)

Vas a auditar el siguiente conjunto. Para **cada** URL, ejecuta el flujo completo de `audit-una-url.md` (captura → inventario R+U → RAG → 5 subagentes → consolidación §20 → validate → cable → commit) **antes** de pasar a la siguiente.

### URLs

TODO:

1. https://… (tipo | fecha | slug | sesión)
2. https://… (solo si política permite 2)

### Reglas

- No compartir contexto de evaluación entre URLs (sí pueden compartir patrones Layout ya documentados en `nota_final_tic`).
- Tras cada URL: `bun run validate:claude-audits`.
- Al cerrar el conjunto: reportar tabla URL / % / estado / id; opcional `bun run rag/ingest-b.ts`.

### Cableado frontend (Paso F / legacy «Paso 6»)

Tras cada JSON válido:

1. Actualizar `frontend/src/lib/claude-audits-launch.ts` y/o `clarity-audits-launch.ts`.
2. Si META MEI: `src/lib/mei-export/mei-meta-mei-urls.ts` (id vigente + `history[]`).
3. `bun run typecheck:all` si hubo cambios TS.
4. Commit atómico por URL.

Detalle: `audit-una-url.md` Paso F.

---

## Notas

- Límite histórico de 5 URLs queda **deprecado** para entregas Bernarda; usar solo smoke.
- Sin RAG: degradado con CLAUDE.md + skills (anotar en DEVLOG).
- Ranks pendientes TI: 8, 11, 13, 15 — no auditar.
