import type { ReactNode } from "react"

import type { StrictAuditRecord } from "@contracts/checklist"
import type { ClaudeAuditPilotMeta } from "@contracts/claude-audit-pilot"

import { Progress } from "@/components/ui/progress"
import {
  formatFechaEvaluacionDatosUi,
  formatUsuarioQueAudita,
  labelTipoPagina,
} from "@/lib/informe-piloto-format"
import { CLASES_BARRA_POR_ESTADO } from "@/lib/resultado-mock-copy"
import type { DesgloseCorreccionesDatosAuditoria } from "@repo/lib/desglose-correcciones-datos-auditoria"
import { formatConteoCategoriaConCorrecciones } from "@repo/lib/desglose-correcciones-datos-auditoria"
import type { ConteoCategoriasPresentacion } from "@repo/lib/resumen-hitos-auditoria"
import { CHECKLIST_DATOS_AUDITORIA_VALOR } from "@repo/lib/resumen-hitos-auditoria"

function Dato({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <p>
      <span className="text-muted-foreground">{label}:</span> {children}
    </p>
  )
}

type Props = {
  auditoria: StrictAuditRecord
  etiquetaEstado: string
  conteos: ConteoCategoriasPresentacion
  desgloseCorrecciones: DesgloseCorreccionesDatosAuditoria
  tipoPagina?: ClaudeAuditPilotMeta["tipo_pagina"]
}

/** Campos de Datos de Auditoría: fecha/tipo a la izquierda; conteos MEI a la derecha. */
export function ResultadoDatosAuditoriaCampos({
  auditoria,
  etiquetaEstado,
  conteos,
  desgloseCorrecciones,
  tipoPagina,
}: Props) {
  return (
    <div className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
      <Dato label="URL">
        <span className="font-medium break-all">{auditoria.url}</span>
      </Dato>
      <Dato label="Checklist 3.0">
        <span className="font-medium">{CHECKLIST_DATOS_AUDITORIA_VALOR}</span>
      </Dato>
      <div className="sm:col-span-2 space-y-2">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span
            className="text-muted-foreground"
            id="resultado-cumplimiento-label"
          >
            Porcentaje
          </span>
          <span
            className="font-medium tabular-nums text-foreground"
            aria-labelledby="resultado-cumplimiento-label"
          >
            {auditoria.porcentaje_cumplimiento} %
          </span>
        </div>
        <Progress
          aria-labelledby="resultado-cumplimiento-label"
          value={auditoria.porcentaje_cumplimiento}
          max={100}
          className={CLASES_BARRA_POR_ESTADO[auditoria.estado_aceptacion].track}
          indicatorClassName={
            CLASES_BARRA_POR_ESTADO[auditoria.estado_aceptacion].fill
          }
        />
      </div>
      <div className="space-y-2">
        <Dato label="Estado">
          <span className="font-medium" title={auditoria.estado_aceptacion}>
            {etiquetaEstado}
          </span>
        </Dato>
        <Dato label="Fecha de evaluación">
          <span className="font-medium">
            {formatFechaEvaluacionDatosUi(
              auditoria.fecha_evaluacion,
              auditoria.url,
            )}
          </span>
        </Dato>
        {tipoPagina ? (
          <Dato label="Tipo de página">
            <span className="font-medium">{labelTipoPagina(tipoPagina)}</span>
          </Dato>
        ) : null}
        <Dato label="Usuario que audita">
          <span className="font-medium">{formatUsuarioQueAudita()}</span>
        </Dato>
        <Dato label="Aprobados">
          {auditoria.criterios_aprobados} / aplicables{" "}
          {auditoria.criterios_aplicables}
        </Dato>
        <Dato label="Total de correcciones">
          <span className="font-medium tabular-nums">
            {desgloseCorrecciones.totalCorrecciones}
          </span>
        </Dato>
      </div>
      <div className="space-y-2">
        <Dato label="Cumple con observaciones">
          <span className="font-medium">
            {formatConteoCategoriaConCorrecciones(
              conteos.cumpleConObservaciones,
              desgloseCorrecciones.cumpleConObservaciones,
            )}
          </span>
        </Dato>
        <Dato label="Medianamente cumple">
          <span className="font-medium">
            {formatConteoCategoriaConCorrecciones(
              conteos.medianamenteCumple,
              desgloseCorrecciones.medianamenteCumple,
            )}
          </span>
        </Dato>
        <Dato label="No cumplen">
          <span className="font-medium">
            {formatConteoCategoriaConCorrecciones(
              conteos.noCumple,
              desgloseCorrecciones.noCumple,
            )}
          </span>
        </Dato>
        <Dato label="No aplica">
          <span className="font-medium tabular-nums">{conteos.noAplica}</span>
        </Dato>
      </div>
    </div>
  )
}
