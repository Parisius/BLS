"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { UpdateMeetingDialog } from "@/components/governance/administration-meeting/meeting-dialogs";
import { formatDisplayDate } from "@/lib/shared/date-utils";
import type { Meeting } from "@/lib/governance/administration-meeting/meetings";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function MeetingDetailsTable({ meeting }: { meeting: Meeting }) {
  const { t } = useDictionary();
  const tg = t.administrationMeeting;
  const [editing, setEditing] = useState(false);

  return (
    <>
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead>{tg.detailsTable.title}</TableHead>
            <TableHead>{tg.detailsTable.type}</TableHead>
            <TableHead>{tg.detailsTable.reference}</TableHead>
            <TableHead>{tg.detailsTable.date}</TableHead>
            <TableHead>{tg.detailsTable.status}</TableHead>
            <TableHead className="text-center">{tg.detailsTable.edit}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="bg-card">
            <TableCell>{meeting.title}</TableCell>
            <TableCell>
              {meeting.type && (
                <Badge className="bg-muted text-muted-foreground hover:bg-muted/90">
                  {tg.meetingType[meeting.type]}
                </Badge>
              )}
            </TableCell>
            <TableCell>{meeting.reference ?? "-"}</TableCell>
            <TableCell>{meeting.meetingDate ? formatDisplayDate(meeting.meetingDate) : "-"}</TableCell>
            <TableCell>
              <Badge className={meeting.status === "closed" ? "bg-secondary" : "bg-primary"}>
                {tg.status[meeting.status]}
              </Badge>
            </TableCell>
            <TableCell className="text-center">
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
                <TooltipContent>{tg.detailsTable.edit}</TooltipContent>
              </Tooltip>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <UpdateMeetingDialog meeting={meeting} open={editing} onOpenChange={setEditing} />
    </>
  );
}
