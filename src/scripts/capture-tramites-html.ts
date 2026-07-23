/**
 * Captura HTML de URLs de tramites.inapi.cl usando sesión Playwright (storageState).
 *
 * Requiere sesión previa en auditorias/.auth/tramites-session.json — ver
 * docs/fase-3-3-captura-auth-claveunica.md §4.2
 *
 * Uso:
 *   bun run capture:tramites-html -- --url "https://tramites.inapi.cl/..." \
 *     --slug "tramites-inapi-cl-ejemplo" --date "2026-07-23"
 *
 * Dependencia: playwright (bun x playwright install chromium)
 */

import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "../..");
const DEFAULT_STORAGE = join(REPO_ROOT, "auditorias/.auth/tramites-session.json");
const OUT_DIR = join(REPO_ROOT, "auditorias/htmls");

type Args = {
  url: string;
  slug: string;
  date: string;
  storage: string;
};

function parseArgs(argv: string[]): Args {
  const get = (flag: string): string | undefined => {
    const i = argv.indexOf(flag);
    return i >= 0 ? argv[i + 1] : undefined;
  };

  const url = get("--url");
  const slug = get("--slug");
  const date = get("--date");

  if (!url || !slug || !date) {
    console.error(
      "Uso: bun run capture:tramites-html -- --url <url> --slug <slug> --date YYYY-MM-DD [--storage ruta.json]",
    );
    process.exit(1);
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    console.error("Error: --date debe ser YYYY-MM-DD");
    process.exit(1);
  }

  return {
    url,
    slug,
    date,
    storage: get("--storage") ?? DEFAULT_STORAGE,
  };
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (!existsSync(args.storage)) {
    console.error(
      `No existe storageState: ${args.storage}\n` +
        "Crea la sesión con:\n" +
        "  bun x playwright codegen https://tramites.inapi.cl/Account/Login \\\n" +
        "    --save-storage=auditorias/.auth/tramites-session.json",
    );
    process.exit(1);
  }

  let chromium: typeof import("playwright").chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    console.error(
      "Falta el paquete playwright. En WSL ejecuta:\n" +
        "  bun add -d playwright && bun x playwright install chromium",
    );
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: args.storage });
  const page = await context.newPage();

  console.log(`Navegando: ${args.url}`);
  await page.goto(args.url, { waitUntil: "networkidle", timeout: 60_000 });

  const html = await page.content();
  const outFile = join(OUT_DIR, `${args.slug}_${args.date}.html`);

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(outFile, html, "utf8");

  await browser.close();

  const kb = (Buffer.byteLength(html, "utf8") / 1024).toFixed(1);
  console.log(`Guardado: ${outFile} (${kb} KB)`);
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
