import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  style: "normal",
});

export const metadata: Metadata = {
  title: "Clarivue",
  description:
    "Get more from your PDFs. AI-powered understanding at your fingertips.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${poppins.className}`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
