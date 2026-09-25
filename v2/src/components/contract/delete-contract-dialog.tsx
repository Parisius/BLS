"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDeleteContract } from "@/lib/contract/hooks";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function DeleteContractDialog({ contractId }: { contractId: string }) {
  const { mutateAsync, isPending } = useDeleteContract(contractId);
  const router = useRouter();
  const { t } = useDictionary();
  const tc = t.contract;

  const handleDelete = async () => {
    await mutateAsync(undefined, {
      onSuccess: () => {
        toast.success(tc.deleteButton.success);
        router.push("/dashboard/contract/list");
      },
      onError: () => toast.error(tc.deleteButton.error),
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full bg-accent text-destructive"
          />
        }
      >
        <Trash />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{tc.deleteButton.title}</AlertDialogTitle>
          <AlertDialogDescription>{tc.deleteButton.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{tc.deleteButton.cancel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "..." : tc.deleteButton.delete}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
