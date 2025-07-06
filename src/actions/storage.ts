import cloudinary from "@/lib/cloudinary";
export interface DeleteResult {
  success: boolean;
  message?: string;
  details?: Record<string, unknown>;
}

export interface CloudinaryError extends Error {
  http_code?: number;
  error?: {
    message: string;
    http_code?: number;
  };
}
export async function deleteDocumentCloudinary(
  public_id: string
): Promise<DeleteResult> {
  try {
    console.log("deleteDocument called with:", public_id);

    if (!(await resourceExists(public_id))) {
      return {
        success: false,
        message: "Document not found in Cloudinary",
      };
    }

    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: "raw",
      invalidate: true,
    });

    console.log("Cloudinary delete result:", result);

    if (result.result === "ok") {
      return { success: true };
    } else {
      return {
        success: false,
        message: "Cloudinary returned non-OK result",
        details: result as Record<string, unknown>,
      };
    }
  } catch (error) {
    console.error("Error in deleteDocument:", error);

    const typedError = error as CloudinaryError;
    const errorDetails: Record<string, unknown> = {
      message: typedError.message ?? "Unknown error",
      http_code: typedError.http_code,
      error_info: typedError.error,
    };

    console.error("Cloudinary error details:", errorDetails);

    return {
      success: false,
      message: typedError.message ?? "Failed to delete document",
      details: errorDetails,
    };
  }
}
async function resourceExists(public_id: string): Promise<boolean> {
  try {
    await cloudinary.api.resource(public_id, {
      resource_type: "raw",
    });
    return true;
  } catch (error) {
    const typedError = error as CloudinaryError;
    if (
      typedError.error &&
      typeof typedError.error === "object" &&
      "http_code" in typedError.error &&
      typedError.error.http_code === 404
    ) {
      return false;
    }
    throw error;
  }
}
