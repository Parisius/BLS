"use client";

import { PlannedAudit } from "@/app/dashboard/(dashboard)/audit/list/columns";
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
import EllipsisLoader from "@/components/ui/ellipsis-loader";
import { toast } from "@/components/ui/use-toast";
import { deletePlannedAudit } from "@/services/api-sdk/models/audit/audit";
import { useCallback, useState } from "react";

interface DeleteAuditDialogProps {
  open: boolean;
  onClose: () => void;
  audit: PlannedAudit | null;
  onDelete: (auditId: string) => void;
}

const DeletePlannedAuditDialog = ({
  open,
  onClose,
  audit,
  onDelete,
}: DeleteAuditDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = useCallback(async () => {
    if (!audit?.id) return;

    try {
      setIsSubmitting(true);
      const { success, message } = await deletePlannedAudit(audit.id);

      if (success) {
        onDelete(audit.id);
        toast({
          title: "Succès",
          description: "L'audit a été supprimé avec succès.",
          className: "bg-primary text-primary-foreground",
        });
        onClose();
      } else {
        throw new Error(message);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          error instanceof Error
            ? error.message
            : "Impossible de supprimer l'audit.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [audit?.id, onDelete, onClose]);

  const disabled = !audit?.id || isSubmitting;

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action ne peut pas être annulée. Cela supprimera
            définitivement cet audit.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={disabled}
            className={disabled ? "opacity-50 cursor-not-allowed" : ""}
          >
            {isSubmitting ? <EllipsisLoader /> : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletePlannedAuditDialog;
