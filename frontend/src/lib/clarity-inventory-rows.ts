/**
 * Filas del inventario ampliado Clarity — derivadas de `data/ux/clarity-fichas-mock.json`.
 * Fuente editorial: `docs/ux/inventario-urls-clarity.md` §2 (tabla 20 filas).
 */
import {
  CLARITY_FICHAS_MOCK,
  clarityFichaToInventoryRow,
} from "@/lib/clarity-fichas-mock"

export type ClarityInventoryRow = {
  rank: number
  rutaEtiqueta: string
  encargadoRef: string
  visitasRef: string
  auditoriasRef: string
  ultimaRevisionRef: string
  porcentajeLcRef: string
  estadoRef: string
}
export const CLARITY_INVENTORY_ROWS: readonly ClarityInventoryRow[] =
  CLARITY_FICHAS_MOCK.map(clarityFichaToInventoryRow)
