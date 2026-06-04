"use client"

import Link from "next/link"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatFechaEvaluacion } from "@/components/resultado-claude-pilot-sections"
import {
  CLAUDE_PILOT_URL_ROWS,
  pilotRowDisponibleEnMvp,
  type ClaudePilotUrlRow,
} from "@/lib/claude-audits-launch"
import { CeldaEstadoLcAceptacion } from "@/lib/lc-aceptacion-visual"
import { ETIQUETA_ESTADO_ACEPTACION } from "@/lib/resultado-mock-copy"
import { cn } from "@/lib/utils"

function labelTipoPagina(tipo: "sitioweb" | "tramites"): string {
  return tipo === "tramites" ? "Trámites" : "Sitio web"
}

function resultadoPilotoHref(row: ClaudePilotUrlRow): string | null {
  if (!pilotRowDisponibleEnMvp(row)) return null
  const params = new URLSearchParams({
    claudeAudit: row.claudeAuditId!,
    url: row.url,
  })
  return `/auditar/resultado?${params.toString()}`
}

export function AuditarClaudePilotSection() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-base">
          Piloto auditoría LC — 10 URLs (entrega TIC)
        </CardTitle>
        <CardDescription>
          Auditorías Claude exportadas al repositorio. Abra una fila disponible
          para ver el informe con los siete bloques acordados.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="piloto-junio-2026">
            <AccordionTrigger className="text-start text-sm sm:text-base">
              URLs auditadas — piloto junio 2026
            </AccordionTrigger>
            <AccordionContent>
              <div className="overflow-x-auto px-1 pb-2">
                <Table className="min-w-[56rem]">
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="w-10">#</TableHead>
                      <TableHead>Página</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>% LC</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Última evaluación</TableHead>
                      <TableHead>Encargado</TableHead>
                      <TableHead>MVP</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {CLAUDE_PILOT_URL_ROWS.map((row) => {
                      const href = resultadoPilotoHref(row)
                      const resumen = row.resumenMvp
                      return (
                        <TableRow
                          key={`piloto-${row.pilotoNum}`}
                          className={cn(
                            href &&
                              "cursor-pointer hover:bg-muted/40 focus-within:bg-muted/40",
                          )}
                        >
                          <TableCell className="font-mono text-xs tabular-nums">
                            {href ? (
                              <Link
                                href={href}
                                className="font-semibold text-primary underline-offset-4 hover:underline"
                              >
                                {row.pilotoNum}
                              </Link>
                            ) : (
                              row.pilotoNum
                            )}
                          </TableCell>
                          <TableCell className="max-w-[14rem]">
                            {href ? (
                              <Link
                                href={href}
                                className="text-sm font-medium leading-snug text-primary underline-offset-4 hover:underline"
                              >
                                {row.label}
                              </Link>
                            ) : (
                              <span className="text-sm font-medium leading-snug">
                                {row.label}
                              </span>
                            )}
                            <p className="mt-0.5 break-all text-xs text-muted-foreground">
                              {row.url}
                            </p>
                          </TableCell>
                          <TableCell className="text-sm">
                            {labelTipoPagina(row.tipoPagina)}
                          </TableCell>
                          <TableCell className="tabular-nums text-sm">
                            {resumen ? `${resumen.porcentajeLc} %` : "—"}
                          </TableCell>
                          <TableCell>
                            {resumen ? (
                              <CeldaEstadoLcAceptacion
                                bucket={resumen.estadoAceptacion}
                                etiqueta={
                                  ETIQUETA_ESTADO_ACEPTACION[
                                    resumen.estadoAceptacion
                                  ]
                                }
                              />
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                —
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-sm">
                            {resumen
                              ? formatFechaEvaluacion(
                                  resumen.fechaEvaluacionIso,
                                )
                              : "—"}
                          </TableCell>
                          <TableCell className="max-w-[10rem] text-sm">
                            {resumen?.evaluadorUid ?? "—"}
                          </TableCell>
                          <TableCell>
                            {href ? (
                              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                Disponible
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                Pendiente
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}