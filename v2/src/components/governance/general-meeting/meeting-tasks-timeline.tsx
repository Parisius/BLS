"use client";

import { useState } from "react";
import {
  Timeline,
  TimelineHead,
  TimelineItem,
  TimelineItemContent,
  TimelineItemDot,
  TimelineSeparator,
} from "@/components/ui/timeline";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, Forward, Pencil, SquareCheck, SquareStack, Trash } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAllMeetingTasks, useDeleteMeetingTask, useMarkMeetingTaskAsCompleted } from "@/lib/governance/general-meeting/hooks";
import { useCurrentUser } from "@/lib/administration/hooks";
import { formatDisplayDate } from "@/lib/shared/date-utils";
import { ForwardTaskDialog } from "@/components/governance/general-meeting/forward-task-dialog";
import { ForwardsHistoryDialog } from "@/components/shared/forwards-history-dialog";
import { AddTaskDialog, UpdateTaskDialog } from "@/components/governance/general-meeting/task-dialogs";
import { useDictionary } from "@/lib/i18n/locale-provider";
import type { MeetingTask } from "@/lib/governance/general-meeting/tasks";
import { usePermissions } from "@/lib/auth/use-permissions";
import { Can } from "@/components/auth/can";

// Only the original creator (if never forwarded) or the most recent forward's
// receiver may forward the task again — matches the original app's rule.
function canForward(entity: { forwards: { receiver: { id: string } }[]; createdBy?: string }, currentUserId?: string) {
  if (entity.forwards.length > 0) {
    return entity.forwards[entity.forwards.length - 1].receiver.id === currentUserId;
  }
  return entity.createdBy === currentUserId;
}

export function MeetingTasksTimeline({ meetingId }: { meetingId: string }) {
  const { t } = useDictionary();
  const tg = t.generalMeeting;
  const { data: currentUser } = useCurrentUser();
  const { can, canAny } = usePermissions();
  const { data: tasks, isLoading, isError } = useAllMeetingTasks(meetingId, "task");
  const { mutateAsync: markCompleted } = useMarkMeetingTaskAsCompleted(meetingId);
  const { mutateAsync: deleteTask } = useDeleteMeetingTask(meetingId);

  const [addingTask, setAddingTask] = useState(false);
  const [updatingTask, setUpdatingTask] = useState<MeetingTask | null>(null);
  // Owned here, not inside the menu: content rendered in a menu unmounts as soon as the menu closes.
  const [historyTask, setHistoryTask] = useState<MeetingTask | null>(null);
  const [forwardingTaskId, setForwardingTaskId] = useState<string | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  if (isError) {
    return <p className="text-destructive">{t.common.loadError}</p>;
  }
  if (isLoading) {
    return <p>{t.common.loading}</p>;
  }

  const rows = tasks ?? [];
  const allCompleted = rows.length > 0 && rows.every((row) => row.completed);

  return (
    <>
      {can("governance.update") && (
        <div className="flex justify-end">
          <Button className="gap-2" onClick={() => setAddingTask(true)}>
            {tg.timelineModal.addTask}
          </Button>
        </div>
      )}

      <Timeline>
        <TimelineSeparator />
        {rows.map((row, index) => {
          const position = index % 2 === 0 ? "left" : "right";
          const oppositePosition = index % 2 === 0 ? "right" : "left";

          return (
            <TimelineItem key={row.id} className={cn("group", { "text-foreground/50": row.completed })}>
              {!row.completed && canAny("governance.update", "governance.delete") && (
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
                    <TooltipContent>{tg.timelineModal.title}</TooltipContent>
                  </Tooltip>
                  <DropdownMenuContent>
                    <Can permission="governance.update">
                      <DropdownMenuItem className="gap-2" onClick={() => markCompleted(row.id)}>
                        <SquareCheck />
                        {tg.timelineModal.validate}
                      </DropdownMenuItem>
                    </Can>

                    {can("governance.update") && canForward(row, currentUser?.id) && (
                      <DropdownMenuItem className="gap-2" onClick={() => setForwardingTaskId(row.id)}>
                        <Forward />
                        {tg.timelineModal.share}
                      </DropdownMenuItem>
                    )}

                    {row.forwards.length > 0 && (
                      <DropdownMenuItem className="gap-2" onClick={() => setHistoryTask(row)}>
                        <SquareStack />
                        {tg.forwardsHistory.menu}
                      </DropdownMenuItem>
                    )}

                    <Can permission="governance.update">
                      <DropdownMenuItem className="gap-2" onClick={() => setUpdatingTask(row)}>
                        <Pencil />
                        {tg.timelineModal.edit}
                      </DropdownMenuItem>
                    </Can>

                    <Can permission="governance.delete">
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="gap-2 text-destructive"
                        onClick={() => setDeletingTaskId(row.id)}
                      >
                        <Trash />
                        {tg.timelineModal.delete}
                      </DropdownMenuItem>
                    </Can>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <TimelineItemDot className={cn({ "border border-secondary bg-background": !row.completed })} />

              <TimelineItemContent position={position}>
                {row.title}
                {row.completed && <p className="text-right text-xs italic">{tg.timeline.completed}</p>}
              </TimelineItemContent>

              {row.dueDate && (
                <TimelineItemContent variant="title" position={oppositePosition}>
                  {formatDisplayDate(row.dueDate)}
                </TimelineItemContent>
              )}
            </TimelineItem>
          );
        })}
        <TimelineHead className={cn({ "bg-secondary text-secondary-foreground": allCompleted })}>
          {tg.timeline.finished}
        </TimelineHead>
      </Timeline>

      <AddTaskDialog meetingId={meetingId} open={addingTask} onOpenChange={setAddingTask} />
      <UpdateTaskDialog
        meetingId={meetingId}
        task={updatingTask}
        open={!!updatingTask}
        onOpenChange={(open) => !open && setUpdatingTask(null)}
      />

      {historyTask && (
        <ForwardsHistoryDialog
          forwards={historyTask.forwards}
          labels={tg.forwardsHistory}
          open
          onOpenChange={(open) => !open && setHistoryTask(null)}
        />
      )}

      {forwardingTaskId && (
        <ForwardTaskDialog
          meetingId={meetingId}
          taskId={forwardingTaskId}
          open={!!forwardingTaskId}
          onOpenChange={(open) => !open && setForwardingTaskId(null)}
        />
      )}

      <AlertDialog open={!!deletingTaskId} onOpenChange={(open) => !open && setDeletingTaskId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tg.deleteTaskDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>{tg.deleteTaskDialog.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tg.deleteTaskDialog.cancel}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async () => {
                if (deletingTaskId) await deleteTask(deletingTaskId);
                setDeletingTaskId(null);
              }}
            >
              {tg.deleteTaskDialog.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
