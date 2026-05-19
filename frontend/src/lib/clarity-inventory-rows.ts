/**
 * Filas del inventario ampliado Clarity — copia de referencia para UI mock.
 * Fuente editorial: `docs/ux/inventario-urls-clarity.md` §2 (tabla 20 filas).
 */
export type ClarityInventoryRow = {
    rank: number
    rutaEtiqueta: string
    visitasRef: string
    porcentajeLcRef: string
    estadoRef: string
  }
  
  export const CLARITY_INVENTORY_ROWS: readonly ClarityInventoryRow[] = [
    { rank: 1, rutaEtiqueta: "Home `tramites.inapi.cl/`", visitasRef: "432.572", porcentajeLcRef: "60,0 %", estadoRef: "Rechazado" },
    { rank: 2, rutaEtiqueta: "`Account/Login`", visitasRef: "209.811", porcentajeLcRef: "65,2 %", estadoRef: "Rechazado" },
    { rank: 3, rutaEtiqueta: "`Trademark/TrademarkFile` (Expediente)", visitasRef: "198.337", porcentajeLcRef: "61,5 %", estadoRef: "Rechazado" },
    { rank: 4, rutaEtiqueta: "Notificaciones Marcas", visitasRef: "79.775", porcentajeLcRef: "55,2 %", estadoRef: "Rechazado" },
    { rank: 5, rutaEtiqueta: "`TrademarkSavedApplications`", visitasRef: "65.628", porcentajeLcRef: "64,3 %", estadoRef: "Rechazado" },
    { rank: 6, rutaEtiqueta: "`TrademarkApplication/IndexTrademark`", visitasRef: "41.429", porcentajeLcRef: "57,1 %", estadoRef: "Rechazado" },
    { rank: 7, rutaEtiqueta: "`Login/claveunica` (Registro CU)", visitasRef: "38.519", porcentajeLcRef: "62,1 %", estadoRef: "Rechazado" },
    { rank: 8, rutaEtiqueta: "`LoadTrademarkApplication` (paso 1)", visitasRef: "37.468", porcentajeLcRef: "61,3 %", estadoRef: "Rechazado" },
    { rank: 9, rutaEtiqueta: "`EstadosDiariosMarcas`", visitasRef: "31.929", porcentajeLcRef: "70,4 %", estadoRef: "Rechazado" },
    { rank: 10, rutaEtiqueta: "`TrademarkNizaClassifier`", visitasRef: "30.947", porcentajeLcRef: "67,7 %", estadoRef: "Rechazado" },
    { rank: 11, rutaEtiqueta: "`TrademarkUserDocument/SuccessConfirmation`", visitasRef: "23.779", porcentajeLcRef: "72,0 %", estadoRef: "Rechazado" },
    { rank: 12, rutaEtiqueta: "`TrademarkUserDocument` (Escritos)", visitasRef: "23.141", porcentajeLcRef: "63,0 %", estadoRef: "Rechazado" },
    { rank: 13, rutaEtiqueta: "Confirmación Solicitud Marca", visitasRef: "21.825", porcentajeLcRef: "57,7 %", estadoRef: "Rechazado" },
    { rank: 14, rutaEtiqueta: "`LoadTrademarkApplication` (revisión)", visitasRef: "18.654", porcentajeLcRef: "59,4 %", estadoRef: "Rechazado" },
    { rank: 15, rutaEtiqueta: "`Account/Register`", visitasRef: "17.603", porcentajeLcRef: "55,9 %", estadoRef: "Rechazado" },
    { rank: 16, rutaEtiqueta: "`TrademarkSecondPayment/SuccessConfirmation`", visitasRef: "14.609", porcentajeLcRef: "68,0 %", estadoRef: "Rechazado" },
    { rank: 17, rutaEtiqueta: "`TrademarkAnnotation`", visitasRef: "13.600", porcentajeLcRef: "59,3 %", estadoRef: "Rechazado" },
    { rank: 18, rutaEtiqueta: "`EstadosDiariosPatentes`", visitasRef: "12.628", porcentajeLcRef: "70,4 %", estadoRef: "Rechazado" },
    { rank: 19, rutaEtiqueta: "`TrademarkRenewalApplication`", visitasRef: "12.528", porcentajeLcRef: "70,8 %", estadoRef: "Rechazado" },
    { rank: 20, rutaEtiqueta: "`NotificacionesPatentes`", visitasRef: "12.271", porcentajeLcRef: "56,7 %", estadoRef: "Rechazado" },
  ] as const