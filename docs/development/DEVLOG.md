# Devlog — auditoría LC INAPI

Bitácora de decisiones de implementación, aprendizajes y bloqueos. Las entradas más recientes van **arriba**. Formato obligatorio: ver `.agents/workflows/devlog-standard.md`.

---

## Índice de avances

| Fecha | Entrada |
| --- | --- |
| 2026-05-14 | Pantallas mock del flujo auditar (captura y resultado con 39 criterios) |
| 2026-05-14 | Inicialización del frontend con Next, Tailwind, shadcn y formulario URL |
| 2026-05-13 | Documentación y contratos de la fase 0 (PRD, ADR, checklist y script de validación) |

---

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

- Fase 1, punto 3: fixtures JSON validados con `strictAuditRecordSchema` y carga o validación en CI.
- Opcional: columnas con descripción del criterio leyendo `data/checklist-criteria.json`.

---

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

- Implementar pantallas de captura y resultado (entrada siguiente del devlog) y, después, fixtures.

---

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