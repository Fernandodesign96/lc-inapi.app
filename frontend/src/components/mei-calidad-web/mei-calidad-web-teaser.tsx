import Link from "next/link"
import { LayoutGrid } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { exportableHitoIds } from "@/lib/mei-calidad-web/catalog-helpers"
import { loadMeiCatalogFromRepo } from "@/lib/mei-calidad-web/catalog-server"

export function MeiCalidadWebTeaser() {
  const catalog = loadMeiCatalogFromRepo()
  const exportables = exportableHitoIds(catalog)
  const clItems = catalog.items.filter((i) => i.subdimensionId === "cl_sitio")
  const completados = clItems.filter((i) => i.estado === "completado").length

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <LayoutGrid className="size-4" />
          MEI Calidad Web — PTD
        </CardTitle>
        <CardDescription>
          Plan de Trabajo Detallado: dimensiones sitio y servicio, tablero por
          trimestre y descarga Excel por hito completado (H01–H13).
        </CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground text-xs">
        CL sitio: {completados}/{clItems.length} ítems completados ·{" "}
        {exportables.length} hito{exportables.length === 1 ? "" : "s"} con Excel
        habilitado
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link href="/auditar/mei-calidad-web">Abrir módulo MEI</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
