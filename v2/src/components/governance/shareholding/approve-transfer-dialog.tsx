"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Form } from "@/components/ui/form";
import { ShareholderIdentityFields } from "@/components/governance/shareholding/shareholder-form-fields";
import { useApproveTransfer } from "@/lib/governance/shareholding/hooks";
import { useApproveTransferForm } from "@/lib/governance/shareholding/forms";
import type { ShareholderFormValues } from "@/lib/governance/shareholding/forms";
import type { Control } from "react-hook-form";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function ApproveTransferDialog({ transferId, buyerName }: { transferId: string; buyerName: string }) {
  const form = useApproveTransferForm();
  const { mutateAsync } = useApproveTransfer(transferId);
  const { t } = useDictionary();
  const td = t.shareholding.approveDialog;
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
      <DialogTrigger render={<Button variant="secondary" className="gap-2" />}>
        <CheckCheck />
        {t.shareholding.transferDetail.approve}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {td.title} {buyerName}
          </DialogTitle>
          <DialogDescription>{td.description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="approve-transfer-form"
            noValidate
            className="-mx-4 max-h-[60vh] space-y-6 overflow-y-auto px-4 py-1"
            onSubmit={handleSubmit}
          >
            <div className="space-y-2">
              <Label>{td.nameLabel}</Label>
              <Input disabled value={buyerName} className="h-12" />
            </div>
            <ShareholderIdentityFields
              control={form.control as unknown as Control<ShareholderFormValues>}
              withName={false}
            />
          </form>
        </Form>
        <DialogFooter className="gap-2">
          <DialogClose render={<Button type="button" variant="destructive" onClick={() => form.reset()} />}>
            {td.cancel}
          </DialogClose>
          <Button type="submit" form="approve-transfer-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "..." : td.approve}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
