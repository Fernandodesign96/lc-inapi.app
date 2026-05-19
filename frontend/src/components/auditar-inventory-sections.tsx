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

export function AuditarInventorySections() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-base">Inventarios y seguimiento</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="a">
            <AccordionTrigger>Título sección</AccordionTrigger>
            <AccordionContent>Contenido</AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}