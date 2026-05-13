# ADR 0003 — Contract-first: mocks con Zod antes del backend

## Estado

Aceptado — 2026-05-13

## Contexto

La **Fase 1** prioriza evidencia UX con **mock** sin backend productivo. Sin contratos compartidos, el mock se desalinea del modelo real (Supabase + API) y la deuda se paga al integrar.

## Decisión

1. Mantener `data/checklist-criteria.json` como **fuente de verdad** del catálogo (39 criterios).
2. Definir esquemas Zod en `src/schemas/checklist.ts` para:
   - archivo de catálogo,
   - evaluaciones por criterio,
   - auditoría agregada (`auditRecordSchema` / `strictAuditRecordSchema`).
3. Validar el JSON en CI/script: `bun run src/scripts/validate-checklist-data.ts`.
4. Usar helpers `buildDemoEvaluations` y `buildDemoStrictAudit` para fixtures en UI y tests.

## Consecuencias

- **Positivo:** la UI mock entrena el mismo shape que producción; menos sorpresas al conectar API.
- **Negativo:** hay que actualizar Zod cuando cambie el checklist (deseable: checklist versionado).

## Alternativas consideradas

- **Solo TypeScript interfaces:** más rápido al inicio, sin validación runtime del JSON.
- **OpenAPI primero:** útil si el BFF es amplio; para MVP LC el Zod compartido es suficiente.
