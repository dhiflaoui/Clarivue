import cloudinary from "./cloudinary";

export interface Document {
  id: string;
  public_id: string;
  fileName: string;
  fileUrl: string;
  fileSize: string;
  createdAt: string;
}
type DeleteResult = {
  success: boolean;
  message?: string;
  details?: any;
};
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
    return result.resources.map((resource: any) => {
      const public_id = resource.public_id.split("/").pop() ?? "";

      const fileSizeKB = Math.round(resource.bytes / 1024);
      const fileSize =
        fileSizeKB > 1024
          ? `${(fileSizeKB / 1024).toFixed(1)} MB`
          : `${fileSizeKB} KB`;

      const createdDate = new Date(resource.created_at);
      const now = new Date();
      const diffDays = Math.floor(
        (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      let createdAt = "";
      if (diffDays === 0) {
        createdAt = "today";
      } else if (diffDays === 1) {
        createdAt = "yesterday";
      } else if (diffDays < 7) {
        createdAt = `${diffDays} days ago`;
      } else if (diffDays < 30) {
        createdAt = `${Math.floor(diffDays / 7)} weeks ago`;
      } else {
        createdAt = createdDate.toLocaleDateString();
      }

      return {
        id: resource.asset_id,
        public_id: resource.public_id,
        fileName: public_id,
        fileUrl: resource.secure_url,
        fileSize,
        createdAt,
      };
    });
  } catch (error: any) {
    console.error("Error fetching documents:", error);
    return [];
  }
}

export async function deleteDocument(public_id: string): Promise<DeleteResult> {
  try {
    console.log("deleteDocument called with:", public_id);

    // Test if the public_id exists before trying to delete it
    // TODO :for testing delete After done
    try {
      const resourceCheck = await cloudinary.api.resource(public_id, {
        resource_type: "raw",
      });
      console.log("Resource exists:", resourceCheck.public_id);
    } catch (checkError: any) {
      console.error("Resource check failed:", checkError);
      if (checkError.error?.http_code === 404) {
        return {
          success: false,
          message: "Document not found in Cloudinary",
          details: checkError.error,
        };
      }
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
        details: result,
      };
    }
  } catch (error: any) {
    console.error("Error in deleteDocument:", error);
    const errorDetails = {
      message: error.message ?? "Unknown error",
      http_code: error.http_code,
      error_info: error.error,
    };

    console.error("Cloudinary error details:", errorDetails);

    return {
      success: false,
      message: error.message ?? "Failed to delete document",
      details: errorDetails,
    };
  }
}
