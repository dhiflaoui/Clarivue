"use client";

import UploadPDF from "@/components/sections/documents/UploadPDF";
import { File, Pencil, Trash2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Document } from "@/lib/document-service";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { embedPDFToPinecone } from "@/actions/pinecone";

const Documents = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(
    null
  );

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/documents");

      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }

      const data = await response.json();
      console.log("*********Documents Data*************:", data);
      setDocuments(data);
    } catch (err) {
      setError("Error loading documents. Please try again later.");
      console.error("Error fetching documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDeleteClick = (document: Document) => {
    setDocumentToDelete(document);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!documentToDelete) return;

    try {
      setDeletingId(documentToDelete.id);
      const filename = documentToDelete.public_id.split("/").pop();
      if (!filename) {
        throw new Error("Invalid public_id structure.");
      }
      const apiUrl = `/api/documents/${encodeURIComponent(filename)}/`;
      console.log("Delete API URL:", apiUrl);
      const response = await fetch(apiUrl, {
        method: "DELETE",
      });
      let responseData;
      try {
        responseData = await response.json();
        console.log("Delete API response data:", responseData);
      } catch (parseError) {
        console.error("Failed to parse API response:", parseError);
      }
      if (!response.ok) {
        const errorMessage =
          responseData?.error || responseData?.details || "Unknown error";
        throw new Error(`Delete failed: ${errorMessage}`);
      }

      await fetchDocuments(); // Refresh documents list after deletion
    } catch (err) {
      console.error("Error deleting document:", err);
      setError("Failed to delete document. Please try again.");
    } finally {
      setDeletingId(null);
      setIsDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
  };

  const handleUploadSuccess = () => {
    fetchDocuments();
  };
  const handleEmbedSuccess = async () => {
    try {
      const docs = await embedPDFToPinecone(
        "pdfs/Fatma-Tawfeek-Frontend-Developer-Vue.pdf"
      );
      console.log("*********Embedding Result*************:", docs);
    } catch (error: any) {
      console.error("Error embedding PDF:", error);
    }
  };
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Loading documents...</span>
        </div>
      );
    }

    if (error) {
      return <div className="p-4 text-center text-red-500">{error}</div>;
    }

    if (documents.length === 0) {
      return (
        <div className="p-8 text-center text-gray-500">
          No documents found. Upload your first document using the Upload
          button.
        </div>
      );
    }
    return (
      <table className="min-w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="p-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Size
            </th>
            <th className="p-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="p-4 text-right"></th>
            <th className="p-4 text-right"></th>
          </tr>
        </thead>
        <tbody>
          {documents.map((document) => (
            <tr
              key={document.id}
              className="border-b border-gray-200 hover:bg-gray-50"
            >
              <td className="p-4 text-left flex items-center">
                <File
                  className="w-4 h-4 mr-2 text-[#ff612f]"
                  style={{ strokeWidth: "3" }}
                />
                <a
                  href={document.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  <span className="text-ellipsis overflow-hidden whitespace-normal max-w-[300px] text-sm font-medium">
                    {document.fileName}
                  </span>
                </a>
              </td>
              <td className="p-4 text-right text-sm text-gray-500 whitespace-nowrap w-20">
                {document.fileSize}
              </td>
              <td className="p-4 text-right text-sm text-gray-500 whitespace-nowrap w-28">
                {document.createdAt}
              </td>
              <td className="p-4 text-right w-4">
                <Pencil
                  className="w-4 h-4 cursor-pointer hover:text-[#ff612f]"
                  style={{ strokeWidth: "3" }}
                />
              </td>
              <td className="p-4 text-right w-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEmbedSuccess()}
                  className="h-auto p-0 hover:bg-transparent"
                >
                  upload file
                </Button>
              </td>
              <td className="p-4 text-right w-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteClick(document)}
                  disabled={deletingId === document.id}
                  className="h-auto p-0 hover:bg-transparent"
                >
                  {deletingId === document.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2
                      className="w-4 h-4 cursor-pointer hover:text-red-500"
                      style={{ strokeWidth: "3" }}
                    />
                  )}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  return (
    <section className="bg-[#faf9f6] min-h-screen">
      <div className="section-container">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl">Documents</h1>
          <UploadPDF onUploadSuccess={handleUploadSuccess} />
        </div>

        <div className="bg-white rounded shadow w-full overflow-x-auto">
          {renderContent()}
        </div>
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {documentToDelete?.fileName}? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              {deletingId ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default Documents;
