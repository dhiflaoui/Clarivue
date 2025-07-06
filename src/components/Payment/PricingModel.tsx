import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { currentUser } from "@clerk/nextjs/server";
import PricingTable from "./PricingTable";

const PricingModal = async () => {
  const user = await currentUser();
  if (!user) return null;

  const email = user.emailAddresses[0].emailAddress;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link">🎁 Upgrade</Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl bg-[#f8f5ee]">
        <DialogHeader>
          <DialogTitle className="text-center mb-6">
            Upgrade your account
          </DialogTitle>
        </DialogHeader>

        <PricingTable clientReferenceId={user.id} customerEmail={email} />
      </DialogContent>
    </Dialog>
  );
};

export default PricingModal;
