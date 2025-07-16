"use server";

import { auth } from "@clerk/nextjs/server";
// import { PDFLoader } from "langchain/document_loaders/fs/pdf";
// import { PineconeStore } from "langchain/vectorstores/pinecone";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document } from "langchain/document";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { indexName } from "@/lib/pinecone";
import pinecone from "@/lib/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import embeddings from "@/lib/HuggingFace";

export const embedPDFToPinecone = async (
  filePublicId: string,
  pdfFileUrl: string
) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

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

    // Convert ArrayBuffer to File
    const file = new File([arrayBuffer], `${filePublicId}.pdf`, {
      type: "application/pdf",
    });

    const loader = new PDFLoader(file);
    const documents = await loader.load();

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
    try {
      await PineconeStore.fromDocuments(splitDocs, embeddings, {
        pineconeIndex: index,
        namespace: filePublicId,
      });
    } catch (error) {
      console.error("❌ Error in embedPDFToPinecone:", error);
    }
  } catch (error) {
    console.error("❌ Error in embedPDFToPinecone:", error);

    if (error instanceof Error) {
      throw new Error(`Failed to process PDF: ${error.message}`);
    }

    throw new Error("Failed to process PDF: Unknown error occurred");
  }
};

export async function deleteFromNamespace(namespaceName: string) {
  console.log("Deleting from namespace:", namespaceName);
  try {
    const index = pinecone.index(indexName);
    const namespace = index.namespace(namespaceName);
    console.log("namespace: ", namespace);
    await namespace.deleteAll();
    console.log(`All vectors deleted from namespace: ${namespaceName}`);
  } catch (error) {
    console.error("Error deleting from Pinecone:", error);
    throw error;
  }
}
