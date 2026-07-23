/**
 * ingest-b.ts — Ingesta Colección B: material de trabajo del repo
 *
 * Fuente: archivos versionados en el propio repo
 *   - data/checklist-criteria.json
 *   - data/claude-audits/**\/*.json  (piloto)
 *   - data/claude-audits/urls-clarity/**\/*.json
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
    const output = await embedder(chunks[i], { pooling: "mean", normalize: true });
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

  // 1. checklist-criteria.json
  const checklistPath = join(REPO_ROOT, "data", "checklist-criteria.json");
  if (existsSync(checklistPath)) {
    const n = await ingestFile(collection, embedder, checklistPath, "checklist");
    totalChunks += n;
    console.log(`✓ checklist-criteria.json (${n} chunks)`);
  }

  // 2. JSONs canónicos piloto (data/claude-audits/*.json)
  const pilotJsons = await glob("data/claude-audits/*.json", { cwd: REPO_ROOT });
  for (const f of pilotJsons) {
    if (f.includes("normalize-export")) continue; // excluir scripts
    const n = await ingestFile(collection, embedder, join(REPO_ROOT, f), "auditoria_piloto");
    totalChunks += n;
    console.log(`✓ ${f} (${n} chunks)`);
  }

  // 3. JSONs serie Clarity (data/claude-audits/urls-clarity/*.json)
  const clarityJsons = await glob("data/claude-audits/urls-clarity/*.json", { cwd: REPO_ROOT });
  for (const f of clarityJsons) {
    const n = await ingestFile(collection, embedder, join(REPO_ROOT, f), "auditoria_clarity");
    totalChunks += n;
    console.log(`✓ ${f} (${n} chunks)`);
  }

  // 4. ADRs
  const adrs = await glob("docs/adr/*.md", { cwd: REPO_ROOT });
  for (const f of adrs) {
    const n = await ingestFile(collection, embedder, join(REPO_ROOT, f), "adr");
    totalChunks += n;
    console.log(`✓ ${f} (${n} chunks)`);
  }

  console.log(`\n=== Ingesta Colección B completada: ${totalChunks} chunks totales ===`);
  console.log(`Archivos: 1 checklist + ${pilotJsons.length - 1} piloto + ${clarityJsons.length} clarity + ${adrs.length} ADRs`);
}

main().catch((e) => { console.error(e); process.exit(1); });