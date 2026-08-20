# Mapa: Checklist Editorial PTD v2.0 → motor LC v2.1 (47 criterios)

**Fuente local (no versionada):** `documentos/Checklist_Editorial_INAPI_v2.0.docx` (Equipo UX, ago-2026).  
**Fuente de verdad del motor:** `data/checklist-criteria.json` (checklist editorial **v2.1**, 47 criterios A1–H1).  
**Orquestación:** `.claude/CLAUDE.md` §17 + §22 · `.claude/prompts/audit-una-url.md`.

## Para qué sirve este documento

1. Explicar a jefatura de proyecto / Equipo UX / TIC cómo el Word PTD se relaciona con lo que **sí** audita Claude Code hoy.
2. Evitar diluir META MEI **2026 (Lenguaje claro)** con Usabilidad (2027) y Seguridad (2028) dentro del mismo motor §17.
3. Anclar cada evaluación a **preguntas de instrumento**, no solo a filas de corrección.

## Tres dimensiones del Word v2.0

| Dimensión PTD | Proyecto | Compromiso institucional | ¿En el motor §17 hoy? |
| --- | --- | --- | --- |
| **1 · Contenido y Lenguaje claro** | PTD-D2.1-CL1 | **2026** (prioridad META MEI) | **Sí** — 47 criterios A–H |
| **2 · Usabilidad** | PTD-D2.1-US2 | 2027 (piloto deseado fin 2026) | **No** — fuera de `checklist-criteria.json` |
| **8 · Seguridad** | PTD-D2.1-SE8 | 2028 | **No** — fuera del motor editorial |

El Excel MEI y la UI ya usan **5 categorías de presentación MEI** (Cumple / Cumple con observaciones / Medianamente cumple / No cumple / No aplica) derivadas de `estado` + `severidad`. Eso **no** implica que Usabilidad/Seguridad estén evaluadas.

## Dimensión 1 — Indicadores IQ Web → criterios A–H

Notación dual del Word: Sitios web / Servicios transaccionales (ej. `1.1.2 / 5.1.2`).

| Indicador (Word v2.0) | Preguntas típicas (resumen) | Criterios motor v2.1 |
| --- | --- | --- |
| 1.1.1 / 5.1.1 Fiabilidad | ¿Se reconoce la fuente/autoría? | **E2** |
| 1.1.2 / 5.1.2 Completitud | ¿El contenido es fiel al título? ¿Sin «en construcción»? ¿Datos clave? ¿Trámite autónomo? | **A6, A7, A8**, refuerzo **A5** |
| 1.1.4 Actualización (sitios) | ¿Fecha de publicación/actualización visible y vigente? | **E3** |
| 1.1.3 / 5.1.3 Lenguaje plano | ¿Se entiende? ¿Tono cercano? ¿Sin jerga? ¿Siglas? ¿Tono positivo? | **B1–B8** |
| 1.1.5 Ortografía (sitios) | ¿Ortografía/gramática? ¿Puntuación? ¿Conectores? | **D1, D2**, parte **D7** |
| 1.3.2 Objetividad (sitios) | ¿Redacción neutra? ¿Hechos sobre adjetivos? | **E1** |
| 1.2.1 Claridad (sitios) | ¿FAQ / pregunta-respuesta? ¿Voz activa? ¿SVO? ¿Infinitivo en requisitos? | **C8, B1, C1–C4**, parte **A7** |
| 1.2.2 Concisión (sitios) | ¿Párrafos/oraciones cortas? ¿Una idea por párrafo? ¿Resumen si es largo? | **C5, C6, C7, C9** |
| 1.1.6 Propiedad intelectual | ¿Condiciones de uso / copyright? | **G3** (según catálogo) |
| 1.1.7 Privacidad | ¿Sin RUN/datos personales indebidos? ¿Derechos ARCO? | **G1, G2** |
| 1.2.3 Legibilidad | ¿Espacio entre párrafos? ¿Alineación izquierda? ¿Listas? | **D3, D4, D5** |
| 1.2.4 Escritura para la web | ¿Pirámide? ¿Escaneo? ¿Negritas? ¿Mayúsculas? ¿Relacionados? ¿PDF con título/formato/peso/desc? | **A1–A3, A9, D6, F4, F6**, parte **F1–F3** |
| 1.1.8 Contenidos sensibles | Menores / dignidad / susceptibilidad | Fuera del núcleo A–H habitual; anotar en `nota_final_tic` si aparece |
| 1.3.1 Visualización | Apoyos visuales (íconos, gráficos) | Fuera del alcance editorial estricto; UI Kit |
| 1.3.3 Archivo | Versiones anteriores rotuladas | **H1** |

Hitos PTD de la dimensión 1 (492–519) se cubren **vía** estos indicadores → criterios anteriores. No hace falta un id distinto por hito en el JSON: el Excel MEI ya agrupa por catálogo PTD institucional.

## Dimensiones 2 y 8 — registro sin evaluación automática

### Usabilidad (ejemplos del Word)

Coherencia/UI Kit, CTAs visibles, mensajes de error, modales, orden lógico de zonas, control de navegación, favicon, ayuda en contexto, filtros/ordenamiento.

**Decisión MVP 2026:** no añadir ids al motor §17 ni inventar scores de usabilidad en la auditoría LC. Si jefatura de proyecto pide “muestra a fin de año”, hacerlo como **anexo cualitativo** o spike aparte, no mezclado con el % de los 47.

### Seguridad (ejemplos del Word)

HTTPS/certificado, redirect HTTP→HTTPS, `X-Frame-Options`, directorios, `X-Content-Type-Options`, `Referrer-Policy`, política de privacidad, cookies.

**Decisión MVP 2026:** igual — fuera del orquestador editorial. G2 (enlace/política de privacidad visible) sigue siendo criterio **editorial/contenido**, no auditoría de cabeceras de servidor.

## Cómo debe verse una respuesta “entendible”

Regla operativa: **CLAUDE.md §22**.

Por cada criterio evaluado:

1. **Pregunta** (del instrumento / `verification`).
2. **Respuesta** (`cumple` / `incumple` / `no_aplica`) con evidencia.
3. Si incumple → **dónde** (`ubicacion_pantalla`) + **qué poner** (`propuesto`) + **por qué** (`motivo`).

Si solo hay una lista de correcciones sin (1)–(2), la entrega **no** cumple el estándar pedido en la reunión con jefatura de proyecto y Equipo UX.

## Relación con Checklist Editorial v2.1 (docx de equipo de desarrollo)

`documentos/Checklist-Editorial-INAPI-v2-1.docx` es la pauta **operativa del motor** (47 criterios, flujo §17). El Word **v2.0 de Equipo UX** es la **vista PTD** (hitos/tareas + tres dimensiones). Ambos conviven:

- v2.1 = qué evalúa Claude Code fila a fila.
- v2.0 Equipo UX = cómo se reporta el compromiso MEI/PTD y qué queda para 2027–2028.

## Próximos pasos (no bloquean este mapa)

1. Calibrar 1–2 URLs reauditadas **solo** con §22 (muestra “estándar de oro” para Equipo UX).
2. Si se exige Usabilidad/Seguridad en 2026: catálogo y skills **separados**, sin contaminar el % LC.
3. Documento de requisitos técnicos entendible para TI (propuesta MVP) — pendiente de la conversación de producto.
