"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Card,
  CardContent,
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
import { CLARITY_INVENTORY_ROWS } from "@/lib/clarity-inventory-rows"
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
import { clarityFichaHref } from "@/lib/clarity-ficha-path"

export function AuditarInventorySections() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-base">Inventarios y seguimiento</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Accordion
          type="multiple"
          defaultValue={[]}
          className="flex w-full flex-col gap-3"
        >
          <AccordionItem value="clarity-ampliado">
            <AccordionTrigger className="text-start text-sm sm:text-base">
              Prioridades evidenciadas en Microsoft Clarity (volumen e
              interacción); estados LC según referencia editorial.
            </AccordionTrigger>
            <AccordionContent className="px-0 sm:px-0">
              <div className="px-4 pb-1 pt-0">
                <p className="mb-3 text-muted-foreground text-xs leading-relaxed">
                  Orden por volumen relativo en el extracto documental (referencia 
                  editorial, no dump crudo de Clarity). Incluye encargado, auditorías y
                  última revisión LC de referencia por URL.
                </p>
                <InventarioLeyendaLcAceptacion />
                <Table>
                  <TableCaption className="sr-only">
                    Inventario Clarity con visitas, encargado, auditorías, última revisión,
                    porcentaje LC y estado editorial.
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
                      <TableHead className="whitespace-nowrap">
                        Estado (ref.)
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {CLARITY_INVENTORY_ROWS.map((row) => {
                      const bucket = resolveLcAceptacionBucket({
                        porcentajeLcRef: row.porcentajeLcRef,
                        estadoLcRef: row.estadoRef,
                      })
                      const pct = parsePorcentajeLcRef(row.porcentajeLcRef)
                      return (
                        <TableRow
                          key={row.rank}
                          className={inventoryRowClassFromLcAceptacionBucket(bucket)}
                        >
                          <TableCell className="font-medium tabular-nums">
                            <Link
                              href={clarityFichaHref(row.rank)}
                              className="underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              aria-label={`Ver ficha del inventario Clarity, posición ${row.rank}`}
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
                          <TableCell className="whitespace-nowrap text-sm">
                            {row.encargadoRef}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {row.visitasRef}
                          </TableCell>
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
                            <CeldaEstadoLcAceptacion
                              bucket={bucket}
                              etiqueta={row.estadoRef}
                            />
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
