"use client";

import { useId, useMemo } from "react";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import type { UseFieldArrayReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { LinkSelect } from "@/components/shared/link-select";
import { useAllUsers } from "@/lib/administration/hooks";
import { useAllLawyers, useAssignCollaborators, useOneLitigation } from "@/lib/litigation/hooks";
import { useAssignForm, type AssignFormValues } from "@/lib/litigation/forms";
import type { Litigation } from "@/lib/litigation/litigations";
import { useDictionary } from "@/lib/i18n/locale-provider";
import type { UseFormReturn } from "react-hook-form";

interface SectionProps {
  label: string;
  itemLabel: string;
  addLabel: string;
  placeholder: string;
  emptyLabel: string;
  options: { id: string; title: string }[];
  isLoading: boolean;
  loadingLabel: string;
}

function PersonSection<Name extends "users" | "lawyers">({
  name,
  keyName,
  form,
  fieldArray,
  ...labels
}: SectionProps & {
  name: Name;
  keyName: "userId" | "lawyerId";
  form: UseFormReturn<AssignFormValues>;
  fieldArray: UseFieldArrayReturn<AssignFormValues, Name>;
}) {
  return (
    <div className="relative flex flex-col gap-5 rounded-xl border-2 p-5">
      <span className="absolute left-3 top-0 -translate-y-1/2 bg-background px-2 text-sm font-semibold">{labels.label}</span>
      {fieldArray.fields.map((item, index) => (
        <div key={item.id} className="flex items-start gap-3">
          <FormField
            control={form.control}
            name={`${name}.${index}.${keyName}` as `users.${number}.userId`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <LinkSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    options={labels.options}
                    isLoading={labels.isLoading}
                    placeholder={labels.placeholder}
                    loadingLabel={labels.loadingLabel}
                    emptyLabel={labels.emptyLabel}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => fieldArray.remove(index)}
          >
            <X />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="ghost"
        className="gap-2 self-end"
        onClick={() => fieldArray.append({ [keyName]: "" } as never)}
      >
        <Plus />
        {labels.addLabel}
      </Button>
    </div>
  );
}

function AssignBody({ litigation, onClose }: { litigation: Litigation; onClose: () => void }) {
  const { t } = useDictionary();
  const tl = t.litigation;
  const formId = useId();
  // Prefilled with who is already assigned: the backend replaces the assignment, so starting empty
  // (as the original did) silently removes everyone not re-selected.
  const { form, usersArray, lawyersArray } = useAssignForm({
    users: litigation.users.map((user) => ({ userId: user.id })),
    lawyers: litigation.lawyers.map((lawyer) => ({ lawyerId: lawyer.id })),
  });
  const { mutateAsync } = useAssignCollaborators(litigation.id);
  const { data: users, isLoading: usersLoading } = useAllUsers();
  const { data: lawyers, isLoading: lawyersLoading } = useAllLawyers();
  const userOptions = useMemo(
    () => (users ?? []).map((user) => ({ id: String(user.id), title: `${user.lastname} ${user.firstname}` })),
    [users],
  );
  const lawyerOptions = useMemo(() => (lawyers ?? []).map((lawyer) => ({ id: lawyer.id, title: lawyer.name })), [lawyers]);

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await mutateAsync({
        users: values.users.map((item) => item.userId),
        lawyers: values.lawyers.map((item) => item.lawyerId),
      });
      toast.success(tl.assignCollaboratorsSuccess);
      onClose();
    } catch {
      toast.error(tl.assignCollaboratorsError);
    }
  });

  return (
    <>
      <Form {...form}>
        <form
          id={formId}
          noValidate
          className="-mx-4 max-h-[60vh] space-y-8 overflow-y-auto px-4 py-3"
          onSubmit={handleSubmit}
        >
          <PersonSection
            name="users"
            keyName="userId"
            form={form}
            fieldArray={usersArray}
            label={tl.collaboratorsLabel}
            itemLabel={tl.collaboratorLabel}
            addLabel={tl.addCollaboratorButton}
            placeholder={tl.selectCollaboratorPlaceholder}
            emptyLabel={tl.noCollaboratorsFound}
            options={userOptions}
            isLoading={usersLoading}
            loadingLabel={tl.loading}
          />
          <PersonSection
            name="lawyers"
            keyName="lawyerId"
            form={form}
            fieldArray={lawyersArray}
            label={tl.lawyersLabel}
            itemLabel={tl.lawyerLabel}
            addLabel={tl.addLawyerButton}
            placeholder={tl.selectLawyerPlaceholder}
            emptyLabel={tl.noLawyersFound}
            options={lawyerOptions}
            isLoading={lawyersLoading}
            loadingLabel={tl.loading}
          />
        </form>
      </Form>
      <DialogFooter className="gap-2">
        <DialogClose render={<Button type="button" variant="destructive" />}>{tl.cancelButton}</DialogClose>
        <Button type="submit" form={formId} disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "..." : tl.assignButton}
        </Button>
      </DialogFooter>
    </>
  );
}

/** Controlled: opened from the details table. */
export function AssignCollaboratorsDialog({
  litigationId,
  open,
  onOpenChange,
}: {
  litigationId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useDictionary();
  const tl = t.litigation;
  const { data, isLoading, isError } = useOneLitigation(litigationId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{tl.assignCollaboratorsTitle}</DialogTitle>
          <DialogDescription>{tl.assignCollaboratorsDescription}</DialogDescription>
        </DialogHeader>
        {isError && <p className="text-destructive">{t.common.loadError}</p>}
        {isLoading && <p className="italic text-muted-foreground">{tl.loading}</p>}
        {data && <AssignBody litigation={data} onClose={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}
