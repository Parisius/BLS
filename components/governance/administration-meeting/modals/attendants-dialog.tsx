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
import AttendantsTable from "@/components/governance/administration-meeting/tables/attendants-table";
import PrintAttendantsListButton from "@/components/governance/administration-meeting/buttons/print-attendants-list-button";
import { FormattedMessage } from "react-intl";
export default function AttendantsDialog({ meetingId, ...props }) {
  const closeRef = useRef(null);
  return (
    <Dialog>
      <DialogTrigger {...props} />
      <DialogContent className="max-h-screen max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            <FormattedMessage id="sessionAdministrator.dialog_title_attendants" />
          </DialogTitle>
          <DialogDescription>
            <FormattedMessage id="sessionAdministrator.dialog_description_attendants" />
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
              <FormattedMessage id="sessionAdministrator.button_cancel" />
            </Button>
          </DialogClose>
          <PrintAttendantsListButton meetingId={meetingId}>
            <FormattedMessage id="sessionAdministrator.button_generate_list" />
          </PrintAttendantsListButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
