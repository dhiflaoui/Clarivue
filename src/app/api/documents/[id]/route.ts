import { NextResponse } from "next/server";
import { deleteDocument } from "@/lib/document-service";

export async function DELETE({ params }: { params: { id: string } }) {
  try {
    const public_id = decodeURIComponent(params.id);
    const fullPublicId = `pdfs/${public_id}`;
    const result = await deleteDocument(fullPublicId);
    console.log("public_id in api routes", public_id);
    console.log("deleteDocument in api routes", result);
    if (result) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Failed to delete document" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error in delete document API:", error);
    return NextResponse.json(
      { error: "Failed to delete document" },
      { status: 500 }
    );
  }
}
