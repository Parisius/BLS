"use client";

import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDictionary } from "@/lib/i18n/locale-provider";
import { useMarkContractEventAsCompleted, useDeleteContractEvent } from "@/lib/contract/hooks";

interface EventConfirmDialogProps {
  contractId: string;
  eventId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CompleteContractEventDialog({ contractId, eventId, open, onOpenChange }: EventConfirmDialogProps) {
  const { mutateAsync, isPending } = useMarkContractEventAsCompleted(contractId, eventId);
  const { t } = useDictionary();
  const tc = t.contract;

  const handleComplete = async () => {
    await mutateAsync(undefined, {
      onSuccess: () => {
        toast.success(tc.events.completeSuccess);
        onOpenChange(false);
      },
      onError: () => toast.error(tc.events.completeError),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{tc.events.confirmTitle}</AlertDialogTitle>
          <AlertDialogDescription>{tc.events.confirmDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{tc.events.cancelButton}</AlertDialogCancel>
          <AlertDialogAction onClick={handleComplete} disabled={isPending}>
            {isPending ? "..." : tc.events.completeButton}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function DeleteContractEventDialog({ contractId, eventId, open, onOpenChange }: EventConfirmDialogProps) {
  const { mutateAsync, isPending } = useDeleteContractEvent(contractId, eventId);
  const { t } = useDictionary();
  const tc = t.contract;

  const handleDelete = async () => {
    await mutateAsync(undefined, {
      onSuccess: () => {
        toast.success(tc.events.deleteSuccess);
        onOpenChange(false);
      },
      onError: () => toast.error(tc.events.deleteError),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{tc.events.confirmDeleteTitle}</AlertDialogTitle>
          <AlertDialogDescription>{tc.events.confirmDeleteDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{tc.events.cancelButton}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "..." : tc.events.deleteButton}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
