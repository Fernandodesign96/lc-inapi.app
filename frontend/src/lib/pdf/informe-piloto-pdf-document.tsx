import {
    Document,
    Page,
    Text,
    View,
  } from "@react-pdf/renderer"
  import type {
    ClaudeAuditBundle,
    ClaudeSustitucion,
  } from "@contracts/claude-audit-pilot"
  import type { CriterionEvaluation } from "@contracts/checklist"
  
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
  import {
    ETIQUETA_ESTADO_ACEPTACION,
    PASOS_SEGUN_ESTADO,
  } from "@/lib/resultado-mock-copy"
  import { criteriosVisiblesParaEntrega } from "@repo/lib/audit-visible-content"
  import {
    buildSustitucionPrimariaPorCriterio,
    criterioEntregaCampos,
  } from "@repo/lib/criterio-entrega-campos"
  import { ptdHitoTareaPorCriterio } from "@repo/lib/ptd-hito-tarea-por-criterio"
  import {
    etiquetaCriteriosSustitucion,
    parrafosInformeLegible,
  } from "@repo/lib/informe-texto-legible"
  
  function trunc(text: string, max: number): string {
    if (text.length <= max) return text
    return `${text.slice(0, max - 1)}…`
  }
  
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
  
  function BloqueResumen({ texto }: { texto: string }) {
    const parrafos = parrafosInformeLegible(texto)
    return (
      <View style={styles.sectionWrap}>
        <PdfSectionBar title="Resumen de la auditoría" />
        {parrafos.map((p, i) => (
          <Text key={`resumen-${i}`} style={[styles.body, { marginBottom: 6 }]}>
            {p}
          </Text>
        ))}
      </View>
    )
  }
  
  function BloquePasos({ bundle }: { bundle: ClaudeAuditBundle }) {
    const bloque = PASOS_SEGUN_ESTADO[bundle.audit.estado_aceptacion]
    return (
      <View style={styles.sectionWrap}>
        <PdfSectionBar title="Pasos a seguir" />
        {bloque.pasos.map((paso, i) => (
          <Text key={`paso-${i}`} style={styles.orderedItem}>
            {i + 1}. {paso}
          </Text>
        ))}
      </View>
    )
  }
  
  function CriterioFilaPdf({
    row,
    sust,
  }: {
    row: CriterionEvaluation
    sust?: ClaudeSustitucion
  }) {
    const pres = presentacionCriterio(row)
    const campos = criterioEntregaCampos(row, sust)
    const ptd = ptdHitoTareaPorCriterio(row.id)

    return (
      <View style={styles.tableRow} wrap={false}>
        <Text style={[styles.tableCell, { width: "9%" }]}>
          {trunc(formatSeccionTitulo(row.id), 18)}
        </Text>
        <Text style={[styles.tableCell, { width: "8%" }]}>
          {pres.etiqueta}
        </Text>
        <Text style={[styles.tableCell, { width: "11%" }]}>
          {trunc(campos.textoEnPantalla, 36)}
        </Text>
        <Text style={[styles.tableCell, { width: "11%" }]}>
          {trunc(campos.correccionPropuesta, 36)}
        </Text>
        <Text style={[styles.tableCell, { width: "9%" }]}>
          {trunc(campos.ubicacionEnPantalla, 28)}
        </Text>
        <Text style={[styles.tableCell, { width: "12%" }]}>
          {trunc(campos.justificacion, 56)}
        </Text>
        <Text style={[styles.tableCell, { width: "14%" }]}>
          {trunc(formatCriterioEnunciado(row.id), 48)}
        </Text>
        <Text style={[styles.tableCell, { width: "13%" }]}>
          {trunc(ptd.hitoPtd, 52)}
        </Text>
        <Text style={[styles.tableCell, { width: "13%" }]}>
          {trunc(ptd.tareaPtd, 52)}
        </Text>
      </View>
    )
  }

  function BloqueCriterios({ bundle }: { bundle: ClaudeAuditBundle }) {
    const rows = criteriosVisiblesParaEntrega(bundle.audit.criterios_evaluados)
    const sustMap = buildSustitucionPrimariaPorCriterio(
      bundle.pilot.sustituciones ?? [],
    )
    const titulo = `${rows.length} criterios evaluados`
    return (
      <View style={styles.sectionWrap}>
        <PdfSectionBar title={titulo} />
        <View style={styles.tableHeaderRow}>
          <Text style={[styles.tableHeaderCell, { width: "9%" }]}>
            Instrumento
          </Text>
          <Text style={[styles.tableHeaderCell, { width: "8%" }]}>Estado</Text>
          <Text style={[styles.tableHeaderCell, { width: "11%" }]}>
            Texto
          </Text>
          <Text style={[styles.tableHeaderCell, { width: "11%" }]}>
            Corrección
          </Text>
          <Text style={[styles.tableHeaderCell, { width: "9%" }]}>
            Ubicación
          </Text>
          <Text style={[styles.tableHeaderCell, { width: "12%" }]}>
            Justificación
          </Text>
          <Text style={[styles.tableHeaderCell, { width: "14%" }]}>
            Criterio
          </Text>
          <Text style={[styles.tableHeaderCell, { width: "13%" }]}>
            Hito PTD
          </Text>
          <Text style={[styles.tableHeaderCell, { width: "13%" }]}>
            Tarea PTD
          </Text>
        </View>
        {rows.map((row) => (
          <CriterioFilaPdf
            key={row.id}
            row={row}
            sust={sustMap.get(row.id)}
          />
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
  
  function BloqueSustituciones({
    sustituciones,
  }: {
    sustituciones: NonNullable<ClaudeAuditBundle["pilot"]["sustituciones"]>
  }) {
    return (
      <View style={styles.sectionWrap}>
        <PdfSectionBar title="Texto propuesto (contenido visible)" />
        <View style={styles.tableHeaderRow}>
          <Text style={[styles.tableHeaderCell, { width: "18%" }]}>
            En pantalla
          </Text>
          <Text style={[styles.tableHeaderCell, { width: "18%" }]}>
            Corrección
          </Text>
          <Text style={[styles.tableHeaderCell, { width: "18%" }]}>
            Ubicación
          </Text>
          <Text style={[styles.tableHeaderCell, { width: "22%" }]}>Motivo</Text>
          <Text style={[styles.tableHeaderCell, { width: "8%" }]}>Crit.</Text>
          <Text style={[styles.tableHeaderCell, { width: "16%" }]}>
            Ref. técnica
          </Text>
        </View>
        {sustituciones.map((s, i) => {
          const crit = etiquetaCriteriosSustitucion(
            s.criterio_id,
            s.criterios_relacionados,
          )
          const motivo = [
            s.patron_sistema
              ? "Patrón de sitio (origen compartido)."
              : null,
            s.motivo,
          ]
            .filter(Boolean)
            .join(" ")
          return (
          <View key={`s-${s.linea}-${i}`} style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "18%" }]}>
              {trunc(s.original, 100)}
            </Text>
            <Text style={[styles.tableCell, { width: "18%" }]}>
              {trunc(s.propuesto, 100)}
            </Text>
            <Text style={[styles.tableCell, { width: "18%" }]}>
              {trunc(s.ubicacion_pantalla?.trim() || "—", 100)}
            </Text>
            <Text style={[styles.tableCell, { width: "22%" }]}>
              {trunc(motivo, 120)}
            </Text>
            <Text style={[styles.tableCell, { width: "8%" }]}>
              {trunc(crit, 24)}
            </Text>
            <Text style={[styles.tableCell, { width: "16%" }]}>
              {s.linea}
              {s.html_linea_aprox ? `\n${s.html_linea_aprox}` : ""}
            </Text>
          </View>
          )
        })}
      </View>
    )
  }
  
  function BloqueNotaTi({ texto }: { texto: string }) {
    const parrafos = parrafosInformeLegible(texto)
    return (
      <View style={styles.sectionWrap}>
        <PdfSectionBar title="Nota para el equipo TI" />
        {parrafos.map((p, i) => (
          <Text key={`nota-${i}`} style={[styles.body, { marginBottom: 6 }]}>
            {p}
          </Text>
        ))}
      </View>
    )
  }
  
  export type InformePilotoPdfDocumentProps = {
    bundle: ClaudeAuditBundle
  }
  
  /**
   * Documento PDF con bloques 1–7 (flujo §4), todo expandido.
   * Solo servidor — C4 usará renderToBuffer con este componente.
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
    const sustituciones = pilot.sustituciones ?? []
  
    return (
      <Document
        title={`Informe LC — ${bundle.audit.url}`}
        author="INAPI — Lenguaje Claro"
      >
        <Page size="A4" style={styles.page} wrap>
          <Text style={styles.docTitle}>Informe de auditoría — Lenguaje Claro</Text>
          <Text style={styles.docSubtitle}>
            Piloto Claude · Checklist editorial v{bundle.audit.version_checklist}
          </Text>
  
          <BloqueDatosAuditoria bundle={bundle} />
  
          {pilot.resumen_ejecutivo ? (
            <BloqueResumen texto={pilot.resumen_ejecutivo} />
          ) : null}
  
          <BloquePasos bundle={bundle} />
  
          <BloqueCriterios bundle={bundle} />
  
          {tieneSeveridad && severidad ? (
            <BloqueObservacionesSeveridad severidad={severidad} />
          ) : null}
  
          {sustituciones.length > 0 ? (
            <BloqueSustituciones sustituciones={sustituciones} />
          ) : null}
  
          {pilot.nota_final_tic ? (
            <BloqueNotaTi texto={pilot.nota_final_tic} />
          ) : null}
        </Page>
      </Document>
    )
  }