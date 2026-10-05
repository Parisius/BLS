"use client";

import { Pencil, Printer, Users } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { usePrintLitigation } from "@/lib/litigation/hooks";
import type { Litigation } from "@/lib/litigation/litigations";
import { downloadBytes } from "@/lib/shared/download";
import { formatAmount } from "@/lib/shared/format";
import { useDictionary } from "@/lib/i18n/locale-provider";
import { usePermissions } from "@/lib/auth/use-permissions";

export function LitigationDetailsTable({
  litigation,
  onAssign,
  onEdit,
}: {
  litigation: Litigation;
  onAssign: () => void;
  onEdit: () => void;
}) {
  const { t } = useDictionary();
  const td = t.litigation.details;
  const { can } = usePermissions();
  const { mutate, isPending } = usePrintLitigation();
  const { hasProvisions, estimatedAmount, addedAmount, remainingAmount } = litigation;
  const money = (value?: number) => (value ? formatAmount(value) : "-");

  return (
    <Table className="border">
      <TableHeader>
        <TableRow>
          <TableHead>{td.caseNumber}</TableHead>
          <TableHead>{td.reference}</TableHead>
          {hasProvisions && (
            <>
              <TableHead>{td.provisionsConstituted}</TableHead>
              <TableHead>{td.provisionsToConstitute}</TableHead>
              <TableHead>{td.totalProvisions}</TableHead>
              <TableHead>{td.provisionsRecovered}</TableHead>
            </>
          )}
          <TableHead>{td.nature}</TableHead>
          <TableHead>{td.jurisdiction}</TableHead>
          <TableHead>{td.jurisdictionLocation}</TableHead>
          <TableHead>{td.status}</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="bg-card">
          <TableCell>{litigation.caseNumber}</TableCell>
          <TableCell>{litigation.reference}</TableCell>
          {hasProvisions && (
            <>
              <TableCell>{money(estimatedAmount)}</TableCell>
              <TableCell>{money(addedAmount)}</TableCell>
              <TableCell>{money((addedAmount ?? 0) + (estimatedAmount ?? 0))}</TableCell>
              <TableCell>{money(remainingAmount)}</TableCell>
            </>
          )}
          <TableCell>{litigation.nature.title}</TableCell>
          <TableCell>{litigation.jurisdiction.title}</TableCell>
          <TableCell>{litigation.jurisdictionLocation}</TableCell>
          <TableCell>
            {litigation.isArchived ? (
              <Badge className="text-nowrap bg-muted text-muted-foreground">{td.archived}</Badge>
            ) : (
              <Badge className="bg-primary">{td.inProgress}</Badge>
            )}
          </TableCell>
          <TableCell className="whitespace-nowrap">
            {(
              [
                [td.assign, <Users key="assign" />, onAssign, false, "litigation.assign"],
                [td.edit, <Pencil key="edit" />, onEdit, false, "litigation.update"],
                [
                  td.print,
                  <Printer key="print" className={isPending ? "animate-bounce" : undefined} />,
                  () =>
                    mutate(litigation.id, {
                      onSuccess: ({ bytes, filename }) => downloadBytes(bytes, filename),
                      onError: () => toast.error(t.litigation.printError),
                    }),
                  isPending,
                  "litigation.print",
                ],
              ] as const
            )
              .filter(([, , , , permission]) => can(permission))
              .map(([label, icon, onClick, disabled]) => (
              <Tooltip key={label}>
                <TooltipTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={label}
                      className="rounded-full"
                      disabled={disabled}
                      onClick={onClick}
                    />
                  }
                >
                  {icon}
                </TooltipTrigger>
                <TooltipContent>{label}</TooltipContent>
              </Tooltip>
            ))}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
