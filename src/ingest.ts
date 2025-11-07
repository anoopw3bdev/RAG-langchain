import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { QdrantVectorStore } from "@langchain/qdrant";
import { createVectorStore } from "./vectorstore.js";
import { config } from "./config.js";

async function ingestDocuments() {
  try {
    console.log("📄 Loading PDF documents...");

    const pdfPath = "./documents/document.pdf";
    const loader = new PDFLoader(pdfPath);
    const docs = await loader.load();

    console.log(`✅ Loaded ${docs.length} page(s)`);

    console.log("✂️  Splitting documents into chunks...");
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: config.chunkSize,
      chunkOverlap: config.chunkOverlap,
    });

    const splits = await splitter.splitDocuments(docs);

    console.log("🤖 Creating embeddings and storing in Qdrant...");
    const { embeddings } = await createVectorStore();

    await QdrantVectorStore.fromDocuments(splits, embeddings, {
      url: config.qdrantUrl,
      collectionName: config.qdrantCollection,
    });

    console.log("✅ Documents successfully ingested!");
    console.log(`📊 Collection: ${config.qdrantCollection}`);
    console.log(`📍 Qdrant URL: ${config.qdrantUrl}`);
  } catch (error) {
    console.error("❌ Error during ingestion:", error);
    process.exit(1);
  }
}

ingestDocuments();
