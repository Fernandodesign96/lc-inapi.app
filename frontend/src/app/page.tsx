import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 p-6 py-16 md:py-24">
        <Card>
          <CardHeader>
            <CardTitle>Auditoría de lenguaje claro — INAPI</CardTitle>
            <CardDescription>
              Flujo de demostración (mock): ingresa una URL permitida por el
              PRD y revisa el resultado con los criterios del checklist.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-muted-foreground">
              Esta interfaz usa los tokens del design system institucional
              (tipografía, color y contraste). El siguiente paso es ampliar la
              portada con atajos a URLs de ejemplo según el roadmap.
            </p>
            <Button asChild>
              <Link href="/auditar">Ir al ingreso de URL</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}