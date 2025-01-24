import React from "react";
import { useIntl } from "react-intl";
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
import ChecklistTable from "@/components/governance/management-committee/tables/checklist-table";
import PrintChecklistButton from "@/components/governance/management-committee/buttons/print-checklist-button";

export default function ChecklistModal({ meetingId, ...props }) {
  const intl = useIntl();

  return (
    <Dialog>
      <DialogTrigger {...props} />
      <DialogContent className="max-h-screen max-w-md">
        <DialogHeader>
          <DialogTitle>
            {intl.formatMessage({ id: "managementCommittee.checklist.title" })}
          </DialogTitle>
          <DialogDescription>
            {intl.formatMessage({
              id: "managementCommittee.checklist.description",
            })}
          </DialogDescription>
        </DialogHeader>
        <ChecklistTable
          meetingId={meetingId}
          tableWrapperClassName="max-h-80 overflow-auto sm:max-h-96"
        />
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="destructive">
              {intl.formatMessage({
                id: "managementCommittee.checklist.closeButton",
              })}
            </Button>
          </DialogClose>
          <PrintChecklistButton meetingId={meetingId}>
            {intl.formatMessage({
              id: "managementCommittee.checklist.generateListButton",
            })}
          </PrintChecklistButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
