"use client";

import { Fragment, useMemo, useState } from "react";
import { Bell, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertDetailsDialog, AlertIcon } from "@/components/alert/alert-details-dialog";
import { useAllAlerts, useMarkAlertAsRead } from "@/lib/alert/hooks";
import type { Alert } from "@/lib/alert/alerts";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/lib/i18n/locale-provider";

/** Header bell: every notification, unread ones counted; clicking one opens its details. */
export function NotificationsBell() {
  const { t } = useDictionary();
  const ta = t.alerts;
  const { data, isLoading, isError } = useAllAlerts();
  const { mutate: markAsRead } = useMarkAlertAsRead();
  // The dialog lives outside the menu: dialogs inside dropdown content unmount when the menu closes.
  const [selected, setSelected] = useState<Alert | null>(null);

  const unread = useMemo(() => (data ?? []).filter((alert) => !alert.isRead).length, [data]);
  const unreadLabel =
    unread === 0 ? ta.none : (unread === 1 ? ta.unreadOne : ta.unreadMany).replace("{count}", String(unread));

  return (
    <>
      <DropdownMenu>
        <Tooltip>
          <DropdownMenuTrigger
            render={
              <TooltipTrigger
                render={<Button variant="ghost" size="icon" className="relative" aria-label={unreadLabel} />}
              />
            }
          >
            <Bell />
            {unread > 0 && (
              <Badge
                variant="destructive"
                className="absolute right-0 top-0 aspect-square -translate-y-1/3 translate-x-1/4 px-1"
              >
                {unread}
              </Badge>
            )}
          </DropdownMenuTrigger>
          <TooltipContent>{unreadLabel}</TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end" className="max-h-96 w-64 overflow-auto md:w-80">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="flex items-center gap-2">
              <span>{ta.title}</span>
              {unread > 0 && <Badge variant="destructive">{unread}</Badge>}
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          {isLoading && (
            <DropdownMenuItem disabled className="justify-center italic text-muted-foreground">
              {ta.loading}
            </DropdownMenuItem>
          )}
          {isError && (
            <DropdownMenuItem disabled className="justify-center gap-2 italic text-destructive">
              <TriangleAlert /> {ta.error}
            </DropdownMenuItem>
          )}
          {!isLoading && !isError && data?.length === 0 && (
            <DropdownMenuItem disabled className="justify-center italic text-muted-foreground">
              {ta.empty}
            </DropdownMenuItem>
          )}
          {data?.map((alert, index) => (
            <Fragment key={alert.id}>
              <DropdownMenuItem
                className={cn("relative cursor-pointer items-start gap-2 pr-5", alert.isRead && "text-muted-foreground")}
                title={alert.message}
                onClick={() => setSelected(alert)}
              >
                <AlertIcon priority={alert.priority} />
                <span className="line-clamp-2">{alert.title}</span>
                {!alert.isRead && (
                  <span className="absolute right-1 top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-primary" />
                )}
              </DropdownMenuItem>
              {index < data.length - 1 && <DropdownMenuSeparator />}
            </Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDetailsDialog
        alert={selected}
        open={!!selected}
        onOpenChange={(open) => {
          if (open) return;
          if (selected && !selected.isRead) markAsRead(selected.id);
          setSelected(null);
        }}
      />
    </>
  );
}
