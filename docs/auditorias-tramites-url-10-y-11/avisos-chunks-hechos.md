# Chunks y hechos — 130 avisos de sistemas

Fuente: `Avisos Sistemas.xlsx` (130 filas). Agrupar IDs solo si el copy es el mismo salvo día/fecha/hora. El `propuesto` **no** es un párrafo único (C-2026-11-10a).

Léxico común al reescribir: «Importante»; «Estimados usuarios y usuarias»; cierre «Lamentamos las molestias y agradecemos su comprensión.»

| Chunk | n | IDs | Hechos que el propuesto debe conservar/reforzar |
| --- | --- | --- | --- |
| Mantención genérica (fuera de servicio, sin datacenter) | 86 | 6, 7, 11, 13, 17–19, 21–23, 27–34, 36–42, 45–52, 56, 61, 62, 69–74, 76–81, 88–121, 133–136 | Fecha/hora **de cada ID**. No inventar «centro de datos». Orientar: completar antes o reintentar después. |
| Datacenter (título IMPORTANTE + 26/08) | 8 | 138–145 | Centro de datos (`datacenter` → «centro de datos»). Fecha/hora de cada ID. |
| Actualización de sistemas (mejora de experiencia) | 6 | 63–68 | Motivo: actualización de sistemas. Fecha/hora de cada ID. |
| Datacenter (cuerpo, sin título 26/08) | 6 | 82–87 | Centro de datos. Fecha/hora de cada ID. |
| Datacenter (sin «Importante» inicial) | 4 | 126–129 | Centro de datos. Fecha/hora de cada ID. |
| ClaveÚnica no disponible | 3 | 24–26 | Solo ClaveÚnica en mantenimiento; ventana 21:00–23:00 de ese aviso. |
| Intermitencia Marcas / Expediente Electrónico | 2 | 122, 125 | Marcas Comerciales; Expediente Electrónico; escritos y anotaciones. |
| Cambio de proveedor + IP | 2 | 130, 131 | Proveedor de enlaces; intermitencias; actualización de red hasta 48 h. |
| Mantención 2 etapas | 1 | 1 | Dos ventanas (jueves 17:00–19:00 y sábado 08:00–16:00); también el sitio web. |
| Firma de títulos | 1 | 3 | No se pueden emitir títulos ni certificados. |
| Mantención un sábado (inhabilitados) | 1 | 4 | Fecha/hora de esa fila; trámites y sitio. |
| Intermitencias (no corte total) | 1 | 5 | Dice intermitencias, no «fuera de servicio». |
| Cambio de proveedor (red) | 1 | 8 | Trabajos en la red; interrupción de servicios electrónicos. |
| TGR — no presentar con pago | 1 | 9 | Tesorería General de la República (TGR). **No realice presentaciones que requieran pago.** |
| Custodia de poderes | 1 | 10 | «Custodia y presentación de poderes»; intermitencia; horario del aviso. |
| TGR — intermitencia + ventana 22–23 h | 1 | 15 | TGR; suspensión de pagos en la ventana de ese aviso. |
| Solo Patentes (Marcas normal) | 1 | 20 | Área de Patentes caída; Marcas Comerciales operativas; `inapi@inapi.cl`. |
| TGR corto | 1 | 75 | TGR; completar la advertencia de no pagar. |
| Retraso confirmación de pago | 1 | 132 | No reintentar el pago; esperar comprobante. |
| ClaveÚnica + Clave INAPI | 1 | 137 | ClaveÚnica intermitente; **Clave INAPI sí disponible** para todos los trámites. |
| MFA (6 dígitos) | 1 | 146 | RUN y contraseña + código al correo; ClaveÚnica no cambia. |

Claude Code: leer este archivo + el Excel/JSON, aplicar los 51 criterios a **cada** línea con el contexto de su chunk, y persistir el léxico entre propuestas.
