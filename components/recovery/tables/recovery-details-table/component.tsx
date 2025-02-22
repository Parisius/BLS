"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ContractRoutes, MortgageRoutes } from "@/config/routes";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Printer } from "lucide-react";
import PrintRecoveryButton from "@/components/recovery/buttons/print-recovery-button";
import { useIntl } from "react-intl";

export function RecoveryDetailsTable({
  recoveryId,
  title,
  reference,
  type,
  guaranteeId,
  contractId,
  currentStep,
  nextStep,
  isArchived,
}) {
  const intl = useIntl();

  return (
    <Table className="border">
      <TableHeader>
        <TableRow>
          <TableHead>
            {intl.formatMessage({ id: "recovery.table.title" })}
          </TableHead>
          <TableHead>
            {intl.formatMessage({ id: "recovery.table.reference" })}
          </TableHead>
          {guaranteeId && (
            <TableHead>
              {intl.formatMessage({ id: "recovery.table.guarantee" })}
            </TableHead>
          )}
          {contractId && (
            <TableHead>
              {intl.formatMessage({ id: "recovery.table.contract" })}
            </TableHead>
          )}
          <TableHead>
            {intl.formatMessage({ id: "recovery.table.currentStep" })}
          </TableHead>
          <TableHead className={cn(nextStep && "text-destructive")}>
            {intl.formatMessage({ id: "recovery.table.nextStep" })}
          </TableHead>
          <TableHead>
            {intl.formatMessage({ id: "recovery.table.type" })}
          </TableHead>
          <TableHead>
            {intl.formatMessage({ id: "recovery.table.status" })}
          </TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="bg-card">
          <TableCell>{title}</TableCell>
          <TableCell>{reference}</TableCell>
          {guaranteeId && (
            <TableCell>
              <Button asChild variant="link" className="gap-1 px-0 italic">
                <Link href={MortgageRoutes.mortgagePage(guaranteeId).index}>
                  $ {intl.formatMessage({ id: "recovery.table.viewGuarantee" })}
                </Link>
              </Button>
            </TableCell>
          )}
          {contractId && (
            <TableCell>
              <Button asChild variant="link" className="gap-1 px-0 italic">
                <Link href={ContractRoutes.contractPage(contractId).index}>
                  {/* Utilisez useIntl pour formater le texte du bouton */}
                  {intl.formatMessage({ id: "recovery.table.viewContract" })}
                </Link>
              </Button>
            </TableCell>
          )}
          <TableCell>{currentStep?.title ?? "-"}</TableCell>
          <TableCell className={cn(nextStep && "text-destructive")}>
            {nextStep?.title ?? "-"}
          </TableCell>
          <TableCell>
            <Badge className="text-nowrap bg-muted text-muted-foreground">
              {/* Utilisez useIntl pour formater le texte du badge */}
              {type.includes("friendly")
                ? intl.formatMessage({ id: "recovery.table.friendly" })
                : intl.formatMessage({ id: "recovery.table.forced" })}
            </Badge>
          </TableCell>
          <TableCell>
            <Badge className="text-nowrap bg-muted text-muted-foreground">
              {/* Utilisez useIntl pour formater le texte du badge */}
              {isArchived
                ? intl.formatMessage({ id: "recovery.table.archived" })
                : intl.formatMessage({ id: "recovery.table.inProgress" })}
            </Badge>
          </TableCell>
          <TableCell>
            <Tooltip>
              <TooltipTrigger asChild>
                <PrintRecoveryButton
                  recoveryId={recoveryId}
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                >
                  <Printer />
                </PrintRecoveryButton>
              </TooltipTrigger>
              <TooltipContent>
                {intl.formatMessage({ id: "recovery.table.print" })}
              </TooltipContent>
            </Tooltip>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
