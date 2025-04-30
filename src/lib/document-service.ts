import cloudinary from "./cloudinary";

export interface Document {
  id: string;
  public_id: string;
  fileName: string;
  fileUrl: string;
  fileSize: string;
  createdAt: string;
}

export interface DeleteResult {
  success: boolean;
  message?: string;
  details?: Record<string, unknown>;
}

interface CloudinaryResource {
  asset_id: string;
  public_id: string;
  bytes: number;
  secure_url: string;
  created_at: string;
}

interface CloudinaryError {
  message?: string;
  http_code?: number;
  error?: unknown;
}

export async function getAllDocuments(): Promise<Document[]> {
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      resource_type: "raw",
      prefix: "pdfs/",
      max_results: 100,
    });

    if (!result?.resources) {
      return [];
    }

    return result.resources.map((resource: CloudinaryResource) => {
      const public_id = resource.public_id.split("/").pop() ?? "";

      const fileSize = formatFileSize(resource.bytes);
      const createdAt = formatCreatedDate(new Date(resource.created_at));

      return {
        id: resource.asset_id,
        public_id: resource.public_id,
        fileName: public_id,
        fileUrl: resource.secure_url,
        fileSize,
        createdAt,
      };
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return [];
  }
}

export async function deleteDocument(public_id: string): Promise<DeleteResult> {
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

function formatFileSize(bytes: number): string {
  const fileSizeKB = Math.round(bytes / 1024);

  return fileSizeKB > 1024
    ? `${(fileSizeKB / 1024).toFixed(1)} MB`
    : `${fileSizeKB} KB`;
}

function formatCreatedDate(createdDate: Date): string {
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

  return createdDate.toLocaleDateString();
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
