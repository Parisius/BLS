"use client";

import { useState } from "react";
import { History, Pencil } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UpdateContractDialog } from "@/components/contract/update-contract-dialog";
import { DeleteContractDialog } from "@/components/contract/delete-contract-dialog";
import { PrintContractButton } from "@/components/contract/print-contract-button";
import { ForwardsHistoryDialog } from "@/components/shared/forwards-history-dialog";
import { formatDisplayDate } from "@/lib/shared/date-utils";
import type { Contract } from "@/lib/contract/contracts";
import { useDictionary } from "@/lib/i18n/locale-provider";
import { Can } from "@/components/auth/can";

function contractCategoryLabel(contract: Contract) {
  const { category, categoryType, categorySubType } = contract;
  if (categoryType && categorySubType) {
    return `${category.label} - ${categoryType.label} - ${categorySubType.label}`;
  }
  if (categoryType) return `${category.label} - ${categoryType.label}`;
  return category.label;
}

export function ContractDetailsTable({ contract }: { contract: Contract }) {
  const { t } = useDictionary();
  const tc = t.contract;
  const [editing, setEditing] = useState(false);

  return (
    <>
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead>{tc.detailsTable.title}</TableHead>
            <TableHead>{tc.detailsTable.category}</TableHead>
            <TableHead>{tc.detailsTable.signatureDate}</TableHead>
            <TableHead>{tc.detailsTable.effectiveDate}</TableHead>
            <TableHead>{tc.detailsTable.expirationDate}</TableHead>
            <TableHead>{tc.detailsTable.renewalDate}</TableHead>
            <TableHead className="text-center">{tc.detailsTable.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="bg-card">
            <TableCell>{contract.title}</TableCell>
            <TableCell>
              <Badge className="bg-muted text-muted-foreground hover:bg-muted/90">
                {contractCategoryLabel(contract)}
              </Badge>
            </TableCell>
            <TableCell>
              {contract.signatureDate ? formatDisplayDate(contract.signatureDate) : "-"}
            </TableCell>
            <TableCell>
              {contract.effectiveDate ? formatDisplayDate(contract.effectiveDate) : "-"}
            </TableCell>
            <TableCell>
              {contract.expirationDate ? formatDisplayDate(contract.expirationDate) : "-"}
            </TableCell>
            <TableCell>
              {contract.renewalDate ? formatDisplayDate(contract.renewalDate) : "-"}
            </TableCell>
            <TableCell className="text-nowrap">
              <Can permission="contract.update">
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        onClick={() => setEditing(true)}
                      />
                    }
                  >
                    <Pencil />
                  </TooltipTrigger>
                  <TooltipContent>{tc.detailsTable.edit}</TooltipContent>
                </Tooltip>
              </Can>

              <Can permission="contract.delete">
                <DeleteContractDialog contractId={contract.id} />
              </Can>

              <Can permission="contract.print">
                <Tooltip>
                  <TooltipTrigger render={<PrintContractButton contractId={contract.id} />} />
                  <TooltipContent>{tc.detailsTable.print}</TooltipContent>
                </Tooltip>
              </Can>

              {contract.forwards.length > 0 && (
                <Tooltip>
                  <ForwardsHistoryDialog
                    forwards={contract.forwards}
                    labels={{
                      title: tc.forwardsDialog.title,
                      description: tc.forwardsDialog.description,
                      transferredOn: tc.forwardsDialog.transferredOn,
                      close: tc.forwardsDialog.close,
                    }}
                    trigger={
                      <TooltipTrigger
                        render={<Button variant="ghost" size="icon" className="rounded-full" />}
                      />
                    }
                  >
                    <History />
                  </ForwardsHistoryDialog>
                  <TooltipContent>{tc.detailsTable.transferHistory}</TooltipContent>
                </Tooltip>
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <UpdateContractDialog contractId={contract.id} open={editing} onOpenChange={setEditing} />
    </>
  );
}
