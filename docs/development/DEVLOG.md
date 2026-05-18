# Devlog — auditoría LC INAPI

Bitácora de decisiones de implementación, aprendizajes y bloqueos. Las entradas más recientes van **arriba**. Formato obligatorio: ver `.agents/workflows/devlog-standard.md`.

---

## Índice de avances

| Fecha | Entrada |
| --- | --- |
| 2026-05-19 | [Design system en la interfaz y contenedor ancho del flujo /auditar](#devlog-2026-05-19-design-system-ui) |
| 2026-05-16 | [Documentación alineada a propuesta técnica integral (AWS API Gateway, Lambda, roles)](#devlog-2026-05-16-documentacion) |
| 2026-05-14 | [Pantallas mock del flujo auditar (captura y resultado con 39 criterios)](#devlog-2026-05-14-pantallas-mock) |
| 2026-05-14 | [Inicialización del frontend con Next, Tailwind, shadcn y formulario URL](#devlog-2026-05-14-inicializacion-frontend) |
| 2026-05-13 | [Documentación y contratos de la fase 0 (PRD, ADR, checklist y script de validación)](#devlog-2026-05-13-fase-0) |

---

<a id="devlog-2026-05-19-design-system-ui"></a>

## [2026-05-19] - Frontend | Design system en la interfaz y contenedor ancho del flujo /auditar

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

- Según [`docs/ROADMAP.md`](../ROADMAP.md): home con **barra principal** y **tres atajos** de URL, barra térmica y bloques de resultado mock, estado intermedio de carga, archivos JSON de fixtures y demo con UX, con notas en este devlog o en `docs/`.

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

- **Fase 1 (código):** design system en UI, home con tres atajos, barra térmica y fixtures según [`docs/ROADMAP.md`](../ROADMAP.md).
- **Fase 2:** cerrar con Camila/TI las preguntas abiertas del ADR 0006 (auth, Lambda vs ECS, Pydantic).

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

- Fase 1, punto 3: fixtures JSON validados con `strictAuditRecordSchema` y carga o validación en CI.
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

- Implementar pantallas de captura y resultado (entrada siguiente del devlog) y, después, fixtures.

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