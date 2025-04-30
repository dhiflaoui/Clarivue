import { NextResponse } from "next/server";
import { getAllDocuments } from "@/lib/document-service";

export async function GET() {
  try {
    const documents = await getAllDocuments();
    return NextResponse.json(documents);
  } catch (error: any) {
    console.error("Error in documents API:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}
