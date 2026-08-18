import { AuditarClaudePilotSection } from "@/components/auditar-claude-pilot-section"
import { AuditarInventorySections } from "@/components/auditar-inventory-sections"
import { AuditarUrlFormCard } from "@/components/auditar-url-form-card"
import { MeiCalidadWebTeaser } from "@/components/mei-calidad-web/mei-calidad-web-teaser"

export default function AuditarPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <AuditarUrlFormCard />
      <AuditarClaudePilotSection />
      <AuditarInventorySections />
      <MeiCalidadWebTeaser />
    </div>
  )
}
