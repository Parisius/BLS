"use client";

import { toast } from "sonner";
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
import { Form } from "@/components/ui/form";
import { DocumentsForm } from "@/components/contract/documents-form";
import { useCompleteContractForm } from "@/lib/contract/forms";
import { useCompleteContract } from "@/lib/contract/hooks";
import { useDictionary } from "@/lib/i18n/locale-provider";

interface CompleteContractDialogProps {
  contractId: string;
  transferId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CompleteContractDialog({
  contractId,
  transferId,
  open,
  onOpenChange,
}: CompleteContractDialogProps) {
  const { form, filesArray } = useCompleteContractForm();
  const { mutateAsync } = useCompleteContract(contractId);
  const { t } = useDictionary();
  const tc = t.contract;

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(
      { transferId, ...values },
      {
        onSuccess: () => {
          toast.success(tc.success);
          form.reset();
          onOpenChange(false);
        },
        onError: () => toast.error(tc.error),
      },
    );
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{tc.completeDialog.title}</DialogTitle>
          <DialogDescription>{tc.completeDialog.description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id="complete-contract-form" className="grid grid-cols-2 gap-x-5 gap-y-10" onSubmit={handleSubmit}>
            <DocumentsForm
              label={tc.documentsLabel}
              fieldName="files"
              control={form.control}
              fieldArray={filesArray}
              isSubmitting={form.formState.isSubmitting}
              className="col-span-2"
            />
          </form>
        </Form>

        <DialogFooter className="gap-2">
          <DialogClose render={<Button type="button" variant="destructive" onClick={() => form.reset()} />}>
            {tc.completeDialog.cancel}
          </DialogClose>
          <Button type="submit" form="complete-contract-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "..." : tc.completeDialog.complete}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
