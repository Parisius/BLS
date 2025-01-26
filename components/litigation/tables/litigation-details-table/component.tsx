"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatAmount } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Pencil, Printer, Users } from "lucide-react";
import UpdateLitigationDialog from "@/components/litigation/modals/update-litigation-dialog";
import AssignCollaboratorsDialog from "@/components/litigation/modals/assign-collaborators-dialog";
import PrintLitigationButton from "@/components/litigation/buttons/print-litigation-button";
import { useIntl } from "react-intl";

export function LitigationDetailsTable({
  litigationId,
  reference,
  caseNumber,
  estimatedAmount,
  addedAmount,
  remainingAmount,
  nature,
  jurisdiction,
  jurisdictionLocation,
  hasProvisions,
  isArchived,
}) {
  const intl = useIntl();

  return (
    <Table className="border">
      <TableHeader>
        <TableRow>
          <TableHead>
            {intl.formatMessage({
              id: "litigation.litigation.details.caseNumber",
            })}{" "}
          </TableHead>
          <TableHead>
            {intl.formatMessage({
              id: "litigation.litigation.details.reference",
            })}{" "}
          </TableHead>
          {hasProvisions && (
            <>
              <TableHead>
                {intl.formatMessage({
                  id: "litigation.litigation.details.provisionsConstituted",
                })}{" "}
              </TableHead>
              <TableHead>
                {intl.formatMessage({
                  id: "litigation.litigation.details.provisionsToConstitute",
                })}{" "}
              </TableHead>
              <TableHead>
                {intl.formatMessage({
                  id: "litigation.litigation.details.totalProvisions",
                })}{" "}
              </TableHead>
              <TableHead>
                {intl.formatMessage({
                  id: "litigation.litigation.details.provisionsRecovered",
                })}{" "}
              </TableHead>
            </>
          )}
          <TableHead>
            {intl.formatMessage({ id: "litigation.litigation.details.nature" })}{" "}
          </TableHead>
          <TableHead>
            {intl.formatMessage({
              id: "litigation.litigation.details.jurisdiction",
            })}{" "}
          </TableHead>
          <TableHead>
            {intl.formatMessage({
              id: "litigation.litigation.details.jurisdictionLocation",
            })}{" "}
          </TableHead>
          <TableHead>
            {intl.formatMessage({ id: "litigation.litigation.details.status" })}{" "}
          </TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="bg-card">
          <TableCell>{caseNumber}</TableCell>
          <TableCell>{reference}</TableCell>
          {hasProvisions && (
            <>
              <TableCell>
                {estimatedAmount ? formatAmount(estimatedAmount) : "-"}
              </TableCell>
              <TableCell>
                {addedAmount ? formatAmount(addedAmount) : "-"}
              </TableCell>
              <TableCell>
                {formatAmount((addedAmount ?? 0) + (estimatedAmount ?? 0))}
              </TableCell>
              <TableCell>
                {remainingAmount ? formatAmount(remainingAmount) : "-"}
              </TableCell>
            </>
          )}
          <TableCell>{nature}</TableCell>
          <TableCell>{jurisdiction}</TableCell>
          <TableCell>{jurisdictionLocation}</TableCell>
          <TableCell>
            {isArchived ? (
              <Badge className="text-nowrap bg-muted text-muted-foreground">
                {intl.formatMessage({
                  id: "litigation.litigation.details.archived",
                })}{" "}
              </Badge>
            ) : (
              <Badge className="bg-primary">
                {intl.formatMessage({
                  id: "litigation.litigation.details.inProgress",
                })}{" "}
              </Badge>
            )}
          </TableCell>
          <TableCell className="whitespace-nowrap">
            <Tooltip>
              <AssignCollaboratorsDialog asChild litigationId={litigationId}>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Users />
                  </Button>
                </TooltipTrigger>
              </AssignCollaboratorsDialog>
              <TooltipContent>
                {intl.formatMessage({
                  id: "litigation.litigation.details.assign",
                })}{" "}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <UpdateLitigationDialog asChild litigationId={litigationId}>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Pencil />
                  </Button>
                </TooltipTrigger>
              </UpdateLitigationDialog>
              <TooltipContent>
                {intl.formatMessage({
                  id: "litigation.litigation.details.edit",
                })}{" "}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <PrintLitigationButton
                  litigationId={litigationId}
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                >
                  <Printer />
                </PrintLitigationButton>
              </TooltipTrigger>
              <TooltipContent>
                {intl.formatMessage({
                  id: "litigation.litigation.details.print",
                })}{" "}
              </TooltipContent>
            </Tooltip>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
