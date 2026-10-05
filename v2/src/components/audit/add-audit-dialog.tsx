"use client";

import { Can } from "@/components/auth/can";
import { useEffect, useId, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Scale } from "lucide-react";
import type { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ModuleItemSelect } from "@/components/audit/module-item-select";
import { ScoreRows } from "@/components/shared/scores/score-rows";
import { AUDIT_MODULES } from "@/lib/audit/constants";
import { useAddAuditForm } from "@/lib/audit/forms";
import type { ScoresFormValues } from "@/lib/shared/scores";
import { useAllAuditCriteria, useCreateAudit } from "@/lib/audit/hooks";
import { useDictionary } from "@/lib/i18n/locale-provider";

function AddAuditDialogInner({ variant = "list" }: { variant?: "list" | "card" }) {
  const { t } = useDictionary();
  const ta = t.audit.addAudit;
  const router = useRouter();
  const formId = useId();
  const { form, scoresArray } = useAddAuditForm();
  const { mutateAsync } = useCreateAudit();
  const [open, setOpen] = useState(false);
  const auditModule = form.watch("module");
  const { data: criteria, isLoading } = useAllAuditCriteria(auditModule);

  const moduleItems = useMemo(() => AUDIT_MODULES.map((value) => ({ value, label: t.audit.modules[value] })), [t]);
  const titles = useMemo(() => Object.fromEntries((criteria ?? []).map((item) => [item.id, item.title])), [criteria]);

  // Whenever the module (and so its criteria) changes, restart the scores at 0 for each of its criteria.
  useEffect(() => {
    if (!auditModule) return;
    scoresArray.replace(
      (criteria ?? []).map((item) => ({ criteriaId: item.id, score: 0, maxScore: item.maxScore })),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `replace` is stable; re-running on its identity would loop
  }, [criteria, auditModule]);

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      const created = await mutateAsync({
        module: values.module,
        moduleId: values.moduleId,
        scores: values.scores.map(({ criteriaId, score }) => ({ criteriaId, score })),
      });
      toast.success(ta.success);
      form.reset();
      setOpen(false);
      router.push(`/dashboard/audit/${created.id}`);
    } catch {
      toast.error(ta.error);
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2" />}>
        <Scale />
        {variant === "card" ? t.audit.home.cardButton : ta.title}
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
              name="module"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{ta.module}</FormLabel>
                  <Select
                    value={field.value ?? null}
                    items={moduleItems}
                    onValueChange={(next) => {
                      field.onChange(next);
                      form.setValue("moduleId", "");
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12 w-full">
                        <SelectValue placeholder={ta.selectModule} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {moduleItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {auditModule && (
              <FormField
                control={form.control}
                name="moduleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.audit.modules[auditModule]}</FormLabel>
                    <FormControl>
                      <ModuleItemSelect module={auditModule} value={field.value} onValueChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {auditModule && isLoading && <p className="text-center text-muted-foreground">{ta.loadingCriteria}</p>}
            {auditModule && !isLoading && scoresArray.fields.length === 0 && (
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

export function AddAuditDialog(props: React.ComponentProps<typeof AddAuditDialogInner>) {
  return (
    <Can permission="audit.create">
      <AddAuditDialogInner {...props} />
    </Can>
  );
}
