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
import GeneralMeetingTimeline from "@/components/governance/general-meeting/ui/general-meeting-timeline";
import { ListTodo } from "lucide-react";
import AddTaskDialog from "@/components/governance/general-meeting/modals/add-task-dialog";
import { FormattedMessage } from "react-intl";
export default function GeneralMeetingTimelineModal({
  meetingId,
  meetingDate,
  meetingTitle,
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
          <div className="sm:flex sm:items-center sm:justify-between">
            <SheetTitle>
              {" "}
              <FormattedMessage id="generalMeeting.timeline_modal_title" />
            </SheetTitle>
            <AddTaskDialog asChild meetingId={meetingId}>
              <Button className="hidden gap-2 sm:inline-flex">
                <ListTodo />
                <FormattedMessage id="generalMeeting.timeline_modal_add_task" />
              </Button>
            </AddTaskDialog>
          </div>
          <SheetDescription className="line-clamp-1">
            {meetingTitle}
          </SheetDescription>
          <AddTaskDialog asChild meetingId={meetingId}>
            <Button className="sm gap-2 sm:hidden">
              <ListTodo />
              <FormattedMessage id="generalMeeting.timeline_modal_add_task" />
            </Button>
          </AddTaskDialog>
        </SheetHeader>
        <div className="flex-1 overflow-auto">
          <GeneralMeetingTimeline
            meetingId={meetingId}
            meetingDate={meetingDate}
          />
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="destructive">
              {" "}
              <FormattedMessage id="generalMeeting.timeline_modal_close" />
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
