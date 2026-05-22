# Despliegue híbrido (Vercel + GitHub Actions + Supabase + Nest + AWS LC)

**Origen:** plan de trabajo alineado al acuerdo del equipo (referencia interna: plan Cursor `despliegue_híbrido_03b45f72`).

**Resumen:** despliegue por etapas — Next.js en Vercel (previews y producción del mock), GitHub Actions como CI u orquestación, Supabase al entrar Fase 2, API Nest en Railway o AWS según decisión, y pipeline LC en AWS según ADRs; incluye cuidados del monorepo Bun, fixtures (`LC_REPO_ROOT`) y documentación en repo.

**Seguridad complementaria:** [`../SECURITY.md`](../SECURITY.md).

---

## Checklist de etapas (seguimiento manual)

- [ ] **Etapa 0:** cerrar Nest en Railway vs AWS (nota en ROADMAP/ADR); cuentas GitHub / Vercel / Supabase / AWS según TI.
- [ ] **Etapa 1.1:** proyecto Vercel (root `frontend` o equivalente), install/build Bun monorepo, env `LC_REPO_ROOT`, probar API fixtures.
- [ ] **Etapa 1.2:** workflow `.github/workflows/` (`typecheck:all` + `lint`); opcional deploy Vercel desde Actions con secretos.
- [ ] **Etapa 1.3:** verificación manual flujo mock / fixture / import en URL preview.
- [ ] **Etapa 2:** proyecto Supabase + env en Vercel/Nest según `DATABASE.md` y ADR 0005.
- [ ] **Etapa 3:** desplegar Nest en Railway o AWS + CORS + variables a Supabase y AWS LC.
- [ ] **Etapa 4:** pipeline LC en AWS según ADR 0006 e integración Nest ↔ API Gateway.
- [ ] **Etapa 5:** README sección despliegue; ROADMAP/ARCHITECTURE; devlog al cierre si aplica.

---

## Contexto del repo (relevante para el plan)

- Monorepo **Bun** en raíz: [`package.json`](../../package.json) con `workspaces: ["frontend"]`, scripts `typecheck:all`, `build` → `bun run --cwd frontend build`.
- Next **App Router** y API de fixtures: ruta dinámica `frontend/src/app/api/audit-fixtures/[fixtureId]/route.ts` ([abrir en repo](../../frontend/src/app/api/audit-fixtures/%5BfixtureId%5D/route.ts)) lee `data/audit-fixtures/*.json` con `LC_REPO_ROOT ?? join(process.cwd(), "..")` — en Vercel hay que garantizar que exista **`data/`** en el árbol de despliegue y, si el `cwd` no es `frontend/`, definir **`LC_REPO_ROOT`** (ver también [`data/audit-fixtures/README.md`](../../data/audit-fixtures/README.md)).
- Arquitectura objetivo ya descrita en [`../ARCHITECTURE.md`](../ARCHITECTURE.md), [`../ROADMAP.md`](../ROADMAP.md) y ADRs (p. ej. [ADR 0006](../adr/0006-lc-evaluation-python-claude-aws.md), [ADR 0005](../adr/0005-api-backend-nestjs-prisma.md)): **Nest + Prisma + Supabase**; evaluación LC vía **AWS** (API Gateway + Lambda + Claude).

```mermaid
flowchart LR
  subgraph ux [Fase_demo_UX]
    GH[GitHub]
    GHA[GitHub_Actions]
    V[Vercel_Next]
  end
  subgraph f2 [Fase_2]
    SB[Supabase]
    Nest[Nest_Railway_o_AWS]
  end
  subgraph lc [Pipeline_LC]
    AWS[AWS_API_Gateway_Lambda_Claude]
  end
  GH --> GHA
  GH --> V
  V --> SB
  V --> Nest
  Nest --> SB
  Nest --> AWS
```

---

## Etapa 0 — Alineación interna (sin código obligatorio)

- **Decisión TI / liderazgo:** ¿Nest en **Railway** (simplicidad) o **AWS** (misma nube que Lambda LC) cuando exista código? El mock de UX **no la bloquea**; conviene anotarla en [`../ROADMAP.md`](../ROADMAP.md) o ADR corto cuando se cierre.
- **Cuentas:** GitHub (repo), Vercel (equipo o proyecto), más adelante Supabase y AWS según política INAPI.
- **Costes:** asumir **tiers gratuitos / prueba** para demo UX; producción revisar precios oficiales de Vercel, Supabase, Railway/AWS y uso de Claude.

---

## Etapa 1 — Demo UX y CI: **Next en Vercel** + **GitHub Actions**

Objetivo: URL estable o preview por rama para Equipo UX; calidad reproducible en CI.

### 1.1 Proyecto Vercel (Next)

- Crear proyecto en **Vercel** importando el **mismo repo** de GitHub.
- **Root Directory:** `frontend` (o raíz del repo si preferís un `vercel.json` en raíz que delegue; lo habitual con monorepo es **root = `frontend`**).
- **Install:** debe ejecutar **`bun install` en la raíz del monorepo** (donde está el workspace), no solo dentro de `frontend` sin el lockfile raíz — en el panel de Vercel ajustar **Install Command** (p. ej. `cd .. && bun install` si el root del proyecto en Vercel es `frontend`, según cómo Vercel clone el repo; verificar en la primera build fallida y corregir).
- **Build Command:** coherente con [`package.json`](../../package.json) raíz (`bun run build` desde raíz ya delega en `frontend`) o equivalente explícito.
- **Variables de entorno en Vercel (Preview y Production):**
  - **`LC_REPO_ROOT`:** apuntando a la raíz del checkout donde existan `data/` y `src/` si en runtime `process.cwd()` no deja leer fixtures (probar `/api/audit-fixtures/...` tras el primer deploy).
- **Probar** en local el mismo comando que usará Vercel antes de confiar en el panel.

### 1.2 GitHub Actions (orquestación)

- Añadir workflow en **`.github/workflows/`** (p. ej. `ci.yml` o `frontend-ci.yml`):
  - **Disparadores:** `push` y `pull_request` a ramas acordadas; opcional `workflow_dispatch`.
  - **Pasos:** `checkout`, `setup-bun`, `bun install` (raíz), `bun run typecheck:all`, `bun run lint` (ya definido en raíz contra `frontend`).
- **Opción A (solo CI):** el deploy lo hace **Vercel** al hacer push (integración GitHub–Vercel); Actions solo valida.
- **Opción B (CI + deploy desde Actions):** tras el build, paso con **Vercel CLI** o acción oficial usando secretos `VERCEL_TOKEN` / IDs de proyecto en **GitHub → Settings → Secrets and variables → Actions** (todo el flujo “visible” desde la pestaña Actions).

Elegir A o B según preferencia de equipo (menos secretos vs. un solo sitio para ver pipelines).

### 1.3 Verificación funcional post-deploy

- Abrir `/`, `/auditar`, flujo **mock**, **fixture JSON** y **import JSON** en la URL de preview.
- Si fixtures devuelven 404: revisar logs del **route handler** y `LC_REPO_ROOT` / inclusión de `data/audit-fixtures/` en el artefacto desplegado.

---

## Etapa 2 — **Supabase** (cuando arranque Fase 2 en código)

- Crear **proyecto Supabase** (dev/staging primero).
- Variables en **Vercel** (y luego en Nest): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`; secretos **solo servidor** para service role / Nest (nunca `NEXT_PUBLIC_*` para claves sensibles).
- Conectar según [`../DATABASE.md`](../DATABASE.md) y RLS; Nest + Prisma contra el Postgres de Supabase según [ADR 0005](../adr/0005-api-backend-nestjs-prisma.md).

---

## Etapa 3 — **Nest** (API de dominio): Railway **o** AWS

- **Si Railway:** servicio contenedor o Node con el repo del backend; variables de entorno a Supabase y a URL del servicio Python/AWS cuando exista.
- **Si AWS (ECS/Fargate, App Runner, EC2, etc.):** alinear con política TI y con el mismo VPC/endpoints que Lambda si aplica.
- **Contrato HTTP** front ↔ Nest según [`../ARCHITECTURE.md`](../ARCHITECTURE.md); CORS y URLs de Vercel (preview vs production) documentados.

---

## Etapa 4 — **Pipeline LC en AWS** (evaluación asistida)

- Seguir [ADR 0006](../adr/0006-lc-evaluation-python-claude-aws.md) y [propuesta técnica](../PROPUESTA_TECNICA_INTEGRAL.md): API Gateway, Lambda Python, Claude; autenticación servicio-a-servicio con Nest por definir.
- **No sustituye** el hosting del front en Vercel: Nest invoca AWS; el front sigue hablando principalmente con Nest (o Server Actions acotadas).

---

## Etapa 5 — Documentación en el repo

- **[`README.md`](../../README.md):** sección corta “Despliegue / preview” (rama, Vercel, enlace a Actions, recordatorio `LC_REPO_ROOT`).
- **[`docs/ROADMAP.md`](../ROADMAP.md):** marcar o detallar el hito de demo/deploy cuando esté operativo.
- Opcional: una línea en [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md) diagramando **Vercel (Next) → Nest → Supabase / AWS** cuando Nest exista.

---

## Orden recomendado de ejecución práctica

1. Etapa 0 (decisión Nest: anotar; no bloquea UX).
2. Etapa 1.1 → 1.3 (URL para UX + CI Actions).
3. Tras aprobación mock: Etapa 2 + 3 + 4 según roadmap de producto.
4. Etapa 5 en cada cierre relevante (commit/PR que ya comentasteis para documentación + devlog).

---

## Riesgos / puntos de atención

- **Monorepo Bun:** install/build en CI y en Vercel deben usar la **raíz** del workspace para no romper `@contracts/checklist`.
- **Fixtures en serverless:** dependen del filesystem del deploy y de `LC_REPO_ROOT`; validar en preview antes de la demo.
- **CORS y URLs:** cuando exista Nest, las previews de Vercel tienen dominios distintos a producción; hay que permitirlos explícitamente en Nest.
