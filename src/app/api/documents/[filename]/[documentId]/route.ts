import { NextResponse, NextRequest } from "next/server";
import { deleteDocumentById } from "@/actions/db";
import { deleteDocumentCloudinary } from "@/actions/storage";
import { deleteFromNamespace } from "@/actions/pinecone";

interface SuccessResponse {
  success: true;
}
interface ErrorResponse {
  error: string;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { filename: string; documentId: string } }
): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  const { filename, documentId } = params;
  const fullPublicId = `pdfs/${decodeURIComponent(filename)}`;

  try {
    const result = await deleteDocumentCloudinary(fullPublicId);

    if (result.success) {
      await deleteDocumentById(documentId);
      await deleteFromNamespace(fullPublicId);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: result.message || "Failed to delete document" },
        { status: 500 }
      );
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete document";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
