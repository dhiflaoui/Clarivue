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
import { Loader2, Pencil } from "lucide-react";
import { useState } from "react";

interface UpdatePDFProps {
  onUpdateSuccess?: () => void;
  docCurrentName: string;
  documentId: string;
}

const UpdatePDF: React.FC<UpdatePDFProps> = ({
  onUpdateSuccess,
  docCurrentName = "",
  documentId = "",
}) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [documentName, setDocumentName] = useState<string>(docCurrentName);
  const [isBtnEnabled, setIsBtnEnabled] = useState(false);

  const handleOpenDialog = () => {
    setOpen(!open);
  };
  const handleDocumentNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentName(e.target.value);
    setIsBtnEnabled(e.target.value.trim() !== "");
  };
  const resetForm = () => {
    setDocumentName("");
    setIsBtnEnabled(false);
    setOpen(false);
  };
  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/documents", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newDocName: documentName,
          documentId: documentId,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update document");
      }
      const data = await response.json();
      console.log("Update response:", data);
      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
      resetForm();
    } catch (error) {
      console.error("Error updating document:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenDialog}>
      <DialogTrigger asChild>
        <Pencil
          className="w-4 h-4 cursor-pointer hover:text-[#ff612f]"
          style={{ strokeWidth: "3" }}
        />
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Update a document</DialogTitle>
        </DialogHeader>
        <form className="space-y-6" onSubmit={handleUpdate}>
          <div className="space-y-2">
            <Label htmlFor="url" className="text-right">
              Name
            </Label>
            <Input
              id="document-name"
              className="col-span-3"
              name="document-name"
              value={documentName}
              onChange={handleDocumentNameChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              type="submit"
              variant={"orange"}
              disabled={!isBtnEnabled || isLoading}
            >
              {isLoading ? (
                <Loader2
                  className="w-5 h-5 text-white/80 animate-spin"
                  style={{ strokeWidth: 3 }}
                />
              ) : (
                "Update"
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

export default UpdatePDF;
