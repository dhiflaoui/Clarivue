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

export interface CloudinaryError extends Error {
  http_code?: number;
  error?: {
    message: string;
    http_code?: number;
  };
}

// Type guard to check if error is a CloudinaryError
function isCloudinaryError(error: unknown): error is CloudinaryError {
  return error instanceof Error && "http_code" in error;
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
interface CloudinaryResource {
  public_id: string;
  format: string;
  version: number;
  resource_type: string;
  type: string;
  created_at: string;
  bytes: number;
  width: number;
  height: number;
  url: string;
  secure_url: string;
  tags: string[];
  context?: Record<string, any>;
  metadata?: Record<string, any>;
}
export async function fetchFileByPublicId(
  publicId: string
): Promise<CloudinaryResource> {
  try {
    // Validate input
    console.log("Fetching file with public ID:", publicId);
    if (!publicId || typeof publicId !== "string" || publicId.trim() === "") {
      throw new Error("Public ID must be a non-empty string");
    }
    const result = await cloudinary.search
      .expression(`public_id:${publicId}`)
      .max_results(1)
      .execute();

    if (result.resources.length === 0) {
      throw new Error(`File with public ID "${publicId}" not found`);
    }
    console.log("*********File Data after fetching *************:", result.resources[0]);
    return result.resources[0] as CloudinaryResource;
    // const result = await cloudinary.api.resource(publicId, {
    //   resource_type: "auto",
    // });
    // console.log("*********File Data after fetching *************:", result);
    // return result as CloudinaryResource;
  } catch (error: unknown) {
    if (isCloudinaryError(error)) {
      const httpCode = error.http_code || error.error?.http_code;

      if (httpCode === 404) {
        throw new Error(
          `File with public ID "${publicId}" not found in Cloudinary`
        );
      } else if (httpCode === 401) {
        throw new Error("Unauthorized: Check your Cloudinary API credentials");
      } else if (httpCode === 403) {
        throw new Error(
          "Forbidden: Insufficient permissions to access this resource"
        );
      } else if (httpCode === 429) {
        throw new Error(
          "Rate limit exceeded: Too many requests to Cloudinary API"
        );
      }

      console.error("Error fetching resource from Cloudinary:", {
        publicId,
        error: error.message,
        httpCode,
        stack: error.stack,
      });
      throw new Error(`Failed to fetch file: ${error.message}`);
    } else if (error instanceof Error) {
      console.error("Unexpected error:", error.message);
      throw new Error(`Failed to fetch file: ${error.message}`);
    } else {
      console.error("Unknown error type:", error);
      throw new Error("Failed to fetch file: Unknown error occurred");
    }
  }
}

// export async function fetchFileByUrl(fileUrl: string): Promise<{
//   data: ArrayBuffer | string;
//   contentType: string;
//   fileName: string;
// } | null> {
// https://res.cloudinary.com/dft2x51oh/raw/upload/v1746032401/pdfs/Fatma-Tawfeek-Frontend-Developer-Vue.pdf
// try {
//   if (!fileUrl.includes("cloudinary.com")) {
//     throw new Error(
//       "The provided URL does not appear to be a Cloudinary URL"
//     );
//   }

//   // Extract the file name from the URL
//   const urlParts = fileUrl.split("/");
//   const fileName = urlParts[urlParts.length - 1];

//   // Fetch the file
//   const response = await fetch(fileUrl);
//   console.log(
//     "*********File Response in doc service*************:",
//     response
//   );

//   if (!response.ok) {
//     throw new Error(
//       `Failed to fetch file: ${response.status} ${response.statusText}`
//     );
//   }

//   // Get content type
//   const contentType =
//     response.headers.get("content-type") ?? "application/octet-stream";

//   // Determine how to handle the response based on content type
//   let data: ArrayBuffer | string;

//   if (
//     contentType.includes("text") ||
//     contentType.includes("application/json")
//   ) {
//     // For text-based files, return as text
//     data = await response.text();
//   } else {
//     // For binary files, return as ArrayBuffer
//     data = await response.arrayBuffer();
//   }
//   console.log("*********File Data in doc service*************:", data);
//   console.log(
//     "*********File Content Type in doc service*************:",
//     contentType
//   );
//   console.log("*********File Name in doc service*************:", fileName);
//   return {
//     data,
//     contentType,
//     fileName,
//   };
// } catch (error) {
//   console.error("Error fetching file from Cloudinary:", error);
//   return null;
// }
// }
// export async function getSingleDocument(
//   publicId: string
// ): Promise<Document | null> {
//   try {
//     const fullPublicId = publicId.includes("/") ? publicId : `pdfs/${publicId}`;

//     const result = await cloudinary.api.resource(fullPublicId, {
//       resource_type: "raw",
//     });

//     if (!result) {
//       return null;
//     }

//     const public_id = result.public_id.split("/").pop() ?? "";
//     const fileSize = formatFileSize(result.bytes);
//     const createdAt = formatCreatedDate(new Date(result.created_at));

//     return {
//       id: result.asset_id,
//       public_id: result.public_id,
//       fileName: public_id,
//       fileUrl: result.secure_url,
//       fileSize,
//       createdAt,
//     };
//   } catch (error) {
//     console.error(`Error fetching document with public_id ${publicId}:`, error);
//     return null;
//   }
// }
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
