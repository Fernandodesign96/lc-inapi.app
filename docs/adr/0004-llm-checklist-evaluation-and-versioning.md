# ADR 0004 — Evaluación con LLM y versionado de prompts

## Estado

Propuesto — 2026-05-13

## Contexto

Los 39 criterios requieren interpretación lingüística. Un LLM puede acelerar la evaluación, pero introduce **variabilidad**, **costo** y riesgos de **alucinación**. El checklist y las fuentes (RLC, CW) deben permanecer **trazables**.

## Decisión

1. El prompt incluye: rol, **criterios completos** (id, texto, verificación, fuente), texto a auditar, y **formato de salida obligatorio** (JSON compatible con `criterionEvaluationSchema` × 39).
2. Cada ejecución persiste `prompt_version` junto a `checklist_version`.
3. La respuesta del LLM se valida con **Zod**; si falla, política de **reintento** acotado o degradación a “revisión manual requerida”.
4. La **exportación** y el uso oficial requieren **validación humana** (requisito de producto del MVP conceptual).

## Consecuencias

- **Positivo:** reproducibilidad parcial por versiones; defensa ante cambios de modelo.
- **Negativo:** mantenimiento de prompts y pruebas de regresión por URL de referencia.
- **Pendiente:** ADR hijo sobre elección **Cheerio vs Playwright** para captura y su impacto en tokens.

## Alternativas

- **Solo reglas determinísticas:** baratas y estables, insuficientes para matices de lenguaje.
- **Fine-tuning propio:** fuera de alcance MVP.
