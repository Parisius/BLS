"use client";

import { useMemo, useState } from "react";
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
import {
  EllipsisVertical,
  Forward,
  Pencil,
  SquareCheck,
  SquareStack,
  Trash,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAllContractEvents } from "@/lib/contract/hooks";
import { useCurrentUser } from "@/lib/administration/hooks";
import { formatDisplayDate } from "@/lib/shared/date-utils";
import { ContractDatesDialog } from "@/components/contract/contract-dates-dialog";
import { ForwardContractDialog } from "@/components/contract/forward-contract-dialog";
import { ForwardsHistoryDialog } from "@/components/shared/forwards-history-dialog";
import { UpdateContractEventDialog } from "@/components/contract/event-dialogs";
import { CompleteContractEventDialog, DeleteContractEventDialog } from "@/components/contract/event-buttons";
import { useDictionary } from "@/lib/i18n/locale-provider";
import type { ContractDateType } from "@/lib/contract/forms";
import type { ContractEvent } from "@/lib/contract/events";
import type { Contract } from "@/lib/contract/contracts";

// Unified vs. the original app, which applied a stricter "must be completed"
// rule to forward a *contract* but a looser one (no completed check) to
// forward a contract *event* — letting an event ping-pong between users
// before anyone ever marks it done. Both now require the current transfer
// to be completed before it can be forwarded again.
function canForward(entity: { forwards: { completed?: boolean; receiver: { id: string } }[]; createdBy?: string }, currentUserId?: string) {
  if (entity.forwards.length > 0) {
    const last = entity.forwards[entity.forwards.length - 1];
    return !!last.completed && last.receiver.id === currentUserId;
  }
  return entity.createdBy === currentUserId;
}

type MilestoneId = ContractDateType;

interface TimelineRow {
  id: string;
  title: string;
  dueDate?: string;
  completed: boolean;
  isMilestone: boolean;
  event?: ContractEvent;
}

export function ContractEventsTimeline({ contract }: { contract: Contract }) {
  const { t } = useDictionary();
  const tc = t.contract;
  const { data: currentUser } = useCurrentUser();
  const { data: events, isLoading, isError } = useAllContractEvents(contract.id);

  const [editingDate, setEditingDate] = useState<MilestoneId | null>(null);
  const [updatingEvent, setUpdatingEvent] = useState<ContractEvent | null>(null);
  // Owned here, not inside the menu: content rendered in a menu unmounts as soon as the menu closes.
  const [historyEvent, setHistoryEvent] = useState<ContractEvent | null>(null);
  const [forwardingEventId, setForwardingEventId] = useState<string | null>(null);
  const [completingEventId, setCompletingEventId] = useState<string | null>(null);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);

  const rows = useMemo<TimelineRow[]>(() => {
    const milestones: TimelineRow[] = (
      [
        ["signatureDate", tc.timeline.signature, contract.signatureDate],
        ["effectiveDate", tc.timeline.effective, contract.effectiveDate],
        ["expirationDate", tc.timeline.expiration, contract.expirationDate],
        ["renewalDate", tc.timeline.renewal, contract.renewalDate],
      ] as [MilestoneId, string, string | undefined][]
    ).map(([id, title, dueDate]) => ({
      id,
      title,
      dueDate,
      completed: !!dueDate && new Date(dueDate) < new Date(),
      isMilestone: true,
    }));

    const eventRows: TimelineRow[] = (events ?? []).map((event) => ({
      id: `event-${event.id}`,
      title: event.title,
      dueDate: event.dueDate,
      completed: event.completed,
      isMilestone: false,
      event,
    }));

    return [...eventRows, ...milestones].sort((a, b) => {
      if (a.dueDate && b.dueDate) return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      if (a.completed && !b.completed) return -1;
      if (!a.completed && b.completed) return 1;
      return 0;
    });
  }, [events, contract, tc]);

  if (isError) {
    return <p className="text-destructive">{t.common.loadError}</p>;
  }

  if (isLoading) {
    return <p>{t.common.loading}</p>;
  }

  const allCompleted = rows.every((row) => row.completed);

  return (
    <>
      <Timeline>
        <TimelineSeparator />
        {rows.map((row, index) => {
          const position = index % 2 === 0 ? "left" : "right";
          const oppositePosition = index % 2 === 0 ? "right" : "left";

          return (
            <TimelineItem key={row.id} className={cn("group", { "text-foreground/50": row.completed })}>
              {!row.completed && row.isMilestone && (
                <div className="absolute right-0 top-0 z-10 flex items-center opacity-0 transition duration-500 group-hover:opacity-100">
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full bg-accent"
                          onClick={() => setEditingDate(row.id as MilestoneId)}
                        />
                      }
                    >
                      <Pencil />
                    </TooltipTrigger>
                    <TooltipContent>{tc.timeline.editTooltip}</TooltipContent>
                  </Tooltip>
                </div>
              )}

              {!row.completed && !row.isMilestone && row.event && (
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
                    <TooltipContent>{tc.timeline.menuTooltip}</TooltipContent>
                  </Tooltip>
                  <DropdownMenuContent>
                    <DropdownMenuItem className="gap-2" onClick={() => setCompletingEventId(row.event!.id)}>
                      <SquareCheck />
                      {tc.timeline.complete}
                    </DropdownMenuItem>

                    {canForward(row.event, currentUser?.id) && (
                      <DropdownMenuItem className="gap-2" onClick={() => setForwardingEventId(row.event!.id)}>
                        <Forward />
                        {tc.timeline.forward}
                      </DropdownMenuItem>
                    )}

                    {row.event.forwards.length > 0 && (
                      <DropdownMenuItem className="gap-2" onClick={() => setHistoryEvent(row.event!)}>
                        <SquareStack />
                        {tc.timeline.forwardHistory}
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem className="gap-2" onClick={() => setUpdatingEvent(row.event!)}>
                      <Pencil />
                      {tc.timeline.update}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      className="gap-2 text-destructive"
                      onClick={() => setDeletingEventId(row.event!.id)}
                    >
                      <Trash />
                      {tc.timeline.delete}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <TimelineItemDot className={cn({ "border border-secondary bg-background": !row.completed })} />

              <TimelineItemContent position={position}>
                {row.title}
                {row.completed && <p className="text-right text-xs italic">{tc.timeline.completed}</p>}
              </TimelineItemContent>

              {row.dueDate ? (
                <TimelineItemContent variant="title" position={oppositePosition}>
                  {formatDisplayDate(row.dueDate)}
                </TimelineItemContent>
              ) : row.isMilestone ? (
                <Button
                  variant="link"
                  className="text-secondary"
                  onClick={() => setEditingDate(row.id as MilestoneId)}
                >
                  {tc.timeline.schedule}
                </Button>
              ) : null}
            </TimelineItem>
          );
        })}
        <TimelineHead className={cn({ "bg-secondary text-secondary-foreground": allCompleted })}>
          {tc.timeline.finished}
        </TimelineHead>
      </Timeline>

      {editingDate && (
        <ContractDatesDialog
          contractId={contract.id}
          dateType={editingDate}
          defaultDate={
            editingDate === "signatureDate"
              ? contract.signatureDate
              : editingDate === "effectiveDate"
                ? contract.effectiveDate
                : editingDate === "expirationDate"
                  ? contract.expirationDate
                  : contract.renewalDate
          }
          open={!!editingDate}
          onOpenChange={(open) => !open && setEditingDate(null)}
        />
      )}

      {historyEvent && (
        <ForwardsHistoryDialog
          forwards={historyEvent.forwards}
          labels={{
            title: tc.forwardsDialog.title,
            description: tc.forwardsDialog.description,
            transferredOn: tc.forwardsDialog.transferredOn,
            close: tc.forwardsDialog.close,
          }}
          open
          onOpenChange={(open) => !open && setHistoryEvent(null)}
        />
      )}
      <UpdateContractEventDialog
        contractId={contract.id}
        event={updatingEvent}
        open={!!updatingEvent}
        onOpenChange={(open) => !open && setUpdatingEvent(null)}
      />

      {forwardingEventId && (
        <ForwardContractDialog
          target={{ kind: "event", contractId: contract.id, eventId: forwardingEventId }}
          open={!!forwardingEventId}
          onOpenChange={(open) => !open && setForwardingEventId(null)}
        />
      )}

      {completingEventId && (
        <CompleteContractEventDialog
          contractId={contract.id}
          eventId={completingEventId}
          open={!!completingEventId}
          onOpenChange={(open) => !open && setCompletingEventId(null)}
        />
      )}

      {deletingEventId && (
        <DeleteContractEventDialog
          contractId={contract.id}
          eventId={deletingEventId}
          open={!!deletingEventId}
          onOpenChange={(open) => !open && setDeletingEventId(null)}
        />
      )}
    </>
  );
}
