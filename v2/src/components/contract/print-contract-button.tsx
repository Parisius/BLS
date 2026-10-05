"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { usePrintContract } from "@/lib/contract/hooks";
import { downloadBytes } from "@/lib/shared/download";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function PrintContractButton({ contractId }: { contractId: string }) {
  const { t } = useDictionary();
  const { mutate, isPending } = usePrintContract(contractId);

  const handlePrint = () =>
    mutate(undefined, {
      onSuccess: ({ bytes, filename }) => downloadBytes(bytes, filename),
      onError: () => toast.error(t.contract.detailsTable.printError),
    });

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
