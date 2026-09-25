"use client";

import { useState } from "react";
import { GanttChart, Plus } from "lucide-react";
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
import { ContractEventsTimeline } from "@/components/contract/contract-events-timeline";
import { AddContractEventDialog } from "@/components/contract/event-dialogs";
import { useDictionary } from "@/lib/i18n/locale-provider";
import type { Contract } from "@/lib/contract/contracts";

export function ContractEventsTimelineModal({ contract }: { contract: Contract }) {
  const [addingEvent, setAddingEvent] = useState(false);
  const { t } = useDictionary();
  const tc = t.contract;

  return (
    <>
      <Sheet>
        <SheetTrigger render={<Button className="gap-2" />}>
          <GanttChart />
          {tc.detailsPage.schedule}
        </SheetTrigger>
        <SheetContent side="left" className="flex w-full flex-col gap-5 overflow-y-auto sm:w-3/4 sm:max-w-2xl">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle>{tc.events.title}</SheetTitle>
              <Button size="sm" className="gap-2" onClick={() => setAddingEvent(true)}>
                <Plus />
                <span className="sr-only sm:not-sr-only">{tc.events.addEventButton}</span>
              </Button>
            </div>
            <SheetDescription className="line-clamp-1">{contract.title}</SheetDescription>
          </SheetHeader>

          <div className="flex-1">
            <ContractEventsTimeline contract={contract} />
          </div>

          <SheetFooter>
            <SheetClose render={<Button variant="destructive" />}>{tc.events.close}</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AddContractEventDialog contractId={contract.id} open={addingEvent} onOpenChange={setAddingEvent} />
    </>
  );
}
