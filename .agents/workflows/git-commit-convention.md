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

- **Solo esos pasos:** la respuesta debe limitarse a los comandos de **crear el PR** y **mergearlo** con `gh` (no añadir otros comandos de Git salvo que el usuario pida otra cosa o falle algo y haga falta una corrección mínima).
- **Cuerpo del PR:** la descripción del PR debe ir **solo en Markdown** (listas, secciones, enlaces, checklist de test plan, etc.).
- **Título y descripción para el merge:** antes de ejecutar o proponer los comandos, el asistente debe tener (o pedir si faltan) un **título** y una **descripción** claros para el merge (p. ej. título/cuerpo del PR o, si aplica al método de merge, asunto/cuerpo del commit de merge o de squash según lo que use `gh pr merge` en el repo).

Comandos de referencia (ajustar título, cuerpo MD y opciones de merge al flujo del proyecto):

```bash
gh pr create --title "…" --body "$(cat <<'EOF'
## Resumen
- …

## Plan de pruebas
- [ ] …
EOF
)"
gh pr merge --merge --subject "…" --body "…"