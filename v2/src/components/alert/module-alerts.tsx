"use client";

import { useState } from "react";
import { AlertDetailsDialog } from "@/components/alert/alert-details-dialog";
import { useAllAlerts, useMarkAlertAsRead } from "@/lib/alert/hooks";

const DISMISSED_KEY = "bls:dismissed-alerts";

function readDismissed(): string[] {
  try {
    return JSON.parse(sessionStorage.getItem(DISMISSED_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

/**
 * Pops up a module's warning/urgent alerts, one at a time. Closing one ("remind me later") marks it as read for the
 * bell and hides it for the rest of the session; it comes back on the next session. The original opened every alert
 * at once (stacked dialogs) and re-opened all of them on every navigation.
 */
export function ModuleAlerts({ module }: { module: string }) {
  const { data } = useAllAlerts({ module });
  const { mutate: markAsRead } = useMarkAlertAsRead();
  // Nothing renders until the alerts have loaded (client only), so reading sessionStorage here can't mismatch SSR.
  const [dismissed, setDismissed] = useState<string[]>(readDismissed);

  if (!data) return null;
  const next = data.find((alert) => ["urgent", "warning"].includes(alert.priority) && !dismissed.includes(alert.id));

  return (
    <AlertDetailsDialog
      alert={next ?? null}
      open={!!next}
      onOpenChange={(open) => {
        if (open || !next) return;
        const updated = [...dismissed, next.id];
        try {
          sessionStorage.setItem(DISMISSED_KEY, JSON.stringify(updated));
        } catch {
          // Storage blocked: the alert simply reappears on the next visit.
        }
        setDismissed(updated);
        if (!next.isRead) markAsRead(next.id);
      }}
    />
  );
}
