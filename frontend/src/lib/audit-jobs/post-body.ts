import { z } from "zod"

import { auditUrlFormSchema } from "@/lib/schemas/url-audit"

const hasHtmlTag = /<[^>]*>/u

/**
 * Body de `POST /api/audit-jobs` (contrato docs/contratos-audit-jobs.md).
 * Reutiliza hosts permitidos del formulario `/auditar`.
 */
export const createAuditJobBodySchema = z.object({
  url: auditUrlFormSchema.shape.url,
  auditorNombre: z
    .string()
    .transform((s) => s.trim())
    .pipe(
      z
        .string()
        .min(1, "Debes indicar el nombre de quien audita")
        .max(120, "El nombre no puede superar 120 caracteres")
        .refine((s) => !hasHtmlTag.test(s), {
          message: "El nombre no puede incluir HTML",
        }),
    ),
})

export type CreateAuditJobBody = z.infer<typeof createAuditJobBodySchema>
