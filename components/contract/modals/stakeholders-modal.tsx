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
import UpdateContractDialog from "@/components/contract/modals/update-contract-dialog";
import StakeholdersGroupView from "@/components/contract/ui/stakeholders-group-view";
import { useIntl } from "react-intl";

export default function StakeholdersModal({
  contractId,
  contractTitle,
  firstStakeholdersGroup,
  secondStakeholdersGroup,
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
                id: "contract.contract.stakeholders.title",
              })}
            </SheetTitle>
            <UpdateContractDialog asChild contractId={contractId}>
              <Button className="hidden gap-2 sm:inline-flex">
                <UserPlus />
                {intl.formatMessage({
                  id: "contract.contract.stakeholders.editButton",
                })}
              </Button>
            </UpdateContractDialog>
          </div>
          <SheetDescription className="line-clamp-1">
            {contractTitle}
          </SheetDescription>
          <UpdateContractDialog asChild contractId={contractId}>
            <Button className="sm gap-2 sm:hidden">
              <UserPlus />
              {intl.formatMessage({
                id: "contract.contract.stakeholders.editButton",
              })}
            </Button>
          </UpdateContractDialog>
        </SheetHeader>
        <div className="flex-1 space-y-10 overflow-auto py-2">
          <StakeholdersGroupView
            label={intl.formatMessage({
              id: "contract.contract.stakeholders.party1",
            })}
            stakeholdersGroup={firstStakeholdersGroup}
          />

          <StakeholdersGroupView
            label={intl.formatMessage({
              id: "contract.contract.stakeholders.party2",
            })}
            stakeholdersGroup={secondStakeholdersGroup}
          />
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="destructive">
              {intl.formatMessage({
                id: "contract.contract.stakeholders.close",
              })}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
