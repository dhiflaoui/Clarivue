import { NextResponse } from "next/server";
import { getAllDocuments, updateDocumentName } from "@/actions/db";
import { Document } from "../../../../prisma/prisma-client";
import { auth } from "@clerk/nextjs/server";

interface ErrorResponse {
  error: string;
}

export async function GET(): Promise<NextResponse<Document[] | ErrorResponse>> {
  const { userId } = await auth();
  try {
    const documents = await getAllDocuments(userId ?? "");
    return NextResponse.json(documents);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch documents";
    console.error("Error in documents API:", error);

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
export async function PUT(
  request: Request
): Promise<NextResponse<Document | ErrorResponse>> {
  try {
    const { documentId, newDocName } = await request.json();
    const updatedDoc = await updateDocumentName(documentId, newDocName);
    if (!updatedDoc) {
      return NextResponse.json(
        { error: "Document not found or update failed" },
        { status: 404 }
      );
    }
    return NextResponse.json(updatedDoc);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch documents";
    console.error("Error in documents API:", error);

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
