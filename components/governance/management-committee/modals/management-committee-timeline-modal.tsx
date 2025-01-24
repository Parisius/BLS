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
import AddTaskDialog from "@/components/governance/management-committee/modals/add-task-dialog";
import ManagementCommitteeTimeline from "@/components/governance/management-committee/ui/management-committee-timeline";
import { useIntl } from "react-intl";

export default function ManagementCommitteeTimelineModal({
  meetingId,
  meetingDate,
  meetingTitle,
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
              {intl.formatMessage({ id: "managementCommittee.timeline.title" })}
            </SheetTitle>
            <AddTaskDialog asChild meetingId={meetingId}>
              <Button className="hidden gap-2 sm:inline-flex">
                <ListTodo />
                {intl.formatMessage({
                  id: "managementCommittee.timeline.addTaskButton",
                })}
              </Button>
            </AddTaskDialog>
          </div>
          <SheetDescription>{meetingTitle}</SheetDescription>
          <AddTaskDialog asChild meetingId={meetingId}>
            <Button className="gap-2 sm:hidden">
              <ListTodo />
              {intl.formatMessage({
                id: "managementCommittee.timeline.addTaskButton",
              })}
            </Button>
          </AddTaskDialog>
        </SheetHeader>
        <div className="flex-1 overflow-auto">
          <ManagementCommitteeTimeline
            meetingId={meetingId}
            meetingDate={meetingDate}
          />
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="destructive">
              {intl.formatMessage({
                id: "managementCommittee.timeline.closeButton",
              })}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
