import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const pdfPath = "./skyline.pdf";

const pdfLoader = new PDFLoader(pdfPath);

const docs = await pdfLoader.load();

console.log("PDFLoader:", docs[0]);
