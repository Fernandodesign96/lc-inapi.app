# Documento de Requerimientos de Producto (PRD)
## MVP — Aplicativo de Auditoría de Lenguaje Claro INAPI

| Metadatos | Detalle |
| --- | --- |
| **Proyecto** | LC INAPI APP — evaluación automatizada asistida por IA del checklist editorial |
| **Versión PRD** | 0.3.9 |
| **Estado** | En definición — Fase 1: mock UX e interfaz institucional; Fase 2: persistencia, API y evaluación con Claude (Python) según ADR |
| **Stack objetivo** | Next.js (App Router, Turbopack) · TypeScript · Tailwind · shadcn/ui · React Hook Form + Zod · Supabase (Auth, Postgres, RLS, Storage) · API de dominio **NestJS** + **Prisma** · evaluación LC **Python** + **Claude API** expuesta en **AWS** (**API Gateway** + **Lambda** por defecto; ECS/EC2 si aplica) · Bun · acuerdos en [propuesta técnica integral](PROPUESTA_TECNICA_INTEGRAL.md) |
| **Normativa base** | Checklist Editorial INAPI v1.1 (derivado de RLC “Lenguaje claro para la web” y Calidad Web 2.0 dimensión contenido) |

---

## 1. Resumen ejecutivo

Herramienta web para **evaluar contenidos** publicados o por publicar en **`inapi.cl`** y **`tramites.inapi.cl`**, aplicando los **39 criterios** del checklist editorial, produciendo **porcentaje de cumplimiento**, **estado de aceptación**, **hallazgos con cita textual** y **texto propuesto** de corrección. Objetivo: reducir el tiempo de auditoría manual por URL (orden de **horas** a **minutos**), con **trazabilidad** y **validación humana** antes de exportar informes.

El aplicativo **asiste** al criterio editorial de INAPI; **no** publica en CMS ni sustituye la decisión final del equipo.

En **Fase 2**, el flujo técnico previsto es: **Next** → **Nest** → (REST/JSON) **API Gateway** → **Lambda Python** → **Claude** → respuesta validada → **persistencia vía Nest/Prisma** (detalle en [ARCHITECTURE.md](ARCHITECTURE.md) y [ADR 0006](adr/0006-lc-evaluation-python-claude-aws.md)).

---

## 2. Objetivos y métricas

| Objetivo | Métrica sugerida | Meta MVP |
| --- | --- | --- |
| Reducir tiempo de auditoría por URL | Minutos desde inicio hasta informe revisado | \< 5 min (tras flujo maduro) |
| Calidad de la evaluación asistida | Acuerdo con auditoría humana en muestra fija | ≥ 85 % en N URLs piloto |
| Trazabilidad | % de auditorías con checklist versionado y criterios completos | 100 % |
| Respuesta LLM | p95 latencia evaluación | \< 30 s por URL (según modelo y tamaño) |
| Adopción interna | Usos semanales equipo UX | Definir con liderazgo (p. ej. Bernarda + responsable técnico) |

---

## 3. Usuarios y alcance

| Perfil | Necesidad |
| --- | --- |
| **Editor UX / contenidos** | Auditar URL, ver hallazgos, ajustar texto propuesto, exportar informe |
| **Liderazgo / revisión** | Confianza en criterios, escalas y versiones alineadas a pauta institucional |

**Fuera de alcance MVP:** edición directa en CMS; **cron** de auditorías masivas; **workflow multi-rol** complejo; auditoría **visual/UI** (instrumento aparte: Pauta de Diseño Visual); comparación multi-URL en un solo informe.

---

## 4. Requisitos funcionales

1. **Ingreso de URL** acotada a dominios permitidos (`inapi.cl`, `tramites.inapi.cl`).
2. **Captura de contenido** (texto visible: títulos, cuerpo, labels, mensajes). Fallback: **pegado manual** si la página requiere sesión o bloquea scraping.
3. **Confirmación por el editor** del texto enviado a evaluación.
4. **Evaluación** criterio a criterio según checklist v1.1 (pipeline: reglas + LLM según decisión de arquitectura).
5. **Cálculo** de `criterios_aprobados`, `criterios_no_aplica`, `criterios_aplicables`, **`porcentaje_cumplimiento`** y **`estado_aceptacion`** según rangos oficiales (sobre criterios **aplicables**; los N/A no entran en el denominador):
   - **Hasta 80 %** (inclusive) → Rechazado  
   - **81–90 %** → Aceptado con observaciones  
   - **91–100 %** → Aprobado  
6. **Tabla de hallazgos** para incumplimientos: código, descripción, cita textual, severidad, comentario.
7. **Texto propuesto** que aborde criterios incumplidos (revisable por humano). En **Fase 1 (mock)** puede mostrarse desde **fixtures** JSON alineados al contrato; en **Fase 2** proviene del pipeline **Claude API** (servicio **Python**) con validación Zod, según arquitectura y [ADR 0006](adr/0006-lc-evaluation-python-claude-aws.md).
8. **Persistencia** (a partir de Fase 2): auditoría con fecha, URL, resultado, autor, versión de checklist y versión de prompt.
9. **Histórico por URL** (post-MVP o fase tardía según roadmap).
10. **Exportación** PDF/Word (post-MVP o fase tardía según capacidad).

**Fase 1 (mock) — requisitos de interfaz adicionales**

- Aplicación de la **pauta visual institucional** ([`docs/DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md)): tipografía, color, espaciado y **WCAG** en todo el MVP mostrado al equipo.
- **Página de inicio (`/`)** como **portal de acceso institucional** (composición tipo “login” Gobierno: bienvenida, CTA **Acceder** → **`/auditar`**). **No** duplica el ingreso de URL: evita dos pantallas con la misma función y alinea la orquestación del flujo a la realidad del aplicativo (entrada simbólica para quienes auditan URLs INAPI). En Fase 1 **no** se implementa autenticación real.
- **Pantalla de ingreso (`/auditar`)** con **barra principal de URL** y, **debajo**, **tres atajos** a URLs priorizadas por el equipo (perfiles **peor / intermedio / mejor** desempeño LC según referencia editorial o fixtures). En el mock, los atajos navegan **directo al resultado** de auditoría para esas URLs (historial / “ya auditadas” en la narrativa de producto). **Bloque de inventario Calidad Web:** tarjeta **Tabla de Auditorías URLs - Calidad Web: Sitio Web y Trámites - INAPI** con acordeón **Historial de Auditorías URLs - INAPI** (tabla **22 URLs** objetivo: ranks 1–20 portal `tramites.inapi.cl`, ranks 21–22 `www.inapi.cl`; campo **`type_url`**; filtro **Trámites / Sitio Web** implementado; Encargado, Visitas, Auditorías, Última revisión, % LC, Estado; enlaces a ficha por `rank`; **filtros y orden** por estado, visitas, auditorías, última revisión y % LC). Las **observaciones** de seguimiento viven en **`/auditar/inventario/clarity/[rank]`**, no en una segunda tabla. Patrón visual: barra colapsable con **título explícito**, **icono flecha hacia abajo**, **contraste claro pero no ruidoso** y **`gap` vertical homogéneo** (§15 design system). Detalle en [`docs/ux/inventario-urls-clarity.md`](ux/inventario-urls-clarity.md).
- **Resultado de auditoría (mock):** visualización del **porcentaje** (p. ej. barra térmica o equivalente alineado al design system), **estado de aceptación**, **pasos a seguir** para el editor y tabla de **39** criterios.
- **Estado de espera** entre acción del usuario y resultado: mensaje claro y accesible; **no** declarar integración real con base de datos hasta existir backend.

---

## 5. Requisitos no funcionales

- **Seguridad:** claves de LLM y servicios solo en servidor; RLS en Supabase por `user_id` / organización cuando exista login institucional.
- **Privacidad:** preferir páginas públicas; minimizar almacenamiento de PII capturada por error.
- **Versionado:** checklist y prompt deben versionarse en conjunto (`version_checklist`, `prompt_version`).
- **Accesibilidad:** UI usable con teclado y lectores (objetivo WCAG razonable para herramienta interna).

---

## 6. Modelo de información (contrato lógico)

- **Catálogo de criterios:** ver `data/checklist-criteria.json` y `src/schemas/checklist.ts` (Zod).
- **Evaluación por auditoría:** arreglo de **39** objetos `{ id, estado, cita_textual?, severidad?, comentario? }` con `estado ∈ { cumple, incumple, no_aplica }`.
- **Reglas de conteo:** los N/A **no** entran en el denominador del porcentaje (según pauta checklist).

---

## 7. Fases de entrega

| Fase | Entregable |
| --- | --- |
| **Fase 1 — Mock UX e interfaz** | UI alineada al design system; **home** como portal de acceso a **`/auditar`**; en **`/auditar`**: ingreso URL + tres atajos a resultado + **un** inventario Calidad Web (Sitio + Trámites) en **tarjeta + acordeón** — **22 URLs** con **`type_url`** y filtro Trámites/Sitio Web implementado; ficha `/auditar/inventario/clarity/[rank]` con observaciones; filtros LC/orden implementados; datos en `docs/ux/` y [`data/ux/clarity-fichas-mock.json`](../data/ux/clarity-fichas-mock.json); tabla de resultado con **Sección** y **Criterio** del checklist v1.1; fixtures JSON `strictAuditRecordSchema`; demo UX con feedback documentado. **Sin** backend productivo. Detalle en [`docs/ROADMAP.md`](ROADMAP.md) y [`docs/ux/inventario-urls-clarity.md`](ux/inventario-urls-clarity.md). |
| **Fase 2 — Persistencia y evaluación** | Supabase + NestJS + Prisma; contrato HTTP FE ↔ API; servicio **Python** + **Claude API**; entorno compartido **AWS**. Tras **aprobación** del mock de Fase 1. |
| **Fase 3 — Captura y endurecimiento** | Captura real (Cheerio vs Playwright — ADR); reintentos, costo y observabilidad del pipeline LLM. |
| **Fase 4 — Cierre MVP** | Export real, histórico por URL en UI, pruebas con URLs reales |

---

## 8. Riesgos (extracto)

| Riesgo | Mitigación |
| --- | --- |
| Costo / límites LLM | Modelo económico para iteración; acotar tokens; caché por hash de contenido |
| Falsos positivos/negativos | Revisión humana obligatoria antes de exportar |
| Falla de captura | Pegado manual; no auditar detrás de login sin consentimiento explícito |
| Deriva del checklist | Tabla `checklist_versions` + migraciones controladas |

---

*PRD alineado al documento conceptual «MVP — Aplicativo de Auditoría de Lenguaje Claro INAPI» v0.1 y al «Checklist Editorial INAPI» v1.1.*
