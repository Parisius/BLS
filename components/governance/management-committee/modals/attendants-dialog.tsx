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
import AttendantsTable from "@/components/governance/management-committee/tables/attendants-table";
import PrintAttendantsListButton from "@/components/governance/management-committee/buttons/print-attendants-list-button";
import { FormattedMessage } from "react-intl";

export default function AttendantsDialog({ meetingId, ...props }) {
  const closeRef = useRef(null);

  return (
    <Dialog>
      <DialogTrigger {...props} />
      <DialogContent className="max-h-screen max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            <FormattedMessage id="managementCommittee.attendanceListTitle" />
          </DialogTitle>
          <DialogDescription>
            <FormattedMessage id="managementCommittee.attendanceListDescription" />
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
              <FormattedMessage id="managementCommittee.cancelButton" />
            </Button>
          </DialogClose>
          <PrintAttendantsListButton meetingId={meetingId}>
            <FormattedMessage id="managementCommittee.generateListButton" />
          </PrintAttendantsListButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
