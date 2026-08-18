# ADR 0011 — Worker local on-demand (Vercel UI + Claude Code, sin API operativa)

## Estado

Borrador — 2026-08-17

## Contexto

El MVP acordado con Álvaro / Bernarda (ago-2026) pide: pegar URL → Continuar → auditoría automática → PDF + Excel → historial (fecha + nombre libre), **sin login**. TI no habilita servidor institucional ni API Claude dedicada. La operación usa el **asiento Claude Team / Pro institucional INAPI** y un **PC local encendido 08:00–18:00** (America/Santiago).

[ADR 0009](0009-claude-code-pro-como-orquestador.md) ya fija Claude Code + skills + MCP + §17 como orquestador. Falta el eslabón producto: la UI en Vercel debe **encolar un trabajo** y mostrar progreso/resultado, mientras la auditoría real (10–40 min) corre **fuera** de Vercel.

## Decisión

1. **Vercel (Hobby basta)** — Next.js UI + API delgada (`audit-jobs`: crear, consultar estado, servir resultado/artefactos). **No** ejecuta Claude Code ni Playwright de larga duración. No se requiere Vercel Pro para el diseño.

2. **Worker en PC local (8:00–18:00)** — proceso/script que reclama jobs pendientes, lanza el flujo Claude Code §17 **sin reescribir** skills/MCP, escribe JSON canónico + metadatos de historial, marca el job `done` / `failed`. Fuera de horario: respuesta clara `outside_hours` (o cola diferida; decisión fina en paso 3–4).

3. **Sin Anthropic API operativa** — la suscripción Claude Team/Code es el camino de ejecución. La API Anthropic solo se **cotiza** como evidencia de costo (documento aparte), no se cablea al MVP.

4. **Sin auth en MVP** — no Nest, Prisma, Supabase Auth ni login institucional. Identidad del auditor = texto libre (`auditorNombre`) + fecha.

5. **Persistencia inicial** — `data/jobs/` (JSON por job) **o** SQLite local; suficiente para un único worker. El historial por URL reutiliza el patrón de launch/JSON ya existente donde aplique.

6. **Túnel Vercel ↔ PC** — Cloudflare Tunnel o Tailscale para que la API en Vercel (o el worker) alcance el otro extremo. Spike en implementación (paso 4); este ADR solo fija la necesidad.

7. **UX no técnica** — la UI no muestra JSON, HTML crudo ni ids internos al funcionario.

## Flujo objetivo

```
Usuario → Vercel UI (URL + nombre)
       → POST /api/audit-jobs
       → estado queued | outside_hours | …
       → poll GET /api/audit-jobs/:id
Worker PC → claim job → Claude Code §17 → JSON + PDF/Excel refs
       → GET …/result → UI historial / descargas
```

## Consecuencias

- **Positivo:** respeta ADR 0009 y el veto de TI a servidor/API dedicada; Vercel Hobby viable; checklist v2.1 y §17 intactos.
- **Positivo:** horario laboral acota costo operativo y expectativas de SLA.
- **Negativo:** dependencia del PC encendido y del túnel; sin PC no hay auditorías nuevas en horario.
- **Negativo:** sin auth, cualquiera con la URL de la demo puede encolar (aceptable solo en MVP interno; mitigar con secreto compartido o IP allowlist si hace falta).
- **Neutral:** contratos HTTP detallados = [docs/contratos-audit-jobs.md](../contratos-audit-jobs.md) (Fase 4 paso 3); código = paso 4 en rama `feat/mvp-audit-jobs-worker`.

## Relación con otros ADR

- **Complementa:** [ADR 0009](0009-claude-code-pro-como-orquestador.md) (orquestación Claude Code).
- **No reabre:** Nest/Prisma ([ADR 0005](0005-api-backend-nestjs-prisma.md) supersedido) ni Anthropic API operativa ([ADR 0006](0006-lc-evaluation-python-claude-aws.md) supersedido).
- **Contrato JSON:** sigue [ADR 0004](0004-llm-checklist-evaluation-and-versioning.md) + checklist v2.1.
