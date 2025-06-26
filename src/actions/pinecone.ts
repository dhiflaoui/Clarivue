"use server";
import { fetchFileByPublicId } from "@/lib/document-service";
import { auth } from "@clerk/nextjs/server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

export const embedPDFToPinecone = async (publicId: string) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }
    let pdfFileData = await fetchFileByPublicId(publicId);

    const response = await fetch(pdfFileData.url, {
      method: "GET",
      headers: {
        Accept: "application/pdf",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch PDF from Cloudinary. Status: ${response.status}`
      );
    }

    const arrayBuffer = await response.arrayBuffer();

    if (arrayBuffer.byteLength === 0) {
      throw new Error("PDF file is empty");
    }

    console.log("✅ PDF downloaded, size:", arrayBuffer.byteLength, "bytes");

    //  Convert ArrayBuffer to File
    const file = new File([arrayBuffer], `${publicId}.pdf`, {
      type: "application/pdf",
    });

    const loader = new PDFLoader(file);
    const documents = await loader.load();

    return documents.length > 0
      ? "PDF processed successfully"
      : "No content extracted";
  } catch (error) {
    console.error("❌ Error in embedPDFToPinecone:", error);

    if (error instanceof Error) {
      throw new Error(`Failed to process PDF: ${error.message}`);
    }

    throw new Error("Failed to process PDF: Unknown error occurred");
  }
};
