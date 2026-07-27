import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { AuditarHistorialPorUrl } from "@/components/auditar-historial-por-url"
import {
  clarityLaunchByRank,
  clarityRowsConHistorial,
} from "@/lib/clarity-audits-launch"
import {
  getClarityFichaByRank,
  isValidClarityFichaRank,
} from "@/lib/clarity-fichas-mock"

type PageProps = {
  params: Promise<{ rank: string }>
}

export function generateStaticParams() {
  return clarityRowsConHistorial().map((r) => ({ rank: String(r.rank) }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { rank: rankRaw } = await params
  const rank = Number.parseInt(rankRaw, 10)
  const row = clarityLaunchByRank(rank)
  const ficha = isValidClarityFichaRank(rank)
    ? getClarityFichaByRank(rank)
    : undefined

  if (!row?.claudeAuditId) {
    return { title: "Historial no disponible | LC INAPI" }
  }

  return {
    title: `Historial · ${row.label} | LC INAPI`,
    description: ficha?.descripcion ?? `Auditorías LC de ${row.url}`,
  }
}

export default async function AuditarHistorialRankPage({ params }: PageProps) {
  const { rank: rankRaw } = await params
  const rank = Number.parseInt(rankRaw, 10)

  if (!Number.isFinite(rank) || !isValidClarityFichaRank(rank)) {
    notFound()
  }

  return <AuditarHistorialPorUrl rank={rank} />
}