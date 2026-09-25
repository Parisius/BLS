"use client";

import { useId, useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Tag, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CRITERIA_TYPES } from "@/lib/audit/constants";
import type { AuditCriteria } from "@/lib/audit/criteria";
import { useCriteriaForm, type CriteriaFormValues } from "@/lib/audit/forms";
import {
  useAllAuditCriteria,
  useCreateAuditCriteria,
  useDeleteAuditCriteria,
  useUpdateAuditCriteria,
} from "@/lib/audit/hooks";
import { useDictionary } from "@/lib/i18n/locale-provider";

function CriteriaFormDialog({
  module,
  criteria,
  open,
  onOpenChange,
}: {
  module: string;
  /** Absent when adding. */
  criteria?: AuditCriteria;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useDictionary();
  const tc = t.audit.criteria;
  const formId = useId();
  const editing = !!criteria;
  const form = useCriteriaForm(
    criteria
      ? {
          title: criteria.title,
          type: criteria.type as CriteriaFormValues["type"],
          maxScore: criteria.maxScore,
          description: criteria.description,
        }
      : undefined,
  );
  const { mutateAsync: create } = useCreateAuditCriteria(module);
  const { mutateAsync: update } = useUpdateAuditCriteria(criteria?.id ?? "", module);
  const typeItems = CRITERIA_TYPES.map((value) => ({ value, label: t.audit.criteriaTypes[value] }));

  const handleSubmit = form.handleSubmit(async (values) => {
    const args = { ...values, maxScore: Number(values.maxScore) };
    try {
      await (editing ? update(args) : create(args));
      toast.success(editing ? tc.editSuccess : tc.addSuccess);
      if (!editing) form.reset();
      onOpenChange(false);
    } catch {
      toast.error(editing ? tc.editError : tc.addError);
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? tc.editTitle : tc.addTitle}</DialogTitle>
          <DialogDescription>{editing ? tc.editDescription : tc.addDescription}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id={formId}
            noValidate
            className="-mx-4 max-h-[60vh] space-y-5 overflow-y-auto px-4 py-1"
            onSubmit={handleSubmit}
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tc.type}</FormLabel>
                  <Select value={field.value} items={typeItems} onValueChange={(next) => field.onChange(next ?? "")}>
                    <FormControl>
                      <SelectTrigger className="h-12 w-full">
                        <SelectValue placeholder={tc.selectType} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {typeItems.map((item) => (
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
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tc.titleLabel}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={tc.titleLabel} className="h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxScore"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tc.maxScoreLabel}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      step="any"
                      name={field.name}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      value={field.value as number | string}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tc.descriptionLabel}</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder={tc.descriptionLabel} className="resize-none" rows={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="gap-2">
          <DialogClose render={<Button type="button" variant="destructive" />}>{tc.cancel}</DialogClose>
          <Button type="submit" form={formId} disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "..." : editing ? tc.editSubmit : tc.addSubmit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Criteria of one module, with add / edit / delete. */
export function CriteriaView({ module, label }: { module: string; label: string }) {
  const { t } = useDictionary();
  const tc = t.audit.criteria;
  const { data, isLoading, isError } = useAllAuditCriteria(module);
  const { mutateAsync: remove, isPending: removing } = useDeleteAuditCriteria();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<AuditCriteria | null>(null);
  const [deleting, setDeleting] = useState<AuditCriteria | null>(null);

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await remove(deleting.id);
      toast.success(tc.deleteSuccess);
      setDeleting(null);
    } catch {
      toast.error(tc.deleteError);
    }
  };

  if (isError) return <p className="text-destructive">{t.common.loadError}</p>;
  if (isLoading) return <Skeleton className="h-32 w-full" />;

  return (
    <div className="relative flex flex-col gap-5 rounded-xl border-2 p-5">
      <span className="absolute left-3 top-0 -translate-y-1/2 bg-background px-2 text-sm font-semibold">{label}</span>
      {(!data || data.length === 0) && (
        <p className="text-md text-center italic text-muted-foreground">{tc.none}</p>
      )}
      {data?.map((criteria) => (
        <div key={criteria.id} className="flex items-start gap-5">
          <div className="flex-1 space-y-2">
            <span className="text-sm italic text-muted-foreground">{tc.criterion}</span>
            <div className="flex items-center gap-2">
              <User className="flex-shrink-0" />
              <span>{criteria.title}</span>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <span className="text-sm italic text-muted-foreground">{tc.maxScore}</span>
            <div className="flex items-center gap-2">
              <Tag />
              <span>{criteria.maxScore}</span>
            </div>
          </div>
          <div className="flex items-center">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={tc.editTitle}
              className="rounded-full"
              onClick={() => setEditing(criteria)}
            >
              <Pencil />
            </Button>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={tc.delete}
                    className="rounded-full text-destructive"
                    onClick={() => setDeleting(criteria)}
                  />
                }
              >
                <X />
              </TooltipTrigger>
              <TooltipContent>{tc.delete}</TooltipContent>
            </Tooltip>
          </div>
        </div>
      ))}
      <Button type="button" variant="ghost" className="gap-2 self-end" onClick={() => setAdding(true)}>
        <Plus />
        {tc.add}
      </Button>

      <CriteriaFormDialog module={module} open={adding} onOpenChange={setAdding} />
      {/* Remounted per criterion so the form starts from its current values. */}
      <CriteriaFormDialog
        key={editing?.id ?? "none"}
        module={module}
        criteria={editing ?? undefined}
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
      />
      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tc.deleteTitle}</AlertDialogTitle>
            <AlertDialogDescription>{tc.deleteDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel type="button">{tc.cancel}</AlertDialogCancel>
            <Button variant="destructive" disabled={removing} onClick={() => void handleDelete()}>
              {removing ? "..." : tc.delete}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
