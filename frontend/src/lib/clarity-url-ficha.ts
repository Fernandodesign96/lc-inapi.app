/** Una entrada del historial mock en la ficha de URL (no es StrictAuditRecord). */
export type ClarityHistorialAuditoriaMock = {
  fecha: string
  estadoLcRef: string
  porcentajeLcRef: string
  nota: string
}

/** Origen Calidad Web: portal de aplicación vs sitio institucional. */
export type ClarityUrlType = "tramites" | "sitioweb"

/** Ficha completa de una URL del inventario Clarity (~22 filas objetivo). */
export type ClarityUrlFicha = {
  rank: number
  nombre: string
  /** Ruta o etiqueta Clarity (referencia documental). */
  rutaEtiqueta: string
  url: string
  /** Calidad Web Trámites (`tramites.inapi.cl`) o Sitio Web (`www.inapi.cl`). */
  type_url: ClarityUrlType
  visitasRef: string
  porcentajeLcRef: string
  estadoLcRef: string
  encargadoRef: string
  auditoriasRef: string
  ultimaRevisionRef: string
  descripcion: string
  observaciones: string
  /** Desarrollo opcional de la observación breve (p. ej. cierre editorial migrado). */
  observacionesDetalle?: string
  historialAuditorias: ClarityHistorialAuditoriaMock[]
}

export type ClarityFichasMockFile = {
  schema_version: number
  lista: string
  fuente_documental: string
  nota: string
  fichas: ClarityUrlFicha[]
}