import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

interface UploadResponse {
  url: string;
  public_id: string;
}

interface ErrorResponse {
  error: string;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<UploadResponse | ErrorResponse>> {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    if (!isValidUrl(url)) {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    if (!isPdfUrl(url)) {
      return NextResponse.json(
        { error: "URL must point to a PDF file" },
        { status: 400 }
      );
    }

    const { filenameWithoutExt } = extractFilenameInfo(url);
    const filename = `${filenameWithoutExt}.pdf`;
    const result = await uploadToCloudinary(url, filename);

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("URL upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "URL upload failed" },
      { status: 500 }
    );
  }
}

function isValidUrl(urlString: string): boolean {
  try {
    new URL(urlString);
    return true;
  } catch {
    return false;
  }
}

function isPdfUrl(url: string): boolean {
  return url.toLowerCase().endsWith(".pdf");
}

function extractFilenameInfo(url: string): {
  filename: string;
  filenameWithoutExt: string;
} {
  const urlPath = new URL(url).pathname;
  const filename = urlPath.substring(urlPath.lastIndexOf("/") + 1);
  const filenameWithoutExt = filename.replace(/\.[^/.]+$/, "");

  return { filename, filenameWithoutExt };
}

async function uploadToCloudinary(url: string, uniqueId: string) {
  return await cloudinary.uploader.upload(url, {
    resource_type: "raw",
    folder: "pdfs",
    format: "pdf",
    public_id: uniqueId,
    use_filename: true,
    unique_filename: false,
  });
}
