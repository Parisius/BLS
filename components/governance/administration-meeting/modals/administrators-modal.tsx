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
import AdministratorsTable from "@/components/governance/administration-meeting/tables/administrators-table";
import { FormattedMessage } from "react-intl";
export default function AdministratorsModal(props) {
  return (
    <Dialog>
      <DialogTrigger {...props} />
      <DialogContent className="max-h-screen max-w-[90%]">
        <DialogHeader>
          <DialogTitle>
            <FormattedMessage id="sessionAdministrator.administrators_modal_title" />
          </DialogTitle>
          <DialogDescription>
            <FormattedMessage id="sessionAdministrator.administrators_modal_description" />
          </DialogDescription>
        </DialogHeader>
        <AdministratorsTable tableWrapperClassName="max-h-80 overflow-auto sm:max-h-96" />
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="destructive">
              <FormattedMessage id="sessionAdministrator.administrators_modal_close_btn" />
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
