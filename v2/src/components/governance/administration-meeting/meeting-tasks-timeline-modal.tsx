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
import { MeetingTasksTimeline } from "@/components/governance/administration-meeting/meeting-tasks-timeline";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function MeetingTasksTimelineModal({ meetingId }: { meetingId: string }) {
  const { t } = useDictionary();
  const tg = t.administrationMeeting;

  return (
    <Sheet>
      <SheetTrigger render={<Button className="gap-2" />}>
        <GanttChart />
        {tg.currentMeetingView.plan}
      </SheetTrigger>
      <SheetContent side="left" className="flex w-full flex-col gap-5 overflow-y-auto sm:w-3/4 sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{tg.timelineModal.title}</SheetTitle>
          <SheetDescription />
        </SheetHeader>
        <MeetingTasksTimeline meetingId={meetingId} />
        <SheetFooter>
          <SheetClose render={<Button variant="destructive" />}>{tg.timelineModal.close}</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
