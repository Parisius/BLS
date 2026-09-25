"use client";

import { Tag, User, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PARTY_CATEGORIES, PARTY_TYPES } from "@/lib/litigation/constants";
import type { Litigation } from "@/lib/litigation/litigations";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function PartiesSheet({ litigation, onEdit }: { litigation: Litigation; onEdit: () => void }) {
  const { t } = useDictionary();
  const tl = t.litigation;
  const categoryLabel = (value: string) =>
    (PARTY_CATEGORIES as readonly string[]).includes(value) ? tl.partyCategories[value as (typeof PARTY_CATEGORIES)[number]] : value;
  const typeLabel = (value: string) =>
    (PARTY_TYPES as readonly string[]).includes(value) ? tl.partyTypes[value as (typeof PARTY_TYPES)[number]] : value;

  return (
    <Sheet>
      <Tooltip>
        <SheetTrigger
          render={
            <TooltipTrigger
              render={<Button variant="ghost" size="icon" aria-label={tl.details.parties} className="gap-2 rounded-full" />}
            />
          }
        >
          <Users size={30} />
        </SheetTrigger>
        <TooltipContent>{tl.details.parties}</TooltipContent>
      </Tooltip>
      <SheetContent side="right" className="flex flex-col gap-5">
        <SheetHeader>
          <div className="flex items-center justify-between gap-2">
            <SheetTitle>{tl.parties.title}</SheetTitle>
            <Button className="gap-2" onClick={onEdit}>
              <UserPlus />
              {tl.parties.editParties}
            </Button>
          </div>
          <SheetDescription className="line-clamp-1">{litigation.title}</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-auto py-2">
          <div className="relative flex flex-col gap-5 rounded-xl border-2 p-5">
            <span className="absolute left-3 top-0 -translate-y-1/2 bg-background px-2 text-sm font-semibold">
              {tl.parties.party}
            </span>
            {litigation.parties.map((party) => (
              <div key={party.id} className="flex flex-col gap-3 sm:flex-row sm:gap-5">
                {(
                  [
                    [tl.parties.party, party.name, User],
                    [tl.parties.category, categoryLabel(party.category), Tag],
                    [tl.parties.type, typeLabel(party.type), Tag],
                  ] as const
                ).map(([label, value, Icon]) => (
                  <div key={label} className="flex-1 space-y-2">
                    <span>{label}</span>
                    <div className="flex items-center gap-2">
                      <Icon className="flex-shrink-0" />
                      <span>{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <SheetFooter>
          <SheetClose render={<Button variant="destructive" />}>{tl.parties.close}</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
