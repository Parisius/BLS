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
import { AdministratorFormFields } from "@/components/governance/administration-meeting/administrator-form-fields";
import { MandatesHistoryDialog } from "@/components/governance/administration-meeting/mandates-ui";
import {
  useAllAdministrators,
  useCreateAdministrator,
  useUpdateAdministrator,
  useDeleteAdministrator,
} from "@/lib/governance/administration-meeting/hooks";
import {
  useAddAdministratorForm,
  useUpdateAdministratorForm,
  type UpdateAdministratorFormValues,
} from "@/lib/governance/administration-meeting/forms";
import type { Control } from "react-hook-form";
import { formatDisplayDate } from "@/lib/shared/date-utils";
import { useDictionary } from "@/lib/i18n/locale-provider";
import type { Administrator } from "@/lib/governance/administration-meeting/administrators";
import { Can } from "@/components/auth/can";

function ageFromBirthDate(birthDate?: string) {
  if (!birthDate) return "-";
  const date = new Date(birthDate);
  if (Number.isNaN(date.getTime())) return "-";
  const diff = Date.now() - date.getTime();
  return String(Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)));
}

function AddAdministratorDialog() {
  const form = useAddAdministratorForm();
  const { mutateAsync } = useCreateAdministrator();
  const { t } = useDictionary();
  const tg = t.administrationMeeting;
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
        {tg.administratorsTable.add}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{tg.addAdministratorDialog.title}</DialogTitle>
          <DialogDescription>{tg.addAdministratorDialog.description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="add-administrator-form"
            noValidate
            className="-mx-4 max-h-[60vh] space-y-5 overflow-y-auto px-4 py-1"
            onSubmit={handleSubmit}
          >
            <AdministratorFormFields control={form.control as unknown as Control<UpdateAdministratorFormValues>} />
            <FormField
              control={form.control}
              name="mandateStartDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tg.administratorForm.mandateStartDateLabel}</FormLabel>
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
            {tg.addAdministratorDialog.cancel}
          </DialogClose>
          <Button type="submit" form="add-administrator-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "..." : tg.addAdministratorDialog.add}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function UpdateAdministratorDialog({
  administrator,
  open,
  onOpenChange,
}: {
  administrator: Administrator | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useUpdateAdministratorForm(
    administrator
      ? {
          name: administrator.name,
          nationality: administrator.nationality ?? "",
          address: administrator.address ?? "",
          birthDate: administrator.birthDate ?? "",
          birthPlace: administrator.birthPlace ?? "",
          shares: administrator.shares ?? 0,
          sharePercentage: administrator.sharePercentage ?? 0,
          type: administrator.type,
          quality: administrator.quality ?? "non_shareholder",
          role: administrator.role ?? "ca_non_executive_admin",
          denomination: administrator.denomination ?? "",
          companyHeadOffice: administrator.companyHeadOffice ?? "",
          companyNationality: administrator.companyNationality ?? "",
        }
      : undefined,
  );
  const { mutateAsync } = useUpdateAdministrator();
  const { t } = useDictionary();
  const tg = t.administrationMeeting;

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!administrator) return;
    await mutateAsync(
      { administratorId: administrator.id, ...values },
      { onSuccess: () => onOpenChange(false), onError: () => toast.error(t.common.loadError) },
    );
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{tg.updateAdministratorDialog.title}</DialogTitle>
          <DialogDescription>{tg.updateAdministratorDialog.description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="update-administrator-form"
            noValidate
            className="-mx-4 max-h-[60vh] overflow-y-auto px-4 py-1"
            onSubmit={handleSubmit}
          >
            <AdministratorFormFields control={form.control} />
          </form>
        </Form>
        <DialogFooter className="gap-2">
          <DialogClose render={<Button type="button" variant="destructive" />}>
            {tg.updateAdministratorDialog.cancel}
          </DialogClose>
          <Button type="submit" form="update-administrator-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "..." : tg.updateAdministratorDialog.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteAdministratorButton({ administratorId }: { administratorId: string }) {
  const { mutate, isPending } = useDeleteAdministrator();
  const { t } = useDictionary();
  const tg = t.administrationMeeting;

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
        <TooltipContent>{tg.administratorsTable.delete}</TooltipContent>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{tg.deleteAdministratorDialog.title}</AlertDialogTitle>
          <AlertDialogDescription>{tg.deleteAdministratorDialog.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{tg.addAdministratorDialog.cancel}</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => mutate(administratorId, { onError: () => toast.error(t.common.loadError) })}
          >
            {tg.administratorsTable.delete}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function AdministratorsModal() {
  const { data, isLoading, isError } = useAllAdministrators();
  const { t } = useDictionary();
  const tg = t.administrationMeeting;
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Administrator | null>(null);

  const filtered = (data ?? []).filter((a) => a.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="secondary" className="gap-2" />}>
        <Users />
        {tg.currentMeetingView.administratorsList}
      </DialogTrigger>
      <DialogContent className="flex max-h-screen max-w-5xl flex-col">
        <DialogHeader>
          <DialogTitle>{tg.administratorsTable.title}</DialogTitle>
          <DialogDescription>{tg.administratorsTable.description}</DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between gap-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={tg.administratorsTable.search}
            className="h-10 max-w-xs"
          />
          <Can permission="governance.create">
            <AddAdministratorDialog />
          </Can>
        </div>

        <div className="flex-1 overflow-auto">
          {isLoading && <p>{tg.administratorsTable.loading}</p>}
          {isError && <p className="text-destructive">{tg.administratorsTable.error}</p>}
          {!isLoading && !isError && filtered.length === 0 && (
            <p className="italic text-muted-foreground">{tg.administratorsTable.noResults}</p>
          )}
          {!isLoading && !isError && filtered.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{tg.administratorsTable.columnName}</TableHead>
                  <TableHead>{tg.administratorsTable.columnNationality}</TableHead>
                  <TableHead>{tg.administratorsTable.columnRole}</TableHead>
                  <TableHead>{tg.administratorsTable.columnQuality}</TableHead>
                  <TableHead>{tg.administratorsTable.columnBirthdate}</TableHead>
                  <TableHead>{tg.administratorsTable.columnAge}</TableHead>
                  <TableHead>{tg.administratorsTable.columnBirthplace}</TableHead>
                  <TableHead>{tg.administratorsTable.columnAddress}</TableHead>
                  <TableHead className="text-end" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((administrator) => (
                  <TableRow key={administrator.id}>
                    <TableCell>{administrator.name}</TableCell>
                    <TableCell>{administrator.nationality ?? "-"}</TableCell>
                    <TableCell>{administrator.role ? tg.administratorRole[administrator.role] : "-"}</TableCell>
                    <TableCell>{administrator.quality ? tg.administratorQuality[administrator.quality] : "-"}</TableCell>
                    <TableCell>
                      {administrator.birthDate ? formatDisplayDate(administrator.birthDate) : "-"}
                    </TableCell>
                    <TableCell>{ageFromBirthDate(administrator.birthDate)}</TableCell>
                    <TableCell>{administrator.birthPlace ?? "-"}</TableCell>
                    <TableCell>{administrator.address ?? "-"}</TableCell>
                    <TableCell className="text-end">
                      <MandatesHistoryDialog administrator={administrator} />
                      <Can permission="governance.update">
                        <Button variant="ghost" size="icon" onClick={() => setEditing(administrator)}>
                          <Pencil />
                        </Button>
                      </Can>
                      <Can permission="governance.delete">
                        <DeleteAdministratorButton administratorId={administrator.id} />
                      </Can>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <UpdateAdministratorDialog
          key={editing?.id ?? "none"}
          administrator={editing}
          open={!!editing}
          onOpenChange={(open) => !open && setEditing(null)}
        />

        <DialogFooter>
          <DialogClose render={<Button variant="destructive" />}>{tg.administratorsTable.close}</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
