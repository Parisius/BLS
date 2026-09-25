"use client";

import Link from "next/link";
import { Printer } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { usePrintRecovery } from "@/lib/recovery/hooks";
import type { Recovery } from "@/lib/recovery/recoveries";
import { downloadBytes } from "@/lib/shared/download";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function RecoveryDetailsTable({ recovery }: { recovery: Recovery }) {
  const { t } = useDictionary();
  const tt = t.recovery.table;
  const { mutate, isPending } = usePrintRecovery();
  const { nextStep } = recovery;

  return (
    <Table className="border">
      <TableHeader>
        <TableRow>
          <TableHead>{tt.title}</TableHead>
          <TableHead>{tt.reference}</TableHead>
          {recovery.guaranteeId && <TableHead>{tt.guarantee}</TableHead>}
          {recovery.contractId && <TableHead>{tt.contract}</TableHead>}
          <TableHead>{tt.currentStep}</TableHead>
          <TableHead className={cn(nextStep && "text-destructive")}>{tt.nextStep}</TableHead>
          <TableHead>{tt.type}</TableHead>
          <TableHead>{tt.status}</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="bg-card">
          <TableCell>{recovery.title}</TableCell>
          <TableCell>{recovery.reference ?? "-"}</TableCell>
          {recovery.guaranteeId && (
            <TableCell>
              <Button
                variant="link"
                className="gap-1 px-0 italic"
                render={<Link href={`/dashboard/safety/mortgage/${recovery.guaranteeId}`} />}
              >
                {tt.viewGuarantee}
              </Button>
            </TableCell>
          )}
          {recovery.contractId && (
            <TableCell>
              <Button
                variant="link"
                className="gap-1 px-0 italic"
                render={<Link href={`/dashboard/contract/${recovery.contractId}`} />}
              >
                {tt.viewContract}
              </Button>
            </TableCell>
          )}
          <TableCell>{recovery.currentStep?.title ?? "-"}</TableCell>
          <TableCell className={cn(nextStep && "text-destructive")}>{nextStep?.title ?? "-"}</TableCell>
          <TableCell>
            <Badge className="text-nowrap bg-muted text-muted-foreground">
              {t.recovery.types[recovery.type]}
            </Badge>
          </TableCell>
          <TableCell>
            <Badge className="text-nowrap bg-muted text-muted-foreground">
              {recovery.isArchived ? tt.archived : tt.inProgress}
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
                      mutate(recovery.id, {
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
