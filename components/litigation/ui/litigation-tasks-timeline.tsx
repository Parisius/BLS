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
  Pencil,
  SquareCheck,
  SquareStack,
  Trash,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/services/api-sdk/models/user/user";
import { useAllLitigationTasks } from "@/services/api-sdk/models/litigation";
import CompleteLitigationTaskDialog from "@/components/litigation/modals/complete-litigation-task-dialog";
import ForwardLitigationTaskDialog from "@/components/litigation/modals/forward-litigation-task-dialog";
import LitigationTaskForwardsDialog from "@/components/litigation/modals/litigation-task-forwards-dialog";
import { UpdateLitigationTaskDialog } from "@/components/litigation/modals/update-litigation-task-dialog";
import DeleteLitigationTaskButton from "@/components/litigation/buttons/delete-litigation-task-button";
import { useIntl } from "react-intl"; // Import useIntl

const canForward = ({ forwards, createdBy }, currentUser) => {
  if (forwards && forwards.length > 0) {
    return forwards[0].receiver.id === currentUser?.id;
  }
  return createdBy === currentUser?.id;
};

export default function LitigationTasksTimeline({ litigationId, nextStepId }) {
  const { data: currentUser } = useCurrentUser();
  const { data, isLoading, isError } = useAllLitigationTasks(litigationId);
  const intl = useIntl();

  if (isError) {
    throw new Error("Failed to fetch litigation tasks");
  }

  if (isLoading) {
    return (
      <div>
        {intl.formatMessage({
          id: "litigation.loading",
        })}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div>
        {intl.formatMessage({
          id: "litigation.litigation.taskNotFound",
        })}
      </div>
    );
  }

  return (
    <Timeline>
      <TimelineSeparator />
      {data.map(
        (
          {
            id,
            title,
            type,
            completed,
            form,
            minDueDate,
            maxDueDate,
            createdBy,
            forwards,
          },
          index
        ) => (
          <TimelineItem
            key={id}
            className={cn("group", {
              "rounded-md border-4 border-destructive text-destructive":
                nextStepId === id,
              "text-foreground/50": completed,
            })}
          >
            {!completed && (
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
                    {intl.formatMessage({
                      id: "litigation.litigation.tasks.menu",
                    })}
                  </TooltipContent>
                </Tooltip>
                <DropdownMenuContent>
                  <CompleteLitigationTaskDialog
                    asChild
                    taskId={id}
                    stepForm={form}
                  >
                    <DropdownMenuItem
                      disabled={nextStepId !== id}
                      className="cursor-pointer gap-2"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <SquareCheck />
                      {intl.formatMessage({
                        id: "litigation.litigation.tasks.validate",
                      })}{" "}
                    </DropdownMenuItem>
                  </CompleteLitigationTaskDialog>

                  {canForward({ forwards, createdBy }, currentUser) && (
                    <ForwardLitigationTaskDialog asChild taskId={id}>
                      <DropdownMenuItem
                        disabled={nextStepId !== id}
                        className="cursor-pointer gap-2"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <Forward />
                        {intl.formatMessage({
                          id: "litigation.litigation.tasks.forward",
                        })}{" "}
                      </DropdownMenuItem>
                    </ForwardLitigationTaskDialog>
                  )}

                  {forwards && forwards.length > 0 && (
                    <LitigationTaskForwardsDialog asChild forwards={forwards}>
                      <DropdownMenuItem
                        disabled={!(nextStepId === id && form)}
                        className="cursor-pointer gap-2"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <SquareStack />
                        {intl.formatMessage({
                          id: "litigation.litigation.tasks.transferHistory",
                        })}{" "}
                      </DropdownMenuItem>
                    </LitigationTaskForwardsDialog>
                  )}

                  {type === "task" && (
                    <>
                      <UpdateLitigationTaskDialog asChild taskId={id}>
                        <DropdownMenuItem
                          className="cursor-pointer gap-2"
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Pencil />
                          {intl.formatMessage({
                            id: "litigation.litigation.tasks.edit",
                          })}{" "}
                        </DropdownMenuItem>
                      </UpdateLitigationTaskDialog>

                      <DropdownMenuSeparator />

                      <DeleteLitigationTaskButton asChild taskId={id}>
                        <DropdownMenuItem
                          className="cursor-pointer gap-2 text-destructive"
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Trash />
                          {intl.formatMessage({
                            id: "litigation.litigation.tasks.delete",
                          })}{" "}
                        </DropdownMenuItem>
                      </DeleteLitigationTaskButton>
                    </>
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
                  {intl.formatMessage({
                    id: "litigation.litigation.tasks.completed",
                  })}{" "}
                </p>
              )}
            </TimelineItemContent>

            {minDueDate && maxDueDate && (
              <TimelineItemContent
                variant="title"
                position={index % 2 === 0 ? "right" : "left"}
              >
                {formatDate(minDueDate)} - {formatDate(maxDueDate)}
              </TimelineItemContent>
            )}

            {!minDueDate && maxDueDate && (
              <TimelineItemContent
                variant="title"
                position={index % 2 === 0 ? "right" : "left"}
              >
                {formatDate(maxDueDate)}
              </TimelineItemContent>
            )}
          </TimelineItem>
        )
      )}
      <TimelineHead
        className={cn({
          "bg-secondary text-secondary-foreground": data.every(
            (step) => step.completed
          ),
        })}
      >
        {intl.formatMessage({ id: "litigation.litigation.tasks.finished" })}{" "}
      </TimelineHead>
    </Timeline>
  );
}
