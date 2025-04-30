import { NextResponse } from "next/server";
import { getAllDocuments, Document } from "@/lib/document-service";

interface ErrorResponse {
  error: string;
}

export async function GET(): Promise<NextResponse<Document[] | ErrorResponse>> {
  try {
    const documents = await getAllDocuments();
    return NextResponse.json(documents);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch documents";
    console.error("Error in documents API:", error);

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
