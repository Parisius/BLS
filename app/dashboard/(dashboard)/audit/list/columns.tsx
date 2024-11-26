"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type PlannedAudit = {
  id: string;
  title: string;
  deadline: string;
  status: number;
  completed_by: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export const columns: ColumnDef<PlannedAudit>[] = [
  {
    accessorKey: "title",
    header: "Titre",
  },
  {
    accessorKey: "deadline",
    header: "Date limite",
    cell: ({ row }) => {
      return new Date(row.getValue("deadline")).toLocaleDateString();
    },
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const status = row.getValue("status") as number;
      return (
        <div className="flex items-center">
          {status === 1 ? "En cours" : status === 2 ? "Terminé" : "En attente"}
        </div>
      );
    },
  },
  {
    accessorKey: "created_by",
    header: "Créé par",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const audit = row.original;

      return (
        <di>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                // Émettre un événement personnalisé pour la mise à jour
                const event = new CustomEvent("updateAudit", {
                  detail: audit,
                });
                window.dispatchEvent(event);
              }}
            >
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                // Émettre un événement personnalisé pour la suppression
                const event = new CustomEvent("deleteAudit", {
                  detail: audit,
                });
                window.dispatchEvent(event);
              }}
            >
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </di>
      );
    },
  },
];
