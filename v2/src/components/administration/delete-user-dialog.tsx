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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDeleteUser } from "@/lib/administration/hooks";
import { useDictionary } from "@/lib/i18n/locale-provider";

interface DeleteUserDialogProps {
  userId: string;
  children: React.ReactElement;
}

export function DeleteUserDialog({ userId, children }: DeleteUserDialogProps) {
  const { mutateAsync, isPending } = useDeleteUser();
  const { t } = useDictionary();

  const handleDelete = async () => {
    await mutateAsync(userId, {
      onSuccess: () => toast.success(t.administration.users.deleteSuccess),
      onError: () => toast.error(t.administration.users.deleteError),
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger render={children} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t.administration.users.deleteConfirmTitle}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t.administration.users.deleteConfirmDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t.common.cancel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? t.common.deleting : t.common.delete}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
