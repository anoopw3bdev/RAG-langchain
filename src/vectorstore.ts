import { QdrantVectorStore } from "@langchain/qdrant";
import { OllamaEmbeddings } from "@langchain/ollama";
import { config } from "./config.js";

export async function getVectorStore() {
  const embeddings = new OllamaEmbeddings({
    model: config.embeddingModel,
    baseUrl: config.ollamaBaseUrl,
  });

  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
      url: config.qdrantUrl,
      collectionName: config.qdrantCollection,
    }
  );

  return vectorStore;
}

export async function createVectorStore() {
  const embeddings = new OllamaEmbeddings({
    model: config.embeddingModel,
    baseUrl: config.ollamaBaseUrl,
  });

  return { embeddings };
}
