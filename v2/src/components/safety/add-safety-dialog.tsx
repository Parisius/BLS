"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FolderPlus } from "lucide-react";
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
import { SafetyKindForm } from "@/components/safety/safety-forms";
import { useCreateGuarantee } from "@/lib/safety/hooks";
import { KIND_KEY, type SafetyKind } from "@/lib/safety/kinds";
import type { CreateGuaranteeArgs } from "@/lib/safety/guarantees";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function AddSafetyDialog({ kind }: { kind: SafetyKind }) {
  const { t } = useDictionary();
  const tk = t.safety.kinds[KIND_KEY[kind]];
  const tf = t.safety.form;
  const router = useRouter();
  const formId = useId();
  const { mutateAsync } = useCreateGuarantee(kind);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (args: CreateGuaranteeArgs) => {
    setPending(true);
    try {
      const created = await mutateAsync(args);
      toast.success(tk.success);
      setOpen(false);
      router.push(`/dashboard/safety/${kind}/${created.id}`);
    } catch {
      toast.error(tk.error);
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2" />}>
        <FolderPlus />
        <span className="sr-only sm:not-sr-only">{tk.new}</span>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{tk.addTitle}</DialogTitle>
          <DialogDescription>{tk.addDescription}</DialogDescription>
        </DialogHeader>
        <div className="-mx-4 max-h-[60vh] overflow-y-auto px-4 py-1">
          <SafetyKindForm kind={kind} formId={formId} onSubmit={handleSubmit} />
        </div>
        <DialogFooter className="gap-2">
          <DialogClose render={<Button type="button" variant="destructive" />}>{tf.cancel}</DialogClose>
          <Button type="submit" form={formId} disabled={pending}>
            {pending ? "..." : tf.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
