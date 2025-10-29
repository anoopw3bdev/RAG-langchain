import { QdrantVectorStore } from "@langchain/qdrant";
import { OllamaEmbeddings } from "@langchain/ollama";
import "dotenv/config";

async function queryDocs() {
  try {
    if (
      !process.env.QDRANT_URL ||
      !process.env.QDRANT_COLLECTION_NAME ||
      !process.env.OLLAMA_API_BASE_URL
    ) {
      throw new Error(
        "Missing required environment variables. Check your .env file."
      );
    }

    const embeddings = new OllamaEmbeddings({
      model: "mxbai-embed-large",
      baseUrl: process.env.OLLAMA_API_BASE_URL,
    });

    const vectorStore =
      await QdrantVectorStore.fromExistingCollection(embeddings, {
        url: process.env.QDRANT_URL,
        collectionName: process.env.QDRANT_COLLECTION_NAME,
      });

    const query = "how to launch an instance";
    const results = await vectorStore.similaritySearchWithScore(
      query,
      10
    );

    console.log("🔍 Top results:");
    for (const [doc, score] of results) {
      console.log("Score:", score);
      console.log("Content:", doc.pageContent);
      console.log("---");
    }
  } catch (error) {
    console.error("❌ Error during query:", error);
    process.exit(1);
  }
}

queryDocs();
