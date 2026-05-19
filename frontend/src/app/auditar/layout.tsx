import { SiteHeader } from "@/components/site-header"

export default function AuditarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6 md:py-10">
        {children}
      </div>
    </div>
  )
}
