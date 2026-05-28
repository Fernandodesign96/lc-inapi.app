export function parsePorcentajeLcRef(ref: string): number | null {
  const raw = ref.trim()
  if (raw === "—" || raw === "–" || /^n\/a$/i.test(raw)) return null
  const cleaned = ref.replace("%", "").trim().replace(/\s/g, "").replace(",", ".")
  const n = parseFloat(cleaned)
  return Number.isFinite(n) ? n : null
}