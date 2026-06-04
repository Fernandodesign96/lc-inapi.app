"use client"

import type {
  ClaudeAuditPilotMeta,
  ClaudeSustitucion,
} from "@contracts/claude-audit-pilot"

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

export function formatFechaEvaluacion(iso: string): string {
  try {
    return new Intl.DateTimeFormat("es-CL", {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "America/Santiago",
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export function labelTipoPagina(tipo: "sitioweb" | "tramites"): string {
  return tipo === "tramites" ? "Trámites" : "Sitio web"
}

export function ResumenAuditoriaContent({ texto }: { texto: string }) {
  return (
    <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
      {texto}
    </p>
  )
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
      <table className="w-full min-w-[48rem] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-left">
            <th className="p-2 font-medium">Línea</th>
            <th className="p-2 font-medium">Criterio</th>
            <th className="p-2 font-medium">Original</th>
            <th className="p-2 font-medium">Propuesto</th>
            <th className="p-2 font-medium">Motivo</th>
          </tr>
        </thead>
        <tbody>
          {sustituciones.map((s, i) => (
            <tr
              key={`${s.linea}-${s.criterio_id}-${i}`}
              className="border-b border-border align-top"
            >
              <td className="p-2 font-mono text-xs whitespace-nowrap">
                {s.linea}
                {s.html_linea_aprox ? (
                  <span className="mt-0.5 block text-muted-foreground">
                    {s.html_linea_aprox}
                  </span>
                ) : null}
              </td>
              <td className="p-2 font-mono text-xs">{s.criterio_id}</td>
              <td className="max-w-[14rem] p-2 text-muted-foreground">
                {s.original}
              </td>
              <td className="max-w-[14rem] p-2 text-foreground">
                {s.propuesto}
              </td>
              <td className="max-w-[16rem] p-2 text-foreground">{s.motivo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function NotaEquipoTiContent({ texto }: { texto: string }) {
  return (
    <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
      {texto}
    </p>
  )
}