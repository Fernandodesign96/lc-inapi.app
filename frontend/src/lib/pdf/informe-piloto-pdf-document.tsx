import { Document, Page, Text, View } from "@react-pdf/renderer"
import type {
  ClaudeAuditBundle,
  ClaudeSustitucion,
} from "@contracts/claude-audit-pilot"
import type { CriterionEvaluation } from "@contracts/checklist"
import { CRITERION_IDS_V30 } from "@contracts/checklist"

import {
  formatCriterioEnunciado,
  formatSeccionTitulo,
} from "@/lib/checklist-criterion-catalog"
import { presentacionCriterio } from "@/lib/criterio-evaluacion-visual"
import {
  formatFechaEvaluacion,
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

function BulletList({ items }: { items: string[] }) {
  if (items.length === 0) return null
  return (
    <View>
      {items.map((item, i) => (
        <View key={`b-${i}`} style={styles.listItem}>
          <Text style={styles.listBullet}>•</Text>
          <Text style={styles.listText}>{item}</Text>
        </View>
      ))}
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
      <FieldRow label="Checklist" value={audit.version_checklist} />
      <Text style={styles.fieldLabel}>
        Cumplimiento (criterios aplicables): {pct} %
      </Text>
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
      <FieldRow label="N/A" value={String(audit.criterios_no_aplica)} />
      <FieldRow
        label="Fecha de evaluación"
        value={formatFechaEvaluacion(audit.fecha_evaluacion)}
      />
      <FieldRow label="Encargado" value={audit.evaluador_uid} />
      {pilot.tipo_pagina ? (
        <FieldRow
          label="Tipo de página"
          value={labelTipoPagina(pilot.tipo_pagina)}
        />
      ) : null}
      <FieldRow label="Id auditoría" value={audit.id} />
    </View>
  )
}

type EntregaItem = {
  row: CriterionEvaluation
  sustList: ClaudeSustitucion[]
}

type TareaGrupo = {
  tareaId: number
  tareaDescripcion: string
  items: EntregaItem[]
}

type HitoGrupo = {
  hitoId: number
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
    if (!ref) continue

    let hito = hitoMap.get(ref.hitoId)
    if (!hito) {
      hito = {
        hitoId: ref.hitoId,
        hitoTitulo: ref.hitoTitulo,
        tareas: [],
      }
      hitoMap.set(ref.hitoId, hito)
    }

    let tarea = hito.tareas.find((t) => t.tareaId === ref.tareaId)
    if (!tarea) {
      tarea = {
        tareaId: ref.tareaId,
        tareaDescripcion: ref.tareaDescripcion,
        items: [],
      }
      hito.tareas.push(tarea)
    }

    const sustList =
      row.estado === "incumple" ? (sustMap.get(row.id) ?? []) : []
    tarea.items.push({ row, sustList })
  }

  const hitos = [...hitoMap.values()].sort((a, b) => a.hitoId - b.hitoId)
  for (const h of hitos) {
    h.tareas.sort((a, b) => a.tareaId - b.tareaId)
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

function PreguntaEntregaPdf({ item }: { item: EntregaItem }) {
  const { row, sustList } = item
  const pres = presentacionCriterio(row)
  const instrumento = formatSeccionTitulo(row.id)
  const pregunta = formatCriterioEnunciado(row.id)
  const estadoLine = `${row.id} · ${pres.etiqueta}`

  if (sustList.length === 0) {
    return (
      <View style={styles.preguntaBlock} wrap={false}>
        <Text style={styles.preguntaText}>
          {instrumento} — {pregunta}
        </Text>
        <Text style={[styles.estadoLine, estadoStyle(row.estado)]}>
          {estadoLine}
        </Text>
        <EntregaCamposPdf row={row} />
      </View>
    )
  }

  return (
    <View style={styles.preguntaBlock}>
      <Text style={styles.preguntaText}>
        {instrumento} — {pregunta}
      </Text>
      <Text style={[styles.estadoLine, estadoStyle(row.estado)]}>
        {estadoLine}
        {sustList.length > 1 ? ` · ${sustList.length} correcciones` : ""}
      </Text>
      {sustList.map((sust, i) => (
        <View key={`${row.id}-s-${i}`} style={{ marginBottom: 6 }}>
          {sustList.length > 1 ? (
            <Text style={styles.preguntaMeta}>Corrección {i + 1}</Text>
          ) : null}
          <EntregaCamposPdf row={row} sust={sust} />
        </View>
      ))}
    </View>
  )
}

/**
 * Estructura tipo Checklist Editorial Word: Hito → Tarea → instrumento/criterio
 * → estado → campos CMS.
 */
function BloqueChecklistEditorial({ bundle }: { bundle: ClaudeAuditBundle }) {
  const arbol = buildArbolHitoTarea(bundle)
  const nCriterios = arbol.reduce(
    (acc, h) => acc + h.tareas.reduce((a, t) => a + t.items.length, 0),
    0,
  )

  return (
    <View style={styles.sectionWrap}>
      <PdfSectionBar
        title={`Checklist editorial PTD — ${nCriterios} criterios`}
      />
      <Text style={[styles.bodyMuted, { marginBottom: 8 }]}>
        Lectura: Hito → Tarea → instrumento/criterio → estado → evidencia CMS.
      </Text>

      {arbol.map((hito) => (
        <View key={`h-${hito.hitoId}`} style={styles.hitoBlock}>
          <Text style={styles.hitoTitle}>
            Hito {hito.hitoId}
            {"\n"}
            {hito.hitoTitulo}
          </Text>
          {hito.tareas.map((tarea) => (
            <View key={`t-${tarea.tareaId}`} style={styles.tareaBlock}>
              <Text style={styles.tareaTitle}>
                Tarea {tarea.tareaId}
                {"\n"}
                {tarea.tareaDescripcion}
              </Text>
              {tarea.items.map((item) => (
                <PreguntaEntregaPdf key={item.row.id} item={item} />
              ))}
            </View>
          ))}
        </View>
      ))}
    </View>
  )
}

function BloqueObservacionesSeveridad({
  severidad,
}: {
  severidad: NonNullable<
    ClaudeAuditBundle["pilot"]["observaciones_lc_por_severidad"]
  >
}) {
  return (
    <View style={styles.sectionWrap}>
      <PdfSectionBar title="Observaciones finales por severidad" />
      <Text style={styles.subheading}>
        Hallazgos prioritarios (severidad alta)
      </Text>
      <BulletList items={severidad.hallazgos_prioridad_alta} />
      <Text style={styles.subheading}>
        Hallazgos medianamente prioritarios (severidad media)
      </Text>
      <BulletList items={severidad.hallazgos_prioridad_media} />
      <Text style={styles.subheading}>
        Hallazgos bajamente prioritarios (severidad baja)
      </Text>
      <BulletList items={severidad.hallazgos_prioridad_baja} />
    </View>
  )
}

export type InformePilotoPdfDocumentProps = {
  bundle: ClaudeAuditBundle
}

/**
 * PDF por URL: datos + checklist editorial (Hito → Tarea → criterio → estado
 * → campos CMS). Sin resumen ni pasos a seguir.
 */
export function InformePilotoPdfDocument({
  bundle,
}: InformePilotoPdfDocumentProps) {
  const { pilot } = bundle
  const severidad = pilot.observaciones_lc_por_severidad
  const tieneSeveridad = Boolean(
    severidad &&
      (severidad.hallazgos_prioridad_alta.length > 0 ||
        severidad.hallazgos_prioridad_media.length > 0 ||
        severidad.hallazgos_prioridad_baja.length > 0),
  )

  return (
    <Document
      title={`Informe LC — ${bundle.audit.url}`}
      author="INAPI — Lenguaje Claro"
    >
      <Page size="A4" style={styles.page} wrap>
        <Text style={styles.docTitle}>Informe de auditoría — Lenguaje Claro</Text>
        <Text style={styles.docSubtitle}>
          Checklist editorial PTD · v{bundle.audit.version_checklist} · Hito →
          Tarea → criterio
        </Text>

        <BloqueDatosAuditoria bundle={bundle} />

        <BloqueChecklistEditorial bundle={bundle} />

        {tieneSeveridad && severidad ? (
          <BloqueObservacionesSeveridad severidad={severidad} />
        ) : null}
      </Page>
    </Document>
  )
}
