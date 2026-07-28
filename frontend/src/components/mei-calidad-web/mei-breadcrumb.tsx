import Link from "next/link"
import { ArrowLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function MeiBreadcrumb({
  items,
}: {
  items: Array<{ label: string; href?: string }>
}) {
  return (
    <nav
      aria-label="Breadcrumb MEI"
      className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground"
    >
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1">
          {index > 0 ? <ChevronRight className="size-3.5 shrink-0" /> : null}
          {item.href ? (
            <Link href={item.href} className="hover:text-foreground">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}

export function MeiBackLink({ href, label }: { href: string; label: string }) {
  return (
    <Button asChild variant="ghost" size="sm" className="-ms-2 w-fit">
      <Link href={href}>
        <ArrowLeft />
        {label}
      </Link>
    </Button>
  )
}
