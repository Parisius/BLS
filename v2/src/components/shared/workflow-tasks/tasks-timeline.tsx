"use client";

import { Fragment, useState } from "react";
import { EllipsisVertical, Forward, SquareCheck, SquareStack } from "lucide-react";
import {
  Timeline,
  TimelineHead,
  TimelineItem,
  TimelineItemContent,
  TimelineItemDot,
  TimelineSeparator,
} from "@/components/ui/timeline";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ForwardsHistoryDialog } from "@/components/shared/forwards-history-dialog";
import { CompleteWorkflowTaskDialog } from "@/components/shared/workflow-tasks/complete-task-dialog";
import { ForwardWorkflowTaskDialog } from "@/components/shared/workflow-tasks/forward-task-dialog";
import type { WorkflowLabels } from "@/components/shared/workflow-tasks/labels";
import { useCurrentUser } from "@/lib/administration/hooks";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { formatDisplayDate } from "@/lib/shared/date-utils";
import { cn } from "@/lib/utils";
import type { ForwardWorkflowTaskArgs, WorkflowTask } from "@/lib/shared/workflow-task";

// Only the original creator (if never forwarded) or the most recent forward's
// receiver may forward the task again.
function canForward(task: WorkflowTask, currentUserId?: string) {
  if (task.forwards.length > 0) {
    return task.forwards[task.forwards.length - 1].receiver.id === currentUserId;
  }
  return task.createdBy === currentUserId;
}

export interface WorkflowMenuAction {
  key: string;
  label: string;
  icon: React.ReactNode;
  destructive?: boolean;
  onSelect: () => void;
}

interface WorkflowTasksTimelineProps {
  tasks?: WorkflowTask[];
  isLoading: boolean;
  isError: boolean;
  /** Only this task can be validated; the backend advances the workflow one step at a time. */
  currentTaskId?: string;
  labels: WorkflowLabels;
  /** Recovery only lets the current step be forwarded; incidents/transfers allow any pending task. */
  restrictForwardToCurrent?: boolean;
  /**
   * Extra dropdown entries for a task (e.g. edit/delete for user-created steps). They are plain actions:
   * the caller owns any dialog state outside the menu, because content rendered inside the menu
   * unmounts as soon as the menu closes.
   */
  extraMenuActions?: (task: WorkflowTask) => WorkflowMenuAction[];
  onComplete: (task: WorkflowTask, formData: FormData) => Promise<void>;
  onForward: (task: WorkflowTask, args: ForwardWorkflowTaskArgs) => Promise<void>;
}

export function WorkflowTasksTimeline({
  tasks,
  isLoading,
  isError,
  currentTaskId,
  labels,
  restrictForwardToCurrent = false,
  extraMenuActions,
  onComplete,
  onForward,
}: WorkflowTasksTimelineProps) {
  const tt = labels.timeline;
  const { data: currentUser } = useCurrentUser();
  const [completingTask, setCompletingTask] = useState<WorkflowTask | null>(null);
  const [forwardingTask, setForwardingTask] = useState<WorkflowTask | null>(null);
  const [historyTask, setHistoryTask] = useState<WorkflowTask | null>(null);
  const [confirmingTask, setConfirmingTask] = useState<WorkflowTask | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  if (isError) return <p className="text-destructive">{labels.loadError}</p>;
  if (isLoading) return <p>{tt.loading}</p>;
  if (!tasks || tasks.length === 0) return <p>{tt.noTasks}</p>;

  return (
    <>
      <Timeline>
        <TimelineSeparator />
        {tasks.map((task, index) => {
          const position = index % 2 === 0 ? "left" : "right";
          const oppositePosition = index % 2 === 0 ? "right" : "left";
          const isCurrent = currentTaskId === task.id;

          return (
            <TimelineItem
              key={task.id}
              className={cn("group", {
                "rounded-md border-4 border-destructive text-destructive": isCurrent,
                "text-foreground/50": task.completed,
              })}
            >
              {!task.completed && (
                <DropdownMenu>
                  <Tooltip>
                    <DropdownMenuTrigger
                      render={
                        <TooltipTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 z-10 rounded-full bg-accent opacity-0 transition duration-500 group-hover:opacity-100"
                            />
                          }
                        />
                      }
                    >
                      <EllipsisVertical />
                    </DropdownMenuTrigger>
                    <TooltipContent>{tt.menu}</TooltipContent>
                  </Tooltip>
                  <DropdownMenuContent>
                    {isCurrent && (
                      <DropdownMenuItem
                        className="gap-2"
                        onClick={() => (task.form.fields.length === 0 ? setConfirmingTask(task) : setCompletingTask(task))}
                      >
                        <SquareCheck />
                        {tt.validate}
                      </DropdownMenuItem>
                    )}

                    {canForward(task, currentUser?.id) && (!restrictForwardToCurrent || isCurrent) && (
                      <DropdownMenuItem className="gap-2" onClick={() => setForwardingTask(task)}>
                        <Forward />
                        {tt.forward}
                      </DropdownMenuItem>
                    )}

                    {task.forwards.length > 0 && (
                      <DropdownMenuItem className="gap-2" onClick={() => setHistoryTask(task)}>
                        <SquareStack />
                        {tt.history}
                      </DropdownMenuItem>
                    )}

                    {extraMenuActions?.(task).map((action, actionIndex) => (
                      <Fragment key={action.key}>
                        {action.destructive && actionIndex > 0 && <DropdownMenuSeparator />}
                        <DropdownMenuItem
                          className={cn("gap-2", { "text-destructive": action.destructive })}
                          onClick={action.onSelect}
                        >
                          {action.icon}
                          {action.label}
                        </DropdownMenuItem>
                      </Fragment>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <TimelineItemDot className={cn({ "border border-secondary bg-background": !task.completed })} />

              <TimelineItemContent position={position}>
                {task.title}
                {task.completed && <p className="text-right text-xs italic">({tt.completed})</p>}
              </TimelineItemContent>

              {task.dueDate && (
                <TimelineItemContent variant="title" position={oppositePosition}>
                  {task.minDueDate
                    ? `${formatDisplayDate(task.minDueDate)} - ${formatDisplayDate(task.dueDate)}`
                    : formatDisplayDate(task.dueDate)}
                </TimelineItemContent>
              )}
            </TimelineItem>
          );
        })}
        <TimelineHead className={cn({ "bg-secondary text-secondary-foreground": tasks.every((task) => task.completed) })}>
          {tt.finish}
        </TimelineHead>
      </Timeline>

      {completingTask && (
        <CompleteWorkflowTaskDialog
          key={completingTask.id}
          task={completingTask}
          open
          onOpenChange={(open) => !open && setCompletingTask(null)}
          onSubmit={(formData) => onComplete(completingTask, formData)}
          labels={labels.complete}
        />
      )}

      {historyTask && (
        <ForwardsHistoryDialog
          forwards={historyTask.forwards}
          labels={labels.forwardsHistory}
          open
          onOpenChange={(open) => !open && setHistoryTask(null)}
        />
      )}

      {confirmingTask && (
        <AlertDialog open onOpenChange={(open) => !open && setConfirmingTask(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{labels.complete.confirmTitle}</AlertDialogTitle>
              <AlertDialogDescription>{labels.complete.confirmDescription}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel type="button">{labels.complete.cancel}</AlertDialogCancel>
              <Button
                type="button"
                disabled={isConfirming}
                onClick={async () => {
                  setIsConfirming(true);
                  try {
                    await onComplete(confirmingTask, new FormData());
                    toast.success(labels.complete.success);
                    setConfirmingTask(null);
                  } catch {
                    toast.error(labels.complete.error);
                  } finally {
                    setIsConfirming(false);
                  }
                }}
              >
                {isConfirming ? "..." : (labels.complete.finish ?? labels.complete.complete)}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {forwardingTask && (
        <ForwardWorkflowTaskDialog
          open
          onOpenChange={(open) => !open && setForwardingTask(null)}
          onSubmit={(args) => onForward(forwardingTask, args)}
          labels={labels.forward}
          userSelectLabels={labels.userSelect}
        />
      )}
    </>
  );
}
