import { z } from "zod"

export const claimBodySchema = z
  .object({
    workerId: z.string().trim().min(1).max(120).optional(),
  })
  .optional()
  .default({})

export const completeBodySchema = z.discriminatedUnion("ok", [
  z.object({
    ok: z.literal(true),
    auditId: z.string().trim().min(1).max(200),
  }),
  z.object({
    ok: z.literal(false),
    errorMessage: z.string().trim().min(1).max(500),
  }),
])
