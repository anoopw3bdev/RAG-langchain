# 🧠 LangChain RAG Prototype

This project is a Retrieval-Augmented Generation (RAG) prototype built using LangChain and Ollama. It demonstrates how to ingest data from documents, store embeddings in a Qdrant vector database, and perform semantic search and chat over that data using local or hosted LLMs.

## 🚀 Features

- 📄 **Document Ingestion** — Parse and split documents into chunks using LangChain text splitters
- 🔍 **Embedding Generation** — Create vector embeddings from document chunks
- 🧠 **Vector Database Integration** — Store and retrieve embeddings using Qdrant
- 💬 **RAG Querying** — Retrieve relevant context and generate LLM responses grounded in the ingested data
- 🧩 **Environment Configuration** — Easily configurable through `.env` file

## 🧰 Tech Stack

- **Language:** TypeScript
- **Runtime:** Node.js
- **Package Manager:** pnpm
- **Core Libraries:**
  - `langchain` / `@langchain/core` / `@langchain/community`
  - `@langchain/ollama` — for connecting to Ollama models
  - `@langchain/qdrant` — for vector storage
  - `pdf-parse` — for reading PDF files
  - `zod` — for validation
  - `dotenv` — for managing environment variables

## 📦 Installation

1. **Clone the repository:**

```bash
   git clone https://github.com/yourusername/langchain-rag.git
   cd langchain-rag
```

2. **Install dependencies:**

```bash
   pnpm install
```

3. **Set up environment variables:**

   Create a `.env` file in the project root and add your configuration:

```properties
   QDRANT_URL=http://localhost:6333
   QDRANT_API_KEY=your_api_key
   OLLAMA_MODEL=llama3
```

## ⚙️ Scripts

| Command           | Description                                       |
| ----------------- | ------------------------------------------------- |
| `pnpm run ingest` | Ingests and embeds documents into Qdrant          |
| `pnpm run query`  | Queries the vector store for relevant information |
| `pnpm run chat`   | Runs an interactive RAG chat session              |
| `pnpm test`       | Placeholder for future tests                      |
