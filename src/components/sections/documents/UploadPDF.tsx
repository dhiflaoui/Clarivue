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
import { Upload } from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const UploadPDF: React.FC = () => {
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
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
    onDrop,
  });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"orange"}>
          Upload
          <Upload className="w-4 h-4 mr-2" style={{ strokeWidth: 3 }} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload a document</DialogTitle>
        </DialogHeader>
        <form className="space-y-6">
          <div
            {...getRootProps({
              className:
                "border-dashed border-2 rounded-md cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
            })}
          >
            <input {...getInputProps()} />
            <Upload
              className="w-10 h-10 text-[#ff612f]"
              style={{ strokeWidth: 3 }}
            />

            <p className="mt-2 text-sm text-slate-400">
              Drag and drop PDF file here or click to upload
            </p>
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
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button type="submit" variant={"orange"}>
              Upload
            </Button>
            <DialogTrigger asChild>
              <Button variant={"light"}>Cancel</Button>
            </DialogTrigger>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadPDF;
