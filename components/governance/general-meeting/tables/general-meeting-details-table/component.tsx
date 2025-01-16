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
import { UpdateGeneralMeetingDialog } from "@/components/governance/general-meeting/modals/update-general-meeting-dialog";
import {
  formatMeetingType,
  formatStatus,
} from "@/lib/governance/general-meeting";
import PrintGeneralMeetingButton from "@/components/governance/general-meeting/buttons/print-general-meeting-button";
import { FormattedMessage, useIntl } from "react-intl";

export function GeneralMeetingDetailsTable({
  id,
  title,
  meetingType,
  reference,
  status,
  meetingDate,
  nextTask,
}) {
  const intl = useIntl();

  const statusFormatted = formatStatus(status, intl);
  const meetingTypeFormatted = formatMeetingType(meetingType, intl);

  return (
    <Table className="border">
      <TableHeader>
        <TableRow>
          <TableHead>
            <FormattedMessage id="generalMeeting.general_meeting_table_header_title" />
          </TableHead>
          <TableHead>
            <FormattedMessage id="generalMeeting.general_meeting_table_header_type" />
          </TableHead>
          <TableHead>
            <FormattedMessage id="generalMeeting.general_meeting_table_header_reference" />
          </TableHead>
          <TableHead className={cn(nextTask && "text-destructive")}>
            <FormattedMessage id="generalMeeting.general_meeting_table_header_next_task" />
          </TableHead>
          <TableHead className={cn(nextTask && "text-destructive")}>
            <FormattedMessage id="generalMeeting.general_meeting_table_header_next_deadline" />
          </TableHead>
          <TableHead>
            <FormattedMessage id="generalMeeting.general_meeting_table_header_date" />
          </TableHead>
          <TableHead>
            <FormattedMessage id="generalMeeting.general_meeting_table_header_status" />
          </TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="bg-card">
          <TableCell>{title}</TableCell>
          <TableCell>
            <Badge className="bg-muted text-muted-foreground hover:bg-muted/90">
              {meetingTypeFormatted.label}
            </Badge>
          </TableCell>
          <TableCell>{reference}</TableCell>
          <TableCell className={cn("max-w-32", nextTask && "text-destructive")}>
            {nextTask?.title ??
              intl.formatMessage({ id: "generalMeeting.no_task" })}
          </TableCell>
          <TableCell className={cn(nextTask && "text-destructive")}>
            {nextTask?.dueDate
              ? formatDate(nextTask.dueDate)
              : intl.formatMessage({ id: "generalMeeting.no_deadline" })}
          </TableCell>
          <TableCell>{formatDate(meetingDate)}</TableCell>
          <TableCell>
            <Badge
              style={{ backgroundColor: statusFormatted.color }}
              className="text-nowrap"
            >
              {statusFormatted.label}
            </Badge>
          </TableCell>
          <TableCell>
            <Tooltip>
              <UpdateGeneralMeetingDialog asChild meetingId={id}>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Pencil />
                  </Button>
                </TooltipTrigger>
              </UpdateGeneralMeetingDialog>
              <TooltipContent>
                <FormattedMessage id="generalMeeting.general_meeting_action_edit" />
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <PrintGeneralMeetingButton
                  meetingId={id}
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                >
                  <Printer />
                </PrintGeneralMeetingButton>
              </TooltipTrigger>
              <TooltipContent>
                <FormattedMessage id="generalMeeting.general_meeting_action_print" />
              </TooltipContent>
            </Tooltip>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
