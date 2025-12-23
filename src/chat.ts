import "dotenv/config";

import "./instrumentation.js";

import { ChatOllama } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { CallbackHandler } from "@langfuse/langchain";
import { getVectorStore } from "./vectorstore.js";
import { config } from "./config.js";
import * as readline from "readline";

const langfuseHandler = new CallbackHandler();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function chat() {
  console.log("╔══════════════════════════════════════════╗");
  console.log("║   RAG Question Answering System          ║");
  console.log("╚══════════════════════════════════════════╝\n");

  const vectorStore = await getVectorStore();
  const retriever = vectorStore.asRetriever({ k: 3 });

  const model = new ChatOllama({
    model: config.chatModel,
    baseUrl: config.ollamaBaseUrl,
    temperature: 0,
    keepAlive: "5m",
  });

  const prompt = ChatPromptTemplate.fromTemplate(`
You are a helpful assistant that answers questions based on the provided context.

Context:
{context}

Question: {question}

Instructions:
- Answer the question based only on the context provided above
- If the answer is not in the context, say "I don't have enough information to answer that question"
- Be concise and clear in your response
- Cite specific parts of the context when possible

Answer:`);

  const chain = prompt.pipe(model).pipe(new StringOutputParser());

  const askQuestion = () => {
    rl.question(
      "\n💬 Your question (or 'exit' to quit): ",
      async (input) => {
        if (input.toLowerCase() === "exit") {
          console.log("👋 Goodbye!");
          rl.close();
          process.exit(0);
        }

        if (!input.trim()) {
          askQuestion();
          return;
        }

        try {
          console.log("\n🔍 Retrieving relevant documents...");

          const relevantDocs = await retriever.invoke(input, {
            callbacks: [langfuseHandler],
          });

          console.log(
            `📚 Found ${relevantDocs.length} relevant document(s)\n`
          );

          const context = relevantDocs
            .map((doc) => doc.pageContent)
            .join("\n\n---\n\n");

          console.log("🤖 Generating answer...\n");

          const response = await chain.invoke(
            {
              context,
              question: input,
            },
            {
              callbacks: [langfuseHandler],
            }
          );

          console.log("💡 Answer:", response);
        } catch (error) {
          console.error("❌ Error:", error);
        }

        askQuestion();
      }
    );
  };

  askQuestion();
}

chat();
