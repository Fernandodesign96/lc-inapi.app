/**
 * Captura pantallazos anotados (rectángulo rojo + flecha S0N) por cada
 * sustitución con `evidencia_visual.ancla`. Actualiza `evidencia_visual.imagen`
 * en el JSON de la auditoría.
 *
 * Uso:
 *   bun run capture:evidencias-visuales -- --audit-id tramites-inapi-cl_2026-08-27
 *   bun run capture:evidencias-visuales -- --audit-id … --storage auditorias/.auth/tramites-session.json
 *   bun run capture:evidencias-visuales -- --audit-id … --only S02,S06,S11
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import type { Page, Locator } from "playwright"

import {
  evidenciasDir,
  resolveClaudeAuditJsonPath,
} from "../lib/claude-audit-file-path"
import {
  claudeAuditFileSchema,
  type ClaudeSustitucion,
  type EvidenciaVisual,
} from "../schemas/claude-audit-pilot"

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, "../..")
const OVERLAY_ID = "__lc_evidencia_overlay__"
const PAD = 28

type Args = {
  auditId: string
  storage?: string
  only?: Set<string>
}

function parseArgs(argv: string[]): Args {
  const get = (flag: string): string | undefined => {
    const i = argv.indexOf(flag)
    return i >= 0 ? argv[i + 1] : undefined
  }
  const auditId = get("--audit-id")
  if (!auditId) {
    console.error(
      "Uso: bun run capture:evidencias-visuales -- --audit-id <id> [--storage ruta.json] [--only S02,S06]",
    )
    process.exit(1)
  }
  const onlyRaw = get("--only")
  return {
    auditId,
    storage: get("--storage"),
    only: onlyRaw
      ? new Set(
          onlyRaw
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        )
      : undefined,
  }
}

function resolveLocator(
  page: Page,
  ancla: string,
  tipo: EvidenciaVisual["ancla_tipo"] = "text",
  opts?: { preferVisible?: boolean },
): Locator {
  const preferVisible = opts?.preferVisible !== false
  if (tipo === "css") {
    const loc = page.locator(ancla)
    return preferVisible ? loc.filter({ visible: true }).first() : loc.first()
  }
  if (tipo === "role") {
    // Formato: "button:Nombre" | "link:Nombre" | "heading:Nombre"
    const m = /^(\w+):(.+)$/.exec(ancla)
    if (!m) {
      throw new Error(
        `ancla_tipo=role requiere "rol:Nombre" (ej. button:Enviar); recibido: ${ancla}`,
      )
    }
    const role = m[1] as Parameters<Page["getByRole"]>[0]
    const loc = page.getByRole(role, { name: m[2], exact: false })
    return preferVisible ? loc.filter({ visible: true }).first() : loc.first()
  }
  const loc = page.getByText(ancla, { exact: false })
  return preferVisible ? loc.filter({ visible: true }).first() : loc.first()
}

async function runPasos(
  page: Page,
  pasos: NonNullable<EvidenciaVisual["pasos"]>,
): Promise<void> {
  for (const paso of pasos) {
    try {
      const loc = resolveLocator(page, paso.ancla, paso.ancla_tipo ?? "text", {
        preferVisible: true,
      })
      try {
        await loc.waitFor({ state: "visible", timeout: 5_000 })
        if (paso.action === "hover") await loc.hover({ force: true })
        else await loc.click({ force: true })
      } catch {
        const fallback = resolveLocator(
          page,
          paso.ancla,
          paso.ancla_tipo ?? "text",
          { preferVisible: false },
        )
        await fallback.waitFor({ state: "attached", timeout: 5_000 })
        if (paso.action === "hover") await fallback.hover({ force: true })
        else await fallback.click({ force: true })
      }
      await page.waitForTimeout(500)
    } catch (e) {
      // Paso opcional (p. ej. dismiss de modal ya cerrado): no tumba la captura
      const msg = e instanceof Error ? e.message : String(e)
      console.warn(`    (paso omitido: ${paso.action} «${paso.ancla}» — ${msg.split("\n")[0]})`)
    }
  }
}

async function clearOverlay(page: Page): Promise<void> {
  await page.evaluate((id) => {
    const doc = (
      globalThis as unknown as {
        document: { getElementById: (i: string) => { remove: () => void } | null }
      }
    ).document
    doc.getElementById(id)?.remove()
  }, OVERLAY_ID)
}

/**
 * Inyecta rectángulo + flecha + badge con la etiqueta de la línea (S0N).
 * Coordenadas en viewport (getBoundingClientRect).
 * El callback se serializa a Chromium: no referenciar helpers del módulo Node.
 */
async function injectOverlay(
  page: Page,
  box: { x: number; y: number; width: number; height: number },
  label: string,
): Promise<void> {
  await page.evaluate(
    ({ id, box: b, label: lab }) => {
      type El = {
        id: string
        style: { cssText: string }
        textContent: string | null
        appendChild: (c: unknown) => void
      }
      const document = (
        globalThis as unknown as {
          document: {
            getElementById: (i: string) => { remove: () => void } | null
            createElement: (tag: string) => El
            documentElement: { appendChild: (c: unknown) => void }
          }
        }
      ).document
      document.getElementById(id)?.remove()
      const root = document.createElement("div")
      root.id = id
      root.style.cssText =
        "position:fixed;inset:0;pointer-events:none;z-index:2147483647;"

      const rect = document.createElement("div")
      rect.style.cssText = [
        "position:fixed",
        `left:${b.x - 4}px`,
        `top:${b.y - 4}px`,
        `width:${b.width + 8}px`,
        `height:${b.height + 8}px`,
        "border:3px solid #E11D48",
        "border-radius:4px",
        "box-shadow:0 0 0 2px rgba(225,29,72,0.25)",
        "box-sizing:border-box",
      ].join(";")

      const cx = b.x + b.width / 2
      const cy = b.y
      const arrowTop = Math.max(8, cy - 56)
      const arrowLeft = Math.max(8, cx - 12)

      const arrow = document.createElement("div")
      arrow.style.cssText = [
        "position:fixed",
        `left:${arrowLeft}px`,
        `top:${arrowTop}px`,
        "width:0",
        "height:0",
        "border-left:12px solid transparent",
        "border-right:12px solid transparent",
        "border-top:22px solid #E11D48",
        "filter:drop-shadow(0 1px 2px rgba(0,0,0,0.35))",
      ].join(";")

      const badge = document.createElement("div")
      badge.textContent = lab
      badge.style.cssText = [
        "position:fixed",
        `left:${Math.max(8, cx - 28)}px`,
        `top:${Math.max(4, arrowTop - 28)}px`,
        "background:#E11D48",
        "color:#fff",
        "font:700 13px/1.2 system-ui,sans-serif",
        "padding:4px 8px",
        "border-radius:4px",
        "box-shadow:0 1px 3px rgba(0,0,0,0.35)",
        "white-space:nowrap",
      ].join(";")

      root.appendChild(rect)
      root.appendChild(arrow)
      root.appendChild(badge)
      document.documentElement.appendChild(root)
    },
    { id: OVERLAY_ID, box, label },
  )
}

async function captureOne(
  page: Page,
  sust: ClaudeSustitucion,
  outPng: string,
): Promise<void> {
  const ev = sust.evidencia_visual
  if (!ev?.ancla) throw new Error("sin ancla")

  await clearOverlay(page)
  if (ev.pasos?.length) await runPasos(page, ev.pasos)

  const loc = resolveLocator(page, ev.ancla, ev.ancla_tipo ?? "text")
  await loc.waitFor({ state: "visible", timeout: 20_000 })
  await loc.scrollIntoViewIfNeeded()
  await page.waitForTimeout(200)

  const box = await loc.boundingBox()
  if (!box) throw new Error("boundingBox null")

  await injectOverlay(page, box, sust.linea)
  await page.waitForTimeout(100)

  const clip = {
    x: Math.max(0, box.x - PAD),
    y: Math.max(0, box.y - PAD - 64),
    width: box.width + PAD * 2,
    height: box.height + PAD * 2 + 64,
  }
  // Ajuste a viewport
  const vp = page.viewportSize() ?? { width: 1280, height: 720 }
  clip.width = Math.min(clip.width, vp.width - clip.x)
  clip.height = Math.min(clip.height, vp.height - clip.y)

  mkdirSync(dirname(outPng), { recursive: true })
  await page.screenshot({ path: outPng, clip, type: "png" })
  await clearOverlay(page)
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2))
  const jsonPath = resolveClaudeAuditJsonPath(REPO_ROOT, args.auditId)
  if (!jsonPath) {
    console.error(`No se encontró JSON para ${args.auditId}`)
    process.exit(1)
  }

  const raw = JSON.parse(readFileSync(jsonPath, "utf8"))
  const file = claudeAuditFileSchema.parse(raw)
  const susts = (file.sustituciones ?? []).filter((s) => {
    if (!s.evidencia_visual?.ancla) return false
    if (args.only && !args.only.has(s.linea)) return false
    return true
  })

  if (susts.length === 0) {
    console.error(
      "Ninguna sustitución con evidencia_visual.ancla (revisa --only o el JSON).",
    )
    process.exit(1)
  }

  let chromium: typeof import("playwright").chromium
  try {
    ;({ chromium } = await import("playwright"))
  } catch {
    console.error("Falta playwright. bun add -d playwright && bun x playwright install chromium")
    process.exit(1)
  }

  const outDir = evidenciasDir(REPO_ROOT, args.auditId)
  mkdirSync(outDir, { recursive: true })

  const launchOpts = { headless: true }
  const browser = await chromium.launch(launchOpts)
  const contextOpts: Parameters<typeof browser.newContext>[0] = {
    viewport: { width: 1440, height: 900 },
    locale: "es-CL",
  }
  if (args.storage) {
    if (!existsSync(args.storage)) {
      console.error(`No existe storageState: ${args.storage}`)
      process.exit(1)
    }
    contextOpts.storageState = args.storage
  }
  const context = await browser.newContext(contextOpts)
  const page = await context.newPage()

  console.log(`Navegando: ${file.url}`)
  await page.goto(file.url, { waitUntil: "domcontentloaded", timeout: 60_000 })
  await page.waitForTimeout(800)

  // Cerrar posibles modales genéricos que tapen el contenido (OK / Aceptar)
  try {
    const ok = page.getByRole("button", { name: /^(OK|Aceptar|Entendido)$/i }).first()
    if (await ok.isVisible({ timeout: 1500 })) await ok.click()
  } catch {
    /* sin modal */
  }

  const failures: string[] = []
  let okCount = 0

  for (const sust of susts) {
    const relImg = join(
      "auditorias",
      "evidencias",
      args.auditId,
      `${sust.linea}.png`,
    )
    const absImg = join(REPO_ROOT, relImg)
    process.stdout.write(`  ${sust.linea}… `)
    try {
      // Re-navegar limpio entre capturas para no dejar menús abiertos
      if (okCount > 0 || failures.length > 0) {
        await page.goto(file.url, {
          waitUntil: "domcontentloaded",
          timeout: 60_000,
        })
        await page.waitForTimeout(500)
        try {
          const ok = page
            .getByRole("button", { name: /^(OK|Aceptar|Entendido)$/i })
            .first()
          if (await ok.isVisible({ timeout: 800 })) await ok.click()
        } catch {
          /* */
        }
      }
      await captureOne(page, sust, absImg)
      // Actualizar en el objeto parseado (mutamos raw sustituciones)
      const target = (raw.sustituciones as ClaudeSustitucion[]).find(
        (s) => s.linea === sust.linea,
      )
      if (target?.evidencia_visual) {
        target.evidencia_visual.imagen = relImg.replace(/\\/g, "/")
      }
      okCount += 1
      console.log(`OK → ${relative(REPO_ROOT, absImg)}`)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      failures.push(`${sust.linea}: ${msg}`)
      console.log(`FAIL (${msg})`)
    }
  }

  await browser.close()

  writeFileSync(jsonPath, JSON.stringify(raw, null, 2) + "\n", "utf8")
  console.log(`\nJSON actualizado: ${relative(REPO_ROOT, jsonPath)}`)
  console.log(`Capturas OK: ${okCount}/${susts.length}`)
  if (failures.length) {
    console.log("Fallos:")
    for (const f of failures) console.log(`  - ${f}`)
    process.exitCode = 1
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
