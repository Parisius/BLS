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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import RenewMandateDialog from "@/components/governance/management-committee/modals/renew-mandate-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Pencil, Repeat } from "lucide-react";
import { UpdateMandateDialog } from "@/components/governance/management-committee/modals/update-mandate-dialog";
import { FormattedMessage } from "react-intl";

export default function MandatesDialog({ directorId, mandates, ...props }) {
  return (
    <Dialog>
      <DialogTrigger {...props} />
      <DialogContent className="flex max-h-screen max-w-xl flex-col">
        <DialogHeader>
          <DialogTitle>
            <FormattedMessage id="managementCommittee.mandateHistoryTitle" />
          </DialogTitle>
          <DialogDescription>
            <FormattedMessage id="managementCommittee.mandateHistoryDescription" />
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 space-y-5 overflow-auto">
          {mandates?.map(
            ({ id, startDate, endDate, renewalDate, status }, index) => (
              <Card key={id}>
                <CardHeader className="flex-row items-center justify-between">
                  <Badge
                    className={cn({
                      "bg-primary text-primary-foreground": status === "active",
                      "bg-muted text-muted-foreground": status === "expired",
                    })}
                  >
                    {status === "active" ? (
                      <FormattedMessage id="managementCommittee.mandateStatusActive" />
                    ) : (
                      <FormattedMessage id="managementCommittee.mandateStatusExpired" />
                    )}
                  </Badge>
                  {index === 0 && (
                    <div className="flex items-center">
                      {status === "expired" && (
                        <Tooltip>
                          <RenewMandateDialog
                            asChild
                            directorId={directorId}
                            defaultRenewalDate={
                              index > 0
                                ? mandates[index - 1].renewalDate
                                : undefined
                            }
                          >
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="rounded-full"
                              >
                                <Repeat size={16} />
                              </Button>
                            </TooltipTrigger>
                          </RenewMandateDialog>
                          <TooltipContent>
                            <FormattedMessage id="managementCommittee.renewTooltip" />
                          </TooltipContent>
                        </Tooltip>
                      )}

                      <Tooltip>
                        <UpdateMandateDialog asChild mandateId={id}>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="rounded-full"
                            >
                              <Pencil size={16} />
                            </Button>
                          </TooltipTrigger>
                        </UpdateMandateDialog>
                        <TooltipContent>
                          <FormattedMessage id="managementCommittee.editTooltip" />
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex items-center justify-between gap-5">
                    <span className="font-semibold">
                      <FormattedMessage id="managementCommittee.startDateLabel" />
                    </span>
                    <span className="italic text-muted-foreground">
                      {formatDate(startDate)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-5">
                    <span className="font-semibold">
                      <FormattedMessage id="managementCommittee.endDateLabel" />
                    </span>
                    <span className="italic text-muted-foreground">
                      {formatDate(endDate)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-5">
                    <span className="font-semibold">
                      <FormattedMessage id="managementCommittee.renewalDateLabel" />
                    </span>
                    <span className="italic text-muted-foreground">
                      {formatDate(renewalDate)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="destructive">
              <FormattedMessage id="managementCommittee.closeButton" />
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
