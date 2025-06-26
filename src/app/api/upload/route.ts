import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

interface UploadResponse {
  url: string;
  public_id: string;
}

interface ErrorResponse {
  error: string;
}

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  [key: string]: unknown;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<UploadResponse | ErrorResponse>> {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.includes("pdf")) {
      return NextResponse.json(
        { error: "File must be a PDF" },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    const originalFilename = file.name;
    const filenameWithoutExt = originalFilename.replace(/\.[^/.]+$/, "");

    const result = await uploadToCloudinary(bytes, filenameWithoutExt);

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}

function uploadToCloudinary(
  fileBytes: Uint8Array,
  filename: string
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder: "pdfs",
        format: "pdf",
        public_id: filename,
        use_filename: true,
        unique_filename: false,
        type: "upload",
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Upload failed"));
          return;
        }
        resolve(result as CloudinaryUploadResult);
      }
    );

    uploadStream.end(fileBytes);
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
