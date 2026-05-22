/**
 * Genera una vez los tres JSON de fixtures en data/audit-fixtures/.
 * Ejecutar desde la raíz del monorepo:
 *   bun run src/scripts/generate-audit-fixture-json-files.ts
 */
import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import {
  buildDemoStrictAuditWithCumpleCount,
  CRITERION_IDS,
  strictAuditRecordSchema,
  summarizeEvaluations,
} from "../schemas/checklist"

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, "../../data/audit-fixtures")

function writeFixture(filename: string, data: unknown) {
  const parsed = strictAuditRecordSchema.parse(data)
  writeFileSync(join(outDir, filename), JSON.stringify(parsed, null, 2) + "\n", "utf8")
}

mkdirSync(outDir, { recursive: true })

// --- 1) Rechazado: Notificaciones Marcas (16 / 29 / 10 / 13 según informe) ---
const naIds = new Set([
  "B7", "C6", "C7", "D6", "E2", "E4", "F1", "G2", "G3", "H1",
])
const incIds = new Set([
  "A3", "B1", "B2", "B3", "C3", "C4", "D5", "D7", "E1", "E3", "F3", "F4", "G1",
])
const severidad: Record<string, "baja" | "media" | "alta"> = {
  D7: "alta",
  B2: "alta",
  B3: "media",
  B1: "media",
  C3: "media",
  C4: "media",
  A3: "baja",
  D5: "baja",
  G1: "alta",
  E3: "baja",
  F3: "media",
  F4: "baja",
  E1: "baja",
}
const comentario: Record<string, string> = {
  D7:
    "Mayúsculas sostenidas en cabeceras, pestañas y botones (MARCAS, PATENTES, BUSCAR, LIMPIAR, VER ESTADO DIARIO MARCAS).",
  B2:
    "Jerga legal densa en el modal sin definiciones (notificación legal, estado diario, demanda de oposición, etc.).",
  B3: "Siglas y referencias (INAPI, Resolución Exenta 138) sin primera definición en contexto.",
  B1: "Voz pasiva predominante en tramos del modal y formulario.",
  C3: "Oración muy larga (>50 palabras) sin subdivisión en el modal.",
  C4:
    "Modal mezcla tres ideas: aviso legal, casos de notificación electrónica obligatoria, remisión a manual.",
  A3: "Titulares duplicados o redundantes entre vista sin filtros y con filtros.",
  D5:
    "Bloque de campos sin estructura clara de enumeración (listas/tablas) para lo que debe completarse.",
  G1: "RUN completo visible; minimización de datos personales.",
  E3:
    "Falta fecha de actualización visible para el contenido editorial global de la página.",
  F3: "CTA en mayúsculas y destino del enlace poco explicitado.",
  F4: "Enlace en modal sin contexto de apertura / formato / peso cuando aplica.",
  E1: "Referencia obsoleta a «Twitter» en pie (marca renombrada).",
}

const criteriosNotificaciones = CRITERION_IDS.map((id) => {
  if (naIds.has(id)) return { id, estado: "no_aplica" as const }
  if (incIds.has(id)) {
    return {
      id,
      estado: "incumple" as const,
      severidad: severidad[id]!,
      comentario: comentario[id]!,
    }
  }
  return { id, estado: "cumple" as const }
})

const sumNoti = summarizeEvaluations(criteriosNotificaciones)

const textoCapturadoNoti = [
  "=== Modal Advertencia ===",
  "Las notificaciones electrónicas disponibles como cortesía en esta plataforma, así como los avisos de alerta por correo electrónico, no reemplazan la notificación legal, la cual se realiza por el estado diario (Art. 13 de la Ley 19.039).",
  "La Ley obliga a notificar electrónicamente solo la demanda de oposición, la observación de fondo y la resolución que acepta el registro solicitado. Para otras resoluciones, el interesado debe revisar siempre los estados diarios disponibles en https://tramites.inapi.cl/EstadosDiariosMarcas.",
  "Para más información consulte la Resolución Exenta 138, Instructivo del Sistema de Tramitación Electrónica del INAPI, numerales 11 a 13.",
  "=== Vista sin filtros ===",
  "Trámites y Servicios • Notificaciones Electrónicas. Pestañas Marcas/Patentes. Sección: Notificaciones Electrónicas de Marcas. > Mostrar filtros de búsqueda. Resultados: No se encontraron resultados.",
  "=== Vista con filtros ===",
  "Campos: Número de Solicitud, rango de fechas, Titular/Solicitante. RUN Notificado: 18.618.492-0. Nombre: Fernando Ignacio Arriagada Castillo. Última actualización de notificaciones: 11/05/2026 08:00:00 a. m. Botones BUSCAR, LIMPIAR, VER ESTADO DIARIO MARCAS. Resultados: No se encontraron resultados.",
  "=== Pie ===",
  "INAPI Chile. Contacto y versión v 2.3.83.0.",
].join("\n\n")

const textoPropuestoNoti = [
  "Encabezado: Trámites y Servicios — Notificaciones Electrónicas; [Marcas] [Patentes] Fernando Arriagada.",
  "Aviso importante (modal): notificaciones y correo no reemplazan notificación legal; estado diario (Art. 13 Ley 19.039); lista de tres casos de notificación electrónica obligatoria; resto: revisar estados diarios; enlace a Resolución Exenta 138; botón Entendido.",
  "Notificaciones electrónicas de marcas: filtros y datos de usuario con RUN parcialmente oculto; botones en minúsculas tipo oración; resultados sin hallazgos con filtros aplicados.",
].join("\n\n")

writeFixture("audit_fixture_notificaciones_marcas_rechazado.json", {
  id: "audit_fixture_notificaciones_marcas_rechazado",
  url: "https://tramites.inapi.cl/Notificaciones",
  fecha_evaluacion: "2026-05-11T12:00:00.000Z",
  evaluador_uid: "Fernando Arriagada Castillo",
  version_checklist: "1.1",
  texto_capturado: textoCapturadoNoti,
  criterios_evaluados: criteriosNotificaciones,
  ...sumNoti,
  texto_propuesto: textoPropuestoNoti,
  observaciones_lc:
    "La pantalla concentra 13 criterios incumplidos entre 29 aplicables: modal denso y legalista, RUN visible, titulares duplicados, mayúsculas en controles y enlaces poco descriptivos.",
  tiempo_evaluacion_segundos: 120,
})

// --- 2) Aceptado con observaciones: mismo patrón numérico que atajo "intermedio" (82,9 %) ---
const inter = buildDemoStrictAuditWithCumpleCount(
  29,
  {
    id: "audit_fixture_presentacion_escritos_observaciones",
    url: "https://tramites.inapi.cl/Trademark/TrademarkUserDocument/SuccessConfirmation",
    fecha_evaluacion: "2026-05-11T15:00:00.000Z",
    evaluador_uid: "fixture@inapi.cl",
    version_checklist: "1.1",
    texto_capturado:
      "(mock fixture) Confirmación de presentación de escritos — texto capturado abreviado Fase 1.",
    observaciones_lc:
      "Ajustar instrucciones del paso de confirmación, unificar tono institucional en mensajes de éxito y revisar enlaces de ayuda contextual.",
    texto_propuesto: `(mock) Confirmación de presentación de escritos
• Título: "Recibimos tus escritos"
• Cuerpo: "Guardamos tu presentación; te avisaremos si falta un antecedente."

Mensaje de éxito (estado: completado)
• "Puedes descargar el comprobante en PDF desde tu expediente."`,
  },
  "intermedio",
  4,
)

writeFixture("audit_fixture_presentacion_escritos_observaciones.json", inter)

// --- 3) Aprobado: mismo patrón que atajo "mejor" (97,3 %) ---
const mejor = buildDemoStrictAuditWithCumpleCount(
  36,
  {
    id: "audit_fixture_home_inapi_aprobado",
    url: "https://www.inapi.cl/",
    fecha_evaluacion: "2026-05-11T16:00:00.000Z",
    evaluador_uid: "fixture@inapi.cl",
    version_checklist: "1.1",
    texto_capturado:
      "(mock fixture) Homepage institucional INAPI — texto capturado abreviado Fase 1.",
    observaciones_lc:
      "Mantener criterios de titulares y enlaces; planificar revisión periódica de novedades sin bloquear publicación.",
    texto_propuesto: `(mock) Homepage institucional
• H1: "Instituto Nacional de Propiedad Industrial"
• Banda de accesos rápidos con verbos en infinitivo: "Tramitar", "Consultar", "Contactar"

Nota: mock alineado a perfil "mejor"; sin bloquear publicación.`,
  },
  "mejor",
  2,
)

writeFixture("audit_fixture_home_inapi_aprobado.json", mejor)

console.log("OK — escritos 3 archivos en", outDir)