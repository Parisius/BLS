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
import RecoveryStepsTimeline from "@/components/recovery/ui/recovery-steps-timeline";
import { ListTodo } from "lucide-react";
import AddRecoveryStepDialog from "@/components/recovery/modals/add-recovery-step-dialog";
import { useIntl } from "react-intl";

export default function RecoveryStepsTimelineModal({
  recoveryId,
  recoveryTitle,
  nextStepId,
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
              {intl.formatMessage({ id: "recovery.recoveryPlanning" })}
            </SheetTitle>
            <AddRecoveryStepDialog asChild recoveryId={recoveryId}>
              <Button className="hidden gap-2 sm:inline-flex">
                <ListTodo />
                {intl.formatMessage({ id: "recovery.addTask" })}
              </Button>
            </AddRecoveryStepDialog>
          </div>
          <SheetDescription className="line-clamp-1">
            {recoveryTitle}
          </SheetDescription>
          <AddRecoveryStepDialog asChild recoveryId={recoveryId}>
            <Button className="sm gap-2 sm:hidden">
              <ListTodo />
              {intl.formatMessage({ id: "recovery.addTask" })}
            </Button>
          </AddRecoveryStepDialog>
        </SheetHeader>
        <div className="flex-1 overflow-auto">
          <RecoveryStepsTimeline
            recoveryId={recoveryId}
            nextStepId={nextStepId}
          />
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="destructive">
              {intl.formatMessage({ id: "recovery.close" })}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
