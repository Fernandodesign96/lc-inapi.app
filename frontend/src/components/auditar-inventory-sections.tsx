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
        <CardTitle className="text-base">Tabla de Auditorías LC - URLs INAPI</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Accordion
          type="multiple"
          defaultValue={[]}
          className="flex w-full flex-col gap-3"
        >
          <AccordionItem value="historial-lc-inapi">
            <AccordionTrigger className="text-start text-sm sm:text-base">
              Historial de Auditoría LC - URLs INAPI
            </AccordionTrigger>
            <AccordionContent className="px-0 sm:px-0">
              <div className="px-4 pb-1 pt-0">
                <p className="mb-3 text-muted-foreground text-xs leading-relaxed">
                  Registro mock de las 20 URLs INAPI priorizadas por volumen Clarity
                  (referencia editorial). Filtre por estado LC u ordene por visitas,
                  auditorías, última revisión o % LC. Use el número o la ruta para abrir
                  la ficha de cada URL.
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