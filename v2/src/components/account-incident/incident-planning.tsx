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
import { WorkflowTasksTimeline } from "@/components/shared/workflow-tasks/tasks-timeline";
import { useAllIncidentTasks, useCompleteIncidentTask, useForwardIncidentTask } from "@/lib/account-incident/hooks";
import { useDictionary } from "@/lib/i18n/locale-provider";

function IncidentTasksTimeline({ incidentId, currentTaskId }: { incidentId: string; currentTaskId?: string }) {
  const { t } = useDictionary();
  const ta = t.accountIncident;
  const { data, isLoading, isError } = useAllIncidentTasks(incidentId);
  const { mutateAsync: complete } = useCompleteIncidentTask(incidentId);
  const { mutateAsync: forward } = useForwardIncidentTask(incidentId);

  return (
    <WorkflowTasksTimeline
      tasks={data}
      isLoading={isLoading}
      isError={isError}
      currentTaskId={currentTaskId}
      labels={{
        complete: ta.completeTaskDialog,
        forward: ta.forwardTaskDialog,
        timeline: ta.timeline,
        forwardsHistory: ta.forwardsHistory,
        userSelect: ta.userSelect,
        loadError: t.common.loadError,
      }}
      onComplete={(task, formData) => complete({ taskId: task.id, formData })}
      onForward={(task, args) => forward({ task, args })}
    />
  );
}

export function IncidentPlanningModal({
  incidentId,
  reference,
  currentTaskId,
}: {
  incidentId: string;
  reference?: string;
  currentTaskId?: string;
}) {
  const { t } = useDictionary();
  const ta = t.accountIncident;

  return (
    <Sheet>
      <SheetTrigger render={<Button className="gap-2" />}>
        <GanttChart />
        {ta.details.schedule}
      </SheetTrigger>
      <SheetContent side="left" className="flex w-full flex-col gap-5 sm:w-3/4 sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{ta.planning.title}</SheetTitle>
          <SheetDescription className="line-clamp-1">{reference}</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-auto">
          <IncidentTasksTimeline incidentId={incidentId} currentTaskId={currentTaskId} />
        </div>
        <SheetFooter>
          <SheetClose render={<Button variant="destructive" />}>{ta.planning.close}</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
