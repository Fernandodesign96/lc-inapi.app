# ADR 0005 — API de dominio con NestJS y Prisma

## Estado

**Supersedido — 2026-07-21**

> **Nota de supersesión:** La capa de orquestación descrita en este ADR (NestJS como coordinador de LLM, captura y persistencia) fue reemplazada por **Claude Code Pro** como orquestador principal — ver [ADR 0009](0009-claude-code-pro-como-orquestador.md). El concepto de un backend de dominio en Railway (tier gratuito) sigue siendo válido para una fase futura si el producto necesita persistencia multiusuario o autenticación institucional, pero no es bloqueante para ninguna fase actual del procedimiento de implementación. El contenido original del ADR se conserva como registro histórico de la decisión.

---

Aceptado — 2026-05-13

## Contexto

Los documentos iniciales asumían que la **orquestación** (validación, persistencia, LLM, captura) viviría principalmente en **Next.js** (Route Handlers / Server Actions) frente a **Supabase** (Postgres + Auth + RLS).

El equipo de implementación tiene experiencia previa con **NestJS** y **Prisma** en otros proyectos, lo que reduce fricción y acelera patrones probados (módulos, inyección de dependencias, migraciones).

## Decisión

1. **API HTTP de dominio** en **NestJS** (Node.js), responsable de reglas de negocio pesadas, integración con el proveedor LLM y acceso a datos vía **Prisma**.
2. **Prisma** como ORM y herramienta de migraciones sobre el **mismo PostgreSQL** hospedado por Supabase (cadena de conexión directa al motor; RLS sigue aplicando según políticas definidas).
3. **Next.js** sigue siendo el **frontend** (App Router) y puede usar Route Handlers ligeros o llamadas al API Nest según convenga por fase; las claves secretas del LLM y jobs costosos se concentran preferentemente en Nest.
4. **Supabase Auth** puede alimentar identidades en el cliente; la validación de JWT / sesión frente al API Nest se define en implementación (middleware Nest + JWKS de Supabase u otro esquema acordado con TI).

## Consecuencias

- **Positivo:** separación clara UI vs dominio; ecosistema Nest alineado a la experiencia del equipo; Prisma unifica esquema y tipos en el servicio API.
- **Negativo:** dos runtimes desplegables (Next + Nest) salvo que Nest se empaquete como proceso colateral en el mismo host; conviene documentar el layout del repo (p. ej. carpeta `apps/api` o `services/api` junto a Next en raíz) en la primera iteración de código.
- **Neutral:** ADR 0002 sigue vigente para Next, Bun y Supabase como datos y auth; esta ADR **acota** la capa API de aplicación.

## Pendientes (no bloquean el mock UX)

- Estructura exacta del repo cuando exista Nest (monorepo opcional vs. carpeta hermana) y convención de paquetes (Bun/npm).
- Si la captura URL vive en Nest, en Next o en un worker aparte (ver ADR futuro Cheerio/Playwright).
