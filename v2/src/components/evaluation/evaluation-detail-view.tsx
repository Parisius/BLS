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
import { ScoresDialog } from "@/components/shared/scores/scores-dialog";
import { ScoresSheet } from "@/components/shared/scores/scores-sheet";
import { useCurrentUser } from "@/lib/administration/hooks";
import {
  useCompleteEvaluation,
  useForwardEvaluation,
  useOneEvaluation,
  usePrintEvaluation,
  useUpdateEvaluation,
} from "@/lib/evaluation/hooks";
import type { EvaluationPerson } from "@/lib/evaluation/evaluations";
import type { Score } from "@/lib/shared/scores";
import { downloadBytes } from "@/lib/shared/download";
import { canComplete, canForward } from "@/lib/shared/transfer-permissions";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/lib/i18n/locale-provider";
import { Can } from "@/components/auth/can";
import { usePermissions } from "@/lib/auth/use-permissions";

interface HistoryEntry {
  id: string;
  evaluator: EvaluationPerson;
  globalScore?: number;
  status: string;
  scores: Score[];
}

export function EvaluationDetailView({ evaluationId }: { evaluationId: string }) {
  const { t } = useDictionary();
  const { can } = usePermissions();
  const td = t.evaluation.detail;
  const { data: currentUser } = useCurrentUser();
  const { data, isLoading, isError } = useOneEvaluation(evaluationId);
  const { mutateAsync: update } = useUpdateEvaluation(evaluationId);
  const { mutateAsync: complete } = useCompleteEvaluation();
  const { mutateAsync: forward } = useForwardEvaluation(evaluationId);
  const { mutate: print, isPending: printing } = usePrintEvaluation();
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
  const mayForward = can("evaluation.forward") && canForward(data, userId);
  const mayComplete = can("evaluation.update") && canComplete(data, userId);
  const pendingTransfer = data.forwards[0];
  const { collaborator } = data;

  return (
    <>
      <h1 className="text-center text-2xl font-bold sm:text-3xl md:text-4xl">
        {collaborator.lastname} {collaborator.firstname} ({collaborator.profile.title})
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
        <Can permission="evaluation.print">
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
        </Can>
        {data.forwards.length > 0 && (
          <Tooltip>
            <ForwardsHistoryDialog
              forwards={data.forwards}
              labels={t.evaluation.forwardsHistory}
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
                  moduleTitle={`${collaborator.lastname} ${collaborator.firstname}`}
                  evaluator={entry.evaluator}
                  globalScore={entry.globalScore}
                  scores={entry.scores}
                  labels={{ ...t.evaluation.scores, view: td.viewScores }}
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
        labels={t.evaluation.forward}
        userSelectLabels={t.evaluation.userSelect}
      />
      {/* Remounted per evaluation state so the score fields start from the latest values. */}
      <ScoresDialog
        key={`edit-${history[0]?.id}-${history[0]?.globalScore}`}
        open={editing}
        onOpenChange={setEditing}
        scores={history[0]?.scores ?? []}
        labels={t.evaluation.updateEvaluation}
        onSubmit={(scores) => update({ scores })}
      />
      {mayComplete && (
        <ScoresDialog
          key={`complete-${pendingTransfer.id}`}
          open={completing}
          onOpenChange={setCompleting}
          scores={data.currentScores}
          labels={t.evaluation.completeEvaluation}
          onSubmit={(scores) => complete({ transferId: pendingTransfer.id, scores })}
        />
      )}
    </>
  );
}
