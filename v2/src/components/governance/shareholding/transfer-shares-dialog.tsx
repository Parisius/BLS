"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { ShareholderSelect, ThirdPartySelect } from "@/components/governance/shareholding/selects";
import { useTransferShares } from "@/lib/governance/shareholding/hooks";
import { useTransferSharesForm, type TransferFormValues } from "@/lib/governance/shareholding/forms";
import { useDictionary } from "@/lib/i18n/locale-provider";

const TRANSFER_TYPES = ["shareholder", "new_tier", "old_tier"] as const;

export function TransferSharesDialog({ trigger, children }: { trigger: React.ReactElement; children: React.ReactNode }) {
  const form = useTransferSharesForm();
  const { mutateAsync } = useTransferShares();
  const { t } = useDictionary();
  const td = t.shareholding.transferDialog;
  const [open, setOpen] = useState(false);

  const type = form.watch("type");
  const maxShares = form.watch("maxShares");
  const sellerId = form.watch("sellerId");

  const labels: Record<(typeof TRANSFER_TYPES)[number], string> = {
    shareholder: td.toShareholder,
    new_tier: td.toNewThirdParty,
    old_tier: td.toExistingThirdParty,
  };

  const handleSubmit = form.handleSubmit(async (values: TransferFormValues) => {
    await mutateAsync(
      {
        type: values.type === "shareholder" ? "shareholder" : "tier",
        shares: values.shares,
        transferDate: values.transferDate,
        sellerId: values.sellerId,
        buyerId: values.type === "new_tier" ? undefined : values.beneficiaryId,
        thirdPartyName: values.type === "new_tier" ? values.thirdPartyName : undefined,
      },
      {
        onSuccess: () => {
          toast.success(td.success);
          form.reset();
          setOpen(false);
        },
        onError: () => toast.error(td.error),
      },
    );
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger}>{children}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{td.title}</DialogTitle>
          <DialogDescription>{td.description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="transfer-shares-form"
            noValidate
            className="-mx-4 max-h-[60vh] space-y-5 overflow-y-auto px-4 py-1"
            onSubmit={handleSubmit}
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={(next) => {
                        field.onChange(next);
                        form.setValue("beneficiaryId", "");
                        form.setValue("thirdPartyName", "");
                      }}
                      className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
                    >
                      {TRANSFER_TYPES.map((value) => (
                        <div key={value} className="flex items-center gap-1">
                          <RadioGroupItem value={value} id={`transfer-type-${value}`} />
                          <Label htmlFor={`transfer-type-${value}`} className="font-normal">
                            {labels[value]}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sellerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{td.seller}</FormLabel>
                  <FormControl>
                    <ShareholderSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      onShareholderSelect={(shareholder) => {
                        form.setValue("maxShares", shareholder.unencumberedShares);
                        if (form.getValues("shares") > shareholder.unencumberedShares) {
                          form.setValue("shares", shareholder.unencumberedShares);
                        }
                      }}
                      disabled={form.formState.isSubmitting}
                      className="h-12 w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {type === "shareholder" && (
              <FormField
                control={form.control}
                name="beneficiaryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{td.beneficiary}</FormLabel>
                    <FormControl>
                      <ShareholderSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={form.formState.isSubmitting}
                        className="h-12 w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {type === "old_tier" && (
              <FormField
                control={form.control}
                name="beneficiaryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{td.thirdParty}</FormLabel>
                    <FormControl>
                      <ThirdPartySelect
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={form.formState.isSubmitting}
                        className="h-12 w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {type === "new_tier" && (
              <FormField
                control={form.control}
                name="thirdPartyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{td.newThirdPartyName}</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="shares"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>{td.shares}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={sellerId ? maxShares : undefined}
                      disabled={!sellerId}
                      value={Number.isNaN(value) ? "" : value}
                      onChange={(e) => onChange(e.target.valueAsNumber)}
                      className="h-12"
                      {...field}
                    />
                  </FormControl>
                  {sellerId && (
                    <p className="text-sm">
                      <span className="font-semibold">{td.maximum}:</span>{" "}
                      <span className="italic">{maxShares}</span>
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="transferDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{td.date}</FormLabel>
                  <FormControl>
                    <Input type="date" max={new Date().toLocaleDateString("en-CA")} {...field} className="h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="gap-2">
          <DialogClose render={<Button type="button" variant="destructive" onClick={() => form.reset()} />}>
            {td.cancel}
          </DialogClose>
          <Button type="submit" form="transfer-shares-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "..." : td.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
