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
import { useAllIncidentTasks } from "@/services/api-sdk/models/account-incident";
import CompleteIncidentTaskDialog from "@/components/account-incident/modals/complete-incident-task-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/services/api-sdk/models/user/user";
import ForwardIncidentTaskDialog from "@/components/account-incident/modals/forward-incident-task-dialog";
import IncidentTaskForwardsDialog from "@/components/account-incident/modals/incident-task-forwards-dialog";
import { useIntl } from "react-intl";

const canForward = ({ forwards, createdBy }, currentUser) => {
  if (forwards && forwards.length > 0) {
    return forwards[0].receiver.id === currentUser?.id;
  }
  return createdBy === currentUser?.id;
};

export default function IncidentTasksTimeline({
  incidentId,
  incidentCompleted,
  currentTaskId,
}) {
  const { data: currentUser } = useCurrentUser();
  const { data, isLoading, isError } = useAllIncidentTasks(incidentId);
  const intl = useIntl();

  if (isError) {
    throw new Error("Failed to fetch incident tasks");
  }
  if (isLoading) {
    return (
      <div>
        {intl.formatMessage({ id: "incident.incident.author.loading" })}
      </div>
    );
  }
  if (!data || data.length === 0) {
    return <div>No tasks found</div>;
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
                    {intl.formatMessage({ id: "incident.timeline.menu" })}
                  </TooltipContent>
                </Tooltip>
                <DropdownMenuContent>
                  {currentTaskId === id && (
                    <CompleteIncidentTaskDialog
                      asChild
                      taskId={id}
                      taskForm={form}
                    >
                      <DropdownMenuItem
                        className="cursor-pointer gap-2"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <SquareCheck />
                        {intl.formatMessage({
                          id: "incident.timeline.validate",
                        })}
                      </DropdownMenuItem>
                    </CompleteIncidentTaskDialog>
                  )}

                  {canForward({ forwards, createdBy }, currentUser) && (
                    <ForwardIncidentTaskDialog asChild taskId={id}>
                      <DropdownMenuItem
                        className="cursor-pointer gap-2"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <Forward />
                        {intl.formatMessage({
                          id: "incident.timeline.forward",
                        })}
                      </DropdownMenuItem>
                    </ForwardIncidentTaskDialog>
                  )}

                  {forwards && forwards.length > 0 && (
                    <IncidentTaskForwardsDialog asChild forwards={forwards}>
                      <DropdownMenuItem
                        className="cursor-pointer gap-2"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <SquareStack />
                        {intl.formatMessage({
                          id: "incident.timeline.transferHistory",
                        })}
                      </DropdownMenuItem>
                    </IncidentTaskForwardsDialog>
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
                  ({intl.formatMessage({ id: "incident.timeline.completed" })})
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
          "bg-secondary text-secondary-foreground": incidentCompleted,
        })}
      >
        {intl.formatMessage({ id: "incident.timeline.finished" })}
      </TimelineHead>
    </Timeline>
  );
}
