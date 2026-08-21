# ADR 0002 — Stack: Next.js, Bun y (históricamente) Supabase

## Estado

**Obsoleto / supersedido en parte — 2026-08-21**

> **Aviso (21 agosto 2026):** este ADR nació para elegir entre **Firebase** y **PostgreSQL/Supabase**.  
> **Este proyecto ya no usa Firebase ni PostgreSQL/Supabase.**  
> Es una **propuesta antigua**: no se implementará Auth, RLS ni base relacional en el MVP.  
> Lo que **sigue vigente** de esta decisión es solo el **frontend Next.js + Bun** en Vercel.

## Contexto (histórico)

En mayo 2026 se planteó Firebase (Auth + Firestore) por velocidad. Luego se prefirió PostgreSQL con RLS vía Supabase, pensando en 39 resultados por auditoría, histórico y login.

Ese camino **no se adoptó** en el producto real.

## Qué se propuso entonces vs qué hay hoy

| Tema | Propuesta antigua (este ADR) | MVP vigente (2026-08-21) |
| --- | --- | --- |
| Datos | Supabase Postgres + Auth + RLS | **JSON en el repo** (`data/claude-audits/`, `data/jobs/`) |
| Login | Sí (usuarios institucionales) | **No** — acceso libre para personal INAPI |
| Firebase | Alternativa descartada | **No se usa** |
| Frontend | Next.js App Router + Turbopack | **Sí** — `frontend/` en Vercel |
| Paquetes | Bun | **Sí** — monorepo Bun |
| Orquestación IA | “Solo desde servidor con clave” | **Claude Code** en PC/WSL ([ADR 0009](0009-claude-code-pro-como-orquestador.md)); sin clave Anthropic operativa |

## Decisión vigente (qué conservar de 0002)

1. **Next.js** (App Router, TypeScript) para la UI `/auditar`, PDF, Excel e historial.  
2. **Bun** como gestor de paquetes y scripts del monorepo.  
3. **No** implementar Firebase.  
4. **No** implementar Supabase/Postgres/Auth en este MVP ni como “fase futura prometida” en este ADR.

## Por qué Firebase y Postgres ya no aplican

- El MVP debe ser usable **sin login** (cualquier persona INAPI con la URL puede auditar).  
- La auditoría profunda corre en **Claude Code** (10–40 min), no en una API Nest + BD.  
- La trazabilidad vive en **JSON versionados en GitHub**, no en tablas SQL.  
- Introducir Firebase o Postgres hoy **no aporta** al compromiso META MEI 2026 (51 criterios LC, 10 URLs).

## Relación con otros ADR

- Orquestación: [ADR 0009](0009-claude-code-pro-como-orquestador.md)  
- Worker on-demand: [ADR 0011](0011-worker-local-on-demand-vercel.md)  
- Stack IA / RAG: [ADR 0008](0008-typescript-sobre-python-para-rag.md), [ADR 0010](0010-rag-local-chroma-xenova-transformers.md)

## Consecuencias

- Leer este ADR solo como **historia de decisión de frontend** (Next + Bun).  
- Ignorar cualquier mención a Firebase, Supabase, Auth o RLS como plan a implementar.
