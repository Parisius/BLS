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
import AddLitigationTaskDialog from "@/components/litigation/modals/add-litigation-task-dialog";
import LitigationTasksTimeline from "@/components/litigation/ui/litigation-tasks-timeline";
import { FormattedMessage } from "react-intl";

export default function LitigationTasksTimelineModal({
  litigationId,
  litigationTitle,
  nextStepId,
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
              <FormattedMessage id="litigation.litigation.tasks.sheetTitle" />
            </SheetTitle>
            <AddLitigationTaskDialog asChild litigationId={litigationId}>
              <Button className="hidden gap-2 sm:inline-flex">
                <ListTodo />
                <FormattedMessage id="litigation.litigation.tasks.addTask" />
              </Button>
            </AddLitigationTaskDialog>
          </div>
          <SheetDescription className="line-clamp-1">
            {litigationTitle}
          </SheetDescription>
          <AddLitigationTaskDialog asChild litigationId={litigationId}>
            <Button className="sm gap-2 sm:hidden">
              <ListTodo />
              <FormattedMessage id="litigation.litigation.tasks.addTask" />
            </Button>
          </AddLitigationTaskDialog>
        </SheetHeader>
        <div className="flex-1 overflow-auto">
          <LitigationTasksTimeline
            litigationId={litigationId}
            nextStepId={nextStepId}
          />
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="destructive">
              <FormattedMessage id="litigation.litigation.tasks.close" />
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
