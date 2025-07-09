"use client";

import { BookOpenCheck, FileText } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

const DashboardBar: React.FC = () => {
  const pathname = usePathname();

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
            {pathname.startsWith("/documents/") && (
              <Link href="/documents" className="cursor-pointer">
                <Button
                  variant={"default"}
                  size="sm"
                  className={`
                      relative px-4 py-2 h-9 font-medium transition-all duration-200
                      border-2 border-orange-500 bg-transparent text-orange-500  hover:shadow-xl hover:scale-105 hover:bg-orange-50
                  `}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Documents
                </Button>
              </Link>
            )}

            <div className="h-6 w-px bg-slate-200 mx-2" />

            <div className="flex items-center">
              <UserButton
                afterSwitchSessionUrl="/"
                appearance={{
                  elements: {
                    avatarBox:
                      "w-9 h-9 ring-2 ring-slate-200 hover:ring-orange-300 transition-all duration-200",
                    userButtonPopoverCard: "shadow-xl border-0",
                    userButtonPopoverActions: "bg-slate-50",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardBar;
