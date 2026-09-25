"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/lib/i18n/locale-provider";
import type { TransferStatus } from "@/lib/governance/shareholding/transfers";

export function TransferStatusBadge({ status }: { status: TransferStatus }) {
  const { t } = useDictionary();
  const label = t.shareholding.status[status] ?? t.shareholding.status.unknown;

  return (
    <Badge
      className={cn("text-nowrap bg-muted text-muted-foreground", {
        "bg-accent text-accent-foreground": status === "pending",
        "bg-destructive text-destructive-foreground": status === "rejected",
        "bg-primary text-primary-foreground": status === "approved",
        "bg-secondary text-secondary-foreground": status === "validated",
      })}
    >
      {label}
    </Badge>
  );
}
