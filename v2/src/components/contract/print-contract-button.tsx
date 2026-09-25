"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { usePrintContract } from "@/lib/contract/hooks";
import { downloadBytes } from "@/lib/shared/download";

export function PrintContractButton({ contractId }: { contractId: string }) {
  const { mutateAsync, isPending } = usePrintContract(contractId);

  const handlePrint = async () => {
    await mutateAsync(undefined, {
      onSuccess: ({ bytes, filename }) => downloadBytes(bytes, filename),
      onError: () => toast.error("Une erreur s'est produite lors de l'impression du dossier."),
    });
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="rounded-full"
      disabled={isPending}
      onClick={handlePrint}
    >
      <Printer className={isPending ? "animate-bounce" : undefined} />
    </Button>
  );
}
