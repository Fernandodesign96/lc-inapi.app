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
import { formatFechaEvaluacion } from "@/components/resultado-claude-pilot-sections"
import {
  clarityLaunchByRank,
  clarityRowDisponibleEnMvp,
  resultadoClarityHref,
} from "@/lib/clarity-audits-launch"
import { ETIQUETA_ESTADO_ACEPTACION } from "@/lib/resultado-mock-copy"
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
  type FiltroTypeUrlInventario,
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
  const [filtroTypeUrl, setFiltroTypeUrl] =
    useState<FiltroTypeUrlInventario>("todos")
  const [sortKey, setSortKey] = useState<ClarityInventarioSortKey>("rank")
  const [sortDir, setSortDir] = useState<SortDirection>("asc")

  const filas = useMemo(
    () =>
      filterAndSortClarityInventoryRows(CLARITY_INVENTORY_ROWS, {
        filtroEstado,
        filtroTypeUrl,
        sortKey,
        sortDir,
      }),
    [filtroEstado, filtroTypeUrl, sortKey, sortDir],
  )

  const sortSummary = clarityInventarioSortSummary(sortKey, sortDir)

  function resetFiltros() {
    setFiltroEstado("todos")
    setFiltroTypeUrl("todos")
    setSortKey("rank")
    setSortDir("asc")
  }

  return (
    <>
      <InventarioLeyendaLcAceptacion />
      <div
        className="mb-3 grid gap-3 border-b border-border pb-3 sm:grid-cols-2 lg:grid-cols-5"
        role="group"
        aria-label="Filtros y orden del historial de auditorías URLs INAPI"
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
          Tipo de URL
          <select
            className={FILTER_SELECT_CLASS}
            value={filtroTypeUrl}
            onChange={(e) =>
              setFiltroTypeUrl(e.target.value as FiltroTypeUrlInventario)
            }
          >
            <option value="todos">Todas</option>
            <option value="tramites">URLs Trámites</option>
            <option value="sitioweb">URLs Sitio Web</option>
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
            <option value="visitas">Visitas</option>
            <option value="auditorias">Auditorías</option>
            <option value="ultimaRevision">Última revisión</option>
            <option value="porcentaje">% LC</option>
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
          Historial de auditorías URLs INAPI — Calidad Web Sitio Web y Trámites:
          posición, ruta, tipo de URL, encargado, visitas, auditorías, última
          revisión, porcentaje LC y estado de referencia.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10 whitespace-nowrap">#</TableHead>
            <TableHead>Ruta o etiqueta (Clarity)</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="whitespace-nowrap">Encargado</TableHead>
            <TableHead className="whitespace-nowrap text-right">
              Visitas
            </TableHead>
            <TableHead className="whitespace-nowrap text-right">
              Auditorías
            </TableHead>
            <TableHead className="whitespace-nowrap">
              Última revisión
            </TableHead>
            <TableHead className="whitespace-nowrap text-right">
              % LC
            </TableHead>
            <TableHead className="whitespace-nowrap">Estado</TableHead>
            <TableHead className="whitespace-nowrap">Informe</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filas.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={10}
                className="py-8 text-center text-muted-foreground text-sm"
              >
                Ninguna URL coincide con los filtros seleccionados.
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
  const launch = clarityLaunchByRank(row.rank)
  const href = launch ? resultadoClarityHref(launch) : null
  const resumen = launch?.resumenMvp

  const porcentajeLc = resumen
    ? `${resumen.porcentajeLc} %`
    : row.porcentajeLcRef
  const pct = resumen ? resumen.porcentajeLc : parsePorcentajeLcRef(row.porcentajeLcRef)

  const bucket = resumen
    ? resumen.estadoAceptacion
    : resolveLcAceptacionBucket({
        porcentajeLcRef: row.porcentajeLcRef,
        estadoLcRef: row.estadoRef,
      })

  const estadoEtiqueta = resumen
    ? ETIQUETA_ESTADO_ACEPTACION[resumen.estadoAceptacion]
    : row.estadoRef

  const ultimaRevision = resumen
    ? formatFechaEvaluacion(resumen.fechaEvaluacionIso)
    : row.ultimaRevisionRef

  return (
    <TableRow
      className={cn(
        inventoryRowClassFromLcAceptacionBucket(bucket),
        href && "cursor-pointer hover:bg-muted/40 focus-within:bg-muted/40",
      )}
    >
      <TableCell className="font-medium tabular-nums">
        {href ? (
          <Link
            href={href}
            className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`Ver informe LC, posición ${row.rank}`}
          >
            {row.rank}
          </Link>
        ) : (
          row.rank
        )}
      </TableCell>
      <TableCell className="max-w-[min(100vw,28rem)] wrap-break-word">
        {href ? (
          <Link
            href={href}
            className="text-sm font-medium leading-snug text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`Ver informe: ${row.rutaEtiqueta}, posición ${row.rank}`}
          >
            {row.rutaEtiqueta}
          </Link>
        ) : (
          <span className="text-sm font-medium leading-snug text-foreground">
            {row.rutaEtiqueta}
          </span>
        )}
        {launch ? (
          <p className="mt-0.5 break-all text-xs text-muted-foreground">
            {launch.url}
          </p>
        ) : null}
      </TableCell>
      <TableCell className="whitespace-nowrap text-sm">
        {row.type_url === "tramites" ? "Trámites" : "Sitio Web"}
      </TableCell>
      <TableCell className="whitespace-nowrap text-sm">{row.encargadoRef}</TableCell>
      <TableCell className="text-right tabular-nums">{row.visitasRef}</TableCell>
      <TableCell className="text-right tabular-nums font-medium">
        {row.auditoriasRef}
      </TableCell>
      <TableCell className="text-right tabular-nums font-medium whitespace-nowrap">
        {ultimaRevision}
      </TableCell>
      <TableCell
        className={cn("text-right tabular-nums", porcentajeLcAceptacionTextClass(pct))}
      >
        {porcentajeLc}
      </TableCell>
      <TableCell>
        <CeldaEstadoLcAceptacion bucket={bucket} etiqueta={estadoEtiqueta} />
      </TableCell>
      <TableCell>
        {href && launch && clarityRowDisponibleEnMvp(launch) ? (
          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
            Disponible
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">Pendiente</span>
        )}
      </TableCell>
    </TableRow>
  )
}