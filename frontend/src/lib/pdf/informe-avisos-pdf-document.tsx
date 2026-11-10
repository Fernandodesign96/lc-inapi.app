import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"
import type { ClaudeAuditBundle } from "@contracts/claude-audit-pilot"
import {
  AVISOS_CORRECCION_HEADERS,
  buildAvisosCorreccionRows,
  type AvisosCorreccionRow,
} from "@repo/lib/avisos-correcciones-entrega"
import type { VistaRun } from "@repo/lib/avisos-propuesta-html"
import {
  formatFechaEvaluacionDatosUi,
  formatUsuarioQueAudita,
} from "@/lib/informe-piloto-format"
import { ETIQUETA_ESTADO_ACEPTACION } from "@/lib/resultado-mock-copy"
import {
  PdfSectionBar,
  progressFillColor,
  styles as baseStyles,
} from "@/lib/pdf/informe-piloto-pdf-styles"
import { buildDesgloseCorreccionesDatosAuditoria } from "@repo/lib/desglose-correcciones-datos-auditoria"
import { criteriosVisiblesParaEntrega } from "@repo/lib/audit-visible-content"

/** Fracciones de ancho: primeras 5 angostas. */
const COL_FRACS = [0.05, 0.08, 0.1, 0.06, 0.07, 0.24, 0.22, 0.18] as const

const s = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 22,
    fontSize: 7,
    fontFamily: "Helvetica",
    color: "#111",
  },
  title: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
  },
  table: {
    borderWidth: 0.5,
    borderColor: "#333",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#333",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#1F4E79",
    borderBottomWidth: 0.5,
    borderBottomColor: "#333",
  },
  cell: {
    padding: 3,
    borderRightWidth: 0.5,
    borderRightColor: "#333",
  },
  cellLast: {
    padding: 3,
  },
  headerText: {
    color: "#fff",
    fontFamily: "Helvetica-Bold",
    fontSize: 6.5,
  },
  cellText: {
    fontSize: 6,
    lineHeight: 1.25,
  },
})

function VistaText({ runs }: { runs: VistaRun[] }) {
  return (
    <Text style={s.cellText}>
      {runs.map((r, i) => {
        if (r.text === "\n") return "\n"
        const color =
          r.highlight || (r.color && /white|#fff/i.test(r.color))
            ? "#111111"
            : r.color?.startsWith("#")
              ? r.color
              : r.color?.toLowerCase() === "red"
                ? "#FF0000"
                : "#111111"
        return (
          <Text
            key={`v-${i}`}
            style={{
              fontFamily: r.bold ? "Helvetica-Bold" : "Helvetica",
              fontStyle: r.italic ? "italic" : "normal",
              textDecoration: r.underline || r.link ? "underline" : "none",
              color,
              backgroundColor: r.highlight ? "#FFD54F" : undefined,
            }}
          >
            {r.text}
          </Text>
        )
      })}
    </Text>
  )
}

function ContenidoCell({ row }: { row: AvisosCorreccionRow }) {
  return (
    <View>
      <Text style={[s.cellText, { fontSize: 5.5, color: "#333" }]}>
        {row.propuestoHtml}
      </Text>
      <Text style={[s.cellText, { marginTop: 4, fontFamily: "Helvetica-Bold" }]}>
        — Vista en pantalla —
      </Text>
      <VistaText runs={row.vistaRuns} />
    </View>
  )
}

function AvisosTable({ bundle }: { bundle: ClaudeAuditBundle }) {
  const rows = buildAvisosCorreccionRows(
    bundle.pilot.sustituciones ?? [],
    bundle.audit.criterios_evaluados,
  )

  return (
    <View style={s.table}>
      <View style={s.headerRow} wrap={false}>
        {AVISOS_CORRECCION_HEADERS.map((h, i) => (
          <View
            key={h}
            style={[
              i === AVISOS_CORRECCION_HEADERS.length - 1 ? s.cellLast : s.cell,
              { width: `${COL_FRACS[i]! * 100}%` },
            ]}
          >
            <Text style={s.headerText}>{h}</Text>
          </View>
        ))}
      </View>
      {rows.map((row) => (
        <View key={row.numero} style={s.row} wrap>
          {row.cells.map((cell, i) => (
            <View
              key={`${row.numero}-${i}`}
              style={[
                i === row.cells.length - 1 ? s.cellLast : s.cell,
                { width: `${COL_FRACS[i]! * 100}%` },
              ]}
            >
              {i === 6 ? (
                <ContenidoCell row={row} />
              ) : (
                <Text style={s.cellText}>{cell || " "}</Text>
              )}
            </View>
          ))}
        </View>
      ))}
    </View>
  )
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={baseStyles.fieldRow}>
      <Text style={baseStyles.fieldLabel}>{label}: </Text>
      <Text style={baseStyles.fieldValue}>{value}</Text>
    </View>
  )
}

function DatosResumen({ bundle }: { bundle: ClaudeAuditBundle }) {
  const { audit, pilot } = bundle
  const filas = criteriosVisiblesParaEntrega(audit.criterios_evaluados)
  const desglose = buildDesgloseCorreccionesDatosAuditoria(
    filas,
    pilot.sustituciones ?? [],
  )
  const pct = audit.porcentaje_cumplimiento

  return (
    <View style={baseStyles.sectionWrap}>
      <PdfSectionBar title="Datos de Auditoría" />
      <FieldRow label="Corpus" value="Avisos Sistemas (trámites)" />
      <FieldRow
        label="Fecha"
        value={formatFechaEvaluacionDatosUi(audit.fecha_evaluacion, audit.url)}
      />
      <FieldRow label="Evaluador" value={formatUsuarioQueAudita()} />
      <FieldRow label="Porcentaje" value={`${pct} %`} />
      <View style={baseStyles.progressTrack}>
        <View
          style={[
            baseStyles.progressFill,
            {
              width: `${Math.min(100, Math.max(0, pct))}%`,
              backgroundColor: progressFillColor(audit.estado_aceptacion),
            },
          ]}
        />
      </View>
      <FieldRow
        label="Estado"
        value={ETIQUETA_ESTADO_ACEPTACION[audit.estado_aceptacion]}
      />
      <FieldRow
        label="Total de correcciones"
        value={String(desglose.totalCorrecciones)}
      />
    </View>
  )
}

export function InformeAvisosPdfDocument({
  bundle,
}: {
  bundle: ClaudeAuditBundle
}) {
  return (
    <Document
      title="Informe LC — Avisos de sistemas"
      author="INAPI — Lenguaje Claro"
    >
      <Page size="A4" orientation="landscape" style={s.page} wrap>
        <Text style={s.title}>
          Informe de auditoría — Avisos de sistemas (trámites)
        </Text>
        <DatosResumen bundle={bundle} />
        <View style={{ marginTop: 10 }}>
          <PdfSectionBar title="Solicitudes de corrección" />
          <AvisosTable bundle={bundle} />
        </View>
      </Page>
    </Document>
  )
}
