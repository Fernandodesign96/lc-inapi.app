# Skill 6 — Análisis textual ascendente (instrucciones al subagente)

## Qué es

Skill para que Claude Code lance e instruya al **subagente de análisis textual ascendente** (§17.1bis): recorrer el inventario R+U de menor a mayor granularidad y preparar hallazgos/propuestas antes de los 15 subagentes por indicador.

## Cuándo activar

- Prompt 5, **Paso D0** (obligatorio en cada URL).  
- Prompt 7 como contrato de niveles y salida.  
- Ante jerga INAPI, títulos cortos, listas de etapas o bloques «tipos/cobertura».

## Cableado

| Pieza | Relación |
| --- | --- |
| `../prompts/07-analisis-texto-ascendente.md` | Contrato de niveles y mapa de salida |
| `../prompts/05-audit-maestro-url.md` | Paso D0 |
| `../prompts/06-calibracion-hallazgos.md` | Tasas, etapas, Observancia, cobertura, rigor UX |
| `../CLAUDE.md` | §17.1bis · §20 · §22 |
| `03-instrucciones-subagentes-instrumentos.md` | Los 15 indicadores **usan** este mapa |
| `02-lenguaje-entrega-cms.md` | Tono de `propuesta_cms` |

## Plantilla de instrucción al subagente

```
Eres el subagente de análisis textual ascendente (CLAUDE.md §17.1bis + Prompt 07 + esta skill).
URL: … | tipo_pagina: … | captura_con_sesion: …

Entrada: inventario R+U completo (VISIBLE) + Prompt 6 vigente.

Método OBLIGATORIO (ascendente):
1) Palabras/conceptos técnicos o jurídicos (Observancia, tasas, derechos, cobertura, examen de forma/fondo, extracto, Diario Oficial, tramitación, Anotación, etc.).
2) Frases breves que los contienen (ej. «Tipo de cobertura»).
3) Oraciones (ej. pagos de tasas en dos etapas).
4) Párrafos / listas de etapas / bloques UI (tipos de marca, cobertura con +).
5) Criterios de forma sobre esas mismas unidades (extensión, una idea, escaneo).

Por cada unidad opaca o incompleta:
- criterios_candidatos LC-*
- diagnóstico en lenguaje claro
- propuesta_cms: O cambiar el concepto a lenguaje cotidiano O agregar definición/descripción breve entendible; si hay etapas/pagos, describir qué ocurre y qué debe hacer el usuario.
- No te quedes solo en «mejorar la redacción» si el concepto sigue sin explicarse (Prompt 6 Marcas).

Salida: mapa tabular unidad_id | nivel | texto | ubicación | criterios | diagnóstico | propuesta | contexto_superior.
No calcules el % global. No escribas el JSON canónico de 51 filas (eso lo consolidan los 15 + raíz).
```

## Criterios que suelen activarse por nivel

| Nivel | Criterios frecuentes |
| --- | --- |
| Palabra / concepto | `LC-1.1.3-*` (lenguaje plano, jerga, siglas), `LC-1.2.4-02` (títulos) |
| Frase | Claridad `LC-1.2.1-*`, escritura web |
| Oración | Plano + claridad + completitud de datos clave |
| Párrafo / etapas | Completitud `LC-1.1.2-*`, concisión `LC-1.2.2-*`, legibilidad `LC-1.2.3-*`, una idea / extensión |
| Forma | Negritas, escaneo, listas (`LC-1.2.4-*`) |

## Después del mapa

1. Pasar el mapa a los **15 subagentes** (skill `03`): deben contrastar cada `LC-*` con las unidades relevantes.  
2. Los **5 sub-subagentes** (§17.2) pulen las propuestas del mapa que quedaron en `sustituciones[]`.  
3. Si aparece un patrón nuevo (ej. otro rótulo INAPI recurrente) → proponer entrada en Prompt 6.

## Efecto deseado

Menos omisiones en Marcas/Portada/trámites: cada término opaco deja rastro y una corrección accionable para CMS.
