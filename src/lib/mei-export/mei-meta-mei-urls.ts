import type { CriterionId } from "../../schemas/checklist"

/**
 * 10 URLs META MEI (compromiso INAPI / reunión jefatura).
 * Orden META MEI 2026-07-29. Solo SIAC es trámites; el resto sitioweb.
 */
export type MeiMetaMeiUrl = {
  orden: number
  url: string
  nombreUi: string
  tipoPagina: "sitioweb" | "tramites"
  /** Id JSON vigente en data/claude-audits/ (null = pendiente de auditoría). */
  auditId: string | null
  /** Rol en la muestra META MEI. */
  rolMetaMei: string
  /**
   * Si true, la tabla META MEI en `/auditar` muestra «En proceso» (sin %/estado
   * ni enlace al JSON previo) mientras corre la reauditoría 1-URL.
   */
  reauditoriaEnProceso?: boolean
}

export const MEI_META_MEI_URLS: MeiMetaMeiUrl[] = [
  {
    orden: 1,
    url: "https://www.inapi.cl/",
    nombreUi: "Portada / inicio INAPI",
    tipoPagina: "sitioweb",
    auditId: "www-inapi-cl_2026-08-21",
    rolMetaMei: "Portada o página de inicio",
  },
  {
    orden: 2,
    url: "https://www.inapi.cl/marcas",
    nombreUi: "Marcas",
    tipoPagina: "sitioweb",
    auditId: "www-inapi-cl-marcas_2026-08-25",
    rolMetaMei: "Menú principal (1/2)",
  },
  {
    orden: 3,
    url: "https://www.inapi.cl/patentes",
    nombreUi: "Patentes",
    tipoPagina: "sitioweb",
    auditId: "www-inapi-cl-patentes_2026-08-25",
    rolMetaMei: "Menú principal (2/2)",
  },
  {
    orden: 4,
    url: "https://www.inapi.cl/acerca-de/inapi",
    nombreUi: "Acerca de INAPI",
    tipoPagina: "sitioweb",
    auditId: "www-inapi-cl-acerca-de-inapi_2026-08-25",
    rolMetaMei: "Página de información interior (1/2)",
  },
  {
    orden: 5,
    url: "https://www.inapi.cl/buscador?indexCatalogue=inapi&searchQuery=noticias&wordsMode=0",
    nombreUi: "Buscador de noticias",
    tipoPagina: "sitioweb",
    auditId: "www-inapi-cl-buscador-noticias_2026-08-22",
    rolMetaMei: "Página de información interior (2/2)",
  },
  {
    orden: 6,
    url: "https://www.inapi.cl/marcas/tramites/solicitud-nueva",
    nombreUi: "Solicitud Nueva (Marcas)",
    tipoPagina: "sitioweb",
    auditId: "www-inapi-cl-marcas-tramites-solicitud-nueva_2026-08-22",
    rolMetaMei: "Información del servicio digital / trámite",
  },
  {
    orden: 7,
    url: "https://www.inapi.cl/sala-de-prensa/noticias",
    nombreUi: "Sala de Prensa — Noticias",
    tipoPagina: "sitioweb",
    auditId: "www-inapi-cl-sala-de-prensa-noticias_2026-08-22",
    rolMetaMei: "Listado últimas noticias",
  },
  {
    orden: 8,
    url: "https://www.inapi.cl/sala-de-prensa/detalle-noticia/inapi-realizo-su-cuenta-publica-participativa-2026-en-valparaiso-y-reforzo-compromiso-con-la-descentralizacion-de-la-propiedad-industrial",
    nombreUi: "Noticia — Cuenta Pública Participativa 2026",
    tipoPagina: "sitioweb",
    auditId: "www-inapi-cl-noticia-cuenta-publica-2026_2026-08-22",
    rolMetaMei: "Últimas noticias (detalle 1/2)",
  },
  {
    orden: 9,
    url: "https://www.inapi.cl/sala-de-prensa/detalle-noticia/chile-alcanza-su-mayor-cifra-de-solicitudes-de-patentes-nacionales-en-mas-de-una-decada",
    nombreUi: "Noticia — Cifra histórica de patentes nacionales",
    tipoPagina: "sitioweb",
    auditId: "www-inapi-cl-noticia-cifra-patentes-nacionales_2026-08-22",
    rolMetaMei: "Últimas noticias (detalle 2/2)",
  },
  {
    orden: 10,
    url: "https://tramites.inapi.cl/siac",
    nombreUi: "Formulario Contacto SIAC",
    tipoPagina: "tramites",
    auditId: "tramites-inapi-cl-siac_2026-08-22",
    rolMetaMei: "Formulario (trámites)",
  },
]

/** Secciones B+C+D = alcance editorial Hito 2 (Lenguaje claro, Redacción, Ortografía). */
export const MEI_H02_SECTION_IDS = ["B", "C", "D"] as const

/**
 * Criterios H02 para Meta MEI: todo B, C y D (Ortografía completa D1–D7).
 * Amplía el set técnico histórico (D1,D2,D7) para comunicar la dimensión completa.
 */
export const MEI_META_MEI_H02_CRITERIOS: CriterionId[] = [
  "B1",
  "B2",
  "B3",
  "B4",
  "B5",
  "B6",
  "B7",
  "B8",
  "C1",
  "C2",
  "C3",
  "C4",
  "C5",
  "C6",
  "C7",
  "C8",
  "C9",
  "D1",
  "D2",
  "D3",
  "D4",
  "D5",
  "D6",
  "D7",
]

export function metaMeiUrlsWithAudit(): MeiMetaMeiUrl[] {
  return MEI_META_MEI_URLS.filter((u) => u.auditId !== null)
}

export function metaMeiPendingUrls(): MeiMetaMeiUrl[] {
  return MEI_META_MEI_URLS.filter((u) => u.auditId === null)
}
