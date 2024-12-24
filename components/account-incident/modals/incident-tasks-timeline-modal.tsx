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
import IncidentTasksTimeline from "@/components/account-incident/ui/incident-tasks-timeline";
export default function IncidentTasksTimelineModal({
  incidentId,
  incidentTitle,
  incidentCompleted,
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
          <SheetTitle>Planification de l&apos;incident</SheetTitle>
          <SheetDescription className="line-clamp-1">
            {incidentTitle}
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-auto">
          <IncidentTasksTimeline
            incidentId={incidentId}
            incidentCompleted={incidentCompleted}
            currentTaskId={currentTaskId}
          />
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="destructive">Fermer</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
