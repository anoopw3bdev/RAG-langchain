import * as z from "zod";
import { tool } from "@langchain/core/tools";
import { QdrantVectorStore } from "@langchain/qdrant";
import { OllamaEmbeddings, Ollama } from "@langchain/ollama";
import { createAgent } from "langchain";

const retrieveSchema = z.object({ query: z.string() });

const embeddings = new OllamaEmbeddings({
  model: "mxbai-embed-large",
  baseUrl: process.env.OLLAMA_API_BASE_URL,
});

const llm = new Ollama({
  model: "llama3",
  temperature: 0,
  maxRetries: 2,
});

const vectorStore = await QdrantVectorStore.fromExistingCollection(
  embeddings,
  {
    url: process.env.QDRANT_URL,
    collectionName: process.env.QDRANT_COLLECTION_NAME,
  }
);

const retrieve = tool(
  async ({ query }) => {
    const retrievedDocs = await vectorStore.similaritySearch(
      query,
      2
    );
    const serialized = retrievedDocs
      .map(
        (doc) =>
          `Source: ${doc.metadata.source}\nContent: ${doc.pageContent}`
      )
      .join("\n");
    return [serialized, retrievedDocs];
  },
  {
    name: "retrieve",
    description: "Retrieve information related to a query.",
    schema: retrieveSchema,
    responseFormat: "content_and_artifact",
  }
);

const inputText = "Ollama is an AI company that ";

const completion = await llm.invoke(inputText);
