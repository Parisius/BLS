"use client";

import { useId, useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Tag, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
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
import { useCollaboratorForm } from "@/lib/evaluation/forms";
import {
  useAllCollaborators,
  useCreateCollaborator,
  useDeleteCollaborator,
  useUpdateCollaborator,
} from "@/lib/evaluation/hooks";
import type { Collaborator } from "@/lib/evaluation/mappers";
import { useDictionary } from "@/lib/i18n/locale-provider";

function CollaboratorFormDialog({
  profileId,
  collaborator,
  open,
  onOpenChange,
}: {
  profileId: string;
  /** Absent when adding. */
  collaborator?: Collaborator;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useDictionary();
  const tc = t.evaluation.collaborators;
  const formId = useId();
  const editing = !!collaborator;
  const form = useCollaboratorForm(
    collaborator ? { lastname: collaborator.lastname, firstname: collaborator.firstname } : undefined,
  );
  const { mutateAsync: create } = useCreateCollaborator();
  const { mutateAsync: update } = useUpdateCollaborator();

  const handleSubmit = form.handleSubmit(async (values) => {
    const args = { ...values, profileId };
    try {
      if (collaborator) await update({ collaboratorId: collaborator.id, args });
      else await create(args);
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
          <form id={formId} noValidate className="space-y-5" onSubmit={handleSubmit}>
            {(
              [
                ["lastname", tc.lastname],
                ["firstname", tc.firstname],
              ] as const
            ).map(([name, label]) => (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={label} className="h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
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

/** Collaborators of one profile, with add / edit / delete. */
export function CollaboratorsManager({ profileId, label }: { profileId: string; label: string }) {
  const { t } = useDictionary();
  const tc = t.evaluation.collaborators;
  const { data, isLoading, isError } = useAllCollaborators(profileId);
  const { mutateAsync: remove } = useDeleteCollaborator();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Collaborator | null>(null);
  const [deleting, setDeleting] = useState<Collaborator | null>(null);
  const [removing, setRemoving] = useState(false);

  const handleDelete = async () => {
    if (!deleting) return;
    setRemoving(true);
    try {
      await remove(deleting.id);
      toast.success(tc.deleteSuccess);
      setDeleting(null);
    } catch {
      toast.error(tc.deleteError);
    } finally {
      setRemoving(false);
    }
  };

  if (isError) return <p className="text-destructive">{t.common.loadError}</p>;
  if (isLoading) return <Skeleton className="h-32 w-full" />;

  return (
    <div className="relative flex flex-col gap-5 rounded-xl border-2 p-5">
      <span className="absolute left-3 top-0 -translate-y-1/2 bg-background px-2 text-sm font-semibold">{label}</span>
      {(!data || data.length === 0) && <p className="text-md text-center italic text-muted-foreground">{tc.none}</p>}
      {data?.map((collaborator) => (
        <div key={collaborator.id} className="flex items-start gap-5">
          <div className="flex-1 space-y-2">
            <span className="text-sm italic text-muted-foreground">{tc.lastname}</span>
            <div className="flex items-center gap-2">
              <User />
              <span>{collaborator.lastname}</span>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <span className="text-sm italic text-muted-foreground">{tc.firstname}</span>
            <div className="flex items-center gap-2">
              <Tag />
              <span>{collaborator.firstname}</span>
            </div>
          </div>
          <div className="flex items-center">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={tc.editTitle}
              className="rounded-full"
              onClick={() => setEditing(collaborator)}
            >
              <Pencil />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={tc.delete}
              className="rounded-full text-destructive"
              onClick={() => setDeleting(collaborator)}
            >
              <X />
            </Button>
          </div>
        </div>
      ))}
      <Button type="button" variant="ghost" className="gap-2 self-end" onClick={() => setAdding(true)}>
        <Plus />
        {tc.add}
      </Button>
      <CollaboratorFormDialog profileId={profileId} open={adding} onOpenChange={setAdding} />
      <CollaboratorFormDialog
        key={editing?.id ?? "none"}
        profileId={profileId}
        collaborator={editing ?? undefined}
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
