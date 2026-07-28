import { notFound } from "next/navigation"
import { FileSpreadsheet } from "lucide-react"

import { MeiTrimestreBoard } from "@/components/mei-calidad-web/mei-trimestre-board"
import {
  MeiBackLink,
  MeiBreadcrumb,
} from "@/components/mei-calidad-web/mei-breadcrumb"
import { Button } from "@/components/ui/button"
import {
  exportableHitoIds,
  getDimension,
  getItemsForSubdimension,
  getSubdimension,
} from "@/lib/mei-calidad-web/catalog-helpers"
import { MEI_COMPLETO_EXPORT_HREF } from "@/lib/mei-calidad-web/export-href"
import { loadMeiCatalogFromRepo } from "@/lib/mei-calidad-web/catalog-server"

type PageProps = {
  params: Promise<{ dimensionId: string; subdimensionId: string }>
}

export default async function MeiSubdimensionPage({ params }: PageProps) {
  const { dimensionId, subdimensionId } = await params
  const catalog = loadMeiCatalogFromRepo()
  const dimension = getDimension(catalog, dimensionId)
  const subdimension = getSubdimension(catalog, subdimensionId)

  if (!dimension || !subdimension || subdimension.dimensionId !== dimensionId) {
    notFound()
  }

  const items = getItemsForSubdimension(catalog, subdimensionId)
  const exportablesInSub = exportableHitoIds(catalog).filter((hitoId) =>
    items.some(
      (item) => item.type === "hito" && item.excelHitoId === hitoId,
    ),
  )

  return (
    <div className="flex w-full flex-col gap-6">
      <MeiBackLink
        href={`/auditar/mei-calidad-web/${dimensionId}`}
        label={dimension.name}
      />
      <div className="flex flex-col gap-2">
        <MeiBreadcrumb
          items={[
            { label: "MEI", href: "/auditar/mei-calidad-web" },
            {
              label: dimension.name,
              href: `/auditar/mei-calidad-web/${dimensionId}`,
            },
            { label: subdimension.name },
          ]}
        />
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {subdimension.code} — {subdimension.name}
        </h1>
        <p className="max-w-3xl text-muted-foreground text-sm">
          {subdimension.objetivo}
        </p>
      </div>

      {exportablesInSub.length > 0 ? (
        <p className="text-muted-foreground text-xs">
          Hitos con Excel disponible en esta subdimensión:{" "}
          {exportablesInSub.join(", ")}. Use el botón en cada card de hito o la
          entrega completa.
        </p>
      ) : null}

      {exportableHitoIds(catalog).length > 0 ? (
        <Button asChild variant="outline" className="w-fit">
          <a href={MEI_COMPLETO_EXPORT_HREF}>
            <FileSpreadsheet />
            Entrega completa (hitos completados)
          </a>
        </Button>
      ) : null}

      <MeiTrimestreBoard items={items} />
    </div>
  )
}
