# ADR 0002 — Stack: Next.js (Turbopack), Bun y Supabase

## Estado

Aceptado — 2026-05-13

## Contexto

El documento conceptual del MVP proponía **Firebase** (Auth + Firestore) por velocidad de iteración. En la práctica, los límites del plan gratuito y el modelo de datos **relacional** (auditorías, 39 resultados por auditoría, histórico por URL, versiones de checklist) favorecen **PostgreSQL** con políticas **RLS** explícitas.

## Decisión

- **Frontend / BFF:** Next.js (última versión estable compatible con el proyecto), **App Router**, TypeScript estricto.
- **Desarrollo local:** `next dev` usa **Turbopack** por defecto en versiones recientes de Next.js (verificar notas de versión al instalar).
- **Paquetes y scripts:** **Bun** como gestor (`bun install`, `bun run`, lockfile).
- **Backend de datos:** **Supabase** (Postgres + Auth + RLS + Storage opcional para exports).
- **IA:** llamadas solo desde **servidor** (Route Handlers / Server Actions / Edge Functions), nunca desde el cliente con clave secreta.

## Consecuencias

- **Positivo:** consultas SQL y modelado claro; costos y límites más predecibles que un BaaS documental para este dominio; RLS alineado a gobernanza de datos.
- **Negativo:** más superficie operativa que solo Firestore client-side (migraciones, políticas RLS, entornos).
- **Migración:** el JSON de criterios y los mocks Zod siguen siendo la fuente hasta conectar Supabase.

## Notas

El despliegue puede ser **Vercel + Supabase** u otro proveedor; si se requiere un worker dedicado (captura pesada), evaluar contenedor adicional sin acoplar la decisión de datos.

La **API de aplicación** (NestJS) y **Prisma** sobre el mismo Postgres se documentan en [0005-api-backend-nestjs-prisma.md](0005-api-backend-nestjs-prisma.md); no invalida esta ADR sobre Next, Bun y Supabase como plataforma de datos y auth.
