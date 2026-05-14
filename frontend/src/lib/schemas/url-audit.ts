import { z } from "zod"

const allowedHosts = new Set([
  "inapi.cl",
  "www.inapi.cl",
  "tramites.inapi.cl",
  "www.tramites.inapi.cl",
])

export const auditUrlFormSchema = z.object({
  url: z
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
    ),
})

export type AuditUrlFormValues = z.infer<typeof auditUrlFormSchema>