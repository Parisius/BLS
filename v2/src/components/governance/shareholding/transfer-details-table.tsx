"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TransferStatusBadge } from "@/components/governance/shareholding/transfer-status-badge";
import { cn } from "@/lib/utils";
import { formatDisplayDate } from "@/lib/shared/date-utils";
import { useDictionary } from "@/lib/i18n/locale-provider";
import type { SharesTransfer } from "@/lib/governance/shareholding/transfers";

export function TransferDetailsTable({ transfer }: { transfer: SharesTransfer }) {
  const { t } = useDictionary();
  const td = t.shareholding.transferDetail;
  const { currentTask } = transfer;

  return (
    <Table className="border">
      <TableHeader>
        <TableRow>
          <TableHead>{td.reference}</TableHead>
          <TableHead>{td.seller}</TableHead>
          <TableHead>{td.buyer}</TableHead>
          <TableHead>{td.sharesCount}</TableHead>
          <TableHead>{td.transferDate}</TableHead>
          <TableHead className={cn(currentTask && "text-destructive")}>{td.nextTask}</TableHead>
          <TableHead className={cn(currentTask && "text-destructive")}>{td.nextDeadline}</TableHead>
          <TableHead>{td.status}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="bg-card">
          <TableCell>{transfer.reference ?? "-"}</TableCell>
          <TableCell>{transfer.seller.name}</TableCell>
          <TableCell>{transfer.buyer.name}</TableCell>
          <TableCell>{transfer.shares}</TableCell>
          <TableCell>{formatDisplayDate(transfer.transferDate)}</TableCell>
          <TableCell className={cn("max-w-32", currentTask && "text-destructive")}>
            {currentTask?.title ?? td.noTask}
          </TableCell>
          <TableCell className={cn(currentTask && "text-destructive")}>
            {currentTask?.dueDate ? formatDisplayDate(currentTask.dueDate) : td.noDeadline}
          </TableCell>
          <TableCell>
            <TransferStatusBadge status={transfer.status} />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
