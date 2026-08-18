import { z } from "zod"

const allowedHosts = new Set([
  "inapi.cl",
  "www.inapi.cl",
  "tramites.inapi.cl",
  "www.tramites.inapi.cl",
])

const hasHtmlTag = /<[^>]*>/u

const urlField = z
  .string()
  .transform((s) => s.trim())
  .pipe(
    z
      .string()
      .min(1, "Debes ingresar una URL")
      .refine(
        (s) => {
          try {
            const u = new URL(s)
            return u.protocol === "http:" || u.protocol === "https:"
          } catch {
            return false
          }
        },
        { message: "URL no válida" },
      )
      .refine(
        (s) => {
          try {
            const host = new URL(s).hostname.toLowerCase()
            return allowedHosts.has(host)
          } catch {
            return false
          }
        },
        {
          message:
            "Solo se permiten URLs de inapi.cl o tramites.inapi.cl (según PRD).",
        },
      ),
  )

const auditorNombreField = z
  .string()
  .transform((s) => s.trim())
  .pipe(
    z
      .string()
      .min(1, "Debes indicar quién audita")
      .max(120, "El nombre no puede superar 120 caracteres")
      .refine((s) => !hasHtmlTag.test(s), {
        message: "El nombre no puede incluir HTML",
      }),
  )

export const auditUrlFormSchema = z.object({
  url: urlField,
})

/** Formulario Continuar → POST /api/audit-jobs. */
export const auditJobRequestFormSchema = z.object({
  url: urlField,
  auditorNombre: auditorNombreField,
})

export type AuditUrlFormValues = z.infer<typeof auditUrlFormSchema>
export type AuditJobRequestFormValues = z.infer<
  typeof auditJobRequestFormSchema
>
