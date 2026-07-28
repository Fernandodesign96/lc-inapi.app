import Link from "next/link"
import { notFound } from "next/navigation"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  MeiBackLink,
  MeiBreadcrumb,
} from "@/components/mei-calidad-web/mei-breadcrumb"
import {
  countItemsByEstado,
  getDimension,
  getItemsForSubdimension,
  getSubdimensionsForDimension,
} from "@/lib/mei-calidad-web/catalog-helpers"
import { loadMeiCatalogFromRepo } from "@/lib/mei-calidad-web/catalog-server"

type PageProps = {
  params: Promise<{ dimensionId: string }>
}

export default async function MeiDimensionPage({ params }: PageProps) {
  const { dimensionId } = await params
  const catalog = loadMeiCatalogFromRepo()
  const dimension = getDimension(catalog, dimensionId)

  if (!dimension) notFound()

  const subdimensions = getSubdimensionsForDimension(catalog, dimensionId)

  return (
    <div className="flex w-full flex-col gap-6">
      <MeiBackLink href="/auditar/mei-calidad-web" label="MEI Calidad Web" />
      <div className="flex flex-col gap-2">
        <MeiBreadcrumb
          items={[
            { label: "MEI", href: "/auditar/mei-calidad-web" },
            { label: dimension.name },
          ]}
        />
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {dimension.code} — {dimension.name}
        </h1>
        <p className="max-w-3xl text-muted-foreground text-sm">
          {dimension.description}
        </p>
      </div>

      <div className="grid gap-4">
        {subdimensions.map((sub) => {
          const items = getItemsForSubdimension(catalog, sub.id)
          const counts = countItemsByEstado(items)
          const claseLabel =
            sub.clase === "cl"
              ? "Contenido y Lenguaje Claro"
              : sub.clase === "us"
                ? "Usabilidad"
                : "Seguridad"

          return (
            <Card key={sub.id}>
              <CardHeader>
                <CardTitle className="text-base">
                  {sub.code} — {sub.name}
                </CardTitle>
                <CardDescription>
                  {claseLabel} · {sub.area} · {sub.costo}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <p className="line-clamp-2 text-muted-foreground text-xs">
                  {sub.objetivo}
                </p>
                <p className="text-muted-foreground text-xs">
                  {items.length} ítems · {counts.completado} completados ·{" "}
                  {counts.en_progreso} en progreso
                </p>
                <Button asChild variant="secondary" className="w-fit">
                  <Link
                    href={`/auditar/mei-calidad-web/${dimensionId}/${sub.id}`}
                  >
                    Abrir tablero trimestral
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
