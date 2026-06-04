"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function ResultadoInformeCollapsibleGroup({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <Accordion
      type="multiple"
      defaultValue={[]}
      className={className ?? "flex w-full flex-col gap-3"}
    >
      {children}
    </Accordion>
  )
}

export function ResultadoInformeCollapsible({
  value,
  title,
  children,
}: {
  value: string
  title: string
  children: React.ReactNode
}) {
  return (
    <AccordionItem value={value} className="overflow-hidden rounded-lg border-0">
      <AccordionTrigger className="text-start text-sm font-semibold sm:text-base">
        {title}
      </AccordionTrigger>
      <AccordionContent>{children}</AccordionContent>
    </AccordionItem>
  )
}

/** Panel fijo (sin acordeón): cabecera azul + cuerpo */
export function ResultadoInformePanel({
  title,
  id,
  children,
  bodyClassName = "p-4",
}: {
  title: string
  id: string
  children: React.ReactNode
  bodyClassName?: string
}) {
  return (
    <section
      className="overflow-hidden rounded-lg border border-border shadow-sm"
      aria-labelledby={id}
    >
      <div
        id={id}
        className="bg-[#0F69C4] px-4 py-3 text-sm font-semibold text-white"
      >
        {title}
      </div>
      <div className={`bg-card text-card-foreground ${bodyClassName}`}>
        {children}
      </div>
    </section>
  )
}