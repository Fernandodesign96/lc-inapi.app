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
