"use client";

import { useState } from "react";
import { UserPlus, Users } from "lucide-react";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { UpdateContractDialog } from "@/components/contract/update-contract-dialog";
import { useAllStakeholders } from "@/lib/contract/hooks";
import type { Contract, StakeholderGroupItem } from "@/lib/contract/contracts";
import { useDictionary } from "@/lib/i18n/locale-provider";
import { Can } from "@/components/auth/can";

function StakeholdersGroupView({
  label,
  group,
}: {
  label: string;
  group: StakeholderGroupItem[];
}) {
  const { data: stakeholders } = useAllStakeholders();
  const { t } = useDictionary();

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">{label}</h3>
      <div className="space-y-2 rounded-lg border p-3">
        {group.map((member, index) => {
          const stakeholder = stakeholders?.find((s) => String(s.id) === member.stakeholderId);
          return (
            <div key={index} className="flex items-center justify-between gap-3 text-sm">
              <span className="font-medium">{stakeholder?.name ?? member.stakeholderId}</span>
              <span className="text-muted-foreground">{member.description}</span>
            </div>
          );
        })}
        {group.length === 0 && (
          <p className="text-sm italic text-muted-foreground">{t.contract.list.noItems}</p>
        )}
      </div>
    </div>
  );
}

export function StakeholdersModal({ contract }: { contract: Contract }) {
  const [editing, setEditing] = useState(false);
  const { t } = useDictionary();
  const tc = t.contract;

  return (
    <>
      <Sheet>
        <Tooltip>
          <SheetTrigger
            render={
              <TooltipTrigger
                render={<Button variant="ghost" size="icon" className="rounded-full" />}
              />
            }
          >
            <Users size={30} />
          </SheetTrigger>
          <TooltipContent>{tc.stakeholders.title}</TooltipContent>
        </Tooltip>
        <SheetContent side="right" className="flex w-full flex-col gap-5 sm:w-3/4 sm:max-w-xl">
          <SheetHeader>
            <div className="sm:flex sm:items-center sm:justify-between">
              <SheetTitle>{tc.stakeholders.title}</SheetTitle>
              <Can permission="contract.update">
                <Button className="hidden gap-2 sm:inline-flex" onClick={() => setEditing(true)}>
                  <UserPlus />
                  {tc.stakeholders.editButton}
                </Button>
              </Can>
            </div>
            <SheetDescription className="line-clamp-1">{contract.title}</SheetDescription>
            <Can permission="contract.update">
              <Button className="gap-2 sm:hidden" onClick={() => setEditing(true)}>
                <UserPlus />
                {tc.stakeholders.editButton}
              </Button>
            </Can>
          </SheetHeader>

          <div className="flex-1 space-y-10 overflow-auto py-2">
            <StakeholdersGroupView label={tc.stakeholders.party1} group={contract.firstStakeholdersGroup} />
            <StakeholdersGroupView label={tc.stakeholders.party2} group={contract.secondStakeholdersGroup} />
          </div>

          <SheetFooter>
            <SheetClose render={<Button variant="destructive" />}>{tc.stakeholders.close}</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <UpdateContractDialog contractId={contract.id} open={editing} onOpenChange={setEditing} />
    </>
  );
}
