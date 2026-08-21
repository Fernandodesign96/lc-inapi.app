# Prompt 6 — Calibración persistente (hallazgos de revisiones manuales)

## Qué es

Registro **vivo** de hallazgos, correcciones y acuerdos de calibración que Claude Code **debe leer en cada auditoría** (Prompt 5, Paso C) y aplicar a **todas** las URLs.

## Para qué

Que los ajustes acordados con Equipo UX / jefatura (revisión manual de resultados) no se pierdan entre sesiones: el maestro se vuelve más preciso con el tiempo.

## Objetivo

Persistencia inteligente: misma regla en Portada, Marcas, SIAC, etc., sin redescubrir el error cada vez.

## Cableado

| Pieza | Relación |
| --- | --- |
| `05-audit-maestro-url.md` | Lectura obligatoria en Paso C |
| `../skills/05-calibracion-persistente.md` | Cómo aplicar y actualizar este archivo |
| `../CLAUDE.md` | §2 calibraciones UX, §20–§22 |
| `02-criterios-hitos-correcciones.md` | Juicio por criterio |
| DEVLOG / PRs | Origen humano de cada entrada |

## Regla de mantenimiento

1. Tras cada revisión manual de UI/PDF/Excel, **añadir o actualizar** una entrada aquí (fecha, criterio, regla, ejemplo).  
2. No borrar historia: marcar entradas obsoletas como `estado: supersedido` y apuntar a la nueva.  
3. Skill `05` resume el procedimiento; **este archivo** guarda los hechos.

---

## Entradas vigentes (actualizar en cada hallazgo)

### C-2026-08 — RUN institucional vs persona natural (`LC-1.1.7-01`)

- **Regla:** RUT de persona jurídica pública (ej. INAPI en footer) → `cumple`. RUN de persona natural en HTML público → `incumple`, severidad `alta`.
- **Aplica a:** todas las URLs sitioweb/tramites públicas.

### C-2026-08 — Fecha de actualización (`LC-1.1.4-01`)

- **Regla:** sin fecha visible → `(ausencia)` + propuesta de línea visible. **Nunca** usar `©año` del footer como “fecha de actualización”.

### C-2026-08 — Visualización / apoyos (`LC-1.3.1-01`)

- **Regla:** solo pregunta si hay íconos/imágenes/gráficos para datos. Si ya hay banners/tarjetas/íconos → `cumple`. **No** incumplir por `alt` vacío (anotar en nota TIC si hace falta, sin bajar el % por ese id).

### C-2026-08 — Mayúsculas plantilla home (`LC-1.2.4-05`)

- **Regla:** ítems `ACCESOS` y `BUSCADOR` de cabecera global `www.inapi.cl` **excluidos**. Aplicar el criterio en el resto y en trámites.

### C-2026-08 — Título con jerga (`LC-1.1.3-03` + `LC-1.2.4-02`)

- **Regla:** un término legal solo como H1/título de tarjeta (ej. «Observancia») incumple aunque debajo haya subtítulo. Propuesta: título cotidiano o término + glosa en el mismo bloque.

### C-2026-08 — Evidencia solo VISIBLE

- **Regla:** no usar `<title>` / `<meta>` como prueba de título o contenido. Fidelidad título↔contenido sobre **H1 visible**.

### C-2026-08 — Sesión autenticada

- **Regla:** con `captura_con_sesion: true`, datos del solicitante en formularios **no** son incumplimiento de privacidad; evaluar etiquetas y claridad (§19).

---

## Plantilla para nuevas entradas

```markdown
### C-YYYY-MM-DD — Título corto (`LC-…`)

- **Origen:** revisión manual URL … / reunión UX …
- **Regla:** …
- **Ejemplo bueno / malo:** …
- **Aplica a:** todas | solo sitioweb | solo tramites | URL concreta
- **estado:** vigente
```

## Salida al leer este prompt

Lista mental de reglas vigentes aplicadas a la URL en curso; si surge un hallazgo nuevo en la sesión, proponer el bloque a añadir aquí antes del commit.
