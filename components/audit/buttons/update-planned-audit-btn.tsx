import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlannedAudit } from "@/app/dashboard/(dashboard)/audit/list/columns";
import { updatePlannedAudit } from "@/services/api-sdk/models/audit/audit";
import { toast } from "@/components/ui/use-toast";
import EllipsisLoader from "@/components/ui/ellipsis-loader";

interface UpdateAuditDialogProps {
  open: boolean;
  onClose: () => void;
  audit: PlannedAudit | null;
  onUpdate: (updatedAudit: PlannedAudit) => void;
}

const UpdatePlannedAuditDialog = ({
  open,
  onClose,
  audit,
  onUpdate,
}: UpdateAuditDialogProps) => {
  const [editForm, setEditForm] = useState({ title: "", deadline: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (audit) {
      setEditForm({
        title: audit.title,
        deadline: audit.deadline.split(" ")[0],
      });
    }
  }, [audit]);

  const handleSubmit = async () => {
    if (!audit) return;

    setIsSubmitting(true);
    const { success, data, message } = await updatePlannedAudit(
      audit.id,
      editForm.title,
      editForm.deadline
    );

    if (success) {
      onUpdate(data);
      toast({
        title: "Succès",
        description: "L'audit a été mis à jour avec succès.",
      });
      onClose();
    } else {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: message || "Impossible de mettre à jour l'audit.",
      });
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier l&apos;audit</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Titre</label>
            <Input
              required
              value={editForm.title}
              onChange={(e) =>
                setEditForm({ ...editForm, title: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium">Date limite</label>
            <Input
              required
              type="date"
              value={editForm.deadline}
              onChange={(e) =>
                setEditForm({ ...editForm, deadline: e.target.value })
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? <EllipsisLoader /> : "Enregistrer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePlannedAuditDialog;
