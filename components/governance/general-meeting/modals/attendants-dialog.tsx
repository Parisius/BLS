"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React, { useRef } from "react";
import AttendantsTable from "@/components/governance/general-meeting/tables/attendants-table";
import PrintAttendantsListButton from "@/components/governance/general-meeting/buttons/print-attendants-list-button";
import { FormattedMessage } from "react-intl";
export default function AttendantsDialog({ meetingId, ...props }) {
  const closeRef = useRef(null);
  return (
    <Dialog>
      <DialogTrigger {...props} />
      <DialogContent className="max-h-screen max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            <FormattedMessage
              id="generalMeeting.general_meeting_attendantsDialog_title"
              defaultMessage="Attendance List"
            />
          </DialogTitle>
          <DialogDescription>
            <FormattedMessage
              id="generalMeeting.general_meeting_attendantsDialog_description"
              defaultMessage="Create the list of attendees for the General Assembly."
            />
          </DialogDescription>
        </DialogHeader>
        <AttendantsTable
          meetingId={meetingId}
          tableWrapperClassName="max-h-80 overflow-auto sm:max-h-96"
        />
        <DialogFooter className="gap-2">
          <DialogClose ref={closeRef} />
          <DialogClose asChild>
            <Button variant="destructive">
              <FormattedMessage
                id="generalMeeting.general_meeting_attendantsDialog_cancel"
                defaultMessage="Cancel"
              />
            </Button>
          </DialogClose>
          <PrintAttendantsListButton meetingId={meetingId}>
            <FormattedMessage
              id="generalMeeting.general_meeting_attendantsDialog_generate"
              defaultMessage="Generate the list"
            />
          </PrintAttendantsListButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
