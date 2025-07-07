import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "react-toastify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function showToast(
  message: string,
  type: "success" | "error" = "success"
) {
  toast(message, { type, className: "foo-bar", position: "top-right" });
}

export function formatFileSize(bytes: number): string {
  const fileSizeKB = Math.round(bytes / 1024);

  return fileSizeKB > 1024
    ? `${(fileSizeKB / 1024).toFixed(1)} MB`
    : `${fileSizeKB} KB`;
}

export function formatCreatedDate(createdDate: Date | string): string {
  console.log("createdDate: ", createdDate);

  const date =
    typeof createdDate === "string" ? new Date(createdDate) : createdDate;

  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

  return date.toLocaleDateString();
}
export function scrollToBottom(
  messageEndRef: React.RefObject<HTMLDivElement | null>
) {
  if (messageEndRef.current) {
    messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  }
}
