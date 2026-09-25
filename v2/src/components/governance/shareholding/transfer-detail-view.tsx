"use client";

import { notFound } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { ApproveTransferDialog } from "@/components/governance/shareholding/approve-transfer-dialog";
import { TransferDetailsTable } from "@/components/governance/shareholding/transfer-details-table";
import { TransferFilesModal } from "@/components/governance/shareholding/transfer-files-modal";
import { TransferTasksTimelineModal } from "@/components/governance/shareholding/transfer-tasks-timeline-modal";
import { useOneTransfer } from "@/lib/governance/shareholding/hooks";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function TransferDetailView({ transferId }: { transferId: string }) {
  const { data, isLoading, isError } = useOneTransfer(transferId);
  const { t } = useDictionary();

  if (isError) return <p className="text-center text-destructive">{t.common.loadError}</p>;
  if (isLoading) {
    return (
      <div className="flex flex-col gap-10">
        <Skeleton className="mx-auto h-10 w-64" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }
  if (!data) notFound();

  return (
    <>
      <h1 className="text-center text-2xl font-bold sm:text-3xl md:text-4xl">
        {t.shareholding.transferDetail.transactionNumber} {data.transferNumber}
      </h1>
      <div className="flex flex-row items-center justify-between gap-2">
        <TransferTasksTimelineModal
          transferId={data.id}
          reference={data.reference}
          currentTaskId={data.currentTask?.id}
        />
        <div className="flex items-center justify-between gap-2">
          {data.status === "validated" && <ApproveTransferDialog transferId={data.id} buyerName={data.buyer.name} />}
          <TransferFilesModal transfer={data} />
        </div>
      </div>
      <TransferDetailsTable transfer={data} />
    </>
  );
}
