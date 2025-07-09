import { Document, Message } from "../../prisma/prisma-client";
import prismadb from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";
import { DeleteResult } from "./storage";
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
interface AddPdfParams {
  fileName: string;
  fileSize: number;
  fileKey: string;
  fileUrl: string;
}
interface DocumentWithMessages extends Document {
  messages: Message[];
}
//TODO: try to refactor this to use the DocumentWithMessages type
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
      return {
        id: resource.id,
        userName: resource.userName ?? "Unknown User",
        userId: resource.userId ?? "",
        fileKey: resource.fileKey ?? "",
        fileName: resource.fileName ?? "Untitled Document",
        fileSize: resource.fileSize ?? 0,
        fileUrl: resource.fileUrl ?? "",
        createdAt: resource.createdAt ?? new Date(),
      };
    });
  } catch (error) {
    console.error("Error fetching documents from database:", error);
    return [];
  }
}
export async function addPdfFileDetails(
  params: AddPdfParams
): Promise<DocumentResult> {
  const { fileName, fileSize, fileKey, fileUrl } = params;
  const user = await currentUser();

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
export async function getDocumentById(
  id: string
): Promise<DocumentWithMessages | null> {
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
    const document = await prismadb.document.findUnique({
      where: { id, userId: user.id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!document) {
      console.warn(`Document with ID ${id} not found`);
      return null;
    }

    return document;
  } catch (error) {
    console.error("Error fetching document by ID:", error);
    return null;
  }
}
export async function deleteDocumentById(id: string): Promise<DeleteResult> {
  try {
    await prismadb.document.delete({
      where: { id },
    });
    revalidatePath("/documents");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: `Failed to delete from database: ${error}`,
    };
  }
}
export async function updateDocumentName(
  id: string,
  newName: string
): Promise<void | null> {
  const user = await currentUser();
  if (!user) {
    console.warn("No user found, returning null");
    throw new Error("User not authenticated");
  }
  if (!id) {
    console.warn("No document ID provided, returning null");
    return null;
  } else if (!newName.trim()) {
    console.warn("New document name is empty, returning null");
    throw new Error("Document name cannot be empty");
  } else if (newName.length > 100) {
    console.warn("New document name is too long, returning null");
    throw new Error("Document name cannot exceed 100 characters");
  }

  try {
    await prismadb.document.update({
      where: { id, userId: user.id },
      data: { fileName: newName },
    });

    revalidatePath("/documents");
  } catch (error) {
    console.error("Error updating document name:", error);
    return null;
  }
}
