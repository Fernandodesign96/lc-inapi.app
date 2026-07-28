import Link from "next/link"
import { FileSpreadsheet } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MeiBreadcrumb } from "@/components/mei-calidad-web/mei-breadcrumb"
import {
  countItemsByEstado,
  exportableHitoIds,
  getSubdimensionsForDimension,
} from "@/lib/mei-calidad-web/catalog-helpers"
import { MEI_COMPLETO_EXPORT_HREF } from "@/lib/mei-calidad-web/export-href"
import { loadMeiCatalogFromRepo } from "@/lib/mei-calidad-web/catalog-server"

export default function MeiCalidadWebPage() {
  const catalog = loadMeiCatalogFromRepo()
  const exportables = exportableHitoIds(catalog)

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3">
        <MeiBreadcrumb items={[{ label: "MEI Calidad Web" }]} />
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            MEI Calidad Web — PTD
          </h1>
          <p className="mt-2 max-w-3xl text-muted-foreground text-sm leading-relaxed">
            Plan de Trabajo Detallado (dimensiones D2.1 sitio y D2.2 servicio).
            Navegue por subdimensión y trimestre; descargue Excel por hito
            completado.
          </p>
        </div>
        {exportables.length > 0 ? (
          <Button asChild className="w-fit">
            <a href={MEI_COMPLETO_EXPORT_HREF}>
              <FileSpreadsheet />
              Descargar entrega completa ({exportables.length} hito
              {exportables.length === 1 ? "" : "s"})
            </a>
          </Button>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {catalog.dimensions.map((dimension) => {
          const subdims = getSubdimensionsForDimension(catalog, dimension.id)
          const items = catalog.items.filter((item) =>
            subdims.some((s) => s.id === item.subdimensionId),
          )
          const counts = countItemsByEstado(items)

          return (
            <Card key={dimension.id}>
              <CardHeader>
                <CardTitle className="text-base">
                  {dimension.code} — {dimension.name}
                </CardTitle>
                <CardDescription>{dimension.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <p className="text-muted-foreground text-xs">
                  Resultado meta: {dimension.resultado} · {subdims.length}{" "}
                  subdimensiones · {counts.completado} completados
                </p>
                <Button asChild variant="secondary">
                  <Link href={`/auditar/mei-calidad-web/${dimension.id}`}>
                    Ver subdimensiones
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
