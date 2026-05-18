"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { useRouter } from "next/navigation"

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
  auditUrlFormSchema,
  type AuditUrlFormValues,
} from "@/lib/schemas/url-audit"

export default function AuditarPage() {
  const router = useRouter()
  const form = useForm<AuditUrlFormValues>({
    resolver: zodResolver(auditUrlFormSchema),
    defaultValues: { url: "" },
  })

  function onSubmit(data: AuditUrlFormValues) {
    // Mock: siguiente paso será navegación o estado global
    console.log("URL válida:", data.url)
    router.push(`/auditar/captura?url=${encodeURIComponent(data.url)}`)
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Ingreso de URL</CardTitle>
          <CardDescription>
            Solo dominios permitidos por el PRD: inapi.cl y tramites.inapi.cl
            (incl. www).
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
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="gap-2">
          <Button type="submit" form="form-auditar-url">
            Continuar
          </Button>
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Limpiar
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}