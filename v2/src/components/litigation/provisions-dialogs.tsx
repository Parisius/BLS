"use client";

import { useId, useState } from "react";
import { toast } from "sonner";
import { Banknote } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { useAddLitigationProvisions, useLitigationProvisionsSummary } from "@/lib/litigation/hooks";
import { useProvisionsForm } from "@/lib/litigation/forms";
import type { Litigation } from "@/lib/litigation/litigations";
import { useFormatAmount } from "@/lib/tenant-provider";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function UpdateProvisionsDialog({ litigation }: { litigation: Litigation }) {
  const formatAmount = useFormatAmount();
  const { t } = useDictionary();
  const tp = t.litigation.provisions;
  const formId = useId();
  const form = useProvisionsForm();
  const { mutateAsync } = useAddLitigationProvisions(litigation.id);
  const [open, setOpen] = useState(false);

  const handleOpenChange = (next: boolean) => {
    // Start from what is currently recorded instead of zeros, so saving one figure doesn't wipe the others.
    if (next) {
      form.reset({
        estimatedAmount: litigation.estimatedAmount ?? 0,
        addedAmount: litigation.addedAmount ?? 0,
        remainingAmount: litigation.remainingAmount ?? 0,
      });
    }
    setOpen(next);
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await mutateAsync(values);
      toast.success(tp.success);
      setOpen(false);
    } catch {
      toast.error(tp.error);
    }
  });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button className="gap-2" />}>
        <Banknote />
        <span className="sr-only sm:not-sr-only">{t.litigation.details.updateProvisions}</span>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{tp.title}</DialogTitle>
          <DialogDescription>{tp.description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id={formId} noValidate className="space-y-5" onSubmit={handleSubmit}>
            {(
              [
                ["estimatedAmount", tp.estimated],
                [
                  "addedAmount",
                  `${tp.added} (${tp.currentTotal}: ${formatAmount(litigation.addedAmount ?? 0)})`,
                ],
                ["remainingAmount", tp.remaining],
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
                      <Input
                        type="number"
                        min={0}
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
            ))}
          </form>
        </Form>
        <DialogFooter className="gap-2">
          <DialogClose render={<Button type="button" variant="destructive" />}>{tp.cancel}</DialogClose>
          <Button type="submit" form={formId} disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "..." : tp.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ProvisionsSummaryDialog() {
  const formatAmount = useFormatAmount();
  const { t } = useDictionary();
  const tl = t.litigation;
  const { data, isLoading, isError } = useLitigationProvisionsSummary();

  const rows = data
    ? [
        [tl.totalConstitutedAmount, data.totalEstimatedAmount],
        [tl.totalToConstituteAmount, data.totalAddedAmount],
        [tl.totalAmount, data.totalAddedAmount + data.totalEstimatedAmount],
        [tl.totalRecoveredAmount, data.totalRemainingAmount],
      ]
    : [];

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="ghost" className="gap-2" />}>
        <Banknote />
        {tl.provisionsSummaryButton}
      </DialogTrigger>
      <DialogContent className="flex max-h-screen max-w-lg flex-col">
        <DialogHeader>
          <DialogTitle>{tl.provisionsSummaryTitle}</DialogTitle>
          <DialogDescription>{tl.provisionsSummaryDescription}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 space-y-8 overflow-auto">
          {isLoading && <p className="italic text-muted-foreground">{tl.loadingProvisions}</p>}
          {isError && <p className="italic text-destructive">{tl.errorLoadingProvisions}</p>}
          {rows.map(([label, amount]) => (
            <div key={label as string} className="flex items-center justify-between gap-5">
              <div className="flex items-center gap-1 font-semibold">
                <Banknote />
                <span>{label}</span>
              </div>
              <span className="italic text-muted-foreground">{formatAmount(amount as number)}</span>
            </div>
          ))}
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="destructive" />}>{tl.closeButton}</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
