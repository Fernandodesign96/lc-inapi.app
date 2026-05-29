import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  CLARITY_FICHAS_MOCK,
  getClarityFichaByRank,
  isValidClarityFichaRank,
} from "@/lib/clarity-fichas-mock"
import { parsePorcentajeLcRef } from "@/lib/inventory-table-visuals"
import {
  CeldaEstadoLcAceptacion,
  inventoryRowClassFromLcAceptacionBucket,
  porcentajeLcAceptacionTextClass,
  resolveLcAceptacionBucket,
} from "@/lib/lc-aceptacion-visual"
import { cn } from "@/lib/utils"

type PageProps = {
  params: Promise<{ rank: string }>
}

const PANEL_BODY_CLASS = "bg-card text-card-foreground"

export function generateStaticParams() {
  return CLARITY_FICHAS_MOCK.map((f) => ({ rank: String(f.rank) }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { rank: rankRaw } = await params
  const rank = Number.parseInt(rankRaw, 10)
  const ficha = isValidClarityFichaRank(rank)
    ? getClarityFichaByRank(rank)
    : undefined

  if (!ficha) {
    return { title: "Ficha no encontrada | LC INAPI" }
  }

  return {
    title: `${ficha.nombre} | Inventario Clarity`,
    description: ficha.descripcion,
  }
}

export default async function ClarityFichaPage({ params }: PageProps) {
  const { rank: rankRaw } = await params
  const rank = Number.parseInt(rankRaw, 10)

  if (!isValidClarityFichaRank(rank)) {
    notFound()
  }

  const ficha = getClarityFichaByRank(rank)
  if (!ficha) {
    notFound()
  }

  const bucket = resolveLcAceptacionBucket({
    porcentajeLcRef: ficha.porcentajeLcRef,
    estadoLcRef: ficha.estadoLcRef,
  })
  const pct = parsePorcentajeLcRef(ficha.porcentajeLcRef)
  const auditarHref = `/auditar/procesando?url=${encodeURIComponent(ficha.url)}`

  return (
    <div className="flex w-full flex-col gap-6">
      <Card>
        <CardHeader className="gap-4 space-y-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1 space-y-1.5">
              <p className="text-muted-foreground text-xs font-medium tabular-nums">
                Inventario Clarity · #{ficha.rank}
              </p>
              <CardTitle>{ficha.nombre}</CardTitle>
              <CardDescription>
                Ficha mock de referencia editorial (Fase 1). No sustituye un
                informe LC con los 39 criterios.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              className="shrink-0 self-start sm:self-auto"
              asChild
            >
              <Link href="/auditar">Regresar al inventario</Link>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <section
            className="overflow-hidden rounded-lg border border-border shadow-sm"
            aria-labelledby="clarity-ficha-resumen-titulo"
          >
            <div
              id="clarity-ficha-resumen-titulo"
              className="bg-[#0F69C4] px-4 py-3 text-sm font-semibold text-white"
            >
              Resumen
            </div>
            <div className={cn(PANEL_BODY_CLASS, "p-4")}>
              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <dt className="text-muted-foreground">URL (mock)</dt>
                  <dd className="mt-0.5 font-medium break-all">
                    <a
                      href={ficha.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4 hover:text-primary"
                    >
                      {ficha.url}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Tipo de URL</dt>
                  <dd className="mt-0.5">
                    {ficha.type_url === "tramites" ? "Trámites" : "Sitio Web"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Ruta o etiqueta (Clarity)</dt>
                  <dd className="mt-0.5">{ficha.rutaEtiqueta}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Visitas (ref.)</dt>
                  <dd className="mt-0.5 tabular-nums">{ficha.visitasRef}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Auditorías (ref.)</dt>
                  <dd className="mt-0.5 tabular-nums font-medium">
                    {ficha.auditoriasRef}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Última revisión (ref.)</dt>
                  <dd className="mt-0.5 tabular-nums font-medium">
                    {ficha.ultimaRevisionRef}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">% LC (ref.)</dt>
                  <dd
                    className={cn(
                      "mt-0.5 tabular-nums font-medium",
                      porcentajeLcAceptacionTextClass(pct),
                    )}
                  >
                    {ficha.porcentajeLcRef}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Estado LC (ref.)</dt>
                  <dd className="mt-1">
                    <CeldaEstadoLcAceptacion
                      bucket={bucket}
                      etiqueta={ficha.estadoLcRef}
                    />
                  </dd>
                </div>
              </dl>
            </div>
          </section>

          <section
            className="overflow-hidden rounded-lg border border-border shadow-sm"
            aria-labelledby="clarity-ficha-contexto-titulo"
          >
            <div
              id="clarity-ficha-contexto-titulo"
              className="bg-[#0F69C4] px-4 py-3 text-sm font-semibold text-white"
            >
              Contexto editorial
            </div>
            <div className={cn(PANEL_BODY_CLASS, "space-y-3 p-4 text-sm")}>
              <p>
                <span className="text-muted-foreground">Descripción: </span>
                {ficha.descripcion}
              </p>
              <div>
                <p>
                  <span className="text-muted-foreground">Observación: </span>
                  <span className="font-medium">{ficha.observaciones}</span>
                </p>
                {ficha.observacionesDetalle ? (
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    {ficha.observacionesDetalle}
                  </p>
                ) : null}
              </div>
            </div>
          </section>

          <section aria-labelledby="clarity-ficha-historial-titulo">
            <h2
              id="clarity-ficha-historial-titulo"
              className="mb-2 text-sm font-semibold"
            >
              Historial de auditorías (mock)
            </h2>
            <Table>
              <TableCaption className="sr-only">
                Revisiones ficticias asociadas a esta URL en el mock.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">% LC (ref.)</TableHead>
                  <TableHead>Estado (ref.)</TableHead>
                  <TableHead>Nota</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ficha.historialAuditorias.map((item) => {
                  const itemBucket = resolveLcAceptacionBucket({
                    porcentajeLcRef: item.porcentajeLcRef,
                    estadoLcRef: item.estadoLcRef,
                  })
                  const itemPct = parsePorcentajeLcRef(item.porcentajeLcRef)
                  return (
                    <TableRow
                      key={`${item.fecha}-${item.nota}`}
                      className={inventoryRowClassFromLcAceptacionBucket(itemBucket)}
                    >
                      <TableCell className="whitespace-nowrap tabular-nums">
                        {item.fecha}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-right tabular-nums",
                            porcentajeLcAceptacionTextClass(itemPct),
                        )}
                      >
                        {item.porcentajeLcRef}
                      </TableCell>
                      <TableCell>
                        <CeldaEstadoLcAceptacion
                          bucket={itemBucket}
                          etiqueta={item.estadoLcRef}
                        />
                      </TableCell>
                      <TableCell className="max-w-[min(100vw,20rem)] text-muted-foreground">
                        {item.nota}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </section>
        </CardContent>

        <CardFooter className="flex flex-wrap gap-2">
          <Button type="button" asChild>
            <Link href={auditarHref}>Auditar esta URL (mock)</Link>
          </Button>
          <Button type="button" variant="secondary" asChild>
            <Link href="/auditar">Volver a /auditar</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}