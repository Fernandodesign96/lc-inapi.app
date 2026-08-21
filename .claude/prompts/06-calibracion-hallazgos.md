# Prompt 6 — Calibración persistente (hallazgos de revisiones manuales)

## Qué es

Registro **vivo** de hallazgos, correcciones y acuerdos de calibración que Claude Code **debe leer en cada auditoría** (Prompt 5, Paso C) y aplicar a **todas** las URLs.

## Para qué

Que los ajustes acordados con Equipo UX / jefatura (revisión manual de resultados) no se pierdan entre sesiones: el maestro se vuelve más preciso con el tiempo.

## Objetivo

Persistencia inteligente: misma regla en Portada, Marcas, SIAC, etc., sin redescubrir el error cada vez — **sin** usar auditorías antiguas como atajo que omita el análisis completo.

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

### C-2026-08-21 — Reauditoría completa: precedentes ≠ atajo

- **Origen:** revisión manual Portada (META MEI orden 1) tras orquestación §17 / prompts 01–06.
- **Regla:** JSON previos, `history[]`, Colección B / RAG de precedentes y calibraciones son **solo contexto de apoyo** (tono, patrones, umbrales). **Prohibido** copiar estados `cumple`/`incumple`/`no_aplica` de una auditoría anterior sin re-evaluar la captura **actual**. Cada reauditoría exige: Playwright (HTML + DOM visible) de nuevo → inventario R+U completo → 15 subagentes → 5 sub-subagentes. No «acelerar» omitiendo bloques (modal, hero, secciones, footer) porque «ya se evaluaron antes».
- **Efecto esperado:** el % puede **bajar** si se recuperan incumplimientos antes omitidos; eso es correcto.
- **Aplica a:** todas las URLs (reauditorías y nuevas).
- **estado:** vigente

### C-2026-08-21 — Rigor UX: no degradar a `no_aplica` / cumple débil por «detalle»

- **Origen:** mismos hallazgos Portada (modal Contacto, hero, Observancia).
- **Regla:** textos, títulos, subtítulos e iconografía **visibles** que afectan comprensión ciudadana son evaluables. **Prohibido** marcar `no_aplica` o `cumple` genérico solo porque el hallazgo «ya salió en un JSON viejo» o porque parece menor. Si el criterio pregunta por lenguaje plano, redacción, claridad, concisión, escritura web, completitud o legibilidad y el texto/ícono está a la vista → aplicar el criterio y, si incumple, **sustitución** con propuesta CMS (§22).
- **Aplica a:** todas.
- **estado:** vigente

### C-2026-08-21 — Portada: modal «¿Quieres contactarnos?»

- **Origen:** revisión Portada `https://www.inapi.cl/`.
- **Regla:** el modal de Contacto (título «¿Quieres contactarnos?», canal preferido, teléfono `(56 2) 2 887 0400`, horarios L–J 09:00–18:00 / V 09:00–17:00, `inapi@inapi.cl`, «Tu consulta será atendida por un especialista.», dirección Av. Libertador Bernardo O'Higgins 194, Santiago, horario presencial 09:00–14:00, **iconos** de guía) es contenido **VISIBLE** obligatorio en el inventario R+U y en los subagentes aplicables (p. ej. completitud, lenguaje plano, claridad, escritura web, datos clave, tono). Abrir/capturar el modal en Playwright si hace falta para ver el DOM. Evaluar íconos como apoyos/etiquetas si el criterio lo pide (`LC-1.3.1-01` solo si aplica visualización de datos; no forzar incumple por `alt` vacío — ver entrada Visualización).
- **Ejemplo malo:** omitir el modal porque no está en el JSON previo o porque el scrape inicial no lo abrió.
- **Aplica a:** Portada y cualquier URL sitioweb con el mismo modal de layout.
- **estado:** vigente

### C-2026-08-21 — Portada: hero «Te queremos ayudar…»

- **Origen:** revisión Portada.
- **Regla:** el título visible **«Te queremos ayudar a utilizar la propiedad industrial»** (y equivalentes del hero) se evalúa con rigor de **lenguaje plano / redacción / claridad / escritura web** (`LC-1.1.3-*`, `LC-1.1.5-*`, `LC-1.2.1-*`, `LC-1.2.4-*` según encaje). Si suena genérico, técnico o poco accionable para ciudadano → `incumple` + propuesta cercana (qué puede hacer la persona en INAPI), no `cumple` por inercia.
- **Aplica a:** Portada; misma lógica en héroes de otras páginas sitioweb.
- **estado:** vigente

### C-2026-08-21 — Portada: bloque Observancia (título + subtítulo)

- **Origen:** revisión Portada (refuerza calibración de jerga en título).
- **Regla:**
  1. Título **«Observancia»** (o solo jerga legal como rótulo) → incumplir lenguaje plano / escritura web (`LC-1.1.3-03`, `LC-1.2.4-02` u homologables): proponer título cotidiano o término + glosa en el mismo bloque.
  2. Subtítulo **«Conoce y utiliza las herramientas de protección de la Propiedad Intelectual en Chile»** → evaluar claridad/cercanía; si «Propiedad Intelectual» / formulación densa no ayuda al público general → `incumple` + propuesta más llana (qué protege, para quién).
- **Aplica a:** Portada y bloques homólogos en sitioweb.
- **estado:** vigente

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

- **Regla:** un término legal solo como H1/título de tarjeta (ej. «Observancia») incumple aunque debajo haya subtítulo. Propuesta: título cotidiano o término + glosa en el mismo bloque. *(Complementada por C-2026-08-21 Portada Observancia.)*

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

Lista mental de reglas vigentes aplicadas a la URL en curso (incluida **reauditoría completa** y bloques Portada si aplica); si surge un hallazgo nuevo en la sesión, proponer el bloque a añadir aquí antes del commit.
