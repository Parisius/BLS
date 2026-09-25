"use client";

import { Files } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FilesSheet } from "@/components/shared/files-sheet";
import { useDictionary } from "@/lib/i18n/locale-provider";
import type { SharesTransfer } from "@/lib/governance/shareholding/transfers";

export function TransferFilesModal({ transfer }: { transfer: SharesTransfer }) {
  const { t } = useDictionary();
  const tf = t.shareholding.files;

  return (
    <Tooltip>
      <FilesSheet
        trigger={<TooltipTrigger render={<Button variant="ghost" size="icon" aria-label={tf.title} className="gap-2 rounded-full" />} />}
        description={transfer.reference}
        files={transfer.files}
        labels={tf}
      >
        <Files size={30} />
      </FilesSheet>
      <TooltipContent>{tf.title}</TooltipContent>
    </Tooltip>
  );
}
