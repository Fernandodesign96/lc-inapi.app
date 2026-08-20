# Cotización Anthropic API — evidencia de costo (no operativa)

**Estado:** borrador con placeholders — 2026-08-17  
**Propósito:** entregar a jefatura de proyecto / Equipo UX / TI un **orden de magnitud** del costo si se operara con Anthropic API en lugar de Claude Code Team (asiento institucional).  
**No** cablear esta API al MVP (ADR 0009 / ADR 0011).

---

## 1. Método

1. Tomar **1–3 URLs** representativas (p. ej. home `www.inapi.cl`, un trámite Clarity, una noticia META MEI).
2. Estimar tokens por auditoría completa §17 (captura + 5 sub-subagentes + consolidación), o medir con una corrida de prueba **solo si** se abre un proyecto Console temporal de evidencia (no producción).
3. Aplicar precios públicos vigentes de Anthropic (input / output por modelo) → costo por URL y proyección mensual.

Fórmula orientativa:

```text
costo_url ≈ (tokens_input × precio_input) + (tokens_output × precio_output)
costo_mes ≈ costo_url × auditorías_estimadas_mes
```

---

## 2. Placeholders (rellenar con precios y mediciones actuales)

| Concepto | Placeholder | Notas |
| --- | --- | --- |
| Modelo asumido | `TODO: p. ej. claude-sonnet-…` | Alinear al modelo usado en Claude Code Team si se compara “igual calidad” |
| Precio input (USD / 1M tokens) | `TODO` | Pegar de pricing Anthropic a la fecha de la cotización |
| Precio output (USD / 1M tokens) | `TODO` | Idem |
| Tokens input / URL (estimados) | `TODO` (rango típico piloto: decenas–cientos de miles por pasada multiagente) | Medir 1–3 URLs reales si hay tiempo |
| Tokens output / URL (estimados) | `TODO` | Incluye JSON 47 criterios + sustituciones |
| Costo / URL (USD) | `TODO` | Resultado de la fórmula |
| Auditorías / mes (escenario MVP) | `TODO` (p. ej. 20 / 50 / 100) | Escenarios bajo / medio / alto |
| Costo / mes (USD) | `TODO` | Por escenario |

### Escenarios (plantilla)

| Escenario | URLs/mes | Costo/URL | Total/mes |
| --- | ---: | ---: | ---: |
| Bajo | __ | __ | __ |
| Medio | __ | __ | __ |
| Alto | __ | __ | __ |

---

## 3. Comparación cualitativa con el camino elegido

| Dimensión | Claude Code Team (MVP) | Anthropic API |
| --- | --- | --- |
| Costo variable por token | Incluido en asiento (con límites del plan) | Pago por uso |
| Orquestación §17 / MCP | Nativa | Habría que reimplementar orquestación |
| Decisión INAPI | Operar con asiento institucional | Solo evidencia de costo |
| Vercel | UI + API delgada | Igual; la API no corre en Vercel 10–40 min |

---

## 4. Cómo completar este documento (checklist)

- [ ] Fecha de consulta a pricing Anthropic: ____
- [ ] 1–3 URLs usadas para estimación: ____
- [ ] Fuente de tokens (estimación / medición Console): ____
- [ ] Revisado por: ____

Cuando esté completo, citar este archivo en la reunión de costos; **no** crear `ANTHROPIC_API_KEY` en el deploy del MVP.
