"use client";
import { ArrowRight, BookOpenCheck, CloudUpload } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

const demoBar: React.FC = () => {
  return (
    <header className="fixed left-0 z-50 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-xl shadow-sm">
      <div className="mx-auto max-w-7xl h-[60px] px-8 md:px-6">
        <div className="flex items-center justify-between h-full">
          {/* Logo Section */}
          <Link href="/" className="cursor-pointer group">
            <div className="flex items-center transition-all duration-200 group-hover:scale-105">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl mr-3 shadow-lg group-hover:shadow-xl transition-all duration-200">
                <BookOpenCheck className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Clarivue
              </span>
            </div>
          </Link>

          {/* Navigation Section */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <Link href="/sign-in">
                <Button
                  variant="outline"
                  size="sm"
                  className="relative px-4 py-2 h-9 font-medium transition-all duration-200 border-2 border-orange-500 bg-transparent text-orange-500 hover:bg-orange-500 hover:text-white hover:shadow-xl hover:scale-105"
                >
                  <CloudUpload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </Link>
              <div className="h-6 w-px bg-slate-200 mx-2" />
              <Link href={"/"}>
                <Button variant="link">
                  Go to Homepage <ArrowRight className=" h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default demoBar;
