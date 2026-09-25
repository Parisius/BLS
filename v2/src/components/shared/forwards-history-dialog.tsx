"use client";

import { MoveRight } from "lucide-react";
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
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDisplayDate } from "@/lib/shared/date-utils";

export interface ForwardRecord {
  id: string;
  title: string;
  dueDate: string;
  sender: { firstname: string; lastname: string };
  receiver: { firstname: string; lastname: string };
}

interface ForwardsHistoryDialogProps {
  forwards: ForwardRecord[];
  /** Omit to control the dialog with `open`/`onOpenChange` (needed when it would otherwise live inside a menu that unmounts on close). */
  trigger?: React.ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  labels: { title: string; description: string; transferredOn: string; close: string };
}

/** Shared across every module's task/event/transfer forward-history feature. */
export function ForwardsHistoryDialog({
  forwards,
  trigger,
  open,
  onOpenChange,
  children,
  labels,
}: ForwardsHistoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger render={trigger}>{children}</DialogTrigger>}
      <DialogContent className="flex max-h-screen max-w-xl flex-col">
        <DialogHeader>
          <DialogTitle>{labels.title}</DialogTitle>
          <DialogDescription>{labels.description}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 space-y-5 overflow-auto">
          {forwards.map((forward) => (
            <Card key={forward.id}>
              <CardHeader>
                <CardTitle>{forward.title}</CardTitle>
                <CardDescription className="space-x-5 text-lg">
                  <span className="text-destructive">
                    {forward.sender.firstname} {forward.sender.lastname}
                  </span>
                  <MoveRight className="inline" />
                  <span className="text-primary">
                    {forward.receiver.firstname} {forward.receiver.lastname}
                  </span>
                </CardDescription>
                <CardDescription className="italic">
                  {labels.transferredOn} {formatDisplayDate(forward.dueDate)}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="destructive" />}>
            {labels.close}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
