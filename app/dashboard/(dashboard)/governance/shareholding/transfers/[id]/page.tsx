"use client";
import { CheckCheck, EllipsisVertical, Files, GanttChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { notFound } from "next/navigation";
import { useOneSharesTransfer } from "@/services/api-sdk/models/shareholding";
import { SharesTransferDetailsTable } from "@/components/governance/shareholding/tables/shares-transfer-details-table";
import { SharesTransferDetailsPageBreadcrumb } from "@/components/governance/shareholding/breadcrumbs";
import SharesTransferFilesModal from "@/components/governance/shareholding/modals/shares-transfer-files-modal";
import SharesTransferTasksTimelineModal from "@/components/governance/shareholding/modals/shares-transfer-tasks-timeline-modal";
import ApproveSharesTransferDialog from "@/components/governance/shareholding/modals/approve-shares-transfer-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SharesTransferDetailsPageLoading from "./loading";
import { FormattedMessage } from "react-intl";

export default function Page({ params: { id } }) {
  const { data, isLoading, isError } = useOneSharesTransfer(id);
  if (isError) {
    throw new Error("An error occurred while fetching the data");
  }
  if (isLoading) {
    return <SharesTransferDetailsPageLoading />;
  }
  if (!data) {
    notFound();
  }
  return (
    <div className="container flex flex-1 flex-col gap-10 overflow-y-auto py-5">
      <SharesTransferDetailsPageBreadcrumb reference={data.transferNumber} />
      <h1 className="text-center text-2xl font-bold sm:text-3xl md:text-4xl">
        <FormattedMessage
          id="shareholding.transfer_detail_transactionNumber"
          values={{ number: data.transferNumber }}
        />
      </h1>
      <div className="flex flex-row items-center justify-between gap-2">
        <SharesTransferTasksTimelineModal
          asChild
          transferId={data.id}
          reference={data.reference}
          currentTaskId={data.currentTask?.id}
        >
          <Button
            aria-label="Planification de la transaction"
            className="gap-2"
          >
            <GanttChart />
            <FormattedMessage id="shareholding.transfer_detail_planTransaction" />
          </Button>
        </SharesTransferTasksTimelineModal>

        <DropdownMenu>
          <Tooltip>
            <DropdownMenuTrigger asChild className="cursor-pointer sm:hidden">
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Menu"
                  className="gap-2 rounded-full"
                >
                  <EllipsisVertical size={30} />
                </Button>
              </TooltipTrigger>
            </DropdownMenuTrigger>
            <TooltipContent>
              <FormattedMessage id="shareholding.transfer_detail_menu" />
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent>
            {data.status === "validated" && (
              <ApproveSharesTransferDialog
                asChild
                transferId={id}
                buyer={data.buyer}
              >
                <DropdownMenuItem
                  className="cursor-pointer gap-2 sm:hidden"
                  onSelect={(e) => e.preventDefault()}
                >
                  <CheckCheck />
                  <FormattedMessage id="shareholding.transfer_detail_approve" />
                </DropdownMenuItem>
              </ApproveSharesTransferDialog>
            )}

            <SharesTransferFilesModal
              asChild
              transferId={id}
              reference={data.reference}
            >
              <DropdownMenuItem
                className="cursor-pointer gap-2 sm:hidden"
                onSelect={(e) => e.preventDefault()}
              >
                <Files />
                <FormattedMessage id="shareholding.transfer_detail_archives" />
              </DropdownMenuItem>
            </SharesTransferFilesModal>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="hidden items-center justify-between gap-2 sm:flex">
          {data.status === "validated" && (
            <ApproveSharesTransferDialog
              asChild
              transferId={id}
              buyer={data.buyer}
            >
              <Button
                variant="secondary"
                aria-label="Approuver le transfert"
                className="gap-2"
              >
                <CheckCheck />
                <FormattedMessage id="shareholding.transfer_detail_approve" />
              </Button>
            </ApproveSharesTransferDialog>
          )}

          <Tooltip>
            <SharesTransferFilesModal
              asChild
              transferId={id}
              reference={data.reference}
            >
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Archives"
                  className="gap-2 rounded-full"
                >
                  <Files size={30} />
                </Button>
              </TooltipTrigger>
            </SharesTransferFilesModal>
            <TooltipContent>
              <FormattedMessage id="shareholding.transfer_detail_archives" />
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <SharesTransferDetailsTable
        reference={data.reference}
        seller={data.seller}
        buyer={data.buyer}
        shares={data.shares}
        currentTask={data.currentTask}
        transferDate={data.transferDate}
        status={data.status}
      />
    </div>
  );
}
