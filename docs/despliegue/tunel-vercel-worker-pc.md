# Spike — Túnel Vercel ↔ worker PC (Fase 4 paso 4 ítem 9)

**Estado:** plan / spike documentado — 2026-08-18  
**ADR:** [0011](../adr/0011-worker-local-on-demand-vercel.md)  
**Contratos:** [contratos-audit-jobs.md](../contratos-audit-jobs.md)  
**Código local ya operativo:** `bun run dev` + `bun run worker:audit-jobs` (sin túnel)

---

## 1. Problema

En local, UI + API + `data/jobs/` + worker viven en el **mismo PC**. En demo hacia Álvaro/Bernarda:

| Pieza | Dónde suele vivir |
| --- | --- |
| UI pública | Vercel (Hobby) |
| Worker + Claude Code §17 + Playwright | PC INAPI 08:00–18:00 |
| Persistencia `data/jobs/*.json` | Disco del proceso Node que atiende la API |

**Bloqueo Vercel:** el filesystem del runtime es **efímero**. Si `POST /api/audit-jobs` corre solo en Vercel y escribe `data/jobs/`, el job se pierde entre instancias/redeploys y el worker en el PC **no ve** esos archivos.

El túnel (o un store externo) resuelve **dónde vive la cola**, no el §17 en sí.

---

## 2. Topologías evaluadas

### A — Todo en el PC + túnel (recomendado para MVP / demo)

```
Usuario → https://<túnel>  →  PC: Next (UI+API) + data/jobs/
Worker en el mismo PC → claim http://127.0.0.1:3000  (o la URL del túnel)
```

| Pros | Contras |
| --- | --- |
| Cero cambio de código de persistencia | El PC debe estar encendido también para **ver** la UI |
| Mismo flujo que ya probamos | URL de demo = túnel (no el dominio Vercel) |
| Secreto worker solo en `.env.local` del PC | TI/red puede filtrar salidas Cloudflare |

**Herramientas:** Cloudflare Tunnel (quick o named) **o** Tailscale Serve/Funnel.

### B — UI en Vercel + API/jobs en el PC vía túnel

```
Usuario → Vercel (solo frontend estático / rewrite)
       → fetch https://jobs.<túnel>/api/audit-jobs
Worker PC → claim al mismo origen del túnel (localhost o hostname Tailscale)
```

| Pros | Contras |
| --- | --- |
| Dominio Vercel “bonito” para UI | Hay que separar origin de API (env `AUDIT_JOBS_API_BASE` en browser o rewrites) |
| Cola sigue en disco PC | CORS / cookies / complejidad Next monolito |

**Viable** si se añade `NEXT_PUBLIC_AUDIT_JOBS_ORIGIN` (o rewrites en `vercel.json`) apuntando al túnel. **No implementado** en este slice.

### C — API en Vercel + store externo (sin túnel para claim)

Cola en Redis/KV/Blob; worker hace `claim` contra `https://app.vercel.app` con `X-Worker-Secret`.

| Pros | Contras |
| --- | --- |
| UI+API en Vercel “de verdad” | Requiere cambiar el store (fuera del JSON local) |
| Worker solo necesita HTTPS saliente | Más infra y secretos |

**Fuera de alcance** del ítem 9; candidato Fase 5 / post-demo.

---

## 3. Decisión de spike (MVP)

1. **Demo interna / oficina:** topología **A** (túnel → PC completo).  
2. **Vercel** sigue útil para previews de UI **sin** cola real, o como paso previo a B/C.  
3. **No** meter binarios de `cloudflared`/`tailscale` en el repo.  
4. Secreto: `AUDIT_JOBS_WORKER_SECRET` igual en API y worker; no commitear.

---

## 4. Runbook mínimo — Cloudflare Quick Tunnel

Requisitos: `bun run dev` en el PC; cuenta Cloudflare opcional para *quick* tunnel.

```bash
# Terminal 1 — API + UI
cd ~/projects/lc-inapi-app
bun run dev

# Terminal 2 — túnel al puerto de Next (3000)
cloudflared tunnel --url http://127.0.0.1:3000
# Anotar la URL https://….trycloudflare.com

# Terminal 3 — worker (mismo secreto que frontend/.env.local)
AUDIT_JOBS_WORKER_SECRET=… \
AUDIT_JOBS_API_BASE=http://127.0.0.1:3000 \
bun run worker:audit-jobs
```

- Usuarios de demo abren la URL `trycloudflare.com`.  
- El worker **debe** pegarle a `127.0.0.1` (misma máquina), no hace falta que use la URL pública.  
- Fuera de 8–18: jobs `outside_hours` (comportamiento ya cableado).

**Named tunnel (más estable):** crear túnel en Zero Trust, DNS `auditar-demo.inapi…` o subdominio personal, servicio `http://localhost:3000`, arrancar `cloudflared tunnel run <nombre>` al inicio de jornada.

---

## 5. Runbook mínimo — Tailscale

1. Instalar Tailscale en el PC worker; login org/personal.  
2. Opción simple: demos **solo en la red Tailscale** → abrir `http://100.x.y.z:3000`.  
3. Opción pública: **Tailscale Funnel** (si la política lo permite) hacia el puerto 3000.  
4. Worker: `AUDIT_JOBS_API_BASE=http://127.0.0.1:3000`.

Preferible si INAPI ya usa Tailscale; si no, Cloudflare Quick Tunnel es más rápido de probar.

---

## 6. Checklist demo Álvaro / Bernarda (8–18)

- [ ] PC encendido; Claude Team institucional autenticado  
- [ ] `frontend/.env.local` con `AUDIT_JOBS_WORKER_SECRET`  
- [ ] `bun run dev` + worker en marcha  
- [ ] Túnel activo (o acceso Tailscale)  
- [ ] Probar Continuar → procesando → (worker) → resultado + PDF  
- [ ] Mensaje claro si alguien prueba fuera de horario  

---

## 7. Qué queda fuera de este documento

- Implementar rewrites Vercel → túnel (topología B).  
- Migrar store a Redis/KV (topología C).  
- Autenticación institucional.  
- Sustituir stub del worker por §17 real (runbook Claude aparte).

---

## 8. Criterio de aceptación del ítem 9

- [x] Topologías y bloqueo de disco Vercel documentados.  
- [x] Runbook Cloudflare + Tailscale suficientes para una demo.  
- [ ] (Opcional) Probar quick tunnel en una sesión real y anotar URL/experiencia en DEVLOG.
