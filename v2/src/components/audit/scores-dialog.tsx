"use client";

import { useId, useMemo } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ScoreRows } from "@/components/audit/score-rows";
import { useScoresForm } from "@/lib/audit/forms";
import type { AuditScore, AuditScoreInput } from "@/lib/audit/audits";

export interface ScoresDialogLabels {
  title: string;
  description: string;
  cancel: string;
  submit: string;
  success: string;
  error: string;
}

/** Edit the scores of an audit: used both to update the current evaluation and to complete a transfer. */
export function ScoresDialog({
  open,
  onOpenChange,
  scores,
  labels,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scores: AuditScore[];
  labels: ScoresDialogLabels;
  onSubmit: (scores: AuditScoreInput[]) => Promise<void>;
}) {
  const formId = useId();
  const { form, scoresArray } = useScoresForm({
    scores: scores.map((item) => ({ criteriaId: item.criteria.id, score: item.score, maxScore: item.criteria.maxScore })),
  });
  const titles = useMemo(
    () => Object.fromEntries(scores.map((item) => [item.criteria.id, item.criteria.title])),
    [scores],
  );

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await onSubmit(values.scores.map(({ criteriaId, score }) => ({ criteriaId, score })));
      toast.success(labels.success);
      onOpenChange(false);
    } catch {
      toast.error(labels.error);
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{labels.title}</DialogTitle>
          <DialogDescription>{labels.description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id={formId}
            noValidate
            className="-mx-4 flex max-h-[70vh] flex-col gap-8 overflow-y-auto px-4 py-3"
            onSubmit={handleSubmit}
          >
            <ScoreRows form={form} scoresArray={scoresArray} titles={titles} disabled={form.formState.isSubmitting} />
          </form>
        </Form>
        <DialogFooter className="gap-2">
          <DialogClose render={<Button type="button" variant="destructive" />}>{labels.cancel}</DialogClose>
          <Button type="submit" form={formId} disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "..." : labels.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
