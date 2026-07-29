/**
 * Genera entrega MEI XLSX desde auditorías Clarity vigentes.
 *
 *   bun run export:mei-xlsx
 *   bun run export:mei-xlsx -- --hito=H03
 */
import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import { buildMeiWorkbookWithStats } from "../lib/mei-export/mei-xlsx-writer"

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, "../../data/exports")

function parseHitoArg(): string | undefined {
  const eq = process.argv.find((a) => a.startsWith("--hito="))
  if (eq) return eq.split("=")[1]
  const idx = process.argv.indexOf("--hito")
  if (idx >= 0 && process.argv[idx + 1]) return process.argv[idx + 1]
  return undefined
}

async function main() {
  const hito = parseHitoArg()
  const fecha = new Date().toISOString().slice(0, 10)
  const suffix = hito ? `_${hito}` : ""
  const filename = `entrega-mei-calidad-web_${fecha}${suffix}.xlsx`

  const { workbook, stats } = await buildMeiWorkbookWithStats(
    hito ? { hitoIds: [hito] } : {},
  )

  mkdirSync(outDir, { recursive: true })
  const buffer = await workbook.xlsx.writeBuffer()
  const outPath = join(outDir, filename)
  writeFileSync(outPath, Buffer.from(buffer))

  console.log(`OK: data/exports/${filename}`)
  console.log(`  URLs Clarity vigentes: ${stats.auditCount}`)
  console.log(`  Hitos en alcance: ${stats.hitoSheets}`)
  console.log(`  Filas detalle (URL): ${stats.totalRows}`)
  console.log(`  Pestañas: ${stats.sheetNames.join(", ")}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
