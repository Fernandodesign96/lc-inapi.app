# Documento de Requerimientos de Producto (PRD)
## MVP — Aplicativo de Auditoría de Lenguaje Claro INAPI

| Metadatos | Detalle |
| --- | --- |
| **Proyecto** | LC INAPI APP — auditoría asistida de lenguaje claro (META MEI 2026) |
| **Versión PRD** | 1.0.0 |
| **Fecha** | 2026-08-21 |
| **Estado** | MVP operativo: Claude Code §17 + Playwright + Chroma/Xenova + UI Vercel; **sin login** |
| **Stack vigente** | Next.js · Bun · Vercel · GitHub Actions · Claude Code · Playwright MCP · Chroma · `@xenova/transformers` · LangChain.js (ingesta) · Zod |
| **Checklist** | PTD-LC **v3.0** — **51** criterios `LC-*` (IEW/IESD) |
| **Muestra** | **10 URLs** META MEI |
| **Normativa** | Checklist Editorial INAPI PTD + RLC + instrumentos IEW/IESD + Meta MEI |

**Propuestas antiguas (no contempladas):** NestJS, Prisma, Supabase Auth/Postgres, AWS Lambda, Claude API de pago, Firebase — ver ADR 0002 / 0006.

---

## 1. Resumen ejecutivo

Herramienta para **evaluar contenidos** en `inapi.cl` y `tramites.inapi.cl` con el instrumento de **Lenguaje claro** (51 preguntas), produciendo JSON canónico, **% de cumplimiento**, hallazgos con evidencia, **sustituciones** en lenguaje CMS, **PDF** y **Excel MEI**.

- **Asiste** al equipo editorial; **no** publica en el CMS.  
- La auditoría profunda (10–40 min) la ejecuta **Claude Code** en PC; Vercel **muestra** y puede **encolar** jobs.  
- Cualquier persona INAPI con la URL puede usar el MVP (**sin inicio de sesión**).

---

## 2. Objetivos y métricas

| Objetivo | Meta práctica |
| --- | --- |
| Cubrir muestra META MEI | **10 URLs** auditadas con JSON v3.0 |
| Criterios LC | **51** filas `LC-*` por URL |
| Tiempo por URL (automatizado) | Orden de minutos a ~40 min según profundidad §17 |
| Trazabilidad | JSON en GitHub + `version_checklist: "3.0"` |
| Entrega TIC/CMS | PDF + Excel + textos entendibles (§22) |

---

## 3. Usuarios y alcance

| Perfil | Necesidad |
| --- | --- |
| Editor / Equipo UX | Auditar URL, leer hallazgos CMS, exportar PDF/Excel |
| Jefatura / TIC | Confianza en instrumento PTD y muestra META MEI |
| Desarrollo | Orquestación Claude Code, validación Zod, cable UI |

**Fuera de alcance MVP:** edición en CMS; login; Nest/AWS; Usabilidad/Seguridad en el % LC (catalogadas §23, post-Excel LC).

---

## 4. Requisitos funcionales

1. Ingreso de URL en dominios permitidos (o selección desde tabla META MEI / historial).  
2. Captura con **Playwright MCP** (sesión ClaveÚnica cuando aplique).  
3. Evaluación **51** criterios `LC-*` vía Claude Code (§17 + RAG).  
4. Cálculo de % y estado de aceptación (N/A fuera del denominador).  
5. Tabla de hallazgos + sustituciones + observaciones CMS.  
6. Persistencia = **JSON en repo** (y jobs en `data/jobs/` si on-demand).  
7. Export PDF y Excel MEI.  
8. Historial por URL en UI.  
9. Validación Zod (`validate:claude-audits`) antes de confiar en el artefacto.

Portal `/`: acceso simbólico **sin auth**. `/auditar`: flujo principal.

---

## 5. Requisitos no funcionales

- **Sin claves Anthropic** en el cliente ni API operativa en MVP.  
- PDFs normativos y `chroma_db/` **fuera de git**; embeddings **offline** (Xenova).  
- Accesibilidad razonable en UI interna.  
- Versionado explícito del checklist (`3.0`).

---

## 6. Modelo de información

- Catálogo: `data/checklist-criteria-lc-ptd.json`.  
- Contrato: `src/schemas/checklist.ts` (Zod).  
- IDs: `LC-{indicador}-{nn}` (ej. `LC-1.1.3-03`).  
- Legado A–H / 39 / 47: no usar en auditorías nuevas.

---

## 7. Fases (lectura actualizada)

| Fase | Lectura 2026-08-21 |
| --- | --- |
| Mock UX | Hecho |
| Piloto Claude + PDF | Hecho (base); evolución META MEI 10 |
| Claude Code + Playwright + RAG | **Camino productivo** |
| Nest / Supabase / AWS | **Propuesta antigua — no** |
| Worker on-demand | ADR 0011 / contratos audit-jobs |

Detalle: [ROADMAP.md](ROADMAP.md) · [ARCHITECTURE.md](ARCHITECTURE.md).

---

## 8. Referencias

[flujo-piloto-10-urls-claude-mvp.md](flujo-piloto-10-urls-claude-mvp.md) · [checklist-ptd-v2-mapa.md](checklist-ptd-v2-mapa.md) · [SECURITY.md](SECURITY.md) · [despliegue/despliegue-hibrido.md](despliegue/despliegue-hibrido.md)
