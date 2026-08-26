import { Document, Page, Text, View } from "@react-pdf/renderer"
import type {
  ClaudeAuditBundle,
  ClaudeSustitucion,
} from "@contracts/claude-audit-pilot"
import type { CriterionEvaluation } from "@contracts/checklist"
import { CRITERION_IDS_V30 } from "@contracts/checklist"

import { formatCriterioPdfEncabezado } from "@/lib/checklist-criterion-catalog"
import { presentacionCriterio } from "@/lib/criterio-evaluacion-visual"
import {
  formatFechaEvaluacionDatosUi,
  formatUsuarioQueAudita,
  labelTipoPagina,
} from "@/lib/informe-piloto-format"
import {
  PdfSectionBar,
  progressFillColor,
  styles,
} from "@/lib/pdf/informe-piloto-pdf-styles"
import { ETIQUETA_ESTADO_ACEPTACION } from "@/lib/resultado-mock-copy"
import { criteriosVisiblesParaEntrega } from "@repo/lib/audit-visible-content"
import {
  buildSustitucionesPorCriterio,
  criterioEntregaCampos,
} from "@repo/lib/criterio-entrega-campos"
import { ptdHitoTareaPorCriterio } from "@repo/lib/ptd-hito-tarea-por-criterio"
import {
  buildResumenHitosAuditoria,
  CHECKLIST_DATOS_AUDITORIA_VALOR,
  type ResumenHitoAuditoria,
} from "@repo/lib/resumen-hitos-auditoria"

const CATALOG_ORDER = new Map(
  (CRITERION_IDS_V30 as readonly string[]).map((id, i) => [id, i]),
)

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fieldRow}>
      <Text style={styles.fieldLabel}>{label}: </Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  )
}

function BloqueDatosAuditoria({ bundle }: { bundle: ClaudeAuditBundle }) {
  const { audit, pilot } = bundle
  const etiquetaEstado = ETIQUETA_ESTADO_ACEPTACION[audit.estado_aceptacion]
  const pct = audit.porcentaje_cumplimiento

  return (
    <View style={styles.sectionWrap}>
      <PdfSectionBar title="Datos de Auditoría" />
      <FieldRow label="URL" value={audit.url} />
      <FieldRow
        label="Checklist 3.0"
        value={CHECKLIST_DATOS_AUDITORIA_VALOR}
      />
      <FieldRow label="Porcentaje" value={`${pct} %`} />
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${Math.min(100, Math.max(0, pct))}%`,
              backgroundColor: progressFillColor(audit.estado_aceptacion),
            },
          ]}
        />
      </View>
      <FieldRow label="Estado" value={etiquetaEstado} />
      <FieldRow
        label="Aprobados"
        value={`${audit.criterios_aprobados} / aplicables ${audit.criterios_aplicables}`}
      />
      <FieldRow label="No aplica" value={String(audit.criterios_no_aplica)} />
      <FieldRow
        label="Fecha de evaluación"
        value={formatFechaEvaluacionDatosUi(audit.fecha_evaluacion, audit.url)}
      />
      <FieldRow
        label="Usuario que audita"
        value={formatUsuarioQueAudita()}
      />
      {pilot.tipo_pagina ? (
        <FieldRow
          label="Tipo de página"
          value={labelTipoPagina(pilot.tipo_pagina)}
        />
      ) : null}
    </View>
  )
}

function HitoResumenTablePdf({ hito }: { hito: ResumenHitoAuditoria }) {
  const colDesc = { width: "28%" as const }
  const colSm = { width: "8%" as const }
  const colObs = { width: "13%" as const }
  const colMed = { width: "12%" as const }
  const colNo = { width: "9%" as const }
  const colNa = { width: "9%" as const }
  const colPct = { width: "8%" as const }

  return (
    <View style={styles.hitoResumenTable} wrap={false}>
      <View style={styles.hitoResumenHeaderRow}>
        <View style={[styles.hitoResumenCell, colDesc]}>
          <Text style={[styles.hitoResumenHeaderText, { textAlign: "left" }]}>
            Hito
          </Text>
        </View>
        <View style={[styles.hitoResumenCell, colSm]}>
          <Text style={styles.hitoResumenHeaderText}>Checklist</Text>
        </View>
        <View style={[styles.hitoResumenCell, colSm]}>
          <Text style={styles.hitoResumenHeaderText}>Cumple</Text>
        </View>
        <View style={[styles.hitoResumenCell, colObs]}>
          <Text style={styles.hitoResumenHeaderText}>
            Cumple con Observaciones
          </Text>
        </View>
        <View style={[styles.hitoResumenCell, colMed]}>
          <Text style={styles.hitoResumenHeaderText}>Medianamente cumple</Text>
        </View>
        <View style={[styles.hitoResumenCell, colNo]}>
          <Text style={styles.hitoResumenHeaderText}>No cumple</Text>
        </View>
        <View style={[styles.hitoResumenCell, colNa]}>
          <Text style={styles.hitoResumenHeaderText}>No aplica</Text>
        </View>
        <View style={[styles.hitoResumenCellLast, colPct]}>
          <Text style={styles.hitoResumenHeaderText}>% Cumple</Text>
        </View>
      </View>
      <View style={styles.hitoResumenDataRow}>
        <View style={[styles.hitoResumenCell, colDesc]}>
          <Text style={styles.hitoResumenDesc}>
            Hito {hito.hitoOrdinal}
            {"\n"}
            {hito.hitoTitulo}
          </Text>
        </View>
        <View style={[styles.hitoResumenCell, colSm]}>
          <Text style={styles.hitoResumenNum}>{hito.checklist}</Text>
        </View>
        <View style={[styles.hitoResumenCell, colSm]}>
          <Text style={styles.hitoResumenNum}>{hito.cumple}</Text>
        </View>
        <View style={[styles.hitoResumenCell, colObs]}>
          <Text style={styles.hitoResumenNum}>
            {hito.cumpleConObservaciones}
          </Text>
        </View>
        <View style={[styles.hitoResumenCell, colMed]}>
          <Text style={styles.hitoResumenNum}>{hito.medianamenteCumple}</Text>
        </View>
        <View style={[styles.hitoResumenCell, colNo]}>
          <Text style={styles.hitoResumenNum}>{hito.noCumple}</Text>
        </View>
        <View style={[styles.hitoResumenCell, colNa]}>
          <Text style={styles.hitoResumenNum}>{hito.noAplica}</Text>
        </View>
        <View style={[styles.hitoResumenCellLast, colPct]}>
          <Text style={styles.hitoResumenNum}>{hito.pctCumple}%</Text>
        </View>
      </View>
    </View>
  )
}

function BloqueResumenHitos({ bundle }: { bundle: ClaudeAuditBundle }) {
  const rows = criteriosVisiblesParaEntrega(bundle.audit.criterios_evaluados)
  const resumen = buildResumenHitosAuditoria(rows)
  if (resumen.length === 0) return null

  return (
    <View style={styles.sectionWrap}>
      <PdfSectionBar title="Resumen por hito" />
      {resumen.map((hito) => (
        <HitoResumenTablePdf key={hito.hitoId} hito={hito} />
      ))}
    </View>
  )
}

type EntregaItem = {
  row: CriterionEvaluation
  sustList: ClaudeSustitucion[]
}

type TareaGrupo = {
  tareaId: number
  tareaOrdinal: number
  tareaDescripcion: string
  items: EntregaItem[]
}

type HitoGrupo = {
  hitoId: number
  hitoOrdinal: number
  hitoTitulo: string
  tareas: TareaGrupo[]
}

function buildArbolHitoTarea(bundle: ClaudeAuditBundle): HitoGrupo[] {
  const rows = criteriosVisiblesParaEntrega(bundle.audit.criterios_evaluados)
  const sustMap = buildSustitucionesPorCriterio(
    bundle.pilot.sustituciones ?? [],
  )
  const hitoMap = new Map<number, HitoGrupo>()

  for (const row of rows) {
    const ptd = ptdHitoTareaPorCriterio(row.id)
    const ref = ptd.refs[0]
    if (!ref || ptd.hitoOrdinal == null || ptd.tareaOrdinal == null) continue

    let hito = hitoMap.get(ref.hitoId)
    if (!hito) {
      hito = {
        hitoId: ref.hitoId,
        hitoOrdinal: ptd.hitoOrdinal,
        hitoTitulo: ref.hitoTitulo,
        tareas: [],
      }
      hitoMap.set(ref.hitoId, hito)
    }

    let tarea = hito.tareas.find((t) => t.tareaId === ref.tareaId)
    if (!tarea) {
      tarea = {
        tareaId: ref.tareaId,
        tareaOrdinal: ptd.tareaOrdinal,
        tareaDescripcion: ref.tareaDescripcion,
        items: [],
      }
      hito.tareas.push(tarea)
    }

    const sustList =
      row.estado === "incumple" ? (sustMap.get(row.id) ?? []) : []
    tarea.items.push({ row, sustList })
  }

  const hitos = [...hitoMap.values()].sort(
    (a, b) => a.hitoOrdinal - b.hitoOrdinal,
  )
  for (const h of hitos) {
    h.tareas.sort((a, b) => a.tareaOrdinal - b.tareaOrdinal)
    for (const t of h.tareas) {
      t.items.sort(
        (a, b) =>
          (CATALOG_ORDER.get(a.row.id) ?? 999) -
          (CATALOG_ORDER.get(b.row.id) ?? 999),
      )
    }
  }
  return hitos
}

function estadoStyle(estado: CriterionEvaluation["estado"]) {
  if (estado === "cumple") return styles.estadoCumple
  if (estado === "no_aplica") return styles.estadoNoAplica
  return styles.estadoIncumple
}

function EntregaCamposPdf({
  row,
  sust,
}: {
  row: CriterionEvaluation
  sust?: ClaudeSustitucion
}) {
  const campos = criterioEntregaCampos(row, sust)
  return (
    <View>
      <View style={styles.entregaField}>
        <Text>
          <Text style={styles.entregaLabel}>Texto en pantalla: </Text>
          <Text style={styles.entregaValue}>{campos.textoEnPantalla}</Text>
        </Text>
      </View>
      <View style={styles.entregaField}>
        <Text>
          <Text style={styles.entregaLabel}>Ubicación en pantalla: </Text>
          <Text style={styles.entregaValue}>{campos.ubicacionEnPantalla}</Text>
        </Text>
      </View>
      <View style={styles.entregaField}>
        <Text>
          <Text style={styles.entregaLabel}>Corrección propuesta: </Text>
          <Text style={styles.entregaValue}>{campos.correccionPropuesta}</Text>
        </Text>
      </View>
      <View style={styles.entregaField}>
        <Text>
          <Text style={styles.entregaLabel}>Justificación: </Text>
          <Text style={styles.entregaValue}>{campos.justificacion}</Text>
        </Text>
      </View>
    </View>
  )
}

function PreguntaEntregaPdf({
  item,
  numero,
}: {
  item: EntregaItem
  numero: number
}) {
  const { row, sustList } = item
  const pres = presentacionCriterio(row)

  const encabezado = (
    <View>
      <Text style={styles.preguntaText}>
        {formatCriterioPdfEncabezado(row.id, numero)}
      </Text>
      <Text style={[styles.estadoLine, estadoStyle(row.estado)]}>
        {pres.etiqueta}
        {sustList.length > 1 ? ` · ${sustList.length} correcciones` : ""}
      </Text>
    </View>
  )

  if (sustList.length === 0) {
    return (
      <View style={styles.preguntaBlock} wrap={false}>
        {encabezado}
        <EntregaCamposPdf row={row} />
      </View>
    )
  }

  return (
    <View style={styles.preguntaBlock}>
      {encabezado}
      {sustList.map((sust, i) => (
        <View key={`${row.id}-s-${i}`} style={{ marginBottom: 6 }}>
          <Text style={styles.preguntaMeta}>Corrección {i + 1}</Text>
          <EntregaCamposPdf row={row} sust={sust} />
        </View>
      ))}
    </View>
  )
}

/**
 * Detalle: Hito N → Tarea M → Criterio K (numeración simple por nivel).
 */
function BloqueChecklistEditorial({ bundle }: { bundle: ClaudeAuditBundle }) {
  const arbol = buildArbolHitoTarea(bundle)

  return (
    <View style={styles.sectionWrap}>
      {arbol.map((hito) => (
        <View key={`h-${hito.hitoId}`} style={styles.hitoBlock}>
          <Text style={styles.hitoTitle}>
            Hito {hito.hitoOrdinal}
            {"\n"}
            {hito.hitoTitulo}
          </Text>
          {hito.tareas.map((tarea) => (
            <View key={`t-${tarea.tareaId}`} style={styles.tareaBlock}>
              <Text style={styles.tareaTitle}>
                Tarea {tarea.tareaOrdinal}
                {"\n"}
                {tarea.tareaDescripcion}
              </Text>
              {tarea.items.map((item, idx) => (
                <PreguntaEntregaPdf
                  key={item.row.id}
                  item={item}
                  numero={
                    ptdHitoTareaPorCriterio(item.row.id).criterioOrdinal ??
                    idx + 1
                  }
                />
              ))}
            </View>
          ))}
        </View>
      ))}
    </View>
  )
}

export type InformePilotoPdfDocumentProps = {
  bundle: ClaudeAuditBundle
}

/**
 * PDF por URL: datos + resumen por hito + detalle (Hito → Tarea → criterio).
 */
export function InformePilotoPdfDocument({
  bundle,
}: InformePilotoPdfDocumentProps) {
  return (
    <Document
      title={`Informe LC — ${bundle.audit.url}`}
      author="INAPI — Lenguaje Claro"
    >
      <Page size="A4" style={styles.page} wrap>
        <Text style={styles.docTitle}>Informe de auditoría — Lenguaje Claro</Text>

        <BloqueDatosAuditoria bundle={bundle} />
        <BloqueResumenHitos bundle={bundle} />
        <BloqueChecklistEditorial bundle={bundle} />
      </Page>
    </Document>
  )
}
