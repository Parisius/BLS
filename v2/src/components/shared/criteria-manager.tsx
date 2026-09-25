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
import { useCriteriaForm, type CriteriaFormValues } from "@/lib/shared/scores";

export interface CriterionItem {
  id: string;
  title: string;
  type: string;
  maxScore: number;
  description: string;
}

export interface CriteriaValues {
  title: string;
  type: string;
  maxScore: number;
  description: string;
}

export interface CriteriaLabels {
  none: string;
  criterion: string;
  maxScore: string;
  add: string;
  addTitle: string;
  addDescription: string;
  editTitle: string;
  editDescription: string;
  type: string;
  selectType: string;
  titleLabel: string;
  maxScoreLabel: string;
  descriptionLabel: string;
  cancel: string;
  addSubmit: string;
  editSubmit: string;
  addSuccess: string;
  addError: string;
  editSuccess: string;
  editError: string;
  deleteTitle: string;
  deleteDescription: string;
  delete: string;
  deleteSuccess: string;
  deleteError: string;
}

const CRITERIA_TYPES = ["quantitative", "qualitative"] as const;

function CriteriaFormDialog({
  criteria,
  open,
  onOpenChange,
  labels: tc,
  typeLabels,
  onSubmit,
}: {
  /** Absent when adding. */
  criteria?: CriterionItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  labels: CriteriaLabels;
  typeLabels: Record<(typeof CRITERIA_TYPES)[number], string>;
  onSubmit: (values: CriteriaValues) => Promise<void>;
}) {
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
  const typeItems = CRITERIA_TYPES.map((value) => ({ value, label: typeLabels[value] }));

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await onSubmit({ ...values, maxScore: Number(values.maxScore) });
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

/** Criteria list with add / edit / delete, shared by the audit modules and the evaluation profiles. */
export function CriteriaManager({
  label,
  labels: tc,
  typeLabels,
  errorLabel,
  criteria: data,
  isLoading,
  isError,
  onCreate,
  onUpdate,
  onDelete,
}: {
  label: string;
  labels: CriteriaLabels;
  typeLabels: Record<(typeof CRITERIA_TYPES)[number], string>;
  errorLabel: string;
  criteria?: CriterionItem[];
  isLoading: boolean;
  isError: boolean;
  onCreate: (values: CriteriaValues) => Promise<unknown>;
  onUpdate: (id: string, values: CriteriaValues) => Promise<unknown>;
  onDelete: (id: string) => Promise<unknown>;
}) {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<CriterionItem | null>(null);
  const [deleting, setDeleting] = useState<CriterionItem | null>(null);
  const [removing, setRemoving] = useState(false);

  const handleDelete = async () => {
    if (!deleting) return;
    setRemoving(true);
    try {
      await onDelete(deleting.id);
      toast.success(tc.deleteSuccess);
      setDeleting(null);
    } catch {
      toast.error(tc.deleteError);
    } finally {
      setRemoving(false);
    }
  };

  if (isError) return <p className="text-destructive">{errorLabel}</p>;
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

      <CriteriaFormDialog
        open={adding}
        onOpenChange={setAdding}
        labels={tc}
        typeLabels={typeLabels}
        onSubmit={async (values) => {
          await onCreate(values);
        }}
      />
      {/* Remounted per criterion so the form starts from its current values. */}
      <CriteriaFormDialog
        key={editing?.id ?? "none"}
        criteria={editing ?? undefined}
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
        labels={tc}
        typeLabels={typeLabels}
        onSubmit={async (values) => {
          if (editing) await onUpdate(editing.id, values);
        }}
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
