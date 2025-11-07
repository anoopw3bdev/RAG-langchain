import "dotenv/config";

export const config = {
  qdrantUrl: process.env.QDRANT_URL || "http://localhost:6333",
  qdrantCollection: process.env.QDRANT_COLLECTION_NAME || "documents",
  ollamaBaseUrl:
    process.env.OLLAMA_API_BASE_URL || "http://localhost:11434",
  embeddingModel: "nomic-embed-text",
  chatModel: "llama3",
  chunkSize: 1000,
  chunkOverlap: 200,
};
