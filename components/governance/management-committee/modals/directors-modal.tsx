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
import React from "react";
import DirectorsTable from "@/components/governance/management-committee/tables/directors-table";
import { FormattedMessage } from "react-intl";
export default function DirectorsModal(props) {
  return (
    <Dialog>
      <DialogTrigger {...props} />
      <DialogContent className="max-h-screen max-w-[90%]">
        <DialogHeader>
          <DialogTitle>
            <FormattedMessage id="managementCommittee.directorsListTitle" />
          </DialogTitle>
          <DialogDescription>
            <FormattedMessage id="managementCommittee.directorsListDescription" />
          </DialogDescription>
        </DialogHeader>
        <DirectorsTable tableWrapperClassName="max-h-80 overflow-auto sm:max-h-96" />
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="destructive">
              <FormattedMessage id="managementCommittee.closeButton" />
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
