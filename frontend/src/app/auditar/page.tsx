"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
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
import { EDITORIAL_DEMO_ROUTES } from "@/lib/editorial-demo-routes"
import {
  auditUrlFormSchema,
  type AuditUrlFormValues,
} from "@/lib/schemas/url-audit"
import { cn } from "@/lib/utils"

const URL_EJEMPLO_IMPORT_RESULTADO = EDITORIAL_DEMO_ROUTES[0].url

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
          <CardTitle className="text-base">
            Prioridades demostrativas LC (mock y fixture)
          </CardTitle>
          <CardDescription>
            Las tres URLs canónicas del inventario Clarity: puede abrir el
            resultado con datos **generados en cliente por URL** (mock) o con el
            **JSON versionado** del repositorio (misma URL, distinta fuente de
            datos).
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="atajos-editoriales">
              <AccordionTrigger>
                Tres perfiles — navegación al resultado
              </AccordionTrigger>
              <AccordionContent>
                <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-3 sm:items-stretch">
                  {EDITORIAL_DEMO_ROUTES.map((item) => (
                    <li
                      key={item.url}
                      className={cn(
                        "flex min-h-0 flex-col rounded-xl border-2 bg-card p-4 text-card-foreground shadow-sm sm:min-h-[11rem]",
                      )}
                      style={{ borderColor: item.bordeHex }}
                    >
                      <div className="text-xs font-normal leading-snug text-muted-foreground">
                        {item.perfilLabel}
                      </div>
                      <p className="mt-2 text-balance text-sm font-semibold leading-snug">
                        {item.label}
                      </p>
                      <div className="mt-auto flex flex-col gap-2 pt-4">
                        <Button
                          type="button"
                          className="w-full"
                          onClick={() =>
                            router.push(
                              `/auditar/procesando?url=${encodeURIComponent(item.url)}`,
                            )
                          }
                        >
                          Resultado (mock por URL)
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() =>
                            router.push(
                              `/auditar/procesando?url=${encodeURIComponent(item.url)}&fixture=${encodeURIComponent(item.fixtureId)}`,
                            )
                          }
                        >
                          Resultado (fixture JSON)
                        </Button>
                      </div>
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
            Importar auditoría (JSON en repo)
          </CardTitle>
          <CardDescription>
            Pegue o cargue un archivo JSON en la pantalla de resultado; debe
            cumplir{" "}
            <code className="rounded bg-muted px-1 text-xs">
              strictAuditRecordSchema
            </code>
            . Los archivos canónicos viven en{" "}
            <code className="rounded bg-muted px-1 text-xs">
              data/audit-fixtures/
            </code>
            .
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button type="button" variant="secondary" asChild>
            <Link
              href={`/auditar/resultado?url=${encodeURIComponent(URL_EJEMPLO_IMPORT_RESULTADO)}`}
            >
              Ir a resultado para importar JSON
            </Link>
          </Button>
        </CardFooter>
      </Card>

      <AuditarInventorySections />
    </div>
  )
}
