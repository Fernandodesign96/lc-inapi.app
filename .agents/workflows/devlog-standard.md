---
description: Estándares de registro para el diario de desarrollo (DEVLOG.md)
---

# Estándares de registro de desarrollo (DEVLOG)

Siempre que se me pida generar o actualizar una entrada para `docs/development/DEVLOG.md`, seguiré estas reglas estrictas:

## 1. Estructura y metadatos
- **Formato de fecha:** Usar `## [AAAA-MM-DD] - [Área] | Sprint X: Título del sprint` como encabezado principal.
    - *Áreas permitidas:* Backend, Frontend, Estrategia, Infraestructura.
- **Uso de mayúsculas:** Aplicar *Sentence case* en todos los títulos y subtítulos (solo la primera palabra en mayúscula, salvo nombres técnicos).
- **Secciones (orden exacto):**
    - `### Contexto y objetivos:`
    - `### Implementación técnica:`
    - `### 💡 Repaso técnico: [Tema]:` (Opcional)
    - `### Próximos pasos:`

## 2. Lenguaje y tono
- **Idioma:** Las entradas deben escribirse íntegramente en **español**.
- **Tono:** Profesional, técnico y conciso. Evitar anglicismos (usar "configuración" en lugar de "setup").
- **Referencias de código:** Usar comillas invertidas para archivos, clases o métodos (ej. `models.py`).

## 3. Reglas de formato
- Usar una línea horizontal `---` al final de cada entrada para separarla.
- **Orden cronológico inverso:** Las entradas más nuevas VAN ARRIBA del archivo.
- Usar Markdown estándar.

## 4. Requisitos de contenido
- Enfocarse en el "Por qué" y el "Cómo", no solo en el "Qué".
- Referenciar IDs de sprints si es necesario (ej. `phase3-02`).
