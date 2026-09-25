"use client";

import { Printer } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { usePrintIncident } from "@/lib/account-incident/hooks";
import type { Incident } from "@/lib/account-incident/incidents";
import { downloadBytes } from "@/lib/shared/download";
import { formatDisplayDate } from "@/lib/shared/date-utils";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function IncidentDetailsTable({ incident }: { incident: Incident }) {
  const { t } = useDictionary();
  const tt = t.accountIncident.table;
  const { mutate, isPending } = usePrintIncident();
  const { currentTask } = incident;

  return (
    <Table className="border">
      <TableHeader>
        <TableRow>
          <TableHead>{tt.title}</TableHead>
          <TableHead>{tt.reference}</TableHead>
          <TableHead>{tt.category}</TableHead>
          <TableHead>{tt.personConcerned}</TableHead>
          <TableHead>{tt.isClient}</TableHead>
          <TableHead>{tt.dateReceived}</TableHead>
          <TableHead className={cn(currentTask && "text-destructive")}>{tt.nextTask}</TableHead>
          <TableHead>{tt.status}</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="bg-card">
          <TableCell>{incident.title}</TableCell>
          <TableCell>{incident.reference ?? "-"}</TableCell>
          <TableCell>
            <Badge className="text-nowrap bg-muted text-muted-foreground">{incident.category.label}</Badge>
          </TableCell>
          <TableCell>{incident.author.name}</TableCell>
          <TableCell>
            <Badge className="text-nowrap bg-muted text-muted-foreground">{incident.isClient ? tt.yes : tt.no}</Badge>
          </TableCell>
          <TableCell>{formatDisplayDate(incident.dateReceived)}</TableCell>
          <TableCell className={cn(currentTask && "text-destructive")}>{currentTask?.title ?? tt.noTask}</TableCell>
          <TableCell>
            <Badge
              className={cn("text-nowrap", {
                "bg-primary": !incident.completed,
                "bg-muted text-muted-foreground hover:bg-muted/90": incident.completed,
              })}
            >
              {incident.completed ? t.accountIncident.card.resolved : t.accountIncident.card.inProgress}
            </Badge>
          </TableCell>
          <TableCell>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={tt.print}
                    className="rounded-full"
                    disabled={isPending}
                    onClick={() =>
                      mutate(incident.id, {
                        onSuccess: ({ bytes, filename }) => downloadBytes(bytes, filename),
                        onError: () => toast.error(tt.printError),
                      })
                    }
                  />
                }
              >
                <Printer className={isPending ? "animate-bounce" : undefined} />
              </TooltipTrigger>
              <TooltipContent>{tt.print}</TooltipContent>
            </Tooltip>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
