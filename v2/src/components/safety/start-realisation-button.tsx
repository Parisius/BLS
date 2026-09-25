"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useStartRealisation } from "@/lib/safety/hooks";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function StartRealisationButton({ guaranteeId }: { guaranteeId: string }) {
  const { t } = useDictionary();
  const tr = t.safety.realisation;
  const { mutateAsync } = useStartRealisation(guaranteeId);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const handleStart = async () => {
    setPending(true);
    try {
      await mutateAsync();
      toast.success(tr.success);
      setOpen(false);
    } catch {
      toast.error(tr.error);
    } finally {
      setPending(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button />}>{tr.button}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{tr.title}</AlertDialogTitle>
          <AlertDialogDescription>{tr.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel type="button">{tr.cancel}</AlertDialogCancel>
          <Button type="button" disabled={pending} onClick={() => void handleStart()}>
            {pending ? "..." : tr.confirm}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
