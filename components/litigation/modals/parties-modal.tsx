import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import React from "react";
import { UserPlus } from "lucide-react";
import UpdateLitigationDialog from "@/components/litigation/modals/update-litigation-dialog";
import PartiesGroupView from "@/components/litigation/ui/parties-group-view";
import { useIntl } from "react-intl";

export default function PartiesModal({
  litigationId,
  litigationTitle,
  partiesGroup,
  ...props
}) {
  const intl = useIntl();

  return (
    <Sheet>
      <SheetTrigger {...props} />
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-5 sm:w-3/4 sm:max-w-xl"
      >
        <SheetHeader>
          <div className="sm:flex sm:items-center sm:justify-between">
            <SheetTitle>
              {intl.formatMessage({
                id: "litigation.litigation.parties.title",
              })}
            </SheetTitle>
            <UpdateLitigationDialog asChild litigationId={litigationId}>
              <Button className="hidden gap-2 sm:inline-flex">
                <UserPlus />
                {intl.formatMessage({
                  id: "litigation.litigation.parties.editParties",
                })}
              </Button>
            </UpdateLitigationDialog>
          </div>
          <SheetDescription className="line-clamp-1">
            {litigationTitle}
          </SheetDescription>
          <UpdateLitigationDialog asChild litigationId={litigationId}>
            <Button className="sm gap-2 sm:hidden">
              <UserPlus />
              {intl.formatMessage({
                id: "litigation.litigation.parties.editParties",
              })}
            </Button>
          </UpdateLitigationDialog>
        </SheetHeader>
        <div className="flex-1 space-y-10 overflow-auto py-2">
          <PartiesGroupView
            label={intl.formatMessage({
              id: "litigation.litigation.parties.party",
            })}
            partiesGroup={partiesGroup}
          />
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="destructive">
              {intl.formatMessage({
                id: "litigation.litigation.parties.close",
              })}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
