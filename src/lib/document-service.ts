import cloudinary from "./cloudinary";
import prismadb from "@/lib/prisma";
import { formatFileSize } from "./utils";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

//TODO: fix this interface and delete the unused ones
export interface Document {
  id: string;
  userName: string;
  userId: string;
  fileKey: string;
  fileName: string;
  fileSize: string;
  fileUrl: string;
  createdAt: string;
}

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
// Type guard to check if error is a CloudinaryError
function isCloudinaryError(error: unknown): error is CloudinaryError {
  return error instanceof Error && "http_code" in error;
}
interface AddPdfParams {
  fileName: string;
  fileSize: number;
  fileKey: string;
  fileUrl: string;
}

interface DocumentResult {
  id: string;
  userId: string;
  userName: string | null;
  fileName: string | null;
  fileSize: number | null;
  fileKey: string | null;
  fileUrl: string | null;
  createdAt: Date;
}

export async function getAllDocuments(userId: string): Promise<Document[]> {
  if (!userId) {
    console.warn("No user ID found, returning empty documents array");
    return [];
  }

  try {
    const result = await prismadb.document.findMany({
      where: {
        userId: userId,
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        userId: true,
        userName: true,
        fileKey: true,
        fileName: true,
        fileSize: true,
        fileUrl: true,
        createdAt: true,
      },
    });

    return result.map((resource) => {
      const fileSize = formatFileSize(resource.fileSize ?? 0);
      const createdAt = formatCreatedDate(new Date(resource.createdAt));

      return {
        id: resource.id,
        userName: resource.userName ?? "Unknown User",
        userId: resource.userId ?? "",
        fileKey: resource.fileKey ?? "",
        fileName: resource.fileName ?? "Untitled Document",
        fileSize,
        fileUrl: resource.fileUrl ?? "",
        createdAt,
      };
    });
  } catch (error) {
    console.error("Error fetching documents from database:", error);
    return [];
  }
}

//TODO:delete this after success getting file with url
// export async function fetchFileByPublicId(
//   publicId: string
// ): Promise<CloudinaryResource> {
//   try {
//     // Validate input
//     console.log("Fetching file with public ID:", publicId);
//     if (!publicId || typeof publicId !== "string" || publicId.trim() === "") {
//       throw new Error("Public ID must be a non-empty string");
//     }
//     // const pdfUrl = cloudinary.url(publicId, {
//     //   resource_type: "raw", // or 'auto'
//     //   format: "pdf",
//     // });

//     const result = await cloudinary.search
//       .expression(`public_id:${publicId}`)
//       .max_results(1)
//       .execute();

//     if (result.resources.length === 0) {
//       throw new Error(`File with public ID "${publicId}" not found`);
//     }
//     return result.resources[0] as CloudinaryResource;
//   } catch (error: unknown) {
//     if (isCloudinaryError(error)) {
//       const httpCode = error.http_code || error.error?.http_code;

//       if (httpCode === 404) {
//         throw new Error(
//           `File with public ID "${publicId}" not found in Cloudinary`
//         );
//       } else if (httpCode === 401) {
//         throw new Error("Unauthorized: Check your Cloudinary API credentials");
//       } else if (httpCode === 403) {
//         throw new Error(
//           "Forbidden: Insufficient permissions to access this resource"
//         );
//       } else if (httpCode === 429) {
//         throw new Error(
//           "Rate limit exceeded: Too many requests to Cloudinary API"
//         );
//       }

//       console.error("Error fetching resource from Cloudinary:", {
//         publicId,
//         error: error.message,
//         httpCode,
//         stack: error.stack,
//       });
//       throw new Error(`Failed to fetch file: ${error.message}`);
//     } else if (error instanceof Error) {
//       console.error("Unexpected error:", error.message);
//       throw new Error(`Failed to fetch file: ${error.message}`);
//     } else {
//       console.error("Unknown error type:", error);
//       throw new Error("Failed to fetch file: Unknown error occurred");
//     }
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

export async function addPdfFileDetails(
  params: AddPdfParams
): Promise<DocumentResult> {
  const { fileName, fileSize, fileKey, fileUrl } = params;
  const user = await currentUser();
  console.log("***************User:***************", user);
  if (!user) {
    console.warn("No user found, returning null");
    throw new Error("User not authenticated");
  }

  if (!fileName.trim()) {
    throw new Error("File name is required");
  }

  if (fileSize <= 0) {
    throw new Error("File size must be greater than 0");
  }

  if (!fileKey.trim()) {
    throw new Error("File key is required");
  }

  try {
    const document = await prismadb.document.create({
      data: {
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        fileName: fileName,
        fileSize,
        fileKey: fileKey,
        fileUrl: fileUrl,
      },
    });

    revalidatePath("/documents");
    return document;
  } catch (error) {
    console.error("Error creating document:", error);

    // Handle Prisma-specific errors
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        throw new Error(
          "A PDF file with this name already exists. Please rename your file or choose a different one"
        );
      }
      throw new Error(`Failed to create document: ${error.message}`);
    }

    throw new Error("Failed to create document: Unknown error");
  }
}
export async function getDocumentById(id: string): Promise<Document | null> {
  const user = await currentUser();
  if (!user) {
    console.warn("No user found, returning null");
    throw new Error("User not authenticated");
  }
  if (!id) {
    console.warn("No document ID provided, returning null");
    return null;
  }

  try {
    const resource = await prismadb.document.findUnique({
      where: { id, userId: user.id },
      select: {
        id: true,
        userId: true,
        userName: true,
        fileKey: true,
        fileName: true,
        fileSize: true,
        fileUrl: true,
        createdAt: true,
      },
    });

    if (!resource) {
      console.warn(`Document with ID ${id} not found`);
      return null;
    }

    const fileSize = formatFileSize(resource.fileSize ?? 0);
    const createdAt = formatCreatedDate(new Date(resource.createdAt));

    return {
      id: resource.id,
      userName: resource.userName ?? "Unknown User",
      userId: resource.userId ?? "",
      fileKey: resource.fileKey ?? "",
      fileName: resource.fileName ?? "Untitled Document",
      fileSize,
      fileUrl: resource.fileUrl ?? "",
      createdAt,
    };
  } catch (error) {
    console.error("Error fetching document by ID:", error);
    return null;
  }
}
