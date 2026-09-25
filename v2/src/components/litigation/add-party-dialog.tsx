"use client";

import { useId, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PartyForm } from "@/components/litigation/party-form";
import { useCreateParty } from "@/lib/litigation/hooks";
import { usePartyForm, type PartyFormValues } from "@/lib/litigation/forms";
import { useDictionary } from "@/lib/i18n/locale-provider";

/** Controlled, so it can be opened from a button next to the party select (not from inside its popup). */
export function AddPartyDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (partyId: string) => void;
}) {
  const { t } = useDictionary();
  const tl = t.litigation;
  const formId = useId();
  const form = usePartyForm();
  const { mutateAsync } = useCreateParty();
  const [pending, setPending] = useState(false);

  const handleSubmit = async (values: PartyFormValues) => {
    setPending(true);
    try {
      const created = await mutateAsync(values);
      toast.success(tl.addLitigationPartyForm.success);
      form.reset();
      onCreated?.(created.id);
      onOpenChange(false);
    } catch {
      toast.error(tl.addLitigationPartyForm.error);
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{tl.addLitigationPartyDialog.title}</DialogTitle>
          <DialogDescription>{tl.addLitigationPartyDialog.description}</DialogDescription>
        </DialogHeader>
        <div className="-mx-4 max-h-[60vh] overflow-y-auto px-4 py-1">
          <PartyForm formId={formId} form={form} onSubmit={handleSubmit} />
        </div>
        <DialogFooter className="gap-2">
          <DialogClose render={<Button type="button" variant="destructive" onClick={() => form.reset()} />}>
            {tl.addLitigationPartyDialog.cancel}
          </DialogClose>
          <Button type="submit" form={formId} disabled={pending}>
            {pending ? "..." : tl.addLitigationPartyDialog.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
