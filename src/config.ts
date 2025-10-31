import "dotenv/config";

export const config = {
  qdrantUrl: process.env.QDRANT_URL || "http://localhost:6333",
  qdrantCollection: process.env.QDRANT_COLLECTION_NAME || "documents",
  ollamaBaseUrl:
    process.env.OLLAMA_API_BASE_URL || "http://localhost:11434",
  embeddingModel: "mxbai-embed-large",
  chatModel: "llama3.2",
  chunkSize: 1500,
  chunkOverlap: 300,
};
