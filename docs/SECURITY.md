# Seguridad y datos — LC INAPI MVP

**Última actualización:** 2026-08-21

Resumen de **qué se cuida hoy** con el stack Claude Code + Vercel (sin Nest, sin Supabase Auth, sin Claude API operativa).

**Propuestas antiguas** (Nest, RLS Supabase, auth de servicio hacia Lambda): **no contempladas** en el MVP — ver [ADR 0006](adr/0006-lc-evaluation-python-claude-aws.md).

---

## 1. Política de datos en el repositorio

- Fixtures y docs UX: **sin** RUN, nombres, correos ni volcados de personas reales (ficticios o anonimizados).  
- Secretos: nunca en `NEXT_PUBLIC_*` ni en commits.  
- No hay service role Supabase ni API key Anthropic en el camino productivo del MVP.  
- Worker: `AUDIT_JOBS_WORKER_SECRET` solo en entorno local / servidor del PC (no commitear).

---

## 2. Higiene ya aplicada

| Tema | Detalle |
| --- | --- |
| `.gitignore` | `.env*`, `.vercel/`, credenciales, cobertura, Playwright, `documentos/`, `rag/chroma_db/`, `auditorias/.auth/` |
| Cliente | Sin loguear URLs ingresadas en consola |
| API fixtures | Allowlist de `fixtureId` |
| CI | `typecheck:all` + `lint` + install frozen |
| JSON canónico | Anonimizar PII en citas/sustituciones; auditor = texto libre |

---

## 3. Garantías del stack IA local

| Garantía | Mecanismo |
| --- | --- |
| Normativa no “sube” a la nube como PDF | Chroma + contexto local; ingest en WSL/PC |
| PDFs fuera de git | `documentos/` gitignore |
| Vectores fuera de git | `rag/chroma_db/` gitignore |
| Embeddings offline | `@xenova/transformers` en CPU |
| Colecciones A/B aisladas | `ingest:a` / `ingest:b` separados |
| Sensibles fuera del RAG | RUT, marcas, anterioridades, credenciales |
| Sesión ClaveÚnica | `storageState` solo en disco local gitignore |
| Criterios LC públicos vs post-login | Reglas §19 CLAUDE.md (datos del solicitante ≠ incumplimiento G1-equivalente) |

Checklist vigente: **51** `LC-*` v3.0. Calibraciones CMS (§22) evitan jerga HTML como mensaje principal.

---

## 4. MVP sin login — riesgos aceptados y mitigaciones

| Riesgo | Mitigación |
| --- | --- |
| URL pública de demo encolable | Secreto worker; horario 8–18; uso interno INAPI |
| Disco Vercel efímero | Jobs/auditorías largas en PC ([ADR 0011](adr/0011-worker-local-on-demand-vercel.md)) |
| Import JSON abusivo | Validación Zod; tamaño razonable en UI |

### Endurecimiento opcional (UI), no “backend Nest”

- Cabeceras HTTP (CSP, etc.) en Next cuando el dominio sea estable.  
- Rate limit / tamaño máximo en import JSON.  
- Revisión de dependencias y secret scanning en GitHub.

**No** planificar Supabase RLS ni auth Nest como siguiente paso obligatorio.

---

## 5. Referencias

| Documento | Contenido |
| --- | --- |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Capas del stack |
| [despliegue/despliegue-hibrido.md](despliegue/despliegue-hibrido.md) | Vercel + GitHub + Claude |
| [DATABASE.md](DATABASE.md) | Persistencia JSON |
| [fase-3-3-captura-auth-claveunica.md](fase-3-3-captura-auth-claveunica.md) | Sesión Playwright |
| [contratos-audit-jobs.md](contratos-audit-jobs.md) | Secreto worker |
