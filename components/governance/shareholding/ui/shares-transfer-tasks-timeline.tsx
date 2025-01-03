"use client";
import {
  Timeline,
  TimelineHead,
  TimelineItem,
  TimelineItemContent,
  TimelineItemDot,
  TimelineSeparator,
} from "@/components/ui/timeline";
import { cn, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  EllipsisVertical,
  Forward,
  SquareCheck,
  SquareStack,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/services/api-sdk/models/user/user";
import { useAllSharesTransferTasks } from "@/services/api-sdk/models/shareholding";
import CompleteSharesTransferTaskDialog from "@/components/governance/shareholding/modals/complete-shares-transfer-task-dialog";
import ForwardSharesTransferTaskDialog from "@/components/governance/shareholding/modals/forward-shares-transfer-task-dialog";
import SharesTransferTaskForwardsDialog from "@/components/governance/shareholding/modals/shares-transfer-task-forwards-dialog";
import { FormattedMessage } from "react-intl";

const canForward = ({ forwards, createdBy }, currentUser) => {
  if (forwards && forwards.length > 0) {
    return forwards[0].receiver.id === currentUser?.id;
  }
  return createdBy === currentUser?.id;
};

export default function SharesTransferTasksTimeline({
  transferId,
  currentTaskId,
}) {
  const { data: currentUser } = useCurrentUser();
  const { data, isLoading, isError } = useAllSharesTransferTasks(transferId);

  if (isError) {
    throw new Error("Failed to fetch transfer tasks");
  }
  if (isLoading) {
    return (
      <div>
        <FormattedMessage id="shareholding.transfer_timeline_loading" />
      </div>
    );
  }
  if (!data || data.length === 0) {
    return (
      <div>
        <FormattedMessage id="shareholding.transfer_timeline_no_tasks_found" />
      </div>
    );
  }

  return (
    <Timeline>
      <TimelineSeparator />
      {data.map(
        (
          { id, title, completed, dueDate, form, forwards, createdBy },
          index
        ) => (
          <TimelineItem
            key={id}
            className={cn("group", {
              "rounded-md border-4 border-destructive text-destructive":
                currentTaskId === id,
              "text-foreground/50": completed,
            })}
          >
            {completed || (
              <DropdownMenu>
                <Tooltip>
                  <DropdownMenuTrigger asChild>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 z-10 rounded-full bg-accent opacity-0 transition duration-500 group-hover:opacity-100"
                      >
                        <EllipsisVertical />
                      </Button>
                    </TooltipTrigger>
                  </DropdownMenuTrigger>
                  <TooltipContent>
                    <FormattedMessage id="shareholding.transfer_timeline_menu" />
                  </TooltipContent>
                </Tooltip>
                <DropdownMenuContent>
                  {currentTaskId === id && (
                    <CompleteSharesTransferTaskDialog
                      asChild
                      taskId={id}
                      taskForm={form}
                    >
                      <DropdownMenuItem
                        className="cursor-pointer gap-2"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <SquareCheck />
                        <FormattedMessage id="shareholding.transfer_timeline_validate" />
                      </DropdownMenuItem>
                    </CompleteSharesTransferTaskDialog>
                  )}

                  {canForward({ forwards, createdBy }, currentUser) && (
                    <ForwardSharesTransferTaskDialog asChild taskId={id}>
                      <DropdownMenuItem
                        className="cursor-pointer gap-2"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <Forward />
                        <FormattedMessage id="shareholding.transfer_timeline_forward_task" />
                      </DropdownMenuItem>
                    </ForwardSharesTransferTaskDialog>
                  )}

                  {forwards && forwards.length > 0 && (
                    <SharesTransferTaskForwardsDialog
                      asChild
                      forwards={forwards}
                    >
                      <DropdownMenuItem
                        className="cursor-pointer gap-2"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <SquareStack />
                        <FormattedMessage id="shareholding.transfer_timeline_history_of_transfers" />
                      </DropdownMenuItem>
                    </SharesTransferTaskForwardsDialog>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <TimelineItemDot
              className={cn({
                "border border-secondary bg-background": !completed,
              })}
            />

            <TimelineItemContent position={index % 2 === 0 ? "left" : "right"}>
              {title}
              {completed && (
                <p className="text-right text-xs italic">
                  (
                  <FormattedMessage id="shareholding.transfer_timeline_completed" />
                  )
                </p>
              )}
            </TimelineItemContent>

            {dueDate && (
              <TimelineItemContent
                variant="title"
                position={index % 2 === 0 ? "right" : "left"}
              >
                {formatDate(dueDate)}
              </TimelineItemContent>
            )}
          </TimelineItem>
        )
      )}
      <TimelineHead
        className={cn({
          "bg-secondary text-secondary-foreground": data.every(
            (task) => task.completed
          ),
        })}
      >
        <FormattedMessage id="shareholding.transfer_timeline_finish" />
      </TimelineHead>
    </Timeline>
  );
}
