"use client";

import { GanttChart } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { TransferTasksTimeline } from "@/components/governance/shareholding/transfer-tasks-timeline";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function TransferTasksTimelineModal({
  transferId,
  reference,
  currentTaskId,
}: {
  transferId: string;
  reference?: string;
  currentTaskId?: string;
}) {
  const { t } = useDictionary();

  return (
    <Sheet>
      <SheetTrigger render={<Button className="gap-2" />}>
        <GanttChart />
        {t.shareholding.transferDetail.plan}
      </SheetTrigger>
      <SheetContent side="left" className="flex w-full flex-col gap-5 sm:w-3/4 sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{t.shareholding.timeline.title}</SheetTitle>
          <SheetDescription className="line-clamp-1">{reference}</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-auto">
          <TransferTasksTimeline transferId={transferId} currentTaskId={currentTaskId} />
        </div>
        <SheetFooter>
          <SheetClose render={<Button variant="destructive" />}>{t.shareholding.timeline.close}</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
