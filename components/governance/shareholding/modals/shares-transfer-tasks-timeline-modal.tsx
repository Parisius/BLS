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
import SharesTransferTasksTimeline from "@/components/governance/shareholding/ui/shares-transfer-tasks-timeline";
import { FormattedMessage } from "react-intl";

export default function SharesTransferTasksTimelineModal({
  transferId,
  reference,
  currentTaskId,
  ...props
}) {
  return (
    <Sheet>
      <SheetTrigger {...props} />
      <SheetContent
        side="left"
        className="flex w-full flex-col gap-5 sm:w-3/4 sm:max-w-xl"
      >
        <SheetHeader>
          <SheetTitle>
            <FormattedMessage id="shareholding.transfert_timeline_planification" />
          </SheetTitle>
          <SheetDescription className="line-clamp-1">
            {reference}
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-auto">
          <SharesTransferTasksTimeline
            transferId={transferId}
            currentTaskId={currentTaskId}
          />
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="destructive">
              <FormattedMessage id="shareholding.transfert_timeline_close" />
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
