"use client";

import { HandCoins } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { LitigationCard } from "@/components/litigation/litigation-list";
import { useUnsuppliedLitigation } from "@/lib/litigation/hooks";
import { useDictionary } from "@/lib/i18n/locale-provider";

/** Only shown while some cases still need provisioning. */
export function UnsuppliedLitigationDialog() {
  const { t } = useDictionary();
  const tu = t.litigation.unsupplied;
  const { data } = useUnsuppliedLitigation();

  if (!data || data.length === 0) return null;

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="destructive" className="gap-2" />}>
        <HandCoins />
        {t.litigation.unsuppliedLitigationButton}
      </DialogTrigger>
      <DialogContent className="flex max-h-screen max-w-lg flex-col">
        <DialogHeader>
          <DialogTitle>{tu.title}</DialogTitle>
          <DialogDescription>{tu.description}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-1 flex-col items-center space-y-5 overflow-auto">
          {data.map((litigation) => (
            <LitigationCard key={litigation.id} litigation={litigation} className="w-full" />
          ))}
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="destructive" />}>{tu.close}</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
