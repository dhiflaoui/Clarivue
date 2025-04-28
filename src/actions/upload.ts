"use server";

import cloudinary from "@/lib/cloudinary";

export async function uploadPDF(formData: FormData) {
  try {
    const file = formData.get("pdf") as File;

    if (!file) {
      return { success: false, message: "No file provided" };
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert buffer to base64
    const base64File = buffer.toString("base64");
    const dataURI = `data:${file.type};base64,${base64File}`;

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        dataURI,
        {
          resource_type: "auto",
          folder: "pdf_uploads",
          format: "pdf",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });

    return {
      success: true,
      result,
    };
  } catch (error) {
    console.error("Upload error in upload.ts :", error);
    return {
      success: false,
      message: "Upload failed",
      error: (error as Error).message,
    };
  }
}
