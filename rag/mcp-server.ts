/**
 * mcp-server.ts — Servidor MCP que expone el RAG como herramienta para Claude Code Pro
 *
 * Registro: claude mcp add rag-auditoria bun /ruta/absoluta/rag/mcp-server.ts
 *
 * Herramientas expuestas:
 *   - rag_search_normativa   → busca en Colección A (documentos normativos)
 *   - rag_search_precedentes → busca en Colección B (auditorías previas + ADRs)
 *
 * Requiere: Chroma corriendo en http://localhost:8000 con ambas colecciones ingresadas.
 */

import { ChromaClient } from "chromadb";
import { pipeline } from "@xenova/transformers";
import { createInterface } from "readline";

const CHROMA_URL = process.env.CHROMA_URL ?? "http://localhost:8000";
const MODEL = "Xenova/paraphrase-multilingual-MiniLM-L12-v2";
const N_RESULTS = 4;

// Inicialización lazy del embedder (se carga solo cuando se recibe la primera query)
let embedder: Awaited<ReturnType<typeof pipeline>> | null = null;
async function getEmbedder() {
  if (!embedder) embedder = await pipeline("feature-extraction", MODEL);
  return embedder;
}

async function search(collectionName: string, query: string): Promise<string> {
  const client = new ChromaClient({ path: CHROMA_URL });

  try {
    const collection = await client.getCollection({
        name: collectionName,
        embeddingFunction: { generate: async (_texts: string[]) => _texts.map(() => []) },
      });
    const emb = await getEmbedder();
    const output = await (emb as unknown as (text: string, opts: object) => Promise<{ data: Float32Array }>)(
        query,
        { pooling: "mean", normalize: true }
      );
      const embedding = Array.from(output.data);

    const results = await collection.query({
      queryEmbeddings: [embedding],
      nResults: N_RESULTS,
    });

    if (!results.documents[0] || results.documents[0].length === 0) {
      return `Sin resultados en ${collectionName} para: "${query}"`;
    }

    return results.documents[0]
      .map((doc, i) => {
        const meta = results.metadatas?.[0]?.[i] ?? {};
        const dist = results.distances?.[0]?.[i]?.toFixed(4) ?? "—";
        return `[Fuente: ${meta.fuente ?? "—"} | Distancia: ${dist}]\n${doc?.slice(0, 600) ?? ""}`;
      })
      .join("\n\n---\n\n");
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return `ERROR al consultar ${collectionName}: ${msg}. ¿Está Chroma corriendo en ${CHROMA_URL}?`;
  }
}

// Protocolo MCP via stdio (JSON-RPC)
const rl = createInterface({ input: process.stdin });

const TOOLS = [
  {
    name: "rag_search_normativa",
    description:
      "Busca en la Colección A del RAG: documentos normativos (Calidad Web 2.0, Meta MEI, Lenguaje Claro, UI Kit Gobierno). Usa para encontrar fundamentos normativos de un criterio del checklist INAPI.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: 'Ej: "D7 mayúsculas encabezados accesibilidad" o "B3 siglas primera vez"' },
      },
      required: ["query"],
    },
  },
  {
    name: "rag_search_precedentes",
    description:
      "Busca en la Colección B del RAG: auditorías previas (piloto + Clarity) y ADRs del repo. Usa para ver cómo se evaluó un criterio en URLs anteriores o consultar decisiones arquitectónicas.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: 'Ej: "F3 botones modal tramites.inapi.cl" o "G1 RUT institucional cumple"',
        },
      },
      required: ["query"],
    },
  },
];

function sendResponse(id: unknown, result: unknown) {
  process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id, result }) + "\n");
}

function sendError(id: unknown, code: number, message: string) {
  process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id, error: { code, message } }) + "\n");
}

rl.on("line", async (line) => {
  let req: { jsonrpc: string; id: unknown; method: string; params?: Record<string, unknown> };
  try {
    req = JSON.parse(line);
  } catch {
    return;
  }

  if (req.method === "initialize") {
    sendResponse(req.id, {
      protocolVersion: "2024-11-05",
      capabilities: { tools: {} },
      serverInfo: { name: "rag-auditoria", version: "1.0.0" },
    });
    return;
  }

  if (req.method === "tools/list") {
    sendResponse(req.id, { tools: TOOLS });
    return;
  }

  if (req.method === "tools/call") {
    const { name, arguments: args } = (req.params ?? {}) as { name: string; arguments: Record<string, string> };
    const query = args?.query ?? "";

    if (name === "rag_search_normativa") {
      const result = await search("coleccion_a", query);
      sendResponse(req.id, { content: [{ type: "text", text: result }] });
      return;
    }

    if (name === "rag_search_precedentes") {
      const result = await search("coleccion_b", query);
      sendResponse(req.id, { content: [{ type: "text", text: result }] });
      return;
    }

    sendError(req.id, -32601, `Herramienta desconocida: ${name}`);
    return;
  }

  sendError(req.id, -32601, `Método no soportado: ${req.method}`);
});