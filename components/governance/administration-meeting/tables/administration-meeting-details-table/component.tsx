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
import { cn, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Pencil, Printer } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UpdateAdministrationMeetingDialog } from "@/components/governance/administration-meeting/modals/update-administration-meeting-dialog";
import {
  formatMeetingType,
  formatStatus,
} from "@/lib/governance/administration-meeting";
import PrintAdministrationMeetingButton from "@/components/governance/administration-meeting/buttons/print-administration-meeting-button";
import { FormattedMessage, useIntl } from "react-intl";
export function AdministrationMeetingDetailsTable({
  id,
  title,
  meetingType,
  reference,
  status,
  meetingDate,
  nextTask,
}) {
  const intl = useIntl();
  const { label: statusLabel, color } = formatStatus(status, intl);
  const { label: meetingTypeLabel } = formatMeetingType(meetingType);
  return (
    <Table className="border">
      <TableHeader>
        <TableRow>
          <TableHead>
            <FormattedMessage id="sessionAdministrator.heading_title" />
          </TableHead>
          <TableHead>
            <FormattedMessage id="sessionAdministrator.heading_type" />
          </TableHead>
          <TableHead>
            {" "}
            <FormattedMessage id="sessionAdministrator.heading_reference" />
          </TableHead>
          <TableHead className={cn(nextTask && "text-destructive")}>
            <FormattedMessage id="sessionAdministrator.heading_next_task" />
          </TableHead>
          <TableHead className={cn(nextTask && "text-destructive")}>
            <FormattedMessage id="sessionAdministrator.heading_next_due_date" />
            :
          </TableHead>
          <TableHead>
            <FormattedMessage id="sessionAdministrator.heading_meeting_date" />
          </TableHead>
          <TableHead>
            <FormattedMessage id="sessionAdministrator.heading_status" />
          </TableHead>
          <TableHead>Actions</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="bg-card">
          <TableCell>{title}</TableCell>
          <TableCell>
            <Badge className="bg-muted text-muted-foreground hover:bg-muted/90">
              {meetingTypeLabel}
            </Badge>
          </TableCell>
          <TableCell>{reference}</TableCell>
          <TableCell className={cn("max-w-32", nextTask && "text-destructive")}>
            {nextTask?.title ?? (
              <FormattedMessage id="sessionAdministrator.no_task" />
            )}
          </TableCell>
          <TableCell className={cn(nextTask && "text-destructive")}>
            {nextTask?.dueDate ? (
              formatDate(nextTask.dueDate)
            ) : (
              <FormattedMessage id="sessionAdministrator.no_due_date" />
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
              <UpdateAdministrationMeetingDialog asChild meetingId={id}>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Pencil />
                  </Button>
                </TooltipTrigger>
              </UpdateAdministrationMeetingDialog>
              <TooltipContent>
                {" "}
                <FormattedMessage id="sessionAdministrator.tooltip_edit" />
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <PrintAdministrationMeetingButton
                  meetingId={id}
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                >
                  <Printer />
                </PrintAdministrationMeetingButton>
              </TooltipTrigger>
              <TooltipContent>
                {" "}
                <FormattedMessage id="sessionAdministrator.tooltip_print" />
              </TooltipContent>
            </Tooltip>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
