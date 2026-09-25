"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useContractDatesForm, type ContractDateType } from "@/lib/contract/forms";
import { usePlanContractDates } from "@/lib/contract/hooks";
import { toDateInputValue } from "@/lib/shared/date-utils";
import { useDictionary } from "@/lib/i18n/locale-provider";

interface ContractDatesDialogProps {
  contractId: string;
  dateType: ContractDateType;
  defaultDate?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContractDatesDialog({
  contractId,
  dateType,
  defaultDate,
  open,
  onOpenChange,
}: ContractDatesDialogProps) {
  const form = useContractDatesForm(dateType, toDateInputValue(defaultDate));
  const { mutateAsync } = usePlanContractDates(contractId);
  const { t } = useDictionary();
  const tc = t.contract;

  const fieldLabel = tc.dates[dateType] ?? tc.dates.defaultLabel;

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(values, {
      onSuccess: () => {
        toast.success(tc.dates.success);
        onOpenChange(false);
      },
      onError: () => toast.error(tc.dates.error),
    });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{tc.dates.title}</DialogTitle>
          <DialogDescription>{tc.dates.description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id="contract-dates-form" className="space-y-5" onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name={dateType}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{fieldLabel}</FormLabel>
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
            {tc.dates.cancelButton}
          </DialogClose>
          <Button type="submit" form="contract-dates-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "..." : tc.dates.scheduleButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
