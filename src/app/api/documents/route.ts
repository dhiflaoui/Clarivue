import { NextResponse } from "next/server";
import { getAllDocuments, Document } from "@/actions/db";
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
