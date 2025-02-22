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
import { useAllRecoverySteps } from "@/services/api-sdk/models/recovery";
import CompleteRecoveryStepDialog from "@/components/recovery/modals/complete-recovery-step-dialog";
import { UpdateRecoveryStepDialog } from "@/components/recovery/modals/update-recovery-step-dialog";
import DeleteRecoveryStepButton from "@/components/recovery/buttons/delete-recovery-step-button";
import ForwardRecoveryStepDialog from "@/components/recovery/modals/forward-recovery-step-dialog";
import RecoveryStepForwardsDialog from "@/components/recovery/modals/recovery-step-forwards-dialog";
import { useIntl } from "react-intl";

const canForward = ({ forwards, createdBy }, currentUser) => {
  if (forwards && forwards.length > 0) {
    return forwards[0].receiver.id === currentUser?.id;
  }
  return createdBy === currentUser?.id;
};

export default function RecoveryStepsTimeline({ recoveryId, nextStepId }) {
  const intl = useIntl();
  const { data: currentUser } = useCurrentUser();
  const { data, isLoading, isError } = useAllRecoverySteps(recoveryId);

  if (isError) {
    throw new Error(intl.formatMessage({ id: "recovery.fetchError" }));
  }

  if (isLoading) {
    return <div>{intl.formatMessage({ id: "recovery.loading" })}</div>;
  }

  if (!data || data.length === 0) {
    return <div>{intl.formatMessage({ id: "recovery.noStepsFound" })}</div>;
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
                    {intl.formatMessage({ id: "recovery.menu" })}
                  </TooltipContent>
                </Tooltip>
                <DropdownMenuContent>
                  <CompleteRecoveryStepDialog
                    asChild
                    stepId={id}
                    stepForm={form}
                  >
                    <DropdownMenuItem
                      disabled={nextStepId !== id}
                      className="cursor-pointer gap-2"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <SquareCheck />
                      {intl.formatMessage({ id: "recovery.validate" })}
                    </DropdownMenuItem>
                  </CompleteRecoveryStepDialog>

                  {canForward({ forwards, createdBy }, currentUser) && (
                    <ForwardRecoveryStepDialog asChild eventId={id}>
                      <DropdownMenuItem
                        disabled={nextStepId !== id}
                        className="cursor-pointer gap-2"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <Forward />
                        {intl.formatMessage({ id: "recovery.transfer" })}
                      </DropdownMenuItem>
                    </ForwardRecoveryStepDialog>
                  )}

                  {forwards && forwards.length > 0 && (
                    <RecoveryStepForwardsDialog asChild forwards={forwards}>
                      <DropdownMenuItem
                        disabled={!(nextStepId === id && form)}
                        className="cursor-pointer gap-2"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <SquareStack />
                        {intl.formatMessage({ id: "recovery.transferHistory" })}
                      </DropdownMenuItem>
                    </RecoveryStepForwardsDialog>
                  )}

                  {type === "task" && (
                    <>
                      <UpdateRecoveryStepDialog asChild stepId={id}>
                        <DropdownMenuItem
                          className="cursor-pointer gap-2"
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Pencil />
                          {intl.formatMessage({ id: "recovery.edit" })}
                        </DropdownMenuItem>
                      </UpdateRecoveryStepDialog>

                      <DropdownMenuSeparator />

                      <DeleteRecoveryStepButton asChild stepId={id}>
                        <DropdownMenuItem
                          className="cursor-pointer gap-2 text-destructive"
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Trash />
                          {intl.formatMessage({ id: "recovery.delete" })}
                        </DropdownMenuItem>
                      </DeleteRecoveryStepButton>
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
                  {intl.formatMessage({ id: "recovery.completed" })}
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
        {intl.formatMessage({ id: "recovery.finished" })}
      </TimelineHead>
    </Timeline>
  );
}
