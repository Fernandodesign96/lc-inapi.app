"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Controller, useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
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
      <CardHeader>
        <CardTitle>Ingreso de URL</CardTitle>
        <CardDescription>
          Solo dominios permitidos por el PRD: inapi.cl y tramites.inapi.cl
          (incl. www). Consulta informes previos con «Historial de
          auditorías».
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-auditar-url" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="url"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-auditar-url">
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
                  />
                  <FieldDescription>
                    Debe ser una URL http(s) de los sitios institucionales
                    indicados en el PRD.
                  </FieldDescription>
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
                  <FieldLabel htmlFor="form-auditar-nombre">
                    Nombre de quien audita
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-auditar-nombre"
                    type="text"
                    placeholder="Ej. Bernarda Pérez"
                    autoComplete="name"
                    maxLength={120}
                    aria-invalid={fieldState.invalid}
                    disabled={busy}
                  />
                  <FieldDescription>
                    Texto libre para el historial (sin inicio de sesión).
                  </FieldDescription>
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
