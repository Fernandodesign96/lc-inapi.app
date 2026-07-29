"use client"

import { Download, FileSpreadsheet } from "lucide-react"

import type { MeiItem } from "@contracts/mei-calidad-web-catalog"

import { MeiEstadoBadge } from "@/components/mei-calidad-web/mei-estado-badge"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { isHitoExportable } from "@/lib/mei-calidad-web/catalog-helpers"
import { meiHitoExportHref } from "@/lib/mei-calidad-web/export-href"
import { cn } from "@/lib/utils"

function itemTypeLabel(item: MeiItem): string {
  if (item.type === "hito") return "Hito"
  return item.numeroActividad
    ? `Actividad ${item.numeroActividad}`
    : "Tarea"
}

export function MeiItemCard({
  item,
  variant = item.type === "hito" ? "hito" : "actividad",
}: {
  item: MeiItem
  variant?: "hito" | "actividad"
}) {
  const exportable = isHitoExportable(item)
  const hasExcel = item.type === "hito" && item.excelHitoId !== null
  const isHito = variant === "hito"

  return (
    <Card
      className={cn(
        "flex min-h-[7.5rem] flex-col border-border",
        isHito && "min-h-[9rem] border-primary/40 bg-primary/5 shadow-sm",
        !isHito && "bg-card",
      )}
    >
      <CardHeader className={cn("gap-2", isHito ? "pb-2" : "py-3 pb-1")}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
            {itemTypeLabel(item)}
          </span>
          <MeiEstadoBadge estado={item.estado} />
          {item.excelHitoId ? (
            <span className="text-muted-foreground text-xs">
              {item.excelHitoId}
            </span>
          ) : null}
        </div>
        <CardTitle
          className={cn(
            "leading-snug",
            isHito ? "line-clamp-2 text-sm" : "line-clamp-2 text-xs",
          )}
        >
          {item.title}
        </CardTitle>
      </CardHeader>
      <CardContent className={cn("flex-1 pb-2", !isHito && "pt-0")}>
        {isHito ? (
          <CardDescription className="line-clamp-2 text-xs leading-relaxed">
            {item.description}
          </CardDescription>
        ) : null}
        <p className="mt-1 text-muted-foreground text-xs">
          {item.inicio} → {item.termino}
        </p>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 pt-0">
        <Dialog>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" size="sm">
              Ver detalle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>{item.title}</DialogTitle>
              <DialogDescription>
                {itemTypeLabel(item)} · {item.trimestre}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div className="flex flex-wrap gap-2">
                <MeiEstadoBadge estado={item.estado} />
                {item.excelHitoId ? (
                  <span className="text-muted-foreground text-xs">
                    Excel: {item.excelHitoId}
                  </span>
                ) : null}
              </div>
              <p className="leading-relaxed">{item.description}</p>
              <dl className="grid gap-2 text-xs">
                <div>
                  <dt className="font-medium">Inicio</dt>
                  <dd className="text-muted-foreground">{item.inicio}</dd>
                </div>
                <div>
                  <dt className="font-medium">Término</dt>
                  <dd className="text-muted-foreground">{item.termino}</dd>
                </div>
                <div>
                  <dt className="font-medium">Trimestre</dt>
                  <dd className="text-muted-foreground">{item.trimestre}</dd>
                </div>
              </dl>
            </div>
            {hasExcel ? (
              <DialogFooter>
                {exportable ? (
                  <Button asChild size="sm">
                    <a href={meiHitoExportHref(item.excelHitoId!)}>
                      <FileSpreadsheet />
                      Descargar Excel
                    </a>
                  </Button>
                ) : (
                  <Button type="button" size="sm" disabled>
                    <Download />
                    Excel al completar hito
                  </Button>
                )}
              </DialogFooter>
            ) : null}
          </DialogContent>
        </Dialog>
        {hasExcel ? (
          exportable ? (
            <Button asChild size="sm">
              <a href={meiHitoExportHref(item.excelHitoId!)}>
                <FileSpreadsheet />
                Excel
              </a>
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              disabled
              title="Disponible al completar el hito"
            >
              <Download />
              Excel
            </Button>
          )
        ) : null}
      </CardFooter>
    </Card>
  )
}
