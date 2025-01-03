"use client";
import { ArrowLeftRight, History, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HomePageBreadcrumb } from "@/components/governance/shareholding/breadcrumbs";
import SharesInfosCard from "@/components/governance/shareholding/ui/shares-infos-card";
import ShareholdersModal from "@/components/governance/shareholding/modals/shareholders-modal";
import TransferSharesDialog from "@/components/governance/shareholding/modals/transfer-shares-dialog";
import SharesTransfersDialog from "@/components/governance/shareholding/modals/shares-transfers-dialog";
import { FormattedMessage } from "@/components/intl/formatters";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
export default function ShareholdingPage() {
  return (
    <div className="container flex flex-1 flex-col gap-10 overflow-y-auto py-5">
      <div className="flex flex-col gap-10 sm:flex-row sm:items-center sm:justify-between">
        <HomePageBreadcrumb />
        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <ShareholdersModal asChild>
            <Button variant="secondary" className="gap-2">
              <Users />
              <FormattedMessage id="shareholding.shareholders_list_btn" />
            </Button>
          </ShareholdersModal>

          <TransferSharesDialog asChild>
            <Button className="gap-2">
              <ArrowLeftRight />
              <FormattedMessage id="shareholding.transfer_shares_btn" />
            </Button>
          </TransferSharesDialog>

          <Tooltip>
            <SharesTransfersDialog asChild>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <History />
                </Button>
              </TooltipTrigger>
            </SharesTransfersDialog>
            <TooltipContent>
              <FormattedMessage id="shareholding.shares_transfers_history" />
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <SharesInfosCard className="self-center sm:min-w-96 sm:max-w-lg" />
    </div>
  );
}
