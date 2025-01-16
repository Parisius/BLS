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
import ProcedureTable from "@/components/governance/general-meeting/tables/procedure-table";
import PrintProceduresButton from "@/components/governance/general-meeting/buttons/print-procedures-button";
import { FormattedMessage } from "react-intl";
export default function ProcedureModal({ meetingId, ...props }) {
  return (
    <Dialog>
      <DialogTrigger {...props} />
      <DialogContent className="max-h-screen max-w-md">
        <DialogHeader>
          <DialogTitle>
            <FormattedMessage id="generalMeeting.processs_modal_title" />
          </DialogTitle>
          <DialogDescription>
            <FormattedMessage id="generalMeeting.processs_modal_description" />
          </DialogDescription>
        </DialogHeader>
        <ProcedureTable
          meetingId={meetingId}
          tableWrapperClassName="max-h-80 overflow-auto sm:max-h-96"
        />
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="destructive">
              <FormattedMessage id="generalMeeting.processs_modal_close_btn" />
            </Button>
          </DialogClose>
          <PrintProceduresButton meetingId={meetingId}>
            <FormattedMessage id="generalMeeting.processs_modal_generat_list_btn" />
          </PrintProceduresButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
