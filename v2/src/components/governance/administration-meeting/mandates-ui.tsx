"use client";

import { useState } from "react";
import { toast } from "sonner";
import { History, Pencil, RefreshCw } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useMandateDateForm } from "@/lib/governance/administration-meeting/forms";
import { useUpdateMandate, useRenewMandate } from "@/lib/governance/administration-meeting/hooks";
import { formatDisplayDate, toDateInputValue } from "@/lib/shared/date-utils";
import { useDictionary } from "@/lib/i18n/locale-provider";
import type { Administrator, Mandate } from "@/lib/governance/administration-meeting/administrators";

function RenewMandateDialog({
  administratorId,
  open,
  onOpenChange,
}: {
  administratorId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useMandateDateForm();
  const { mutateAsync } = useRenewMandate();
  const { t } = useDictionary();
  const tg = t.administrationMeeting;

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(
      { administratorId, startDate: values.startDate },
      { onSuccess: () => onOpenChange(false), onError: () => toast.error(t.common.loadError) },
    );
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{tg.renewMandateDialog.title}</DialogTitle>
          <DialogDescription>{tg.renewMandateDialog.description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="renew-mandate-form" onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tg.renewMandateDialog.startDateLabel}</FormLabel>
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
          <DialogClose render={<Button type="button" variant="destructive" />}>
            {tg.renewMandateDialog.cancel}
          </DialogClose>
          <Button type="submit" form="renew-mandate-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "..." : tg.renewMandateDialog.renew}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function UpdateMandateDialog({
  mandate,
  open,
  onOpenChange,
}: {
  mandate: Mandate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useMandateDateForm({ startDate: toDateInputValue(mandate?.startDate) });
  const { mutateAsync } = useUpdateMandate();
  const { t } = useDictionary();
  const tg = t.administrationMeeting;

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!mandate) return;
    await mutateAsync(
      { mandateId: mandate.id, startDate: values.startDate },
      { onSuccess: () => onOpenChange(false), onError: () => toast.error(t.common.loadError) },
    );
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{tg.updateMandateDialog.title}</DialogTitle>
          <DialogDescription>{tg.updateMandateDialog.description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="update-mandate-form" onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tg.updateMandateDialog.startDateLabel}</FormLabel>
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
          <DialogClose render={<Button type="button" variant="destructive" />}>
            {tg.updateMandateDialog.cancel}
          </DialogClose>
          <Button type="submit" form="update-mandate-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "..." : tg.updateMandateDialog.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Per-administrator mandate history — deliberately unified into one action
 * on the administrators table (matching the original app's simpler CODIR
 * pattern) instead of the original CA's separate "manage mandates" modal
 * with a second, non-editable table.
 */
export function MandatesHistoryDialog({ administrator }: { administrator: Administrator }) {
  const { t } = useDictionary();
  const tg = t.administrationMeeting;
  const [renewing, setRenewing] = useState(false);
  const [editing, setEditing] = useState<Mandate | null>(null);
  const [now] = useState(() => Date.now());
  const canRenew =
    administrator.mandates.length > 0 &&
    administrator.mandates.every((m) => !m.endDate || new Date(m.endDate).getTime() <= now);

  return (
    <Dialog>
      <Tooltip>
        <DialogTrigger render={<TooltipTrigger render={<Button variant="ghost" size="icon" />} />}>
          <History />
        </DialogTrigger>
        <TooltipContent>{tg.mandatesTable.mandatesTooltip}</TooltipContent>
      </Tooltip>
      <DialogContent className="flex max-h-screen max-w-2xl flex-col">
        <DialogHeader>
          <DialogTitle>{tg.mandatesDialog.title}</DialogTitle>
          <DialogDescription>{administrator.name}</DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-end gap-3">
          {!canRenew && <p className="text-xs text-muted-foreground">{tg.mandatesDialog.renewNotDue}</p>}
          <Button size="sm" className="gap-2" disabled={!canRenew} onClick={() => setRenewing(true)}>
            <RefreshCw />
            {tg.mandatesDialog.renewTooltip}
          </Button>
        </div>

        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{tg.mandatesDialog.startLabel}</TableHead>
                <TableHead>{tg.mandatesDialog.endLabel}</TableHead>
                <TableHead>{tg.mandatesDialog.renewalLabel}</TableHead>
                <TableHead>{tg.detailsTable.status}</TableHead>
                <TableHead className="text-end" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {administrator.mandates.map((mandate) => (
                <TableRow key={mandate.id}>
                  <TableCell>{mandate.startDate ? formatDisplayDate(mandate.startDate) : "-"}</TableCell>
                  <TableCell>{mandate.endDate ? formatDisplayDate(mandate.endDate) : "-"}</TableCell>
                  <TableCell>{mandate.renewalDate ? formatDisplayDate(mandate.renewalDate) : "-"}</TableCell>
                  <TableCell>
                    <Badge variant={mandate.status === "active" ? "default" : "secondary"}>
                      {mandate.status === "active" ? tg.mandatesDialog.statusActive : tg.mandatesDialog.statusExpired}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-end">
                    <Tooltip>
                      <TooltipTrigger
                        render={<Button variant="ghost" size="icon" onClick={() => setEditing(mandate)} />}
                      >
                        <Pencil />
                      </TooltipTrigger>
                      <TooltipContent>{tg.mandatesDialog.editTooltip}</TooltipContent>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <RenewMandateDialog administratorId={administrator.id} open={renewing} onOpenChange={setRenewing} />
        <UpdateMandateDialog key={editing?.id ?? "none"} mandate={editing} open={!!editing} onOpenChange={(open) => !open && setEditing(null)} />

        <DialogFooter>
          <DialogClose render={<Button variant="destructive" />}>{tg.mandatesDialog.close}</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
