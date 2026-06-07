# Comparación auditoría URL Home INAPI — Gemini vs Claude

| Metadatos | Detalle |
| --- | --- |
| **Fecha del análisis** | 2026-06-02 |
| **URL auditada** | https://www.inapi.cl/ |
| **Checklist** | Editorial INAPI v1.1 (39 criterios A1–H1) |
| **Entrada** | HTML fuente (Ctrl+U, ~1341 líneas) |
| **Agentes** | Gema Gemini «Auditor Lenguaje Claro URLs INAPI» · Proyecto Claude (mismas instrucciones base) |
| **Audiencia** | Equipo UX (Bernarda, Camila, Álvaro) + TIC |
| **Decisión equipo (2026-06-02)** | **Claude** como proveedor del piloto 10 URLs; ver [`ROADMAP.md`](ROADMAP.md) Fase 1.5 y [`flujo-piloto-10-urls-claude-mvp.md`](flujo-piloto-10-urls-claude-mvp.md) |

---

## 1. Resumen ejecutivo para el equipo UX

Se ejecutó la **misma URL piloto** (home institucional) con dos agentes configurados de forma equivalente. Los resultados **no son comparables en una sola cifra**: difieren en rigor, criterios marcados y volumen de entregables a TIC.

| Indicador | Gemini | Claude |
| --- | --- | --- |
| **% cumplimiento** | **88,6 %** | **45,5 %** |
| **Estado INAPI** | Aceptado con observaciones | Rechazado |
| **Criterios cumple** | 31 | 15 |
| **Criterios incumple** | 4 | 18 |
| **No aplica** | 4 | 6 |
| **Sustituciones propuestas** | 6 | 17 |
| **Fragmentos texto extraídos (Fase 0)** | T001–T091 (~91 ítems) | T007–T538 (tabla resumida, más meta/nav) |

### Recomendación para esta semana

| Uso | Proveedor sugerido | Motivo |
| --- | --- | --- |
| **Informe de auditoría serio y entrega a TIC** | **Claude** | Mayor cobertura de hallazgos, más sustituciones accionables, detecta textos de desarrollo y enlaces genéricos que Gemini omitió. |
| **Comunicación ejecutiva «página en buen estado con ajustes puntuales»** | Ni uno solo sin revisión humana | Gemini suaviza demasiado el diagnóstico; puede subestimar trabajo pendiente antes de fin de año (10 URLs). |
| **Automatización futura (API)** | **Piloto dual** en 2–3 URLs más | Calibrar prompt: nivel de rigor acordado con Bernarda (p. ej. reglas para G1 RUT institucional, E3 en home, meta no visible). |

**Veredicto técnico-editorial:** para el objetivo acordado en reunión del 2026-06-02 (PDF + HTML corregido + solicitudes concretas a TIC), **Claude entregó la auditoría más útil**. Gemini es más legible como resumen positivo, pero **no sustituye** una segunda revisión humana ni la comparación de sustituciones antes de enviar a TIC.

**Referencia mock en repo:** la ficha rank 21 en [`data/ux/clarity-fichas-mock.json`](../data/ux/clarity-fichas-mock.json) tenía **92,0 % / Aprobado** (referencia editorial ficticia). Ninguno de los dos agentes reproduce ese % sin calibración; Claude se aleja más; Gemini se acerca más pero por **menos incumplimientos declarados**, no necesariamente por mejor análisis.

---

## 2. Metodología de esta comparación

Criterios usados para juzgar la calidad del agente (no solo el %):

1. **Completitud:** 39 filas A1–H1 sin omisiones.
2. **Coherencia aritmética:** fórmula INAPI (N/A fuera del denominador; umbrales ≤80 / 81–90 / ≥91).
3. **Alineación al checklist** ([`data/checklist-criteria.json`](../data/checklist-criteria.json)): criterio vs verificación.
4. **Utilidad para TIC:** sustituciones con `original` localizable en HTML; sin inventar datos (peso PDF).
5. **Alcance acordado:** solo texto; sin pedir rediseño (ambos cumplen en general).
6. **Trazabilidad Fase 0:** extracción Tnnn / referencias HTML-L.

---

## 3. Resultados numéricos (verificados)

### Gemini

| Métrica | Valor |
| --- | --- |
| No aplica | 4 (C6, C7 y otros implícitos en tabla) |
| Aplicables | 35 |
| Cumple | 31 |
| Incumple | 4 (B1, C2, D7, F4) |
| % | 31 ÷ 35 = **88,57 %** → **88,6 %** ✓ |
| Estado | **Aceptado con observaciones** (81–90,9 %) ✓ |

### Claude

| Métrica | Valor |
| --- | --- |
| No aplica | 6 (C6, C7, D3, D4, D6, H1) |
| Aplicables | 33 |
| Cumple | 15 |
| Incumple | 18 |
| % | 15 ÷ 33 = **45,45 %** → **45,5 %** ✓ |
| Estado | **Rechazado** (≤80 %) ✓ |

Ambos calcularon bien el resumen **según sus propias filas**. La brecha (**43 puntos**) viene de **criterios evaluados distinto**, no de un error de división.

---

## 4. Matriz de divergencias por criterio

Leyenda: **G** = cumple/incumple más favorable a la página · **C** = más estricto · **=** = mismo criterio de fondo.

| ID | Tema | Gemini | Claude | Comentario |
| --- | --- | --- | --- | --- |
| A2 | Pirámide invertida | Cumple | Incumple (media) | Claude exige intro bajo H3; en home es discutible. |
| A5 | Contenido útil a la tarea | Cumple | Incumple (media) | Claude cuestiona RUT en pie y banners sin contexto. |
| B1 | Voz activa | Incumple (media) — noticia | Incumple (alta) — modal + meta | **Claude más completo** (T372 contacto). |
| B2 | Sin jerga | Cumple | Incumple (media) | Claude: PCT, Observancia, WIPO en nav/noticias. |
| B3 | Siglas definidas | Cumple | Incumple (alta) | **Divergencia fuerte** — Claude alinea mejor a RLC. |
| B4 | Sin extranjerismos | Cumple | Incumple (baja) | Claude: «Startup», «Login». |
| B6 | Tono cercano | Cumple | Incumple (media) | Claude: «Utiliza el canal…». |
| C1 | Orden SVP | Cumple | Incumple (media) | Claude en párrafo noticia T432. |
| C2 | Presente simple | Incumple (baja) — modal | Cumple | **Inconsistencia Claude** (cita «fue seleccionada» en C2 cumple pero B1 ataca pasiva). |
| D1 | Ortografía | Cumple | Incumple (alta) | Claude: `documentaicón` en meta, «LINK EXTERNO». |
| D3, D4, D6 | Formato visual | (no explícito N/A) | No aplica | Claude acota bien alcance CSS. |
| D7 | Mayúsculas | Incumple (media) — 2 buscadores | Incumple (media) — más ítems | Claude lista ACCESOS, banners, etc. |
| E3 | Fecha actualización visible | Cumple (fechas noticias) | Incumple (alta) — sin fecha página | **Criterio E3 es de la página** — Claude más fiel al checklist para *home*. |
| E4 | Título representativo | Cumple | Incumple (media) | Claude propone título orientado a tarea. |
| F1–F3 | Enlaces | Mayormente cumple | Varios incumple | Claude: «Conoce más», «Acceder», «Login», Observancia/URL. |
| F4 | Formato/peso documento | Incumple (alta) | Incumple (alta) | **Acuerdo** — ambos detectan guías sin PDF/peso. |
| G1 | RUT personas naturales | Cumple | Incumple (alta) — RUT institucional | **Gemini más acertado** — G1 habla de personas naturales; RUT INAPI es jurídica. |
| H1 | Archivo | (cumple en tabla) | No aplica | Claude coherente en home sin versiones archivadas. |

---

## 5. Fortalezas y debilidades por agente

### 5.1 Gemini

**Fortalezas**

- Informe **corto y presentable** para dirección: 4 hallazgos, 6 cambios TIC.
- Fase 0 ordenada (T001–T091) con referencias Lnnn al HTML.
- Detecta bien **F4** (descargas) y **D7** en buscadores.
- Tono del resumen ejecutivo claro y priorizado por severidad.
- Marca **G1 cumple** (RUT institucional no es persona natural).

**Debilidades**

- **Subaudita** navegación y microcopy: no incumple F2/F3 por «Conoce más», «Acceder», «Login»; no marca B3 (PCT/WIPO).
- **No reporta** artefactos de desarrollo (`LINK EXTERNO`, error `documentaicón` en meta) que TIC debería corregir.
- **E3 cumple** usando solo fechas de noticias — discutible para la página home en su conjunto.
- **Inventa pesos PDF** (1,4 MB / 2,1 MB) sin validar — **no entregar a TIC sin confirmar** en servidor/CMS.
- JSON final: `"criterios_evaluados": 39` (número) en lugar de arreglo de 39 objetos — no alinea a [`strictAuditRecordSchema`](../src/schemas/checklist.ts).
- B1 incumple solo voz pasiva en **noticia** (T060), no en **modal de contacto** (mismo hallazgo que Claude en T372).

### 5.2 Claude

**Fortalezas**

- **Mayor cobertura editorial** acorde a checklist completo en una home con mucho menú y CTA.
- **17 sustituciones** diferenciadas (dos «Conoce más» con destinos distintos — importante para TIC).
- Detecta **enlaces genéricos**, **anglicismos**, **meta errónea**, texto **LINK EXTERNO**.
- Explicita **no aplica** en criterios visuales (D3, D4, D6) — buena disciplina de alcance.
- JSON con arreglo por criterio (aunque falta detalle `cita_textual` por fila).
- Nota final para TIC sobre búsqueda literal y entidades HTML — muy práctica.

**Debilidades**

- **G1 incumple por RUT institucional** — interpretación discutible vs redacción del criterio (personas naturales).
- Resultado **45,5 % / Rechazado** puede **desmotivar** sin matiz de «home compleja vs página interior».
- **C2 cumple** pese a oraciones con «fue seleccionada» — ligera inconsistencia interna con B1.
- Sustituciones en meta (`title`, `description`) — útiles SEO/LC pero **no son sustitución trivial en HTML visible**; TIC debe saber que son `<title>` / `<meta>`.
- No propone peso en PDF (solo «(PDF)») — más honesto que Gemini, pero incompleto vs verificación F4.

---

## 6. Sustituciones: coincidencias y exclusivas

### Coinciden (mismo espíritu)

| Original | Gemini | Claude |
| --- | --- | --- |
| Descargar guía de marcas/patentes | Añade (PDF, X MB) inventado | Añade (PDF) sin peso |
| BUSCADOR DE PATENTES / marcas | Buscador de patentes / marcas | Igual |
| Tu consulta será atendida… | Voz activa (variante) | Voz activa (variante) |
| Drovid fue seleccionada… | Reescritura activa | (no en sustituciones; B1 en tabla) |

### Solo Claude (relevantes para TIC)

- `Conoce más` → textos según destino (menú vs observancia).
- `Acceder` → descripción plataforma.
- `Login` → `Ingresar`.
- `Contraste de pagina` → tilde.
- Título página y meta description (E4/B1).
- Mayúsculas en banners «INFORMACIÓN TECNOLÓGICA…», «PROGRAMA DE DESARROLLO…».
- Titular noticia Startup/WIPO → empresa emergente / OMPI.

### Solo Gemini

- Peso PDF numérico (requiere validación antes de implementar).

---

## 7. Calidad Fase 0 (extracción de texto)

| Aspecto | Gemini | Claude |
| --- | --- | --- |
| Granularidad | Lista larga T001–T091 | Tabla compacta con rangos y meta |
| Referencia HTML | Mezcla Tnnn + Lnnn en citas | Tnnn + HTML-L aprox |
| Meta / no visible | Poco énfasis | Incluye title, description, keywords |
| Enlaces partidos | No detalla | Nota «Cómo / registrar» en dos nodos — **útil para TIC** |

**Conclusión Fase 0:** Claude documenta mejor **casos límite** (meta, enlaces rotos en DOM); Gemini es más lineal para lectura humana.

---

## 8. Alineación con objetivos de reunión (2026-06-02)

| Objetivo | Gemini | Claude |
| --- | --- | --- |
| PDF con cumplimiento/errores | Sí — breve | Sí — exhaustivo |
| HTML corregido (solo texto) | 6 reemplazos claros | 17 reemplazos + meta |
| No sobre-ingeniería | Sí | Sí (no pide rediseño) |
| Solicitudes concretas a TIC | Parcial | **Fuerte** |
| Comparar proveedor | Base optimista | Base exigente |
| 10 URLs antes de fin de año | Riesgo de subestimar esfuerzo | Riesgo de percepción «todo mal» |

---

## 9. Propuesta de decisión para mostrar al equipo UX

### Opción A — Elegir un proveedor para el piloto de 10 URLs

**Claude** como agente principal de auditoría (Gema/Proyecto), con reglas de calibración acordadas (detalle operativo en [`flujo-piloto-10-urls-claude-mvp.md`](flujo-piloto-10-urls-claude-mvp.md) §3.2 — cobertura 1:1 `incumple` → `sustituciones[]`):

1. **G1:** RUT y teléfono **institucional** no son dato de persona natural; si se marca incumple por A5 (sin valor para la tarea), igual debe haber fila en `sustituciones[]` (quitar o mover RUT).
2. **E3 en home:** exigir fecha de actualización de la **página** visible; si no existe, fila en `sustituciones[]` con `original: "(ausencia)"` e inserción propuesta (no basta con fechas de noticias).
3. **Meta no visible:** incumplimientos en `<title>`/`<meta>` en sección aparte «SEO / metadatos», no mezclados con texto visible sin aviso.
4. **F4:** exigir formato; **peso solo si consta en CMS** — prohibido inventar MB.
5. **Salida JSON** alineada a fixtures del repo; cada `incumple` con al menos una sustitución y `html_linea_aprox` cuando aplique.

### Opción B — Flujo híbrido (recomendado para calidad)

```text
Claude  → auditoría completa + lista larga de sustituciones
     ↓
Revisión UX (Bernarda) → filtra falsos positivos y prioriza
     ↓
Gemini  → opcional: redactar resumen ejecutivo para Álvaro/TIC
     ↓
PDF + HTML corregido validado
```

### Opción C — Mantener solo Gemini

Solo si el equipo prioriza **velocidad narrativa** y acepta **revisión manual obligatoria** de enlaces, siglas y meta (porque el informe dejó fuera ~14 tipos de hallazgos que Claude sí listó).

---

## 10. Mensaje sugerido para la reunión UX (slide o verbal)

> Auditaron la misma home con Gemini y Claude. **Ambos cumplieron los 39 criterios y la matemática del %.** La diferencia es de **rigor**: Gemini reporta **4 incumplimientos** (88,6 %, aceptado con observaciones) y **6 cambios** a TIC; Claude reporta **18 incumplimientos** (45,5 %, rechazado) y **17 cambios**, incluyendo enlaces genéricos, siglas y textos de desarrollo. **Para entregar trabajo accionable a TIC, Claude fue más completo.** **Para no alarmar sin calibración, conviene reglas compartidas** (RUT institucional, fechas en home, no inventar pesos PDF). **Recomendación:** seguir piloto con **Claude** + revisión UX, o flujo híbrido Claude audita / humano filtra / informe ejecutivo en Gemini.

---

## 11. Próximos pasos sugeridos

| # | Acción | Responsable |
| --- | --- | --- |
| 1 | Validar con Bernarda reglas G1, E3 y alcance meta en home | UX |
| 2 | Elegir proveedor para las **9 URLs restantes** del piloto de 10 | Grupo |
| 3 | Aplicar sustituciones **aprobadas** solo tras revisión (no pesos PDF inventados) | Fernando + TIC |
| 4 | Cerrar lista oficial de **10 URLs** vs inventario 22 | Fernando + Bernarda |
| 5 | Documentar acta en DEVLOG y actualizar [`Propuesta Análisis LC URLs.md`](Propuesta%20Análisis%20LC%20URLs.md) | Fernando |
| 6 | Segunda URL piloto con el proveedor elegido + mismo HTML backup | Fernando |

---

## 12. Anexos

### A. Incumplimientos solo en Claude (para checklist de revisión humana)

- A2, A5, B2, B3, B4, B6, C1, C3, D1, E3, E4, F1, F2, F3, G1 (discutible).

### B. Incumplimientos solo en Gemini

- C2 (presente en modal de contacto).

### C. Referencias en repo

- Checklist: [`data/checklist-criteria.json`](../data/checklist-criteria.json)
- Contrato salida: [`src/schemas/checklist.ts`](../src/schemas/checklist.ts) — `strictAuditRecordSchema`
- Ejemplo fixture: [`data/audit-fixtures/audit_fixture_notificaciones_marcas_rechazado.json`](../data/audit-fixtures/audit_fixture_notificaciones_marcas_rechazado.json)
- Ficha home mock rank 21: [`data/ux/clarity-fichas-mock.json`](../data/ux/clarity-fichas-mock.json)

---

*Documento generado para soporte de decisión del piloto IA (junio 2026). No sustituye la validación editorial del Equipo UX.*
