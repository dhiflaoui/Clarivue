"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BookOpenCheck } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

const Navbar: React.FC = () => {
  const { isSignedIn } = useAuth();

  return (
    <header className="fixed left-0 z-50 w-full border-slate-500/10 bg-[#f8f5ee] backdrop-blur">
      <div className="mx-auto max-w-7xl h-[60px] px-8 md:px-6">
        <div className="flex items-center justify-between h-full">
          <div className="flex">
            <div className="flex items-center transition-all duration-200 group-hover:scale-105">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl mr-3 shadow-lg group-hover:shadow-xl transition-all duration-200">
                <BookOpenCheck className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Clarivue
              </span>
            </div>
          </div>
          <Link href={isSignedIn ? "/documents" : "/sign-in"}>
            {/* <Link href="/documents"> */}
            <Button variant="link">
              Get Started <ArrowRight className=" h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
