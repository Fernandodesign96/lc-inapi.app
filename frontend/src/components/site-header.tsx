"use client"

import Link from "next/link"
import { Settings, User } from "lucide-react"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="font-heading text-lg font-semibold tracking-tight text-primary"
        >
          INAPI
        </Link>
        <div className="flex min-h-11 min-w-0 flex-1 items-center justify-end gap-2">
          <ThemeToggle />

          <Dialog>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Cuenta de usuario (demostración)"
              >
                <User className="size-4" aria-hidden />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cuenta de usuario</DialogTitle>
                <DialogDescription>
                  Definición pendiente: tipos de usuario, permisibilidad en el
                  sistema y descripción de qué hace cada rol y su importancia.
                  Este cuadro es solo una demostración de interfaz; en el MVP
                  mock no hay inicio de sesión ni datos personales.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cerrar
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Configuración (demostración)"
              >
                <Settings className="size-4" aria-hidden />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Configuración</DialogTitle>
                <DialogDescription>
                  Definición pendiente: qué opciones serán configurables, su
                  alcance y su relación con el flujo de auditoría. Este cuadro
                  es solo una demostración de interfaz.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cerrar
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  )
}