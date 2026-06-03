/** Ids con JSON en data/claude-audits/ (sin .export.json). */
export const CLAUDE_AUDIT_LAUNCHES = [
    {
      id: "www-inapi-cl_2026-06-02",
      url: "https://www.inapi.cl/",
      label: "Home INAPI (piloto)",
      tipoPagina: "sitioweb" as const,
    },
  ] as const
  
  export type ClaudeAuditLaunchRow = (typeof CLAUDE_AUDIT_LAUNCHES)[number]
  
  export const CLAUDE_AUDIT_ID_SET = new Set<string>(
    CLAUDE_AUDIT_LAUNCHES.map((row) => row.id),
  )
  
  export function claudeAuditIdForUrl(url: string): string | null {
    const normalized = url.replace(/\/$/, "")
    const row = CLAUDE_AUDIT_LAUNCHES.find(
      (r) => r.url.replace(/\/$/, "") === normalized,
    )
    return row?.id ?? null
  }