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