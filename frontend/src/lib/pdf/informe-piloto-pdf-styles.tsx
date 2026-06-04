import { StyleSheet, Text, View } from "@react-pdf/renderer"

export const LC_AZUL = "#0F69C4"

export const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 48,
    paddingHorizontal: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#111827",
    lineHeight: 1.4,
  },
  docTitle: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 4,
    color: LC_AZUL,
  },
  docSubtitle: {
    fontSize: 9,
    color: "#4b5563",
    marginBottom: 16,
  },
  sectionWrap: {
    marginBottom: 14,
  },
  sectionBar: {
    backgroundColor: LC_AZUL,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  sectionBarText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: 700,
  },
  body: {
    fontSize: 10,
    color: "#111827",
  },
  bodyMuted: {
    fontSize: 9,
    color: "#6b7280",
  },
  fieldRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 4,
  },
  fieldLabel: {
    fontSize: 9,
    color: "#6b7280",
  },
  fieldValue: {
    fontSize: 10,
    flex: 1,
  },
  progressTrack: {
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    marginTop: 4,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 4,
  },
  listBullet: {
    width: 14,
    fontSize: 10,
  },
  listText: {
    flex: 1,
    fontSize: 10,
  },
  orderedItem: {
    marginBottom: 5,
    fontSize: 10,
    paddingLeft: 4,
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
    paddingVertical: 5,
    paddingHorizontal: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontWeight: 700,
    color: "#374151",
  },
  tableCell: {
    fontSize: 8,
    color: "#111827",
  },
  subheading: {
    fontSize: 10,
    fontWeight: 700,
    marginTop: 6,
    marginBottom: 4,
  },
})

const PROGRESS_FILL: Record<string, string> = {
  rechazado: "#dc2626",
  aceptado_con_observaciones: "#f59e0b",
  aprobado: "#059669",
}

export function progressFillColor(estado: string): string {
  return PROGRESS_FILL[estado] ?? "#6b7280"
}

type PdfSectionBarProps = {
  title: string
}

export function PdfSectionBar({ title }: PdfSectionBarProps) {
  return (
    <View style={styles.sectionBar}>
      <Text style={styles.sectionBarText}>{title}</Text>
    </View>
  )
}