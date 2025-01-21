import React from "react";
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
import ChecklistTable from "@/components/governance/administration-meeting/tables/checklist-table";
import PrintChecklistButton from "@/components/governance/administration-meeting/buttons/print-checklist-button";
import { FormattedMessage } from "react-intl";
export default function ChecklistModal({ meetingId, ...props }) {
  return (
    <Dialog>
      <DialogTrigger {...props} />
      <DialogContent className="max-h-screen max-w-md">
        <DialogHeader>
          <DialogTitle>Checklist</DialogTitle>
          <DialogDescription>
            <FormattedMessage id="sessionAdministrator.checklistDescription" />
          </DialogDescription>
        </DialogHeader>
        <ChecklistTable
          meetingId={meetingId}
          tableWrapperClassName="max-h-80 overflow-auto sm:max-h-96"
        />
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="destructive">
              <FormattedMessage id="sessionAdministrator.close" />
            </Button>
          </DialogClose>
          <PrintChecklistButton meetingId={meetingId}>
            <FormattedMessage id="sessionAdministrator.generateList" />
          </PrintChecklistButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
