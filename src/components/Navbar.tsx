import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpenCheck } from "lucide-react";

const Navbar = () => {
  return (
    <header className="sticky left-0 z-50 w-full border-slate-500/10 bg-[#f8f5ee] backdrop-blur">
      <div className="mx-auto max-w-7xl h-[60px] px-8 md:px-6">
        <div className="flex items-center justify-between h-full">
          <div className="flex">
            <BookOpenCheck className="text-black w-7 h-7 mr-3" />
            <span className="text-lg font-medium text-black">Clarivue</span>
          </div>
          <Button variant={"link"}>
            Get Started <ArrowRight className=" h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
