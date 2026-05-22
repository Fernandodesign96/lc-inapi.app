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

---

## 3. Pendiente tras despliegue híbrido y backend (checklist)

Plan operativo por etapas (Vercel, Actions, Supabase, Nest, AWS): [`despliegue/despliegue-hibrido.md`](despliegue/despliegue-hibrido.md).

Aplicar cuando Vercel, GitHub Actions, Nest y Supabase estén en uso; conviene asignar responsable (TI / desarrollo).

- [ ] **Cabeceras HTTP** en Next (CSP, `frame-ancestors` / anti-clickjacking, HSTS en dominio definitivo).
- [ ] **CORS** explícito en Nest; orígenes solo front y herramientas acordadas.
- [ ] **Autenticación** en rutas que sirvan datos de auditoría o fixtures no públicos.
- [ ] **Rate limiting** en API pública y en Gateway hacia evaluación LLM.
- [ ] **Tamaño máximo** de cuerpos JSON (importación en UI y payloads Nest) para reducir abuso DoS.
- [ ] **Variables de entorno** en panel de deploy: mínimo privilegio, rotación, sin `LC_REPO_ROOT` u otras rutas controlables por atacante sin control de cambios.
- [ ] **Supabase RLS** y políticas según [`docs/DATABASE.md`](DATABASE.md).
- [ ] **Nest ↔ API Gateway / Lambda:** autenticación de servicio (IAM, JWT de servicio, mTLS) según [`docs/PROPUESTA_TECNICA_INTEGRAL.md`](PROPUESTA_TECNICA_INTEGRAL.md) §5.
- [ ] **Revisión de dependencias** (CI con auditoría opcional) y secret scanning en GitHub.

---

## 4. Referencias

| Documento | Contenido relacionado |
| --- | --- |
| [`docs/ARCHITECTURE.md`](ARCHITECTURE.md) | Capas, secretos en servidor |
| [`docs/DATABASE.md`](DATABASE.md) | RLS, roles |
| [`data/audit-fixtures/README.md`](../data/audit-fixtures/README.md) | Regeneración de fixtures y privacidad |
