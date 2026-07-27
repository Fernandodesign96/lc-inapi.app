import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  clarityLaunchByRank,
  historialHref,
  resultadoClarityHrefForId,
} from "@/lib/clarity-audits-launch"
import { formatFechaEvaluacion, labelTipoPagina } from "@/lib/informe-piloto-format"
import {
  CeldaEstadoLcAceptacion,
  inventoryRowClassFromLcAceptacionBucket,
  porcentajeLcAceptacionTextClass,
  resolveLcAceptacionBucket,
} from "@/lib/lc-aceptacion-visual"
import { cn } from "@/lib/utils"

function formatPct(n: number): string {
  return `${n.toFixed(1).replace(".", ",")} %`
}

export function AuditarHistorialPorUrl({ rank }: { rank: number }) {
  const row = clarityLaunchByRank(rank)

  if (!row || !row.claudeAuditId || row.versiones.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sin historial</CardTitle>
          <CardDescription>
            Esta URL no tiene informes LC en el repositorio (p. ej. Pendiente
            TI) o el rank no existe.
          </CardDescription>
        </CardHeader>
        <CardFooter className="gap-2">
          <Button asChild variant="outline">
            <Link href={historialHref()}>Volver al historial</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/auditar">Volver a auditar</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <Card>
        <CardHeader>
          <p className="text-sm text-muted-foreground">
            <Link
              href={historialHref()}
              className="text-primary underline-offset-4 hover:underline"
            >
              Historial de auditorías
            </Link>
            <span aria-hidden> / </span>
            <span>Rank {row.rank}</span>
          </p>
          <CardTitle>{row.label}</CardTitle>
          <CardDescription>
            <span className="block break-all">{row.url}</span>
            <span className="mt-1 block">
              Tipo: {labelTipoPagina(row.tipoPagina)} · {row.versiones.length}{" "}
              versión{row.versiones.length === 1 ? "" : "es"}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>
              Auditorías LC de esta URL, de la más reciente a la más antigua.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">Fecha</TableHead>
                <TableHead scope="col" className="text-right">
                  % LC
                </TableHead>
                <TableHead scope="col">Estado</TableHead>
                <TableHead scope="col">Versión</TableHead>
                <TableHead scope="col">Informe</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {row.versiones.map((v) => {
                const pct = v.resumenMvp.porcentajeLc
                const bucket = resolveLcAceptacionBucket({
                  porcentajeLcRef: formatPct(pct),
                  estadoLcRef: v.resumenMvp.estadoAceptacion,
                })
                return (
                  <TableRow
                    key={v.id}
                    className={inventoryRowClassFromLcAceptacionBucket(bucket)}
                  >
                    <TableCell>
                      {formatFechaEvaluacion(v.resumenMvp.fechaEvaluacionIso)}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right tabular-nums font-medium",
                        porcentajeLcAceptacionTextClass(pct),
                      )}
                    >
                      {formatPct(pct)}
                    </TableCell>
                    <TableCell>
                      <CeldaEstadoLcAceptacion bucket={bucket} />
                    </TableCell>
                    <TableCell>
                      {v.esVigente ? (
                        <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          Vigente
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Anterior
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={resultadoClarityHrefForId(row.url, v.id)}
                        className="font-medium text-primary underline-offset-4 hover:underline"
                      >
                        Ver informe
                      </Link>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="gap-2">
          <Button asChild variant="outline">
            <Link href={historialHref()}>Volver al historial</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/auditar">Volver a auditar</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}