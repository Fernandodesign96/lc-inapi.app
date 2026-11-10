# Informe: Anexo medios de verificación vs 11 URLs + avisos

**Fecha:** 2026-11-09  
**Fuente:** `Anexo_ orientación para la construcción de medios de verificación de los hitos del plan de TD (3).xlsx` — hoja **D. Calidad web**  
**Alcance contrastado:** 11 URLs META MEI + auditoría de avisos de mantenimiento/informativos

## Resumen ejecutivo

El piloto LC (checklist PTD-LC v3.0, 51 criterios) **cubre bien** la dimensión de **contenido / lenguaje claro / formularios / rótulos** de D2.1 (sitios) y D2.2 (servicios digitales). **No cumple por sí solo** el anexo completo: faltan medios de verificación técnicos (uptime, PageSpeed, W3C, TLS, capturas de a11y instrumental, grabaciones cortas) y varios hitos de arquitectura, búsqueda, móvil, transparencia y promoción que el checklist LC no mide o solo toca de forma parcial.

**Veredicto:** el trabajo actual **no basta** para declarar «cumplido» el anexo D. Calidad web. Sirve como **paquete fuerte de evidencia de contenido** (PDF/Word/Excel LC) que puede anexarse a muchos hitos de lenguaje/usabilidad editorial, pero hay **gaps obligatorios** antes de subir a la plataforma STD.

## Qué sí aporta el piloto (11 URLs + avisos)

| Familia anexo | Cobertura aproximada del piloto |
| --- | --- |
| Contenido / lenguaje claro / jerga / datos clave | Alta — núcleo del checklist LC |
| Formularios, confirmaciones, plazos, FAQ servicio | Alta en trámites (SIAC, portal, solicitud) |
| Rótulos / CTA descriptivos | Alta (`LC-5.2.4-01`) |
| Fecha de actualización en pie | Parcial/alta según URL (`LC-1.1.4-01`) |
| Documentos PDF (peso/descripción) | Parcial (`LC-1.2.4-07/08`) |
| Avisos de mantención (copy) | Nueva auditoría 130 avisos (solo texto) |
| Evidencia en PDF de informe + Word de correcciones | Alineado a regla «evidencia en PDF» del Resumen del anexo (para hallazgos LC) |

## Gaps prioritarios (faltan para el anexo)

1. **Disponibilidad continua / uptime** — captura de herramienta (UptimeRobot/Freshping, 7–30 días). Cruzar ventanas con `Avisos Sistemas.xlsx` (ya auditado el copy; falta el informe de uptime).
2. **Rendimiento** — PageSpeed Insight >60 desktop+móvil; peso home; tiempos de carga.
3. **Validación técnica** — W3C HTML/CSS, UTF-8/`lang`, sin errores graves de consola JS, enlaces rotos.
4. **HTTPS / TLS / redirecciones** — certificado válido, HTTP→HTTPS, www/non-www, dominios alternativos.
5. **Accesibilidad instrumental** — contraste, zoom 200 %, teclado+foco visible, alt text sistemático (el LC toca algo de claridad, no sustituye auditoría a11y).
6. **Arquitectura de información** — breadcrumbs, sitemap, ≤3 clics, menú persistente (parcialmente observado, sin medio de verificación dedicado).
7. **Búsqueda** — caja visible, sin resultados, sugerencias (sobre todo D2.1).
8. **Móvil / responsive** — capturas explícitas de viewport móvil.
9. **Transparencia / datos abiertos / lobby** (D2.1) — fuera del alcance LC actual.
10. **Grabaciones cortas** — cuando el medio lo pide: alojar en URL externa y citar en el PDF STD.
11. **D2.3 SIMPLE** — solo si aplica; hoy no está en la muestra 11 URLs.
12. **Hojas PA y Gestión del anexo** — oficios, madurez de datos, etc.: **fuera** del front; no las cubre este repo.

## Avisos vs hito de disponibilidad

- La auditoría `avisos-sistemas-tramites_2026-11-10` mejora el **copy** de los 130 avisos (21 plantillas; cada propuesta conserva los hechos y la fecha/hora de cada ID — C-2026-11-10a). Reemplaza a `avisos-sistemas-tramites_2026-11-09` (queda en historial).
- **No reemplaza** el medio de verificación de uptime: hace falta el reporte de monitoreo + narrativa de ventanas anunciadas.

## Recomendación de siguiente paso

1. Empaquetar por URL (y avisos) un PDF STD con: informe LC + Word de correcciones + capturas ya generadas.  
2. Abrir un backlog técnico solo para gaps 1–5 (uptime, PageSpeed, W3C, TLS, a11y).  
3. No marcar hitos D. Calidad web como «cumplidos» hasta adjuntar esos medios.

## Estado de entregables LC (esta iteración)

| Entregable | Estado |
| --- | --- |
| SIAC Word agrupado (C-2026-11-09a) | Listo (65,7 %) |
| Portal Word (URL 11) | Preexistente |
| Avisos PDF/Word/Excel vía UI | JSON + Word listos (42,9 %, rechazado); PDF/Excel vía `/auditar/resultado?claudeAudit=avisos-sistemas-tramites_2026-11-10` |
| Anexo completo STD | **Pendiente** (gaps arriba) |
