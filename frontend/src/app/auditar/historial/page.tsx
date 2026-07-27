import type { Metadata } from "next"

import { AuditarHistorialIndex } from "@/components/auditar-historial-index"

export const metadata: Metadata = {
  title: "Historial de auditorías | LC INAPI",
  description:
    "Listado de URLs Clarity con informes LC versionados por fecha.",
}

export default function AuditarHistorialPage() {
  return <AuditarHistorialIndex />
}