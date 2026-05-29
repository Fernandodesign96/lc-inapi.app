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
import { ClarityInventoryHistorialTable } from "@/components/clarity-inventory-historial-table"

export function AuditarInventorySections() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-base">Tabla de Auditorías URLs - Calidad Web: Sitio Web y Trámites - INAPI</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Accordion
          type="multiple"
          defaultValue={[]}
          className="flex w-full flex-col gap-3"
        >
          <AccordionItem value="historial-lc-inapi">
            <AccordionTrigger className="text-start text-sm sm:text-base">
              Historial de Auditorías URLs - INAPI
            </AccordionTrigger>
            <AccordionContent className="px-0 sm:px-0">
              <div className="px-4 pb-1 pt-0">
                <p className="mb-3 text-muted-foreground text-xs leading-relaxed">
                  Historial URLs INAPI: Calidad Web del Sitio Web + Trámites (Clarity).
                  Puede usar los filtros para encontrar URLs por tipo de URL y estado LC,
                  orden por visitas/auditorías/fecha/%
                </p>
                <ClarityInventoryHistorialTable />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}