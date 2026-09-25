"use client";

import { useMemo, useState } from "react";
import { notFound } from "next/navigation";
import { CheckCheck, Forward, History, Pencil, Printer } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ForwardsHistoryDialog } from "@/components/shared/forwards-history-dialog";
import { ForwardWorkflowTaskDialog } from "@/components/shared/workflow-tasks/forward-task-dialog";
import { ScoresDialog } from "@/components/audit/scores-dialog";
import { ScoresSheet } from "@/components/audit/scores-sheet";
import { useCurrentUser } from "@/lib/administration/hooks";
import {
  useCompleteAudit,
  useForwardAudit,
  useOneAudit,
  usePrintAudit,
  useUpdateAudit,
} from "@/lib/audit/hooks";
import type { Audit, AuditPerson, AuditScore } from "@/lib/audit/audits";
import { downloadBytes } from "@/lib/shared/download";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/lib/i18n/locale-provider";

interface HistoryEntry {
  id: string;
  evaluator: AuditPerson;
  globalScore?: number;
  status: string;
  scores: AuditScore[];
}

// The creator can forward until a transfer is pending; after that only the receiver of the last, completed transfer.
const canForward = (audit: Audit, userId?: string) =>
  audit.forwards.length > 0 ? audit.forwards[0].completed && audit.forwards[0].receiver.id === userId : audit.createdBy.id === userId;

const canComplete = (audit: Audit, userId?: string) =>
  audit.forwards.length > 0 && !audit.forwards[0].completed && audit.forwards[0].receiver.id === userId;

export function AuditDetailView({ auditId }: { auditId: string }) {
  const { t } = useDictionary();
  const td = t.audit.detail;
  const { data: currentUser } = useCurrentUser();
  const { data, isLoading, isError } = useOneAudit(auditId);
  const { mutateAsync: update } = useUpdateAudit(auditId);
  const { mutateAsync: complete } = useCompleteAudit();
  const { mutateAsync: forward } = useForwardAudit(auditId);
  const { mutate: print, isPending: printing } = usePrintAudit();
  const [forwarding, setForwarding] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [editing, setEditing] = useState(false);

  // Newest evaluation first: completed transfers, then the original evaluation.
  const history = useMemo<HistoryEntry[]>(() => {
    if (!data) return [];
    return [
      ...data.forwards
        .filter((item) => item.completed)
        .map((item) => ({
          id: item.id,
          evaluator: item.receiver,
          globalScore: item.globalScore,
          status: item.title,
          scores: item.scores,
        })),
      {
        id: data.id,
        evaluator: data.createdBy,
        globalScore: data.originalGlobalScore,
        status: data.originalStatus,
        scores: data.originalScores,
      },
    ];
  }, [data]);

  if (isError) return <p className="text-center text-destructive">{t.common.loadError}</p>;
  if (isLoading) {
    return (
      <div className="flex flex-col gap-10">
        <Skeleton className="mx-auto h-10 w-64" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }
  if (!data) notFound();

  const userId = currentUser?.id;
  const mayForward = canForward(data, userId);
  const mayComplete = canComplete(data, userId);
  const pendingTransfer = data.forwards[0];
  const moduleLabel = (t.audit.modules as Record<string, string>)[data.module] ?? data.module;

  return (
    <>
      <h1 className="text-center text-2xl font-bold sm:text-3xl md:text-4xl">
        {data.title} - {moduleLabel}
      </h1>

      <div className="flex items-center justify-end gap-2">
        {mayForward && (
          <Button className="gap-2" onClick={() => setForwarding(true)}>
            <Forward />
            <span className="sr-only sm:not-sr-only">{td.forward}</span>
          </Button>
        )}
        {mayComplete && (
          <Button className="gap-2" onClick={() => setCompleting(true)}>
            <CheckCheck />
            <span className="sr-only sm:not-sr-only">{pendingTransfer.title || td.defaultCompleteTitle}</span>
          </Button>
        )}
        <Button
          variant="secondary"
          className="gap-2"
          disabled={printing}
          onClick={() =>
            print(data.id, {
              onSuccess: ({ bytes, filename }) => downloadBytes(bytes, filename),
              onError: () => toast.error(td.printError),
            })
          }
        >
          <Printer className={printing ? "animate-bounce" : undefined} />
          <span className="sr-only sm:not-sr-only">{td.print}</span>
        </Button>
        {data.forwards.length > 0 && (
          <Tooltip>
            <ForwardsHistoryDialog
              forwards={data.forwards}
              labels={t.audit.forwardsHistory}
              trigger={
                <TooltipTrigger
                  render={<Button variant="ghost" size="icon" aria-label={td.history} className="rounded-full" />}
                />
              }
            >
              <History />
            </ForwardsHistoryDialog>
            <TooltipContent>{td.history}</TooltipContent>
          </Tooltip>
        )}
      </div>

      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead>{td.reference}</TableHead>
            <TableHead>{td.evaluator}</TableHead>
            <TableHead>{td.globalScore}</TableHead>
            <TableHead>{td.status}</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((entry, index) => (
            <TableRow key={entry.id} className={cn("bg-card", index > 0 && "text-muted-foreground")}>
              <TableCell>{data.reference}</TableCell>
              <TableCell>
                {entry.evaluator.lastname} {entry.evaluator.firstname}{" "}
                {userId === entry.evaluator.id && <span className="italic">{td.you}</span>}
              </TableCell>
              <TableCell>
                {entry.globalScore ?? "-"} {index === 0 && <span className="italic">{td.current}</span>}
              </TableCell>
              <TableCell>
                <Badge
                  className={cn(
                    index === 0
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-muted text-muted-foreground hover:bg-muted/90",
                  )}
                >
                  {entry.status}
                </Badge>
              </TableCell>
              <TableCell className="text-end">
                {index === 0 && mayForward && (
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={td.edit}
                          className="rounded-full"
                          onClick={() => setEditing(true)}
                        />
                      }
                    >
                      <Pencil />
                    </TooltipTrigger>
                    <TooltipContent>{td.edit}</TooltipContent>
                  </Tooltip>
                )}
                <ScoresSheet
                  moduleTitle={data.title}
                  evaluator={entry.evaluator}
                  globalScore={entry.globalScore}
                  scores={entry.scores}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ForwardWorkflowTaskDialog
        open={forwarding}
        onOpenChange={setForwarding}
        onSubmit={(args) => forward(args)}
        labels={t.audit.forward}
        userSelectLabels={t.audit.userSelect}
      />
      {/* Remounted per audit state so the score fields start from the latest values. */}
      <ScoresDialog
        key={`edit-${history[0]?.id}-${history[0]?.globalScore}`}
        open={editing}
        onOpenChange={setEditing}
        scores={history[0]?.scores ?? []}
        labels={t.audit.updateAudit}
        onSubmit={(scores) => update({ scores })}
      />
      {mayComplete && (
        <ScoresDialog
          key={`complete-${pendingTransfer.id}`}
          open={completing}
          onOpenChange={setCompleting}
          scores={data.currentScores}
          labels={t.audit.completeAudit}
          onSubmit={(scores) => complete({ transferId: pendingTransfer.id, scores })}
        />
      )}
    </>
  );
}
