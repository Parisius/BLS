"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";
import { Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LinkSelect } from "@/components/shared/link-select";
import { ScoreRows } from "@/components/shared/scores/score-rows";
import {
  useAllCollaborators,
  useAllEvaluationCriteria,
  useAllProfiles,
  useCreateEvaluation,
} from "@/lib/evaluation/hooks";
import { useAddEvaluationForm } from "@/lib/evaluation/forms";
import type { ScoresFormValues } from "@/lib/shared/scores";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function AddEvaluationDialog({ variant = "list" }: { variant?: "list" | "card" }) {
  const { t } = useDictionary();
  const ta = t.evaluation.addEvaluation;
  const router = useRouter();
  const formId = useId();
  const { form, scoresArray } = useAddEvaluationForm();
  const { mutateAsync } = useCreateEvaluation();
  const [open, setOpen] = useState(false);
  const profileId = form.watch("profileId");
  const { data: profiles, isLoading: profilesLoading } = useAllProfiles();
  const { data: collaborators, isLoading: collaboratorsLoading } = useAllCollaborators(profileId);
  const { data: criteria, isLoading: criteriaLoading } = useAllEvaluationCriteria({ profileId });

  const collaboratorOptions = useMemo(
    () => (collaborators ?? []).map((item) => ({ id: item.id, title: `${item.lastname} ${item.firstname}` })),
    [collaborators],
  );
  const titles = useMemo(() => Object.fromEntries((criteria ?? []).map((item) => [item.id, item.title])), [criteria]);

  // Restart the scores at 0 for each criterion of the newly picked profile.
  useEffect(() => {
    if (!profileId) return;
    scoresArray.replace((criteria ?? []).map((item) => ({ criteriaId: item.id, score: 0, maxScore: item.maxScore })));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `replace` is stable; re-running on its identity would loop
  }, [criteria, profileId]);

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      const created = await mutateAsync({
        collaboratorId: values.collaboratorId,
        isArchived: values.isArchived,
        scores: values.scores.map(({ criteriaId, score }) => ({ criteriaId, score })),
      });
      toast.success(ta.success);
      form.reset();
      setOpen(false);
      router.push(`/dashboard/evaluation/${created.id}`);
    } catch {
      toast.error(ta.error);
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2" />}>
        <Scale />
        {variant === "card" ? t.evaluation.home.cardButton : ta.title}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{ta.title}</DialogTitle>
          <DialogDescription>{ta.description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id={formId}
            noValidate
            className="-mx-4 flex max-h-[70vh] flex-col gap-5 overflow-y-auto px-4 py-3"
            onSubmit={handleSubmit}
          >
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(!!checked)} />
                  </FormControl>
                  <FormLabel className="text-base">{ta.archive}</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="profileId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{ta.profile}</FormLabel>
                  <FormControl>
                    <LinkSelect
                      value={field.value}
                      onValueChange={(next) => {
                        field.onChange(next);
                        form.setValue("collaboratorId", "");
                      }}
                      options={profiles}
                      isLoading={profilesLoading}
                      placeholder={ta.selectProfile}
                      loadingLabel={ta.loading}
                      emptyLabel={ta.noCollaborators}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {profileId && (
              <FormField
                control={form.control}
                name="collaboratorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{ta.collaborator}</FormLabel>
                    <FormControl>
                      <LinkSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        options={collaboratorOptions}
                        isLoading={collaboratorsLoading}
                        placeholder={ta.selectCollaborator}
                        loadingLabel={ta.loading}
                        emptyLabel={ta.noCollaborators}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {profileId && criteriaLoading && <p className="text-center text-muted-foreground">{ta.loadingCriteria}</p>}
            {profileId && !criteriaLoading && scoresArray.fields.length === 0 && (
              <p className="text-center text-muted-foreground">{ta.noCriteria}</p>
            )}
            {scoresArray.fields.length > 0 && (
              <>
                <div className="flex items-center gap-5">
                  <span className="line-clamp-2 flex-1 text-lg italic text-muted-foreground">{ta.criteria}</span>
                  <span className="w-36 text-lg italic text-muted-foreground">{ta.scores}</span>
                </div>
                <ScoreRows
                  form={form as unknown as UseFormReturn<ScoresFormValues>}
                  scoresArray={scoresArray as unknown as UseFieldArrayReturn<ScoresFormValues, "scores">}
                  titles={titles}
                  disabled={form.formState.isSubmitting}
                />
              </>
            )}
          </form>
        </Form>
        <DialogFooter className="gap-2">
          <DialogClose render={<Button type="button" variant="destructive" onClick={() => form.reset()} />}>
            {ta.cancel}
          </DialogClose>
          <Button type="submit" form={formId} disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "..." : ta.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
