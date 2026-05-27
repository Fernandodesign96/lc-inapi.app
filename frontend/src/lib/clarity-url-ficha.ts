/** Una entrada del historial mock en la ficha de URL (no es StrictAuditRecord). */
export type ClarityHistorialAuditoriaMock = {
  fecha: string
  estadoLcRef: string
  porcentajeLcRef: string
  nota: string
}

/** Ficha completa de una URL del inventario Clarity (~20 filas). */
export type ClarityUrlFicha = {
  rank: number
  nombre: string
  /** Ruta o etiqueta Clarity (referencia documental). */
  rutaEtiqueta: string
  url: string
  visitasRef: string
  porcentajeLcRef: string
  estadoLcRef: string
  descripcion: string
  observaciones: string
  historialAuditorias: ClarityHistorialAuditoriaMock[]
}

export type ClarityFichasMockFile = {
  schema_version: number
  lista: string
  fuente_documental: string
  nota: string
  fichas: ClarityUrlFicha[]
}
