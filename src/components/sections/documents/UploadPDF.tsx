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
import { UploadCloud, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const UploadPDF: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [isBtnEnabled, setIsBtnEnabled] = useState(false);
  const [open, setOpen] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (!file) {
      alert("Please select a file");
      return;
    }
    if (file.size > 1024 * 1024 * 10) {
      alert("File size exceeds 10MB");
      return;
    }
    setFile(file);
    setIsBtnEnabled(true);
    setUrl("");
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
  };
  const handleFileRemove = () => {
    setFile(null);
    setIsBtnEnabled(false);
  };
  const resetForm = () => {
    setFile(null);
    setUrl("");
    setIsBtnEnabled(false);
  };
  const handleOpenDialog = () => {
    setOpen(!open);
    resetForm();
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (file) {
      // Handle file upload
    } else if (url) {
      // Handle URL upload
    }
    handleOpenDialog();
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenDialog}>
      <DialogTrigger asChild>
        <Button variant={"orange"}>
          Upload
          <UploadCloud className="w-4 h-4 mr-2" style={{ strokeWidth: 3 }} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload a document</DialogTitle>
        </DialogHeader>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className=" bg-white rounded-xl">
            <div className="border-dashed border-2 rounded-md cursor-pointer bg-gray-50 h-36 w-full">
              {file ? (
                <div className="h-full flex justify-center items-center text-black/70">
                  <span className="whitespace-nowrap overflow-hidden  text-sm text-ellipsis max-w-[200px]">
                    {file?.name ?? "No file selected"}
                  </span>
                  <Button
                    variant={"light"}
                    onClick={handleFileRemove}
                    className="ml-1 cursor-pointer"
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
          <div className="grid grid-cols-2 gap-4">
            <Button type="submit" variant={"orange"} disabled={!isBtnEnabled}>
              Upload
            </Button>
            <DialogTrigger asChild>
              <Button variant={"light"} onClick={resetForm}>
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
