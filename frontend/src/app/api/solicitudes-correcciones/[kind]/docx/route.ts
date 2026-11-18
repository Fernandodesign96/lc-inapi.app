import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"

import { NextResponse } from "next/server"

import { contentDispositionAttachment } from "@/lib/informe-piloto-filename"

/** Word consolidado proveedor|futuro (pregenerado). */
export const runtime = "nodejs"

const KINDS = new Set(["proveedor", "futuro"])

function repoRoot(): string {
  return process.env.LC_REPO_ROOT ?? join(process.cwd(), "..")
}

function docxPath(kind: string): string {
  return join(
    repoRoot(),
    "auditorias",
    "evidencias",
    "solicitudes-correcciones-proveedor",
    `${kind}.docx`,
  )
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ kind: string }> },
) {
  const { kind: raw } = await context.params
  const kind = decodeURIComponent(raw.trim().toLowerCase())
  if (!KINDS.has(kind)) {
    return NextResponse.json(
      { error: "kind debe ser proveedor o futuro" },
      { status: 404 },
    )
  }

  const path = docxPath(kind)
  if (!existsSync(path)) {
    return NextResponse.json(
      {
        error:
          "Word no generado. En el repo: bun run build:words-proveedor-futuro",
      },
      { status: 404 },
    )
  }

  const bytes = new Uint8Array(readFileSync(path))
  const filename =
    kind === "proveedor"
      ? "solicitudes-correcciones-proveedor-texto.docx"
      : "solicitudes-correcciones-futuro-desarrollo.docx"

  return new Response(bytes, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": contentDispositionAttachment(filename),
      "Cache-Control": "private, no-store",
    },
  })
}
