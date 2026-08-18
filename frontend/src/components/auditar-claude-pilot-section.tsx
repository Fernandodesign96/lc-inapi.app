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
import { CeldaEstadoLcAceptacion } from "@/lib/lc-aceptacion-visual"
import {
  META_MEI_TABLE_ROWS,
  metaMeiResultadoHref,
} from "@/lib/mei-meta-mei-launch"
import { ETIQUETA_ESTADO_ACEPTACION } from "@/lib/resultado-mock-copy"
import { cn } from "@/lib/utils"

function labelTipoPagina(tipo: "sitioweb" | "tramites"): string {
  return tipo === "tramites" ? "Trámites" : "Sitio web"
}

export function AuditarClaudePilotSection() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-base">
          Auditoría 10 URLs INAPI - META MEI
        </CardTitle>
        <CardDescription>
          Cada fila muestra la última auditoría realizada para esa URL. Abra
          una fila disponible para ver el informe en detalle (PDF y Excel MEI
          en resultado).
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="meta-mei-10">
            <AccordionTrigger className="text-start text-sm sm:text-base">
              10 URLs - META MEI
            </AccordionTrigger>
            <AccordionContent>
              <div className="overflow-x-auto px-1 pb-2">
                <Table className="min-w-[56rem]">
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="w-10">#</TableHead>
                      <TableHead>Página</TableHead>
                      <TableHead>Rol META MEI</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>% LC</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Última evaluación</TableHead>
                      <TableHead>Encargado</TableHead>
                      <TableHead>MVP</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {META_MEI_TABLE_ROWS.map((row) => {
                      const href = metaMeiResultadoHref(row)
                      const resumen = row.resumenMvp
                      return (
                        <TableRow
                          key={`meta-mei-${row.orden}`}
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
                                {row.orden}
                              </Link>
                            ) : (
                              row.orden
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
                          <TableCell className="max-w-[12rem] text-xs text-muted-foreground">
                            {row.rolMetaMei}
                          </TableCell>
                          <TableCell className="text-sm">
                            {labelTipoPagina(row.tipoPagina)}
                          </TableCell>
                          <TableCell className="tabular-nums text-sm">
                            {resumen
                              ? `${resumen.porcentajeLc.toFixed(1).replace(".", ",")} %`
                              : "—"}
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
