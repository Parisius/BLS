"use client";
import PrintManagementCommitteeButton from "@/components/governance/management-committee/buttons/print-management-committee-button";
import { UpdateManagementCommitteeDialog } from "@/components/governance/management-committee/modals/update-management-committee-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatSt } from "@/lib/governance/management-committee";
import { cn, formatDate } from "@/lib/utils";
import { Pencil, Printer } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";

export function ManagementCommitteeDetailsTable({
  id,
  title,
  reference,
  status,
  meetingDate,
  nextTask,
}) {
  const intl = useIntl();
  const { label: statusLabel, color } = formatSt(status, intl);

  return (
    <Table className="border">
      <TableHeader>
        <TableRow>
          <TableHead>
            <FormattedMessage id="managementCommittee.titleHeader" />
          </TableHead>
          <TableHead>
            <FormattedMessage id="managementCommittee.referenceHeader" />
          </TableHead>
          <TableHead className={cn(nextTask && "text-destructive")}>
            <FormattedMessage id="managementCommittee.nextTaskHeader" />
          </TableHead>
          <TableHead className={cn(nextTask && "text-destructive")}>
            <FormattedMessage id="managementCommittee.nextDeadlineHeader" />
          </TableHead>
          <TableHead>
            <FormattedMessage id="managementCommittee.meetingDateHeader" />
          </TableHead>
          <TableHead>
            <FormattedMessage id="managementCommittee.statusHeader" />
          </TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="bg-card">
          <TableCell>{title}</TableCell>
          <TableCell>{reference}</TableCell>
          <TableCell className={cn("max-w-32", nextTask && "text-destructive")}>
            {nextTask?.title ?? (
              <FormattedMessage id="managementCommittee.noTask" />
            )}
          </TableCell>
          <TableCell className={cn(nextTask && "text-destructive")}>
            {nextTask?.dueDate ? (
              formatDate(nextTask.dueDate)
            ) : (
              <FormattedMessage id="managementCommittee.noDeadline" />
            )}
          </TableCell>
          <TableCell>{formatDate(meetingDate)}</TableCell>
          <TableCell>
            <Badge style={{ backgroundColor: color }} className="text-nowrap">
              {statusLabel}
            </Badge>
          </TableCell>
          <TableCell>
            <Tooltip>
              <UpdateManagementCommitteeDialog asChild meetingId={id}>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Pencil />
                  </Button>
                </TooltipTrigger>
              </UpdateManagementCommitteeDialog>
              <TooltipContent>
                <FormattedMessage id="managementCommittee.editTooltip" />
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <PrintManagementCommitteeButton
                  meetingId={id}
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                >
                  <Printer />
                </PrintManagementCommitteeButton>
              </TooltipTrigger>
              <TooltipContent>
                <FormattedMessage id="managementCommittee.printTooltip" />
              </TooltipContent>
            </Tooltip>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
