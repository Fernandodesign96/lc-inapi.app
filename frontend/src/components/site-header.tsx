"use client"

import Link from "next/link"

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
        <div className="flex min-h-11 min-w-0 flex-1 items-center justify-end gap-2" />
      </div>
    </header>
  )
}