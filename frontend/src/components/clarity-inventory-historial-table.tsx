"use client"

import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { clarityFichaHref } from "@/lib/clarity-ficha-path"
import {
  CLARITY_INVENTORY_ROWS,
  type ClarityInventoryRow,
} from "@/lib/clarity-inventory-rows"
import {
  clarityInventarioSortSummary,
  filterAndSortClarityInventoryRows,
  type ClarityInventarioSortKey,
  type FiltroEstadoLcInventario,
  type SortDirection,
} from "@/lib/clarity-inventory-sort"
import { parsePorcentajeLcRef } from "@/lib/inventory-table-visuals"
import {
  CeldaEstadoLcAceptacion,
  InventarioLeyendaLcAceptacion,
  inventoryRowClassFromLcAceptacionBucket,
  porcentajeLcAceptacionTextClass,
  resolveLcAceptacionBucket,
} from "@/lib/lc-aceptacion-visual"
import { cn } from "@/lib/utils"
import Link from "next/link"

const FILTER_SELECT_CLASS =
  "mt-1 min-h-9 w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground dark:bg-input/30"

export function ClarityInventoryHistorialTable() {
  const [filtroEstado, setFiltroEstado] =
    useState<FiltroEstadoLcInventario>("todos")
  const [sortKey, setSortKey] = useState<ClarityInventarioSortKey>("rank")
  const [sortDir, setSortDir] = useState<SortDirection>("asc")

  const filas = useMemo(
    () =>
      filterAndSortClarityInventoryRows(CLARITY_INVENTORY_ROWS, {
        filtroEstado,
        sortKey,
        sortDir,
      }),
    [filtroEstado, sortKey, sortDir],
  )

  const sortSummary = clarityInventarioSortSummary(sortKey, sortDir)

  function resetFiltros() {
    setFiltroEstado("todos")
    setSortKey("rank")
    setSortDir("asc")
  }

  return (
    <>
      <InventarioLeyendaLcAceptacion />
      <div
        className="mb-3 grid gap-3 border-b border-border pb-3 sm:grid-cols-2 lg:grid-cols-4"
        role="group"
        aria-label="Filtros y orden del historial LC URLs INAPI"
      >
        <label className="flex flex-col gap-0.5 text-xs font-medium text-foreground">
          Estado LC
          <select
            className={FILTER_SELECT_CLASS}
            value={filtroEstado}
            onChange={(e) =>
              setFiltroEstado(e.target.value as FiltroEstadoLcInventario)
            }
          >
            <option value="todos">Todos</option>
            <option value="rechazado">Rechazado</option>
            <option value="aceptado_con_observaciones">
              Aceptado con observaciones
            </option>
            <option value="aprobado">Aprobado</option>
            <option value="no_aplica">No aplica</option>
          </select>
        </label>
        <label className="flex flex-col gap-0.5 text-xs font-medium text-foreground">
          Ordenar por
          <select
            className={FILTER_SELECT_CLASS}
            value={sortKey}
            onChange={(e) =>
              setSortKey(e.target.value as ClarityInventarioSortKey)
            }
          >
            <option value="rank">Volumen Clarity (#)</option>
            <option value="visitas">Visitas (ref.)</option>
            <option value="auditorias">Auditorías (ref.)</option>
            <option value="ultimaRevision">Última revisión (ref.)</option>
            <option value="porcentaje">% LC (ref.)</option>
          </select>
        </label>
        <label className="flex flex-col gap-0.5 text-xs font-medium text-foreground">
          Dirección
          <select
            className={FILTER_SELECT_CLASS}
            value={sortDir}
            onChange={(e) => setSortDir(e.target.value as SortDirection)}
          >
            <option value="desc">Mayor a menor / más reciente</option>
            <option value="asc">Menor a mayor / más antigua</option>
          </select>
        </label>
        <div className="flex flex-col justify-end gap-2 sm:col-span-2 lg:col-span-1">
          <p className="text-xs text-muted-foreground tabular-nums" aria-live="polite">
            Mostrando {filas.length} de {CLARITY_INVENTORY_ROWS.length} · {sortSummary}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
            onClick={resetFiltros}
          >
            Restablecer
          </Button>
        </div>
      </div>
      <Table>
        <TableCaption className="sr-only">
          Historial de auditoría LC — URLs INAPI: visitas, encargado, auditorías,
          última revisión, porcentaje LC y estado de referencia.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10 whitespace-nowrap">#</TableHead>
            <TableHead>Ruta o etiqueta (Clarity)</TableHead>
            <TableHead className="whitespace-nowrap">Encargado</TableHead>
            <TableHead className="whitespace-nowrap text-right">
              Visitas (ref.)
            </TableHead>
            <TableHead className="whitespace-nowrap text-right">
              Auditorías (ref.)
            </TableHead>
            <TableHead className="whitespace-nowrap">
              Última revisión (ref.)
            </TableHead>
            <TableHead className="whitespace-nowrap text-right">
              % LC (ref.)
            </TableHead>
            <TableHead className="whitespace-nowrap">Estado (ref.)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filas.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="py-8 text-center text-muted-foreground text-sm"
              >
                Ninguna URL coincide con el filtro de estado seleccionado.
              </TableCell>
            </TableRow>
          ) : (
            filas.map((row) => (
              <ClarityInventoryHistorialRow key={row.rank} row={row} />
            ))
          )}
        </TableBody>
      </Table>
    </>
  )
}

function ClarityInventoryHistorialRow({ row }: { row: ClarityInventoryRow }) {
  const bucket = resolveLcAceptacionBucket({
    porcentajeLcRef: row.porcentajeLcRef,
    estadoLcRef: row.estadoRef,
  })
  const pct = parsePorcentajeLcRef(row.porcentajeLcRef)

  return (
    <TableRow
      className={inventoryRowClassFromLcAceptacionBucket(bucket)}
    >
      <TableCell className="font-medium tabular-nums">
        <Link
          href={clarityFichaHref(row.rank)}
          className="underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Ver ficha del historial LC, posición ${row.rank}`}
        >
          {row.rank}
        </Link>
      </TableCell>
      <TableCell className="max-w-[min(100vw,28rem)] wrap-break-word">
        <Link
          href={clarityFichaHref(row.rank)}
          className="text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {row.rutaEtiqueta}
        </Link>
      </TableCell>
      <TableCell className="whitespace-nowrap text-sm">{row.encargadoRef}</TableCell>
      <TableCell className="text-right tabular-nums">{row.visitasRef}</TableCell>
      <TableCell className="text-right tabular-nums font-medium">
        {row.auditoriasRef}
      </TableCell>
      <TableCell className="text-right tabular-nums font-medium">
        {row.ultimaRevisionRef}
      </TableCell>
      <TableCell
        className={cn("text-right", porcentajeLcAceptacionTextClass(pct))}
      >
        {row.porcentajeLcRef}
      </TableCell>
      <TableCell>
        <CeldaEstadoLcAceptacion bucket={bucket} etiqueta={row.estadoRef} />
      </TableCell>
    </TableRow>
  )
}