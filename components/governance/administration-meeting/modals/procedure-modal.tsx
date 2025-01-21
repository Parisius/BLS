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
import ProcedureTable from "@/components/governance/administration-meeting/tables/procedure-table";
import PrintProceduresButton from "@/components/governance/administration-meeting/buttons/print-procedures-button";
import { FormattedMessage } from "react-intl";
export default function ProcedureModal({ meetingId, ...props }) {
  return (
    <Dialog>
      <DialogTrigger {...props} />
      <DialogContent className="max-h-screen max-w-md">
        <DialogHeader>
          <DialogTitle>
            <FormattedMessage id="sessionAdministrator.procedure_Modal_Title" />
          </DialogTitle>
          <DialogDescription>
            <FormattedMessage id="sessionAdministrator.procedure_Modal_Description" />
          </DialogDescription>
        </DialogHeader>
        <ProcedureTable
          meetingId={meetingId}
          tableWrapperClassName="max-h-80 overflow-auto sm:max-h-96"
        />
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="destructive">
              <FormattedMessage id="sessionAdministrator.close_Button" />
            </Button>
          </DialogClose>
          <PrintProceduresButton meetingId={meetingId}>
            <FormattedMessage id="sessionAdministrator.generate_List_Button" />
          </PrintProceduresButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
