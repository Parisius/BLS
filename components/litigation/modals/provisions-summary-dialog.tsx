"use client";
import { Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useLitigationProvisionsSummary } from "@/services/api-sdk/models/litigation";
import { formatAmount } from "@/lib/utils";
import { useIntl } from "react-intl";

export default function ProvisionsSummaryDialog(props) {
  const { data, isLoading, isError } = useLitigationProvisionsSummary();
  const intl = useIntl();

  return (
    <Dialog>
      <DialogTrigger {...props} />
      <DialogContent className="flex max-h-screen max-w-lg flex-col">
        <DialogHeader>
          <DialogTitle>
            {intl.formatMessage({
              id: "litigation.litigation.provisionsSummaryTitle",
            })}{" "}
          </DialogTitle>
          <DialogDescription>
            {intl.formatMessage({
              id: "litigation.litigation.provisionsSummaryDescription",
            })}{" "}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 space-y-10 overflow-auto">
          {!data && isLoading && (
            <p className="italic text-muted-foreground">
              {intl.formatMessage({
                id: "litigation.litigation.loadingProvisions",
              })}{" "}
            </p>
          )}

          {!data && isError && (
            <p className="italic text-destructive">
              {intl.formatMessage({
                id: "litigation.litigation.errorLoadingProvisions",
              })}{" "}
            </p>
          )}

          {data && (
            <>
              <div className="flex items-center justify-between gap-5">
                <div className="flex items-center gap-1 font-semibold">
                  <Banknote />
                  <span>
                    {intl.formatMessage({
                      id: "litigation.litigation.totalConstitutedAmount",
                    })}{" "}
                  </span>
                </div>
                <span className="italic text-muted-foreground">
                  {formatAmount(data.totalEstimatedAmount)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-5">
                <div className="flex items-center gap-1 font-semibold">
                  <Banknote />
                  <span>
                    {intl.formatMessage({
                      id: "litigation.litigation.totalToConstituteAmount",
                    })}{" "}
                  </span>
                </div>
                <span className="italic text-muted-foreground">
                  {formatAmount(data.totalAddedAmount)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-5">
                <div className="flex items-center gap-1 font-semibold">
                  <Banknote />
                  <span>
                    {intl.formatMessage({
                      id: "litigation.litigation.totalAmount",
                    })}{" "}
                  </span>
                </div>
                <span className="italic text-muted-foreground">
                  {formatAmount(
                    data.totalAddedAmount + data.totalEstimatedAmount
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between gap-5">
                <div className="flex items-center gap-1 font-semibold">
                  <Banknote />
                  <span>
                    {intl.formatMessage({
                      id: "litigation.litigation.totalRecoveredAmount",
                    })}{" "}
                  </span>
                </div>
                <span className="italic text-muted-foreground">
                  {formatAmount(data.totalRemainingAmount)}
                </span>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="destructive">
              {intl.formatMessage({ id: "litigation.litigation.closeButton" })}{" "}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
