"use client";

import { ArrowLeftRight, History, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ShareholdersModal } from "@/components/governance/shareholding/shareholders-ui";
import { TransferSharesDialog } from "@/components/governance/shareholding/transfer-shares-dialog";
import { TransfersHistoryDialog } from "@/components/governance/shareholding/transfers-history-dialog";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function ShareholdingActions() {
  const { t } = useDictionary();
  const th = t.shareholding.hub;

  return (
    <div className="flex flex-col items-center gap-2 sm:flex-row">
      <ShareholdersModal trigger={<Button variant="secondary" className="gap-2" />}>
        <Users />
        {th.shareholdersList}
      </ShareholdersModal>

      <TransferSharesDialog trigger={<Button className="gap-2" />}>
        <ArrowLeftRight />
        {th.transferShares}
      </TransferSharesDialog>

      <Tooltip>
        <TransfersHistoryDialog
          trigger={<TooltipTrigger render={<Button variant="ghost" size="icon" aria-label={th.transfersHistory} />} />}
        >
          <History />
        </TransfersHistoryDialog>
        <TooltipContent>{th.transfersHistory}</TooltipContent>
      </Tooltip>
    </div>
  );
}
