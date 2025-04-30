import { NextResponse, NextRequest } from "next/server";
import { deleteDocument, DeleteResult } from "@/lib/document-service";

interface SuccessResponse {
  success: true;
}
interface ErrorResponse {
  error: string;
}

export async function DELETE(
  request: NextRequest
): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    const url = new URL(request.url);
    const public_id = decodeURIComponent(url.pathname.split("/").pop() || "");

    const fullPublicId = `pdfs/${public_id}`;

    console.log("public_id in api routes", public_id);

    const result: DeleteResult = await deleteDocument(fullPublicId);
    console.log("deleteDocument in api routes", result);

    if (result.success) {
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
    console.error("Error in delete document API:", error);

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
