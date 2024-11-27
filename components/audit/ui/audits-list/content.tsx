import React, { useEffect, useState } from "react";
import { PlannedAudit } from "@/app/dashboard/(dashboard)/audit/list/columns";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { getPlannedAudit } from "@/services/api-sdk/models/audit/audit";
import { Pencil, Trash } from "lucide-react";
import EmptyState from "./empty-state";
import DeletePlannedAuditDialog from "../../buttons/delete-planned-audit-btn";
import UpdatePlannedAuditDialog from "../../buttons/update-planned-audit-btn";
import TableSkeleton from "./tableSkeleton";

const ITEMS_PER_PAGE = 10;

const PlannedAuditList = () => {
  const [audits, setAudits] = useState<PlannedAudit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<PlannedAudit | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchAudits = async () => {
      setLoading(true);
      try {
        const result = await getPlannedAudit();
        if (result.success) {
          setAudits(result.data?.data || []);
        } else {
          setError(result.message);
          toast({
            variant: "destructive",
            title: "Erreur",
            description:
              result.message ||
              "Une erreur est survenue lors du chargement des audits",
          });
        }
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description:
            "Une erreur est survenue lors de la connexion au serveur",
        });
      }
      setLoading(false);
    };
    fetchAudits();
  }, []);

  const handleUpdate = (audit: PlannedAudit) => {
    setSelectedAudit(audit);
    setUpdateDialogOpen(true);
  };

  const handleDelete = (audit: PlannedAudit) => {
    setSelectedAudit(audit);
    setDeleteDialogOpen(true);
  };

  const handleAuditUpdate = (updatedAudit: PlannedAudit) => {
    const newAudits = audits.map((audit) =>
      audit.id === updatedAudit.id ? updatedAudit : audit
    );
    setAudits(newAudits);
  };

  const handleAuditDelete = (auditId: string) => {
    setAudits(audits.filter((audit) => audit.id !== auditId));
    const totalPages = Math.ceil((audits.length - 1) / ITEMS_PER_PAGE);
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  };

  const totalPages = Math.ceil(audits.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedAudits = audits.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (loading) {
    return <TableSkeleton />;
  }

  if (audits.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="w-full space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead>Date limite</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Créé par</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedAudits.map((audit) => (
            <TableRow key={audit.id}>
              <TableCell>{audit.title}</TableCell>
              <TableCell>
                {new Date(audit.deadline).toLocaleDateString()}
              </TableCell>
              <TableCell>{audit.status}</TableCell>
              <TableCell>{audit.created_by}</TableCell>
              <TableCell className="flex justify-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => handleUpdate(audit)}
                  className="hover:bg-primary/10"
                >
                  <Pencil className="h-4 w-4 text-primary" />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleDelete(audit)}
                  className="hover:bg-destructive/10"
                >
                  <Trash className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {audits.length === 10 && (
        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-gray-500">
            Affichage de {Math.min(startIndex + 1, audits.length)} à{" "}
            {Math.min(startIndex + ITEMS_PER_PAGE, audits.length)} sur{" "}
            {audits.length} entrées
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Précédent
            </Button>
            <span className="mx-4">
              Page {currentPage} sur {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}

      <UpdatePlannedAuditDialog
        open={updateDialogOpen}
        onClose={() => setUpdateDialogOpen(false)}
        audit={selectedAudit}
        onUpdate={handleAuditUpdate}
      />
      <DeletePlannedAuditDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        audit={selectedAudit}
        onDelete={handleAuditDelete}
      />
    </div>
  );
};

export default PlannedAuditList;
