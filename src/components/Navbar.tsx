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
            <BookOpenCheck className="text-black w-7 h-7 mr-3" />
            <span className="text-lg font-medium text-black">Clarivue</span>
          </div>
          {/* <Link href={isSignedIn ? "/documents" : "/sign-in"}> */}
          <Link href="/documents">
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
