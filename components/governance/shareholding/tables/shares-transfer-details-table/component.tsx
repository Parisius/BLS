"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate } from "@/lib/utils";
import { getSharesTransferStatus } from "@/lib/governance/shareholding";
import React from "react";
import { FormattedMessage } from "react-intl";

export function SharesTransferDetailsTable({
  reference,
  seller,
  buyer,
  status,
  shares,
  transferDate,
  currentTask,
}) {
  return (
    <Table className="border">
      <TableHeader>
        <TableRow>
          <TableHead>
            <FormattedMessage id="shareholding.transfer_detail_reference" />
          </TableHead>
          <TableHead>
            <FormattedMessage id="shareholding.transfer_detail_seller" />
          </TableHead>
          <TableHead>
            <FormattedMessage id="shareholding.transfer_detail_buyer" />
          </TableHead>
          <TableHead>
            <FormattedMessage id="shareholding.transfer_detail_sharesCount" />
          </TableHead>
          <TableHead>
            <FormattedMessage id="shareholding.transfer_detail_transferDate" />
          </TableHead>
          <TableHead className={cn(currentTask && "text-destructive")}>
            <FormattedMessage id="shareholding.transfer_detail_nextTask" />
          </TableHead>
          <TableHead className={cn(currentTask && "text-destructive")}>
            <FormattedMessage id="shareholding.transfer_detail_nextDeadline" />
          </TableHead>
          <TableHead>
            <FormattedMessage id="shareholding.transfer_detail_status" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="bg-card">
          <TableCell>{reference}</TableCell>
          <TableCell>{seller.name}</TableCell>
          <TableCell>{buyer.name}</TableCell>
          <TableCell>
            {shares}{" "}
            <FormattedMessage
              id="shareholding.transfer_detail_shares"
              values={{ count: shares }}
            />
          </TableCell>
          <TableCell>{formatDate(transferDate)}</TableCell>
          <TableCell
            className={cn("max-w-32", currentTask && "text-destructive")}
          >
            {currentTask?.title ?? (
              <FormattedMessage id="shareholding.transfer_detail_noTask" />
            )}
          </TableCell>
          <TableCell className={cn(currentTask && "text-destructive")}>
            {currentTask?.dueDate ? (
              formatDate(currentTask.dueDate)
            ) : (
              <FormattedMessage id="shareholding.transfer_detail_noDeadline" />
            )}
          </TableCell>
          <TableCell>
            <Badge
              className={cn("text-nowrap bg-muted text-muted-foreground", {
                "bg-accent text-accent-foreground": status === "pending",
                "bg-destructive text-destructive-foreground":
                  status === "rejected",
                "bg-primary text-primary-foreground": status === "approved",
                "bg-secondary text-secondary-foreground":
                  status === "validated",
              })}
            >
              {getSharesTransferStatus(status)}
            </Badge>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
