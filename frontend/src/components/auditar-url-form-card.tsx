"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Controller, useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  auditJobRequestFormSchema,
  type AuditJobRequestFormValues,
} from "@/lib/schemas/url-audit"
import { historialHref } from "@/lib/clarity-audits-launch"

type CreateJobResponse = {
  id: string
  status: string
  createdAt: string
  message: string
  error?: string
}

export function AuditarUrlFormCard() {
  const router = useRouter()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const form = useForm<AuditJobRequestFormValues>({
    resolver: zodResolver(auditJobRequestFormSchema),
    defaultValues: { url: "", auditorNombre: "" },
  })

  async function onSubmit(data: AuditJobRequestFormValues) {
    setSubmitError(null)
    try {
      const res = await fetch("/api/audit-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: data.url,
          auditorNombre: data.auditorNombre,
        }),
      })
      const json = (await res.json()) as CreateJobResponse
      if (!res.ok) {
        setSubmitError(json.error ?? "No se pudo crear la solicitud")
        return
      }
      router.push(
        `/auditar/procesando?jobId=${encodeURIComponent(json.id)}`,
      )
    } catch {
      setSubmitError("Error de red al crear la solicitud de auditoría")
    }
  }

  const busy = form.formState.isSubmitting

  return (
    <Card>
      <CardContent className="pt-6">
        <form id="form-auditar-url" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="url"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="form-auditar-url"
                    className="text-base font-semibold text-foreground"
                  >
                    URL a auditar
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-auditar-url"
                    type="url"
                    placeholder="https://www.inapi.cl/..."
                    autoComplete="url"
                    aria-invalid={fieldState.invalid}
                    disabled={busy}
                    className="h-10 w-full text-base"
                  />
                  {fieldState.invalid ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : null}
                </Field>
              )}
            />
            <Controller
              name="auditorNombre"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="form-auditar-nombre"
                    className="text-base font-semibold text-foreground"
                  >
                    Nombre de quien audita
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-auditar-nombre"
                    type="text"
                    placeholder="Ingrese su nombre y apellido"
                    autoComplete="name"
                    maxLength={120}
                    aria-invalid={fieldState.invalid}
                    disabled={busy}
                    className="h-10 w-full text-base"
                  />
                  {fieldState.invalid ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : null}
                </Field>
              )}
            />
          </FieldGroup>
          {submitError ? (
            <p className="text-destructive mt-3 text-sm" role="alert">
              {submitError}
            </p>
          ) : null}
        </form>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button type="submit" form="form-auditar-url" disabled={busy}>
          {busy ? "Enviando…" : "Continuar"}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={busy}
          onClick={() => {
            form.reset()
            setSubmitError(null)
          }}
        >
          Limpiar
        </Button>
        <Button asChild type="button" variant="outline">
          <Link
            href={historialHref()}
            aria-label="Ir al historial de auditorías por URL"
          >
            Historial de auditorías
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
