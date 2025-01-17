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
import React from "react";
import AdministratorsMandatesTable from "@/components/governance/administration-meeting/tables/administrators-mandates-table";
import { FormattedMessage } from "react-intl";
export default function AdministratorsMandatesModal(props) {
  return (
    <Dialog>
      <DialogTrigger {...props} />
      <DialogContent className="max-h-screen max-w-[90%]">
        <DialogHeader>
          <DialogTitle>
            <FormattedMessage id="sessionAdministrator.administrators_mandates_modal_title" />
          </DialogTitle>
          <DialogDescription>
            <FormattedMessage id="sessionAdministrator.administrators_mandates_modal_description" />
          </DialogDescription>
        </DialogHeader>
        <AdministratorsMandatesTable tableWrapperClassName="max-h-80 overflow-auto sm:max-h-96" />
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="destructive">
              <FormattedMessage id="sessionAdministrator.administrators_mandates_modal_close_btn" />
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
