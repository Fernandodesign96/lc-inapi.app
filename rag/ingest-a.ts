/**
 * ingest-a.ts — Ingesta Colección A: documentos normativos (PDFs)
 *
 * Fuente: carpeta ../documentos/ (en .gitignore; solo local y servidor TI)
 * PDFs esperados:
 *   - calidad-web-2.0.pdf
 *   - meta-mei.pdf
 *   - lenguaje-claro-recomendaciones.pdf
 *   - ui-kit-gobierno-3.0.1.pdf
 *   - instrumento-evaluacion-sitios-web.pdf
 *   - instrumento-evaluacion-servicios-digitales-transaccionales.pdf
 *
 * Uso: bun run ingest:a
 * Requiere: Chroma corriendo en http://localhost:8000
 *           PDFs en ../documentos/
 */

import { ChromaClient } from "chromadb";
import { pipeline } from "@xenova/transformers";
import { readFileSync, existsSync, readdirSync } from "fs";
import { join, basename } from "path";
import pdf from "pdf-parse";

const CHROMA_URL = process.env.CHROMA_URL ?? "http://localhost:8000";
const COLLECTION_NAME = "coleccion_a";
const DOCS_DIR = join(import.meta.dir, "..", "documentos");
const CHUNK_SIZE = 800;  // caracteres por chunk
const CHUNK_OVERLAP = 100;
const MODEL = "Xenova/paraphrase-multilingual-MiniLM-L12-v2";

// PDFs normativos esperados
const EXPECTED_PDFS = [
  "calidad-web-2.0.pdf",
  "meta-mei.pdf",
  "lenguaje-claro-recomendaciones.pdf",
  "ui-kit-gobierno-3.0.1.pdf",
  "instrumento-evaluacion-sitios-web.pdf",
  "instrumento-evaluacion-servicios-digitales-transaccionales.pdf",
];

function chunkText(text: string, size: number, overlap: number): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    chunks.push(text.slice(start, start + size));
    start += size - overlap;
  }
  return chunks;
}

async function main() {
  console.log("=== Ingesta Colección A — documentos normativos ===\n");

  // Verificar directorio documentos/
  if (!existsSync(DOCS_DIR)) {
    console.error(`ERROR: carpeta documentos/ no encontrada en ${DOCS_DIR}`);
    console.error("Crea la carpeta y coloca los PDFs normativos antes de ingestar.");
    process.exit(1);
  }

  const availablePdfs = readdirSync(DOCS_DIR).filter((f) => f.endsWith(".pdf"));
  console.log(`PDFs encontrados en documentos/: ${availablePdfs.join(", ") || "(ninguno)"}`);

  const missingPdfs = EXPECTED_PDFS.filter((p) => !availablePdfs.includes(p));
  if (missingPdfs.length > 0) {
    console.warn(`ADVERTENCIA: PDFs esperados no encontrados: ${missingPdfs.join(", ")}`);
    console.warn("Se ingestan solo los PDFs disponibles.\n");
  }

  const pdfsToIngest = availablePdfs.filter((f) => EXPECTED_PDFS.includes(f));
  if (pdfsToIngest.length === 0) {
    console.error("No hay PDFs normativos reconocidos para ingestar. Verifica los nombres de archivo.");
    process.exit(1);
  }

  // Conectar a Chroma
  console.log(`Conectando a Chroma en ${CHROMA_URL}...`);
  const client = new ChromaClient({ path: CHROMA_URL });

  // Eliminar colección anterior si existe (re-ingesta limpia)
  try {
    await client.deleteCollection({ name: COLLECTION_NAME });
    console.log("Colección A anterior eliminada (re-ingesta limpia).");
  } catch {
    // no existía
  }

  const collection = await client.createCollection({ name: COLLECTION_NAME });
  console.log(`Colección '${COLLECTION_NAME}' creada.\n`);

  // Cargar modelo de embeddings
  console.log(`Cargando modelo ${MODEL} (descarga única de ~400 MB si es la primera vez)...`);
  const embedder = await pipeline("feature-extraction", MODEL);
  console.log("Modelo cargado.\n");

  let totalChunks = 0;

  for (const pdfFile of pdfsToIngest) {
    const pdfPath = join(DOCS_DIR, pdfFile);
    console.log(`Procesando ${pdfFile}...`);

    const buffer = readFileSync(pdfPath);
    const { text } = await pdf(buffer);
    const chunks = chunkText(text, CHUNK_SIZE, CHUNK_OVERLAP);

    console.log(`  ${chunks.length} chunks generados.`);

    const ids: string[] = [];
    const embeddings: number[][] = [];
    const documents: string[] = [];
    const metadatas: Record<string, string>[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const output = await (embedder as unknown as (text: string, opts: object) => Promise<{ data: Float32Array }>)(
        chunk,
        { pooling: "mean", normalize: true }
      );
      const embedding = Array.from(output.data);

      ids.push(`${basename(pdfFile, ".pdf")}_chunk_${i}`);
      embeddings.push(embedding);
      documents.push(chunk);
      metadatas.push({ fuente: pdfFile, chunk: String(i) });
    }

    await collection.add({ ids, embeddings, documents, metadatas });
    totalChunks += chunks.length;
    console.log(`  ✓ ${pdfFile} ingresado (${chunks.length} chunks).\n`);
  }

  console.log(`\n=== Ingesta Colección A completada: ${totalChunks} chunks totales ===`);
  console.log(`PDFs ingresados: ${pdfsToIngest.join(", ")}`);
}

main().catch((e) => { console.error(e); process.exit(1); });