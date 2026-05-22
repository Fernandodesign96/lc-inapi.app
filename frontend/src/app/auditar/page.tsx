"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { useRouter } from "next/navigation"

import { AuditarInventorySections } from "@/components/auditar-inventory-sections"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
import { EDITORIAL_AUDIT_SHORTCUTS } from "@/lib/audit-shortcuts"
import { AUDIT_FIXTURE_LAUNCHES } from "@/lib/audit-fixtures-launch"
import {
  auditUrlFormSchema,
  type AuditUrlFormValues,
} from "@/lib/schemas/url-audit"
import { cn } from "@/lib/utils"

export default function AuditarPage() {
  const router = useRouter()
  const form = useForm<AuditUrlFormValues>({
    resolver: zodResolver(auditUrlFormSchema),
    defaultValues: { url: "" },
  })

  function onSubmit(data: AuditUrlFormValues) {
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

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base">Atajos editoriales (mock)</CardTitle>
          <CardDescription>
            Prioridades demostrativas: navegación directa al resultado con la URL
            canónica indicada en el inventario Clarity.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="atajos-editoriales">
              <AccordionTrigger>
                Tarjetas por perfil LC (mock)
              </AccordionTrigger>
              <AccordionContent>
                <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-3 sm:items-stretch">
                  {EDITORIAL_AUDIT_SHORTCUTS.map((item) => (
                    <li key={item.url} className="min-h-0 sm:flex sm:flex-col">
                      <button
                        type="button"
                        onClick={() =>
                          router.push(
                            `/auditar/procesando?url=${encodeURIComponent(item.url)}`,
                          )
                        }
                        className={cn(
                          "flex h-full min-h-[6rem] w-full flex-col rounded-xl border-2 border-transparent bg-[#FFFFFF] p-4 text-left shadow-none transition-colors",
                          "hover:brightness-[0.99]",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        )}
                        style={{ borderColor: item.bordeHex }}
                      >
                        <div className="flex min-h-[1.5rem] shrink-0 flex-col justify-start text-xs font-normal leading-snug text-muted-foreground">
                          {item.perfilLabel}
                        </div>
                        <p className="mt-2 flex flex-1 flex-col justify-start text-balance font-semibold text-sm leading-snug text-foreground">
                          {item.label}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base">
            Fixtures de auditoría (JSON en repo)
          </CardTitle>
          <CardDescription>
            Abre el resultado con datos de{" "}
            <code className="rounded bg-muted px-1 text-xs">
              data/audit-fixtures/
            </code>{" "}
            vía API mock; misma pantalla intermedia que los atajos.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="m-0 flex list-none flex-col gap-2 p-0 sm:flex-row sm:flex-wrap">
            {AUDIT_FIXTURE_LAUNCHES.map((row) => (
              <li key={row.id}>
                <Button
                  type="button"
                  variant="outline"
                  className="h-auto w-full justify-start whitespace-normal text-left sm:w-auto"
                  onClick={() =>
                    router.push(
                      `/auditar/procesando?url=${encodeURIComponent(row.url)}&fixture=${encodeURIComponent(row.id)}`,
                    )
                  }
                >
                  {row.label}
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <AuditarInventorySections />
    </div>
  )
}