"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DirectorFormFields } from "@/components/governance/management-committee/director-form-fields";
import { MandatesHistoryDialog } from "@/components/governance/management-committee/mandates-ui";
import {
  useAllDirectors,
  useCreateDirector,
  useUpdateDirector,
  useDeleteDirector,
} from "@/lib/governance/management-committee/hooks";
import {
  useAddDirectorForm,
  useUpdateDirectorForm,
  type UpdateDirectorFormValues,
} from "@/lib/governance/management-committee/forms";
import type { Control } from "react-hook-form";
import { formatDisplayDate } from "@/lib/shared/date-utils";
import { useDictionary } from "@/lib/i18n/locale-provider";
import type { Director } from "@/lib/governance/management-committee/directors";
import { Can } from "@/components/auth/can";

function ageFromBirthDate(birthDate?: string) {
  if (!birthDate) return "-";
  const date = new Date(birthDate);
  if (Number.isNaN(date.getTime())) return "-";
  const diff = Date.now() - date.getTime();
  return String(Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)));
}

function AddDirectorDialog() {
  const form = useAddDirectorForm();
  const { mutateAsync } = useCreateDirector();
  const { t } = useDictionary();
  const tg = t.managementCommittee;
  const [open, setOpen] = useState(false);

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(values, {
      onSuccess: () => {
        form.reset();
        setOpen(false);
      },
      onError: () => toast.error(t.common.loadError),
    });
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2" />}>
        <UserPlus />
        {tg.directorsTable.add}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{tg.addDirectorDialog.title}</DialogTitle>
          <DialogDescription>{tg.addDirectorDialog.description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="add-director-form"
            className="-mx-4 max-h-[60vh] space-y-5 overflow-y-auto px-4 py-1"
            onSubmit={handleSubmit}
          >
            <DirectorFormFields control={form.control as unknown as Control<UpdateDirectorFormValues>} />
            <FormField
              control={form.control}
              name="mandateStartDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tg.directorForm.mandateStartDateLabel}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className="h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="gap-2">
          <DialogClose render={<Button type="button" variant="destructive" onClick={() => form.reset()} />}>
            {tg.addDirectorDialog.cancel}
          </DialogClose>
          <Button type="submit" form="add-director-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "..." : tg.addDirectorDialog.add}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function UpdateDirectorDialog({
  director,
  open,
  onOpenChange,
}: {
  director: Director | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useUpdateDirectorForm(
    director
      ? {
          name: director.name,
          nationality: director.nationality ?? "",
          address: director.address ?? "",
          birthDate: director.birthDate ?? "",
          birthPlace: director.birthPlace ?? "",
        }
      : undefined,
  );
  const { mutateAsync } = useUpdateDirector();
  const { t } = useDictionary();
  const tg = t.managementCommittee;

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!director) return;
    await mutateAsync(
      { directorId: director.id, ...values },
      { onSuccess: () => onOpenChange(false), onError: () => toast.error(t.common.loadError) },
    );
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{tg.updateDirectorDialog.title}</DialogTitle>
          <DialogDescription>{tg.updateDirectorDialog.description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="update-director-form"
            className="-mx-4 max-h-[60vh] overflow-y-auto px-4 py-1"
            onSubmit={handleSubmit}
          >
            <DirectorFormFields control={form.control} />
          </form>
        </Form>
        <DialogFooter className="gap-2">
          <DialogClose render={<Button type="button" variant="destructive" />}>
            {tg.updateDirectorDialog.cancel}
          </DialogClose>
          <Button type="submit" form="update-director-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "..." : tg.updateDirectorDialog.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteDirectorButton({ directorId }: { directorId: string }) {
  const { mutate, isPending } = useDeleteDirector();
  const { t } = useDictionary();
  const tg = t.managementCommittee;

  return (
    <AlertDialog>
      <Tooltip>
        <AlertDialogTrigger
          render={
            <TooltipTrigger render={<Button variant="ghost" size="icon" className="text-destructive" />} />
          }
        >
          <Trash />
        </AlertDialogTrigger>
        <TooltipContent>{tg.directorsTable.delete}</TooltipContent>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{tg.deleteDirectorDialog.title}</AlertDialogTitle>
          <AlertDialogDescription>{tg.deleteDirectorDialog.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{tg.addDirectorDialog.cancel}</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => mutate(directorId, { onError: () => toast.error(t.common.loadError) })}
          >
            {tg.directorsTable.delete}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function DirectorsModal() {
  const { data, isLoading, isError } = useAllDirectors();
  const { t } = useDictionary();
  const tg = t.managementCommittee;
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Director | null>(null);

  const filtered = (data ?? []).filter((a) => a.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="secondary" className="gap-2" />}>
        <Users />
        {tg.currentMeetingView.directorsList}
      </DialogTrigger>
      <DialogContent className="flex max-h-screen max-w-5xl flex-col">
        <DialogHeader>
          <DialogTitle>{tg.directorsTable.title}</DialogTitle>
          <DialogDescription>{tg.directorsTable.description}</DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between gap-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={tg.directorsTable.search}
            className="h-10 max-w-xs"
          />
          <Can permission="governance.create">
            <AddDirectorDialog />
          </Can>
        </div>

        <div className="flex-1 overflow-auto">
          {isLoading && <p>{tg.directorsTable.loading}</p>}
          {isError && <p className="text-destructive">{tg.directorsTable.error}</p>}
          {!isLoading && !isError && filtered.length === 0 && (
            <p className="italic text-muted-foreground">{tg.directorsTable.noResults}</p>
          )}
          {!isLoading && !isError && filtered.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{tg.directorsTable.columnName}</TableHead>
                  <TableHead>{tg.directorsTable.columnNationality}</TableHead>
                  <TableHead>{tg.directorsTable.columnBirthdate}</TableHead>
                  <TableHead>{tg.directorsTable.columnAge}</TableHead>
                  <TableHead>{tg.directorsTable.columnBirthplace}</TableHead>
                  <TableHead>{tg.directorsTable.columnAddress}</TableHead>
                  <TableHead className="text-end" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((director) => (
                  <TableRow key={director.id}>
                    <TableCell>{director.name}</TableCell>
                    <TableCell>{director.nationality ?? "-"}</TableCell>
                    <TableCell>
                      {director.birthDate ? formatDisplayDate(director.birthDate) : "-"}
                    </TableCell>
                    <TableCell>{ageFromBirthDate(director.birthDate)}</TableCell>
                    <TableCell>{director.birthPlace ?? "-"}</TableCell>
                    <TableCell>{director.address ?? "-"}</TableCell>
                    <TableCell className="text-end">
                      <MandatesHistoryDialog director={director} />
                      <Can permission="governance.update">
                        <Button variant="ghost" size="icon" onClick={() => setEditing(director)}>
                          <Pencil />
                        </Button>
                      </Can>
                      <Can permission="governance.delete">
                        <DeleteDirectorButton directorId={director.id} />
                      </Can>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <UpdateDirectorDialog
          key={editing?.id ?? "none"}
          director={editing}
          open={!!editing}
          onOpenChange={(open) => !open && setEditing(null)}
        />

        <DialogFooter>
          <DialogClose render={<Button variant="destructive" />}>{tg.directorsTable.close}</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
