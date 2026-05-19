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
import { MOST_AUDITED_URL_ROWS } from "@/lib/most-audited-url-rows"
import { RESOLVED_LC_STATE_ROWS } from "@/lib/resolved-lc-state-rows"

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
                  editorial, no dump crudo de Clarity). Las URLs absolutas se
                  completan en una pasada editorial posterior.
                </p>
                <Table>
                  <TableCaption className="sr-only">
                    Inventario de rutas o etiquetas Clarity con referencia de
                    visitas, porcentaje LC y estado editorial.
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10 whitespace-nowrap">#</TableHead>
                      <TableHead>Ruta o etiqueta (Clarity)</TableHead>
                      <TableHead className="whitespace-nowrap text-right">
                        Visitas (ref.)
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
                    {CLARITY_INVENTORY_ROWS.map((row) => (
                      <TableRow key={row.rank}>
                        <TableCell className="font-medium tabular-nums">
                          {row.rank}
                        </TableCell>
                        <TableCell className="max-w-[min(100vw,28rem)] break-words">
                          {row.rutaEtiqueta}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {row.visitasRef}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {row.porcentajeLcRef}
                        </TableCell>
                        <TableCell>{row.estadoRef}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="mas-auditadas">
            <AccordionTrigger className="text-start text-sm sm:text-base">
              URLs más auditadas (seguimiento interno — mock)
            </AccordionTrigger>
            <AccordionContent className="px-0 sm:px-0">
              <div className="px-4 pb-1 pt-0">
                <p className="mb-3 text-muted-foreground text-xs leading-relaxed">
                  Datos demostrativos hasta que el equipo defina la fuente
                  (OpenProject, histórico de auditorías o exportación interna).
                  Las cifras no representan persistencia real en Fase 1.
                </p>
                <Table>
                  <TableCaption className="sr-only">
                    URLs con mayor número de auditorías de referencia en el mock.
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10 whitespace-nowrap">#</TableHead>
                      <TableHead>Página (ref.)</TableHead>
                      <TableHead className="whitespace-nowrap text-right">
                        Auditorías (ref.)
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Última revisión (ref.)
                      </TableHead>
                      <TableHead>Nota</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOST_AUDITED_URL_ROWS.map((row) => (
                      <TableRow key={row.rank}>
                        <TableCell className="font-medium tabular-nums">
                          {row.rank}
                        </TableCell>
                        <TableCell className="max-w-[min(100vw,24rem)] break-all sm:break-words">
                          {row.paginaRef}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {row.auditoriasRef}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {row.ultimaRevisionRef}
                        </TableCell>
                        <TableCell className="max-w-[min(100vw,20rem)] break-words text-muted-foreground">
                          {row.nota}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="estados-resueltos">
            <AccordionTrigger className="text-start text-sm sm:text-base">
              URLs con estados LC resueltos (cierre editorial — mock)
            </AccordionTrigger>
            <AccordionContent className="px-0 sm:px-0">
              <div className="px-4 pb-1 pt-0">
                <p className="mb-3 text-muted-foreground text-xs leading-relaxed">
                  Casos de ejemplo con cierre de ciclo LC en la narrativa del mock.
                  Sustituir por datos validados o fixtures cuando existan en
                  repositorio.
                </p>
                <Table>
                  <TableCaption className="sr-only">
                    URLs con estado final de lenguaje claro y fecha de cierre de
                    referencia.
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10 whitespace-nowrap">#</TableHead>
                      <TableHead>Página (ref.)</TableHead>
                      <TableHead className="whitespace-nowrap">
                        Estado LC final (ref.)
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Fecha cierre (ref.)
                      </TableHead>
                      <TableHead>Observación</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {RESOLVED_LC_STATE_ROWS.map((row) => (
                      <TableRow key={row.rank}>
                        <TableCell className="font-medium tabular-nums">
                          {row.rank}
                        </TableCell>
                        <TableCell className="max-w-[min(100vw,24rem)] break-all sm:break-words">
                          {row.paginaRef}
                        </TableCell>
                        <TableCell>{row.estadoLcFinalRef}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          {row.fechaCierreRef}
                        </TableCell>
                        <TableCell className="max-w-[min(100vw,20rem)] break-words text-muted-foreground">
                          {row.observacion}
                        </TableCell>
                      </TableRow>
                    ))}
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