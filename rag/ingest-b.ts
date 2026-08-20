/**
 * ingest-b.ts — Ingesta Colección B: material de trabajo del repo
 *
 *   - data/checklist-criteria-lc-ptd.json (vigente v3.0)
 *   - data/checklist-criteria.json (histórico v2.1)
 *   - data/checklist-editorial-ptd-v2.json
 *   - docs/Checklist_Editorial_INAPI_v2_0_actualizado.extracted.md
 *   - docs/checklist-ptd-v2-mapa.md
 *   - data/claude-audits/tramites/ (recursivo, archivos .json)
 *   - data/claude-audits/sitioweb/ (recursivo, archivos .json)
 *   - docs/adr/*.md
 *
 * Uso: bun run ingest:b
 * Requiere: Chroma corriendo en http://localhost:8000
 *
 * IMPORTANTE: ejecutar ANTES de ingest:a (los datos del repo ya existen).
 * NUNCA incluir en esta colección: RUT de personas naturales, expedientes,
 * credenciales ni resultados del buscador de anterioridades (ver SECURITY.md).
 */

import { ChromaClient } from "chromadb";
import { pipeline } from "@xenova/transformers";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { glob } from "glob";

const CHROMA_URL = process.env.CHROMA_URL ?? "http://localhost:8000";
const COLLECTION_NAME = "coleccion_b";
const REPO_ROOT = join(import.meta.dir, "..");
const CHUNK_SIZE = 1200;
const CHUNK_OVERLAP = 150;
const MODEL = "Xenova/paraphrase-multilingual-MiniLM-L12-v2";

function chunkText(text: string, size: number, overlap: number): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    chunks.push(text.slice(start, start + size));
    start += size - overlap;
  }
  return chunks;
}

async function ingestFile(
  collection: Awaited<ReturnType<ChromaClient["createCollection"]>>,
  embedder: Awaited<ReturnType<typeof pipeline>>,
  filePath: string,
  tipo: string
): Promise<number> {
  const content = readFileSync(filePath, "utf-8");
  const chunks = chunkText(content, CHUNK_SIZE, CHUNK_OVERLAP);
  const relPath = filePath.replace(REPO_ROOT + "/", "");

  const ids: string[] = [];
  const embeddings: number[][] = [];
  const documents: string[] = [];
  const metadatas: Record<string, string>[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const output = await (embedder as unknown as (text: string, opts: object) => Promise<{ data: Float32Array }>)(
        chunks[i],
        { pooling: "mean", normalize: true }
      );
    ids.push(`${relPath.replace(/\//g, "_").replace(/\./g, "-")}_chunk_${i}`);
    embeddings.push(Array.from(output.data as Float32Array));
    documents.push(chunks[i]);
    metadatas.push({ fuente: relPath, tipo, chunk: String(i) });
  }

  await collection.add({ ids, embeddings, documents, metadatas });
  return chunks.length;
}

async function main() {
  console.log("=== Ingesta Colección B — material de trabajo del repo ===\n");

  // Conectar a Chroma
  console.log(`Conectando a Chroma en ${CHROMA_URL}...`);
  const client = new ChromaClient({ path: CHROMA_URL });

  // Eliminar colección anterior (re-ingesta limpia)
  try {
    await client.deleteCollection({ name: COLLECTION_NAME });
    console.log("Colección B anterior eliminada (re-ingesta limpia).");
  } catch {
    // no existía
  }

  const collection = await client.createCollection({ name: COLLECTION_NAME });
  console.log(`Colección '${COLLECTION_NAME}' creada.\n`);

  // Cargar modelo
  console.log(`Cargando modelo ${MODEL}...`);
  const embedder = await pipeline("feature-extraction", MODEL);
  console.log("Modelo cargado.\n");

  let totalChunks = 0;

  const repoDocs: Array<{ rel: string; tipo: string }> = [
    { rel: "data/checklist-criteria-lc-ptd.json", tipo: "checklist_lc_ptd" },
    { rel: "data/checklist-criteria.json", tipo: "checklist_historico_v21" },
    { rel: "data/checklist-editorial-ptd-v2.json", tipo: "checklist_ptd_hitos" },
    {
      rel: "docs/Checklist_Editorial_INAPI_v2_0_actualizado.extracted.md",
      tipo: "checklist_editorial_docx",
    },
    { rel: "docs/checklist-ptd-v2-mapa.md", tipo: "checklist_ptd_mapa" },
  ];

  for (const doc of repoDocs) {
    const full = join(REPO_ROOT, doc.rel);
    if (!existsSync(full)) {
      console.warn(`⚠ no encontrado: ${doc.rel}`);
      continue;
    }
    const n = await ingestFile(collection, embedder, full, doc.tipo);
    totalChunks += n;
    console.log(`✓ ${doc.rel} (${n} chunks)`);
  }

  // JSONs canónicos (Meta MEI + fecha)
  const auditJsons = await glob("data/claude-audits/{tramites,sitioweb}/**/*.json", {
    cwd: REPO_ROOT,
  });
  let auditCount = 0;
  for (const f of auditJsons) {
    if (f.endsWith(".export.json")) continue;
    const tipo =
      f.includes("/tramites/") || f.includes("\\tramites\\")
        ? "auditoria_tramites"
        : "auditoria_sitioweb";
    const n = await ingestFile(collection, embedder, join(REPO_ROOT, f), tipo);
    totalChunks += n;
    auditCount += 1;
    console.log(`✓ ${f} (${n} chunks)`);
  }

  // ADRs
  const adrs = await glob("docs/adr/*.md", { cwd: REPO_ROOT });
  for (const f of adrs) {
    const n = await ingestFile(collection, embedder, join(REPO_ROOT, f), "adr");
    totalChunks += n;
    console.log(`✓ ${f} (${n} chunks)`);
  }

  console.log(`\n=== Ingesta Colección B completada: ${totalChunks} chunks totales ===`);
  console.log(
    `Archivos: ${repoDocs.length} catálogos/docs + ${auditCount} auditorías + ${adrs.length} ADRs`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});