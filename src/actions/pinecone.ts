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
    console.log("Attempting to fetch file with publicId:", publicId);
    let pdfFile = await fetchFileByPublicId(publicId);
    if (!pdfFile) {
      throw new Error("Failed to fetch PDF file - file is null or undefined");
    }
    console.log("*********File Data*************:", pdfFile);
    if (pdfFile.format !== "pdf" && pdfFile.resource_type !== "raw") {
      throw new Error(
        `File is not a PDF. Format: ${pdfFile.format}, Type: ${pdfFile.resource_type}`
      );
    }
    // Split text into small chunks
    //TODO: check this code the docment retruned is an object
    // const blob = new Blob([await data?.arraysBuffer()]);
    // const loader = new PDFLoader(blob);
    // const documents = await loader.load();
    let result = "testinggggggg";
    return result;
  } catch (error) {
    console.error("Error in embedPDFToPinecone:", error);

    if (error instanceof Error) {
      throw new Error(`Failed to process PDF: ${error.message}`);
    }

    throw new Error("Failed to process PDF: Unknown error occurred");
  }
};
