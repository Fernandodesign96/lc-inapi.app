import {
  acceptanceStatusFromPercentage,
  type AcceptanceStatus,
} from "@contracts/checklist"

/**
 * Umbrales de negocio (solo documentación en UI; la fuente de verdad sigue siendo
 * `acceptanceStatusFromPercentage` en `src/schemas/checklist.ts`):
 * - ≤80 % → rechazado
 * - 81–90 % → aceptado_con_observaciones
 * - ≥91 % → aprobado
 */
export const UMBRALES_CUMPLIMIENTO_DOC = {
  rechazado_hasta: 80,
  observaciones_hasta: 90,
} as const

/** Etiqueta corta en español para el resumen (evita mostrar el snake_case crudo). */
export const ETIQUETA_ESTADO_ACEPTACION: Record<AcceptanceStatus, string> = {
  rechazado: "Rechazado",
  aceptado_con_observaciones: "Aceptado con observaciones",
  aprobado: "Aprobado",
}

/**
 * Clases Tailwind para el track/relleno de la barra según estado (sin hex ad hoc).
 * Ajusta en Etapa 2 al conectar con el componente Progress o div nativo.
 */
export const CLASES_BARRA_POR_ESTADO: Record<
  AcceptanceStatus,
  { track: string; fill: string }
> = {
  rechazado: {
    track: "bg-muted",
    fill: "bg-destructive",
  },
  aceptado_con_observaciones: {
    track: "bg-muted",
    fill: "bg-amber-500 dark:bg-amber-400",
  },
  aprobado: {
    track: "bg-muted",
    fill: "bg-emerald-600 dark:bg-emerald-500",
  },
}

export type PasosSeguir = {
  titulo: string
  pasos: string[]
}

export const PASOS_SEGUN_ESTADO: Record<AcceptanceStatus, PasosSeguir> = {
  rechazado: {
    titulo: "Pasos a seguir",
    pasos: [
      "Revise la tabla de criterios y priorice los incumplimientos con mayor severidad.",
      "Corrija el contenido publicado en la URL y documente los cambios según el procedimiento interno.",
      "Cuando las correcciones estén aplicadas, solicite una nueva auditoría de lenguaje claro.",
      "Si requiere apoyo normativo o de estilo, coordine con el área responsable antes de republicar.",
    ],
  },
  aceptado_con_observaciones: {
    titulo: "Pasos a seguir",
    pasos: [
      "Atienda las observaciones señaladas en el resumen y en los criterios marcados como no cumple.",
      "Ajuste microcopy, titulares o enlaces según la severidad indicada en cada fila.",
      "Valide contraste, enlaces y consistencia terminológica con el glosario institucional.",
      "Vuelva a auditar la URL para confirmar que el porcentaje de cumplimiento supera el umbral acordado.",
    ],
  },
  aprobado: {
    titulo: "Pasos a seguir",
    pasos: [
      "Conserve evidencia de esta auditoría para trazabilidad interna.",
      "Programe revisiones periódicas si la página recibe actualizaciones frecuentes.",
      "Mantenga alineación con criterios de titulares, enlaces y mensajes de sistema ya cumplidos.",
      "Ante cambios editoriales mayores, considere una nueva evaluación preventiva.",
    ],
  },
}

/** Decisión Etapa 1: false = solo atajos / overrides con texto; true = relleno genérico en demo. */
export const USAR_TEXTO_PROPUESTO_GENERICO = false

export const TEXTO_PROPUESTO_GENERICO = `(mock) Redacción sugerida de referencia
• Revise titulares y mensajes de estado en voz activa y con términos del usuario.
• Unifique el tono institucional y evite siglas sin explicar en el primer uso.
• Incluya enlaces de ayuda claros ("Cómo…", "Qué significa…") cuando el trámite sea complejo.`

/**
 * Misma semántica que `estado_aceptacion` en el registro de auditoría.
 * En la página de resultado prefieres `auditoria.estado_aceptacion` para colorear;
 * usa esto solo si partes solo del porcentaje.
 */
export function estadoAceptacionDesdePorcentaje(
  porcentaje: number,
): AcceptanceStatus {
  return acceptanceStatusFromPercentage(porcentaje)
}