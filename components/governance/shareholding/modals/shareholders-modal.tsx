"use client";
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
import ShareholdersTable from "@/components/governance/shareholding/tables/shareholders-table";
import { FormattedMessage } from "react-intl";
export default function ShareholdersModal(props) {
  return (
    <Dialog>
      <DialogTrigger {...props} />
      <DialogContent className="max-h-screen max-w-[90%]">
        <DialogHeader>
          <DialogTitle>
            <FormattedMessage id="shareholding.shareholder_modal_title" />
          </DialogTitle>
          <DialogDescription>
            <FormattedMessage id="shareholding.shareholder_modal_description" />
          </DialogDescription>
        </DialogHeader>
        <ShareholdersTable tableWrapperClassName="max-h-80 overflow-auto sm:max-h-96" />
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="destructive">
              <FormattedMessage id="shareholding.close_sharholders_modal_btn" />
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
