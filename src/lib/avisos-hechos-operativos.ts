/**
 * Hechos operativos de un aviso de sistemas.
 * Agrupar IDs por plantilla (solo cambia fecha/hora) no autoriza borrar estos hechos
 * ni sustituir todos los avisos por un único párrafo genérico (C-2026-11-10a).
 */

export type AvisoHechos = {
  tgr: boolean
  noRealicePagos: boolean
  retrasoConfirmacionPago: boolean
  claveUnica: boolean
  claveInapiDisponible: boolean
  mfaSeisDigitos: boolean
  runContrasena: boolean
  custodiaPoderes: boolean
  cambioProveedor: boolean
  direccionamientoIp: boolean
  datacenter: boolean
  dosEtapas: boolean
  firmaTitulos: boolean
  soloPatentes: boolean
  soloMarcas: boolean
  intermitencia: boolean
  correoInapi: boolean
}

const RE_TGR = /tesorer[ií]a general de la rep[uú]blica|\bTGR\b/i
const RE_NO_PAGOS =
  /NO\s+realice presentaciones que requieran pago|no vuelva a intentar el pago/i
const RE_RETRASO = /retrasos en la confirmaci[oó]n de pagos|espere el comprobante/i
const RE_CLAVE_UNICA = /clave\s*[uú]nica/i
const RE_CLAVE_INAPI = /clave inapi/i
const RE_MFA = /c[oó]digo de seguridad de 6 d[ií]gitos/i
const RE_RUN = /\bRUN\b/i
const RE_CUSTODIA = /custod[ií]a y presentaci[oó]n de poderes/i
const RE_PROVEEDOR = /cambio de proveedor|cambiar[aá] el proveedor/i
const RE_IP = /direccionamiento IP|propagaci[oó]n del nuevo/i
const RE_DC = /\bdatacenter\b|centro de datos/i
const RE_ETAPAS = /2 etapas|dos etapas/i
const RE_FIRMA = /firmar electr[oó]nicamente los t[ií]tulos/i
const RE_PATENTES = /[aá]rea de patentes|plataforma web de patentes/i
const RE_MARCAS =
  /servicios de marcas comerciales|expediente electr[oó]nico/i
const RE_INTERMIT = /intermiten/i
const RE_CORREO = /inapi@inapi\.cl/i

export function extraerHechosAviso(texto: string): AvisoHechos {
  return {
    tgr: RE_TGR.test(texto),
    noRealicePagos: RE_NO_PAGOS.test(texto),
    retrasoConfirmacionPago: RE_RETRASO.test(texto),
    claveUnica: RE_CLAVE_UNICA.test(texto),
    claveInapiDisponible: RE_CLAVE_INAPI.test(texto),
    mfaSeisDigitos: RE_MFA.test(texto),
    runContrasena: RE_RUN.test(texto),
    custodiaPoderes: RE_CUSTODIA.test(texto),
    cambioProveedor: RE_PROVEEDOR.test(texto),
    direccionamientoIp: RE_IP.test(texto),
    datacenter: RE_DC.test(texto),
    dosEtapas: RE_ETAPAS.test(texto),
    firmaTitulos: RE_FIRMA.test(texto),
    soloPatentes: RE_PATENTES.test(texto),
    soloMarcas: RE_MARCAS.test(texto),
    intermitencia: RE_INTERMIT.test(texto),
    correoInapi: RE_CORREO.test(texto),
  }
}

/** Etiquetas cortas para Observaciones / motivo. */
export function etiquetasHechos(h: AvisoHechos): string[] {
  const out: string[] = []
  if (h.tgr) out.push("TGR")
  if (h.noRealicePagos) out.push("no realizar pagos/presentaciones")
  if (h.retrasoConfirmacionPago) out.push("retraso confirmación de pago")
  if (h.claveUnica) out.push("ClaveÚnica")
  if (h.claveInapiDisponible) out.push("Clave INAPI disponible")
  if (h.mfaSeisDigitos) out.push("código 6 dígitos")
  if (h.runContrasena) out.push("RUN y contraseña")
  if (h.custodiaPoderes) out.push("Custodia de poderes")
  if (h.cambioProveedor) out.push("cambio de proveedor")
  if (h.direccionamientoIp) out.push("propagación IP 48 h")
  if (h.datacenter) out.push("centro de datos")
  if (h.dosEtapas) out.push("mantención en 2 etapas")
  if (h.firmaTitulos) out.push("firma de títulos")
  if (h.soloPatentes) out.push("solo Patentes")
  if (h.soloMarcas) out.push("solo Marcas")
  if (h.intermitencia) out.push("intermitencia")
  if (h.correoInapi) out.push("correo inapi@inapi.cl")
  return out
}

const CIERRE =
  "Lamentamos las molestias y agradecemos su comprensión."

/** Conserva ventanas de fecha/hora del original; no las sustituye por un comodín. */
export function extraerVentanaCalendario(texto: string): string | null {
  const collapsed = texto.replace(/\s+/g, " ").trim()
  const m = collapsed.match(
    /(?:el mantenimiento se ha planificado[\s\S]{0,280}horas|esta interrupci[oó]n est[aá] programada para[\s\S]{0,160}horas|el mantenimiento se realizar[aá][\s\S]{0,120}horas|programada(?:s)?(?: el d[ií]a)?[\s\S]{0,120}horas|a partir de este lunes[\s\S]{0,40}|este viernes[\s\S]{0,80}|este fin de semana[\s\S]{0,40}|hoy[\s\S]{0,80}horas|entre las[\s\S]{0,80}horas)/i,
  )
  if (!m) return null
  return m[0].replace(/\s+/g, " ").trim()
}

/**
 * Reescritura LC del aviso: misma voz institucional, hechos operativos intactos,
 * fecha/hora de ESTA fila. Prohibido un párrafo único «centro de datos» para todos.
 */
export function construirPropuestaAviso(
  texto: string,
  opts?: { plantillaVariosIds?: boolean },
): string {
  const h = extraerHechosAviso(texto)
  const ventana = opts?.plantillaVariosIds
    ? "En cada aviso conserve el día, la fecha y el horario ya publicados (solo esos datos cambian entre IDs)"
    : extraerVentanaCalendario(texto)

  if (h.mfaSeisDigitos) {
    return (
      "Más protección para tus trámites. A partir de este lunes, al ingresar con RUN y contraseña " +
      "te pediremos un código de seguridad de 6 dígitos que llegará a tu correo. " +
      "Si utilizas ClaveÚnica, tu acceso sigue igual. " +
      "Verifica hoy en tu perfil que puedas acceder al correo registrado para evitar demoras."
    )
  }

  if (h.firmaTitulos) {
    return (
      "Importante. Estimados usuarios y usuarias: por un inconveniente técnico no es posible " +
      "firmar electrónicamente los títulos y certificados, por lo que no pueden emitirse ahora. " +
      "Estamos trabajando en la solución e informaremos cuando la emisión vuelva a estar disponible. " +
      CIERRE
    )
  }

  if (h.custodiaPoderes) {
    const cuando = ventana ?? "en el horario anunciado en este aviso"
    return (
      "Aviso importante: presentación de poderes. Estimados usuarios y usuarias: " +
      "el sistema de Custodia y presentación de poderes presentará intermitencia " +
      `${cuando} por actualización de la plataforma. ` +
      CIERRE
    )
  }

  if (h.tgr && h.noRealicePagos) {
    return (
      "Aviso importante: interrupción de los servicios electrónicos de pago. " +
      "Estimados usuarios y usuarias: hay inconvenientes en los pagos con la " +
      "Tesorería General de la República (TGR). No realice presentaciones que requieran pago " +
      "hasta que esta situación esté resuelta. Si lo hace, el trámite puede quedar incompleto o duplicarse. " +
      CIERRE
    )
  }

  if (h.retrasoConfirmacionPago) {
    return (
      "Importante. Estimados usuarios y usuarias: hay retrasos en la confirmación de pagos. " +
      "Si ya realizó su transacción, no vuelva a intentar el pago y espere el comprobante: " +
      "el proceso está tardando más de lo habitual. " +
      CIERRE
    )
  }

  if (h.tgr) {
    const cuando = ventana ? ` ${ventana.charAt(0).toUpperCase()}${ventana.slice(1)}.` : ""
    return (
      "Importante. Estimados usuarios y usuarias: la Tesorería General de la República (TGR) " +
      "presenta intermitencia en el servicio de pago." +
      cuando +
      " No realice presentaciones que requieran pago mientras el servicio esté interrumpido. " +
      CIERRE
    )
  }

  if (h.claveInapiDisponible && h.claveUnica) {
    const cuando = ventana ?? "en el horario anunciado"
    return (
      "Importante: intermitencia en el acceso con ClaveÚnica. Estimados usuarios y usuarias: " +
      `el servicio de ClaveÚnica tendrá una mantención programada ${cuando}. ` +
      "El acceso a trámites en línea por esa vía puede fallar o no estar disponible. " +
      "Información clave: el sistema de autenticación con Clave INAPI sí estará disponible " +
      "y funcionará con normalidad para todos los trámites. " +
      CIERRE
    )
  }

  if (h.claveUnica) {
    const cuando = ventana ?? "en el horario anunciado"
    return (
      "Importante. Estimados usuarios y usuarias: el servicio de ClaveÚnica realizará " +
      `mantenimiento programado ${cuando}. Durante ese periodo el acceso con ClaveÚnica no estará disponible. ` +
      CIERRE
    )
  }

  if (h.cambioProveedor && h.direccionamientoIp) {
    return (
      "Importante. Estimados usuarios y usuarias: INAPI cambiará el proveedor de enlaces " +
      "de comunicaciones este fin de semana. Puede haber intermitencias en el sitio y en los " +
      "servicios electrónicos por la actualización de las direcciones de red, un proceso externo " +
      "que puede tardar hasta 48 horas. " +
      CIERRE
    )
  }

  if (h.cambioProveedor) {
    const cuando = ventana ?? "en el horario anunciado"
    return (
      "Aviso importante: interrupción de los servicios electrónicos. Estimados usuarios y usuarias: " +
      `${cuando} se realizarán trabajos en la red de INAPI por cambio de proveedor, ` +
      "lo que interrumpirá los servicios electrónicos. " +
      CIERRE
    )
  }

  if (h.soloPatentes) {
    const cuando = ventana ?? "en el horario anunciado"
    return (
      "Estimados usuarios y usuarias: INAPI realizará una mantención del sistema de tramitación " +
      `del Área de Patentes ${cuando}. Durante ese proceso no será posible usar la plataforma web de Patentes. ` +
      "Los servicios de tramitación de Marcas Comerciales funcionarán con normalidad. " +
      "Ante consultas, escriba a inapi@inapi.cl. " +
      CIERRE
    )
  }

  if (h.soloMarcas) {
    return (
      "Aviso importante: intermitencia en nuestros servicios. Estimados usuarios y usuarias: " +
      "hay inconvenientes técnicos que afectan la disponibilidad de los servicios de Marcas Comerciales. " +
      "Temporalmente no está disponible el acceso al Expediente Electrónico, la actualización de información " +
      "ni la tramitación de solicitudes, ingreso de escritos y anotaciones. El equipo técnico trabaja para restablecer el servicio. " +
      CIERRE
    )
  }

  if (h.dosEtapas) {
    const cuando = ventana ?? "en las dos ventanas anunciadas en este aviso"
    return (
      "Importante. Estimados usuarios y usuarias: los servicios de atención en línea quedarán " +
      `inhabilitados de forma temporal por mantención técnica programada. ${cuando}. ` +
      "No se podrán realizar trámites en línea ni acceder a información del sitio mientras dure la mantención. " +
      "Puede completar su trámite antes del inicio o volver a intentarlo cuando se restablezca el servicio. " +
      CIERRE
    )
  }

  const motivoDc = h.datacenter ? " del centro de datos" : ""
  const efecto = h.intermitencia
    ? "pueden presentar intermitencias"
    : "estarán temporalmente fuera de servicio"
  const cuando = ventana
    ? ventana.charAt(0).toUpperCase() + ventana.slice(1)
    : "Conserve la fecha y el horario de este aviso (no los reemplace por una frase genérica)."

  return (
    `Importante. Estimados usuarios y usuarias: por mantenimiento programado${motivoDc}, ` +
    `los servicios de atención en línea ${efecto}. ${cuando}. ` +
    (h.intermitencia
      ? ""
      : "Durante ese período no será posible realizar trámites en línea. " +
        "Puede completar su trámite antes del inicio o volver a intentarlo cuando se restablezca el servicio. ") +
    CIERRE
  )
}
