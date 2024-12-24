"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, formatDate } from "@/lib/utils";
import { MoveRight } from "lucide-react";
import { useAllSharesTransfers } from "@/services/api-sdk/models/shareholding";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ShareholdingRoutes } from "@/config/routes";
import { FormattedMessage } from "react-intl";

/**
 * Get the status of a shares transfer.
 * @param status - The status of the shares transfer.
 * @returns The status of the shares transfer as a string.
 */
const getSharesTransferStatus = (status: string) => {
  switch (status) {
    case "pending":
      return <FormattedMessage id="status_pending" defaultMessage="Pending" />;
    case "rejected":
      return (
        <FormattedMessage id="status_rejected" defaultMessage="Rejected" />
      );
    case "cancelled":
      return (
        <FormattedMessage id="status_cancelled" defaultMessage="Cancelled" />
      );
    case "validated":
      return (
        <FormattedMessage id="status_validated" defaultMessage="Validated" />
      );
    case "approved":
      return (
        <FormattedMessage id="status_approved" defaultMessage="Transferred" />
      );
    default:
      return (
        <FormattedMessage id="status_unknown" defaultMessage="Undefined" />
      );
  }
};

export default function SharesTransfersDialog(props) {
  const { data, isLoading, isError } = useAllSharesTransfers();

  return (
    <Dialog>
      <DialogTrigger disabled={!data || data.length === 0} {...props} />
      <DialogContent className="flex max-h-screen max-w-xl flex-col">
        <DialogHeader>
          <DialogTitle>
            <FormattedMessage
              id="transfer_history_title"
              defaultMessage="Transfer History"
            />
          </DialogTitle>
          <DialogDescription>
            <FormattedMessage
              id="transfer_history_description"
              defaultMessage="Transfer history of shares"
            />
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 space-y-5 overflow-auto">
          {!data && isLoading && (
            <p className="italic text-muted-foreground">
              <FormattedMessage id="loading" defaultMessage="Loading..." />
            </p>
          )}
          {!data && isError && (
            <p className="italic text-destructive">
              <FormattedMessage
                id="loading_error"
                defaultMessage="Error loading data"
              />
            </p>
          )}
          {data?.map(
            ({ id, seller, buyer, shares, transferDate, status, type }) => (
              <Card key={id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle>
                      {shares}{" "}
                      <FormattedMessage
                        id="shares_count"
                        defaultMessage="share{shares, plural, one {} other {s}}"
                        values={{ shares }}
                      />
                    </CardTitle>
                    <Badge
                      className={cn(
                        "text-nowrap bg-muted text-muted-foreground",
                        {
                          "bg-accent text-accent-foreground":
                            status === "pending",
                          "bg-destructive text-destructive-foreground":
                            status === "rejected",
                          "bg-primary text-primary-foreground":
                            status === "approved",
                          "bg-secondary text-secondary-foreground":
                            status === "validated",
                        }
                      )}
                    >
                      {getSharesTransferStatus(status)}
                    </Badge>
                  </div>
                  <CardDescription className="space-x-5 text-lg">
                    <span className="text-destructive">{seller.name}</span>
                    <MoveRight className="inline" />
                    <span className="text-secondary">{buyer.name}</span>
                  </CardDescription>
                  <div className="flex items-center justify-between gap-2">
                    <CardDescription className="italic">
                      <FormattedMessage
                        id="transferred_on"
                        defaultMessage="Transferred on {date}"
                        values={{ date: formatDate(transferDate) }}
                      />
                    </CardDescription>
                    {type === "tier" && (
                      <Button
                        asChild
                        variant="link"
                        className="gap-2 px-0 italic"
                      >
                        <Link
                          href={ShareholdingRoutes.sharesTransferPage(id).index}
                        >
                          <FormattedMessage
                            id="view_details"
                            defaultMessage="View details"
                          />{" "}
                          <MoveRight />
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardHeader>
              </Card>
            )
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="destructive">
              <FormattedMessage id="close" defaultMessage="Close" />
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
