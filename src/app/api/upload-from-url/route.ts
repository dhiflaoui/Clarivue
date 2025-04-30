import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    try {
      new URL(url);
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    if (!url.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json(
        { error: "URL must point to a PDF file" },
        { status: 400 }
      );
    }
    const urlPath = new URL(url).pathname;
    const filename = urlPath.substring(urlPath.lastIndexOf("/") + 1);
    const filenameWithoutExt = filename.replace(/\.[^/.]+$/, "");
    const timestamp = new Date().getTime();
    // Upload from URL to Cloudinary
    const result = await cloudinary.uploader.upload(url, {
      resource_type: "raw",
      folder: "pdfs",
      format: "pdf",
      public_id: `${filenameWithoutExt}_${timestamp}`,
      use_filename: true,
      unique_filename: false,
    });

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
