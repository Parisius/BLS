"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import React from "react";
import { ListTodo } from "lucide-react";
import ContractEventsTimeline from "@/components/contract/ui/contract-events-timeline";
import AddContractEventDialog from "@/components/contract/modals/add-contract-event-dialog";
import { useIntl } from "react-intl";

export default function ContractEventsTimelineModal({
  contractId,
  contractTitle,
  contractSignatureDate,
  contractEffectiveDate,
  contractExpirationDate,
  contractRenewalDate,
  ...props
}) {
  const intl = useIntl();

  return (
    <Sheet>
      <SheetTrigger {...props} />
      <SheetContent
        side="left"
        className="flex w-full flex-col gap-5 sm:w-3/4 sm:max-w-xl"
      >
        <SheetHeader>
          <div className="sm:flex sm:items-center sm:justify-between">
            <SheetTitle>
              {intl.formatMessage({ id: "contract.contract.events.title" })}
            </SheetTitle>
            <AddContractEventDialog asChild contractId={contractId}>
              <Button className="hidden gap-2 sm:inline-flex">
                <ListTodo />
                {intl.formatMessage({
                  id: "contract.contract.events.addEventButton",
                })}
              </Button>
            </AddContractEventDialog>
          </div>
          <SheetDescription className="line-clamp-1">
            {contractTitle}
          </SheetDescription>
          <AddContractEventDialog asChild contractId={contractId}>
            <Button className="sm gap-2 sm:hidden">
              <ListTodo />
              {intl.formatMessage({
                id: "contract.contract.events.addEventButton",
              })}
            </Button>
          </AddContractEventDialog>
        </SheetHeader>
        <div className="flex-1 overflow-auto">
          <ContractEventsTimeline
            contractId={contractId}
            signatureDate={contractSignatureDate}
            effectiveDate={contractEffectiveDate}
            expirationDate={contractExpirationDate}
            renewalDate={contractRenewalDate}
          />
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="destructive">
              {intl.formatMessage({ id: "contract.contract.events.close" })}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
