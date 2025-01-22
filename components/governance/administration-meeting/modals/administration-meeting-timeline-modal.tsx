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
import AddTaskDialog from "@/components/governance/administration-meeting/modals/add-task-dialog";
import GeneralMeetingTimeline from "@/components/governance/administration-meeting/ui/administration-meeting-timeline";
import { FormattedMessage } from "react-intl";
export default function AdministrationMeetingTimelineModal({
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
              <FormattedMessage id="sessionAdministrator.administration_Meeting_Timeline_Title" />
            </SheetTitle>
            <AddTaskDialog asChild meetingId={meetingId}>
              <Button className="hidden gap-2 sm:inline-flex">
                <ListTodo />
                <FormattedMessage id="sessionAdministrator.administration_Meeting_Timeline_Add_TaskButton" />
              </Button>
            </AddTaskDialog>
          </div>
          <SheetDescription>{meetingTitle}</SheetDescription>
          <AddTaskDialog asChild meetingId={meetingId}>
            <Button className="sm gap-2 sm:hidden">
              <ListTodo />
              <FormattedMessage id="sessionAdministrator.administration_Meeting_Timeline_Add_TaskButton" />
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
              <FormattedMessage id="sessionAdministrator.administration_Meeting_Timeline_Close_Button" />
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
