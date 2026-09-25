"use client";

import Link from "next/link";
import { Calendar, Info, ShieldAlert, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Alert, AlertPriority } from "@/lib/alert/alerts";
import { formatDisplayDate } from "@/lib/shared/date-utils";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function AlertIcon({ priority }: { priority: AlertPriority }) {
  if (priority === "urgent") return <TriangleAlert size={30} className="shrink-0 fill-destructive text-destructive-foreground" />;
  if (priority === "warning") return <ShieldAlert size={30} className="shrink-0 fill-yellow-500 text-primary-foreground" />;
  return <Info size={30} className="shrink-0 fill-blue-500 text-primary-foreground" />;
}

/** Where an alert's "view the file" button leads, per backend module key. */
export function alertHref(module: string, moduleId?: string) {
  if (!moduleId) return null;
  const base: Record<string, string> = {
    incident: "/dashboard/account-incident",
    contract: "/dashboard/contract",
    session_administrator: "/dashboard/governance/administration-meeting",
    general_meeting: "/dashboard/governance/general-meeting",
    management_committee: "/dashboard/governance/management-committee",
    litigation: "/dashboard/litigation",
    recovery: "/dashboard/recovery",
    property: "/dashboard/safety/mortgage",
    pledge: "/dashboard/safety/movable-safety",
    personal: "/dashboard/safety/personal-safety",
  };
  return base[module] ? `${base[module]}/${moduleId}` : null;
}

export function AlertDetailsDialog({
  alert,
  open,
  onOpenChange,
}: {
  alert: Alert | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useDictionary();
  const href = alert ? alertHref(alert.module, alert.moduleId) : null;

  return (
    <Dialog open={open && !!alert} onOpenChange={onOpenChange}>
      <DialogContent>
        {alert && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <AlertIcon priority={alert.priority} />
                <DialogTitle>{alert.title}</DialogTitle>
              </div>
              {alert.dueDate && (
                <div className="flex items-center justify-center gap-2 text-2xl text-destructive">
                  <Calendar size={30} />
                  {formatDisplayDate(alert.dueDate)}
                </div>
              )}
            </DialogHeader>
            <p className="text-lg italic text-accent-foreground">{alert.message}</p>
            <DialogFooter className="gap-2">
              <DialogClose render={<Button className="bg-muted text-muted-foreground hover:bg-muted/90" />}>
                {t.alerts.remindLater}
              </DialogClose>
              {href && (
                <DialogClose render={<Button nativeButton={false} render={<Link href={href} />} />}>
                  {t.alerts.viewFile}
                </DialogClose>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
