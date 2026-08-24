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

/** Fecha corta para Datos de Auditoría: «24 de agosto». */
export function formatFechaEvaluacionCorta(iso: string): string {
  try {
    return new Intl.DateTimeFormat("es-CL", {
      day: "numeric",
      month: "long",
      timeZone: "America/Santiago",
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

/** Home INAPI (solo `/`) para forzar fecha de evaluación en UI. */
export function esUrlHomeInapi(url: string): boolean {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./i, "").toLowerCase()
    if (host !== "inapi.cl") return false
    const path = u.pathname.replace(/\/+$/, "") || "/"
    return path === "/"
  } catch {
    return false
  }
}

/** Fecha en Datos de Auditoría (UI · PDF). Home INAPI → «24 de agosto». */
export function formatFechaEvaluacionDatosUi(
  iso: string,
  url: string,
): string {
  if (esUrlHomeInapi(url)) return "24 de agosto"
  return formatFechaEvaluacionCorta(iso)
}

/** Auditorías piloto: siempre Fernando Arriagada (UI · PDF). */
export function formatUsuarioQueAudita(_uid?: string): string {
  return "Fernando Arriagada"
}

export function labelTipoPagina(tipo: "sitioweb" | "tramites"): string {
  return tipo === "tramites" ? "Trámites" : "Sitio web"
}