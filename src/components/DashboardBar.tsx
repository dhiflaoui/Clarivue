import { BookOpenCheck } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Billing from "./Payment/Billing";
import PricingModal from "./Payment/PricingModel";
import { isValidSubscription } from "@/lib/subscription";
import { Button } from "./ui/button";

const DashboardBar: React.FC = async () => {
  const isSubscribed = await isValidSubscription();
  return (
    <header className="fixed left-0 z-50 w-full border-slate-500/10 bg-[#f8f5ee] backdrop-blur">
      <div className="mx-auto max-w-7xl h-[60px] px-8 md:px-6">
        <div className="flex items-center justify-between h-full">
          <div className="flex ">
            <BookOpenCheck className="text-black w-7 h-7 mr-3" />
            <span className="text-lg font-medium text-black">Clarivue</span>
          </div>
          <div className="flex gap-4">
            {isSubscribed ? <Billing /> : <PricingModal />}
            <Link href="/chats" className="cursor-pointer">
              <Button variant="link">Chats</Button>
            </Link>
            <Link href="/documents" className="cursor-pointer">
              <Button variant="link">Documents</Button>
            </Link>
            <UserButton afterSwitchSessionUrl="/" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardBar;
