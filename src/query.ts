import { getVectorStore } from "./vectorstore.js";

async function query(question: string, topK: number = 3) {
  try {
    console.log(`\n🔍 Searching for: "${question}"\n`);

    const vectorStore = await getVectorStore();
    const results = await vectorStore.similaritySearchWithScore(
      question,
      topK
    );

    if (results.length === 0) {
      console.log("❌ No results found.");
      return [];
    }

    console.log(`📊 Top ${results.length} results:\n`);

    results.forEach(([doc, score], index) => {
      console.log(`${index + 1}. Score: ${score.toFixed(4)}`);

      if (doc.metadata && Object.keys(doc.metadata).length > 0) {
        console.log(
          "   Metadata:",
          JSON.stringify(doc.metadata, null, 2)
        );
      }

      const content = doc.pageContent.trim();
      const maxLength = 300;
      const displayContent =
        content.length > maxLength
          ? content.substring(0, maxLength) + "..."
          : content;

      console.log("   Content:", displayContent);
      console.log("   " + "─".repeat(80) + "\n");
    });

    return results;
  } catch (error) {
    console.error("❌ Error during query:", error);
    process.exit(1);
  }
}

const question = process.argv[2] || "What is this document about?";
const topK = parseInt(process.argv[3]) || 3;

query(question, topK);
