# Devlog — auditoría LC INAPI

Bitácora de decisiones de implementación, aprendizajes y bloqueos. Las entradas más recientes van **arriba**. Formato obligatorio: ver `.agents/workflows/devlog-standard.md`.

---

## [2026-05-13] - Estrategia | Sprint 0: Nombre del repo y API NestJS + Prisma

### Contexto y objetivos:

Alinear documentación y `package.json` con la carpeta raíz **`lc-inapi-app`** y registrar la decisión de backend con **NestJS** y **Prisma** (misma base Postgres en Supabase) antes de inicializar Next.js.

### Implementación técnica:

- `package.json`: campo `name` → `lc-inapi-app`.
- Nuevo [ADR 0005](../adr/0005-api-backend-nestjs-prisma.md); referencias en `ARCHITECTURE.md`, `PRD.md`, `ROADMAP.md`, `DATABASE.md`, `README.md`.
- Entrada histórica del devlog: nombre del repositorio actualizado a `lc-inapi-app`.

### Próximos pasos:

- Definir layout de monorepo (`apps/web`, `apps/api`) al crear el proyecto Next y el servicio Nest.
- Inicializar Next.js con Bun según roadmap; Prisma/Nest en fase de persistencia.

---

## [2026-05-13] - Frontend | Sprint 0: Carpeta `references` y enlaces en el design system

### Contexto y objetivos:

Versionar en el repo las **capturas** del UI Kit v3.0.1 usadas para los hex y tablas del `DESIGN_SYSTEM.md`, con nombres estables y enlaces desde la documentación.

### Implementación técnica:

- Carpeta `docs/uikit_gob/references/` con `README.md` que define nombres de archivo sugeridos por lámina.
- `docs/DESIGN_SYSTEM.md` v0.3.1: sección **16** con tabla de enlaces y dos vistas previas embebidas (`colores-basicos`, `colores-estados`).

### Próximos pasos:

- Copiar los PNG desde el equipo local a `docs/uikit_gob/references/` con los nombres de la tabla (hasta entonces los enlaces/imágenes pueden aparecer rotos en la vista previa).

---

## [2026-05-13] - Estrategia | Sprint 0: Convenciones en una sola carpeta `.agents/workflows`

### Contexto y objetivos:

Mantener una única ubicación para las pautas de **devlog** y **commits** alineadas con el repositorio en GitHub, sin duplicar reglas en otras carpetas.

### Implementación técnica:

- Archivos `devlog-standard.md` y `git-commit-convention.md` en `.agents/workflows/`, con el mismo contenido base que los workflows de referencia; único ajuste explícito: la ruta al devlog como `docs/development/DEVLOG.md` (sin enlaces a otros repositorios).
- Eliminación de la carpeta `.cursor/rules/` que duplicaba esas pautas.
- Actualización de la sección de convenciones en `README.md` raíz.

### Próximos pasos:

- Añadir workflows de GitHub Actions que ejecuten `bun run typecheck` y el script de validación del checklist en cada PR.

---

## [2026-05-13] - Estrategia | Sprint 0: Repositorio inicial y contratos Zod

### Contexto y objetivos:

Arranque del repositorio `lc-inapi-app` con enfoque **contract-first**: el checklist editorial v1.1 (39 criterios) debe alimentar mocks de interfaz, prompts de modelo y la futura capa Supabase con la **misma forma de datos**.

### Implementación técnica:

- Documentación base en `docs/`: PRD, arquitectura, base de datos, sistema de diseño y roadmap.
- ADRs iniciales en `docs/adr/` (stack Next/Bun/Supabase, mocks con Zod, evaluación con LLM y versionado de prompts).
- Catálogo en `data/checklist-criteria.json` y esquemas en `src/schemas/checklist.ts` (Zod + helpers `buildDemoEvaluations` / `buildDemoStrictAudit`).
- Script `src/scripts/validate-checklist-data.ts` para validar el JSON contra el esquema (útil en CI).

### Próximos pasos:

- Inicializar Next.js con Bun y enlazar alias `@/` a `src/`.
- Añadir fixtures de auditoría mock que pasen `strictAuditRecordSchema`.

---
