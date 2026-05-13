# ADR 0001 — Registrar decisiones con ADRs

## Estado

Aceptado — 2026-05-13

## Contexto

El MVP involucra decisiones de producto, datos, seguridad e integración (INAPI, proveedor LLM, Supabase). Sin registro explícito, el equipo pierde el **porqué** de cada elección y se dificulta alinear a TI y UX.

## Decisión

Adoptar **Architecture Decision Records** en `docs/adr/`, con formato corto:

- **Estado** (propuesto / aceptado / deprecado)
- **Contexto**
- **Decisión**
- **Consecuencias** (positivas / negativas / deuda)

## Consecuencias

- **Positivo:** trazabilidad y onboarding más rápido.
- **Negativo:** costo mínimo de mantenimiento al cambiar decisiones (actualizar o deprecar ADR).
- **Nota:** los ADR no sustituyen el PRD; complementan decisiones técnicas puntuales.
