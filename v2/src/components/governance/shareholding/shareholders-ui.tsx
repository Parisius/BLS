"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Printer, Trash, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import { Form } from "@/components/ui/form";
import { ShareholderFormFields } from "@/components/governance/shareholding/shareholder-form-fields";
import {
  useAllShareholders,
  useCreateShareholder,
  useUpdateShareholder,
  useDeleteShareholder,
  usePrintSharesCertificate,
} from "@/lib/governance/shareholding/hooks";
import { useShareholderForm } from "@/lib/governance/shareholding/forms";
import type { Shareholder } from "@/lib/governance/shareholding/shareholders";
import { formatNumber } from "@/lib/shared/format";
import { downloadBytes } from "@/lib/shared/download";
import { useDictionary } from "@/lib/i18n/locale-provider";
import { Can } from "@/components/auth/can";

function AddShareholderDialog() {
  const form = useShareholderForm();
  const { mutateAsync } = useCreateShareholder();
  const { t } = useDictionary();
  const td = t.shareholding.addShareholderDialog;
  const [open, setOpen] = useState(false);

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(values, {
      onSuccess: () => {
        toast.success(td.success);
        form.reset();
        setOpen(false);
      },
      onError: () => toast.error(td.error),
    });
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2" />}>
        <UserPlus />
        <span className="sr-only sm:not-sr-only">{t.shareholding.shareholdersModal.add}</span>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{td.title}</DialogTitle>
          <DialogDescription>{td.description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="add-shareholder-form"
            noValidate
            className="-mx-4 max-h-[60vh] overflow-y-auto px-4 py-1"
            onSubmit={handleSubmit}
          >
            <ShareholderFormFields control={form.control} />
          </form>
        </Form>
        <DialogFooter className="gap-2">
          <DialogClose render={<Button type="button" variant="destructive" onClick={() => form.reset()} />}>
            {td.cancel}
          </DialogClose>
          <Button type="submit" form="add-shareholder-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "..." : td.add}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function UpdateShareholderDialog({
  shareholder,
  open,
  onOpenChange,
}: {
  shareholder: Shareholder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useShareholderForm(
    shareholder
      ? {
          type: shareholder.type,
          corporateType: shareholder.corporateType,
          name: shareholder.name,
          nationality: shareholder.nationality,
          address: shareholder.address,
          encumberedShares: shareholder.encumberedShares,
          unencumberedShares: shareholder.unencumberedShares,
        }
      : undefined,
  );
  const { mutateAsync } = useUpdateShareholder();
  const { t } = useDictionary();
  const td = t.shareholding.updateShareholderDialog;

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!shareholder) return;
    await mutateAsync(
      { shareholderId: shareholder.id, ...values },
      {
        onSuccess: () => {
          toast.success(td.success);
          onOpenChange(false);
        },
        onError: () => toast.error(td.error),
      },
    );
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{td.title}</DialogTitle>
          <DialogDescription>{td.description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="update-shareholder-form"
            noValidate
            className="-mx-4 max-h-[60vh] overflow-y-auto px-4 py-1"
            onSubmit={handleSubmit}
          >
            <ShareholderFormFields control={form.control} />
          </form>
        </Form>
        <DialogFooter className="gap-2">
          <DialogClose render={<Button type="button" variant="destructive" />}>{td.cancel}</DialogClose>
          <Button type="submit" form="update-shareholder-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "..." : td.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PrintCertificateButton({ shareholderId }: { shareholderId: string }) {
  const { mutate, isPending } = usePrintSharesCertificate();
  const { t } = useDictionary();

  return (
    <Can permission="governance.print">
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full"
              disabled={isPending}
              onClick={() =>
                mutate(shareholderId, {
                  onSuccess: ({ bytes, filename }) => downloadBytes(bytes, filename),
                  onError: () => toast.error(t.shareholding.table.printError),
                })
              }
            />
          }
        >
          <Printer className={isPending ? "animate-bounce" : undefined} />
        </TooltipTrigger>
        <TooltipContent>{t.shareholding.table.printCertificate}</TooltipContent>
      </Tooltip>
    </Can>
  );
}

function DeleteShareholderButton({ shareholderId }: { shareholderId: string }) {
  const { mutate, isPending } = useDeleteShareholder();
  const { t } = useDictionary();
  const td = t.shareholding.deleteShareholderDialog;

  return (
    <AlertDialog>
      <Tooltip>
        <AlertDialogTrigger
          render={<TooltipTrigger render={<Button variant="ghost" size="icon" className="rounded-full text-destructive" />} />}
        >
          <Trash />
        </AlertDialogTrigger>
        <TooltipContent>{t.shareholding.table.delete}</TooltipContent>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{td.title}</AlertDialogTitle>
          <AlertDialogDescription>{td.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{td.cancel}</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() =>
              mutate(shareholderId, {
                onSuccess: () => toast.success(td.success),
                onError: () => toast.error(td.error),
              })
            }
          >
            {td.delete}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function ShareholdersModal({ trigger, children }: { trigger: React.ReactElement; children?: React.ReactNode }) {
  const { data, isLoading, isError } = useAllShareholders();
  const { t } = useDictionary();
  const tm = t.shareholding.shareholdersModal;
  const tt = t.shareholding.table;
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Shareholder | null>(null);

  const filtered = (data ?? []).filter((s) => {
    const term = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(term) ||
      s.nationality.toLowerCase().includes(term) ||
      s.address.toLowerCase().includes(term)
    );
  });

  return (
    <Dialog>
      <DialogTrigger render={trigger}>{children}</DialogTrigger>
      <DialogContent className="flex max-h-screen max-w-[90%] flex-col">
        <DialogHeader>
          <DialogTitle>{tm.title}</DialogTitle>
          <DialogDescription>{tm.description}</DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between gap-3">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={tm.search}
            className="h-10 max-w-xs"
          />
          <Can permission="governance.manage_shareholding">
            <AddShareholderDialog />
          </Can>
        </div>

        <div className="max-h-80 flex-1 overflow-auto sm:max-h-96">
          {isLoading && <p>{tm.loading}</p>}
          {isError && <p className="text-destructive">{tm.error}</p>}
          {!isLoading && !isError && filtered.length === 0 && (
            <p className="italic text-muted-foreground">{tm.noShareholders}</p>
          )}
          {!isLoading && !isError && filtered.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{tt.name}</TableHead>
                  <TableHead>{tt.nationality}</TableHead>
                  <TableHead>{tt.address}</TableHead>
                  <TableHead>{tt.type}</TableHead>
                  <TableHead>{tt.category}</TableHead>
                  <TableHead>{tt.unencumberedShares}</TableHead>
                  <TableHead>{tt.encumberedShares}</TableHead>
                  <TableHead>{tt.totalShares}</TableHead>
                  <TableHead>{tt.sharePercentage}</TableHead>
                  <TableHead className="text-center">{tt.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((shareholder) => (
                  <TableRow key={shareholder.id}>
                    <TableCell>{shareholder.name}</TableCell>
                    <TableCell>{shareholder.nationality}</TableCell>
                    <TableCell>{shareholder.address}</TableCell>
                    <TableCell>{t.shareholding.shareholderType[shareholder.type]}</TableCell>
                    <TableCell>
                      {shareholder.corporateType ? t.shareholding.corporateType[shareholder.corporateType] : "-"}
                    </TableCell>
                    <TableCell>{formatNumber(shareholder.unencumberedShares)}</TableCell>
                    <TableCell>{formatNumber(shareholder.encumberedShares)}</TableCell>
                    <TableCell>{formatNumber(shareholder.unencumberedShares + shareholder.encumberedShares)}</TableCell>
                    <TableCell>{shareholder.sharePercentage}%</TableCell>
                    <TableCell className="text-nowrap text-center">
                      <Can permission="governance.manage_shareholding">
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="rounded-full"
                                onClick={() => setEditing(shareholder)}
                              />
                            }
                          >
                            <Pencil size={16} />
                          </TooltipTrigger>
                          <TooltipContent>{tt.edit}</TooltipContent>
                        </Tooltip>
                      </Can>
                      <PrintCertificateButton shareholderId={shareholder.id} />
                      <Can permission="governance.delete">
                        <DeleteShareholderButton shareholderId={shareholder.id} />
                      </Can>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <UpdateShareholderDialog
          key={editing?.id ?? "none"}
          shareholder={editing}
          open={!!editing}
          onOpenChange={(open) => !open && setEditing(null)}
        />

        <DialogFooter>
          <DialogClose render={<Button variant="destructive" />}>{tm.close}</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
