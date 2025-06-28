"use server";
import { fetchFileByPublicId } from "@/lib/document-service";
import { auth } from "@clerk/nextjs/server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { Document } from "langchain/document";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { indexName } from "@/lib/pinecone";
import pinecone from "@/lib/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";
// import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import embeddings from "@/lib/HuggingFace";

export const embedPDFToPinecone = async (
  publicId: string,
  pdfFileUrl: string
) => {
  console.log("********* PDF Url*************:", pdfFileUrl);
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }
    //TODO : delete this code
    // let pdfFileData = await fetchFileByPublicId(publicId);

    const pdfFile = await fetch(pdfFileUrl, {
      method: "GET",
      headers: {
        Accept: "application/pdf",
      },
    });
    if (!pdfFile.ok) {
      throw new Error(
        `Failed to fetch PDF from Cloudinary. Status: ${pdfFile.status}`
      );
    }

    const arrayBuffer = await pdfFile.arrayBuffer();

    if (arrayBuffer.byteLength === 0) {
      throw new Error("PDF file is empty");
    }

    console.log("PDF downloaded, size:", arrayBuffer.byteLength, "bytes");

    //  Convert ArrayBuffer to File
    const file = new File([arrayBuffer], `${publicId}.pdf`, {
      type: "application/pdf",
    });

    const loader = new PDFLoader(file);
    const documents = await loader.load();
    console.log("Documents loaded:", documents);

    // Trim useless metadata for each document
    const trimDocs = documents.map((doc) => {
      const metadata = { ...doc.metadata };
      delete metadata.pdf;
      return new Document({
        pageContent: doc.pageContent,
        metadata: metadata,
      });
    });

    //Step 2: Split document into smaller chunks
    const splitter = new CharacterTextSplitter({
      separator: "\n",
      chunkSize: 500,
      chunkOverlap: 10,
    });
    const splitDocs = await splitter.splitDocuments(trimDocs);

    // Step 3:connect to the Pinecone Index
    const index = pinecone.Index(indexName);

    // Step 4: Embeddings document

    // await PineconeStore.fromDocuments(splitDocs, new OpenAIEmbeddings(), {
    //   pineconeIndex: index,
    //   namespace: userId,
    // });
    //  Create free embeddings using Hugging Face

    // const vectorStore = await PineconeStore.fromDocuments(
    //   splitDocs,
    //   embeddings,
    //   {
    //     pineconeIndex: index,
    //     namespace: userId,
    //   }
    // );

    //TODO: fix this data
    const data = JSON.parse(JSON.stringify(splitDocs));
    return documents.length > 0 ? data : [];
  } catch (error) {
    console.error("❌ Error in embedPDFToPinecone:", error);

    if (error instanceof Error) {
      throw new Error(`Failed to process PDF: ${error.message}`);
    }

    throw new Error("Failed to process PDF: Unknown error occurred");
  }
};
