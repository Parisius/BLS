"use client";

import Link from "next/link";
import { Printer } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { usePrintGuarantee } from "@/lib/safety/hooks";
import type { SafetyKind } from "@/lib/safety/kinds";
import type { Guarantee } from "@/lib/safety/guarantees";
import { downloadBytes } from "@/lib/shared/download";
import { useFormatAmount } from "@/lib/tenant-provider";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function SafetyDetailsTable({ kind, guarantee }: { kind: SafetyKind; guarantee: Guarantee }) {
  const { t } = useDictionary();
  const formatAmount = useFormatAmount();
  const tt = t.safety.table;
  const { mutate, isPending } = usePrintGuarantee();
  const { nextStep } = guarantee;

  const securityLabel =
    guarantee.security && guarantee.security in t.safety.movableSecurities
      ? t.safety.movableSecurities[guarantee.security as keyof typeof t.safety.movableSecurities]
      : "";
  const movableTypeLabel =
    guarantee.type && guarantee.type in t.safety.movableTypes
      ? t.safety.movableTypes[guarantee.type as keyof typeof t.safety.movableTypes]
      : "";
  const personalTypeLabel =
    guarantee.type && guarantee.type in t.safety.personalTypes
      ? t.safety.personalTypes[guarantee.type as keyof typeof t.safety.personalTypes]
      : "";

  return (
    <Table className="border">
      <TableHeader>
        <TableRow>
          <TableHead>{tt.title}</TableHead>
          <TableHead>{tt.reference}</TableHead>
          {guarantee.contractId && <TableHead>{tt.contract}</TableHead>}
          {kind === "movable-safety" && (
            <>
              <TableHead>{tt.securityType}</TableHead>
              <TableHead>{guarantee.security === "collateral" ? tt.typeOfCollateral : tt.typeOfPledge}</TableHead>
            </>
          )}
          {kind === "personal-safety" && <TableHead>{tt.type}</TableHead>}
          {kind === "mortgage" && <TableHead>{tt.salePrice}</TableHead>}
          <TableHead>{tt.currentStep}</TableHead>
          <TableHead className={cn(nextStep && "text-destructive")}>{tt.nextStep}</TableHead>
          <TableHead>{tt.status}</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="bg-card">
          <TableCell>{guarantee.title}</TableCell>
          <TableCell>{guarantee.reference ?? "-"}</TableCell>
          {guarantee.contractId && (
            <TableCell>
              <Button
                variant="link"
                className="gap-1 px-0 italic"
                render={<Link href={`/dashboard/contract/${guarantee.contractId}`} />}
              >
                {t.safety.common.viewContract}
              </Button>
            </TableCell>
          )}
          {kind === "movable-safety" && (
            <>
              <TableCell>
                <Badge className="text-nowrap bg-muted text-muted-foreground">{securityLabel}</Badge>
              </TableCell>
              <TableCell>
                <Badge className="text-nowrap bg-muted text-muted-foreground">{movableTypeLabel}</Badge>
              </TableCell>
            </>
          )}
          {kind === "personal-safety" && (
            <TableCell>
              <Badge className="text-nowrap bg-muted text-muted-foreground">{personalTypeLabel}</Badge>
            </TableCell>
          )}
          {kind === "mortgage" && (
            <TableCell>{guarantee.estateSalePrice ? formatAmount(guarantee.estateSalePrice) : "-"}</TableCell>
          )}
          <TableCell>{guarantee.currentStep?.title ?? "-"}</TableCell>
          <TableCell className={cn(nextStep && "text-destructive")}>{nextStep?.title ?? "-"}</TableCell>
          <TableCell>
            <Badge className="text-nowrap bg-muted text-muted-foreground">{t.safety.phases[guarantee.phase]}</Badge>
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
                      mutate(guarantee.id, {
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
