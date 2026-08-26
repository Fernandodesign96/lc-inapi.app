"use client"

import type {
  ClaudeAuditPilotMeta,
  ClaudeSustitucion,
} from "@contracts/claude-audit-pilot"
import {
  etiquetaCriteriosSustitucion,
  parrafosInformeLegible,
} from "@repo/lib/informe-texto-legible"

export {
  formatFechaEvaluacion,
  formatFechaEvaluacionCorta,
  formatFechaEvaluacionDatosUi,
  formatUsuarioQueAudita,
  labelTipoPagina,
} from "@/lib/informe-piloto-format"

function SeveridadList({
  titulo,
  items,
}: {
  titulo: string
  items: string[]
}) {
  if (items.length === 0) return null
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-foreground">{titulo}</h4>
      <ul className="list-disc space-y-1.5 ps-5 text-sm leading-relaxed text-foreground">
        {items.map((item, i) => (
          <li key={`${titulo}-${i}`}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

function BloqueTextoLegible({ texto }: { texto: string }) {
  const parrafos = parrafosInformeLegible(texto)
  return (
    <div className="space-y-3 text-sm leading-relaxed text-foreground">
      {parrafos.map((p, i) => (
        <p key={`p-${i}`}>{p}</p>
      ))}
    </div>
  )
}

export function ResumenAuditoriaContent({ texto }: { texto: string }) {
  return <BloqueTextoLegible texto={texto} />
}

export function ObservacionesSeveridadContent({
  severidad,
}: {
  severidad: NonNullable<
    ClaudeAuditPilotMeta["observaciones_lc_por_severidad"]
  >
}) {
  return (
    <div className="space-y-4">
      <SeveridadList
        titulo="Hallazgos prioritarios (severidad alta)"
        items={severidad.hallazgos_prioridad_alta}
      />
      <SeveridadList
        titulo="Hallazgos medianamente prioritarios (severidad media)"
        items={severidad.hallazgos_prioridad_media}
      />
      <SeveridadList
        titulo="Hallazgos bajamente prioritarios (severidad baja)"
        items={severidad.hallazgos_prioridad_baja}
      />
    </div>
  )
}

export function SustitucionesTextoContent({
  sustituciones,
}: {
  sustituciones: ClaudeSustitucion[]
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[56rem] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-left">
            <th className="p-2 text-sm font-bold text-foreground">
              Texto en pantalla
            </th>
            <th className="p-2 text-sm font-bold text-foreground">
              Corrección
            </th>
            <th className="p-2 text-sm font-bold text-foreground">
              Ubicación en pantalla
            </th>
            <th className="p-2 text-sm font-bold text-foreground">Motivo</th>
            <th className="p-2 text-sm font-bold text-foreground">Criterio</th>
            <th className="p-2 text-sm font-bold text-foreground">
              Ref. técnica
            </th>
          </tr>
        </thead>
        <tbody>
          {sustituciones.map((s, i) => {
            const criterioLabel = etiquetaCriteriosSustitucion(
              s.criterio_id,
              s.criterios_relacionados,
            )
            const motivo = [
              s.patron_sistema
                ? "Patrón de sitio (corregir en header, footer o modal compartido)."
                : null,
              s.motivo,
              s.criterios_relacionados?.length
                ? `También aplica a: ${s.criterios_relacionados.join(", ")}.`
                : null,
            ]
              .filter(Boolean)
              .join(" ")
            return (
              <tr
                key={`${s.linea}-${s.criterio_id}-${i}`}
                className="border-b border-border align-top"
              >
                <td className="max-w-[14rem] p-2 text-muted-foreground">
                  {s.original}
                </td>
                <td className="max-w-[14rem] p-2 text-foreground">
                  {s.propuesto}
                </td>
                <td className="max-w-[14rem] p-2 text-foreground">
                  {s.ubicacion_pantalla?.trim()
                    ? s.ubicacion_pantalla
                    : "—"}
                </td>
                <td className="max-w-[16rem] p-2 text-foreground">{motivo}</td>
                <td className="p-2 font-mono text-xs">{criterioLabel}</td>
                <td className="p-2 font-mono text-xs whitespace-nowrap text-muted-foreground">
                  {s.linea}
                  {s.html_linea_aprox ? (
                    <span className="mt-0.5 block">{s.html_linea_aprox}</span>
                  ) : null}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export function NotaEquipoTiContent({ texto }: { texto: string }) {
  return <BloqueTextoLegible texto={texto} />
}
