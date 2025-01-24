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
import ProcedureTable from "@/components/governance/management-committee/tables/procedure-table";
import PrintProceduresButton from "@/components/governance/management-committee/buttons/print-procedures-button";
import { useIntl } from "react-intl";

export default function ProcedureModal({ meetingId, ...props }) {
  const intl = useIntl();

  return (
    <Dialog>
      <DialogTrigger {...props} />
      <DialogContent className="max-h-screen max-w-md">
        <DialogHeader>
          <DialogTitle>
            {intl.formatMessage({ id: "managementCommittee.procedure.title" })}
          </DialogTitle>
          <DialogDescription>
            {intl.formatMessage({
              id: "managementCommittee.procedure.description",
            })}
          </DialogDescription>
        </DialogHeader>
        <ProcedureTable
          meetingId={meetingId}
          tableWrapperClassName="max-h-80 overflow-auto sm:max-h-96"
        />
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="destructive">
              {intl.formatMessage({
                id: "managementCommittee.procedure.closeButton",
              })}
            </Button>
          </DialogClose>
          <PrintProceduresButton meetingId={meetingId}>
            {intl.formatMessage({
              id: "managementCommittee.procedure.generateListButton",
            })}
          </PrintProceduresButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
