"use client";

import { useState } from "react";
import { toast } from "sonner";
import { GanttChart, Pencil, Trash } from "lucide-react";
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
import { DeleteStepDialog, StepFormDialog } from "@/components/shared/workflow-tasks/step-dialogs";
import type { StepsPlanningLabels } from "@/components/shared/workflow-tasks/labels";
import type { StepFormValues } from "@/lib/shared/step-form";
import type { ForwardWorkflowTaskArgs, WorkflowTask } from "@/lib/shared/workflow-task";

export interface StepsPlanningSheetProps {
  reference?: string;
  /** The step the backend expects to be worked on next; only it can be validated/forwarded. */
  nextStepId?: string;
  tasks?: WorkflowTask[];
  isLoading: boolean;
  isError: boolean;
  labels: StepsPlanningLabels;
  onCreate: (values: StepFormValues) => Promise<void>;
  onUpdate: (step: WorkflowTask, values: StepFormValues) => Promise<void>;
  onDelete: (step: WorkflowTask) => Promise<void>;
  onComplete: (step: WorkflowTask, formData: FormData) => Promise<void>;
  onForward: (step: WorkflowTask, args: ForwardWorkflowTaskArgs) => Promise<void>;
}

/**
 * "Planifier" sheet shared by the modules whose backend has a step timeline with user-created steps
 * (recovery, safeties): validate/forward system steps, add/edit/delete custom ones.
 */
export function StepsPlanningSheet({
  reference,
  nextStepId,
  tasks,
  isLoading,
  isError,
  labels,
  onCreate,
  onUpdate,
  onDelete,
  onComplete,
  onForward,
}: StepsPlanningSheetProps) {
  const [adding, setAdding] = useState(false);
  const [editingStep, setEditingStep] = useState<WorkflowTask | null>(null);
  const [deletingStep, setDeletingStep] = useState<WorkflowTask | null>(null);

  return (
    <Sheet>
      <SheetTrigger render={<Button className="gap-2" />}>
        <GanttChart />
        {labels.plan}
      </SheetTrigger>
      <SheetContent side="left" className="flex w-full flex-col gap-5 sm:w-3/4 sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{labels.planning.title}</SheetTitle>
          <SheetDescription className="line-clamp-1">{reference}</SheetDescription>
        </SheetHeader>
        <div className="flex justify-end">
          <Button className="gap-2" onClick={() => setAdding(true)}>
            {labels.planning.addStep}
          </Button>
        </div>
        <div className="flex-1 overflow-auto">
          <WorkflowTasksTimeline
            tasks={tasks}
            isLoading={isLoading}
            isError={isError}
            currentTaskId={nextStepId}
            restrictForwardToCurrent
            labels={labels}
            extraMenuActions={(step) =>
              step.kind === "task"
                ? [
                    { key: "edit", label: labels.deleteStep.edit, icon: <Pencil />, onSelect: () => setEditingStep(step) },
                    {
                      key: "delete",
                      label: labels.deleteStep.menu,
                      icon: <Trash />,
                      destructive: true,
                      onSelect: () => setDeletingStep(step),
                    },
                  ]
                : []
            }
            onComplete={onComplete}
            onForward={onForward}
          />
        </div>
        <SheetFooter>
          <SheetClose render={<Button variant="destructive" />}>{labels.planning.close}</SheetClose>
        </SheetFooter>

        <StepFormDialog mode="add" open={adding} onOpenChange={setAdding} onSubmit={onCreate} labels={labels.stepDialog} />
        {editingStep && (
          <StepFormDialog
            key={editingStep.id}
            mode="edit"
            open
            onOpenChange={(open) => !open && setEditingStep(null)}
            defaults={{ title: editingStep.title, dueDate: (editingStep.dueDate ?? "").slice(0, 10) }}
            onSubmit={(values) => onUpdate(editingStep, values)}
            labels={labels.stepDialog}
          />
        )}
        {deletingStep && (
          <DeleteStepDialog
            labels={labels.deleteStep}
            onConfirm={() =>
              onDelete(deletingStep).then(
                () => toast.success(labels.deleteStep.success),
                () => toast.error(labels.deleteStep.error),
              )
            }
            onClose={() => setDeletingStep(null)}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
