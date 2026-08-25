# Devlog — auditoría LC INAPI

Bitácora de decisiones de implementación, aprendizajes y bloqueos. Las entradas más recientes van **arriba**. Formato obligatorio: ver `.agents/workflows/devlog-standard.md`.

---

## Índice de avances

| Fecha | Entrada |
| --- | --- |
| 2026-08-25 | [Infraestructura: Sala de Prensa — Noticias www.inapi.cl — reauditoría v3.0 completa, rechazado 73,7 %](#devlog-2026-08-25-sala-de-prensa-noticias-reaudit-v30) |
| 2026-08-25 | [Infraestructura: Solicitud Nueva (Marcas) tramites.inapi.cl — reauditoría v3.0 completa, rechazado 71,4 %](#devlog-2026-08-25-solicitud-nueva-reaudit-v30) |
| 2026-08-25 | [Infraestructura: Buscador de noticias www.inapi.cl — reauditoría criterio 45 (rótulos/CTA), rechazado 71,0 % — cierre serie](#devlog-2026-08-25-buscador-noticias-reaudit-criterio-45-rotulos) |
| 2026-08-25 | [Infraestructura: Acerca de INAPI www.inapi.cl — reauditoría criterio 45 (rótulos/CTA) + encabezado canónico, rechazado 66,7 %](#devlog-2026-08-25-acerca-de-inapi-reaudit-criterio-45-rotulos) |
| 2026-08-25 | [Infraestructura: Patentes www.inapi.cl — reauditoría criterio 45 (rótulos/CTA) + encabezado canónico, rechazado 69,8 %](#devlog-2026-08-25-patentes-reaudit-criterio-45-rotulos) |
| 2026-08-25 | [Infraestructura: Marcas www.inapi.cl — reauditoría criterio 45 (rótulos/CTA) + encabezado canónico, rechazado 71,4 %](#devlog-2026-08-25-marcas-reaudit-criterio-45-rotulos) |
| 2026-08-25 | [Infraestructura: Portada www.inapi.cl — reauditoría criterio 45 (rótulos/CTA), rechazado 76,9 %](#devlog-2026-08-25-portada-reaudit-criterio-45-rotulos) |
| 2026-08-25 | [Infraestructura: Buscador de noticias www.inapi.cl — reauditoría v3.0 (51 LC-*) sin nomenclatura interna, rechazado 73,3 %](#devlog-2026-08-25-buscador-noticias-reaudit-v30-sin-nomenclatura) |
| 2026-08-25 | [Infraestructura: Portada www.inapi.cl — reauditoría v3.0 (51 LC-*) sin nomenclatura interna, rechazado 78,9 %](#devlog-2026-08-25-portada-reaudit-v30-sin-nomenclatura) |
| 2026-08-25 | [Infraestructura: Acerca de INAPI www.inapi.cl — reauditoría v3.0 (51 LC-*), rechazado 68,3 %](#devlog-2026-08-25-acerca-de-inapi-reaudit-v30) |
| 2026-08-25 | [Infraestructura: Patentes www.inapi.cl — reauditoría v3.0 (51 LC-*), rechazado 71,4 %](#devlog-2026-08-25-patentes-reaudit-v30) |
| 2026-08-25 | [Infraestructura: Marcas www.inapi.cl — reauditoría v3.0 (51 LC-*), rechazado 73,2 %](#devlog-2026-08-25-marcas-reaudit-v30) |
| 2026-08-24 | [Frontend: entrega resultado v3.0 — resumen por hito, filtros y PDF alineados](#devlog-2026-08-24-entrega-resultado-v30) |
| 2026-08-22 | [Infraestructura: Portada www.inapi.cl — reauditoría v3.0 (51 LC-*), rechazado 78,9 %](#devlog-2026-08-22-portada-reaudit-v30) |
| 2026-08-21 | [Orquestación: títulos/jerga (Observancia) + texto con apoyos vs IA](#devlog-2026-08-21-titulos-jerga-ia) |
| 2026-08-21 | [Orquestación: calibrar LC-1.3.1-01 = presencia de apoyos (no alt)](#devlog-2026-08-21-lc-131-apoyos) |
| 2026-08-21 | [Infraestructura: Portada www.inapi.cl — reauditoría oro v3.0 (51 LC-*), 75 % tras calibrar LC-1.3.1-01](#devlog-2026-08-21-portada-oro-v30) |
| 2026-08-21 | [Docs: CLAUDE.md — estados/severidad, CMS-first, nomenclatura LC-*, refs §N](#devlog-2026-08-21-claude-md-cms-estados) |
| 2026-08-21 | [Orquestación: catálogo PTD-LC v3.0 — 51 criterios por indicadores](#devlog-2026-08-21-ptd-lc-v30) |
| 2026-08-21 | [Orquestación: Checklist PTD v2.0 → §23 Hito/Tarea/Pregunta LC](#devlog-2026-08-21-ptd-s23) |
| 2026-08-21 | [Docs: mapa IEW/IESD completo LC·Usabilidad·Seguridad](#devlog-2026-08-21-mapa-iew-iesd) |
| 2026-08-21 | [Orquestación: §22 reforzado copy accionable CMS + prompt oro](#devlog-2026-08-21-s22-copy-accionable) |
| 2026-08-20 | [Docs/código: roles institucionales sin nombres de personas](#devlog-2026-08-20-roles-institucionales) |
| 2026-08-20 | [Orquestación: §22 entrega legible + mapa Checklist Editorial PTD v2.0](#devlog-2026-08-20-entrega-legible-ptd) |
| 2026-08-19 | [Frontend/MEI: Excel con 47 criterios y 5 categorías de presentación MEI](#devlog-2026-08-19-excel-47-categorias) |
| 2026-08-19 | [Frontend: META MEI órdenes 7–10 en proceso en UI](#devlog-2026-08-19-meta-mei-en-proceso) |
| 2026-08-19 | [Frontend: entrega visible — H1/E4 y 47 criterios en tabla](#devlog-2026-08-19-entrega-h1-47) |
| 2026-08-19 | [Documentación: workflow 1-URL profundidad (§20.6/§21, Playwright/Chroma)](#devlog-2026-08-19-workflow-1url) |
| 2026-08-19 | [Infraestructura: META MEI §20 — reauditoría Tanda A (órdenes 1–5)](#devlog-2026-08-19-meta-mei-reaudit-s20-lote-a) |
| 2026-08-18 | [Frontend/docs: calibración META MEI §20 + UI resultado legible](#devlog-2026-08-18-calibracion-ui-resultado) |
| 2026-08-18 | [Infraestructura: META MEI v2.1 — cierre lote 7–10 (Sala de Prensa, 2 noticias, SIAC)](#devlog-2026-08-18-meta-mei-lote-7-10) |
| 2026-08-18 | [Infraestructura: META MEI v2.1 — URL 6 Solicitud Nueva (orden 6)](#devlog-2026-08-18-meta-mei-url-6) |
| 2026-08-18 | [Infraestructura: META MEI v2.1 — URL 5 buscador de noticias (cierre lote 1–5)](#devlog-2026-08-18-meta-mei-url-5) |
| 2026-08-18 | [Frontend: entrega solo visible + Excel por URL](#devlog-2026-08-18-entrega-visible-excel-url) |
| 2026-08-18 | [Frontend: tabla META MEI 10 URLs e historial unificado](#devlog-2026-08-18-meta-mei-ui-historial) |
| 2026-08-18 | [Infraestructura: typecheck:all paso 4 audit-jobs](#devlog-2026-08-18-audit-jobs-typecheck) |
| 2026-08-18 | [Documentación: spike túnel Vercel↔worker PC](#devlog-2026-08-18-tunel-spike) |
| 2026-08-18 | [Frontend: descargas PDF/Excel desde resultado del job](#devlog-2026-08-18-audit-jobs-downloads) |
| 2026-08-18 | [Frontend: Continuar → job → poll en procesando](#devlog-2026-08-18-audit-jobs-ui-poll) |
| 2026-08-18 | [Backend: GET result e historial de audit-jobs](#devlog-2026-08-18-audit-jobs-result) |
| 2026-08-18 | [Infraestructura: worker audit-jobs stub local](#devlog-2026-08-18-audit-jobs-worker-script) |
| 2026-08-18 | [Backend: claim/complete audit-jobs + secreto worker](#devlog-2026-08-18-audit-jobs-claim) |
| 2026-08-18 | [Backend: horario 8–18 y estado `outside_hours`](#devlog-2026-08-18-audit-jobs-hours) |
| 2026-08-18 | [Backend: POST/GET `/api/audit-jobs`](#devlog-2026-08-18-audit-jobs-api) |
| 2026-08-18 | [Backend: persistencia audit-jobs (`data/jobs` + Zod)](#devlog-2026-08-18-audit-jobs-store) |
| 2026-08-17 | [Documentación: contratos API audit-jobs y claim worker](#devlog-2026-08-17-contratos-audit-jobs) |
| 2026-08-17 | [Documentación: ADR 0011 worker on-demand + cotización API](#devlog-2026-08-17-adr-0011-worker) |
| 2026-08-17 | [Checklist: merge v2.1 a main (Fase 4 paso 1)](#devlog-2026-08-17-checklist-merge-main) |
| 2026-08-17 | [Infraestructura: Claude Team INAPI — migración cuenta + smoke test](#devlog-2026-08-17-claude-team-inapi) |
| 2026-08-17 | [Checklist: v2.1 — 47 criterios, citas IEW/IESD/RLC y orquestación Claude](#devlog-2026-08-17-checklist-v21-47) |
| 2026-07-29 | [Infraestructura: Reauditoría §17 de 3 URLs META MEI + Excel regenerado](#devlog-2026-07-29-meta-mei-reauditoria-17) |
| 2026-07-29 | [Frontend/MEI: 10 URLs META MEI + pestaña Fuentes en Excel](#devlog-2026-07-29-meta-mei-10-urls-fuentes) |
| 2026-07-29 | [Frontend: MEI — UI jerárquica y Excel estilo MEI institucional](#devlog-2026-07-29-mei-ui-excel-institucional) |
| 2026-07-28 | [Frontend: MEI calidad web — catálogo PTD, export XLSX y UI por hito](#devlog-2026-07-28-mei-calidad-web-export-ui) |
| 2026-07-27 | [Frontend: Historial versionado de auditorías por URL](#devlog-2026-07-27-frontend-historial-auditorias) |
| 2026-07-27 | [Infraestructura: Fase 3.3 — lote WSL ranks 3, 4, 10, 12, 14 con sesión ClaveÚnica](#devlog-2026-07-27-fase-3-3-lote-ranks-3-4-10-12-14) |
| 2026-07-27 | [Infraestructura: Fase 3.3 — lote WSL ranks 5–7 con sesión ClaveÚnica](#devlog-2026-07-27-fase-3-3-lote-ranks-5-7) |
| 2026-07-23 | [Documentación: Fase 3.3 — captura autenticada ClaveÚnica y calibración datos de sesión](#devlog-2026-07-23-fase-3-3-auth-sesion) |
| 2026-07-23 | [Infraestructura: Fase 3 — Flujo completo auditoría con sub-subagentes y lote 5 URLs](#devlog-2026-07-23-fase-3-audit-full-flow) |
| 2026-07-22 | [Infraestructura: Fase 2 — Registro MCP RAG Auditoria en Claude Code Pro](#devlog-2026-07-22-fase-2-rag-mcp) |
| 2026-07-22 | [Infraestructura: Fase 1 — Registro MCP Playwright en Claude Code Pro](#devlog-2026-07-22-fase-1-playwright-mcp) |
| 2026-07-22 | [Estrategia: Fase 0 — CLAUDE.md, 3 skills y arquitectura sub-subagentes (WSL)](#devlog-2026-07-22-fase-0-claude-skills) |
| 2026-07-21 | [Documentación: AI Stack v2 — ADR-0008/0009/0010, ARCHITECTURE, PROPUESTA y ROADMAP (PC empresa)](#devlog-2026-07-21-ai-stack-v2) |
| 2026-06-28 | [Documentación: Stack orquestación auditoría — DOM, DevTools, Excel MEI y hito 30-jun](#devlog-2026-06-28-stack-orquestacion-mei) |
| 2026-06-11 | [Estrategia: Cierre oleada auditable Clarity — inventario 17 URLs y ranks 14 y 17](#devlog-2026-06-11-clarity-cierre-oleada-auditable) |
| 2026-06-15 | [Frontend: Serie Clarity — cableado MVP en `/auditar`, CI y 5 JSON en `urls-clarity`](#devlog-2026-06-15-clarity-cableado-mvp) |
| 2026-06-11 | [Estrategia: Serie Clarity — JSON ranks 1–3 y 21, prompts §3.5 y esquema `clarity_meta`](#devlog-2026-06-11-serie-clarity-json) |
| 2026-06-08 | [Documentación: sincronización Fase 1.5 — 9 URLs en MVP, merge `main`, CI y Vercel](#devlog-2026-06-08-docs-fase-1-5) |
| 2026-06-07 | [Fase 1.5: cierre piloto Claude — JSON URLs 4–9, SIAC y landing `tramites.inapi.cl`](#devlog-2026-06-07-piloto-cierre-9-urls) |
| 2026-06-07 | [Frontend: Piloto Claude — JSON URLs 1–3, prompt §3.2 y conexión en tabla `/auditar`](#devlog-2026-06-07-piloto-json-claude) |
| 2026-06-04 | [Frontend: Fase C — exportación PDF del informe piloto y descarga en resultado](#devlog-2026-06-04-fase-c-pdf) |
| 2026-06-04 | [Frontend: Tabla piloto 10 URLs en `/auditar`](#devlog-2026-06-04-auditar-tabla-piloto) |
| 2026-06-04 | [Frontend: Orquestación resultado piloto — 7 bloques §4 en código](#devlog-2026-06-04-resultado-orquestacion-codigo) |
| 2026-06-03 | [Documentación: Orquestación UI resultado piloto — 7 bloques y acordeones](#devlog-2026-06-03-resultado-orquestacion-piloto) |
| 2026-06-03 | [Frontend: Resultado — query `claudeAudit` y carga desde API piloto](#devlog-2026-06-03-resultado-claude-audit) |
| 2026-06-02 | [Estrategia: Fase 1.5 — piloto 10 URLs con Claude, reuniones UX y documentación operativa](#devlog-2026-06-02-fase-1-5-piloto-claude) |
| 2026-05-29 | [Frontend: Cierre Etapas 5b y 5c — inventario Calidad Web con `type_url` y filtro Tipo](#devlog-2026-05-29-cierre-5b-5c-inventario) |
| 2026-05-28 | [Documentación: Inventario único — Historial LC en `/auditar`](#devlog-2026-05-28-inventario-unico-docs) |
| 2026-05-28 | [Documentación: Consistencia de inventarios, tablas y pantallas mock en `/auditar`](#devlog-2026-05-28-consistencia-inventarios-docs) |
| 2026-05-27 | [Frontend: Feedback UX — catálogo en tabla de criterios y mock de 20 fichas Clarity](#devlog-2026-05-27-feedback-ux-criterios-fichas) |
| 2026-05-22 | [Infraestructura: Etapa 1 del plan híbrido — Vercel, GitHub Actions y verificación del mock en URL](#devlog-2026-05-22-vercel-gha-etapa1) |
| 2026-05-21 | [Frontend: Fixtures de auditoría — datos, scripts, validación, API y UI](#devlog-2026-05-21-fixtures-implementacion) |
| 2026-05-21 | [Documentación: Ejemplo editorial fixtures (rechazado) + alineación inventario / roadmap](#devlog-2026-05-21-fixtures-plan-ejemplo-notificaciones) |
| 2026-05-21 | [Frontend: Estado intermedio — pantalla `/auditar/procesando`](#devlog-2026-05-21-estado-intermedio-procesando) |
| 2026-05-20 | [Frontend: Resultado mock — barra de cumplimiento, pasos a seguir y texto propuesto](#devlog-2026-05-20-resultado-mock-cierre) |
| 2026-05-20 | [Frontend: Tabla de criterios con severidad mock, jerarquía visual e inventarios alineados](#devlog-2026-05-20-tabla-severidad-inventarios) |
| 2026-05-19 | [Frontend: Cierre mock `/auditar` desde el último PR (atajos, inventarios, resultado y `data/ux`)](#devlog-2026-05-19-auditar-data-ux-devlog) |
| 2026-05-19 | [Frontend: Portal de acceso en `/` (mock v1.0, sin cabecera global)](#devlog-2026-05-19-portal-home-mock) |
| 2026-05-19 | [Documentación: Flujo home gateway, `/auditar` (atajos, Clarity) y barras colapsables](#devlog-2026-05-19-doc-flujo-auditar) |
| 2026-05-18 | [Marco visual institucional: cabecera, tema y lienzo global](#devlog-2026-05-18-marco-visual-shell) |
| 2026-05-18 | [Design system en la interfaz y contenedor ancho del flujo /auditar](#devlog-2026-05-18-design-system-ui) |
| 2026-05-16 | [Documentación alineada a propuesta técnica integral (AWS API Gateway, Lambda, roles)](#devlog-2026-05-16-documentacion) |
| 2026-05-14 | [Pantallas mock del flujo auditar (captura y resultado con 39 criterios)](#devlog-2026-05-14-pantallas-mock) |
| 2026-05-14 | [Inicialización del frontend con Next, Tailwind, shadcn y formulario URL](#devlog-2026-05-14-inicializacion-frontend) |
| 2026-05-13 | [Documentación y contratos de la fase 0 (PRD, ADR, checklist y script de validación)](#devlog-2026-05-13-fase-0) |

---

<a id="devlog-2026-08-25-sala-de-prensa-noticias-reaudit-v30"></a>
## [2026-08-25] - Infraestructura | Sala de Prensa — Noticias: reauditoría v3.0 completa, rechazado 73,7 %

**Rama:** `feat/resultado-criterios-excel-alineado`

### Contexto y objetivos:

Reauditoría completa (Prompt 5, orden 7 de la serie META MEI) de `https://www.inapi.cl/sala-de-prensa/noticias`, sustituyendo el JSON vigente del 2026-08-22. Se aplicaron con rigor las calibraciones vivas que aún no se habían aplicado a esta URL: `C-2026-08-25c` (el criterio 42, rótulos y CTA descriptivos, se evalúa siempre, no se marca `no_aplica` por «es informativa»), `C-2026-08-25e` (el criterio 4, datos clave, aplica a contenido informativo, no solo a trámites) y `C-2026-08-25h` (lenguaje ciudadano sin nomenclatura interna en la entrega; distinguir la fecha de la página de listado en sí de la fecha de cada noticia individual).

### Implementación técnica:

- Nueva captura Playwright del DOM renderizado de la página (listado de tres tarjetas de noticia, panel de acceso/registro, ventana «Buscar y tramitar» y ventana de contacto, todos documentados como componentes de layout compartido con otras URLs de esta sesión). HTML guardado en `auditorias/htmls/www-inapi-cl-sala-de-prensa-noticias_2026-08-25.html`.
- El contenido editorial propio de la página (tres noticias, títulos, fechas y extractos) es equivalente al de la captura del 2026-08-22; el cambio de puntaje viene de aplicar con más rigor las calibraciones vigentes, no de un cambio en el sitio.
- El criterio 12 (`LC-1.1.4-01`, fecha de actualización) pasa de `cumple` a `incumple` severidad alta: la revisión anterior había aceptado la fecha de cada noticia individual como si fuera la fecha de actualización de la página de listado; al distinguir ambas cosas, la página de listado en sí no muestra ninguna fecha propia de publicación ni de revisión.
- El criterio 42 (`LC-5.2.4-01`, rótulos/CTA) pasa de `no_aplica` a `incumple` severidad media, con la misma evidencia de patrón de sitio ya documentada en otras URLs de esta sesión («Conoce más» del menú global y «LINK EXTERNO» del panel de acceso).
- El criterio 15 (`LC-5.2.1-01`, claridad de servicio digital / preguntas frecuentes) se mantiene en `no_aplica`, ahora con la justificación ciudadana estándar («No se encontraron elementos visuales ni texto que haga referencia a preguntas frecuentes...») en vez de mencionar `applicability` o siglas sueltas.
- El criterio 4 (`LC-1.1.2-03`, datos clave) se mantiene en `incumple`, ahora severidad media (no alta, porque hay cumplimiento parcial vía título+fecha+extracto de cada tarjeta, salvo el extracto de la tercera tarjeta, que además incumple lenguaje plano).
- Entrega revisada para no usar `Tnnn`, `applicability`, siglas sueltas ni la pregunta del criterio como «Texto en pantalla»: todas las citas son literales de la página o descripciones de ausencia.
- Resultado: 73,7 % de cumplimiento (28 de 38 criterios aplicables), calificación RECHAZADO. 13 criterios no aplican (listado de noticias sin trámites, listados de personas con RUN ni contenidos sensibles).
- Cableado frontend actualizado: `frontend/src/lib/claude-audits-launch.ts` (pilotoNum 7, `claudeAuditId` vigente = `www-inapi-cl-sala-de-prensa-noticias_2026-08-25`, historial ampliado con el id del 2026-08-22) y `src/lib/mei-export/mei-meta-mei-urls.ts` (orden 7 → mismo id vigente).
- `bun run validate:claude-audits` pasa sin errores (82 auditorías alineadas con los archivos de lanzamiento).

### Próximos pasos:

- Continuar la serie META MEI con las órdenes siguientes (detalle de noticias) bajo el mismo rigor de calibración.

---

<a id="devlog-2026-08-25-solicitud-nueva-reaudit-v30"></a>
## [2026-08-25] - Infraestructura | Solicitud Nueva (Marcas): reauditoría v3.0 completa, rechazado 71,4 %

**Rama:** `feat/resultado-criterios-excel-alineado`

### Contexto y objetivos:

Reauditoría completa (Prompt 5, orden 6 de la serie META MEI) de `https://www.inapi.cl/marcas/tramites/solicitud-nueva`, sustituyendo el JSON vigente del 2026-08-22. Se aplicó con rigor el conjunto de calibraciones vivas en `06-calibracion-hallazgos.md` que aún no se habían aplicado a esta URL: `C-2026-08-25c` (el criterio 45, rótulos y CTA descriptivos, aplica a todas las URLs — ya no queda `no_aplica` por «es un panel de accesos, no un servicio digital»), `C-2026-08-25e` (el criterio 4, datos clave, no se marca `no_aplica` con la excusa «no es trámite» cuando la URL sí es información de un trámite), `C-2026-08-25f` (fecha de actualización ausente = severidad alta) y `C-2026-08-25g` (ausencia total de texto que cumpla un requisito = severidad alta, nunca media).

### Implementación técnica:

- Nueva captura Playwright del DOM renderizado de la página (panel de acceso/registro, ventana «Buscar y tramitar» y ventana de contacto verificados con 1 clic; pesos de los 3 documentos del carrusel del pie reverificados hoy vía cabecera HTTP `Content-Length`: 293 KB, 3,3 MB y 590 KB). HTML guardado en `auditorias/htmls/www-inapi-cl-marcas-tramites-solicitud-nueva_2026-08-25.html`.
- El contenido de la página es equivalente al de la captura del 2026-08-22 (sin cambios editoriales en el sitio); el cambio de puntaje viene de aplicar las calibraciones más recientes, no de un cambio en el sitio.
- Análisis textual ascendente (Paso D0): confirma que «Publicación en el Diario Oficial», «Pizarra de Pagos» y «Presentación de Escritos» siguen sin definirse, y que no existe ningún párrafo ni recuadro entre el submenú de pestañas y las cinco tarjetas de acción.
- El criterio 45 (`LC-5.2.4-01`) pasa de `no_aplica` a `incumple` severidad media, con evidencia propia de esta página («Conoce más» del menú global y «LINK EXTERNO» del panel de acceso, ambos componentes compartidos).
- Los criterios 4 y 5 (`LC-1.1.2-03`/`LC-1.1.2-04`) se mantienen en `incumple` severidad alta (ya lo estaban en la versión anterior), reforzando en el comentario que la ausencia es total y que el criterio 4 sí corresponde evaluarlo en esta URL por ser información de un trámite, no una excepción.
- El criterio 12 (`LC-1.1.4-01`, fecha) se mantiene en `incumple` pero sube de severidad media a alta, siguiendo `C-2026-08-25f`.
- Entrega reescrita en su totalidad con el encabezado canónico `Criterio N: «pregunta» — Instrumento M: Nombre` en `comentario`, y sin códigos `LC-*`, `Tnnn` ni referencias de orquestación en `ubicacion_pantalla`, `original`, `propuesto` ni `motivo` de `sustituciones[]` (`C-2026-08-25b`/`d`).
- Recuento (`summarizeEvaluations`: numerador = cumple + agrupados): 16 `no_aplica`, 35 aplicables, 25 aprobados (23 cumple + 2 agrupados) → 71,4 % → `rechazado` (antes 73,5 %, también `rechazado`).
- JSON nuevo en `data/claude-audits/sitioweb/2026-08-25/www-inapi-cl-marcas-tramites-solicitud-nueva_2026-08-25.json`; validado con `bun run validate:claude-audits` (OK, sin errores).
- Cableado: `frontend/src/lib/claude-audits-launch.ts` (piloto #6) — `claudeAuditId` actualizado a la auditoría del 2026-08-25, `resumenMvp` recalculado y el id del 2026-08-22 movido a `history[]` (junto con 2026-08-20, 2026-08-18 y 2026-06-07, que ya estaban ahí). `src/lib/mei-export/mei-meta-mei-urls.ts` (orden 6) — `auditId` actualizado al id vigente.
- Las entradas de calibración `C-2026-08-25d`, `C-2026-08-25e`, `C-2026-08-25f` y `C-2026-08-25g` ya existían en `06-calibracion-hallazgos.md` (creadas en una sesión previa de esta misma rama); no fue necesario crearlas de nuevo, solo aplicarlas.

### Próximos pasos:

- Ninguno pendiente para esta URL; queda cerrada en la serie META MEI orden 6.

---

<a id="devlog-2026-08-25-buscador-noticias-reaudit-criterio-45-rotulos"></a>
## [2026-08-25] - Infraestructura | Buscador de noticias www.inapi.cl: reauditoría criterio 45 (rótulos/CTA), rechazado 71,0 % — cierre serie

**Rama:** `feat/resultado-criterios-excel-alineado`

### Contexto y objetivos:

Quinta y última URL de la ronda de reauditorías por rótulos/CTA de esta sesión (tras Portada, Marcas, Patentes y Acerca de INAPI). Segunda pasada sobre la reauditoría del Buscador de noticias del día (id `www-inapi-cl-buscador-noticias_2026-08-25`, se sustituye el mismo id, no se crea un id nuevo ni se mueve a `history[]`): corregir específicamente el criterio 45 (`LC-5.2.4-01`, rótulos y llamados a la acción descriptivos), que había quedado en `no_aplica` con la justificación «esta URL es sitio informativo, no un servicio digital ni un trámite; esta variante del criterio no corresponde aquí». Esa justificación es inválida bajo la calibración `C-2026-08-25c` (el criterio aplica en sitioweb y en trámites, `applicability: "ambos"`) — mismo patrón ya corregido en las otras cuatro URLs de esta serie.

### Implementación técnica:

- Nueva captura Playwright de `https://www.inapi.cl/buscador?indexCatalogue=inapi&searchQuery=noticias&wordsMode=0`, con la ventana emergente de búsqueda del sitio, el recuadro de acceso/registro y la ventana de contacto abiertas para inventariar todos los rótulos y CTA; HTML sobrescrito en `auditorias/htmls/www-inapi-cl-buscador-noticias_2026-08-25.html`.
- Inventario de enlaces con `href`: se confirmaron los mismos dos rótulos genéricos ya vistos en las otras URLs de esta serie, ambos de componentes compartidos con el resto del sitio: el enlace «Conoce más» del menú de navegación global (lleva a `/propiedad-intelectual-e-industrial`) y el botón «LINK EXTERNO» del recuadro de acceso/registro (`href="#"`, sin destino real configurado, confirmado en el DOM actual). El resto de los enlaces y botones propios de esta pantalla sí describen su acción o destino: los cinco títulos de resultado de la lista de búsqueda y los enlaces de la ventana de búsqueda del sitio («Buscar en base de datos», «Solicitud y pago en línea», «Renovación en línea», «Presentación de escritos», «Clasificador de productos y servicios»).
- El criterio 45 pasa de `no_aplica` a `incumple`, severidad media, con dos filas nuevas en `sustituciones[]` (una por nodo, regla de multi-corrección `C-2026-08-22`); la fila del menú de navegación queda `patron_sistema: true` y la del botón «LINK EXTERNO» queda relacionada con el criterio 43 (mayúsculas sostenidas), que ya lo señalaba por otro motivo.
- Resto de los 51 criterios reevaluados contra el DOM actual: sin cambios respecto a la revisión previa del mismo día (título principal genérico «Buscador» sin el término buscado ni conteo de resultados, extracto de cada resultado con `display: none` confirmado por script, dos de los cinco resultados poco relevantes, sigla PCT sin definir en el menú, error tipográfico en el nombre institucional del pie, voz pasiva en la ventana de contacto, mayúsculas sostenidas en la ventana de búsqueda del sitio).
- Recuento: `criterios_no_aplica` 21→20, `criterios_aplicables` 30→31, `criterios_aprobados` se mantiene en 22 → 71,0 % (antes 73,3 %); sigue `rechazado`.
- JSON sobrescrito en `data/claude-audits/sitioweb/2026-08-25/www-inapi-cl-buscador-noticias_2026-08-25.json`; validado con `bun run validate:claude-audits` (OK, sin errores).
- Cableado: `frontend/src/lib/claude-audits-launch.ts` (piloto #5) tenía el porcentaje cacheado en `resumenMvp.porcentajeLc`; se actualizó de 73.3 a 71.0. `src/lib/mei-export/mei-meta-mei-urls.ts` (orden 5) ya apuntaba al id vigente, sin cambios.

### Próximos pasos:

- Ninguno pendiente para esta URL. Con esta pasada se cierra la ronda de reauditorías por rótulos/CTA de las cinco URLs META MEI de esta sesión.

---

<a id="devlog-2026-08-25-acerca-de-inapi-reaudit-criterio-45-rotulos"></a>
## [2026-08-25] - Infraestructura | Acerca de INAPI www.inapi.cl: reauditoría criterio 45 (rótulos/CTA) + encabezado canónico, rechazado 66,7 %

**Rama:** `feat/resultado-criterios-excel-alineado`

### Contexto y objetivos:

Segunda pasada sobre la reauditoría de «Acerca de INAPI» del día (id `www-inapi-cl-acerca-de-inapi_2026-08-25`, se sustituye el mismo id, no se crea un id nuevo ni se mueve a `history[]`): corregir específicamente el criterio 45 (`LC-5.2.4-01`, rótulos y llamados a la acción descriptivos), que había quedado en `no_aplica` con la justificación «página sitioweb institucional, no un servicio digital ni un trámite». Esa justificación quedó prohibida por la calibración `C-2026-08-25c` (el criterio aplica en sitioweb y en trámites, `applicability: "ambos"`). Además, la versión anterior de esta URL todavía no tenía aplicado el encabezado canónico de entrega («Criterio N: «pregunta» — Instrumento M: Nombre») exigido por `C-2026-08-25b`; se aprovechó esta pasada para reescribir los 51 comentarios con ese formato y sin códigos `LC-*` en los campos de entrega.

### Implementación técnica:

- Nueva captura Playwright de `https://www.inapi.cl/acerca-de/inapi` (HTML renderizado + inventario completo de enlaces con `href`); el contenido coincide con el HTML ya versionado en `auditorias/htmls/www-inapi-cl-acerca-de-inapi_2026-08-25.html` de la pasada anterior de esta misma sesión, así que no requirió sobrescritura.
- Inventario de los 75 enlaces y 2 botones de la página: se confirmaron los mismos dos rótulos genéricos compartidos con Portada/Marcas/Patentes que no describen su destino: el enlace «Conoce más» del menú de navegación global (lleva a `/propiedad-intelectual-e-industrial`) y el botón «LINK EXTERNO» del panel de acceso y registro (`href="#"`, sin destino real configurado). El resto de enlaces propios de la página (submenú de la sección, panel de búsqueda «Buscar y tramitar», pie de página) ya son descriptivos.
- El criterio 45 pasa de `no_aplica` a `incumple`, severidad media, con dos filas nuevas en `sustituciones[]` (una por nodo, regla de multi-corrección `C-2026-08-22`); la del menú de navegación queda `patron_sistema: true`. La fila del botón «LINK EXTERNO» queda relacionada con el criterio 43 (mayúsculas sostenidas), que ya lo señalaba por otro motivo.
- Se reescribieron los `comentario` de los 51 criterios con el encabezado canónico `Criterio N: «pregunta» — Instrumento M: Nombre`, y se reescribieron `resumen_ejecutivo`, `observaciones_lc_por_severidad` y `nota_final_tic` en lenguaje CMS, referenciando criterios por número (1…51) en vez de códigos `LC-*`.
- Resto del contenido reevaluado contra el DOM actual: equivalente a la revisión previa del mismo día (mismo error de concordancia en «Valores Institucionales», mismas oraciones largas en Visión/Misión, mismos documentos del pie sin formato/peso/descripción, misma alineación justificada).
- Recuento (fórmula `summarizeEvaluations`: numerador = cumple + agrupados): `criterios_no_aplica` 10→9, `criterios_aplicables` 41→42, `criterios_aprobados` se mantiene en 28 → 66,7 % (antes 68,3 %); sigue `rechazado`.
- JSON sobrescrito en `data/claude-audits/sitioweb/2026-08-25/www-inapi-cl-acerca-de-inapi_2026-08-25.json`; validado con `bun run validate:claude-audits` (OK, sin errores).
- Cableado: `frontend/src/lib/claude-audits-launch.ts` (piloto #4) tenía el porcentaje cacheado en `resumenMvp.porcentajeLc`; se actualizó de 68.3 a 66.7. `src/lib/mei-export/mei-meta-mei-urls.ts` (orden 4) ya apuntaba al id vigente, sin cambios.

### Próximos pasos:

- Ninguno pendiente para esta URL; el resto de URLs META MEI de esta sesión (Patentes, Portada, Buscador de noticias) ya se revisaron en pasadas equivalentes.

---

<a id="devlog-2026-08-25-patentes-reaudit-criterio-45-rotulos"></a>
## [2026-08-25] - Infraestructura | Patentes www.inapi.cl: reauditoría criterio 45 (rótulos/CTA) + encabezado canónico, rechazado 69,8 %

**Rama:** `feat/resultado-criterios-excel-alineado`

### Contexto y objetivos:

Segunda pasada sobre la reauditoría de Patentes del día (id `www-inapi-cl-patentes_2026-08-25`, se sustituye el mismo id, no se crea un id nuevo ni se mueve a `history[]`): corregir específicamente el criterio 45 (`LC-5.2.4-01`, rótulos y llamados a la acción descriptivos), que había quedado en `no_aplica` con la justificación «esta URL es informativa, no un servicio digital ni un trámite; la variante de rótulos descriptivos para servicios digitales no corresponde aquí». Esa justificación es inválida bajo la calibración `C-2026-08-25c` (el criterio aplica en sitioweb y en trámites, `applicability: "ambos"`) — es el mismo patrón ya corregido en Portada y Marcas esta misma sesión. Se aprovechó la pasada para reevaluar todo el DOM actual y reescribir la entrega completa con el encabezado canónico de `C-2026-08-25b`.

### Implementación técnica:

- Nueva captura Playwright de `https://www.inapi.cl/patentes` (HTML renderizado + inventario completo de enlaces/botones con `href`), sobrescribiendo `auditorias/htmls/www-inapi-cl-patentes_2026-08-25.html`. Contenido, estructura y pesos de los 11 documentos PDF (verificados de nuevo por tamaño real del archivo) resultaron equivalentes a la captura anterior del mismo día.
- Inventario de todos los textos de enlace/botón de la página: se detectaron dos rótulos genéricos que no describen su destino: el enlace «Conoce más» del menú de navegación global (componente compartido, lleva a `/propiedad-intelectual-e-industrial`) y el botón «LINK EXTERNO» del panel de acceso y registro (`href="#"`, sin destino real configurado). El resto de enlaces propios de la página (buscadores, trámites, guías, documentos) ya son descriptivos («Buscar en base de datos», «Notificaciones diarias», «Solicitud y pago en línea», «Presentación de escritos»).
- El criterio 45 pasa de `no_aplica` a `incumple`, severidad media, con dos filas nuevas en `sustituciones[]` (una por nodo, regla de multi-corrección `C-2026-08-22`); ambas quedan `patron_sistema: true` por ser componentes compartidos del sitio. La fila del botón «LINK EXTERNO» queda relacionada con el criterio 43 (mayúsculas sostenidas), que ya lo señalaba por otro motivo.
- De paso se corrigió un vacío detectado en la versión anterior: el criterio 6 (Legible, sin medición documentada) no tenía fila de cobertura en `sustituciones[]` pese a estar `incumple`; se agregó una fila con instrucción de reescritura y de verificación con herramienta de lectura fácil.
- Se reescribieron los `comentario` de los 51 criterios con el encabezado canónico `Criterio N: «pregunta» — Instrumento M: Nombre`, y se reescribieron `resumen_ejecutivo`, `observaciones_lc_por_severidad` y `nota_final_tic` en lenguaje CMS, referenciando criterios por número (1…51) en vez de códigos `LC-*`; se verificó por script que ningún campo de entrega humana contiene `LC-*`, `Tnnn`, `§N`, `C-YYYY-…` u otra nomenclatura interna.
- Recuento (fórmula `summarizeEvaluations`: numerador = cumple + agrupados): `criterios_no_aplica` 9→8, `criterios_aplicables` 42→43, `criterios_aprobados` se mantiene en 30 → 69,8 % (antes 71,4 %); sigue `rechazado`.
- JSON sobrescrito en `data/claude-audits/sitioweb/2026-08-25/www-inapi-cl-patentes_2026-08-25.json`; validado con `bun run validate:claude-audits` (OK, sin errores).
- Cableado: `frontend/src/lib/claude-audits-launch.ts` (piloto Patentes) tenía el porcentaje cacheado en `resumenMvp.porcentajeLc`; se actualizó de 71.4 a 69.8. `src/lib/mei-export/mei-meta-mei-urls.ts` (orden 3) ya apuntaba al id vigente, sin cambios.

### Próximos pasos:

- Ninguno pendiente para esta URL; queda cerrada en la serie META MEI orden 3.

---

<a id="devlog-2026-08-25-marcas-reaudit-criterio-45-rotulos"></a>
## [2026-08-25] - Infraestructura | Marcas www.inapi.cl: reauditoría criterio 45 (rótulos/CTA) + encabezado canónico, rechazado 71,4 %

**Rama:** `feat/resultado-criterios-excel-alineado`

### Contexto y objetivos:

Segunda pasada sobre la reauditoría de Marcas del día (id `www-inapi-cl-marcas_2026-08-25`, se sustituye el mismo id, no se crea un id nuevo ni se mueve a `history[]`): corregir específicamente el criterio 45 (`LC-5.2.4-01`, rótulos y llamados a la acción descriptivos), que había quedado en `no_aplica` con la justificación «página informativa, no un servicio digital ni un trámite». Esa justificación quedó prohibida por la calibración `C-2026-08-25c` (el criterio aplica en sitioweb y en trámites, `applicability: "ambos"`). Además, la versión anterior de esta URL todavía no tenía aplicado el encabezado canónico de entrega («Criterio N: «pregunta» — Instrumento M: Nombre») exigido por `C-2026-08-25b`; se aprovechó esta pasada para reescribir los 51 comentarios con ese formato y sin códigos `LC-*` en los campos de entrega.

### Implementación técnica:

- Nueva captura Playwright de `https://www.inapi.cl/marcas` (HTML renderizado + inventario completo de enlaces con `href`), sobrescribiendo `auditorias/htmls/www-inapi-cl-marcas_2026-08-25.html`.
- Inventario de todos los textos de enlace de la página: se detectaron dos rótulos genéricos que no describen su destino: el enlace «Conoce más» del menú de navegación global (componente compartido, lleva a `/propiedad-intelectual-e-industrial`) y el botón «LINK EXTERNO» del panel de acceso y registro (`href="#"`, sin destino real configurado). El resto de enlaces propios de la página (buscadores, trámites, documentos) ya son descriptivos.
- El criterio 45 pasa de `no_aplica` a `incumple`, severidad media, con dos filas nuevas en `sustituciones[]` (una por nodo, regla de multi-corrección `C-2026-08-22`); la del menú de navegación queda `patron_sistema: true`. La fila del botón «LINK EXTERNO» queda relacionada con el criterio 43 (mayúsculas sostenidas), que ya lo señalaba por otro motivo.
- Se reescribieron los `comentario` de los 51 criterios con el encabezado canónico `Criterio N: «pregunta» — Instrumento M: Nombre`, y se reescribieron `resumen_ejecutivo`, `observaciones_lc_por_severidad` y `nota_final_tic` en lenguaje CMS, referenciando criterios por número (1…51) en vez de códigos `LC-*`.
- Contenido reevaluado contra el DOM actual: equivalente a la revisión previa del mismo día (misma jerga sin definir en «Trámites», mismos títulos genéricos «Para Informarse»/«Buscadores», mismos documentos del pie sin formato/peso/descripción).
- Recuento (fórmula `summarizeEvaluations`: numerador = cumple + agrupados): `criterios_no_aplica` 10→9, `criterios_aplicables` 41→42, `criterios_aprobados` se mantiene en 30 → 71,4 % (antes 73,2 %); sigue `rechazado`.
- JSON sobrescrito en `data/claude-audits/sitioweb/2026-08-25/www-inapi-cl-marcas_2026-08-25.json`; validado con `bun run validate:claude-audits` (OK, sin errores).
- Cableado: `frontend/src/lib/claude-audits-launch.ts` (piloto #3) tenía el porcentaje cacheado en `resumenMvp.porcentajeLc`; se actualizó de 73.2 a 71.4. `src/lib/mei-export/mei-meta-mei-urls.ts` (orden 2) ya apuntaba al id vigente, sin cambios.

### Próximos pasos:

- Revisar si Acerca de INAPI y el buscador de noticias (ya reauditados bajo `C-2026-08-25b`/`c` en esta sesión) necesitan la misma pasada de encabezado canónico o si ya la tienen aplicada.

---

<a id="devlog-2026-08-25-portada-reaudit-criterio-45-rotulos"></a>
## [2026-08-25] - Infraestructura | Portada www.inapi.cl: reauditoría criterio 45 (rótulos/CTA), rechazado 76,9 %

**Rama:** `feat/resultado-criterios-excel-alineado`

### Contexto y objetivos:

Segunda pasada sobre la misma reauditoría de Portada del día (id `www-inapi-cl_2026-08-25`, se sustituye el mismo id, no se crea un id nuevo ni se mueve a `history[]`): corregir específicamente el criterio 45 (`LC-5.2.4-01`, rótulos y llamados a la acción descriptivos), que había quedado en `no_aplica` con la justificación «página informativa, no un servicio digital». Esa justificación quedó prohibida por la nueva entrada de calibración `C-2026-08-25c` en `06-calibracion-hallazgos.md` (y su reflejo en `CLAUDE.md` §2.2/§16/§23.1.1/§23.5): el criterio de rótulos/CTA aplica en sitioweb y en trámites, con `applicability: "ambos"` en el catálogo.

### Implementación técnica:

- Nueva captura Playwright de `https://www.inapi.cl/` (HTML renderizado, snapshot de accesibilidad y apertura de la ventana emergente de contacto), sobrescribiendo `auditorias/htmls/www-inapi-cl_2026-08-25.html`.
- Inventario de todos los textos de enlaces y botones de la página vía `document.querySelectorAll('a, button')`: se detectaron dos botones «Acceder» con destinos distintos (banner «Plataforma de Datos» → `dps.inapi.cl`; banner «Cuenta Pública 2026» → `/cuenta-publica-2026`) y dos enlaces «Conoce más» con destinos distintos (menú de navegación → `/propiedad-intelectual-e-industrial`; sección «Observancia» → `/protege-tu-idea/pirateria-y-falsificacion`). El resto de enlaces y botones de la portada (buscadores, guías, accesos rápidos, pie de página) ya son descriptivos.
- El criterio 45 pasa de `no_aplica` a `incumple`, severidad media, con cuatro filas nuevas en `sustituciones[]` (una por rótulo/nodo, según la regla de multi-corrección `C-2026-08-22`); la del menú de navegación queda marcada `patron_sistema: true` por ser componente compartido.
- Se reevaluaron los 51 criterios contra el DOM actual; el contenido y los pesos de documentos (reverificados vía cabecera HTTP `Content-Length`) son equivalentes a la revisión previa del mismo día, por lo que el resto de los criterios no cambió.
- Recuento: `criterios_no_aplica` 13→12, `criterios_aplicables` 38→39, `criterios_aprobados` se mantiene en 30 → 76,9 % (antes 78,9 %); sigue `rechazado`.
- JSON sobrescrito en `data/claude-audits/sitioweb/2026-08-25/www-inapi-cl_2026-08-25.json`; validado con `bun run validate:claude-audits`.
- Cableado: `frontend/src/lib/claude-audits-launch.ts` (piloto #1) tenía el porcentaje cacheado en `resumenMvp.porcentajeLc`; se actualizó de 78.9 a 76.9. `src/lib/mei-export/mei-meta-mei-urls.ts` (orden 1) ya apuntaba al id vigente, sin cambios.

### Próximos pasos:

- Revisar si otras URLs ya reauditadas bajo `C-2026-08-25c` (Patentes, Marcas, etc.) tienen el mismo patrón de `no_aplica` indebido en el criterio 45 y corregirlas.

---

<a id="devlog-2026-08-25-buscador-noticias-reaudit-v30-sin-nomenclatura"></a>
## [2026-08-25] - Infraestructura | Buscador de noticias www.inapi.cl: reauditoría v3.0 (51 LC-*) sin nomenclatura interna, rechazado 73,3 %

**Rama:** `feat/resultado-criterios-excel-alineado`

### Contexto y objetivos:

Reauditar la página de resultados del buscador del sitio (`https://www.inapi.cl/buscador?indexCatalogue=inapi&searchQuery=noticias&wordsMode=0`, META MEI orden 5, «Página de información interior 2/2») con la misma calibración estricta aplicada a Portada, Marcas, Patentes y Acerca de INAPI en esta sesión: la entrega debe quedar completamente libre de nomenclatura interna, incluidos los códigos `LC-*` e IEW/IESD, siguiendo `C-2026-08-25b`.

### Implementación técnica:

- Captura Playwright (HTML renderizado + snapshot de accesibilidad) sobre la URL con la consulta «noticias» ya cargada; se abrió la ventana emergente de contacto y se verificó con `page.evaluate` que el párrafo de extracto que trae cada uno de los cinco resultados tiene hoy `display: none` y mide 0 píxeles de alto y ancho, confirmando que sigue sin ser visible para la persona usuaria (mismo hallazgo de fondo que el 2026-08-22, con la causa técnica exacta reverificada).
- 51 criterios evaluados: 22 cumple, 8 incumple (título genérico del buscador, falta de mensaje de cantidad de resultados y de campo de búsqueda visible, ausencia de fecha, dos resultados poco relevantes, mayúsculas sostenidas en dos componentes compartidos, sigla PCT sin definir, error de mayúscula institucional y voz pasiva en la ventana de contacto), 21 no aplica (página de resultados automáticos sin cuerpo editorial propio, sin documentos descargables y sin datos que requieran apoyos visuales) → 30 aplicables, 73,3 % de cumplimiento → `rechazado` (mismo porcentaje que el 2026-08-22; el contenido y la estructura de la página no cambiaron).
- Entrega redactada ya bajo `C-2026-08-25b`: cada criterio abre con «Criterio N: «pregunta» — Instrumento M: Nombre» (numeración 1…51, sin códigos `LC-*` ni `1.1.x/5.1.x`); las dos filas de mayúsculas sostenidas (ventana de búsqueda del sitio y botón «LINK EXTERNO» del recuadro de acceso) y las dos filas de resultados poco relevantes (dirección duplicada del inicio y plantilla vacía) quedaron como filas de sustitución independientes bajo el mismo criterio.
- JSON guardado en `data/claude-audits/sitioweb/2026-08-25/www-inapi-cl-buscador-noticias_2026-08-25.json`; validado con `bun run validate:claude-audits`.
- Cableado: `frontend/src/lib/claude-audits-launch.ts` (piloto #5) y `src/lib/mei-export/mei-meta-mei-urls.ts` (orden 5) apuntan al nuevo id; `www-inapi-cl-buscador-noticias_2026-08-22` queda en `history[]`.

---

<a id="devlog-2026-08-25-portada-reaudit-v30-sin-nomenclatura"></a>
## [2026-08-25] - Infraestructura | Portada www.inapi.cl: reauditoría v3.0 (51 LC-*) sin nomenclatura interna, rechazado 78,9 %

**Rama:** `feat/resultado-criterios-excel-alineado`

### Contexto y objetivos:

Reauditar la Portada (`https://www.inapi.cl/`, META MEI orden 1) aplicando una calibración más estricta que las tres reauditorías previas de esta misma sesión (Marcas, Patentes, Acerca de INAPI): la entrega debe quedar completamente libre de nomenclatura interna, incluidos los propios códigos `LC-*` e IEW/IESD (`1.1.3`, `5.1.3`, etc.) en los campos de texto, ubicación, propuesta y justificación. Se agregó la entrada de calibración `C-2026-08-25b` en `06-calibracion-hallazgos.md` (y su reflejo en `CLAUDE.md` §22.1/§22.12 y en la skill `02`) con esta regla.

### Implementación técnica:

- Captura Playwright (HTML renderizado + snapshot de accesibilidad) sobre `https://www.inapi.cl/`, con apertura y verificación de la ventana emergente de contacto; se confirmó que el contenido (menú, título principal, tarjetas de Patentes/Marcas, tres noticias, banners y pie de página) es equivalente al capturado el 2026-08-22.
- Reverificación de pesos reales vía cabecera HTTP `Content-Length`: guía de marcas 17.156.031 bytes (≈16,4 MB), guía de patentes 13.133.207 bytes (≈12,5 MB), Plan de Acción de Cumplimiento 2025 (293 KB), Teletrabajo (3,3 MB) y Código de Ética INAPI 2026 (590 KB) — sin cambios respecto de la revisión anterior.
- 51 criterios evaluados: 27 cumple, 11 incumple (3 agrupados: el criterio de palabras claras y el de títulos claros se agrupan bajo los criterios de oraciones simples y de ausencia de jerga, respectivamente), 13 no aplica → 38 aplicables, 78,9 % de cumplimiento → `rechazado` (mismo resultado numérico que el 2026-08-22; el contenido de la página no cambió).
- Entrega reescrita bajo la calibración `C-2026-08-25b`: cada criterio comienza con el encabezado «Criterio N: «pregunta» — Instrumento M: Nombre» (numeración simple 1…51, sin códigos `LC-*` ni `1.1.x/5.1.x`); las referencias cruzadas usan «el criterio N»; ninguna corrección propuesta queda como «Corregir incumplimiento de…» sin texto o instrucción accionable. Las tres frases en mayúscula sostenida (buscadores de patentes/marcas, banner de datos, ventana de búsqueda) quedaron en tres filas de sustitución independientes.
- JSON guardado en `data/claude-audits/sitioweb/2026-08-25/www-inapi-cl_2026-08-25.json`; validado con `bun run validate:claude-audits`.
- Cableado: `frontend/src/lib/claude-audits-launch.ts` (piloto #1) y `src/lib/mei-export/mei-meta-mei-urls.ts` (orden 1) apuntan al nuevo id; `www-inapi-cl_2026-08-22` y `www-inapi-cl_2026-08-21` quedan en `history[]`.

### Próximos pasos:

- Reauditar Buscador de noticias y las siguientes URLs de la cola META MEI con la misma disciplina de entrega cero-nomenclatura (`C-2026-08-25b`).

---

<a id="devlog-2026-08-25-acerca-de-inapi-reaudit-v30"></a>
## [2026-08-25] - Infraestructura | Acerca de INAPI www.inapi.cl: reauditoría v3.0 (51 LC-*), rechazado 68,3 %

**Rama:** `feat/resultado-criterios-excel-alineado`

### Contexto y objetivos:

Reauditar la página «Acerca de INAPI» (`https://www.inapi.cl/acerca-de/inapi`, META MEI orden 4, Página de información interior 1/2) aplicando el mismo estándar de entrega ya corregido en Marcas y Patentes el mismo día: campos de evidencia y sustituciones en lenguaje humano puro, sin ids de inventario ni referencias de proceso interno, y sin repetir el mismo bloque largo de reescritura en varias filas cuando distintos criterios comparten exactamente el mismo texto.

### Implementación técnica:

- Captura Playwright (HTML renderizado) sobre `https://www.inapi.cl/acerca-de/inapi`, con verificación de la ventana de contacto, el panel de acceso/registro y la ventana de búsqueda «Buscar y tramitar»; el DOM coincide con la captura del 2026-08-22, incluido el error de concordancia («los asume» en vez de «los asumen») en «Valores Institucionales».
- Verificación hoy vía `getComputedStyle` de que los párrafos del cuerpo, Visión, Misión y la lista de Valores siguen con alineación justificada, y de los pesos reales de los tres documentos del carrusel institucional del pie vía cabecera HTTP `Content-Length` (293 KB, 3,3 MB, 590 KB): sin cambios.
- Revisión completa del lenguaje de menor a mayor unidad (palabra, frase, oración, párrafo, forma) antes de calificar los 51 criterios; se mantienen los hallazgos de jerga institucional sin definir («acervo tecnológico»; «gestión por objetivos, medición de productos y orientación hacia la calidad») y de oraciones de 44 a 56 palabras en el segundo párrafo, Visión y Misión.
- Corrección de agrupación (§20.3): la Visión institucional es el mismo texto para tres preguntas distintas (claridad, oraciones simples, objetividad); en la revisión anterior cada una se contaba como incumplimiento independiente con el mismo bloque de reescritura repetido tres veces. Ahora el criterio de oraciones simples (`LC-1.2.2-04`) es el primario con la reescritura completa, y claridad (`LC-1.2.1-02`) y objetividad (`LC-1.3.2-01`, con `LC-1.3.2-02` ya agrupado bajo ese) quedan agrupados bajo ese mismo primario, con justificación propia sin duplicar el texto.
- 51 criterios evaluados: 23 cumple, 13 incumple, 5 agrupados (`LC-1.2.2-03`, `LC-1.2.1-02`, `LC-1.3.2-01` → `LC-1.2.2-04`; `LC-1.3.2-02` → `LC-1.3.2-01`; `LC-1.2.4-08` → `LC-1.2.4-07`), 10 no aplica → 41 aplicables, 68,3 % de cumplimiento → `rechazado` (el porcentaje sube desde el 63,4 % del 2026-08-22 por la corrección de agrupación, no porque el contenido de la página haya mejorado).
- Entrega redactada solo con literales visibles y rutas de pantalla (`Bloque «Visión»`, `Sección «Valores Institucionales», ítem «…»`); los tres documentos del carrusel institucional tienen cada uno su propia fila de sustitución con formato/peso/descripción.
- JSON guardado en `data/claude-audits/sitioweb/2026-08-25/www-inapi-cl-acerca-de-inapi_2026-08-25.json`; validado con `bun run validate:claude-audits` y `bun run typecheck:all`.
- Cableado: `frontend/src/lib/claude-audits-launch.ts` (piloto #4) y `src/lib/mei-export/mei-meta-mei-urls.ts` (orden 4) apuntan al nuevo id; `www-inapi-cl-acerca-de-inapi_2026-08-22` pasa a `history[]`.

### Próximos pasos:

- Continuar la cola META MEI (orden 5 en adelante) con la misma disciplina de entrega CMS y de agrupación §20.3 cuando el mismo texto responde varias preguntas del instrumento.

---

<a id="devlog-2026-08-25-patentes-reaudit-v30"></a>
## [2026-08-25] - Infraestructura | Patentes www.inapi.cl: reauditoría v3.0 (51 LC-*), rechazado 71,4 %

**Rama:** `feat/resultado-criterios-excel-alineado`

### Contexto y objetivos:

Reauditar la página Patentes (`https://www.inapi.cl/patentes`, META MEI orden 3, Menú principal 2/2) aplicando el mismo estándar de entrega ya corregido en Marcas el mismo día: campos de evidencia y sustituciones en lenguaje humano puro, sin ids de inventario ni referencias de proceso interno, con una fila de sustitución por cada documento o texto localizable distinto.

### Implementación técnica:

- Captura Playwright (HTML renderizado + snapshot de accesibilidad) sobre `https://www.inapi.cl/patentes`, con apertura y verificación de la ventana de contacto, la ventana de búsqueda «Buscar y tramitar» y el panel de acceso/registro; el DOM coincide con la captura del 2026-08-22.
- Reverificación de pesos reales vía cabecera HTTP `Content-Length` de los 11 documentos PDF de la página (8 guías PPH/Global PPH/PAPV + 3 documentos institucionales del pie): sin cambios.
- Revisión completa del lenguaje de menor a mayor unidad (palabra, frase, oración, párrafo, forma) antes de calificar los 51 criterios; se mantienen los hallazgos de jerga sin definir (novedad, elemento inventivo, aplicación industrial, tasas, Modelos de Utilidad, Esquemas de Trazados o Topografías de Circuitos Integrados, Recursos para Usuarios) y de siglas sin expandir (PCT, PPH, PAPV).
- 51 criterios evaluados: 28 cumple, 12 incumple, 2 agrupados (`LC-1.2.1-04` → `LC-1.1.3-03`; `LC-1.2.4-08` → `LC-1.2.4-07`), 9 no aplica → 42 aplicables, 71,4 % de cumplimiento → `rechazado` (igual que el 2026-08-22, porque el contenido de la página no cambió).
- Entrega redactada solo con literales visibles y rutas de pantalla (`Sección «…», tarjeta «…»`); los 8 documentos de las pestañas de guías y los 3 del pie de página tienen cada uno su propia fila de sustitución con formato/peso/descripción, en vez de una fila combinada.
- JSON guardado en `data/claude-audits/sitioweb/2026-08-25/www-inapi-cl-patentes_2026-08-25.json`; validado con `bun run validate:claude-audits`.
- Cableado: `frontend/src/lib/claude-audits-launch.ts` (META MEI extra) y `src/lib/mei-export/mei-meta-mei-urls.ts` (orden 3) apuntan al nuevo id; `www-inapi-cl-patentes_2026-08-22` pasa a `history[]`.

### Próximos pasos:

- Continuar la cola META MEI (orden 4 en adelante) con la misma disciplina de entrega CMS sin nomenclatura interna.

---

<a id="devlog-2026-08-25-marcas-reaudit-v30"></a>
## [2026-08-25] - Infraestructura | Marcas www.inapi.cl: reauditoría v3.0 (51 LC-*), rechazado 73,2 %

**Rama:** `feat/resultado-criterios-excel-alineado`

### Contexto y objetivos:

Reauditar de nuevo la página Marcas (`https://www.inapi.cl/marcas`, META MEI orden 2) para corregir la forma de entrega detectada en la revisión manual del 2026-08-22: ubicaciones y justificaciones con nomenclatura interna (ids de inventario, referencias de proceso) y una fila de sustitución que resumía tres documentos distintos en un solo texto. La página en sí no cambió de contenido.

### Implementación técnica:

- Captura Playwright (HTML renderizado + snapshot de accesibilidad) sobre `https://www.inapi.cl/marcas`, con apertura y verificación del modal de contacto, el panel de acceso/registro y el modal de búsqueda «Buscar y tramitar»; el DOM coincide con la captura del 2026-08-22.
- Reverificación de pesos reales vía cabecera HTTP `Content-Length` de los tres documentos institucionales del pie: sin cambios (293 KB, 3,3 MB, 590 KB).
- Revisión completa del lenguaje de menor a mayor unidad (palabra, frase, oración, párrafo, forma) antes de calificar los 51 criterios; se mantienen los hallazgos de jerga técnico-jurídica sin definir y de títulos que no anticipan contenido.
- 51 criterios evaluados: 27 cumple, 11 incumple (3 agrupados: `LC-1.2.2-04` y `LC-1.2.3-03` → `LC-1.1.3-03`; `LC-1.2.4-08` → `LC-1.2.4-07`), 10 no aplica → 41 aplicables, 73,2 % de cumplimiento → `rechazado` (igual que el 2026-08-22, porque el contenido de la página no cambió).
- Entrega reescrita: se eliminaron referencias a ids de inventario, nombres de proceso interno y meta-comentarios entre paréntesis en `ubicacion_pantalla`, `propuesto`, `motivo` y `comentario`; los tres documentos del pie sin formato/peso/descripción pasaron de una fila combinada a tres filas independientes (una por documento); la sección «Trámites» ahora propone una frase por trámite y un subtítulo de sección, no solo unificar mayúsculas.
- JSON guardado en `data/claude-audits/sitioweb/2026-08-25/www-inapi-cl-marcas_2026-08-25.json`; validado con `bun run validate:claude-audits`.
- Cableado: `frontend/src/lib/claude-audits-launch.ts` (piloto #3) y `src/lib/mei-export/mei-meta-mei-urls.ts` (orden 2) apuntan al nuevo id; `www-inapi-cl-marcas_2026-08-22` pasa a `history[]`.

### Próximos pasos:

- Aplicar la misma limpieza de entrega (sin ids internos, sin filas combinadas de varios documentos) al resto de URLs META MEI ya auditadas si una revisión manual lo confirma necesario.

---

<a id="devlog-2026-08-24-entrega-resultado-v30"></a>
## [2026-08-24] - Frontend | Entrega resultado v3.0: resumen por hito, filtros y PDF alineados

**Rama:** `feat/resultado-criterios-excel-alineado`

### Contexto y objetivos:

Alinear la pantalla `/auditar/resultado` y el PDF de auditoría al checklist PTD-LC v3.0 (51 criterios, 12 hitos CL1 sin el meta 492) para Equipo UX / jefatura: datos de auditoría legibles, resumen por hito tipo planilla MEI, filtros útiles y nombres de descarga predecibles.

### Implementación técnica:

- Datos de Auditoría: etiqueta `Checklist 3.0: 51 Criterios - 12 Hitos`, porcentaje, No aplica, usuario Fernando Arriagada, fecha corta (home → 24 de agosto); sin Id auditoría ni campos Clarity en la entrega.
- Resumen por hito (UI colapsable + PDF): columnas Checklist, Cumple, Cumple con observaciones, Medianamente cumple, No cumple, No aplica, % Cumple; cabecera «Hito» + título sin prefijo.
- Filtros de criterios: por hito, tarea, criterio (`LC-*`), instrumento y estado MEI; tipografía/ubicación CMS en lenguaje claro (`lenguaje-tipografia-cms`, `ubicacion-pantalla-cms`).
- Anclaje PTD: Completitud → 498/497; sin 492/491 en entrega; tipografía y calibración C-2026-08-24 en prompts/skills.
- Descargas: `auditoria-{slug}-{dd-mm-yyyy}.pdf|.xlsx`; botones «Descargar PDF/Excel auditoría».

### Próximos pasos:

- Revisar con Equipo UX el resumen por hito frente al Word PTD.
- Regenerar Excel MEI institucional completo con las 10 URLs ya en v3.0 cuando se cierre la muestra oro.

---

<a id="devlog-2026-08-22-portada-reaudit-v30"></a>
## [2026-08-22] - Infraestructura | Portada www.inapi.cl: reauditoría v3.0 (51 LC-*), rechazado 78,9 %

**Rama:** `main`

### Contexto y objetivos:

Reauditar de nuevo la Portada / inicio INAPI (META MEI orden 1, muestra oro v3.0) para confirmar los hallazgos con evaluación independiente por 5 sub-subagentes (CLAUDE.md §17), verificar pesos reales de documentos y aplicar las calibraciones vigentes de LC-1.3.1-01 (apoyos visuales) y jerga legal en títulos de sección.

### Implementación técnica:

- Captura Playwright (HTML renderizado + snapshot de accesibilidad) sobre `https://www.inapi.cl/`; contenido de portada equivalente a la auditoría del 2026-08-21 (mismo menú, hero, tarjetas y noticias).
- Reverificación de pesos reales vía cabecera HTTP `Content-Length`: la guía de marcas cambió de tamaño respecto al 2026-08-21 (17.156.031 bytes ≈ 16,4 MB); los 3 documentos institucionales del pie y la guía de patentes se mantienen iguales.
- 5 sub-subagentes en paralelo (Fiabilidad/Completitud/Actualización/Objetividad/Archivo/Visualización · Lenguaje plano · Redacción/Claridad/Concisión · Legibilidad/Escritura web · PI/Privacidad/Sensibles), consolidados con gate §22.12.
- 51 criterios evaluados: 27 cumple, 11 incumple (3 agrupados: `LC-1.2.4-02`→`LC-1.1.3-03`, `LC-1.2.1-02`→`LC-1.2.2-04`, `LC-1.2.4-08`→`LC-1.2.4-07`), 13 no aplica → 38 aplicables, 78,9 % de cumplimiento → `rechazado` (sube desde 72,5 % del 2026-08-21, principalmente porque el H1 y `LC-1.1.2-03` se reevaluaron como `cumple`/`no_aplica` con evidencia propia). Hallazgos de severidad alta: documentos sin formato/peso/descripción (`LC-1.2.4-07`/`08`).
- JSON guardado en `data/claude-audits/sitioweb/2026-08-22/www-inapi-cl_2026-08-22.json`; validado con `bun run validate:claude-audits` y `bun run typecheck:all`.
- Cableado: `frontend/src/lib/claude-audits-launch.ts` (piloto #1) y `src/lib/mei-export/mei-meta-mei-urls.ts` (orden 1) apuntan al nuevo id; `www-inapi-cl_2026-08-21` pasa a `history[]`.

---

<a id="devlog-2026-08-21-titulos-jerga-ia"></a>
## [2026-08-21] - Orquestación | Títulos/jerga (Observancia) + texto con apoyos vs IA

### Contexto y objetivos:

Un subtítulo claro no salva un título de sección legal («Observancia»). Hay que auditar H2/menú/tooltips con lenguaje plano y títulos claros, y acotar arquitectura de información fina a Usabilidad.

### Implementación técnica:

- Calibración CLAUDE.md §2 + skill `auditoria-lc` (LC-1.1.3-03 / LC-1.2.4-02) + prompts oro / una-url.
- Portada: «Observancia» → `incumple` LC-1.1.3-03 (primario) + LC-1.2.4-02 agrupado; propuesta CMS sin HTML. % **72,5 %** rechazado.

### Próximos pasos:

- Misma regla en menú y URLs siguientes (Dominio Público, Sistema de Madrid, etc.).
- Commit con el lote de calibraciones cuando el usuario lo pida.

---

<a id="devlog-2026-08-21-lc-131-apoyos"></a>
## [2026-08-21] - Orquestación | Calibrar LC-1.3.1-01 = presencia de apoyos (no alt)

### Contexto y objetivos:

La Portada oro v3.0 marcó `LC-1.3.1-01` como incumple por `alt` vacío/genérico y sintaxis HTML (`img`, `href`), pese a que la pregunta del instrumento es si **hay** íconos/imágenes/gráficos para presentar datos. Eso confunde a editores CMS y desvirtúa el %.

### Implementación técnica:

- Calibración en `CLAUDE.md` §2 / §6 / §16 / §21 / §22.1; skill `auditoria-lc`; prompts `audit-una-url` / `audit-oro-s22`; mapa PTD; diagrama §6.
- Regla: hay banners/tarjetas/íconos → `cumple`; `alt`/WCAG → nota Usabilidad fuera del %; sin HTML como mensaje principal; no castigar por “ceguera” de Playwright.
- JSON Portada `www-inapi-cl_2026-08-21`: `LC-1.3.1-01` → `cumple`; se quitaron 4 sustituciones de alt; **75 %** rechazado (antes 72,5 %).

### Próximos pasos:

- Aplicar la misma calibración en las siguientes URLs META MEI v3.0.
- Commit cuando el usuario lo pida.

---

<a id="devlog-2026-08-21-portada-oro-v30"></a>
## [2026-08-21] - Infraestructura | Portada www.inapi.cl: reauditoría oro v3.0 (51 LC-*), rechazado 72,5 %

**Rama:** `main`

### Contexto y objetivos:

Reauditar la Portada / inicio INAPI (META MEI orden 1, misma URL de la serie Clarity rank 16) migrando del checklist histórico v2.1 (47 A–H) al catálogo vigente PTD-LC v3.0 (51 criterios `LC-*`), siguiendo el flujo canónico `audit-una-url.md` con arquitectura de 5 sub-subagentes (CLAUDE.md §17), calibración de alcance visible (§20) y entrega legible para CMS (§22.8–§22.12).

### Implementación técnica:

- Captura Playwright (HTML renderizado + snapshot de accesibilidad) sobre `https://www.inapi.cl/`; contenido de portada equivalente a la auditoría del 2026-08-20 (mismas tarjetas de Novedades y bloques secundarios).
- Verificación de pesos reales de los 5 documentos descargables vía cabecera HTTP `Content-Length` (guías de marcas/patentes y 3 documentos institucionales del pie), evitando inventar KB/MB (§22.11).
- Medición `getComputedStyle` de espaciado y alineación de párrafos para sustentar `LC-1.2.3-01`/`LC-1.2.3-02` con evidencia, no por omisión.
- 51 criterios evaluados: 28 cumple, 11 incumple (1 agrupado en `LC-1.2.4-07`), 11 no aplica → 40 aplicables, 72,5 % de cumplimiento → `rechazado`. Hallazgos de severidad alta: sigla PCT sin definir, sin fecha de actualización visible, documentos sin formato/peso/descripción, y apoyos visuales sin función informativa accesible (banners con `alt` ausente/vacío, enlace de pie sin nombre accesible, íconos de acceso/registro con `alt` duplicado).
- JSON guardado en `data/claude-audits/sitioweb/2026-08-21/www-inapi-cl_2026-08-21.json`; validado con `bun run validate:claude-audits` y `bun run typecheck:all`.
- Cableado: `frontend/src/lib/claude-audits-launch.ts` (piloto #1) y `src/lib/mei-export/mei-meta-mei-urls.ts` (orden 1) apuntan al nuevo id; `www-inapi-cl_2026-08-20` pasa a `history[]`.

### Próximos pasos:

- Continuar la reauditoría oro v3.0 con la siguiente URL del lote META MEI (orden 2, Marcas) sin abrir en paralelo, según política de tamaño de `.claude/CLAUDE.md` §14.

---

<a id="devlog-2026-08-21-claude-md-cms-estados"></a>
## [2026-08-21] - Documentación | CLAUDE.md: estados/severidad, lenguaje CMS, refs §N

**Rama:** `feat/orquestacion-s22-copy-accionable-cms`

### Contexto y objetivos:

Alinear orquestación y docs a nomenclatura solo `LC-*`, explicar presentación MEI (cumple con observaciones / medianamente cumple vía `severidad`), priorizar copy CMS frente a jerga TI, y hacer legibles las referencias §N para cualquier lector del repo.

### Implementación técnica:

- `CLAUDE.md` §5–§6, §10, §12, §14, §16–§22: estados + severidad, patrones sistémicos CMS, stack (Zod/Xenova/hooks), workflow con glosas §N, `no_aplica` v3.0, §19 anonimización reforzada, §20.3/§20.6/§21 sin A–H.
- Skills `auditoria-lc` y prompts `audit-una-url` / `audit-oro-s22` alineados.
- Checklist push: `lint` + `build`; env vars `LC_REPO_ROOT` / `CHROMA_PORT` explicadas; ventajas 1-URL reforzadas.
- RAG: Colección B ya incluye catálogo 51 + Word/mapa + JSON hitos (US 18 / SE 10 catalogados).

### Próximos pasos:

- Re-ingestar Colección B tras merge; reauditorías oro v3.0.

---

<a id="devlog-2026-08-21-ptd-lc-v30"></a>
## [2026-08-21] - Orquestación | Catálogo PTD-LC v3.0 — 51 criterios por indicadores

**Rama:** `feat/orquestacion-s22-copy-accionable-cms`

### Contexto y objetivos:

Dejar atrás A1–H1 como nomenclatura y estructura primaria de Claude. Las auditorías nuevas usan **51** criterios agrupados en **15 indicadores IEW** / **13 IESD**, con ids `LC-*` y `display_label` tipo «Fiabilidad 1.1.1 / 5.1.1 — Criterio: …». El Word PTD y el mapa entran al RAG.

### Implementación técnica:

- `data/checklist-criteria-lc-ptd.json` (51) + generador `scripts/_gen_lc_ptd_criteria.py`.
- Zod dual: v3.0 (51) + históricos v2.1 (47) / v1.1 (39) en `src/schemas/checklist.ts`; `validate-checklist-data` valida ambos.
- `CLAUDE.md` §2/§17/§20/§22/§23; skills `auditoria-lc`, `auditoria-calidad-web`, `pesquisa-criterios`; prompts `audit-una-url`, `audit-oro-s22`.
- `docs/checklist-ptd-v2-mapa.md` + conteos 38/10/3; Word → `docs/…extracted.md`; `rag/ingest-b.ts` ingesta catálogos + Word + mapa.
- Excel/UI: catálogo fusionado; filas Excel según `version_checklist` de cada auditoría.

### Próximos pasos:

- Reauditorías oro con Claude Code (`version_checklist: "3.0"`, 51 filas).
- Re-ingestar Colección B (`bun run ingest:b`) cuando Chroma esté arriba.

---

<a id="devlog-2026-08-21-ptd-s23"></a>
## [2026-08-21] - Orquestación | Checklist PTD v2.0 actualizado → §23 (LC 2026)

**Rama:** `feat/orquestacion-s22-copy-accionable-cms`

### Contexto y objetivos:

El Word `Checklist_Editorial_INAPI_v2_0_actualizado.docx` quedó alineado con todas las preguntas IEW/IESD de LC, Usabilidad y Seguridad. Claude Code debe auditar con la estructura **Hito → Tarea → Pregunta**, con énfasis META MEI 2026 solo en Lenguaje claro; Usabilidad/Seguridad después del Excel LC.

### Implementación técnica:

- Versionar el Word en `docs/` y generar `data/checklist-editorial-ptd-v2.json` (CL1/US2/SE8 + mapeo indicador→A–H + reglas).
- Conteos oficiales de preguntas **únicas**: LC **51** · Usabilidad **18** · Seguridad **10** (total **79**); documentados en JSON `conteos_preguntas_unicas` y CLAUDE.md §23.1.1.
- `CLAUDE.md` **§23**; skills `auditoria-lc`, `auditoria-calidad-web`, `pesquisa-criterios`; prompts `audit-una-url` y `audit-oro-s22`; mapa PTD actualizado.
- Score / Excel de auditorías **nuevas**: **51** filas `LC-*` (`version_checklist: "3.0"`). El puente A–H quedó obsoleto para emisión nueva (ver entrada PTD-LC v3.0).

### Próximos pasos:

- Muestra oro + reauditorías LC 10 URLs; Excel MEI coherente.
- Luego skills/pasadas Usabilidad y Seguridad para cierre de año.

---

<a id="devlog-2026-08-21-mapa-iew-iesd"></a>
## [2026-08-21] - Documentación | Mapa IEW/IESD: preguntas LC · Usabilidad · Seguridad

**Rama:** `feat/orquestacion-s22-copy-accionable-cms`

### Contexto y objetivos:

El mapa PTD solo resumía indicadores. Para reforzar la orquestación Claude Code hace falta el inventario **pregunta a pregunta** de los instrumentos oficiales de sitios web (IEW) y servicios digitales (IESD), con numeración de dimensión distinta en cada PDF.

### Implementación técnica:

- Reescritura de `docs/checklist-ptd-v2-mapa.md`: todas las preguntas de chequeo de LC (IEW §1 / IESD §5), Usabilidad (IEW §2 / IESD §1) y Seguridad (IEW §8 / IESD §7), con códigos duales, variantes solo-IEW o solo-IESD, y columna motor A–H donde aplica.
- Usabilidad/Seguridad siguen fuera del % §17 2026; G2 enlaza política de privacidad como contenido.

### Próximos pasos:

- Briefs de subagentes y muestra oro apoyados en este mapa.
- No mezclar Usabilidad/Seguridad en el score LC sin decisión explícita.

---

<a id="devlog-2026-08-21-s22-copy-accionable"></a>
## [2026-08-21] - Orquestación | §22 reforzado: copy accionable CMS + realismo PTD

**Rama:** `feat/orquestacion-s22-copy-accionable-cms` (desde `main`)

### Contexto y objetivos:

La reunión jefatura + Equipo UX pidió que propuesto / justificación / ubicación sean accionables para quien corrige en CMS; ninguna casilla vacía; y que el mapa PTD refuerce los 47 criterios sin forzar correcciones ilógicas (p. ej. A7 sobre atajos de menú; B3 con propuestas sutiles tipo tooltip).

### Implementación técnica:

- `CLAUDE.md` §22.8–§22.12: casillas no vacías; realismo A7/B3/navegación; cruces con justificación propia sin inventar defectos; plantillas E3/F4; gate duro de consolidación.
- Skill `auditoria-lc.md`, `audit-una-url.md` y `docs/checklist-ptd-v2-mapa.md` alineados a esas reglas.
- Prompt listo para Claude Code: `.claude/prompts/audit-oro-s22.md` (Portada + noticia cifra patentes, fecha `2026-08-21`).

### 💡 Repaso técnico: realismo vs cobertura 47

Cubrir los 47 criterios significa **responder cada pregunta** con evidencia, no inventar un `incumple` por fila. Labels de menú no son párrafos: A7 se evalúa en el cuerpo; B3 en navegación admite tooltip/WCAG sin congestionar el ítem.

### Próximos pasos:

- Ejecutar en Claude Code las 2 URLs oro (`audit-oro-s22.md`); validar + commit atómico por URL.
- Revisar muestra con Equipo UX; luego Excel MEI completo y/o doc TI.

---

<a id="devlog-2026-08-20-roles-institucionales"></a>
## [2026-08-20] - Documentación | Roles institucionales sin nombres de personas

### Contexto y objetivos:

Las referencias nominales en docs, skills y código (y el nombre del archivo del mapa PTD) restaban profesionalismo frente a jefatura, Equipo UX y TI. Unificar a roles institucionales.

### Implementación técnica:

- Renombrar el mapa PTD a `docs/checklist-ptd-v2-mapa.md` (sin nombres propios en el path).
- Símbolos MEI: `categoriaPresentacion*` / `MEI_CATEGORIA_PRESENTACION` (antes ligados a un nombre propio).
- Docs, CLAUDE.md, skills y metadatos de auditorías: roles (jefatura de proyecto, Equipo UX, TI INAPI, desarrollo backend) en lugar de nombres propios; `evaluador_uid` / `encargado_ref` → `equipo-desarrollo`.

### Próximos pasos:

- Mantener la misma convención en commits/PR y en documentación nueva.

---

<a id="devlog-2026-08-20-entrega-legible-ptd"></a>
## [2026-08-20] - Orquestación | §22 entrega legible + mapa Checklist Editorial PTD v2.0

### Contexto y objetivos:

Tras la reunión con jefatura de proyecto y Equipo UX: los textos propuestos, justificaciones y ubicaciones no se leían como acciones para CMS/TIC; hacía falta anclar el Checklist Editorial PTD (Word) (LC + Usabilidad + Seguridad) al motor de 47 criterios sin diluir META MEI 2026.

### Implementación técnica:

- `CLAUDE.md` **§22**: audiencia editor CMS; plantilla `ubicacion_pantalla` / `propuesto` / `motivo`; cada criterio responde la pregunta del instrumento; brief reforzado en §17.
- Skills `auditoria-lc`, `auditoria-calidad-web`, `pesquisa-criterios` + plantilla `audit-una-url.md`: pase de legibilidad en subagentes y consolidación.
- `docs/checklist-ptd-v2-mapa.md`: Dimensión 1 → A–H; Usabilidad/Seguridad fuera del motor §17 en 2026.

### Próximos pasos:

- Reauditar 1–2 URLs muestra con §22 como estándar de oro para revisión Equipo UX.
- Documento de requisitos técnicos entendible para TI (propuesta MVP) — conversación de producto pendiente.
- Completar órdenes META MEI 7–10 / Excel completo si aún faltan en `main`.

---

<a id="devlog-2026-08-19-excel-47-categorias"></a>
## [2026-08-19] - Frontend/MEI | Excel con 47 criterios y 5 categorías de presentación MEI

### Contexto y objetivos:

El Excel por URL (y el completo) solo listaba incumplimientos + no_aplica del alcance H02 (B+C+D), sin los «Cumple». Equipo UX / desarrollo necesitan revisar los **47** criterios como en MVP/PDF, agrupados en las cinco etiquetas de la UI.

### Implementación técnica:

- `mei-criterio-categoria.ts`: mapeo Cumple / Cumple con observaciones / Medianamente cumple / No cumple / No aplica (`estado` + `severidad`).
- `mei-row-builder.ts`: una fila por criterio A1–H1; enriquecer incumple con `sustituciones[]`; orden por categoría.
- `mei-xlsx-writer.ts`: columna «Categoría» + filas sección por categoría en web INAPI / sitio TRAMITES.

### Próximos pasos:

- Descargar Excel de una URL `…_2026-08-20` en localhost y contrastar con la tabla de 47 del resultado.
- Tras órdenes 7–10: Excel completo con 10×47 filas de detalle.

---

<a id="devlog-2026-08-19-meta-mei-en-proceso"></a>
## [2026-08-19] - Frontend | META MEI órdenes 7–10 en proceso en UI

### Contexto y objetivos:

Tras cerrar la reauditoría 1-URL de órdenes 1–6 (`…_2026-08-20`), las órdenes 7–10 siguen con JSON `…_2026-08-18` y confundían la tabla META MEI (mismo aspecto «Disponible» / % rechazado). Hay que marcarlas como trabajo en curso hasta mañana.

### Implementación técnica:

- Flag `reauditoriaEnProceso` en `mei-meta-mei-urls.ts` (órdenes 7–10).
- `mei-meta-mei-launch.ts`: filas en proceso sin `resumenMvp` ni enlace a resultado; MVP «En proceso».
- Excel MEI institucional completo no se habilita mientras haya filas en proceso.
- Copy de la tarjeta META MEI actualizado.

### Próximos pasos:

- Reauditar órdenes 7→10 con `audit-una-url.md` y quitar `reauditoriaEnProceso` al cablear cada una.

---

<a id="devlog-2026-08-19-entrega-h1-47"></a>
## [2026-08-19] - Frontend | Entrega visible: H1/E4 y 47 criterios en tabla

**Rama:** `fix/entrega-visible-h1-47-criterios`

### Contexto y objetivos:

Tras la reauditoría 1-URL de la portada (`www-inapi-cl_2026-08-20`), la UI mostraba «46 criterios evaluados» y el resumen 27/40 (67,5 %), aunque el JSON tenía 47 filas. Causa: el filtro de entrega interpretó como metadata el comentario de E4 («No se evaluó `<title>`/`<meta>`») y ocultó el criterio H1 visible.

### Implementación técnica:

- `src/lib/audit-visible-content.ts`: neutralizar frases de negación title/meta; no marcar como metadata textos con H1/Tnnn/estructura visible; si hay sustitución VISIBLE ligada, el criterio no es metadata; `criteriosVisiblesParaEntrega` conserva **todas** las filas (47 en v2.1) — metadata real sigue pasando a `no_aplica` en el % sin borrar la pregunta.
- JSON portada: E4 con `capa: "VISIBLE"` y comentario sin literales `<title>`/`<meta>`.
- CLAUDE.md §20.1 y skill `auditoria-lc`: regla de redacción de comentarios + H1 siempre en entrega.
- Botón fijo «volver arriba» en `/auditar/resultado`: de inferior-izquierda a **inferior-derecha**.

### Próximos pasos:

- Merge a `main`; recargar resultado de portada (debe decir 47 criterios y E4 visible).
- Continuar reauditoría órdenes 2–10 con comentarios sin literales title/meta.

---

<a id="devlog-2026-08-19-workflow-1url"></a>
## [2026-08-19] - Documentación | Workflow 1-URL profundidad (Claude Code + Playwright + Chroma)

**Rama:** `feat/audit-workflow-1url-profundidad` (desde `main`)

### Contexto y objetivos:

Tras la Tanda A §20 se observó que lotes de varias URLs en un solo prompt maestro diluyen la profundidad (mismo texto propuesto en varios criterios; D3/D4/A9/E3/F4 poco explotados). Se acordó fijar **una URL por sesión** como default de producción y alinear prompts, CLAUDE.md y skills al máximo rendimiento de Claude Code (orquestador), Playwright MCP (captura/a11y/estilos) y Chroma RAG (fundamento + precedentes).

### Implementación técnica:

- Nueva plantilla canónica `.claude/prompts/audit-una-url.md` (captura una vez → inventario R+U → RAG → 5 subagentes → consolidación §20 → validate → cable → commit).
- `.claude/prompts/audit-lote.md` reescrito: coordina multi-sesión; default 1 URL; máx. 2 hermanas; 5 solo smoke; sección de cableado (reemplaza el antiguo «Paso 6»).
- `.claude/CLAUDE.md`: §8 playbook de herramientas; §12 apunta a `audit-una-url`; §14 política de tamaño; §17 flujo enriquecido; §20.6 gate de evidencia / hallazgos distintos; §21 playbook A9/D3/D4/E3/E4/F4/H1.
- `.claude/skills/auditoria-lc.md`: inventario dos capas R/U; gate evidencia; D3/D4 evaluables con `getComputedStyle` (ya no `no_aplica` por defecto «es CSS»).
- ROADMAP paso 6: workflow 1-URL marcado hecho; reauditoría órdenes 1–10 (fecha sugerida `2026-08-20`) sustituye Tanda B aislada; Excel MEI institucional tras esa pasada.
- Referencias actualizadas en `docs/ux/inventario-urls-clarity.md` y `docs/fase-3-3-captura-auth-claveunica.md`.

### Próximos pasos:

- Merge de esta rama a `main` (lint / typecheck / build).
- Reauditar META MEI órdenes **1→10** una URL por sesión con `audit-una-url.md` y fecha `2026-08-20` (confirmar al lanzar).
- Generar Excel MEI institucional completo cuando las 10 estén cerradas.

---

<a id="devlog-2026-08-19-meta-mei-reaudit-s20-lote-a"></a>
## [2026-08-19] - Infraestructura | META MEI §20: reauditoría Tanda A (órdenes 1–5)

**Rama:** `feat/meta-mei-reaudit-s20-lote-a` (desde `main`) | **Entorno:** Claude Team/Enterprise INAPI, Playwright MCP verificado (navigate + evaluate con guardado directo a disco), Chroma local activo

### Contexto y objetivos:

La calibración CLAUDE.md §20 (alcance solo visible, patrones de Layout, criterios cruzados) quedó documentada en la rama `feat/meta-mei-calibracion-ui-resultado` (2026-08-18) pero las 10 URLs META MEI seguían con JSONs que aplicaban esas reglas solo como notas en prosa («NOTA DE CONSOLIDACIÓN»), sin usar los campos reales del schema (`agrupado_en`, `criterios_relacionados`, `patron_sistema`). Esta sesión reaudita la primera mitad de la muestra (órdenes 1–5 de `mei-meta-mei-urls.ts`) aplicando la calibración de forma estructural.

Nota operativa: el reloj del sistema marcaba 2026-08-18, la misma fecha que los JSON vigentes a archivar. Se preguntó al usuario y se usó `{FECHA}=2026-08-19` para los 5 JSON nuevos, evitando la colisión de id/archivo con los `…_2026-08-18` que pasan a `history[]`.

### Implementación técnica:

- Flujo por URL: captura Playwright (HTML + snapshot de accesibilidad) → 5 sub-subagentes en paralelo (Grupo 1 A+E, Grupo 2 B+C, Grupo 3 D, Grupo 4 F, Grupo 5 G+H) → consolidación por el agente raíz aplicando `agrupado_en`/`criterios_relacionados`/`patron_sistema` → `validate:claude-audits` → cableado → commit atómico.
- **Orden 1 — Portada (`www-inapi-cl_2026-08-19`):** 70,0 % LC (rechazado). El H1 «Te queremos ayudar a utilizar la propiedad industrial» dispara A5+E4 sobre el mismo texto (agrupados bajo E4); el modal de contacto compartido (B1+B6) y el CTA duplicado «Acceder» (F2+F3) también se agrupan. 4 hallazgos agrupados no descuentan dos veces.
- **Orden 2 — Marcas (`www-inapi-cl-marcas_2026-08-19`):** 66,7 % LC (rechazado). El botón «LINK EXTERNO» del panel de login concentra 3 ángulos (B4 anglicismo, D1 texto de desarrollo, F3 destino no funcional); se agrupó B4→F3 y se dejaron D1/F3 como discounts independientes por tener remedios de naturaleza distinta (tipografía vs. funcionalidad).
- **Orden 3 — Patentes (`www-inapi-cl-patentes_2026-08-19`):** 61,0 % LC (rechazado). Caso más denso del lote: el párrafo «Requisitos para obtener una patente» disparaba 7 criterios (A7, C1, C3, C4, C7, D2, D5) por ser una sola oración con punto y coma; se retuvo C7 como primario y se agruparon A7/C1/C4/D2/D5 (C3 se mantuvo independiente por tener evidencia propia adicional en otro párrafo). Los íconos con `alt="mas"`/`alt="tramites"` repetidos (F1, F2, H1) se agruparon bajo H1.
- **Orden 4 — Acerca de INAPI (`www-inapi-cl-acerca-de-inapi_2026-08-19`):** 50,0 % LC (rechazado). Los párrafos de Visión/Misión agrupan B7/B8/C2 bajo C3 (oraciones de 44–56 palabras, relleno formal, tiempo verbal). E4 pasa a `incumple` (H1 «Acerca de» genérico, sin el H2 no tiene sentido).
- **Orden 5 — Buscador de noticias (`www-inapi-cl-buscador-noticias_2026-08-19`):** 43,8 % LC (rechazado). Página de resultados generada por Sitefinity: 15 de 47 criterios son `no_aplica` (no hay redacción editorial propia), el máximo del lote. Único agrupamiento limpio: B4→F3 (mismo botón «LINK EXTERNO»); el resto de hallazgos (snippets rotos, URL no canónica, keyword «documentaicón» expuesta) se mantuvieron independientes por tener evidencia distribuida en varios resultados, no un único nodo compartido.
- En las 5 URLs el % sube respecto al JSON `…_2026-08-18` de referencia porque los hallazgos agrupados dejan de descontarse dos o más veces por el mismo problema editorial — el JSON anterior ya tenía casi todos los mismos hallazgos, solo que sin el mecanismo de agrupamiento real.
- Cableado por URL: `frontend/src/lib/claude-audits-launch.ts` (`claudeAuditId`/`id` = `…_2026-08-19`; `…_2026-08-18` pasa a `history[]`) y `src/lib/mei-export/mei-meta-mei-urls.ts` (`auditId` actualizado). `bun run validate:claude-audits` y `bun run typecheck:all` en verde tras cada URL; commit atómico por URL.
- `bun run rag/ingest-b.ts` para reindexar Colección B con los 5 JSON nuevos.

### 💡 Repaso técnico: cuándo agrupar y cuándo no

La regla operativa que emergió al consolidar: un criterio secundario solo recibe `agrupado_en` cuando **toda** su evidencia en esa URL es el mismo texto/nodo que el primario ya corrige (ej. B4 sobre «LINK EXTERNO» cuando esa es su única cita). Si el criterio tiene evidencia adicional en otro lugar de la página (ej. B1 también incumple por el modal de contacto compartido, además del párrafo agrupado), se mantiene como discount independiente y solo se referencia en `criterios_relacionados` del otro hallazgo para documentación — sin afectar el cálculo del %. Esto evitó sobre-agrupar en URLs con overlaps difusos (como el buscador, donde el mismo defecto de indexación toca varios resultados sin ser literalmente el mismo nodo).

### Próximos pasos:

- Merge de `feat/meta-mei-reaudit-s20-lote-a` a `main` (si aún pendiente).
- Tras merge del workflow 1-URL: reauditar órdenes **1–10** (no solo Tanda B) con `.claude/prompts/audit-una-url.md`.
- Tras cerrar las 10 URLs: generar el Excel MEI institucional completo.

---

<a id="devlog-2026-08-18-calibracion-ui-resultado"></a>
## [2026-08-18] - Frontend | Calibración META MEI §20 + UI resultado legible

**Rama:** `feat/meta-mei-calibracion-ui-resultado` (desde `feat/meta-mei-v21-lote-3`)

### Contexto y objetivos:

Tras cerrar las 10 URLs META MEI v2.1, jefatura observó: (1) criterios cruzados con el mismo texto propuesto bajaban el % varias veces; (2) hallazgos de Layout repetidos en todas las URLs sin etiqueta de patrón; (3) elementos en DOM/metadata no visibles descontaban %; (4) `no_aplica` sin justificación; (5) resumen y nota TI ilegibles; (6) UI de resultado pesada (criterios siempre abiertos, Excel secundario, sin volver arriba).

### Implementación técnica:

- Documentación: `.claude/CLAUDE.md` §20 + skill `auditoria-lc.md` (VISIBLE / patrones / cruces / `no_aplica`).
- Schema: `agrupado_en` en criterios; `criterios_relacionados` y `patron_sistema` en sustituciones; `summarizeEvaluations` no descuenta agrupados.
- UI `/auditar/resultado`: párrafos legibles en resumen y nota TI; criterios en acordeón; Excel MEI estilo primary; botón fijo volver arriba.
- PDF y Excel MEI alineados (comentario en `no_aplica`, criterios relacionados, patrones).

### Próximos pasos:

- Reauditar las 10 URLs con calibración §20.
- Generar Excel MEI institucional completo y merge a `main`.

---

<a id="devlog-2026-08-18-meta-mei-lote-7-10"></a>
## [2026-08-18] - Infraestructura | META MEI v2.1: cierre lote 7–10 (Sala de Prensa, 2 noticias, SIAC)

**Rama:** `feat/meta-mei-v21-lote-3` | **Entorno:** Claude Code Enterprise INAPI, Playwright MCP verificado (navigate + evaluate con guardado directo a disco), Chroma local (Colección B disponible para varios sub-subagentes)

### Contexto y objetivos:

Cerrar las últimas cuatro URLs de la muestra META MEI (órdenes 7–10), completando así las **10 URLs oficiales** en checklist v2.1 con alcance solo visible. Cada URL se procesó con la arquitectura de 5 sub-subagentes (§17): Grupo 1 (A+E), Grupo 2 (B+C), Grupo 3 (D), Grupo 4 (F), Grupo 5 (G+H), lanzados en paralelo por URL y consolidados por el agente raíz.

### Implementación técnica:

- **Orden 7 — Sala de Prensa (Noticias, listado):** `www-inapi-cl-sala-de-prensa-noticias_2026-08-18.json`. **63,2 %** LC sobre 38 aplicables (**rechazado**); 24 cumple, 14 incumple (5 alta, 9 media), 9 no_aplica. Mejora notable vs v1.1 (45,5 %): las imágenes del carrusel de logos institucionales que antes tenían `alt` vacío ahora están descritas, y G1 se recalibra a `cumple` (RUT institucional).
- **Orden 8 — Noticia Cuenta Pública 2026:** `www-inapi-cl-noticia-cuenta-publica-2026_2026-08-18.json`. **41,5 %** LC sobre 41 aplicables (**rechazado**); 24 cumple, 24 incumple (5 alta, 12 media, 7 baja), 6 no_aplica. Hallazgo alta severidad propio: el primer párrafo del cuerpo editorial inicia en minúscula sin conector (D1/D2). Corrección de consolidación: se ajustó el comentario de E2 del sub-subagente Grupo 1 para no exigir firma periodística explícita (el criterio solo pide que INAPI sea identificable en encabezado/pie).
- **Orden 9 — Noticia Cifra histórica de patentes:** `www-inapi-cl-noticia-cifra-patentes-nacionales_2026-08-18.json`. **58,5 %** LC sobre 41 aplicables (**rechazado**); 24 cumple, 17 incumple (1 alta, 12 media, 4 baja), 6 no_aplica. Mejor ortografía/gramática de base del lote; único hallazgo alta es el botón «LINK EXTERNO» del modal de login sin destino funcional (F1, patrón sistémico). Corrección de consolidación: se revirtió a `cumple` el criterio E2 que el Grupo 1 marcó incumple por el mismo motivo que en la orden 8 (exigencia no contemplada en la definición del criterio).
- **Orden 10 — Formulario Contacto SIAC (`tramites.inapi.cl/siac`):** `tramites-inapi-cl-siac_2026-08-18.json`, `tipo_pagina: "tramites"`, `captura_con_sesion: false` (formulario público, sin login obligatorio — el modal de bienvenida ofrece «Continuar sin Iniciar Sesión»; todos los campos capturados vacíos). **52,8 %** LC sobre 36 aplicables (**rechazado**); 19 cumple, 17 incumple (5 alta, 8 media, 4 baja), 11 no_aplica. Se corrigieron tres errores ortográficos de la v1.1 (`...Selecione...` → `...Seleccione...`, `Rut:` → `RUT:`, `Atención!` → `¡Atención!`), pero el checklist v2.1 expone deudas estructurales nuevas de mayor peso: la página no tiene **ningún** encabezado H1/H2/H3 semántico (A1 y A3, ambas alta) y falta información de autonomía del trámite — plazo de respuesta y canal de seguimiento explícito (A8, alta). Corrección de consolidación: el sub-subagente del Grupo 3 (D) reportó un hallazgo D2 falso («espacio antes de los dos puntos» en las etiquetas del formulario); se verificó directamente contra el HTML crudo capturado y se descartó — D2 quedó como `cumple`.
- Las cuatro capturas Playwright se guardaron directo a disco con `browser_evaluate({ filename })`, sin volcar el HTML completo al contexto de la conversación; el HTML resultante es un volcado de una sola línea (`outerHTML` sin saltos), por lo que en `sustituciones[]` se usó `html_linea_aprox` con anclas de texto (Ctrl+F) en vez de números de línea reales.
- Cableado: `frontend/src/lib/claude-audits-launch.ts` (orden 7 y 10 en `CLAUDE_PILOT_URL_ROWS`, con `history` al id v1.1; órdenes 8 y 9 en `META_MEI_EXTRA_AUDITS`, con `history`) y `src/lib/mei-export/mei-meta-mei-urls.ts` (órdenes 7–10 apuntando a los ids `_2026-08-18`).
- `bun run validate:claude-audits` y `bun run typecheck:all` en verde tras cada URL; commit atómico por URL.

### 💡 Repaso técnico: correcciones del agente raíz en la consolidación

En dos URLs (8 y 9) el sub-subagente del Grupo 1 marcó `E2` como `incumple` exigiendo una firma editorial/periodística distinta del director citado — un requisito que **no** está en la verificación literal del criterio (`data/checklist-criteria.json`: «Aparece el nombre de la institución (INAPI) en encabezado o pie»). En la URL 10, el sub-subagente del Grupo 3 reportó un `D2` inexistente por una nota ambigua del prompt del agente raíz («verificar consistencia» de un espacio antes de los dos puntos que en realidad no está en el HTML). Ambos casos se corrigieron en la consolidación tras verificar contra la definición del criterio y el HTML crudo respectivamente — la arquitectura §17 delega la palabra final al agente raíz precisamente para resolver este tipo de desviaciones antes de escribir el JSON canónico.

### Próximos pasos:

- PR/merge de `feat/meta-mei-v21-lote-3` a `main`.
- Generar el Excel MEI institucional de las **10 URLs** META MEI ahora que todas están en v2.1 visible.
- Revisión editorial con Equipo UX de las filas nuevas (especialmente A1/A3 sin H1 en SIAC, y A8 de autonomía del trámite).

---

<a id="devlog-2026-08-18-meta-mei-url-6"></a>
## [2026-08-18] - Infraestructura | META MEI v2.1: URL 6 Solicitud Nueva (orden 6)

**Rama:** `feat/meta-mei-v21-lote-3` | **Entorno:** PC oficina (Windows) — Playwright MCP en timeout (Chrome no llega a cargar la página; HTML capturado manualmente vía Ctrl+U/renombrado), Chroma local (solo Colección B disponible en esta sesión)

### Contexto y objetivos:

Continuar el lote 6–10 de reauditoría META MEI v2.1 cerrado con la orden 5 (buscador de noticias). Esta entrada cierra la orden 6: `/marcas/tramites/solicitud-nueva`, el único trámite de la muestra clasificado como `sitioweb`.

### Implementación técnica:

- Playwright MCP quedó en timeout (180s) al navegar; se usó el HTML entregado manualmente por el usuario en `auditorias/htmls/www-inapi-cl-marcas-tramites-solicitud-nueva_2026-08-18.html` (formato view-source con numeración de línea real).
- Script auxiliar en el scratchpad (`bun` + regex) para decodificar entidades y despojar el marcado de resaltado del view-source, permitiendo inventariar el HTML de forma legible sin exceder el contexto.
- JSON canónico `data/claude-audits/sitioweb/2026-08-18/www-inapi-cl-marcas-tramites-solicitud-nueva_2026-08-18.json`: 47 criterios, `version_checklist: "2.1"`, sustituciones con `ubicacion_pantalla` + `capa: "VISIBLE"`; sin evidencia de `<title>`/`<meta>`.
- Resultado: **47,1 %** LC sobre 34 aplicables (**rechazado**); 16 cumple, 18 incumple, 13 no_aplica.
- Comparado con la auditoría v1.1 (2026-06-07, 44,8 %): el carrusel de recursos institucionales mejoró de forma verificable (alt/title vacíos o en minúscula corregidos); G1 se recalibra a `cumple` (RUT institucional, persona jurídica pública), alineado con el resto del lote.
- RAG: Colección A (normativa) no disponible — Chroma no estaba levantado en `localhost:8000` para esa colección en esta sesión; Colección B (precedentes) sí respondió y confirmó la calibración de G1 y el patrón de shell compartido de D1 («Propiedad industrial»).
- Cableado: `claude-audits-launch.ts` (vigente + `history` a `…_2026-06-07`) y `mei-meta-mei-urls.ts` orden 6.

### Próximos pasos:

- PR/merge de `feat/meta-mei-v21-lote-3` a `main`.
- Lote siguiente: órdenes 7–10 (Sala de Prensa, dos noticias detalle, SIAC).
- Levantar Chroma con Colección A cargada para las próximas reauditorías.

---

<a id="devlog-2026-08-18-meta-mei-url-5"></a>
## [2026-08-18] - Infraestructura | META MEI v2.1: URL 5 buscador de noticias (cierre lote 1–5)

**Rama:** `feat/meta-mei-v21-lote-2` | **Entorno:** PC oficina (Windows) — Claude Code Enterprise INAPI, Playwright MCP, Chroma local (Colección B)

### Contexto y objetivos:

Cerrar las **cinco** URLs META MEI prioritarias con checklist v2.1 y alcance solo visible. Las órdenes 1–4 (portada, marcas, patentes, acerca-de) ya estaban en `main` (`…_2026-08-18`). Faltaba la orden 5: buscador de noticias, para poder pasar al lote 6–10 y, al final, al Excel MEI institucional de 10 URLs.

### Implementación técnica:

- Captura Playwright → `auditorias/htmls/www-inapi-cl-buscador-noticias_2026-08-18.html`.
- JSON canónico `data/claude-audits/sitioweb/2026-08-18/www-inapi-cl-buscador-noticias_2026-08-18.json`: 47 criterios, `version_checklist: "2.1"`, sustituciones con `ubicacion_pantalla` + `capa: "VISIBLE"`; sin evidencia de `<title>`/`<meta>`.
- Resultado: **40,6 %** LC sobre 32 aplicables (**rechazado**); 13 cumple, 19 incumple, 15 no_aplica.
- Cableado: `claude-audits-launch.ts` (vigente + `history` a `…_2026-06-07`) y `mei-meta-mei-urls.ts` orden 5.
- Setup oficina: Python 3.12 + `chromadb`, PATH de `claude`, `ingest:b` (1502 chunks). Colección A pendiente (sin PDFs en `documentos/`).

### 💡 Repaso técnico: Chroma en Windows sin WSL:

El CLI `chroma` no venía con el repo: hace falta Python + `pip install chromadb`. La base `rag/chroma_db/` no se versiona; en un PC nuevo hay que levantar el servidor e ingerir B (y A si hay PDFs). Sin Colección A el flujo §17 sigue válido con checklist + B + skills.

### Próximos pasos:

- PR/merge de `feat/meta-mei-v21-lote-2` a `main` (URL 5 + docs).
- Lote 2: órdenes 6–10 (Solicitud Nueva, Sala de Prensa, dos noticias detalle, SIAC).
- Excel completo 10 URLs solo cuando las 10 estén en v2.1 visible.

---

<a id="devlog-2026-08-18-entrega-visible-excel-url"></a>

## [2026-08-18] - Frontend | entrega solo visible + Excel por URL

### Contexto y objetivos:

Alinear entrega (UI resultado, PDF, Excel) y reglas Claude §17 con el uso real: jefatura no TI revisa lo **visible en pantalla**. Evitar que hallazgos de `<title>`/`<meta>` contaminen % y descargas. Separar Excel de una URL vs workbook META MEI de las 10.

### Implementación técnica:

- Filtro `src/lib/audit-visible-content.ts` (`bundleForVisibleDelivery`) aplicado en resultado, PDF y carga MEI.
- Skills/`CLAUDE.md`/`audit-lote.md`: alcance solo visible; E4 = H1; campo opcional `ubicacion_pantalla` + `capa`.
- Excel por URL: `GET /api/mei-calidad-web/export/url/[auditId]/xlsx`; resultado descarga «esta URL». Completo 10 URLs solo cuando META MEI v2.1 está lista.
- Columnas Excel/PDF orientadas a: texto en pantalla → corrección → ubicación → justificación → ref. técnica.
- `bun run lint`, `typecheck:all` y `build` OK.

### Próximos pasos:

- Corregir JSON de home/marcas/patentes (quitar metadata; añadir `ubicacion_pantalla`).
- Completar lote 1 URLs 4–5 (acerca-de, buscador noticias) con las mismas reglas.

---

<a id="devlog-2026-08-18-meta-mei-ui-historial"></a>

## [2026-08-18] - Frontend | tabla META MEI 10 URLs e historial unificado

### Contexto y objetivos:

Mientras Claude Code reaudita el lote META MEI (§17 / checklist v2.1), alinear `/auditar` a las **10 URLs oficiales** del compromiso y evitar que desaparezcan URLs ya auditadas al cambiar la lista superior.

### Implementación técnica:

- Helper `frontend/src/lib/mei-meta-mei-launch.ts`: filas desde `MEI_META_MEI_URLS`, historial unificado (Clarity + launch no Clarity) y puerta de UI `metaMeiAuditReadyForUi` (solo ids con fecha ≥ `2026-08-18` activan links).
- Tabla superior (`auditar-claude-pilot-section.tsx`): las 10 META MEI; filas en **Pendiente** hasta cablear reauditoría v2.1 (no usan JSON v1.1 previos).
- Historial inferior: una sola tabla (`clarity-inventory-historial-table.tsx`) con inventario Clarity más URLs piloto/META MEI ausentes en Clarity; textos explicativos extras eliminados.
- `typecheck` frontend OK. No incluir en este commit capturas HTML sueltas de Claude (`auditorias/htmls/…`).

### Próximos pasos:

- Completar lote §17 (URLs 1–5 y luego 6–10), cablear ids `…_2026-08-18` en launch + `mei-meta-mei-urls.ts` para habilitar filas superiores.
- Regenerar Excel MEI cuando el lote v2.1 esté cerrado.

---

<a id="devlog-2026-08-18-audit-jobs-typecheck"></a>

## [2026-08-18] - Infraestructura | typecheck:all paso 4 audit-jobs

### Contexto y objetivos:

Cerrar el **paso 4 ítem 10** de validación local antes del PR a `main`.

### Implementación técnica:

- `bun run typecheck:all` OK: checklist v2.1, fixtures, claude-audits, `tsc` raíz y frontend.
- ROADMAP paso 4 ítem 10 marcado (typecheck); falta push + PR de la rama.

### Próximos pasos:

- Push `feat/mvp-audit-jobs-worker` y `gh pr create` a `main`.
- Después: worker modo §17 real; pasos 5–6 ROADMAP si aplica.

---

<a id="devlog-2026-08-18-tunel-spike"></a>

## [2026-08-18] - Documentación | spike túnel Vercel↔worker PC

### Contexto y objetivos:

Cerrar el **paso 4 ítem 9**: dejar escrito cómo exponer la demo sin implementar todavía store remoto ni rewrites Vercel.

### Implementación técnica:

- Nuevo [`docs/despliegue/tunel-vercel-worker-pc.md`](../despliegue/tunel-vercel-worker-pc.md): topologías A/B/C, bloqueo disco efímero en Vercel, runbooks Cloudflare Quick Tunnel y Tailscale, checklist demo 8–18.
- Decisión MVP: **túnel → PC completo** (misma app que `bun run dev`); worker sigue en localhost.
- Enlace desde ADR 0011; ROADMAP ítem 9 `[x]`.

### Próximos pasos:

- Ítem 10: `typecheck:all` + PR a `main`.
- Opcional: probar un quick tunnel real y anotar resultado.

---

<a id="devlog-2026-08-18-audit-jobs-downloads"></a>

## [2026-08-18] - Frontend | descargas PDF/Excel desde resultado del job

### Contexto y objetivos:

Cerrar el **paso 4 ítem 8**: exponer descargas reutilizando APIs ya existentes (PDF Claude + Excel MEI completo).

### Implementación técnica:

- `descargas` en GET result: `pdfPath` + `excelPath` opcional si la URL está en META MEI.
- Resultado: botón PDF para cualquier informe Claude cargado; Excel MEI cuando aplica.
- Stub worker sigue sin informe canónico (sin PDF útil).
- ROADMAP paso 4 ítem 8 `[x]`.

### Próximos pasos:

- Ítem 9: spike/documentación de túnel Vercel↔PC.

---

<a id="devlog-2026-08-18-audit-jobs-ui-poll"></a>

## [2026-08-18] - Frontend | Continuar → job → poll en procesando

### Contexto y objetivos:

Cerrar el **paso 4 ítem 7**: cablear el formulario Continuar a la cola on-demand y sustituir el timer mock cuando hay `jobId`.

### Implementación técnica:

- Formulario: URL + nombre auditor → `POST /api/audit-jobs` → `/auditar/procesando?jobId=`.
- Procesando con `jobId`: poll cada 5 s; `done` → resultado real; stub → mensaje sin abrir informe; `failed` / errores visibles.
- Flujo legacy `?url=` (captura/fixtures) conserva el timer mock.
- ROADMAP paso 4 ítem 7 `[x]`.

### Próximos pasos:

- Ítem 8: descargas PDF/Excel desde resultado del job.

---

<a id="devlog-2026-08-18-audit-jobs-result"></a>

## [2026-08-18] - Backend | GET result e historial de audit-jobs

### Contexto y objetivos:

Cerrar el **paso 4 ítem 6**: devolver resultado cuando el job está `done`, con historial por URL y rutas de descarga (sin cablear UI aún).

### Implementación técnica:

- `GET /api/audit-jobs/[id]/result` → 200 con `historial` + `descargas`; 409 con shape de poll si no está `done`.
- Historial: filas launch (piloto/Clarity) + jobs `done` locales de la misma URL.
- Stub sin JSON canónico: entrada sin %/estado; paths PDF/resultado listos para ítem 8.
- ROADMAP paso 4 ítem 6 `[x]`.

### Próximos pasos:

- Ítem 7: Continuar → job → poll en `/auditar/procesando`.

---

<a id="devlog-2026-08-18-audit-jobs-worker-script"></a>

## [2026-08-18] - Infraestructura | worker audit-jobs stub local

### Contexto y objetivos:

Cerrar el **paso 4 ítem 5** con un bucle operativo claim → complete **sin** invocar Claude Code §17 aún (stub), para validar la cola en local.

### Implementación técnica:

- Script `src/scripts/audit-jobs-worker.ts` + `bun run worker:audit-jobs` (`--once` opcional).
- Respeta horario 8–18; llama `POST …/claim` y `…/complete` con `X-Worker-Secret`.
- Modo `AUDIT_JOBS_WORKER_MODE=stub`: `auditId` provisional `stub-{slug}_{fecha}` (sin JSON canónico).
- `AUDIT_JOBS_WORKER_IGNORE_HOURS=1` para probar fuera de 8–18 en local.
- Variables documentadas en `.env.example`.
- ROADMAP paso 4 ítem 5 `[x]`.

### Próximos pasos:

- Ítem 6: `GET …/result` + historial.
- Más adelante: modo que lance §17 real en lugar del stub.

---

<a id="devlog-2026-08-18-audit-jobs-claim"></a>

## [2026-08-18] - Backend | claim/complete audit-jobs + secreto worker

### Contexto y objetivos:

Cerrar el **paso 4 ítem 4**: protocolo para que el PC reclame y complete jobs sin tocar §17/skills.

### Implementación técnica:

- Store: `promoteOutsideHoursToQueued`, `claimNextQueuedJob`, `completeJobSuccess` / `completeJobFailure`.
- `POST /api/audit-jobs/claim` (204 si vacío; dentro de horario promueve `outside_hours`).
- `POST /api/audit-jobs/[id]/complete` (`ok` + `auditId` o `errorMessage`).
- Auth header `X-Worker-Secret` vs `AUDIT_JOBS_WORKER_SECRET` (`.env.example` raíz y `frontend/`).
- ROADMAP paso 4 ítem 4 `[x]`.

### Próximos pasos:

- Ítem 5: script worker local (stub §17 OK primero).

---

<a id="devlog-2026-08-18-audit-jobs-hours"></a>

## [2026-08-18] - Backend | horario 8–18 y estado `outside_hours`

### Contexto y objetivos:

Cerrar el **paso 4 ítem 3**: al crear un job, decidir `queued` vs `outside_hours` según ventana laboral Chile, sin claim ni promoción automática aún.

### Implementación técnica:

- `src/lib/audit-jobs/business-hours.ts`: lun–vie `[08:00, 18:00)` en `America/Santiago`.
- `POST /api/audit-jobs` usa `initialAuditJobStatus()`; fuera de ventana **persiste** `outside_hours` (mensaje del contrato).
- ROADMAP paso 4 ítem 3 `[x]`.

### Próximos pasos:

- Ítem 4: claim/complete del worker (`X-Worker-Secret`).

---

<a id="devlog-2026-08-18-audit-jobs-api"></a>

## [2026-08-18] - Backend | POST/GET `/api/audit-jobs`

### Contexto y objetivos:

Cerrar el **paso 4 ítem 2**: exponer crear job y poll de estado sobre el store JSON, sin horario 8–18 ni claim del worker.

### Implementación técnica:

- `POST /api/audit-jobs` y `GET /api/audit-jobs/[id]` (runtime Node).
- Validación URL con hosts de `auditUrlFormSchema`; nombre 1–120 sin HTML.
- Persistencia vía `createJob` / `readJob` con `repoRoot()` (disco del monorepo en `bun run dev`).
- POST deja siempre `queued` (ítem 3 añadirá `outside_hours`).
- ROADMAP paso 4 ítem 2 `[x]`.

### Próximos pasos:

- Ítem 3: ventana 08:00–18:00 America/Santiago al crear el job.

---

<a id="devlog-2026-08-18-audit-jobs-store"></a>

## [2026-08-18] - Backend | persistencia audit-jobs (`data/jobs` + Zod)

### Contexto y objetivos:

Arrancar el **paso 4** de la Fase 4 (ítem 1): modelo y store en disco antes de exponer HTTP. Sin routes, sin UI, sin worker.

### Implementación técnica:

- Rama `feat/mvp-audit-jobs-worker`.
- Schema Zod en `src/schemas/audit-job.ts` (estados del contrato + `createAuditJobInputSchema`).
- Store `src/lib/audit-jobs/store.ts`: `createJob` / `writeJob` / `readJob` / `updateJob` / `listJobs` / `listJobsByStatus`; raíz vía `LC_REPO_ROOT` o ruta del módulo.
- Carpeta `data/jobs/` (`.gitkeep`); JSON locales ignorados en `.gitignore`.
- ROADMAP paso 4 ítem 1 marcado `[x]`.

### Próximos pasos:

- Ítem 2: `POST` / `GET` Route Handlers `/api/audit-jobs` (sin horario ni claim aún).

---

<a id="devlog-2026-08-17-contratos-audit-jobs"></a>

## [2026-08-17] - Documentación | contratos API audit-jobs y claim worker

### Contexto y objetivos:

Cerrar el **paso 3** de la Fase 4: especificar el contrato HTTP del mini-backend (crear job, poll, resultado/historial, claim/complete del worker) sin implementar código ni tocar §17/skills.

### Implementación técnica:

- Rama `docs/mvp-audit-jobs-contracts`.
- Nuevo [`docs/contratos-audit-jobs.md`](../contratos-audit-jobs.md): estados, horario 8–18, payloads, claim con `X-Worker-Secret`.
- Enlace desde ADR 0011; ROADMAP paso 3 `[x]`.

### Próximos pasos:

- Paso 4: plan de archivos + rama `feat/mvp-audit-jobs-worker` (implementación atómica).

---

<a id="devlog-2026-08-17-adr-0011-worker"></a>

## [2026-08-17] - Documentación | ADR 0011 worker on-demand + cotización API

### Contexto y objetivos:

Cerrar el **paso 2** de la Fase 4: documentar la arquitectura MVP (Vercel UI + worker PC 8–18 + Claude Code Team, sin API Anthropic operativa) y dejar una plantilla de cotización API solo como evidencia de costo. **Sin** vincular Vercel/Cursor ni implementar código de jobs.

### Implementación técnica:

- Rama `docs/mvp-worker-on-demand`.
- Nuevo [ADR 0011](../adr/0011-worker-local-on-demand-vercel.md) (borrador): flujo job/poll/claim, sin auth, persistencia `data/jobs/` o SQLite, túnel pendiente de spike.
- `docs/cotizacion-anthropic-api-evidencia.md` *(retirado 2026-08)*: método + placeholders.
- ROADMAP paso 2 marcado `[x]`.

### Próximos pasos:

- Paso 3: contratos HTTP `audit-jobs` + claim del worker (spec en repo).
- Paso 4: implementación en rama `feat/mvp-audit-jobs-worker` tras plan de archivos.

---

<a id="devlog-2026-08-17-checklist-merge-main"></a>

## [2026-08-17] - Checklist | merge v2.1 a main (Fase 4 paso 1)

### Contexto y objetivos:

Cerrar el **paso 1** de la Fase 4: dejar el checklist v2.1 (47 criterios) y la documentación del paso 0 (Claude Team INAPI) en `main`.

### Implementación técnica:

- Rama `feat/checklist-v2.1-47-criterios` pusheada; PR mergeado en GitHub.
- Tip de `main`: `fad7d70` — *feat(checklist): v2.1 — 47 criterios + Claude Team INAPI* (merge de `5c1fce9` + `cda076c`).
- `bun run typecheck:all` verificado en verde antes del push.

### Próximos pasos:

- Fase 4 **paso 2**: documentación worker on-demand (ADR/one-pager, cotización API placeholders).
- Luego paso 3 contratos BE; paso 4 implementación en rama nueva (plan de archivos primero).

---

<a id="devlog-2026-08-17-claude-team-inapi"></a>

## [2026-08-17] - Infraestructura | Claude Team INAPI — migración cuenta + smoke test

### Contexto y objetivos:

Cerrar el **paso 0** de la [Fase 4 del ROADMAP](../ROADMAP.md#fase-4--mvp-on-demand-cuenta-claude-pro-institucional--worker-local--be-delgado): dejar de operar auditorías §17 con la cuenta Claude personal y usar solo el asiento **institucional INAPI** (Claude Team).

### Implementación técnica:

- `claude auth logout` (sesión personal expirada `fernandodesign96@gmail.com`).
- `claude auth login --claudeai --email farriagada@inapi.cl` → **Login method: Claude Team account**, **Organization: Inapi**.
- `claude mcp list`: playwright ✔, rag-auditoria ✔ (también Google Drive MCP, opcional).
- Chroma local: `chroma run --path ./rag/chroma_db --port 8000`.
- Smoke test en Claude Code (sin JSON de auditoría): Playwright en `https://www.inapi.cl/` (title + H1) + criterio B3 vía checklist/RAG.

### Próximos pasos:

- Paso 1 Fase 4: PR/merge de `feat/checklist-v2.1-47-criterios` → `main`.
- Luego docs worker on-demand + contratos BE (pasos 2–3) en rama nueva.

---

<a id="devlog-2026-08-17-checklist-v21-47"></a>

## [2026-08-17] - Checklist | v2.1 — 47 criterios, citas IEW/IESD/RLC y orquestación Claude

### Contexto y objetivos:

Incorporar el Word **Checklist Editorial INAPI v2.1** (ago-2026): 8 criterios nuevos (A6–A9, B8, C8, C9, F6), ampliación de E4/F4, citas normativas precisas (sin `CW` genérico) y aplicabilidad `ambos`/`sitioweb`/`tramites`. Alinear contratos Zod, skills Claude Code §17 y export MEI/Fuentes **sin** reauditar URLs ni implementar el mini-backend de jobs.

### Implementación técnica:

- `data/checklist-criteria.json` → `checklist_version: "2.1"`, 47 filas + `applicability`.
- `src/schemas/checklist.ts`: `CRITERION_IDS` (47), `CRITERION_IDS_V11` (39), mocks/demos en v2.1; `strictAuditRecordSchema` acepta 39 **o** 47 filas.
- MEI: hitos H02/H03/H04/H09 y H02 Meta MEI amplían criterios; `mei-source-labels` con IEW/IESD/MEI.
- `.claude/CLAUDE.md`, `audit-lote.md`, skills `auditoria-lc`, `auditoria-calidad-web`, `pesquisa-criterios`.

### Próximos pasos:

- ~~Migración Claude Pro personal → Team INAPI~~ (hecho — ver [entrada cuenta](#devlog-2026-08-17-claude-team-inapi)).
- PR/merge checklist v2.1 a `main`; luego plan worker/BE.
- Tras checklist en `main`: elegir 5 URLs META MEI para §17 con v2.1.
- Cotización Anthropic API solo como evidencia de costo (no operativa).

---

<a id="devlog-2026-07-29-meta-mei-reauditoria-17"></a>

## [2026-07-29] - Infraestructura | Reauditoría §17 de 3 URLs META MEI + Excel regenerado

### Contexto y objetivos:

Las tres URLs nuevas de la muestra META MEI (`/patentes` y dos noticias detalle) se habían generado primero con un JSON provisorio en Cursor. Antes de la reunión de jefatura (2026-07-30) se reauditaron con el flujo oficial Claude Code Pro: Playwright MCP + RAG (Chroma) + 5 sub-subagentes (§17) + `validate:claude-audits` + `ingest:b`.

### Implementación técnica:

- JSON sobrescritos en `data/claude-audits/sitioweb/2026-07-29/` y HTML en `auditorias/htmls/`.
- Resultados: `/patentes` 42,9 %; noticia Cuenta Pública 60,0 %; noticia cifra patentes 65,7 % (las tres rechazado).
- Calibraciones: G1 RUT institucional → `cumple`; D7 excluye ACCESOS/BUSCADOR; E3 cumple en noticias con fecha visible.
- `META_MEI_EXTRA_AUDITS` actualizado; Excel H02 y completo regenerados (10 URLs, 173 filas H02, pestañas Índice/CheckList/Fuentes/web INAPI/sitio TRAMITES). Archivos en `data/exports/` (gitignored).

### 💡 Repaso técnico: Provisorio Cursor vs §17:

Un JSON válido por schema no equivale a auditoría §17. Para entregas META MEI / jefatura, el orquestador debe ser Claude Code con captura real y grupos A+E, B+C, D, F, G+H.

### Próximos pasos:

- Revisar Excel con Equipo UX en reunión 2026-07-30.
- Opcional: reauditar §17 las 7 URLs META MEI que aún apuntan a JSON de junio.

---

<a id="devlog-2026-07-29-meta-mei-10-urls-fuentes"></a>

## [2026-07-29] - Frontend | MEI: 10 URLs META MEI + pestaña Fuentes en Excel

### Contexto y objetivos:

Tras corrección con Equipo UX (prep. reunión jefatura 2026-07-30), los Excel descargables de H02 y entrega completa deben (1) usar las **10 URLs compromiso META MEI** y (2) comunicar en qué documentos de Colección A se fundamentan los 39 criterios del checklist (cita `RLC`/`CW` → PDF).

### Implementación técnica:

- Registro `mei-meta-mei-urls.ts` (orden META MEI); loader `loadMetaMeiAudits()` por defecto en el writer.
- Pestaña **Fuentes**: Hito × Dimensión × Criterio × cita × documento(s); H02 ampliado a B+C+D1–D7.
- 3 auditorías nuevas 2026-07-29: `/patentes`, noticia Cuenta Pública, noticia cifra patentes; registradas en `META_MEI_EXTRA_AUDITS` (`claude-audits-launch.ts`). **Actualización misma tarde:** reauditoría §17 oficial — ver [entrada reauditoría](#devlog-2026-07-29-meta-mei-reauditoria-17).
- CLI: `--urls=clarity` conserva la muestra Clarity 13.

### 💡 Repaso técnico: CW ≠ PDF calidad-web-2.0:

Las citas `CW` del checklist son marco conceptual; el PDF principal es `meta-mei.pdf`. `RLC` apunta a `lenguaje-claro-recomendaciones.pdf`.

### Próximos pasos:

- ~~Reauditar §17 las 3 URLs nuevas~~ (hecho — ver entrada reauditoría).
- Revisar con Equipo UX el Excel H02/completo antes de la reunión.
- Opcional: reauditar con §17 las 7 URLs que aún usan JSON de junio en la muestra META MEI.

---

<a id="devlog-2026-07-29-mei-ui-excel-institucional"></a>

## [2026-07-29] - Frontend | MEI — UI jerárquica y Excel estilo MEI institucional

### Contexto y objetivos:

Incorporar el feedback de oficina (2026-07-28): error opaco al abrir dimensiones D2.1/D2.2 (típico si falta el catálogo en preview), tablero plano actividad/hito con alturas irregulares, y Excel técnico por hoja H0N en lugar de la plantilla MEI institucional de 4 pestañas.

### Implementación técnica:

- **Carga catálogo:** `repoRoot()` busca `data/mei-calidad-web/catalog.json` vía `LC_REPO_ROOT`, `cwd`, padre y ancestros; `MeiCatalogLoadError` con mensaje accionable; `error.tsx` en `/auditar/mei-calidad-web` y `[dimensionId]`.
- **UI:** `groupItemsByTrimestreAndHito` ancla el trimestre al hito y cuelga actividades por `mei-hitos.actividades` / `excelHitoId`; componentes `MeiTrimestreColumnView` + `MeiHitoGroupCard`; cards con `min-h` y variantes hito/actividad.
- **Excel:** `mei-xlsx-writer.ts` reescrito a pestañas Índice, CheckList, web INAPI, sitio TRAMITES (H01 documental; completo = unión de hitos completados en el mismo formato). Docs: `docs/plantilla-excel-mei-bcd.md`.

### 💡 Repaso técnico: Trimestre del hito vs de la actividad:

Una actividad puede figurar en «Trim 1–2» y su hito en «Trim 2». El tablero usa el trimestre del hito para la columna y vincula la actividad por número MEI, de modo que el Excel del hito y la UI cuentan la misma agrupación.

### Próximos pasos:

- Confirmar en Vercel `LC_REPO_ROOT` o inclusión de `data/` en el build.
- Revisión Equipo UX del XLSX H02 / completo frente a capturas de plantilla.
- No cambiar estados H03+ ni auditar ranks Pendiente TI en esta línea.

---

<a id="devlog-2026-07-28-mei-calidad-web-export-ui"></a>
## [2026-07-28] - Frontend | MEI calidad web: catálogo PTD, export XLSX y UI por hito

**Rama:** `feat/mei-calidad-web-export-ui` | **Entorno:** PC empresa (Windows + Bun)

### Contexto y objetivos:

El Plan de Trabajo Detallado (PTD) de calidad web INAPI exige demostrar avance por actividades e hitos MEI (dimensiones sitio y servicio), con entrega Excel para TI y revisión editorial. Hasta jul-2026 solo existía plantilla manual B/C/D ([`docs/plantilla-excel-mei-bcd.md`](../plantilla-excel-mei-bcd.md)) sin generación desde las 13 auditorías Clarity vigentes. El objetivo fue cerrar en un solo entregable de código: catálogo estructurado, motor XLSX por hito H01–H13 y módulo UI en `/auditar` con descarga condicionada al estado del hito.

### Implementación técnica:

- **Catálogo PTD:** `data/mei-calidad-web/catalog.json` (117 ítems: tareas + hitos, trimestres, estados, `excelHitoId`); schema Zod `src/schemas/mei-calidad-web-catalog.ts`; scripts `validate:mei-catalog` y `generate:mei-catalog`.
- **Motor export (raíz):** `src/lib/mei-export/` — carga 13 JSON desde `clarity-audits-launch.ts` (excluye ranks 8/11/13/15); `mei-hitos.ts` mapea criterios checklist por hito; `mei-row-builder.ts` genera filas desde `sustituciones[]` e incumplimientos CMS; `mei-xlsx-writer.ts` (ExcelJS) produce hojas `00_Indice`, `99_Resumen_URLs` y H01–H13; CLI `bun run export:mei-xlsx`.
- **API Next:** `GET /api/mei-calidad-web/export/[hitoId]/xlsx` y `GET /api/mei-calidad-web/export/completo.xlsx` (`runtime: nodejs`); guard **403** si el hito en catálogo no está `completado`; reutiliza `buildMeiWorkbook` vía alias `@repo/*`.
- **UI:** teaser en `/auditar`; rutas `/auditar/mei-calidad-web` → `[dimensionId]` → `[subdimensionId]` con tablero trimestral (cards tarea+hito, modal detalle, badge de estado); botón Excel solo en hitos `completado` (hoy H01 y H02 en `cl_sitio`).
- **Refactor menor:** `/auditar/page.tsx` pasa a Server Component; formulario URL en `auditar-url-form-card.tsx`; `mei-audit-loader.ts` sin `import.meta.url` para build Turbopack.

### 💡 Repaso técnico: Catálogo vs motor vs guard de exportación:

El catálogo PTD gobierna **qué se puede descargar** (estado editorial); el motor XLSX gobierna **qué filas salen** (auditorías Clarity). Un hito `en_progreso` puede tener hoja técnica en el workbook CLI, pero la API/UI lo bloquean hasta marcarlo `completado` en `catalog.json` — separación intencional entre avance de gestión y evidencia lista para entrega.

### Próximos pasos:

- PR único `feat/mei-calidad-web-export-ui` → `main` (3 commits de código + docs).
- Revisión editorial con Equipo UX sobre filas H01–H02 antes de ampliar hitos completados.
- Opcional: sincronizar estados del catálogo cuando cierren hitos H03+ en el trimestre correspondiente.

---

<a id="devlog-2026-07-27-frontend-historial-auditorias"></a>
## [2026-07-27] - Frontend | Historial versionado de auditorías por URL

**Rama:** `feat/frontend-audit-history` | **Entorno:** WSL2 (PC casa)

### Contexto y objetivos:

Con varias fechas de informe por URL Clarity (junio y julio 2026), el MVP solo mostraba el id **vigente** en `/auditar`. Hacía falta una UI de historial versionado: listar URLs auditadas, ver fechas por URL y abrir informes históricos en `/auditar/resultado`, sin persistencia en base de datos.

### Implementación técnica:

- **`clarity-audits-launch.ts`:** tipos `ClarityAuditVersion` / `historyIds` / `versiones`; mapa `CLARITY_AUDIT_META_BY_ID` (vigente + history); `CLARITY_AUDIT_ID_SET` ampliado a 26 ids Clarity para que la API cargue informes anteriores; helpers `historialHref`, `historialRankHref`, `resultadoClarityHrefForId`, `clarityRowsConHistorial`.
- **Rutas:** `/auditar/historial` (índice con filtro Trámites / Sitio Web) y `/auditar/historial/[rank]` (tabla de fechas, badge Vigente/Anterior, enlace a resultado).
- **Ingreso de URL:** tercer botón «Historial de auditorías» en el `CardFooter` de `/auditar`.
- **Inventario Clarity y ficha:** columna Historial; conteo de auditorías desde `versiones.length` cuando hay JSON real; ficha deja el historial mock y muestra versiones del launch con «Ver historial completo».
- **Consistencia piloto ↔ Clarity:** URLs solapadas (`www.inapi.cl/`, `tramites.inapi.cl/`) en el piloto 9 apuntan a la misma auditoría vigente que Clarity (jul-2026); ids piloto antiguos quedan en `history[]` de `claude-audits-launch.ts`.
- **Workflow documentado:** tras JSON + `ingest:b`, hay que cablear el launch a mano (no automático) — `audit-lote.md` Paso 6, `CLAUDE.md` §12 Paso 4b, `fase-3-3` §4.5.
- Commits atómicos en la rama: capa de datos → pantallas → botón → ficha/inventario → documentación.
- `bun run typecheck:all` y `validate:claude-audits` en verde.

### 💡 Repaso técnico: Allowlist, history e ingest:

Los ids en `history[]` vivían en disco pero no en `CLARITY_AUDIT_ID_SET`; `loadClaudeAuditBundle` devolvía `not_allowed` al abrir un informe de junio. El SET debe ser la unión de vigentes + históricos. **`ingest:b` solo alimenta el RAG** — la tabla `/auditar` y el historial leen el registry TypeScript; sin editar el launch, la UI sigue mostrando la auditoría anterior.

### Próximos pasos:

- Push / PR de `feat/frontend-audit-history` y merge a `main`.
- Opcional: alinear `%` mock de `clarity-fichas-mock.json` con los JSON vigentes (la UI de historial ya prioriza el launch).
- Historial con persistencia real (Supabase) sigue en backlog del ROADMAP, separado de este MVP.

---

<a id="devlog-2026-07-27-fase-3-3-lote-ranks-3-4-10-12-14"></a>
## [2026-07-27] - Infraestructura | Fase 3.3: lote WSL ranks 3, 4, 10, 12, 14 con sesión ClaveÚnica

**Rama:** `feat/audit-wsl-session-lote-3-4-10-12-14` | **Entorno:** WSL2 (PC casa) — Chroma, Playwright y sesión ClaveÚnica

### Contexto y objetivos:

Segunda oleada de la Fase 3.3: re-auditar con sesión autenticada las 5 URLs siguientes en el inventario Clarity (ranks **3, 4, 10, 12 y 14** — `TrademarkFile`, `Notificaciones`, `TrademarkNizaClassifier`, `TrademarkUserDocument`, `TrademarkAnnotation`) usando la arquitectura de sub-subagentes (`.claude/CLAUDE.md` §17) y la calibración G1–G3 para pantallas autenticadas (§19). Continúa el trabajo cerrado el mismo día para ranks 5–7.

### Implementación técnica:

- **Sesión ClaveÚnica renovada:** `auditorias/.auth/tramites-session.json` había expirado (la primera captura de rank 3 devolvió el formulario de `/Account/Login`). Se renovó navegando con Playwright MCP a `/Account/Login`, pidiendo al usuario que iniciara sesión manualmente en ese navegador, y extrayendo el `storageState` del contexto vía `browser_run_code_unsafe` (`page.context().storageState()`) para persistirlo en disco — evita depender de `playwright codegen` interactivo quedando fuera de la sesión de Claude Code.
- Captura de las 5 URLs con `bun run capture:tramites-html` reutilizando la sesión renovada; control de calidad por captura (verificar título/contenido real antes de auditar, lección de rank 7 del lote anterior) — las 5 pasaron sin necesidad de recaptura.
- JSON canónicos en `data/claude-audits/tramites/2026-07-27/` con `clarity_meta`; `frontend/src/lib/clarity-audits-launch.ts` actualizado (nuevo `id` + `history[]` al id `2026-06-11`) para los 5 ranks.
- Resultados: rank 3 → **39,4 %** rechazado (estable); rank 4 → **36,4 %** rechazado (bajó); rank 10 → **41,2 %** rechazado (bajó); rank 12 → **48,4 %** rechazado (no comparable, ver hallazgo); rank 14 → **52,9 %** rechazado (subió levemente). `bun run validate:claude-audits` y `bun run typecheck:all` en verde.
- **Hallazgo de flujo en rank 12:** la URL `/Trademark/TrademarkUserDocument` mostró una pantalla distinta a la de junio — antes «Escritos Guardados de Marcas» (listado), ahora «Presentar Escritos de Marcas» (formulario de búsqueda para iniciar un escrito nuevo). Se documentó explícitamente en el JSON (`observaciones_lc`, `nota_final_tic`) que el % no es comparable 1:1 con la auditoría de junio, y se recomienda a TI confirmar si la ruta cambió de vista por defecto.
- **G1 crítico persistente:** ranks 4 y 14 mantienen el nombre completo del usuario autenticado embebido en el HTML estático del body (navbar/menú de perfil), sin corregir desde junio — mismo patrón ya documentado para rank 7. Rank 3, 10 y 12 no exponen datos de personas naturales en esta captura.
- Correcciones de TI detectadas en el DOM respecto a junio: tilde en «Títulos y Certificados Patentes» (las 5 URLs), varias capitalizaciones de sentencia, opción «Todos» ya presente en algunos selects, nombre institucional del footer sin fragmentar (rank 14). Persisten sin corregir: PCT sin expandir, ausencia de fecha de página, botones «OK»/«Aceptar» en modales, PDFs sin indicar formato — patrones transversales documentados desde el piloto.

### Próximos pasos:

- `bun run rag/ingest-b.ts` para reindexar los 5 JSON nuevos en Colección B (pendiente, a ejecutar por el usuario).
- Commit del lote (JSONs, HTMLs, `clarity-audits-launch.ts`, esta entrada) — pendiente, lo hace el usuario.
- Seguir sin forzar auditoría de ranks 8, 11, 13, 15 (Pendiente TI).
- Evaluar con TI si `/Trademark/TrademarkUserDocument` cambió su vista por defecto (hallazgo rank 12).

---

<a id="devlog-2026-07-27-fase-3-3-lote-ranks-5-7"></a>
## [2026-07-27] - Infraestructura | Fase 3.3: lote WSL ranks 5–7 con sesión ClaveÚnica

**Rama:** `feat/audit-wsl-session-captures` | **Entorno:** WSL2 (PC casa) — Chroma, Playwright y sesión ClaveÚnica

### Contexto y objetivos:

Ejecutar en WSL el primer lote real de la Fase 3.3: reauditar con sesión autenticada las tres URLs post-login (ranks **5, 6 y 7**) usando la arquitectura de sub-subagentes (`.claude/CLAUDE.md` §17) y la calibración G1–G3 para pantallas autenticadas (§19). Completar el circuito documentado en `docs/fase-3-3-captura-auth-claveunica.md` tras el trabajo de documentación del 2026-07-23.

### Implementación técnica:

- Sesión local en `auditorias/.auth/tramites-session.json` (no versionada) y capturas HTML con `bun run capture:tramites-html` para ranks 5–7 (`captura_con_sesion: true`).
- JSON canónicos en `data/claude-audits/tramites/2026-07-27/` con `clarity_meta`; `frontend/src/lib/clarity-audits-launch.ts` actualizado (nuevo `id` + `history[]` al id `2026-06-11`).
- Resultados: rank 5 → **48,4 %** rechazado; rank 6 → **28,1 %** rechazado; rank 7 → **43,3 %** rechazado. `bun run validate:claude-audits` OK.
- **Incidente rank 7:** el HTML inicial de `LoadTrademarkApplication` era una página de error ASP.NET («Error Cargando el formulario.»). Se recapturó con Playwright MCP tras login manual en el navegador del MCP y se sobrescribió `auditorias/htmls/...loadtrademarkapplication_2026-07-27.html`.
- Hallazgos relevantes: rank 5 mejora leve vs junio (filtro «Todos» y tildes); rank 6 empeora por aviso de borradores con enlace «aquí»; rank 7 mantiene G1 alta por RUN del solicitante en HTML estático (mismo patrón que Notificaciones).

### 💡 Repaso técnico: Sesión Playwright MCP vs storageState:

El navegador del MCP de Playwright conserva la sesión ClaveÚnica solo mientras el proceso/contexto del MCP sigue vivo; un `browser_close` la destruye. Para capturas repetibles el flujo canónico sigue siendo `playwright codegen --save-storage=auditorias/.auth/tramites-session.json` + `bun run capture:tramites-html` (`docs/fase-3-3-captura-auth-claveunica.md`).

### Próximos pasos:

- Ejecutar `bun run rag/ingest-b.ts` para reindexar los tres JSON nuevos en la Colección B.
- Commit del lote (JSON, HTML recapturado, `clarity-audits-launch.ts`, ROADMAP y esta entrada).
- No forzar auditoría de ranks 8, 11, 13 y 15 (Pendiente TI).

---

<a id="devlog-2026-07-23-fase-3-3-auth-sesion"></a>
## [2026-07-23] - Documentación | Fase 3.3 — captura autenticada ClaveÚnica y calibración datos de sesión

**Rama:** `feat/audit-remaining-urls` | **Entorno:** PC empresa (documentación) + WSL (implementación pendiente)

### Contexto y objetivos:

Extender el flujo de Fase 3 para auditar pantallas de `tramites.inapi.cl` **tras login ClaveÚnica**, sin tratar los datos personales del solicitante autenticado como incumplimientos graves de G1. Documentar ranks **8, 11, 13, 15** como **Pendiente TI** (sin acceso operativo). Marcar Fases 2 y 3 del ROADMAP como completadas.

### Implementación técnica:

- **`docs/fase-3-3-captura-auth-claveunica.md`** — flujo `storageState`, rol de Chroma vs Playwright, inventario Clarity, WSL vs PC empresa.
- **`.claude/CLAUDE.md` §11, §19** — captura post-login, calibración G1 en sesión, anonimización en JSON.
- **Skills** — `auditoria-lc.md` (inventario y G1 sesión), `auditoria-calidad-web.md`, `pesquisa-criterios.md`, `audit-lote.md`.
- **`src/scripts/capture-tramites-html.ts`** + `bun run capture:tramites-html` — captura HTML con `auditorias/.auth/tramites-session.json`.
- **`auditorias/.auth/`** — README local; `*.json` en `.gitignore`.
- **`data/ux/clarity-fichas-mock.json`** — ranks 8, 11, 13, 15 → `Pendiente TI`.
- **`docs/ROADMAP.md`** — Fases 2–3 marcadas completadas; nueva Fase 3.3.

### Próximos pasos:

- En WSL: crear `tramites-session.json`, capturar ranks 5–7 (re-DOM Playwright) y auditar con §19.
- Coordinación TI para ranks 8, 11, 13, 15.
- Revisar HTML antes de commit para evitar PII en capturas versionadas.

---

<a id="devlog-2026-07-23-fase-3-audit-full-flow"></a>
## [2026-07-23] - Infraestructura | Fase 3 — Flujo completo auditoría con sub-subagentes y lote 5 URLs

**Rama:** `feat/audit-full-flow` | **Entorno:** WSL2 Ubuntu (PC casa)

Cierre de la **Fase 3** del AI Stack v2. Se implementó y validó el flujo completo de auditoría end-to-end: Playwright MCP → RAG MCP → sub-subagentes → JSON canónico → validate:claude-audits.

### Artefactos entregados

- `.cursor/hooks.json` + `.cursor/hooks/validate-audit.sh` — Hook que valida automáticamente JSONs canónicos al guardar en `data/claude-audits/`
- `.claude/prompts/audit-lote.md` — Plantilla reutilizable para auditar lotes de hasta 5 URLs con arquitectura sub-subagentes (§17)

### Smoke test — URL única (rank 1)

| Campo | Valor |
|---|---|
| URL | `https://tramites.inapi.cl/` |
| Flujo | Playwright MCP → RAG MCP (precedente jun-2026) → 39 criterios → JSON |
| Resultado | 60.6% — rechazado |
| validate | ✅ OK |

### Lote 5 URLs — arquitectura sub-subagentes §17

| Rank | URL | % | Estado | validate |
|---|---|---|---|---|
| 2 | `tramites.inapi.cl/Account/Login` | 51.7% | rechazado | ✅ |
| 8 | `tramites.inapi.cl/Login/claveunica` | — | saltada (redirige a ClaveÚnica externo) | — |
| 9 | `tramites.inapi.cl/EstadosDiariosMarcas` | 50.0% | rechazado | ✅ |
| 16 | `www.inapi.cl/` | 54.5% | rechazado | ✅ |
| 17 | `www.inapi.cl/tramites/tramites-digitales` | 41.7% | rechazado | ✅ |

**validate final:** OK — 9 piloto + 18 Clarity validadas

### Calibraciones aplicadas en esta sesión

- **G1:** RUT institucional corregido a `cumple` en rank 16 (contradicción con CLAUDE.md §2 resuelta)
- **A4:** páginas puramente funcionales (formulario/tabla sin bloque editorial) → `no_aplica`
- **F3:** propuesta unificada a «Aceptar» (siguiendo CLAUDE.md §6)
- **rank 17** sin correcciones TIC desde jun-2026 — prioridad próximo sprint

### Próximos pasos

- Fase 4: levantar servidor RAG en TI INAPI y distribuir acceso al equipo
- URLs protegidas (ranks 5–7, 11–13, 15): pendientes de flujo de autenticación
- Calibrar severidad G1, D7, E3 con Equipo UX

---

<a id="devlog-2026-07-22-fase-2-rag-mcp"></a>
## [2026-07-22] - Infraestructura | Fase 2 — Registro MCP RAG Auditoria en Claude Code Pro

**Rama:** `feat/rag-workspace` | **Entorno:** WSL2 Ubuntu (PC casa)

Cierre de la **Fase 2** del AI Stack v2. Se registra el servidor MCP `rag-auditoria` en Claude Code Pro, completando la integración RAG local con Chroma y `@xenova/transformers`. El servidor expone dos herramientas nativas a Claude: `rag_search_normativa` (Colección A) y `rag_search_precedentes` (Colección B).

### Comando ejecutado

```bash
claude mcp add rag-auditoria bun /home/fernando/projects/lc-inapi-app/rag/mcp-server.ts
```

---

<a id="devlog-2026-07-22-fase-1-playwright-mcp"></a>
## [2026-07-22] - Infraestructura | Fase 1 — Registro MCP Playwright en Claude Code Pro

### Contexto y objetivos:

Inicio de la **Fase 1** del procedimiento de implementación del AI Stack v2. El objetivo es registrar el servidor MCP de Playwright en Claude Code Pro para habilitar la captura automatizada de HTML de URLs del inventario Clarity sin intervención manual (Ctrl+U). La Fase 0 está completada y mergeada en `main`; este trabajo se realiza en la rama `feat/playwright-mcp`.

El MCP de Playwright permite que Claude Code Pro navegue URLs reales, ejecute JavaScript del lado del cliente y extraiga el HTML renderizado (DOM completo), resolviendo el problema identificado en la sesión de jun-2026: el HTML capturado con Ctrl+U en `tramites.inapi.cl` no refleja el DOM real inyectado por el servidor ASP.NET MVC.

### Implementación técnica:

- **Comando de registro:**
  ```bash
  claude mcp add playwright npx @playwright/mcp@latest
  ```
- **Config generada:** `~/.claude.json` (local por máquina, no versionada). Referencia en `.claude/CLAUDE.md` §8.
- **Dependencia de sistema:** Chrome no estaba instalado en WSL; se instaló con `npx playwright install chrome` (descarga `google-chrome-stable` 150.0.7871.181 y FFmpeg vía `apt-get`; operación con `sudo`).
- **Directorio de salida:** `auditorias/htmls/` creado con `.gitkeep`; `auditorias/htmls/*.html` y `.playwright-mcp/` agregados a `.gitignore`.

**Prueba de humo — `https://tramites.inapi.cl/` (2026-07-22):**

- HTML capturado: **53,771 bytes, DOM renderizado completo** (JS ejecutado por Chrome headless).
- Confirmación DOM real: navbar con grupos en mayúsculas (`MI INAPI`, `TRAMITACIÓN`, `PAGOS`, `SERVICIOS`), modal TGR («hoy lunes 19 de enero…»), footer con `RUT: 65.999.669-3`, widget Zoho SalesIQ cargado.
- Versión del sistema actualizada: `v 2.3.96.0` (era `v 2.3.89.0` en auditoría de junio 2026).
- `<title>` corregido parcialmente por TI: `INAPI — Portal de Trámites: Marcas, Patentes y máss` — **typo** (`máss` con doble `s`); pendiente corrección en `_Layout.cshtml`.
- Incidencia: Claude guardó el resultado del MCP como string JSON en lugar de HTML puro (comillas envolventes y escapes); corregido en la misma sesión sobreescribiendo con el contenido des-escapado.

### Próximos pasos:

- Fase 2: configurar RAG local con Chroma (`feat/rag-workspace`): `bun install` en `rag/`, levantar Chroma en puerto 8000, ingestar colecciones B y A.

<a id="devlog-2026-07-22-fase-0-claude-skills"></a>
## [2026-07-22] - Estrategia | Fase 0 — CLAUDE.md, 3 skills y arquitectura sub-subagentes (WSL)
### Contexto y objetivos:

Cierre de la **Fase 0** del procedimiento de implementación del AI Stack v2 (definido en `docs/PROPUESTA_TECNICA_INTEGRAL.md`). El objetivo era dotar a Claude Code Pro de contexto permanente del proyecto y conocimiento especializado cargado bajo demanda, sin instalar ninguna dependencia nueva. Trabajo realizado en entorno WSL (Ubuntu), rama `feat/claude-md-skills`.

### Implementación técnica:

**Archivos creados:**

- **`.claude/CLAUDE.md`** (524 líneas, 18 secciones) — contexto permanente del proyecto: dominio, checklist v1.1 con 39 criterios y calibraciones INAPI, contratos JSON canónico, rutas clave, reglas permanentes, patrones sistémicos transversales, stack AI v2, workflows operativos (captura HTML, auditoría completa, generación PDF, lotes con subagentes), comandos de referencia rápida, política `no_aplica`, arquitectura sub-subagentes y seguridad.
- **`.claude/skills/auditoria-lc.md`** (241 líneas) — skill especializada en auditoría de lenguaje claro: los 39 criterios con su calibración INAPI real (extraída de los 9 JSONs canónicos del piloto), patrones sistémicos de `_Layout.cshtml`, umbrales de aceptación, fases de inventario/evaluación/validación, y grupos de sub-subagentes.
- **`.claude/skills/pesquisa-criterios.md`** (178 líneas) — skill de consulta al RAG MCP: guía de uso de colecciones A (normativa) y B (precedentes), queries recomendadas, flujo combinado A+B con ejemplo de comentario fundamentado, y fallback sin RAG con `rg`/`jq`.
- **`.claude/skills/auditoria-calidad-web.md`** (168 líneas) — skill de marco normativo: mapa de los 6 documentos normativos (CW 2.0, RLC, Meta MEI, IEW, IESD, UI Kit Gobierno), tabla `source → criterio` para los 39 criterios, contexto INAPI por `tipo_pagina` y guías de citas en JSON.

**Arquitectura de sub-subagentes:**

Se definió y documentó la arquitectura de **5 grupos temáticos** para el análisis robusto por sección del checklist dentro de cada URL auditada. Aplica desde Fase 3 con Playwright MCP + RAG MCP activos:

| Grupo | Secciones | Criterios |
|---|---|---|
| 1 — Estructura y Objetividad | A + E | A1–A5, E1–E4 |
| 2 — Lenguaje y Redacción | B + C | B1–B7, C1–C7 |
| 3 — Mecánica | D | D1–D7 |
| 4 — Enlaces | F | F1–F5 |
| 5 — Datos y Archivo | G + H | G1–G3, H1 |

**Documentación actualizada:**

- `docs/ARCHITECTURE.md` — Capa 4 describe los 5 grupos de sub-subagentes.
- `docs/ROADMAP.md` — Fase 3 incluye ítem de sub-subagentes y consolidación.
- `docs/PROPUESTA_TECNICA_INTEGRAL.md` — Fase 3 desglosa 6 pasos.

### Próximos pasos:

- Merge `feat/claude-md-skills` → `main` (PR con los 7 commits de Fase 0).
- Fase 1: registrar Playwright MCP en Claude Code Pro (`claude mcp add playwright npx @playwright/mcp@latest`) y probar captura de una URL del inventario Clarity.
- Rama: `feat/playwright-mcp`.

---

<a id="devlog-2026-07-21-ai-stack-v2"></a>
## [2026-07-21] - Documentación | AI Stack v2 — ADR-0008/0009/0010, ARCHITECTURE, PROPUESTA y ROADMAP (PC empresa)
### Contexto y objetivos:

Sesión de documentación realizada en el PC de la empresa (sin acceso WSL) para alinear todo el repositorio con el **AI Stack v2** acordado: TypeScript + Bun, Claude Code Pro como orquestador, Playwright MCP, Chroma RAG local con `@xenova/transformers`. Los ADRs anteriores de NestJS (0005) y Python/AWS (0006) quedaban huérfanos sin documentación de reemplazo; la arquitectura real no reflejaba las decisiones tomadas desde junio 2026.

### Implementación técnica:

**ADRs nuevos:**

- **`docs/adr/0008-typescript-sobre-python-para-rag.md`** — justifica TypeScript + Bun sobre Python para la capa RAG; LangChain.js, Chroma, `@xenova/transformers`.
- **`docs/adr/0009-claude-code-pro-como-orquestador.md`** — documenta Claude Code Pro como orquestador principal sin API de pago; CLAUDE.md, Skills, Subagents, Hooks, MCP servers (Playwright y RAG).
- **`docs/adr/0010-rag-local-chroma-xenova-transformers.md`** — especifica las dos colecciones Chroma aisladas (A normativa / B repo), modelo de embeddings multilingüe, scripts de ingesta y workspace `rag/`.

**ADRs marcados como supersedidos:**

- `docs/adr/0005-api-backend-nestjs-prisma.md` → supersedido por ADR-0009.
- `docs/adr/0006-lc-evaluation-python-claude-aws.md` → supersedido por ADR-0008 y ADR-0009.

**Documentos reescritos:**

- **`docs/ARCHITECTURE.md`** — diagrama de 5 capas del AI Stack v2; tabla de componentes por capa.
- **`docs/PROPUESTA_TECNICA_INTEGRAL.md`** — v2.0 con el procedimiento de implementación en Fases 0–4.
- **`docs/ROADMAP.md`** — reemplaza fases desactualizadas (Python/NestJS/AWS) por el procedimiento Fases 0–4.
- **`docs/despliegue/despliegue-hibrido.md`** — plan de despliegue Etapas 2–4 hacia servidor TI INAPI.
- **`docs/SECURITY.md`** — sección de garantías del stack local IA (Fases 0–4).
- **`README.md`** — tabla de ADRs completa y nuevo próximo paso.

**Otros cambios:**

- `docs/adr/0004-llm-checklist-evaluation-and-versioning.md` — nota de actualización sobre Playwright y Claude Code Pro.
- `.gitignore` — `rag/chroma_db/` y `documentos/` añadidos.

### Próximos pasos (al volver al entorno WSL):

- Crear rama `feat/claude-md-skills` y ejecutar Fase 0: `CLAUDE.md` + 3 skills.

---

<a id="devlog-2026-06-28-stack-orquestacion-mei"></a>
## [2026-06-28] - Documentación | Stack orquestación auditoría — DOM, DevTools, Excel MEI y hito 30-jun
### Contexto y objetivos:

Tras conversación con equipo TI (implementación en Trámites) y alineación con Equipo UX sobre entrega MEI (30-jun-2026), se documentó el problema **Ctrl+U vs DOM vs código fuente TI**, el rol complementario **DevTools IA vs Claude Proyecto**, y un flujo en 6 pasos con entregables duales: Excel B/C/D (humano) + JSON MVP (sistema).

### Implementación técnica:

- **Nuevo:** [`docs/stack-orquestación.md`](../stack-orquestación.md) — arquitectura Agente–Analista–Validador, 6 pasos, herramientas (MCP, Playwright, Cursor SDK), hitos MEI, plan hasta 30-jun.
- **Nuevo:** [`docs/plantilla-excel-mei-bcd.md`](../plantilla-excel-mei-bcd.md) — columnas, TSV de ejemplo (URL Clasificador / Trámites), reglas y puente Excel → `sustituciones[]`.
- **Actualizado:** [`docs/flujo-piloto-10-urls-claude-mvp.md`](../flujo-piloto-10-urls-claude-mvp.md) — §3.6 DevTools + **Prompt maestro v2** (§3.6.1); nota en §3.2 sobre `fragmento_busqueda` vs `html_linea_aprox`.
- **Actualizado:** [`docs/ROADMAP.md`](../ROADMAP.md) — pendientes MEI y re-auditoría Trámites con DOM.

### Aprendizajes:

- Línea HTML en Ctrl+U no es ancla fiable en Trámites (JS inyectado en BE).
- DevTools IA encuentra hallazgos B/C/D que Claude con Ctrl+U puede omitir (duplicados desktop/mobile, typos en `<title>`).
- Checklist completo no debe re-pegarse en cada sesión; prioridad MEI y fragmento único reducen fricción con TI.

### Próximos pasos:

- Ejecutar Prompt §3.6.1 en URLs Trámites prioritarias; llenar Excel con Equipo UX.
- Post-MEI: extender schema `claudeSustitucionSchema` con `fragmento_busqueda` opcional; script Playwright de captura DOM.

### Actualización 2026-06-27

- Prompt maestro v2 calibrado con **home INAPI** (`https://www.inapi.cl/`, `sitioweb`, `27-06-2026`) y checklist **v2.0** en §3.6.1 del flujo y §4 de stack-orquestación.

---

<a id="devlog-2026-06-11-clarity-cierre-oleada-auditable"></a>
## [2026-06-11] - Estrategia | Cierre oleada auditable Clarity — inventario 17 URLs y ranks 14 y 17
### Contexto y objetivos:

Cerrar la primera oleada auditable de la serie Clarity tras comprimir el inventario editorial de 22 a 17 ranks (eliminación de duplicados y filas repetidas), incorporar los JSON de los ranks **14** (`TrademarkAnnotation`) y **17** (`www.inapi.cl/tramites/tramites-digitales`) y dejar cableado el launch en `/auditar`. Los ranks **8** (Login ClaveÚnica) y **11** (SuccessConfirmation escritos) quedan fuera por falta de acceso al HTML; el rank **13** (modal de confirmación de pago) no es auditable con Ctrl+U; el rank **15** (Renovación de marca) queda pendiente para otra sesión.

### Implementación técnica:

- **`data/claude-audits/urls-clarity/`:** 13 JSON con `clarity_meta` — últimos añadidos: `tramites-inapi-cl-trademark-trademarkannotation_2026-06-11` (50,0 % LC) y `www-inapi-cl-tramites-tramites-digitales_2026-06-11` (41,7 % LC, el más bajo de la serie).
- **Inventario:** `clarity-fichas-mock.json` y `clarity-inventory.json` reestructurados a 17 filas; esquema `clarity_meta.rank` con `max(17)` en `claude-audit-pilot.ts`.
- **Launch:** `clarity-audits-launch.ts` registra los 13 ranks con informe; tabla Historial enlaza a `/auditar/resultado?claudeAudit=`.
- **CI:** `validate:claude-audits` valida piloto (9) + Clarity (13 ids).

### Próximos pasos:

- Rank **15** Renovación de marca (requiere sesión en tramites.inapi.cl).
- Ranks **8** y **11** cuando exista acceso al HTML de esas pantallas.
- Sincronizar documentación (`flujo-piloto`, `inventario-urls-clarity`, ROADMAP) de referencias a 22 URLs hacia el inventario de 17.

---

<a id="devlog-2026-06-15-clarity-cableado-mvp"></a>
## [2026-06-15] - Frontend | Serie Clarity: cableado MVP en `/auditar` y validación CI
### Contexto y objetivos:

Tras generar los primeros JSON en `data/claude-audits/urls-clarity/` ([entrada 2026-06-11](#devlog-2026-06-11-serie-clarity-json)), el objetivo del día era **conectar** el inventario de 22 URLs en `/auditar` con el mismo flujo operativo del piloto de 9 URLs: tabla → resultado con siete bloques → PDF, sin duplicar lógica de render. Rama: `feature/clarity-22-urls-auditorias-claude-json`.

### Implementación técnica:

**Frontend `/auditar`:**

- [`frontend/src/app/auditar/page.tsx`](../../frontend/src/app/auditar/page.tsx) — eliminada tarjeta «Prioridades demostrativas LC»; orden: Ingreso → Piloto 9 URLs → Historial Clarity (22) → Importar JSON.
- [`frontend/src/lib/clarity-audits-launch.ts`](../../frontend/src/lib/clarity-audits-launch.ts) — registro de 22 filas desde `CLARITY_FICHAS_MOCK`; `claudeAuditId` y `resumenMvp` para ranks con JSON (1–4 y 21).
- [`frontend/src/components/clarity-inventory-historial-table.tsx`](../../frontend/src/components/clarity-inventory-historial-table.tsx) — columna Informe (`Pendiente` / enlace Ver informe → `?claudeAudit=`).
- [`frontend/src/lib/load-claude-audit-bundle.ts`](../../frontend/src/lib/load-claude-audit-bundle.ts) — allowlist unión piloto ∪ Clarity; lectura desde `urls-clarity/`.
- [`frontend/src/app/auditar/resultado/page.tsx`](../../frontend/src/app/auditar/resultado/page.tsx) — conserva `clarity_meta` en bundle; muestra rank y visitas en Datos de Auditoría.

**Datos (serie Clarity, 5 JSON):**

| Rank | `id` | % LC |
| --- | --- | --- |
| 1 | `tramites-inapi-cl_2026-06-11` | 57,6 % |
| 2 | `tramites-inapi-cl-account-login_2026-06-11` | 53,3 % |
| 3 | `tramites-inapi-cl-trademark-trademarkfile_2026-06-11` | 40,0 % |
| 4 | `tramites-inapi-cl-notificaciones_2026-06-11` | 41,2 % |
| 21 | `www-inapi-cl_2026-06-11` | 45,5 % |

**CI y documentación:**

- [`src/scripts/validate-claude-audits.ts`](../../src/scripts/validate-claude-audits.ts) — valida piloto + `urls-clarity/` (exige `clarity_meta`).
- [`docs/flujo-piloto-10-urls-claude-mvp.md`](../flujo-piloto-10-urls-claude-mvp.md) — checklist §7 y §3.5 actualizados al cableado MVP.

### Próximos pasos:

- JSON rank **5** (`TrademarkSavedApplications`) y ranks **6–20** y **22** vía Proyecto Claude (§3.5).
- Actualizar `porcentajeLcRef` en `clarity-fichas-mock.json` con % reales de auditorías Claude donde existan.
- Decisión sobre ruta `/auditar/inventario/clarity/[rank]` (sigue existiendo; la tabla ya enlaza a resultado).

---

<a id="devlog-2026-06-11-serie-clarity-json"></a>
## [2026-06-11] - Estrategia | Serie Clarity: auditorías JSON ranks 1–3 y 21 (día en PC empresa)
### Contexto y objetivos:

Continuar la **Fase 1.5** ampliando el piloto de 9 URLs hacia el **inventario Clarity de 22 URLs** (`/auditar`, acordeón Historial). Objetivo del día (PC empresa, sin WSL): generar JSON canónicos vía Proyecto Claude con el **mismo contrato** del piloto (7 bloques en `/auditar/resultado`), en carpeta `data/claude-audits/urls-clarity/`, sin cableado de frontend (pendiente en casa). Rama: `feature/clarity-22-urls-auditorias-claude-json`.

### Implementación técnica:

**Documentación:**

- [`docs/flujo-piloto-10-urls-claude-mvp.md`](../flujo-piloto-10-urls-claude-mvp.md) — nueva **§3.5** (prompts §3.5.1 entrada y §3.5.2 salida para Clarity), checklist serie 22 URLs, mapeo `clarity_meta` en §6.

**Esquema:**

- [`src/schemas/claude-audit-pilot.ts`](../../src/schemas/claude-audit-pilot.ts) — `clarityAuditMetaSchema`, extensión opcional `clarity_meta` en `parseClaudeAuditFile` (rank, visitas, etiquetas UI, `fuente_piloto_id`).

**JSON en `data/claude-audits/urls-clarity/` (4 archivos):**

| Rank | URL | `id` | Origen | % LC |
| --- | --- | --- | --- | --- |
| 1 | `https://tramites.inapi.cl/` | `tramites-inapi-cl_2026-06-11` | Claude §3.5.1→§3.5.2 | 57,6 % |
| 2 | `https://tramites.inapi.cl/Account/Login` | `tramites-inapi-cl-account-login_2026-06-11` | Claude §3.5.1→§3.5.2 | 53,3 % |
| 3 | `https://tramites.inapi.cl/Trademark/TrademarkFile` | `tramites-inapi-cl-trademark-trademarkfile_2026-06-11` | Claude §3.5.1→§3.5.2 | 40,0 % |
| 21 | `https://www.inapi.cl/` | `www-inapi-cl_2026-06-11` | Claude §3.5.1→§3.5.2 | 45,5 % |

### Próximos pasos:

- Cableado MVP en casa: `clarity-audits-launch.ts`, tabla Historial → `/auditar/resultado` y PDF.
- JSON ranks 4–20 y 22 vía Proyecto Claude (§3.5).
- Ampliar `validate:claude-audits` a `urls-clarity/`.

---

<a id="devlog-2026-06-08-docs-fase-1-5"></a>
## [2026-06-08] - Documentación | Sincronización Fase 1.5 — 9 URLs en MVP, merge `main`, CI y Vercel
### Contexto y objetivos:

Tras verificar en **local y Vercel** el flujo completo de las **9 URLs** piloto (tabla `/auditar` → `/auditar/resultado` → PDF) y el **merge a `main`**, los documentos en `docs/` seguían reflejando el estado de junio 2026-02 (Fase 1.5 «pendiente de implementar»). Objetivo: alinear ROADMAP, flujo operativo, PRD, arquitectura, propuesta y despliegue con el estado real del repo.

### Implementación técnica:

**Documentos actualizados:**

- [`docs/ROADMAP.md`](../ROADMAP.md) — Fase 1.5: ítems de código marcados hechos; pendientes editoriales (UX/TIC, acta, 10.ª URL) y `validate:claude-audits` opcional.
- [`docs/flujo-piloto-10-urls-claude-mvp.md`](../flujo-piloto-10-urls-claude-mvp.md) — §2 tabla operativa 9 URLs; checklist §7 dividido implementación/entrega; ruta PDF `GET` real; propuesta reunión en `<details>` histórico.
- [`docs/PRD.md`](../PRD.md), [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md) §1.2.1, `Propuesta Análisis LC URLs.md` *(retirado 2026-08)* §2.3 — estado 2026-06-08.
- [`docs/despliegue/despliegue-hibrido.md`](../despliegue/despliegue-hibrido.md) — Etapa 1.4 verificación piloto Vercel; APIs `claude-audits`.
- `docs/sesion-piloto-claude-2026-06-05.md` *(retirado 2026-08)* — nota histórica al inicio.
- `Comparación Auditoría…` *(retirado 2026-08)* — metadatos piloto 9 URLs.

**Enlace corregido:** referencias `development/DEVLOG.md` → `docs/development/DEVLOG.md` en flujo operativo.

### Próximos pasos:

- Cierre editorial Fase 1.5: revisión Equipo UX, entrega TIC, acta breve.
- (Opcional código) `validate:claude-audits` + CI; copy UI «10 URLs» → «9 URLs».
- Decisión 10.ª URL vs cierre piloto en 9.

---

<a id="devlog-2026-06-07-piloto-cierre-9-urls"></a>
## [2026-06-07] - Estrategia | Fase 1.5: cierre piloto Claude — JSON URLs 4–9, SIAC y landing `tramites.inapi.cl`
### Contexto y objetivos:

Continuación del [bloque matinal del 7-jun (URLs 1–3)](#devlog-2026-06-07-piloto-json-claude): completar el **piloto operativo de 9 URLs** acordado con UX/TIC — auditorías LC v1.1 vía Proyecto Claude (§3.1 → revisión aritmética y cobertura 1:1 → §3.2), JSON canónico en `data/claude-audits/` y registro en `frontend/src/lib/claude-audits-launch.ts` para tabla `/auditar`, API `GET /api/claude-audits/[id]` y [PDF](#devlog-2026-06-04-fase-c-pdf).

Objetivos de la tarde: auditar y cerrar **URLs 4–9**, unificar nomenclatura de `id` (slug desde URL canónica + fecha), y dejar las nueve filas del piloto con `claudeAuditId` y `resumenMvp`. Encargado: equipo de desarrollo.

### Implementación técnica:

**Flujo editorial (Proyecto Claude, URLs 4–9):**

- §3.1 con HTML Ctrl+U + checklist v1.1 (39 criterios A1–H1).
- Revisión manual: conteos, % sobre aplicables, cobertura 1:1 `incumple` → `sustituciones[]`, calibración G1 (RUT institucional) y E3 (fecha visible de la página).
- §3.2 reemisión cuando Claude entregaba JSON en la primera corrida o había errores narrativos (conteos en `texto_propuesto`, filas duplicadas E4, fila T100/E3 incoherente en SIAC, PCT sin fila en B3, etc.).
- Plantilla obligatoria: `data/claude-audits/www-inapi-cl_2026-06-02.json`.

**Datos — `data/claude-audits/` (URLs 4–9, 7-jun-2026):**

| # | Página | URL | `tipo_pagina` | `id` | % LC | Estado |
| --- | --- | --- | --- | --- | --- | --- |
| 4 | Acerca de INAPI | `www.inapi.cl/acerca-de/inapi` | sitioweb | `www-inapi-cl-acerca-de-inapi_2026-06-07` | 34,3 % | rechazado |
| 5 | Buscador de noticias | `www.inapi.cl/buscador?…noticias` | sitioweb | `www-inapi-cl-buscador-noticias_2026-06-07` | 34,5 % | rechazado |
| 6 | Solicitud Nueva | `www.inapi.cl/marcas/tramites/solicitud-nueva` | sitioweb | `www-inapi-cl-marcas-tramites-solicitud-nueva_2026-06-07` | 44,8 % | rechazado |
| 7 | Sala de Prensa | `www.inapi.cl/sala-de-prensa/noticias` | sitioweb | `www-inapi-cl-sala-de-prensa-noticias_2026-06-07` | 45,5 % | rechazado |
| 8 | Formulario Contacto SIAC | `tramites.inapi.cl/siac` | tramites | `tramites-inapi-cl-siac_2026-06-07` | 51,5 % | rechazado |
| 9 | Trámites y Servicios (landing) | `tramites.inapi.cl/` | tramites | `tramites-inapi-cl_2026-06-07` | 57,6 % | rechazado |

Todas las URLs del piloto (1–9) quedan **rechazadas** (≤80 %). Mejores resultados: URL 9 (57,6 %) y URL 8 (51,5 %). Patrones sistémicos en `tramites.inapi.cl`: mayúsculas en menú (D7), `v 2.3.89.0` en footer (A5), PDF sin «(PDF)» (F4), PCT sin definir (B3).

**URL 8 — nomenclatura `id`:** slug `tramites-inapi-cl-siac_2026-06-07` (archivo, campo `"id"` y `claudeAuditId` en launch).

**URL 9:** §3.2 con 29 filas, 14 incumplimientos; ajustes A3 (H4→H3), D1 «Titulos» en L900, modal TGR `(desactivar modal TGR)`.

**Frontend — `claude-audits-launch.ts`:** filas 4–9 con `resumenMvp`; `CLAUDE_AUDIT_ID_SET` con los 9 ids.

### Contexto de errores o disyuntivas:

- Intermitencia del harness del agente en Cursor tras update (`Execution backend unavailable`); el repo y la terminal local estaban bien.
- Enlace DEVLOG en flujo piloto corregido a `docs/development/DEVLOG.md` (2026-06-08).

### Próximos pasos:

- Revisión Equipo UX: sustituciones aprobadas, falsos positivos G1/D7.
- `bun run validate:claude-audits` antes de commit.
- Commit + PR; actualizar §2 de `flujo-piloto-10-urls-claude-mvp.md`.
- §3.3 HTML corregido opcional; demo/PDF a TIC.

---

<a id="devlog-2026-06-07-piloto-json-claude"></a>
## [2026-06-07] - Frontend | Fase 1.5: piloto Claude — JSON URLs 1–3, prompt §3.2 y conexión en tabla `/auditar`
### Contexto y objetivos:

Tras cerrar la [exportación PDF (Fase C)](#devlog-2026-06-04-fase-c-pdf), el siguiente hito del piloto TIC es **contenido editorial real** en `data/claude-audits/`, no solo la home de junio. El viernes 5 (PC empresa, sin terminal ni git) se avanzó el **piloto operativo de 9 URLs** (8 `sitioweb` + 1 `tramites`), distinto de la tabla §2 inicial del flujo (10 URLs propuesta reunión 2-jun).

Objetivos de la sesión: (1) **Fase A** — reforzar el prompt §3.2 (cobertura 1:1 incumple→sustitución, E3 ausencias, G1 institucional, un `criterio_id` por fila); (2) completar o revisar JSON canónicos de **URLs 1–3** vía Proyecto Claude; (3) en casa, **registrar URLs 2 y 3** en el MVP para que `/auditar`, la API y el PDF las expongan como «Disponible». Bitácora detallada: `docs/sesion-piloto-claude-2026-06-05.md` *(retirado 2026-08)*.

### Implementación técnica:

**Documentación (Fase A — empresa):**

- **`docs/flujo-piloto-10-urls-claude-mvp.md`:** §3.1 verificación 1:1 al cerrar; §3.2 ampliado — `texto_propuesto` opcional frente a `sustituciones[]`, cobertura 1:1 obligatoria, tipos sustitución/inserción/eliminación, E3 con `original: "(ausencia)"`, calibración G1 (RUT institucional), `html_linea_aprox` en `<head>` e inserciones.
- **`docs/Comparación Auditoría URL Home INAPI Gemini-Claude.md`:** §9 alineado a §3.2 (G1/E3 con fila en sustituciones aunque sea ausencia o dato institucional).
- **`docs/sesion-piloto-claude-2026-06-05.md`:** resumen ejecutivo, prompts §3.2 URL 3, checklist de archivos y pendientes.

**Datos — `data/claude-audits/` (validados con `parseClaudeAuditFile` + `strictAuditRecordSchema`):**

| # | Página | `id` | % LC | Incumple | Sustituciones | Cobertura 1:1 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Home INAPI | `www-inapi-cl_2026-06-02` | 45,5 % | 18 | 35 | OK |
| 2 | Buscador Marcas | `buscadormarcas-inapi-cl-marca-buscar-marca_2026-06-05` | 39,4 % | 20 | 44 | OK |
| 3 | Marcas `/marcas` | `www-inapi-cl-marcas_2026-06-05` | 48,5 % | 17 | 34 | OK |

- **URL 1:** JSON home actualizado (cobertura 1:1 tras segunda corrida; alternativas editoriales T220/T522 aceptadas para UX; ajustes F4 Teletrabajo, resumen con 35 filas).
- **URL 2:** flujo §3.1 → revisión aritmética → §3.2; archivo definitivo 5-jun.
- **URL 3:** §3.1 en empresa; §3.2 en casa — JSON con un solo `criterio_id` por fila (separación de filas que mezclaban A2+A5, D1+C1, etc.), E3 inserción de fecha, F4 PDFs carrusel, E4 title ampliado.

**Frontend — conexión MVP (casa, 7-jun):**

- **`frontend/src/lib/claude-audits-launch.ts`:** tabla reducida a **9 filas** piloto (`pilotoNum` 1–9); filas 1–3 con `claudeAuditId` y `resumenMvp` (home, buscador marcas, marcas); filas 4–9 placeholder «Por definir» / `claudeAuditId: null` hasta cerrar lista con UX. `CLAUDE_AUDIT_ID_SET` y API/PDF incluyen automáticamente los tres ids.
- Sin cambios en rutas ni componentes de resultado: el mismo flujo `?claudeAudit=` + [PDF](#devlog-2026-06-04-fase-c-pdf) aplica a las tres URLs.

**No aplicado (decisión explícita):** Opción B nomenclatura `piloto-NN_…` (postergada; requiere renombrar JSON + TS + git). Script `validate:claude-audits` en CI (C7) sigue pendiente.

### 💡 Repaso técnico: triple coincidencia de `id`:

| Lugar | Ejemplo URL 3 |
| --- | --- |
| Archivo | `data/claude-audits/www-inapi-cl-marcas_2026-06-05.json` |
| Campo `"id"` en JSON | `www-inapi-cl-marcas_2026-06-05` |
| `claudeAuditId` en launch + query | `?claudeAudit=www-inapi-cl-marcas_2026-06-05` |

`load-claude-audit-bundle.ts` solo sirve ids ∈ `CLAUDE_AUDIT_ID_SET`; registrar en `CLAUDE_PILOT_URL_ROWS` es obligatorio para API, tabla y PDF.

### Próximos pasos:

- URLs **4–9:** mismo flujo §3.1 → revisión → §3.2; plantilla obligatoria `www-inapi-cl_2026-06-02.json`.
- Cerrar lista exacta de 9 URLs con Equipo UX y alinear §2 de `flujo-piloto-10-urls-claude-mvp.md`.
- Commit + PR: docs sesión, JSON 1–3, `claude-audits-launch.ts`.
- **C7 (opcional):** `validate:claude-audits` en `package.json` y CI.
- Opción B nomenclatura o mantener convención `slug-url_YYYY-MM-DD`.

---

<a id="devlog-2026-06-04-fase-c-pdf"></a>
## [2026-06-04] - Frontend | Fase 1.5: exportación PDF del informe piloto (Fase C)
### Contexto y objetivos:

Con la [orquestación §4 en pantalla](#devlog-2026-06-04-resultado-orquestacion-codigo) y la [tabla de 10 URLs](#devlog-2026-06-04-auditar-tabla-piloto) operativas, faltaba el entregable de demo y TIC del flujo [`docs/flujo-piloto-10-urls-claude-mvp.md`](../flujo-piloto-10-urls-claude-mvp.md) §8: **descargar un informe PDF** con los mismos bloques 1–7 que en `/auditar/resultado`, generado en servidor sin depender del «Guardar como PDF» del navegador.

Objetivo: cerrar el ítem **2.6** (Fase C) — `@react-pdf/renderer`, ruta de exportación con la misma allowlist que `GET /api/claude-audits/[id]`, y botón **«Descargar informe PDF»** visible solo en informe piloto con `claudeAudit=` en la URL.

### Implementación técnica:

- **C0 — Dependencia:** `@react-pdf/renderer` en `frontend/package.json` (y `bun.lock` en raíz del monorepo).
- **C1 — Lectura y formato compartidos:** `frontend/src/lib/load-claude-audit-bundle.ts` (lectura de `data/claude-audits/{id}.json`, `parseClaudeAuditFile`, errores tipados, `CLAUDE_AUDIT_ID_SET`); refactor de `frontend/src/app/api/claude-audits/[claudeAuditId]/route.ts` para reutilizar el helper; `frontend/src/lib/informe-piloto-format.ts` (`formatFechaEvaluacion`, `labelTipoPagina`) reexportado desde `resultado-claude-pilot-sections.tsx` para no acoplar PDF a `"use client"`.
- **C2 — Nombre de archivo:** `frontend/src/lib/informe-piloto-filename.ts` — slug desde `audit.url`, fecha `YYYY-MM-DD` (zona Chile), sanitización y `contentDispositionAttachment` para `Content-Disposition` (p. ej. `informe-lc-inapi-cl_2026-06-03.pdf`).
- **C3 — Documento PDF:** `frontend/src/lib/pdf/informe-piloto-pdf-styles.tsx` (cabeceras `#0F69C4`, estilos de tabla y listas; extensión `.tsx` por JSX en `PdfSectionBar`); `frontend/src/lib/pdf/informe-piloto-pdf-document.tsx` — componente `InformePilotoPdfDocument` con bloques 1–7 expandidos (sin acordeones): Datos de Auditoría, Resumen, Pasos (`PASOS_SEGUN_ESTADO`), 39 criterios (catálogo + `presentacionCriterio` / severidad), observaciones por severidad, tabla `sustituciones`, nota TI; reutiliza helpers de pantalla, no duplica JSX web.
- **C4 — Ruta servidor:** `frontend/src/app/api/claude-audits/[claudeAuditId]/export/pdf/route.tsx` — `GET`, `export const runtime = "nodejs"`, `renderToBuffer` + `InformePilotoPdfDocument`, respuesta `application/pdf` con `Uint8Array(buffer)` (compatibilidad `Response` / TypeScript); mismos códigos HTTP que el GET JSON (`404` allowlist / no encontrado, `500` schema).
- **C5 — UI:** `frontend/src/app/auditar/resultado/page.tsx` — en `CardFooter`, enlace primario a `/api/claude-audits/{id}/export/pdf` cuando `esInformePiloto && claudeAuditId`; «Nueva auditoría» en `outline` después.
- **C6 — Verificación:** `bun run typecheck:all`, `bun run lint` y `bun run build` sin errores; ruta dinámica listada en build (`ƒ /api/claude-audits/[claudeAuditId]/export/pdf`); prueba manual home (`www-inapi-cl_2026-06-02`), cabeceras `200` + `content-disposition: attachment`, PDF legible con los siete bloques; id inválido → `404` JSON.

**Desvío documentado respecto al flujo §8:** el doc menciona `POST /api/audits/export/pdf`; en el MVP la exportación es **`GET /api/claude-audits/[claudeAuditId]/export/pdf`** (misma fuente de datos y allowlist que la API piloto). No se aplicó `serverExternalPackages` en `next.config.ts` porque el build de producción pasó sin ello.

### 💡 Repaso técnico: flujo piloto hasta PDF:

| Paso | Usuario | Sistema |
| --- | --- | --- |
| 1 | Expande tabla en `/auditar` | Fila home «Disponible» → `?claudeAudit=…&url=…` |
| 2 | Revisa informe | `GET /api/claude-audits/[id]` → bundle `{ audit, pilot }` |
| 3 | Descarga PDF | `GET …/export/pdf` → mismo bundle → `renderToBuffer` |
| 4 | Mock sin `claudeAudit` | Sin botón PDF (solo piloto con JSON en repo) |

### Próximos pasos:

- Abrir PR de Fase 1.5 (Fase B + Fase C) o merge de rama `feature/fase-1-5-implementacion-auditorias-claude-urls`.
- Actualizar en docs de producto el §8 del flujo con la ruta `GET` real (opcional en el mismo PR).
- **C7 (opcional):** script `validate:claude-audits` en raíz + CI (flujo §1.6; aún no existe en `package.json`).
- JSON URLs 4–9 y filas en `CLAUDE_PILOT_URL_ROWS` — ver [sesión 2026-06-05](#devlog-2026-06-05-piloto-json-claude) (URLs 1–3 ya en repo y MVP).
- Pulido UX: triggers de acordeón con cabecera `#0F69C4` (§15.1 design system).

---

<a id="devlog-2026-06-04-auditar-tabla-piloto"></a>
## [2026-06-04] - Frontend | Fase 1.5: tabla piloto de 10 URLs en `/auditar`
### Contexto y objetivos:

Con la API (`GET /api/claude-audits/[id]`) y el informe en [`/auditar/resultado`](../flujo-piloto-10-urls-claude-mvp.md) ya orquestado según §4, faltaba el acceso operativo desde el ingreso de URL: la demo y la entrega TIC asumen expandir **«URLs auditadas — piloto junio 2026»** y abrir cada informe sin copiar ids ni queries a mano.

Objetivo: cerrar el ítem **2.3** del plan técnico (Fase B) — tabla/acordeón bajo el formulario de URL, alimentada por [`frontend/src/lib/claude-audits-launch.ts`](../../frontend/src/lib/claude-audits-launch.ts), con estado por fila según exista JSON en `data/claude-audits/`.

### Implementación técnica:

- **`frontend/src/lib/claude-audits-launch.ts`:** tipo `ClaudePilotUrlRow` y arreglo `CLAUDE_PILOT_URL_ROWS` (10 filas según §2 del flujo; filas 2–10 con `claudeAuditId: null` hasta tener JSON). `resumenMvp` opcional en fila 1 (home: 45,5 %, rechazado, fecha, encargado) para no hacer fetch en `/auditar`. `CLAUDE_AUDIT_LAUNCHES` y `CLAUDE_AUDIT_ID_SET` se derivan solo de filas con id en repo; helper `pilotRowDisponibleEnMvp(row)`.
- **`frontend/src/components/auditar-claude-pilot-section.tsx`:** tarjeta «Piloto auditoría LC — 10 URLs (entrega TIC)» + acordeón «URLs auditadas — piloto junio 2026»; tabla con columnas #, Página (etiqueta + URL), Tipo, % LC, Estado (`CeldaEstadoLcAceptacion`), Última evaluación (`formatFechaEvaluacion`), Encargado, MVP («Disponible» / «Pendiente»).
- **Navegación:** filas disponibles enlazan a `/auditar/resultado?claudeAudit={id}&url={url}`; filas pendientes sin enlace (solo texto).
- **`frontend/src/app/auditar/page.tsx`:** `<AuditarClaudePilotSection />` insertado **debajo** de «Ingreso de URL» y **antes** de prioridades mock / import JSON / inventario 22 URLs (§1.1 del flujo).

### 💡 Repaso técnico: disponibilidad en MVP:

| Condición | UI |
| --- | --- |
| `claudeAuditId` en fila y id ∈ `CLAUDE_AUDIT_ID_SET` | Enlaces activos, columna MVP «Disponible» |
| Sin id o JSON aún no en allowlist | Sin enlace, métricas «—», MVP «Pendiente» |

### Próximos pasos:

- Ampliar `CLAUDE_PILOT_URL_ROWS` (URLs exactas filas 6–10 con Equipo UX) y JSON en `data/claude-audits/` al ritmo de reuniones Claude (URLs 2–10).
- **Opcional:** `claudeAuditIdForUrl` al enviar el formulario de URL si coincide con una fila del launch.
- Script `validate:claude-audits` en CI (flujo §1.6) — ver [Fase C PDF](#devlog-2026-06-04-fase-c-pdf).

---

<a id="devlog-2026-06-04-resultado-orquestacion-codigo"></a>
## [2026-06-04] - Frontend | Fase 1.5: orquestación de `/auditar/resultado` — siete bloques en código
### Contexto y objetivos:

Tras [documentar la orquestación §4](#devlog-2026-06-03-resultado-orquestacion-piloto) y el [enlace por `claudeAudit`](#devlog-2026-06-03-resultado-claude-audit), el B4 interino duplicaba contenido (paneles al final + secciones mock). El equipo acordó un solo flujo piloto: metadatos fusionados, acordeones cerrados por defecto y tabla de sustituciones como «Texto propuesto».

Objetivo: implementar el ítem **2.5** (Fase B) en código — [`docs/flujo-piloto-10-urls-claude-mvp.md`](../flujo-piloto-10-urls-claude-mvp.md) §4.

### Implementación técnica:

- **`frontend/src/app/auditar/resultado/page.tsx`:** `esInformePiloto = Boolean(pilotMeta)`; ramas piloto vs mock/fixture.
- **Bloques fijos:** `ResultadoInformePanel` «Datos de Auditoría» (resumen operativo + `fecha_evaluacion`, `evaluador_uid`, `tipo_pagina`, `id`); título «39 Criterios Evaluados» en piloto.
- **Acordeones** (`resultado-informe-collapsible.tsx`, `defaultValue={[]}`): grupo 1 — Resumen Auditoría (`resumen_ejecutivo`), Pasos a seguir (`PASOS_SEGUN_ESTADO`); grupo 2 tras la tabla — Observaciones finales por severidad, Texto propuesto (`sustituciones[]`), Nota para el equipo TI (`nota_final_tic`).
- **`frontend/src/components/resultado-claude-pilot-sections.tsx`:** exports de contenido y helpers (`formatFechaEvaluacion`, `labelTipoPagina`); sin monolito `ResultadoClaudePilotSections`.
- **Omitido en piloto:** sección `observaciones_lc` narrativa y párrafo `texto_propuesto` (`{!esInformePiloto ? … : null}`); tarjeta import JSON oculta si hay `claudeAudit=` en la URL.

### 💡 Repaso técnico: orden en pantalla (piloto):

| # | Bloque | UI |
| --- | --- | --- |
| 1 | Datos de Auditoría | Panel fijo |
| 2–3 | Resumen + Pasos | Acordeón (cerrado al cargar) |
| 4 | 39 Criterios Evaluados | Tabla fija |
| 5–7 | Severidad + Sustituciones + Nota TI | Acordeón (cerrado al cargar) |

### Próximos pasos:

- Tabla 10 URLs en `/auditar` (ítem 2.3) — ver [entrada tabla piloto](#devlog-2026-06-04-auditar-tabla-piloto).
- Pulido visual: cabecera `#0F69C4` en triggers de acordeón (§15.1).
- Exportación PDF — ver [Fase C](#devlog-2026-06-04-fase-c-pdf).

---

<a id="devlog-2026-06-03-resultado-claude-audit"></a>

<a id="devlog-2026-06-03-resultado-orquestacion-piloto"></a>
## [2026-06-03] - Frontend | Fase 1.5: resultado con query `claudeAudit` y API piloto
### Contexto y objetivos:

Tras el commit de API y esquema (`parseClaudeAuditFile`, `GET /api/claude-audits/[id]`, JSON home en `data/claude-audits/`), faltaba enlazar la pantalla **`/auditar/resultado`** con ese flujo sin romper fixtures ni mock por URL. El piloto exige abrir informes por id estable (`www-inapi-cl_2026-06-02`) mientras se mantiene la tabla de 39 criterios y el resto de bloques del mock.

Objetivo: implementar **B3** del [`docs/flujo-piloto-10-urls-claude-mvp.md`](../flujo-piloto-10-urls-claude-mvp.md) — prioridad de fuentes de datos, estados de carga/error y importación JSON compatible con export Claude.

### Implementación técnica:

- **`frontend/src/app/auditar/resultado/page.tsx`:** query `claudeAudit`; `useEffect` dedicado a `GET /api/claude-audits/{id}`; el cliente consume el bundle `{ audit, pilot }` con `parseStrictAuditRecord(raw.audit)` (no `parseClaudeAuditFile` sobre la respuesta API, que espera JSON plano del repo).
- **Prioridad de datos:** `claudeAuditForDisplay` → fixture → import → mock por `url`; `urlDerivedAudit` no aplica si hay `fixture` o `claudeAudit`.
- **UX:** mensajes «Cargando auditoría piloto…», error con enlace a `/auditar`, `descripcionOrigen` con `claude_audit_api`; import JSON deshabilitado cuando hay `fixture=` o `claudeAudit=` en la URL.
- **Import manual:** `aplicarImportacion` sigue usando `parseClaudeAuditFile` para JSON pegado/archivo (formato canónico en `data/claude-audits/*.json`); fallback a `parseStrictAuditRecord`.
- **B4 (interino):** componente `resultado-claude-pilot-sections.tsx` muestra metadatos piloto, resumen ejecutivo, severidad, sustituciones y nota TIC **debajo de la tabla**; pendiente **refactor de orquestación** según entrada [Orquestación UI resultado piloto](#devlog-2026-06-03-resultado-orquestacion-piloto).

### 💡 Repaso técnico: bundle API vs archivo JSON:

| Origen | Forma | Parser en cliente |
| --- | --- | --- |
| API `/api/claude-audits/…` | `{ audit, pilot }` | `parseStrictAuditRecord(audit)` + `pilot` tal cual |
| Pegado / archivo `.json` del repo | Campos checklist + extensiones en la raíz | `parseClaudeAuditFile` |

Confundir ambos formatos producía errores Zod («Required» en todos los campos) al validar el bundle como si fuera archivo plano.

### Próximos pasos:

- Refactor UI según [orquestación §4 acordada](#devlog-2026-06-03-resultado-orquestacion-piloto) (orden, acordeones, fusión de metadatos en Datos de Auditoría).
- **B5 (opcional):** en `/auditar`, enlace automático con `claudeAudit=` vía `claudeAuditIdForUrl`.
- Tabla de 10 URLs en ingreso (flujo §2.3); PDF server-side (fase C del flujo).

---


## [2026-06-03] - Documentación | Fase 1.5: orquestación UI de `/auditar/resultado` (piloto)
### Contexto y objetivos:

Tras **B3** (carga por `claudeAudit`) y un **B4 interino** que mostraba bloques piloto al final de la página, la revisión con el equipo detectó **redundancia** entre secciones mock (Resumen, Observaciones narrativas, Texto propuesto párrafo) y campos Claude (`observaciones_lc_por_severidad`, `sustituciones`). Se acordó una **única narrativa** para entrega TIC y menor carga visual mediante **barras colapsables**.

Objetivo: fijar en `docs/` el orden definitivo de bloques, títulos de barra y qué contenido del JSON alimenta cada uno, antes del refactor en `page.tsx` y `resultado-claude-pilot-sections.tsx`.

### Implementación técnica:

- **[`docs/flujo-piloto-10-urls-claude-mvp.md`](../flujo-piloto-10-urls-claude-mvp.md) §4 reescrita:** siete bloques + PDF (§8); solo **Datos de Auditoría** y **39 Criterios Evaluados** sin acordeón; mapeo §6 actualizado (`sustituciones` → barra «Texto propuesto»; omitir `observaciones_lc` y `texto_propuesto` en piloto cuando aplique).
- **[`docs/DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md) §15.1:** tabla de títulos de barra y reglas de acordeón para resultado piloto.
- **[`docs/ROADMAP.md`](../ROADMAP.md), [`PRD.md`](../PRD.md), [`ARCHITECTURE.md`](../ARCHITECTURE.md):** alineados al nuevo alcance de pantalla resultado.

**Orden acordado (títulos de barra):**

1. Datos de Auditoría — `audit` + `pilot.tipo_pagina` (siempre visible).
2. Resumen Auditoría — `resumen_ejecutivo` (colapsable).
3. Pasos a seguir — copy por estado (colapsable).
4. 39 Criterios Evaluados — tabla (siempre visible).
5. Observaciones finales por severidad — `observaciones_lc_por_severidad` (colapsable).
6. Texto propuesto — tabla `sustituciones` (colapsable).
7. Nota para el equipo TI — `nota_final_tic` (colapsable).

### Próximos pasos:

- **Código (Fase B — ítem 2.5):** refactor `frontend/src/app/auditar/resultado/page.tsx` y `resultado-claude-pilot-sections.tsx` según §4 (no documentado en esta entrada).
- **Fase B — ítem 2.3:** tabla 10 URLs en `/auditar`.
- **Fase C:** PDF con el mismo orden de bloques.

---

<a id="devlog-2026-06-02-fase-1-5-piloto-claude"></a>
## [2026-06-02] - Estrategia | Fase 1.5: piloto 10 URLs con Claude, reuniones UX y documentación operativa
### Contexto y objetivos:

Tras cerrar en repo las Etapas **5b/5c** del inventario Calidad Web (22 URLs, `type_url`, filtros), el equipo UX (Equipo UX) y jefatura de proyecto priorizaron un **entregable concreto a TIC** antes de fin de año: auditar **10 páginas web** (no las 22 del inventario Clarity como cola única en esta oleada), con informe revisable, **PDF** descargable y **sustituciones de texto** en HTML para solicitudes accionables.

Reuniones **2026-06-01** (jefatura de proyecto: enfoque «medio, no fin», trazabilidad futura, cautela con KPI «Auditorías») y **2026-06-02** (Equipo UX: alcance piloto, proveedor IA, flujo sin backend productivo). Se definió **Fase 1.5** en [`docs/ROADMAP.md`](../ROADMAP.md) como etapa de gestión UX + MVP documental, sin sustituir aún Fase 2 (Supabase/Nest/Lambda).

Objetivos de la jornada documental: (1) registrar decisiones y flujo operativo; (2) comparar **Gemini** vs **Claude** en home `www.inapi.cl`; (3) dejar plan técnico para integrar export JSON Claude → `strictAuditRecordSchema` → UI → PDF en servidor.

### Implementación técnica:

- **Comparación IA (home):** `Comparación Auditoría…` *(retirado 2026-08)* — Gemini 88,6 % / 4 incumplimientos vs Claude 45,5 % / 18 incumplimientos; recomendación **Claude** para rigor editorial y volumen de sustituciones útiles a TIC.
- **Propuesta reunión:** `Propuesta Análisis LC URLs.md` *(retirado 2026-08)* — insumo pre-reunión; acta post-reunión en §11 (decisiones D1–D8).
- **Flujo operativo piloto:** [`docs/flujo-piloto-10-urls-claude-mvp.md`](flujo-piloto-10-urls-claude-mvp.md) — Proyecto Claude, mensajes §3.2/3.3, tabla 10 URLs, alcances UI (`/auditar` acordeón piloto debajo de ingreso URL; `/auditar/resultado` con 7 bloques §4 + PDF server-side).
- **Roadmap:** nueva sección **Fase 1.5**; condición de entrada a Fase 2 actualizada; PDF adelantado en piloto (consolidación institucional en Fase 2/4).
- **PRD / arquitectura / README / fase2 / diagramas:** alineados a Fase 1.5 y referencias cruzadas.
- **Primera auditoría Claude (home):** JSON con 39 criterios y 17 sustituciones en mano del equipo; pendiente volcar en `data/claude-audits/` y enriquecer campos del mensaje §3.2 del flujo operativo.

**Decisiones cerradas (resumen):**

| ID | Acuerdo |
| --- | --- |
| D1 | MVP acotado: valor entregable (informe + PDF + HTML sustituciones) antes que infra completa |
| D2 | Piloto **10 URLs** (subconjunto); inventario 22 sigue como referencia editorial |
| D3 | **PDF** adelantado en Fase 1.5 (`@react-pdf/renderer`, Route Handler) |
| D4 | **Claude** (Proyecto) como proveedor del piloto; Gemini queda como referencia comparativa |
| D5–D6 | Sin producto paralelo de control de cambios; detección automática fuera de MVP |
| — | Sin BD obligatoria ni sync automático Proyecto Claude ↔ app (export JSON manual → repo) |

### 💡 Repaso técnico: Fase 1.5 vs Fase 2:

Fase **1.5** reutiliza el mock y `strictAuditRecordSchema` con datos **importados** desde Claude; Fase **2** añade persistencia, auth y evaluación vía API. El inventario de 22 URLs en [`data/ux/clarity-fichas-mock.json`](../../data/ux/clarity-fichas-mock.json) no se reemplaza: el piloto usa una **tabla maestra** (9 URLs operativas en junio 2026) y JSON en `data/claude-audits/` *(implementado — ver [2026-06-08](#devlog-2026-06-08-docs-fase-1-5))*.

### Próximos pasos:

- Cerrar lista oficial de **10 URLs** con Equipo UX (§2 del flujo operativo).
- Implementar adaptador export Claude → Zod, carpeta `data/claude-audits/`, acordeón piloto en `/auditar`, pantalla resultado ampliada y API PDF.
- Completar JSON home + auditorías restantes; entrega TIC: PDF + HTML corregido tras revisión UX.
- Fase 2.0 (Supabase + contrato REST) cuando cierre el piloto 1.5 según [`docs/ROADMAP.md`](../ROADMAP.md).

---

<a id="devlog-2026-05-29-cierre-5b-5c-inventario"></a>
## [2026-05-29] - Frontend | Cierre Etapas 5b y 5c: inventario Calidad Web con `type_url`
### Contexto y objetivos:

Cierre del bloque de feedback UX sobre el **inventario único** Calidad Web en `/auditar` (Trámites + Sitio Web). Tras revisar el extracto Clarity (365 días, mayo 2026) y capturas del panel Mapas térmicos, se confirmó que el **rank 1** es la **landing** `https://tramites.inapi.cl/` (no la home `www.inapi.cl`) y que la distinción Sitio Web vs Trámites debe vivir en **una sola tabla** mediante el campo **`type_url`** (`tramites` | `sitioweb`) y un **filtro Tipo** en UI — sin un segundo acordeón (Etapa 4 cancelada).

Objetivos de la jornada: (1) alinear JSON maestro y tipos TS a **22 URLs**; (2) implementar filtro y columna Tipo; (3) copy UI §15 sin fijar conteo de URLs en el intro; (4) mostrar tipo en ficha de detalle; (5) sincronizar documentación de producto y arquitectura.

### Implementación técnica:

- **Datos:** [`data/ux/clarity-fichas-mock.json`](../../data/ux/clarity-fichas-mock.json) — rank 1 corregido (`tramites.inapi.cl`, visitas ref. 432.572); ranks **21–22** `sitioweb` (home + Trámites digitales); `type_url` en las 22 fichas; observaciones rank **18** alineadas a patentes; notas raíz actualizadas. Espejo [`data/ux/clarity-inventory.json`](../../data/ux/clarity-inventory.json) con 22 filas.
- **Frontend — tabla:** [`clarity-inventory-historial-table.tsx`](../../frontend/src/components/clarity-inventory-historial-table.tsx) — filtro **URLs Trámites / URLs Sitio Web / Todas**, columna **Tipo**, `aria-label` en controles, `caption` y enlaces accesibles en celdas rank/ruta.
- **Frontend — orden/filtro:** [`clarity-inventory-sort.ts`](../../frontend/src/lib/clarity-inventory-sort.ts) — filtro `type_url` compuesto con estado LC (corrección de anidamiento).
- **Frontend — sección `/auditar`:** [`auditar-inventory-sections.tsx`](../../frontend/src/components/auditar-inventory-sections.tsx) — títulos design system §15; párrafo introductorio sin «22 URLs» (inventario puede crecer).
- **Frontend — ficha:** [`/auditar/inventario/clarity/[rank]/page.tsx`](../../frontend/src/app/auditar/inventario/clarity/[rank]/page.tsx) — campo **Tipo de URL** en resumen.
- **Tipos:** [`clarity-url-ficha.ts`](../../frontend/src/lib/clarity-url-ficha.ts) — tipo `ClarityUrlFicha` con `type_url` (sin duplicado).
- **Documentación sincronizada (2026-05-29):** [`docs/ux/inventario-urls-clarity.md`](../ux/inventario-urls-clarity.md) (filtro implementado, tabla ranks 21–22 con métricas mock), [`docs/ROADMAP.md`](../ROADMAP.md) (5b y **5c** `[x]`; Etapa 4 aclarada), [`docs/PRD.md`](../PRD.md), [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md), [`docs/DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md) §13.1 y §15, [`README.md`](../../README.md), [`data/ux/README.md`](../../data/ux/README.md).

### 💡 Repaso técnico: Coherencia maestro ↔ tabla ↔ ficha:

La UI **no** lee `type_url` del espejo `clarity-inventory.json`; la columna Tipo y el filtro derivan del **maestro** vía `clarity-fichas-mock.ts` / `clarity-inventory-rows.ts`. Mantener una sola fuente evita desalineaciones cuando el inventario crezca más allá de 22 filas.

### Próximos pasos:

- *(Supersedido por Fase 1.5 — ver [2026-06-02](#devlog-2026-06-02-fase-1-5-piloto-claude).)* Demo interna UX y piloto 10 URLs con Claude documentados en ROADMAP Fase 1.5.
- Ampliar inventario con más URLs del extracto Clarity cuando el equipo lo priorice (sin cambiar el patrón tabla única + `type_url`).

---

<a id="devlog-2026-05-28-inventario-unico-docs"></a>
## [2026-05-28] - Documentación | Inventario único — Historial LC en `/auditar`
### Contexto y objetivos:

Tras cerrar en código la **fusión de «URLs más auditadas»** en la tabla Clarity (commit `b2c6b0e`) y revisar la pantalla `/auditar` con el equipo, se acordó que la sección **«URLs con estados LC resueltos»** (antes planificada como «Estados URLs») **sobra**: las **20 URLs Clarity** concentran ya visitas, auditorías, última revisión, % LC y estado; lo único distintivo del segundo acordeón eran las **observaciones**, que deben vivir en **`/auditar/inventario/clarity/[rank]`** (breve en contexto editorial, con detalle desarrollable).

Objetivo de esta entrada: **actualizar `docs/`** para reflejar **un solo** inventario LC en `/auditar`, título **Historial de Auditoría LC - URLs INAPI**, y **Etapa 5** con filtros/orden en esa tabla única (estado, visitas, auditorías, última revisión, % LC; sin filtro por encargado ni observación).

### Implementación técnica:

- **Decisión de producto:** suprimir acordeón «URLs con estados LC resueltos» / «Estados URLs»; deprecar `resolved-lc-state-rows.ts` y `resolved-lc-states.json` en implementación **2c.1** (código pendiente).
- **Título objetivo del acordeón:** **Historial de Auditoría LC - URLs INAPI**.
- **Observaciones:** campo `observaciones` (y opcional detalle) en [`data/ux/clarity-fichas-mock.json`](../../data/ux/clarity-fichas-mock.json) / ficha §2.2; migrar copy editorial de URLs coincidentes con el antiguo listado resolved (ranks 1, 9, 10, 15, 20) en **2c.3**.
- **Filtros planificados (Etapa 5):** filtro por bucket de estado LC; orden asc/desc por visitas, auditorías, última revisión y % LC.
- **Documentos actualizados:** [`docs/ux/inventario-urls-clarity.md`](../ux/inventario-urls-clarity.md) (§2 renombrado, §4 deprecaciones, diagrama §4), [`docs/ROADMAP.md`](../ROADMAP.md), [`docs/PRD.md`](../PRD.md) (v0.3.7), [`docs/DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md) §13.1 y §15, [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md).

### Próximos pasos:

- **2c.1 (código):** eliminar acordeón y archivos `resolved-lc-*` en UI y repo.
- **2c.2–2c.3:** renombrar título del acordeón, enriquecer observaciones en fichas.
- **2b.4:** auditorías y última revisión en resumen de ficha.
- **Etapa 5:** componente cliente con filtros y orden en tabla única.
- **Nota:** la entrada [Consistencia de inventarios (misma fecha)](#devlog-2026-05-28-consistencia-inventarios-docs) describía **dos** acordeones; queda **supersedida** en lo relativo a «Estados URLs».

---

<a id="devlog-2026-05-28-consistencia-inventarios-docs"></a>
## [2026-05-28] - Documentación | Consistencia de inventarios, tablas y pantallas mock en `/auditar`
### Contexto y objetivos:

Tras el feedback UX (Equipo UX / jefatura de proyecto, mayo 2026) y la implementación parcial de las **etapas 1–3** (tabla de criterios en resultado, **20 fichas** Clarity y ruta de detalle), el equipo detectó **inconsistencias** entre secciones del mismo mock: URLs distintas para el mismo concepto «home», conteos de auditorías desalineados entre tabla e historial de ficha, filas «No aplica» en Clarity que debían mostrarse como **rechazadas** con % LC, y leyendas de iconos distintas entre inventarios y el **estado de aceptación** del informe en `/auditar/resultado`.

Objetivo de esta entrada: **fijar en `docs/` y README** la estructura objetivo de pantallas y tablas (fuente única de datos, columnas, iconografía y colores de fila) para que la implementación en código quede alineada antes del siguiente commit de Etapa 3.

### Implementación técnica:

- **Fuente única (20 URLs Clarity):** [`data/ux/clarity-fichas-mock.json`](../../data/ux/clarity-fichas-mock.json) como maestro mock; la tabla resumida en UI deriva de ahí (no duplicar filas en varios `.ts` sin sincronía). Campos documentados: `encargadoRef`, `auditoriasRef`, `ultimaRevisionRef`, además de visitas, % LC, estado e `historialAuditorias` (longitud del historial = conteo de auditorías cuando es numérico).
- **Fusión de secciones en `/auditar`:** se **retira** el acordeón independiente **«URLs más auditadas»**; sus columnas útiles (**Auditorías**, **Última revisión**) pasan a la tabla ampliada de **~20 URLs Clarity**. Permanecen **dos** bloques colapsables de inventario: (1) Clarity ampliado, (2) **Estados URLs** (antes «URLs con estados LC resueltos»).
- **Tabla Clarity (columnas objetivo):** `#`, Ruta o etiqueta, **Encargado**, Visitas (ref.), **Auditorías (ref.)**, **Última revisión (ref.)**, % LC (ref.), Estado (ref.); enlaces a ficha `/auditar/inventario/clarity/[rank]`.
- **Ficha por URL:** [`/auditar/inventario/clarity/[rank]`](../../frontend/src/app/auditar/inventario/clarity/[rank]/page.tsx) muestra resumen (incl. **Encargado: equipo de desarrollo** en mock), contexto editorial e historial con **N** fechas coherentes con `auditoriasRef` (p. ej. rank 1 → **5** auditorías y **5** filas de historial).
- **Correcciones editoriales acordadas en tabla §2:** ranks **8, 15 y 18** con estado **Rechazado** y % **61,3 %**, **55,9 %** y **70,4 %** respectivamente (ya reflejados en [`docs/ux/inventario-urls-clarity.md`](../ux/inventario-urls-clarity.md)).
- **Iconografía y color de fila unificados** con umbrales de negocio del checklist (≤80 % rechazado, 81–90 % aceptado con observaciones, ≥91 % aprobado): símbolos **!** (rojo), **✓** (azul), **✓✓** (verde), **—** (gris); bandas de fila en verde / naranja / rojo según franja. Misma regla en tabla Clarity, sección **Estados URLs** y celdas de historial en ficha. Detalle en [`docs/DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md) §13.1 y §15.
- **Documentos actualizados:** [`docs/ux/inventario-urls-clarity.md`](../ux/inventario-urls-clarity.md) (estructura §2–§4), [`docs/ROADMAP.md`](../ROADMAP.md), [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md), [`docs/DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md), [`docs/PRD.md`](../PRD.md), [`README.md`](../../README.md).

### Próximos pasos:

- **Implementación en código** (responsabilidad del equipo en repo): ampliar JSON y tipos, refactor de `auditar-inventory-sections`, helper visual LC compartido, ajustes en ficha `[rank]`; luego commit de Etapa 3 + consistencia.
- **Etapa 4–5** del plan feedback UX: Calidad web mock y filtros en las **dos** tablas de inventario (ver [`docs/ROADMAP.md`](../ROADMAP.md)).
- Actualizar [`data/ux/README.md`](../../data/ux/README.md) cuando el JSON maestro sustituya los espejos `most-audited-urls.json` / `clarity-inventory.json` en mantenimiento.

**Nota (misma fecha):** la decisión de mantener un segundo acordeón **Estados URLs** queda **supersedida** por [Inventario único — Historial LC](#devlog-2026-05-28-inventario-unico-docs).

---

<a id="devlog-2026-05-27-feedback-ux-criterios-fichas"></a>
## [2026-05-27] - Frontend | Sprint fase-1: Feedback UX — catálogo en resultado e inventario Clarity con fichas mock
### Contexto y objetivos:

Avanzar las **dos primeras etapas** del plan de feedback UX post-demo (Equipo UX / jefatura de proyecto, mayo 2026): (1) que la tabla de los 39 criterios en **`/auditar/resultado`** muestre la **sección** y el **enunciado oficial** del checklist editorial v1.1, no solo el código del criterio; (2) disponer de un **modelo mock de ~20 fichas** alineado al inventario ampliado Clarity en [`docs/ux/inventario-urls-clarity.md`](../ux/inventario-urls-clarity.md) §2, como base para rutas de detalle por URL sin mezclar aún con `StrictAuditRecord`. Objetivo: mejorar legibilidad del informe mock y una **fuente única** de datos para la tabla de inventario en `/auditar` y las futuras páginas de ficha.

### Implementación técnica:

- **Etapa 1 — Tabla de criterios en resultado:** nuevo módulo [`frontend/src/lib/checklist-criterion-catalog.ts`](../../frontend/src/lib/checklist-criterion-catalog.ts) que importa [`data/checklist-criteria.json`](../../data/checklist-criteria.json), expone `getCriterionCatalogRow`, `formatSeccionTitulo` y `formatCriterioEnunciado`. En [`frontend/src/app/auditar/resultado/page.tsx`](../../frontend/src/app/auditar/resultado/page.tsx) la tabla pasa de tres a **cinco columnas** (Sección, Criterio, Estado, Severidad, Comentario); leyenda accesible en `TableCaption` (`sr-only`); los filtros existentes se mantienen sobre el conjunto filtrado.
- **Etapa 2 — Fichas mock Clarity:** archivo [`data/ux/clarity-fichas-mock.json`](../../data/ux/clarity-fichas-mock.json) con **20 entradas** (`nombre`, `rutaEtiqueta`, `url`, métricas de referencia, `descripcion`, `observaciones`, `historialAuditorias` con fechas ISO y notas ficticias). URLs inferidas con prefijo `https://tramites.inapi.cl/` salvo prioridades canónicas documentadas (p. ej. Notificaciones, SuccessConfirmation). Ranks **8** y **15** alineados al criterio «No aplica» del inventario TypeScript, no al markdown §2 donde divergía.
- **Tipos y carga:** [`frontend/src/lib/clarity-url-ficha.ts`](../../frontend/src/lib/clarity-url-ficha.ts) (`ClarityUrlFicha`, `ClarityHistorialAuditoriaMock`); [`frontend/src/lib/clarity-fichas-mock.ts`](../../frontend/src/lib/clarity-fichas-mock.ts) con `CLARITY_FICHAS_MOCK`, `getClarityFichaByRank`, `isValidClarityFichaRank` y `clarityFichaToInventoryRow`.
- **Fuente única para la tabla:** [`frontend/src/lib/clarity-inventory-rows.ts`](../../frontend/src/lib/clarity-inventory-rows.ts) deja de duplicar filas estáticas y **deriva** `CLARITY_INVENTORY_ROWS` desde las fichas mock.

### 💡 Repaso técnico: Ficha vs registro de auditoría:

La **ficha de URL** resume contexto editorial (visitas Clarity, % LC de referencia, historial mock breve). **No** es un `StrictAuditRecord`: no incluye las 39 evaluaciones ni texto propuesto. La ruta de detalle por `rank` (Etapa 3) consumirá `getClarityFichaByRank`; el informe completo seguirá viniendo de fixtures JSON o mock por URL en resultado.

### Próximos pasos:

- **Etapa 3:** ruta `/auditar/inventario/clarity/[rank]` y enlaces desde inventario (base en repo; ver [consistencia documentada 2026-05-28](#devlog-2026-05-28-consistencia-inventarios-docs) para columnas, encargado e historial alineado).
- **Etapa 4:** filas mock de calidad web e ítem de acordeón correspondiente.
- **Etapa 5:** filtros cliente para las **dos** tablas de inventario (Clarity ampliado + Estados URLs).

---

<a id="devlog-2026-05-22-vercel-gha-etapa1"></a>
## [2026-05-22] - Infraestructura | Sprint fase-1: Vercel y workflow de CI en GitHub
### Contexto y objetivos:

Cerrar en operación la **Etapa 1** del plan de despliegue híbrido documentado en [`docs/despliegue/despliegue-hibrido.md`](../despliegue/despliegue-hibrido.md): URL estable para **demo UX** del mock (Next en **Vercel**) y **calidad reproducible** en **GitHub Actions**, sin desviar el deploy hacia Actions (opción A del plan). Objetivo de negocio: que Equipo UX y liderazgo puedan revisar el mismo binario que pasa `typecheck:all` y `lint` antes de abrir Fase 2 (Nest, Supabase, pipeline LC en AWS).

### Implementación técnica:

- **Vercel:** proyecto importado desde el repositorio de GitHub; **Root Directory** `frontend`; comandos **`cd .. && bun install`** y **`cd .. && bun run build`** para respetar el workspace Bun en la raíz (`bun.lock`, scripts de [`package.json`](../../package.json)) y el alias `@contracts/checklist` hacia [`src/schemas/checklist.ts`](../../src/schemas/checklist.ts). Previews por rama o PR según la configuración del panel.
- **GitHub Actions:** archivo [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) — disparadores `push` a `main` y ramas `feature/**`, `pull_request` hacia `main` y `workflow_dispatch`; `actions/checkout@v4` y `oven-sh/setup-bun@v2`; **`bun install --frozen-lockfile`** para alinear el árbol de dependencias con el lock versionado; **`bun run typecheck:all`** (checklist + fixtures + TypeScript raíz y frontend) y **`bun run lint`**. Concurrencia con cancelación del run anterior en la misma ref (`concurrency`).
- **Verificación en URL desplegada:** comprobación manual de `/`, `/auditar`, flujo mock, carga de datos por **fixture** (`fixture=` y `GET /api/audit-fixtures/[fixtureId]`) y bloque **«Demostración: importar JSON»** en [`frontend/src/app/auditar/resultado/page.tsx`](../../frontend/src/app/auditar/resultado/page.tsx) — pegado del contenido o **archivo** `.json` válido (mismo contrato `strictAuditRecordSchema` que los archivos en `data/audit-fixtures/`).
- **Documentación:** checklist actualizado en [`docs/despliegue/despliegue-hibrido.md`](../despliegue/despliegue-hibrido.md); sección **«Despliegue y CI»** en [`README.md`](../../README.md); ajustes en [`docs/ROADMAP.md`](../ROADMAP.md), [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md) y [`docs/SECURITY.md`](../SECURITY.md) para reflejar el cierre de Etapa 1 y la decisión de hosting Nest a formalizar con TI.

### Próximos pasos:

- **Demo interna** con Equipo UX según [`docs/ROADMAP.md`](../ROADMAP.md) (grabación y notas en `docs/` o en esta bitácora); checklist manual de accesibilidad en [`docs/qa/auditar-procesando-a11y-manual.md`](../qa/auditar-procesando-a11y-manual.md) si aún no se ejecutó antes de la reunión.
- Vigilar avisos de **deprecación de Node** en el runtime de las actions oficiales (`actions/checkout`, etc.); subir versión de la action o variable de entorno de opt-in cuando el equipo lo priorice.
- **Etapa 2** del plan (Supabase, Nest, AWS LC) alineada al cierre de Fase 1 en producto; formalizar por escrito **Railway vs AWS** para Nest cuando exista código (ver dependencias externas en roadmap).

---

<a id="devlog-2026-05-21-fixtures-implementacion"></a>
## [2026-05-21] - Frontend | Fixtures de auditoría: datos, scripts, validación, API y UI
### Contexto y objetivos:

Cerrar en código el ítem **«Fixtures de auditoría»** de la Fase 1 en [`docs/ROADMAP.md`](../ROADMAP.md): datos canónicos en `data/audit-fixtures/`, comprobación automática con el mismo contrato que usará el dominio (`strictAuditRecordSchema`), y en el **frontend** la posibilidad de **cargar un fixture por identificador** o **importar** un JSON, coherente con las tres franjas de aceptación (≤80 %, 81–90 %, ≥91 % sobre criterios aplicables).

### Implementación técnica:

- **Generación de JSON (fuente de verdad numérica):** script en la raíz del monorepo `src/scripts/generate-audit-fixture-json-files.ts`, ejecutable con Bun (`bun run src/scripts/generate-audit-fixture-json-files.ts`). Construye los tres registros usando `summarizeEvaluations`, `buildDemoStrictAuditWithCumpleCount` y `strictAuditRecordSchema.parse` desde [`src/schemas/checklist.ts`](../../src/schemas/checklist.ts) antes de escribir disco, de modo que **no** haya que ajustar a mano porcentajes ni `estado_aceptacion` incoherentes con las 39 filas. El fixture **rechazado** replica el reparto del informe editorial documentado en [`docs/ux/audit-fixture-ejemplo-notificaciones-marcas-rechazado.md`](../ux/audit-fixture-ejemplo-notificaciones-marcas-rechazado.md); los otros dos cubren franja media y alta con el mismo patrón numérico que los atajos editoriales hasta disponer de informes completos volcados.
- **Validación en CI / local:** `src/scripts/validate-audit-fixtures.ts` y comando raíz `bun run validate:audit-fixtures` (ver [`package.json`](../../package.json)), que recorre los `*.json` de `data/audit-fixtures/` excluyendo `manifest.json` y vuelve a parsear cada archivo con `strictAuditRecordSchema`.
- **Metadatos de lanzamiento:** [`frontend/src/lib/audit-fixtures-launch.ts`](../../frontend/src/lib/audit-fixtures-launch.ts) (ids permitidos y URL de navegación al flujo `procesando` + `resultado`).
- **API Next (servidor):** `GET` en [`frontend/src/app/api/audit-fixtures/[fixtureId]/route.ts`](../../frontend/src/app/api/audit-fixtures/[fixtureId]/route.ts): lee el JSON desde el monorepo (`process.cwd()` con padre `..` salvo override `LC_REPO_ROOT`), lista blanca de ids y respuesta validada con Zod antes de enviarla al cliente.
- **Flujo UI:** [`frontend/src/app/auditar/procesando/page.tsx`](../../frontend/src/app/auditar/procesando/page.tsx) propaga `fixture=` hacia [`frontend/src/app/auditar/resultado/page.tsx`](../../frontend/src/app/auditar/resultado/page.tsx); esta página prioriza **fixture por API** frente a **importación JSON** (`parseStrictAuditRecord`) y al **mock por URL**; se ajustó la interacción con la regla de lint `react-hooks/set-state-in-effect` derivando estado de carga y filtrando el fixture mostrado cuando el `id` del registro coincide con el parámetro de URL.
- **Descubrimiento en `/auditar`:** botones que disparan el mismo camino intermedio que los atajos, con `url` y `fixture` alineados a cada JSON.

### Próximos pasos:

- `validate:audit-fixtures` ya forma parte de `bun run typecheck:all` en la raíz del monorepo (ver [`package.json`](../../package.json)).
- Según roadmap: **demo interna con Equipo UX** (grabación y notas en `docs/` o en esta bitácora).
- Cuando existan informes cerrados para las otras URLs prioritarias, **sustituir** los dos fixtures «mock numérico» regenerando JSON con el mismo script y volver a ejecutar `validate:audit-fixtures`.

---

<a id="devlog-2026-05-21-fixtures-plan-ejemplo-notificaciones"></a>
## [2026-05-21] - Documentación | Ejemplo editorial fixtures (rechazado) + alineación inventario / roadmap
### Contexto y objetivos

Dejar **versionado en el repo** un **ejemplo editorial completo** (texto capturado, reparto de 39 criterios, resumen 55,2 % rechazado, texto propuesto) para la URL prioritaria **Notificaciones Marcas** (`https://tramites.inapi.cl/Notificaciones`), alineado al inventario Clarity en [`docs/ux/inventario-urls-clarity.md`](../ux/inventario-urls-clarity.md), como **referencia humana** para el primer JSON bajo `data/audit-fixtures/`. El plan de trabajo puntual de Fase 1 se redactó en paralelo y **se retiró del repositorio** una vez cerrados datos, scripts, API y UI; la operación vive en [`data/audit-fixtures/README.md`](../../data/audit-fixtures/README.md) y en la entrada [Frontend: Fixtures de auditoría — datos, scripts, validación, API y UI](#devlog-2026-05-21-fixtures-implementacion).

### Qué se añadió o actualizó

- **Nuevo:** [`docs/ux/audit-fixture-ejemplo-notificaciones-marcas-rechazado.md`](../ux/audit-fixture-ejemplo-notificaciones-marcas-rechazado.md) — volcado del informe (modal, vistas, pie, listas de IDs cumple/incumple/no aplica, severidades resumidas, texto propuesto, slug sugerido para `id` de fixture).
- **Actualizado:** [`docs/ux/inventario-urls-clarity.md`](../ux/inventario-urls-clarity.md) — enlace al ejemplo bajo la tabla de tres URLs priorizadas (y referencia a `data/audit-fixtures/README.md` donde aplica).
- **Actualizado:** [`docs/ROADMAP.md`](../ROADMAP.md) — el bullet de fixtures enlaza al README de `data/audit-fixtures/` y al ejemplo editorial.

### Próximos pasos

- **Completado en repo:** JSON en `data/audit-fixtures/`, `validate:audit-fixtures`, API `GET /api/audit-fixtures/[fixtureId]`, importación JSON y carga por `fixture=` en UI (ver [entrada Frontend 2026-05-21](#devlog-2026-05-21-fixtures-implementacion)). Pendiente según roadmap: **demo interna** con Equipo UX.

---

<a id="devlog-2026-05-21-estado-intermedio-procesando"></a>
## [2026-05-21] - Frontend | Estado intermedio — pantalla `/auditar/procesando`
### Contexto y objetivos:

Cerrar en documentación el ítem de Fase 1 del roadmap **«Estado intermedio entre ingreso y resultado»** en [`docs/ROADMAP.md`](../ROADMAP.md): pantalla dedicada con mensaje en **lenguaje claro**, **sin** afirmar persistencia ni comunicación real con base de datos; preparación visual y de accesibilidad alineada a lo que se esperará cuando la evaluación con **API** (p. ej. Claude) pueda tardar segundos o minutos.

### Implementación técnica:

- **`frontend/src/app/auditar/procesando/page.tsx`:** validación de `url`, `router.replace` hacia **`/auditar/resultado`**, copy en [`frontend/src/lib/auditar-procesando-copy.ts`](../../frontend/src/lib/auditar-procesando-copy.ts); contenedor **`main`** con `aria-busy="true"`; foco programático en **`h1`** (`tabIndex={-1}`); bloque de descripción con `role="status"` y `aria-live="polite"`; fallback de `Suspense` con `role="status"`; botón **Cancelar y Volver** a `/auditar`.
- **`frontend/src/components/ui/circular-progress.tsx`:** spinner circular **indeterminado** (`role="progressbar"`, sin `aria-valuenow`) y variante **determinada** con porcentaje para uso futuro con progreso real.
- **Navegación:** [`frontend/src/app/auditar/page.tsx`](../../frontend/src/app/auditar/page.tsx) (atajos) y [`frontend/src/app/auditar/captura/page.tsx`](../../frontend/src/app/auditar/captura/page.tsx) apuntan a **`/auditar/procesando?url=…`**.
- **QA previa a reunión UX:** borrador de checklist manual en [`docs/qa/auditar-procesando-a11y-manual.md`](../qa/auditar-procesando-a11y-manual.md) (ejecución y tachado de ítems reservados como **último paso** de Fase 1 antes de la demo con Equipo UX, con observaciones adicionales del equipo).

### Próximos pasos:

- Ejecutar y completar el checklist en [`docs/qa/auditar-procesando-a11y-manual.md`](../qa/auditar-procesando-a11y-manual.md); anotar hallazgos para la reunión con **Equipo UX**.
- Según [`docs/ROADMAP.md`](../ROADMAP.md): **demo interna** con Equipo UX (grabación y notas en `docs/` o este devlog). Los **fixtures** quedaron implementados (ver [entrada 2026-05-21 — fixtures](#devlog-2026-05-21-fixtures-implementacion)).

---

<a id="devlog-2026-05-20-resultado-mock-cierre"></a>
## [2026-05-20] - Frontend | Resultado mock: barra de cumplimiento, pasos a seguir y texto propuesto
### Contexto y objetivos:

Cerrar en bitácora el ítem de Fase 1 del roadmap **«Resultado mock»** en [`docs/ROADMAP.md`](../ROADMAP.md) (marcado `[x]`): en **`/auditar/resultado`** el **porcentaje de cumplimiento** con barra visual alineada a tokens del tema y al mismo **`estado_aceptacion`** que el contrato; bloque **«Pasos a seguir»** con copy por estado de aceptación; **etiqueta legible** del estado en el resumen; **texto propuesto** cuando el mock lo aporta (atajos editoriales) y mensaje explícito cuando no hay borrador, sin parecer fallo de la aplicación. Decisión registrada: la bandera **`USAR_TEXTO_PROPUESTO_GENERICO`** en `resultado-mock-copy.ts` controla si el fallback `buildDemoStrictAudit` inyecta texto genérico; por defecto se prioriza honestidad del mock y ausencia de borrador explicada en UI.

### Implementación técnica:

- **`frontend/src/components/ui/progress.tsx`:** componente de progreso (Radix) con indicador animado; props para clases del carril y del relleno.
- **`frontend/src/lib/resultado-mock-copy.ts`:** `CLASES_BARRA_POR_ESTADO`, `ETIQUETA_ESTADO_ACEPTACION`, `PASOS_SEGUN_ESTADO`, `USAR_TEXTO_PROPUESTO_GENERICO`, `TEXTO_PROPUESTO_GENERICO` y documentación de umbrales en `UMBRALES_CUMPLIMIENTO_DOC`.
- **`frontend/src/app/auditar/resultado/page.tsx`:** barra bajo la etiqueta de cumplimiento; sección de pasos con lista ordenada accesible; resumen con estado humanizado (`title` con valor técnico opcional); bloque **Texto propuesto** siempre visible con cuerpo condicional; fallback de auditoría con spread condicional sobre `buildDemoStrictAudit`.
- **Contrato y atajos (trazabilidad):** `buildDemoStrictAuditWithCumpleCount` y `noAplicaCount` en `src/schemas/checklist.ts`; perfiles peor / intermedio / mejor en `frontend/src/lib/editorial-shortcut-audit-mock.ts` con `texto_propuesto` y `observaciones_lc` por perfil; presentación unificada de criterios en `frontend/src/lib/criterio-evaluacion-visual.ts`.
- **Calidad:** `eslint` y `tsc` en `frontend` sin errores al cierre de esta tarea.

### Próximos pasos:

- Según [`docs/ROADMAP.md`](../ROADMAP.md): **demo interna** con Equipo UX (grabación y notas en `docs/` o este devlog). Los **fixtures** quedaron implementados (ver [entrada 2026-05-21 — fixtures](#devlog-2026-05-21-fixtures-implementacion)). El ítem **Estado intermedio** quedó cerrado en roadmap y bitácora (ver entrada [2026-05-21](#devlog-2026-05-21-estado-intermedio-procesando)); el checklist manual de QA en [`docs/qa/auditar-procesando-a11y-manual.md`](../qa/auditar-procesando-a11y-manual.md) se ejecuta como último paso de Fase 1 antes de la reunión con Equipo UX.

---

<a id="devlog-2026-05-20-tabla-severidad-inventarios"></a>
## [2026-05-20] - Frontend | Tabla de criterios con severidad mock, jerarquía visual e inventarios alineados
### Contexto y objetivos:

Cerrar en código y bitácora el ítem de Fase 1 del roadmap **«Actualización de documentación con Equipo UX y tabla de criterios completa»** (marcado `[x]` en [`docs/ROADMAP.md`](../ROADMAP.md)): datos mock creíbles para **severidad** y **comentario** por criterio en atajos editoriales, misma **jerarquía visual** que el producto final en la tabla de **39** filas (`!` / `?` / `✓`, bandas y chips), coherencia en las **tablas de inventarios** bajo `/auditar` y corrección del borde izquierdo en la **última fila** de todas las tablas `Table`.

### Implementación técnica:

- **`src/schemas/checklist.ts`:** `enrichCriterionEvaluationsForMock`, tipo `MockSeveridadBias` y tercer parámetro opcional en `buildDemoStrictAuditWithCumpleCount`; rotación determinista de severidad y comentarios breves solo en filas `incumple`.
- **`frontend/src/lib/editorial-shortcut-audit-mock.ts`:** paso del perfil del atajo al builder para sesgar severidades según peor / intermedio / mejor LC.
- **`frontend/src/app/auditar/resultado/page.tsx`:** leyenda de símbolos, `TableRow` con clases por `estado` del criterio, columna estado con icono + etiqueta, chips de severidad, comentario con `line-clamp-2` y `title`.
- **`frontend/src/lib/inventory-table-visuals.tsx`** y **`frontend/src/components/auditar-inventory-sections.tsx`:** leyendas y filas con la misma lógica de buckets editoriales (Clarity, más auditadas por volumen de auditorías, estados resueltos); color del **% LC** según umbrales del checklist; columna **Nivel** en más auditadas.
- **`frontend/src/components/ui/table.tsx`:** sustituir `[&_tr:last-child]:border-0` por `[&_tr:last-child]:border-b-0` para no anular `border-l-4` en la última fila.

### Próximos pasos:

- El ítem **Resultado mock** quedó cerrado en código y bitácora (ver entrada [2026-05-20](#devlog-2026-05-20-resultado-mock-cierre)).
- El ítem **Estado intermedio** quedó cerrado en roadmap y bitácora (ver entrada [2026-05-21](#devlog-2026-05-21-estado-intermedio-procesando)); checklist manual de QA en [`docs/qa/auditar-procesando-a11y-manual.md`](../qa/auditar-procesando-a11y-manual.md) para cierre final antes de reunión con Equipo UX.
- Según [`docs/ROADMAP.md`](../ROADMAP.md): **demo interna** con Equipo UX. Los **fixtures** quedaron implementados (ver [entrada 2026-05-21 — fixtures](#devlog-2026-05-21-fixtures-implementacion)).
- Volcar en documentación / **ADR 0007** los acuerdos formales con **Equipo UX** o responsable de datos cuando se concrete la reunión (modelo y parseo más allá del borrador actual).

---

<a id="devlog-2026-05-19-auditar-data-ux-devlog"></a>
## [2026-05-19] - Frontend | Cierre mock `/auditar` desde el último PR (atajos, inventarios, resultado y `data/ux`)
### Contexto y objetivos:

Consolidar en bitácora **todo lo avanzado desde el último PR** hasta el cierre del ítem de Fase 1 **`/auditar`**: ingreso de URL, atajos editoriales, inventarios en acordeones, pantalla de resultado alineada a perfiles LC, contrato de copy agregado y, por último, **artefactos JSON** en `data/ux` para consumo máquina sin sustituir `docs/ux/`.

### Implementación técnica:

- **`/auditar` (página):** tres atajos con bordes por perfil, navegación a `resultado?url=`; bloque en tarjeta con acordeón (`type="multiple"`); datos en `audit-shortcuts.ts`.
- **Inventarios y seguimiento:** `auditar-inventory-sections.tsx` con tres barras colapsables (Clarity ~20 filas, URLs más auditadas, estados resueltos); tablas con primitiva `Table`; filas mock en `clarity-inventory-rows.ts`, `most-audited-url-rows.ts`, `resolved-lc-state-rows.ts`.
- **Contrato y resultado:** en `src/schemas/checklist.ts`, campo opcional `observaciones_lc` y helper `buildDemoStrictAuditWithCumpleCount`; mock por URL en `editorial-shortcut-audit-mock.ts` (perfiles peor / intermedio / mejor coherentes con resumen y `texto_propuesto`).
- **`/auditar/resultado`:** botón **Regresar** en cabecera; secciones con barra primaria `#0F69C4`, paneles `#FFFFFF` y tabla de criterios con `Table` / hover alineado al resto del sistema; bloques **Observaciones** y **Texto propuesto** cuando el registro los trae.
- **Documentación de cierre:** `docs/ROADMAP.md` (ítem `/auditar` completado), `docs/DATABASE.md` y `docs/ARCHITECTURE.md` (mapeo `observaciones_lc` / `texto_propuesto` ↔ columnas futuras).
- **`data/ux/`:** `clarity-inventory.json`, `most-audited-urls.json`, `resolved-lc-states.json` como espejo de las listas de la UI; `README.md` con convención de mantenimiento frente a `frontend/src/lib/`.

### Próximos pasos:

- Según [`docs/ROADMAP.md`](../ROADMAP.md): **demo interna** con Equipo UX. Los **fixtures** quedaron implementados (ver [entrada 2026-05-21 — fixtures](#devlog-2026-05-21-fixtures-implementacion)). El ítem **Resultado mock** quedó cerrado (ver entrada [2026-05-20](#devlog-2026-05-20-resultado-mock-cierre)); el ítem **Estado intermedio** quedó cerrado (ver entrada [2026-05-21](#devlog-2026-05-21-estado-intermedio-procesando)); el ítem **Actualización de documentación con Equipo UX y tabla de criterios completa** quedó cerrado (ver entrada [2026-05-20](#devlog-2026-05-20-tabla-severidad-inventarios)).

---

<a id="devlog-2026-05-19-portal-home-mock"></a>
## [2026-05-19] - Frontend | Portal de acceso en `/` (mock v1.0)
### Contexto y objetivos:

Cerrar en código el ítem de Fase 1 **«Home (`/`) — portal de acceso institucional»**: pantalla tipo acceso Gobierno sin autenticación real, CTA hacia `/auditar`, sin duplicar el ingreso de URL en la portada.

### Implementación técnica:

- `frontend/src/app/page.tsx`: modal con colores fijos (`#0051A8`, barras `#0F69C4` / `#F63E32`), wordmark INAPI, bienvenida, botón «Acceder» con texto en el mismo azul modal; pie gris con referencia a checklist, CW 2.0, RLC y **Mock v1.0**.
- `frontend/src/app/layout.tsx`: se retira `SiteHeader` del layout raíz para que `/` no muestre cabecera.
- `frontend/src/app/auditar/layout.tsx`: se incorpora `SiteHeader` solo en el segmento `/auditar` (captura y resultado conservan cáscara con marca y controles).
- `docs/ROADMAP.md`: ítem Home marcado como completado.

### Próximos pasos:

- Implementar el ítem **`/auditar`** (ingreso URL, tres atajos a resultado, inventarios en acordeones según [`docs/DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md) §15) y el resto de pendientes de Fase 1 en [`docs/ROADMAP.md`](../ROADMAP.md).

---

<a id="devlog-2026-05-19-doc-flujo-auditar"></a>
## [2026-05-19] - Documentación | Flujo home gateway, `/auditar` (atajos, inventario Clarity) y barras colapsables
### Contexto y objetivos:

Alinear PRD, roadmap, arquitectura y datos de referencia a la **realidad del aplicativo**: evitar **dos pantallas** con la misma función (ingreso de URL). La **home `/`** queda como **portal de acceso institucional** (composición tipo auth Gobierno, **sin** login real en Fase 1) hacia **`/auditar`**. En **`/auditar`**: **ingreso de URL**, **tres atajos** (peor / intermedio / mejor LC) con navegación mock **directa a resultado**, inventario **~20 URLs Clarity** y otras **listas seccionadas** (**URLs más auditadas**, **URLs con estados resueltos**, etc.) documentadas para convivir en la misma pantalla como **barras / acordeones** con **título claro**, **flecha hacia abajo**, **contraste** institucional sin ruido y **`gap` vertical uniforme** entre secciones.

### Implementación técnica:

- [`docs/ROADMAP.md`](../ROADMAP.md): portal en `/`; ítem **`/auditar`** (URL, atajos, inventarios en barras colapsables, enlace a inventario UX); marco visual ajustado para no prometer barra de URL en `/`.
- [`docs/PRD.md`](../PRD.md) v0.3.3: requisitos Fase 1 de home vs `/auditar`, atajos a resultado, inventarios en acordeones.
- [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md) v0.5 y [`docs/DATABASE.md`](../DATABASE.md) v0.4.1: flujo mock, `url_index` orientado a **`/auditar`** e inventario en `docs/ux/`.
- Nuevo [`docs/ux/inventario-urls-clarity.md`](../ux/inventario-urls-clarity.md): tres URLs canónicas, tabla de 20 prioridades Clarity, §2.1 presentación en UI; URLs absolutas por completar donde falte.
- [`docs/DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md) v0.3.2: nueva **§15** (patrón barras colapsables en `/auditar`); renumeración §16–§17 (alcance MVP y referencias visuales).
- [`README.md`](../../README.md): pendientes Fase 1 alineados al mismo flujo.

### Próximos pasos:

- Implementar en `frontend/` la home tipo acceso, los atajos en `/auditar` y las **barras colapsables** de inventario según roadmap y [`docs/DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md) §15; completar enlaces absolutos del inventario cuando el equipo entregue la lista final.

---

<a id="devlog-2026-05-18-marco-visual-shell"></a>
## [2026-05-18] - Frontend | Marco visual institucional: cabecera, tema y lienzo global
### Contexto y objetivos:

Cerrar en el repo el ítem de Fase 1 del roadmap **«Marco visual institucional (prototipo de alta fidelidad)»**: cáscara común a portada, flujo `/auditar` y vistas mock, con jerarquía **cabecera → lienzo neutro → tarjetas**, tema claro/oscuro alineado a tokens §7 y modales de demostración sin simular autenticación real.

### Implementación técnica:

- `next-themes` y `frontend/src/components/ui/theme-provider.tsx`: proveedor con `attribute="class"`; `frontend/src/app/layout.tsx` con `suppressHydrationWarning` en `html` y cuerpo en columna con viewport estable.
- `frontend/src/components/theme-toggle.tsx`: alternancia claro/oscuro con `resolvedTheme`, `aria-label` en español y aplazamiento del estado de montaje para cumplir la regla `react-hooks/set-state-in-effect` (p. ej. `requestAnimationFrame`).
- `frontend/src/components/ui/dialog.tsx`: primitiva Radix con overlay `bg-background/60 backdrop-blur-sm` y panel con tokens `border-border` / `background` / `foreground`.
- `frontend/src/components/site-header.tsx`: cabecera sticky con wordmark INAPI (enlace a `/`), `ThemeToggle` y dos `Dialog` demo (usuario y configuración) con copy explícito de definición pendiente y botón «Cerrar».
- `frontend/src/app/layout.tsx`: `main` con `flex-1`, `min-h-0` y `bg-muted` bajo la cabecera para separar visualmente el lienzo de las `Card`.
- `frontend/src/app/auditar/layout.tsx` y `frontend/src/app/page.tsx`: eliminación de `min-h-dvh` y `bg-background` duplicados en el contenedor de página para no anular el lienzo `muted`.

### Próximos pasos:

- Según [`docs/ROADMAP.md`](../ROADMAP.md): **home** como portal de acceso a `/auditar`; en **`/auditar`**, barra de URL, **tres atajos** a resultado, inventarios en **barras colapsables** (§15 design system); luego barra térmica, estado intermedio, **demo UX** con Equipo UX (fixtures de auditoría ya implementados — ver [2026-05-21](#devlog-2026-05-21-fixtures-implementacion)).

---

<a id="devlog-2026-05-18-design-system-ui"></a>
## [2026-05-18] - Frontend | Design system en la interfaz y contenedor ancho del flujo /auditar
### Contexto y objetivos:

Cerrar en código el ítem de Fase 1 del roadmap sobre **design system Gobierno de Chile** en el frontend: tipografías institucionales, tokens de color y espaciado en tema global, contraste y objetivos táctiles (WCAG) en componentes reutilizables, y una **misma disposición ancha** en ingreso, captura y resultado del mock, sin cubrir aún barra térmica ni atajos de URL (otros bullets del roadmap).

### Implementación técnica:

- Tema en `frontend/src/app/globals.css`: variables §5 (`:root` y `.dark`), `--primary-hover`, enlaces en capa base, `spacing-kit` en `@theme` y fuentes enlazadas a variables de `next/font` en el `layout` raíz.
- `frontend/src/app/layout.tsx`: Roboto y Roboto Slab, metadatos INAPI y `lang="es"`.
- `frontend/src/components/ui/button.tsx`: tamaño por defecto con altura táctil ~44 px; variante primaria con hover y active vía `var(--primary-hover)`; tamaños `sm`, `lg` e iconos alineados al mismo criterio; `xs` más compacto desde el punto de ruptura `sm` donde aplica.
- Portada `frontend/src/app/page.tsx`: sustitución de la plantilla create-next-app por `Card` y CTA a `/auditar` con clases semánticas (`bg-background`, `text-foreground`, etc.).
- `frontend/src/app/auditar/layout.tsx`: envoltorio del segmento con `min-h-dvh`, fondo del tema y contenedor `max-w-5xl` con padding horizontal responsivo.
- `frontend/src/app/auditar/page.tsx`, `captura/page.tsx` y `resultado/page.tsx`: contenedor `w-full` sin duplicar `max-w` ni padding respecto al layout; mensajes de redirección y respaldos de `Suspense` sin `p-6` redundante; bordes de bloques con `border-border` donde corresponde.
- `frontend/tsconfig.json`: exclusión de `.next/dev/types` del `include` de TypeScript para que `tsc` no falle con el validador generado en modo desarrollo de Next.js 16.

### Contexto de errores o disyuntivas:

- **Tipografía y `@theme`:** en un momento `--font-sans` apuntaba a sí misma en el tema, con lo que el cuerpo caía en una fuente por defecto del motor (p. ej. serif). **Mitigación:** enlazar `--font-sans` y `--font-heading` en `@theme` a las variables que expone `next/font` en el `layout` raíz (`--font-roboto`, `--font-roboto-slab`).

- **`buttonVariants` (CVA):** se mezclaron clases de tamaño dentro de `variant.default` y se perdieron color y hover del primario; además faltó un `},` que cerrara `variants` antes de `defaultVariants`, y en un pegado `sm` y `lg` quedaron en la misma línea. **Mitigación:** separar estrictamente `variant` (semántica de color, hover con `var(--primary-hover)`) y `size` (altura, padding, texto); cerrar `size` y luego `variants`; una variante de tamaño por línea.

- **Typecheck con Next.js 16:** al incluir `.next/dev/types/**/*.ts` en `tsconfig`, `tsc` fallaba en el validador generado (`LayoutProps<Route>` frente a la unión de rutas de layout en desarrollo). **Mitigación:** quitar `.next/dev/types` del `include` y mantener la referencia de rutas hacia `./.next/types/routes.d.ts` en `next-env.d.ts` tras un build estable.

- **Flujo `/auditar`:** el ingreso usaba `max-w-lg` frente a captura/resultado más anchos; había `p-6` redundante en mensajes de redirección y en fallbacks de `Suspense` encima del padding del layout. **Mitigación:** `layout.tsx` del segmento con `max-w-5xl` y padding horizontal único; páginas con `flex w-full flex-col gap-6` sin segundo `max-w` ni `p-6` en esos textos.

### 💡 Repaso técnico: Layout anidado y tokens:

El layout del segmento `auditar` concentra ancho y márgenes; las páginas hijas solo distribuyen el contenido (`flex`, `gap`), de modo que la tarjeta y el campo de URL usan el ancho útil y se alinean con la tabla del resultado.

### Próximos pasos:

- Según [`docs/ROADMAP.md`](../ROADMAP.md): portal en **`/`**, ingreso y **tres atajos** en **`/auditar`**, inventarios en **barras colapsables** (§15 design system), barra térmica y bloques de resultado mock, estado intermedio de carga, **demo UX** con Equipo UX (fixtures JSON ya en repo — [2026-05-21](#devlog-2026-05-21-fixtures-implementacion)), con notas en este devlog o en `docs/`.

---

<a id="devlog-2026-05-16-documentacion"></a>
## [2026-05-16] - Documentación | Alineación con propuesta técnica integral y AWS
### Contexto y objetivos:

Registrar en el repo los acuerdos de la última reunión (oficina / transferencia desde entorno restringido): integración **NestJS ↔ Amazon API Gateway ↔ Lambda (Python) ↔ Claude API**, roles, Docker para desarrollo local del servicio de IA y monorepo objetivo frente al layout actual (`frontend/`, `src/schemas/`).

### Implementación técnica:

- Nuevo documento [`docs/PROPUESTA_TECNICA_INTEGRAL.md`](../PROPUESTA_TECNICA_INTEGRAL.md) (sustituye el nombre previo `PROUESTA_*`) con §1.1 **estado del repositorio** vs carpetas `apps/` y `packages/contracts`.
- [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md) v0.4: diagrama mermaid Nest–API Gateway–Lambda–Claude, tabla monorepo actual vs objetivo, §desarrollo local con Docker.
- [`docs/adr/0006-lc-evaluation-python-claude-aws.md`](../adr/0006-lc-evaluation-python-claude-aws.md): preferencia API Gateway + Lambda, preguntas abiertas §5, enlace a la propuesta técnica.
- [`docs/DATABASE.md`](../DATABASE.md) v0.4: principio de escritura **solo Nest + Prisma**; metadatos de evaluación vía AWS.
- [`docs/PRD.md`](../PRD.md) v0.3.1: stack y párrafo de flujo Fase 2 alineados a la integración AWS.
- [`docs/ROADMAP.md`](../ROADMAP.md): Fase 2 ampliada con bullets de integración, Docker, monorepo y enlace a la propuesta; fecha de actualización.
- [`README.md`](../../README.md): índice con propuesta técnica y nota sobre contratos en `src/schemas/`.

### Próximos pasos:

- **Fase 1 (código):** design system en UI; portal **`/`**; **`/auditar`** con URL, tres atajos, inventarios en barras colapsables (§15 design system); barra térmica y **fixtures** según [`docs/ROADMAP.md`](../ROADMAP.md) (implementados en [2026-05-21](#devlog-2026-05-21-fixtures-implementacion)).
- **Fase 2:** cerrar con desarrollo backend / TI las preguntas abiertas del ADR 0006 (auth, Lambda vs ECS, Pydantic).

---

<a id="devlog-2026-05-14-pantallas-mock"></a>
## [2026-05-14] - Frontend | Fase 1: Pantallas mock del flujo auditar (captura y resultado con 39 criterios)
### Contexto y objetivos:

Cerrar el segundo ítem de la Fase 1 del roadmap: flujo **URL → texto capturado (mock) → resultado** sin backend, pasando el estado por **query string** para poder demo y pruebas rápidas.

### Implementación técnica:

- Ruta `frontend/src/app/auditar/captura/page.tsx`: lectura de `?url=` con `useSearchParams`, redirección con `router.replace` si falta el parámetro, texto mock y enlace a resultado con la misma URL codificada.
- Ruta `frontend/src/app/auditar/resultado/page.tsx`: `Suspense` + `useMemo` para decodificar URL y construir auditoría con `buildDemoStrictAudit` desde `@contracts/checklist`; tabla HTML de **39** filas sobre `criterios_evaluados` y resumen de cumplimiento.
- Ajuste en `frontend/src/app/auditar/page.tsx`: `useRouter` en el cuerpo del componente y `router.push` hacia captura tras validación Zod + RHF.

### 💡 Repaso técnico: Query string y hooks en Next:

- `useSearchParams` solo en cliente (`"use client"`); el contenedor `Suspense` evita problemas de render/hidratación al depender de la URL.
- Los datos del mock viajan en `url` codificada; no hace falta estado global hasta integrar API o sesión.

### Contexto de errores o disyuntivas:

- **ESLint `react-hooks/rules-of-hooks` en `frontend/src/app/auditar/resultado/page.tsx`:** el `useMemo` que armaba la auditoría con `buildDemoStrictAudit` quedaba **después** de `return` tempranos (sin `url` decodificable o URL inválida para `new URL`), de modo que ese hook **no** se llamaba en todos los renders y violaba la regla de orden fijo de hooks. **Mitigación:** encadenar **tres** `useMemo` al inicio del componente (`urlDecoded` → `auditUrl` → `auditoria`, devolviendo `null` cuando no aplique) y **solo después** hacer `router.replace` y los `return` de redirección o la UI con tabla. Con eso `bun run lint` pasa sin errores.

### Próximos pasos:

- **Fase 1, punto 3 (cerrado en [2026-05-21](#devlog-2026-05-21-fixtures-implementacion)):** fixtures JSON en `data/audit-fixtures/` validados con `strictAuditRecordSchema`, API, importación en UI y validación en `typecheck:all`.
- Opcional: columnas con descripción del criterio leyendo `data/checklist-criteria.json`.

---

<a id="devlog-2026-05-14-inicializacion-frontend"></a>
## [2026-05-14] - Frontend | Fase 1: Inicialización del frontend con Next, Tailwind, shadcn y formulario URL
### Contexto y objetivos:

Cerrar el primer ítem de la Fase 1: stack de UI y **primer formulario** alineado al PRD (solo dominios `inapi.cl` / `tramites.inapi.cl`), con validación **Zod** y **React Hook Form**, sobre la carpeta `frontend/` del monorepo Bun.

### Implementación técnica:

- Dependencias en `frontend/package.json`: Next 16, Tailwind v4, shadcn (CLI y componentes `field`, `button`, `input`, `card`, etc.), `react-hook-form`, `@hookform/resolvers`, `zod`.
- Esquema `frontend/src/lib/schemas/url-audit.ts` con refinamiento de host permitido y mensajes en español.
- Página `frontend/src/app/auditar/page.tsx` con `Controller`, `zodResolver` y componentes `Field` de shadcn.
- Enlace en `frontend/src/app/page.tsx` hacia `/auditar` con `next/link`.

### Contexto de errores o disyuntivas:

- Peticiones `GET /mockServiceWorker.js` **404** en desarrollo: proceden de herramientas o extensiones que buscan MSW; no forman parte de la app.
- Aviso del navegador sobre `vercel.svg` (proporción de imagen): proviene de la plantilla por defecto de la home, no del flujo auditar.
- Regla de hooks: `useRouter` no debe invocarse dentro de `onSubmit`; se movió al cuerpo del componente para cumplir React y evitar advertencias de lint.

### Próximos pasos:

- Implementar pantallas de captura y resultado (entrada siguiente del devlog); **fixtures** de auditoría quedaron en [2026-05-21](#devlog-2026-05-21-fixtures-implementacion).

---

<a id="devlog-2026-05-13-fase-0"></a>
## [2026-05-13] - Estrategia | Fase 0: Documentación y contratos del repositorio
### Contexto y objetivos:

Dejar cerrada la **Fase 0** del roadmap: base de producto y de arquitectura por escrito, **contratos de datos** alineados al checklist editorial v1.1 (39 criterios) y herramientas en repo para validar el catálogo antes de introducir Next.js y el mock de interfaz, sin backend productivo.

### Implementación técnica:

- **Documentación y decisiones:** `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DATABASE.md`, `docs/DESIGN_SYSTEM.md`, `docs/ROADMAP.md`, ADR en `docs/adr/` (stack Next/Bun/Supabase, mocks contract-first con Zod, evaluación LLM y versión de prompts, API NestJS/Prisma).
- **Catálogo y esquemas:** `data/checklist-criteria.json` como fuente de los 39 criterios; `src/schemas/checklist.ts` con esquemas Zod, tipos, helpers (`buildDemoEvaluations`, `buildDemoStrictAudit`, `strictAuditRecordSchema`, etc.).
- **Validación en CI/local:** script `src/scripts/validate-checklist-data.ts` y script en `package.json` raíz (`validate:checklist`) para comprobar el JSON contra Zod.

### 💡 Repaso técnico: Enfoque contract-first:

- Los mismos contratos (`checklist-criteria` + Zod) deben alimentar mocks de UI, prompts y futura capa de datos, para no desalinear el MVP entre documentación y código.

### Próximos pasos:

- Fase 1: mock UX en `frontend/` (Next, Tailwind, shadcn, flujo por URL), tal como figura después en el roadmap.

---