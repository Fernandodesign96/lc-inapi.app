# Sesión piloto Claude — 5 junio 2026 (trabajo en PC empresa)

> **Documento histórico.** Las tareas de esta sesión quedaron **cerradas en repo** (URLs 1–9, merge a `main` 2026-06-08). Estado actual: [`flujo-piloto-10-urls-claude-mvp.md`](flujo-piloto-10-urls-claude-mvp.md) §2 y [`development/DEVLOG.md`](development/DEVLOG.md).

**Autor:** Fernando Arriagada Castillo  
**Contexto:** Piloto LC — 9 URLs (7 `sitioweb` + 2 `tramites` en lista final), distintas a la propuesta inicial de 10 URLs de la reunión 2026-06-02. Sin terminal ni git en este equipo; generación de JSON vía Proyecto Claude y revisión con Cursor (Composer).

**Uso de este documento:** Bitácora del día en PC empresa; conservar como referencia de prompts §3.2 y decisiones editoriales. Para el estado vigente del piloto, usar el flujo operativo §2.

---

## 1. Resumen ejecutivo del día

| Hito | Estado |
|------|--------|
| **Fase A** — Actualizar prompt §3.2 (cobertura 1:1, E3 ausencias, G1 institucional) | Hecho en repo local |
| **Fase B** — Completar JSON home (URL 1) | Hecho y revisado |
| **URL 2** — Buscador Marcas (`buscadormarcas.inapi.cl`) | JSON definitivo en `data/claude-audits/` |
| **URL 3** — Marcas (`www.inapi.cl/marcas`) | Primera corrida §3.1 hecha; **pendiente §3.2** (límite Claude hasta ~17:00) |
| **Opción B** nomenclatura `piloto-NN_…` | Acordado **postergar** hasta casa (requiere TS + renombrar + git) |
| **DEVLOG / commit / PR** | Pendiente en casa |

---

## 2. Cambios en documentación (Fase A)

### Archivos modificados

1. [`flujo-piloto-10-urls-claude-mvp.md`](flujo-piloto-10-urls-claude-mvp.md)
   - **§3.1:** línea final — verificar cobertura 1:1 al cerrar con §3.2.
   - **§3.2 (ítem 4):** `texto_propuesto` = resumen opcional; fuente accionable = `sustituciones[]`.
   - **§3.2 (ítem 7):** cada hallazgo en `observaciones_lc_por_severidad` debe tener fila en `sustituciones[]`.
   - **§3.2 (ítem 8):** reglas ampliadas:
     - Cobertura **1:1** obligatoria (`incumple` → ≥1 fila con mismo `criterio_id`).
     - Campos por fila; `html_linea_aprox` obligatorio en inserciones/`<head>`.
     - Contenido **ausente** (E3): `original: "(ausencia)"`, `propuesto` = texto a insertar.
     - **G1:** RUT institucional no es persona natural; si incumple por A5/valor tarea, igual fila en sustituciones.
     - Tabla de tipos: sustitución, inserción, eliminación, reorden, enlace/slug.
     - Estilo editorial de propuestas.
   - **§5 Paso 0** y **§3.4:** referencias al nuevo §3.2.

2. [`Comparación Auditoría URL Home INAPI Gemini-Claude.md`](Comparación%20Auditoría%20URL%20Home%20INAPI%20Gemini-Claude.md)
   - **§9:** enlace a §3.2; G1 y E3 alineados con sustituciones aunque sea ausencia o RUT institucional.

### No se tocó (a propósito)

- `frontend/src/lib/claude-audits-launch.ts` (tabla piloto sigue con 10 URLs viejas; solo home registrada).
- DEVLOG, commit, PR.

---

## 3. Cómo funciona el `id` en el MVP (referencia rápida)

Tres lugares deben coincidir:

| Lugar | Ejemplo URL 1 | Ejemplo URL 2 |
|-------|---------------|---------------|
| Archivo | `data/claude-audits/www-inapi-cl_2026-06-02.json` | `data/claude-audits/buscadormarcas-inapi-cl-marca-buscar-marca_2026-06-05.json` |
| Campo `"id"` en JSON | `www-inapi-cl_2026-06-02` | `buscadormarcas-inapi-cl-marca-buscar-marca_2026-06-05` |
| `claudeAuditId` en [`claude-audits-launch.ts`](../frontend/src/lib/claude-audits-launch.ts) | Solo home hoy | **No registrado aún** |

- Carga: [`load-claude-audit-bundle.ts`](../frontend/src/lib/load-claude-audit-bundle.ts) lee `{claudeAuditId}.json`.
- Resultado: `?claudeAudit={id}` debe igualar `audit.id` del JSON.
- Convención actual: `slug-desde-url_YYYY-MM-DD` (ver `normalize-export.mjs` y §3.2 del flujo).
- **Opción B** (`piloto-01_home-inapi_…`) queda para un PR posterior en casa.

---

## 4. URL 1 — Home INAPI

| Campo | Valor |
|-------|--------|
| URL | `https://www.inapi.cl/` |
| `id` / archivo | `www-inapi-cl_2026-06-02.json` |
| % LC | 45,5 % — Rechazado |
| Incumple | 18 |
| Sustituciones | 35 filas |

### Trabajo del día

1. Claude entregó `www-inapi-cl_2026-06-02-actualizado.json` con cobertura 1:1 (antes faltaban A2, A5, B2, C3, E3, F1, F3, G1, etc.).
2. Revisión: 18 `criterio_id` distintos en sustituciones; alternativas T220 (B2 vs F1) y T522 (A5 vs G1) **aceptadas** a propósito para UX/TIC.
3. Ajustes puntuales (Agent):
   - Fila **F4** T492 `Teletrabajo (PDF)`.
   - `resumen_ejecutivo` y `texto_propuesto` con 35 filas / 20 incumplimientos.
   - Hallazgo alta **(F4)** menciona Teletrabajo.
4. Copia canónica: `www-inapi-cl_2026-06-02.json` (idéntico al `-actualizado`; se puede borrar el duplicado `-actualizado` en casa).

**Plantilla obligatoria** para siguientes URLs: `www-inapi-cl_2026-06-02.json`.

---

## 5. URL 2 — Buscador Marcas INAPI

| Campo | Valor |
|-------|--------|
| Nombre | Buscador Marcas INAPI |
| URL | `https://buscadormarcas.inapi.cl/Marca/BuscarMarca.aspx` |
| `tipo_pagina` | `sitioweb` |
| `id` / archivo | `buscadormarcas-inapi-cl-marca-buscar-marca_2026-06-05.json` |
| % LC | 39,4 % — Rechazado |
| Incumple | 20 |
| Sustituciones | 48 filas |

### Flujo

1. Prompt §3.1 → primera corrida Claude.
2. Revisión: aritmética corregida (13 cumple / 20 incumple / 39,4 %); completar B2, F2, G3, etc.
3. Prompt §3.2 → JSON definitivo guardado en `data/claude-audits/`.
4. **Veredicto:** OK para cerrar URL 2. MVP no lo muestra hasta registrar `claudeAuditId` en `claude-audits-launch.ts` (en casa).

### Lista piloto (anotación local)

```
pilotoNum: 2
label: Buscador Marcas INAPI
url: https://buscadormarcas.inapi.cl/Marca/BuscarMarca.aspx
tipo: sitioweb
id: buscadormarcas-inapi-cl-marca-buscar-marca_2026-06-05
archivo: buscadormarcas-inapi-cl-marca-buscar-marca_2026-06-05.json
```

---

## 6. URL 3 — Marcas (`/marcas`)

| Campo | Valor |
|-------|--------|
| Nombre | Marcas |
| URL | `https://www.inapi.cl/marcas` |
| `tipo_pagina` | `sitioweb` |
| `id` / archivo (planeado) | `www-inapi-cl-marcas_2026-06-05.json` |
| % LC (1ª corrida) | **48,5 %** — Rechazado |
| Incumple | **17** |
| Cumple | **16** |
| No aplica | **6** |
| Sustituciones preliminares | **28 filas** (cobertura 1:1 en sustancia) |

### Primera corrida §3.1 — HECHA

- Fase 0: 88 fragmentos T001…T088.
- Fortalezas: A1 (H1 Marcas), A3, pirámide en tarjetas, G3 cumple (©2026 + Uso de Contenidos).
- Debilidades: E3 sin fecha de página, title solo «Marcas», PCT, modal contacto B1, PDFs carrusel F4, D1 (punto y coma T042, H2 minúsculas), D7 mayúsculas, enlaces genéricos.

### Revisión Cursor (antes de §3.2) — a aplicar en el JSON

1. **Un solo `criterio_id` por objeto** en `sustituciones[]` (separar filas que mezclaban A2+A5, A2+C3, D1+C1, F1+F2, F1+F3, G1+A5).
2. **A5 + LINK EXTERNO:** además de fila D1, considerar fila `criterio_id: "A5"` para T028.
3. **`linea` del title:** no usar solo `HTML-L1` como `linea`; usar Tnnn o convención clara + `html_linea_aprox: "HTML-L1"`.
4. Alinear Tnnn del H1 real (Fase 0 tenía T002 como ítem menú vs H1 en L702).

### Segunda corrida §3.2 — PENDIENTE (Claude ~17:00)

**Archivo a crear:** `data/claude-audits/www-inapi-cl-marcas_2026-06-05.json`

---

## 7. Prompt §3.2 URL 3 — copiar en Claude (PENDIENTE)

> **Este bloque es el último entregable del día. Pegar tal cual cuando se restablezca el límite de Claude.**

Adjuntar al chat:

- HTML Ctrl+U de `https://www.inapi.cl/marcas`
- [`data/claude-audits/www-inapi-cl_2026-06-02.json`](../data/claude-audits/www-inapi-cl_2026-06-02.json) como plantilla

```text
Necesito UN solo bloque JSON válido para integrar en nuestro MVP (Next.js) y entrega a TIC.
NO repitas la tabla de 39 criterios en prosa.
NO uses el campo "evaluador" — usa "evaluador_uid".
NO uses null en ningún campo: omite la clave si no aplica.

Adjunto como REFERENCIA OBLIGATORIA el JSON canónico de la home INAPI (www-inapi-cl_2026-06-02.json): misma estructura y mismas reglas de sustituciones (cobertura 1:1, ausencias, G1 institucional, alternativas editoriales permitidas).

Metadatos de esta auditoría:

- id: "www-inapi-cl-marcas_2026-06-05"
- url: "https://www.inapi.cl/marcas"
- version_checklist: "1.1"
- tipo_pagina: "sitioweb"
- fecha_evaluacion: ISO 8601 UTC con Z (fecha real de esta auditoría)
- evaluador_uid: "Fernando Arriagada Castillo"

CORRECCIONES OBLIGATORIAS respecto a tu primera corrida:

1) Resumen numérico COHERENTE con los 39 criterios:
   - criterios_no_aplica = 6
   - criterios_aplicables = 33
   - criterios_aprobados = 16 (solo "cumple")
   - porcentaje_cumplimiento = 48.5
   - estado_aceptacion = "rechazado"

2) sustituciones[]:
   - Por CADA criterio "incumple", AL MENOS una fila con UN SOLO criterio_id por objeto (no "A2, A5" en una fila: duplicar filas si el mismo texto sirve para dos criterios).
   - Mantén las 28+ propuestas de la primera corrida; completa filas faltantes si al separar criterio_id hace falta (ej. A5 para LINK EXTERNO además de D1).
   - E3: original "(ausencia)", propuesto fecha visible, html_linea_aprox obligatorio.
   - E4: title «Marcas» → propuesta ampliada (HTML-L1 / <title>).
   - F4: tres PDFs del carrusel (PAC, Teletrabajo, Código de Ética) con "(PDF)" sin inventar peso.
   - G1: T076 RUT — eliminar o mover; motivo institucional vs persona natural.
   - Alternativas en la misma línea (ej. dos textos para Observancia B2 vs F1) permitidas como filas distintas.

3) texto_capturado: string resumido (extracto T001…), no los 88 fragmentos completos.

4) texto_propuesto y resumen_ejecutivo: mencionar 17 incumplimientos, 48,5 %, y el total real de filas en sustituciones[].

5) observaciones_lc_por_severidad: alineado con incumplimientos finales; hallazgo baja vacío [] si no hay.

6) nota_final_tic: entidades HTML, backup, carrusel PDF con alt internos, H4 duplicados rs_skip si aplica.

Entrega SOLO el JSON, sin texto antes ni después:

```json
{
  "id": "www-inapi-cl-marcas_2026-06-05",
  ...
}
```

Nunca uses null.
```

### Después del JSON de Claude

1. Guardar como `data/claude-audits/www-inapi-cl-marcas_2026-06-05.json`.
2. Pedir a Composer revisión: aritmética, 17 `criterio_id` en sustituciones, un `criterio_id` por fila.
3. Anotar en lista local:

```
pilotoNum: 3
label: Marcas
url: https://www.inapi.cl/marcas
tipo: sitioweb
id: www-inapi-cl-marcas_2026-06-05
archivo: www-inapi-cl-marcas_2026-06-05.json
```

---

## 8. Flujo repetible por URL (URLs 4–9)

```
1. Usuario entrega: Nombre, URL, tipo (sitioweb | tramites)
2. Composer: prompt §3.1 + id sugerido (slug_fecha)
3. Usuario: HTML Ctrl+U → Claude → pega primera corrida
4. Composer: revisión aritmética + cobertura 1:1 + prompt §3.2
5. Usuario: JSON definitivo → data/claude-audits/{id}.json
6. Composer: revisión final
```

**Regla mínima mientras no hay Opción B:** anotar en un `.txt` local `pilotoNum`, `label`, `url`, `id`, `archivo` por cada URL.

---

## 9. Archivos a llevar a casa (checklist)

### Documentación actualizada hoy

- [ ] `docs/flujo-piloto-10-urls-claude-mvp.md`
- [ ] `docs/Comparación Auditoría URL Home INAPI Gemini-Claude.md`
- [ ] `docs/sesion-piloto-claude-2026-06-05.md` (este archivo)

### JSON en `data/claude-audits/`

- [ ] `www-inapi-cl_2026-06-02.json` (home — canónico, 35 sustituciones)
- [ ] `buscadormarcas-inapi-cl-marca-buscar-marca_2026-06-05.json` (URL 2)
- [ ] `www-inapi-cl-marcas_2026-06-05.json` (URL 3 — **crear tras §3.2**)

Opcional / limpieza en casa:

- [ ] Eliminar `www-inapi-cl_2026-06-02-actualizado.json` si sigue duplicado del canónico.

---

## 10. Pendientes en casa (orden sugerido)

1. **Cerrar URL 3:** §3.2 Claude → guardar JSON → revisión Composer.
2. **URLs 4–9:** mismo flujo; lista real 8 sitioweb + 1 trámites (definir con Bernarda).
3. **Git:** commit con docs + todos los JSON del piloto.
4. **DEVLOG:** entrada sesión 2026-06-05.
5. **PR** con resumen piloto JSON.
6. **Opcional (higiene MVP):**
   - Opción B nomenclatura O mantener slug actual.
   - Actualizar `CLAUDE_PILOT_URL_ROWS` en `claude-audits-launch.ts` (9 URLs reales + `claudeAuditId` + `resumenMvp`).
   - Validar: `bun run typecheck:all` / script validación audits si existe.
7. **Tabla §2** en `flujo-piloto-10-urls-claude-mvp.md` alinear a las 9 URLs reales.

---

## 11. Comparativa piloto (hasta hoy)

| # | Página | `id` | % LC | Incumple | Sustituciones | JSON |
|---|--------|------|------|----------|---------------|------|
| 1 | Home | `www-inapi-cl_2026-06-02` | 45,5 % | 18 | 35 | Hecho |
| 2 | Buscador Marcas | `buscadormarcas-inapi-cl-marca-buscar-marca_2026-06-05` | 39,4 % | 20 | 48 | Hecho |
| 3 | Marcas | `www-inapi-cl-marcas_2026-06-05` | 48,5 % | 17 | ~28+ | **Pendiente §3.2** |
| 4–9 | Por definir | — | — | — | — | Pendiente |

---

## 12. Decisiones de producto/editoriales (no revertir sin UX)

- **Alternativas en misma línea** (ej. T220 B2 vs F1, T119 B1 vs C1): válidas para discusión UX antes de TIC.
- **Duplicado RUT** filas A5 + G1: intencional (un criterio = una propuesta).
- **G1 institucional:** no es violación de privacidad de personas naturales; igual se propone quitar/mover si no aporta a la tarea.
- **E3:** si no hay fecha en página → `original: "(ausencia)"` + inserción propuesta.
- **Opción B** (`piloto-NN_…`): postergada; no renombrar JSON en empresa.

---

*Fin del documento de sesión — 2026-06-05.*
