import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

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
    <html lang="en">
      <body className={`${poppins.className} $ antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
