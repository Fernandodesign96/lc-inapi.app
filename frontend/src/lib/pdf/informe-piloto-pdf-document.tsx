import {
    Document,
    Page,
    Text,
    View,
  } from "@react-pdf/renderer"
  import type { ClaudeAuditBundle } from "@contracts/claude-audit-pilot"
  import type { CriterionEvaluation } from "@contracts/checklist"
  
  import {
    formatCriterioEnunciado,
    formatSeccionTitulo,
  } from "@/lib/checklist-criterion-catalog"
  import {
    pastillaSeveridadLabel,
    pastillaSeveridadTexto,
    presentacionCriterio,
  } from "@/lib/criterio-evaluacion-visual"
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
    return (
      <View style={styles.sectionWrap}>
        <PdfSectionBar title="Resumen Auditoría" />
        <Text style={styles.body}>{texto}</Text>
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
  
  function CriterioFilaPdf({ row }: { row: CriterionEvaluation }) {
    const pres = presentacionCriterio(row)
    const pastilla = pastillaSeveridadTexto(pastillaSeveridadLabel(row))
    const comentario =
      row.estado === "no_aplica"
        ? "—"
        : row.comentario
          ? trunc(row.comentario, 140)
          : "—"
  
    return (
      <View style={styles.tableRow} wrap={false}>
        <Text style={[styles.tableCell, { width: "14%" }]}>
          {trunc(formatSeccionTitulo(row.id), 28)}
        </Text>
        <Text style={[styles.tableCell, { width: "28%" }]}>
          {trunc(formatCriterioEnunciado(row.id), 72)}
        </Text>
        <Text style={[styles.tableCell, { width: "16%" }]}>
          {pres.etiqueta}
        </Text>
        <Text style={[styles.tableCell, { width: "12%" }]}>{pastilla}</Text>
        <Text style={[styles.tableCell, { width: "30%" }]}>{comentario}</Text>
      </View>
    )
  }
  
  function BloqueCriterios({ bundle }: { bundle: ClaudeAuditBundle }) {
    const rows = bundle.audit.criterios_evaluados
    return (
      <View style={styles.sectionWrap}>
        <PdfSectionBar title="39 Criterios Evaluados" />
        <View style={styles.tableHeaderRow}>
          <Text style={[styles.tableHeaderCell, { width: "14%" }]}>Sección</Text>
          <Text style={[styles.tableHeaderCell, { width: "28%" }]}>Criterio</Text>
          <Text style={[styles.tableHeaderCell, { width: "16%" }]}>Estado</Text>
          <Text style={[styles.tableHeaderCell, { width: "12%" }]}>
            Severidad
          </Text>
          <Text style={[styles.tableHeaderCell, { width: "30%" }]}>
            Comentario
          </Text>
        </View>
        {rows.map((row) => (
          <CriterioFilaPdf key={row.id} row={row} />
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
        <PdfSectionBar title="Texto propuesto" />
        <View style={styles.tableHeaderRow}>
          <Text style={[styles.tableHeaderCell, { width: "10%" }]}>Línea</Text>
          <Text style={[styles.tableHeaderCell, { width: "8%" }]}>Crit.</Text>
          <Text style={[styles.tableHeaderCell, { width: "22%" }]}>
            Original
          </Text>
          <Text style={[styles.tableHeaderCell, { width: "22%" }]}>
            Propuesto
          </Text>
          <Text style={[styles.tableHeaderCell, { width: "38%" }]}>Motivo</Text>
        </View>
        {sustituciones.map((s, i) => (
          <View key={`s-${s.linea}-${i}`} style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "10%" }]}>
              {s.linea}
              {s.html_linea_aprox ? `\n${s.html_linea_aprox}` : ""}
            </Text>
            <Text style={[styles.tableCell, { width: "8%" }]}>
              {s.criterio_id}
            </Text>
            <Text style={[styles.tableCell, { width: "22%" }]}>
              {trunc(s.original, 120)}
            </Text>
            <Text style={[styles.tableCell, { width: "22%" }]}>
              {trunc(s.propuesto, 120)}
            </Text>
            <Text style={[styles.tableCell, { width: "38%" }]}>
              {trunc(s.motivo, 160)}
            </Text>
          </View>
        ))}
      </View>
    )
  }
  
  function BloqueNotaTi({ texto }: { texto: string }) {
    return (
      <View style={styles.sectionWrap}>
        <PdfSectionBar title="Nota para el equipo TI" />
        <Text style={styles.body}>{texto}</Text>
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