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
