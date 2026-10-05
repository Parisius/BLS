"use client";

import { Can } from "@/components/auth/can";
import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FolderPlus, Scale } from "lucide-react";
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
import { LitigationForm } from "@/components/litigation/litigation-form";
import { useCreateLitigation, useOneLitigation, useUpdateLitigation } from "@/lib/litigation/hooks";
import { useLitigationForm, type LitigationFormValues } from "@/lib/litigation/forms";
import type { Litigation } from "@/lib/litigation/litigations";
import { useDictionary } from "@/lib/i18n/locale-provider";

function AddLitigationDialogInner({ variant = "list" }: { variant?: "list" | "card" }) {
  const { t } = useDictionary();
  const tl = t.litigation;
  const router = useRouter();
  const formId = useId();
  const { form, partiesArray, filesArray, emptyParty } = useLitigationForm();
  const { mutateAsync } = useCreateLitigation();
  const [open, setOpen] = useState(false);

  const handleSubmit = async (values: LitigationFormValues) => {
    try {
      const created = await mutateAsync(values);
      toast.success(tl.addLitigationForm.successToast);
      form.reset();
      setOpen(false);
      router.push(`/dashboard/litigation/${created.id}`);
    } catch {
      toast.error(tl.addLitigationForm.errorToast);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2" />}>
        {variant === "card" ? <FolderPlus /> : <Scale />}
        {variant === "card" ? (
          tl.createLitigationCard.button
        ) : (
          <span className="sr-only sm:not-sr-only">{tl.button.newFile}</span>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{tl.addLitigationDialog.title}</DialogTitle>
          <DialogDescription>{tl.addLitigationDialog.description}</DialogDescription>
        </DialogHeader>
        <div className="-mx-4 max-h-[70vh] overflow-y-auto px-4 py-3">
          <LitigationForm
            formId={formId}
            form={form}
            partiesArray={partiesArray}
            filesArray={filesArray}
            emptyParty={emptyParty}
            onSubmit={handleSubmit}
          />
        </div>
        <DialogFooter className="gap-2">
          <DialogClose render={<Button type="button" variant="destructive" onClick={() => form.reset()} />}>
            {tl.addLitigationDialog.cancelButton}
          </DialogClose>
          <Button type="submit" form={formId} disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "..." : tl.addLitigationDialog.submitButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function UpdateLitigationBody({ litigation, onClose }: { litigation: Litigation; onClose: () => void }) {
  const { t } = useDictionary();
  const tl = t.litigation;
  const formId = useId();
  // Mounted only once the litigation is loaded (see UpdateLitigationDialog), so the form starts prefilled.
  const { form, partiesArray, filesArray, emptyParty } = useLitigationForm({
    title: litigation.title,
    caseNumber: litigation.caseNumber,
    natureId: litigation.nature.id,
    jurisdictionId: litigation.jurisdiction.id,
    jurisdictionLocation: litigation.jurisdictionLocation,
    hasProvisions: litigation.hasProvisions,
    parties: litigation.parties.length
      ? litigation.parties.map((party) => ({ partyId: party.id, category: party.category, type: party.type }))
      : [{ partyId: "", category: "", type: "" }],
    files: [],
  });
  const { mutateAsync } = useUpdateLitigation(litigation.id);

  const handleSubmit = async (values: LitigationFormValues) => {
    try {
      await mutateAsync(values);
      toast.success(tl.update.success);
      onClose();
    } catch {
      toast.error(tl.update.error);
    }
  };

  return (
    <>
      <div className="-mx-4 max-h-[70vh] overflow-y-auto px-4 py-3">
        <LitigationForm
          formId={formId}
          form={form}
          partiesArray={partiesArray}
          filesArray={filesArray}
          emptyParty={emptyParty}
          onSubmit={handleSubmit}
        />
        <p className="mt-3 text-sm italic text-muted-foreground">{tl.updateFiles.hint}</p>
      </div>
      <DialogFooter className="gap-2">
        <DialogClose render={<Button type="button" variant="destructive" />}>{tl.update.cancel}</DialogClose>
        <Button type="submit" form={formId} disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "..." : tl.update.edit}
        </Button>
      </DialogFooter>
    </>
  );
}

/** Controlled: opened from the details table and from the parties sheet. */
export function UpdateLitigationDialog({
  litigationId,
  open,
  onOpenChange,
}: {
  litigationId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useDictionary();
  const tl = t.litigation;
  const { data, isLoading, isError } = useOneLitigation(litigationId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{tl.update.title}</DialogTitle>
          <DialogDescription>{tl.update.description}</DialogDescription>
        </DialogHeader>
        {isError && <p className="text-destructive">{t.common.loadError}</p>}
        {isLoading && <p className="italic text-muted-foreground">{tl.loading}</p>}
        {data && <UpdateLitigationBody litigation={data} onClose={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}

export function AddLitigationDialog(props: React.ComponentProps<typeof AddLitigationDialogInner>) {
  return (
    <Can permission="litigation.create">
      <AddLitigationDialogInner {...props} />
    </Can>
  );
}
