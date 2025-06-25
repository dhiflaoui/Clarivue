"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud, X, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { showToast } from "@/lib/utils";
import { embedPDFToPinecone } from "@/actions/pinecone";

const UploadPDF: React.FC<{ onUploadSuccess?: () => void }> = ({
  onUploadSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [isBtnEnabled, setIsBtnEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    success: boolean;
    message: string;
    fileUrl?: string;
    originalName?: string;
  } | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (!file) {
      showToast("Please upload only PDF files", "error");
      return;
    }
    if (file.size > 1024 * 1024 * 10) {
      showToast("File size exceeds 10MB", "error");
      return;
    }
    setFile(file);
    setIsBtnEnabled(true);
    setUrl("");
    setUploadStatus(null);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
    onDrop,
  });

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setIsBtnEnabled(true);
    setFile(null);
    setUploadStatus(null);
  };

  const handleFileRemove = () => {
    setFile(null);
    setIsBtnEnabled(false);
    setUploadStatus(null);
  };

  const resetForm = () => {
    setFile(null);
    setUrl("");
    setIsBtnEnabled(false);
    setUploadStatus(null);
  };

  const handleOpenDialog = () => {
    setOpen(!open);
    if (open) {
      resetForm();
    }
  };

  const uploadToCloudinary = async (file: File) => {
    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: `File "${file.name}" uploaded successfully`,
          fileUrl: data.url,
          publicId: data.public_id,
          originalName: file.name,
        };
      } else {
        throw new Error(data.error ?? "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Upload failed",
      };
    } finally {
      setIsUploading(false);
    }
  };

  const uploadUrlToCloudinary = async (urlToUpload: string) => {
    try {
      setIsUploading(true);
      const urlPath = new URL(urlToUpload).pathname;
      const filename = urlPath.substring(urlPath.lastIndexOf("/") + 1);

      const response = await fetch("/api/upload-from-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: urlToUpload }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: "URL uploaded successfully",
          fileUrl: data.url,
          publicId: data.public_id,
          originalName: filename,
        };
      } else {
        throw new Error(data.error ?? "URL upload failed");
      }
    } catch (error) {
      console.error("URL upload error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "URL upload failed",
      };
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let result;

      if (file) {
        result = await uploadToCloudinary(file);
      } else if (url) {
        result = await uploadUrlToCloudinary(url);
      } else {
        setUploadStatus({
          success: false,
          message: "Please select a file or enter a URL",
        });
        return;
      }

      setUploadStatus({
        success: result.success,
        message: result.message,
        fileUrl: result.fileUrl,
        originalName: result.originalName,
      });

      if (result.success && result.publicId) {
        console.log("*********Upload Result*************:", result);

        // Add a small delay to ensure the file is available in Cloudinary
        await new Promise((resolve) => setTimeout(resolve, 3000));

        try {
          const docs = await embedPDFToPinecone(result.publicId);
          console.log("*********Embedding Result*************:", docs);

          if (onUploadSuccess) {
            onUploadSuccess();
          }

          setTimeout(() => {
            handleOpenDialog();
          }, 2000);
        } catch (embedError) {
          console.error("Error embedding PDF:", embedError);
          setUploadStatus({
            success: false,
            message: `Upload successful but embedding failed: ${
              embedError instanceof Error ? embedError.message : "Unknown error"
            }`,
          });
        }
      }
      //TODO: extract PDF content from file and save it to Pinecone vector database
      // i have a file url how to get data from it Cloudinary
      // result.image_metadata
      // https://cloudinary.com/documentation/image_upload_api_reference#upload_examples
      // result
      // fileUrl: "https://res.cloudinary.com/dft2x51oh/raw/upload/v1750820706/pdfs/Fatma-Tawfeek-Frontend-Developer-Vue.pdf"
      // message :"File \"Fatma-Tawfeek-Frontend-Developer-Vue.pdf\" uploaded successfully"
      // originalName: "Fatma-Tawfeek-Frontend-Developer-Vue.pdf"
      // publicId: "pdfs/Fatma-Tawfeek-Frontend-Developer-Vue.pdf"
      // success: true
      // console.log("*********Result*************:", result);
      // const docs = await embedPDFToPinecone(result.publicId);
      // console.log(docs);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setUploadStatus({
        success: false,
        message: `Upload failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    }
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenDialog}>
      <DialogTrigger asChild>
        <Button variant={"orange"}>
          Upload
          <UploadCloud className="w-4 h-4 ml-2" style={{ strokeWidth: 3 }} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload a document</DialogTitle>
        </DialogHeader>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl">
            <div className="border-dashed border-2 rounded-md cursor-pointer bg-gray-50 h-36 w-full">
              {file ? (
                <div className="h-full flex justify-center items-center text-black/70">
                  <span className="whitespace-nowrap overflow-hidden text-sm text-ellipsis max-w-[200px]">
                    {file?.name ?? "No file selected"}
                  </span>
                  <Button
                    variant={"light"}
                    onClick={handleFileRemove}
                    className="ml-1 cursor-pointer"
                    type="button"
                  >
                    <X className="w-4 h-4" style={{ strokeWidth: 3 }} />
                  </Button>
                </div>
              ) : (
                <div
                  {...getRootProps()}
                  className="h-full flex flex-col items-center justify-center cursor-pointer"
                >
                  <input {...getInputProps()} name="file" />
                  <UploadCloud className="w-10 h-10 text-[#ff612f]" />
                  <p className="mt-2 text-sm text-slate-400">
                    Drag and drop PDF file here or click to upload
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrinks mx-4 uppercase text-gray-600 text-xs">
              or
            </span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="url" className="text-right">
              Import from URL
            </Label>
            <Input
              id="url"
              placeholder="https://example.com/doc.pdf"
              className="col-span-3"
              name="url"
              value={url}
              onChange={handleUrlChange}
            />
          </div>

          {uploadStatus && (
            <div
              className={`p-3 rounded-md flex items-center ${
                uploadStatus.success
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {uploadStatus.success ? (
                <CheckCircle className="w-5 h-5 mr-2" />
              ) : (
                <XCircle className="w-5 h-5 mr-2" />
              )}
              <div>
                <p className="text-sm font-medium">{uploadStatus.message}</p>
                {uploadStatus.fileUrl && (
                  <p className="text-xs truncate mt-1">
                    <a
                      href={uploadStatus.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      View uploaded file
                    </a>
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Button
              type="submit"
              variant={"orange"}
              disabled={!isBtnEnabled || isUploading}
            >
              {isUploading ? (
                <Loader2
                  className="w-5 h-5 text-white/80 animate-spin"
                  style={{ strokeWidth: 3 }}
                />
              ) : (
                "Upload"
              )}
            </Button>
            <DialogTrigger asChild>
              <Button variant={"light"} onClick={resetForm} type="button">
                Cancel
              </Button>
            </DialogTrigger>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadPDF;
