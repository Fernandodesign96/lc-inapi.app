import { z } from "zod"

export const meiItemEstadoSchema = z.enum([
  "pendiente",
  "en_progreso",
  "completado",
])

export type MeiItemEstado = z.infer<typeof meiItemEstadoSchema>

export const meiItemSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["tarea", "hito"]),
  subdimensionId: z.string().min(1),
  numeroActividad: z.number().int().positive().nullable(),
  title: z.string().min(1),
  description: z.string().min(1),
  inicio: z.string().min(1),
  termino: z.string().min(1),
  trimestre: z.string().min(1),
  estado: meiItemEstadoSchema,
  excelHitoId: z.string().nullable(),
})

export const meiCatalogSchema = z.object({
  version: z.string(),
  updatedAt: z.string(),
  dimensions: z.array(
    z.object({
      id: z.string(),
      code: z.string(),
      name: z.string(),
      description: z.string(),
      clase: z.enum(["sitio", "servicio"]),
      resultado: z.string(),
      subdimensionIds: z.array(z.string()),
    }),
  ),
  subdimensions: z.record(
    z.object({
      id: z.string(),
      code: z.string(),
      name: z.string(),
      dimensionId: z.string(),
      clase: z.enum(["cl", "us", "se"]),
      brecha: z.string(),
      objetivo: z.string(),
      indicadorProceso: z.string(),
      indicadorResultado: z.string(),
      area: z.string(),
      costo: z.string(),
    }),
  ),
  items: z.array(meiItemSchema),
})

export type MeiCatalog = z.infer<typeof meiCatalogSchema>
export type MeiItem = z.infer<typeof meiItemSchema>

export function parseMeiCatalog(data: unknown): MeiCatalog {
  return meiCatalogSchema.parse(data)
}
