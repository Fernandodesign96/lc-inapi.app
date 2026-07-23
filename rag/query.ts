/**
 * query.ts — Prueba y validación de las colecciones RAG
 *
 * Uso: bun run query "texto de búsqueda" [coleccion_a|coleccion_b] [n_resultados]
 * Ejemplos:
 *   bun run query "criterio D7 encabezados mayúsculas"
 *   bun run query "PCT siglas definición primera vez" coleccion_a 3
 *   bun run query "tramites.inapi.cl F3 botones modal" coleccion_b 5
 */

import { ChromaClient } from "chromadb";
import { pipeline } from "@xenova/transformers";

const CHROMA_URL = process.env.CHROMA_URL ?? "http://localhost:8000";
const MODEL = "Xenova/paraphrase-multilingual-MiniLM-L12-v2";

async function main() {
  const args = process.argv.slice(2);
  const queryText = args[0];
  const collectionName = args[1] ?? "coleccion_b";
  const nResults = parseInt(args[2] ?? "3", 10);

  if (!queryText) {
    console.error('Uso: bun run query "texto de búsqueda" [coleccion_a|coleccion_b] [n_resultados]');
    process.exit(1);
  }

  console.log(`\nQuery: "${queryText}"`);
  console.log(`Colección: ${collectionName} | Resultados: ${nResults}\n`);

  const client = new ChromaClient({ path: CHROMA_URL });

  // Verificar que la colección existe
  const collections = await client.listCollections();
  const exists = collections.some((c) => c === collectionName);
  if (!exists) {
    console.error(`Colecciones disponibles: ${collections.join(", ") || "(ninguna)"}`);
    console.error(`Ejecuta primero: bun run ingest:b  (o ingest:a para coleccion_a)`);
    process.exit(1);
  }

  const collection = await client.getCollection({
    name: collectionName,
    embeddingFunction: { generate: async (texts: string[]) => texts.map(() => []) },
  });
  
  // Generar embedding de la query
  const embedder = await pipeline("feature-extraction", MODEL);
  const output = await embedder(queryText, { pooling: "mean", normalize: true });
  const queryEmbedding = Array.from(output.data as Float32Array);

  // Buscar
  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults,
  });

  if (!results.documents[0] || results.documents[0].length === 0) {
    console.log("Sin resultados.");
    return;
  }

  console.log("─".repeat(60));
  for (let i = 0; i < results.documents[0].length; i++) {
    const doc = results.documents[0][i];
    const meta = results.metadatas?.[0]?.[i] ?? {};
    const distance = results.distances?.[0]?.[i];

    console.log(`[${i + 1}] Fuente: ${meta.fuente ?? "—"}  |  Tipo: ${meta.tipo ?? "—"}  |  Distancia: ${distance?.toFixed(4) ?? "—"}`);
    console.log(`    ${doc?.slice(0, 300).replace(/\n/g, " ")}…`);
    console.log("─".repeat(60));
  }
}

main().catch((e) => { console.error(e); process.exit(1); });