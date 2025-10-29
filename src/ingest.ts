import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { QdrantVectorStore } from "@langchain/qdrant";
import { OllamaEmbeddings } from "@langchain/ollama";
import "dotenv/config";

async function ingestPDF() {
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

    const pdfPath = "./skyline.pdf";

    const pdfLoader = new PDFLoader(pdfPath);
    const docs = await pdfLoader.load();

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const allSplits = await splitter.splitDocuments(docs);

    const embeddings = new OllamaEmbeddings({
      model: "mxbai-embed-large",
      baseUrl: process.env.OLLAMA_API_BASE_URL,
    });

    const vectorStore = await QdrantVectorStore.fromDocuments(
      allSplits,
      embeddings,
      {
        url: process.env.QDRANT_URL,
        collectionName: process.env.QDRANT_COLLECTION_NAME,
      }
    );

    await vectorStore.addDocuments(allSplits);
  } catch (error) {
    console.error("❌ Error during ingestion:", error);
    process.exit(1);
  }
}

ingestPDF();
