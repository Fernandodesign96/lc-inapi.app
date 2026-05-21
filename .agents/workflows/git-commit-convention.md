---
description: Estándares de commits en español con Conventional Commits y formato detallado.
---

# Convención de Git Commits (Salida en Español)

Siempre que se me pida generar o sugerir un mensaje de commit (`git commit`), seguiré estas instrucciones estrictas:

## 1. Idioma
- **OBLIGATORIO:** Todo el contenido del mensaje (asunto y cuerpo) DEBE escribirse en **español**.
- Usar términos técnicos en español (ej. "inicializar", "ajustes", "implementar").
- Evitar anglicismos si existe una alternativa técnica clara en español.

## 2. Estructura del Mensaje
Sigue estrictamente este formato:

`<tipo>: <descripción breve en minúsculas y español>`
- `<punto de cambio detallado 1 en español>`
- `<punto de cambio detallado 2 en español>`
- `<referencia a issues si aplica, ej. Cierra #123>`

### Tipos Permitidos (Conventional Commits):
- **feat:** Nueva funcionalidad.
- **fix:** Corrección de errores.
- **docs:** Cambios únicamente en la documentación.
- **style:** Cambios que no afectan el significado del código (espacios, comas, etc.).
- **refactor:** Cambio de código que no corrige un error ni añade funcionalidad.
- **chore:** Tareas de mantenimiento (actualizar dependencias, etc.).


## 3. Pull request y merge (`gh`)
Cuando el usuario pida explícitamente **PR + merge** (o equivalente):
### 3.1 Alineación con commits
- **Título del PR** (`gh pr create --title`): **misma regla que la primera línea de un commit** — `<tipo>(<alcance opcional>): <descripción breve en minúsculas y español>`, usando **solo** los tipos permitidos de la tabla anterior.
- **Asunto del merge** (`gh pr merge … --subject`): **misma forma** que el título del PR (tipo + descripción breve en español). **Texto plano**, sin Markdown.
- **Cuerpo del merge** (`gh pr merge … --body`): español, **texto plano** al estilo del **cuerpo de un commit** (párrafos cortos y/o viñetas con `-` al inicio de línea). **No** usar sintaxis Markdown de documento (sin `##`, tablas, ni enlaces `[texto](url)` salvo que el usuario pida una excepción explícita).
### 3.2 Descripción del PR (Markdown únicamente aquí)
- **Cuerpo / descripción del PR** (`gh pr create --body`): español; **esta es la única parte obligatoria en Markdown** cuando el asistente entrega o compone el contenido del PR (encabezados `##`, listas, enlaces, checklist de plan de pruebas, etc.).
- El **título del PR** no lleva Markdown: es una sola línea convencional como el asunto del commit.
### 3.3 Entrega en chat
- Si el usuario pide **solo texto** (sin bloques de comando), entregar: **título del PR** (una línea), **descripción del PR** (Markdown), **asunto del merge** (una línea), **cuerpo del merge** (texto plano).
### 3.4 Alcance de la respuesta cuando pide PR + merge
- **Solo esos pasos:** la respuesta puede limitarse a los comandos de **crear el PR** y **mergearlo** con `gh` (no añadir otros comandos de Git salvo que el usuario pida otra cosa o falle algo y haga falta una corrección mínima).
- Antes de ejecutar o proponer comandos, el asistente debe tener (o pedir si faltan) **título del PR**, **descripción del PR (MD)**, **asunto del merge** y **cuerpo del merge (texto plano)** alineados a esta sección.
### 3.5 Comandos de referencia
Ajustar título, cuerpo del PR (solo MD en `--body`), asunto y cuerpo del merge, y opciones (`--merge`, `--squash`, etc.) al flujo del proyecto:
```bash
gh pr create --base main --title "<tipo>(<alcance>): <descripción breve en minúsculas y español>" --body "$(cat <<'EOF'
## Resumen
- …
## Plan de pruebas
- [ ] …
EOF
)"
gh pr merge --merge --subject "<tipo>(<alcance>): <descripción breve en minúsculas y español>" --body "$(cat <<'EOF'
- …
- …
EOF
)"