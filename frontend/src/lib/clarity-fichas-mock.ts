import fichasFile from "../../../data/ux/clarity-fichas-mock.json"

import type {
  ClarityFichasMockFile,
  ClarityUrlFicha,
} from "@/lib/clarity-url-ficha"

const data = fichasFile as ClarityFichasMockFile

export const CLARITY_FICHAS_MOCK: readonly ClarityUrlFicha[] = data.fichas

export const CLARITY_FICHA_BY_RANK = new Map<number, ClarityUrlFicha>(
  data.fichas.map((f) => [f.rank, f]),
)

export function getClarityFichaByRank(rank: number): ClarityUrlFicha | undefined {
  return CLARITY_FICHA_BY_RANK.get(rank)
}

export function isValidClarityFichaRank(rank: number): boolean {
  return Number.isInteger(rank) && rank >= 1 && rank <= 22
}

/** Resumen de fila para la tabla de inventario en `/auditar`. */
export function clarityFichaToInventoryRow(f: ClarityUrlFicha) {
  return {
    rank: f.rank,
    rutaEtiqueta: f.rutaEtiqueta,
    type_url: f.type_url,
    encargadoRef: f.encargadoRef,
    visitasRef: f.visitasRef,
    auditoriasRef: f.auditoriasRef,
    ultimaRevisionRef: f.ultimaRevisionRef,
    porcentajeLcRef: f.porcentajeLcRef,
    estadoRef: f.estadoLcRef,
  }
}
