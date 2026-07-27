"use client"

import { useMemo, useState } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatFechaEvaluacion } from "@/lib/informe-piloto-format"
import { labelTipoPagina } from "@/lib/informe-piloto-format"
import {
  clarityRowsConHistorial,
  historialRankHref,
  type ClarityAuditLaunchRow,
} from "@/lib/clarity-audits-launch"
import {
  CeldaEstadoLcAceptacion,
  inventoryRowClassFromLcAceptacionBucket,
  porcentajeLcAceptacionTextClass,
  resolveLcAceptacionBucket,
} from "@/lib/lc-aceptacion-visual"
import { cn } from "@/lib/utils"

const FILTER_SELECT_CLASS =
  "mt-1 min-h-9 w-full max-w-xs rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground dark:bg-input/30"

function formatPct(n: number): string {
  return `${n.toFixed(1).replace(".", ",")} %`
}

type FiltroTipo = "todos" | "tramites" | "sitioweb"

export function AuditarHistorialIndex() {
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>("todos")
  const filas = useMemo(() => {
    const all = clarityRowsConHistorial()
    if (filtroTipo === "todos") return all
    return all.filter((r) => r.tipoPagina === filtroTipo)
  }, [filtroTipo])

  return (
    <div className="flex w-full flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Historial de auditorías</CardTitle>
          <CardDescription>
            URLs Clarity con al menos un informe en el repositorio. Elige una
            URL para ver las fechas de cada auditoría.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-0.5 text-xs font-medium text-foreground">
              Tipo de URL
              <select
                className={FILTER_SELECT_CLASS}
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value as FiltroTipo)}
                aria-label="Filtrar por tipo de URL"
              >
                <option value="todos">Todas</option>
                <option value="tramites">URLs Trámites</option>
                <option value="sitioweb">URLs Sitio Web</option>
              </select>
            </label>
            <Button asChild variant="outline">
              <Link href="/auditar">Volver a auditar</Link>
            </Button>
          </div>

          <Table>
            <TableCaption>
              {filas.length} URL{filas.length === 1 ? "" : "s"} con informe
              {filtroTipo === "todos" ? "" : ` (${labelTipoPagina(filtroTipo)})`}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">Rank</TableHead>
                <TableHead scope="col">Página</TableHead>
                <TableHead scope="col">Tipo</TableHead>
                <TableHead scope="col" className="text-right">
                  Versiones
                </TableHead>
                <TableHead scope="col">Última evaluación</TableHead>
                <TableHead scope="col" className="text-right">
                  % LC
                </TableHead>
                <TableHead scope="col">Estado</TableHead>
                <TableHead scope="col">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filas.map((row) => (
                <HistorialIndexRow key={row.rank} row={row} />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function HistorialIndexRow({ row }: { row: ClarityAuditLaunchRow }) {
  const vigente = row.versiones.find((v) => v.esVigente) ?? row.versiones[0]
  const pct = vigente?.resumenMvp.porcentajeLc ?? null
  const bucket = resolveLcAceptacionBucket({
    porcentajeLcRef: pct !== null ? formatPct(pct) : undefined,
    estadoLcRef: vigente?.resumenMvp.estadoAceptacion,
  })

  return (
    <TableRow className={inventoryRowClassFromLcAceptacionBucket(bucket)}>
      <TableCell className="font-medium">{row.rank}</TableCell>
      <TableCell>
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-foreground">{row.label}</span>
          <span className="break-all text-xs text-muted-foreground">
            {row.url}
          </span>
        </div>
      </TableCell>
      <TableCell>{labelTipoPagina(row.tipoPagina)}</TableCell>
      <TableCell className="text-right tabular-nums">
        {row.versiones.length}
      </TableCell>
      <TableCell>
        {vigente
          ? formatFechaEvaluacion(vigente.resumenMvp.fechaEvaluacionIso)
          : "—"}
      </TableCell>
      <TableCell
        className={cn(
          "text-right tabular-nums font-medium",
          porcentajeLcAceptacionTextClass(pct),
        )}
      >
        {pct !== null ? formatPct(pct) : "—"}
      </TableCell>
      <TableCell>
        <CeldaEstadoLcAceptacion bucket={bucket} />
      </TableCell>
      <TableCell>
        <Link
          href={historialRankHref(row.rank)}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Ver historial
        </Link>
      </TableCell>
    </TableRow>
  )
}