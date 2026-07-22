# Seguridad y datos — LC INAPI (Fase 1 mock → Fase 2+)

**Última actualización:** 2026-05-22

Este documento resume **qué ya se cuida en el repo**, **qué se endureció en la Fase 1 mock**, y **qué falta afinar** cuando exista despliegue público, backend (Nest), Supabase y el pipeline de evaluación.

---

## 1. Política de datos en el repositorio

- **Fixtures y documentación UX:** no incluir **RUN, nombres propios, correos ni volcados** que identifiquen a personas reales. Usar **personas y documentos ficticios** o material **anonimizado** acordado con TI/legal.
- **Secretos:** nunca en `NEXT_PUBLIC_*` ni en commits. Service role de Supabase, claves Anthropic y similares solo en **entorno servidor** (ver [`docs/ARCHITECTURE.md`](ARCHITECTURE.md)).

---

## 2. Ya aplicado en Fase 1 (higiene)

| Tema | Detalle |
| --- | --- |
| `.gitignore` | Patrones ampliados: `.env*`, excepción `!.env.example`, `.vercel/`, credenciales típicas (`*.pem`, `service-account*.json`, …), artefactos de cobertura y Playwright. |
| Cliente | Sin `console.log` de URLs ingresadas en `/auditar` (evita fugas a consola y logs agregados). |
| Fixture Notificaciones | JSON y doc UX alineados a **identidades ficticias**; `evaluador_uid` coherente con otros fixtures (`fixture@inapi.cl`). |
| API fixtures | Allowlist de `fixtureId` en `GET /api/audit-fixtures/[fixtureId]` (mitiga path traversal); revisar auth y límites al exponer datos sensibles en producción. |
| CI (GitHub Actions) | Workflow `CI` en `.github/workflows/ci.yml`: instalación con lock congelado, `typecheck:all` y `lint` en cada `push`/`pull_request` acordado (ver [README](../README.md) § despliegue). |

---

## 3. Garantías del stack local IA (Fases 0–4)

El stack de orquestación IA corre íntegramente en local (WSL). Las siguientes garantías son **arquitectónicas**, no solo reglas de configuración.

| Garantía | Mecanismo |
| --- | --- |
| Ningún documento interno sale a internet | Todo el procesamiento corre en WSL; Chroma es un proceso local en el puerto 8000 |
| Los PDFs normativos no se versionan | `documentos/` está en `.gitignore`; solo existe localmente y en el servidor TI |
| Los vectores no se versionan | `rag/chroma_db/` está en `.gitignore` |
| Los embeddings no llaman a APIs externas | `@xenova/transformers` corre 100 % offline en CPU tras la descarga inicial del modelo |
| Claude Code no envía los PDFs a Anthropic | Los documentos se leen como texto en el contexto local de la sesión de WSL |
| Colecciones A y B completamente aisladas | Scripts de ingesta separados (`ingest-a.ts` / `ingest-b.ts`); colecciones Chroma distintas; barrera arquitectónica, no solo configuración |
| Datos sensibles INAPI fuera del RAG | RUT/RUN, solicitudes de marca, resultados del buscador de anterioridades, credenciales y tokens nunca se ingresan en las colecciones |
| Caso G1 (datos en HTML) | Se detecta como incumplimiento del criterio; no se almacena en el RAG ni en el repo |

---

## 4. Pendiente — frontend y backend (fases posteriores no iniciadas)

La **Etapa 1** del plan (Vercel + CI + piloto) quedó operativa. Los ítems siguientes aplican cuando exista un **backend de dominio** (Railway), **Supabase** y exposición pública más exigente. En las **Fases 0–4 actuales** (orquestación local con Claude Code Pro) no hay backend desplegado que los requiera.

Plan operativo por etapas: [`despliegue/despliegue-hibrido.md`](despliegue/despliegue-hibrido.md).

- [ ] **Cabeceras HTTP** en Next (CSP, `frame-ancestors` / anti-clickjacking, HSTS en dominio definitivo).
- [ ] **CORS** explícito en el backend; orígenes solo front y herramientas acordadas.
- [ ] **Autenticación** en rutas que sirvan datos de auditoría o fixtures no públicos.
- [ ] **Rate limiting** en API pública.
- [ ] **Tamaño máximo** de cuerpos JSON (importación en UI) para reducir abuso DoS.
- [ ] **Variables de entorno** en panel de deploy: mínimo privilegio, rotación.
- [ ] **Supabase RLS** y políticas según [`docs/DATABASE.md`](DATABASE.md) — cuando exista Supabase.
- [ ] **Autenticación de servicio** entre el backend y el servidor TI / MCP server — cuando exista backend.
- [ ] **Revisión de dependencias** (CI con auditoría opcional) y secret scanning en GitHub.

---

## 5. Referencias

| Documento | Contenido relacionado |
| --- | --- |
| [`docs/ARCHITECTURE.md`](ARCHITECTURE.md) | Capas, secretos en servidor |
| [`docs/despliegue/despliegue-hibrido.md`](despliegue/despliegue-hibrido.md) | Plan de despliegue por etapas y checklist |
| [`docs/DATABASE.md`](DATABASE.md) | RLS, roles |
| [`data/audit-fixtures/README.md`](../data/audit-fixtures/README.md) | Regeneración de fixtures y privacidad |
