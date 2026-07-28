import Link from "next/link"

import { AuditarClaudePilotSection } from "@/components/auditar-claude-pilot-section"
import { AuditarInventorySections } from "@/components/auditar-inventory-sections"
import { AuditarUrlFormCard } from "@/components/auditar-url-form-card"
import { MeiCalidadWebTeaser } from "@/components/mei-calidad-web/mei-calidad-web-teaser"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const URL_EJEMPLO_IMPORT_RESULTADO = "https://tramites.inapi.cl/Notificaciones"

export default function AuditarPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <AuditarUrlFormCard />
      <AuditarClaudePilotSection />
      <MeiCalidadWebTeaser />
      <AuditarInventorySections />
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
    </div>
  )
}
