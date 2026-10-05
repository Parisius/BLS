"use client";

import { use, useState } from "react";
import Link from "next/link";
import { CheckCheck, Component, Forward } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOneContract } from "@/lib/contract/hooks";
import { useCurrentUser } from "@/lib/administration/hooks";
import { ContractDetailsTable } from "@/components/contract/contract-details-table";
import { ContractEventsTimelineModal } from "@/components/contract/contract-events-timeline-modal";
import { ForwardContractDialog } from "@/components/contract/forward-contract-dialog";
import { CompleteContractDialog } from "@/components/contract/complete-contract-dialog";
import { ContractFilesModal } from "@/components/contract/contract-files-modal";
import { StakeholdersModal } from "@/components/contract/stakeholders-modal";
import { useDictionary } from "@/lib/i18n/locale-provider";
import { Can } from "@/components/auth/can";

// Same "must be completed before forwarding again" rule as the timeline's
// event-level check — see contract-events-timeline.tsx.
function canForward(contract: { forwards: { completed: boolean; receiver: { id: string } }[]; createdBy?: string }, currentUserId?: string) {
  if (contract.forwards.length > 0) {
    const last = contract.forwards[contract.forwards.length - 1];
    return last.completed && last.receiver.id === currentUserId;
  }
  return contract.createdBy === currentUserId;
}

function canComplete(contract: { forwards: { completed: boolean; receiver: { id: string } }[] }, currentUserId?: string) {
  if (contract.forwards.length === 0) return false;
  const last = contract.forwards[contract.forwards.length - 1];
  return !last.completed && last.receiver.id === currentUserId;
}

export default function ContractDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: contractId } = use(params);
  const { data: currentUser } = useCurrentUser();
  const { data: contract, isLoading, isError } = useOneContract(contractId);
  const { t } = useDictionary();
  const tc = t.contract;

  const [forwarding, setForwarding] = useState(false);
  const [completing, setCompleting] = useState(false);

  if (isError) {
    return <p className="text-center text-destructive">{t.common.loadError}</p>;
  }

  if (isLoading || !contract) {
    return (
      <div className="container flex flex-1 flex-col gap-10 py-5">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const currentUserId = currentUser?.id;
  const lastForward = contract.forwards[contract.forwards.length - 1];

  return (
    <div className="container flex flex-1 flex-col gap-10 overflow-y-auto py-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/dashboard/modules" />}>
              <Component />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/dashboard/contract" />}>
              {tc.breadcrumb.contract}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/dashboard/contract/list" />}>
              {tc.breadcrumb.contractList}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="line-clamp-1">{contract.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-center text-2xl font-bold sm:text-3xl md:text-4xl">{contract.title}</h1>

      <div className="flex flex-row items-center justify-between gap-2">
        <ContractEventsTimelineModal contract={contract} />

        <div className="flex items-center gap-2">
          {canForward(contract, currentUserId) && (
            <Can permission="contract.forward">
              <Button variant="secondary" className="gap-2" onClick={() => setForwarding(true)}>
                <Forward />
                <span className="sr-only sm:not-sr-only">{tc.detailsPage.transfer}</span>
              </Button>
            </Can>
          )}

          {canComplete(contract, currentUserId) && (
            <Can permission="contract.update">
              <Button variant="secondary" className="gap-2" onClick={() => setCompleting(true)}>
                <CheckCheck />
                <span className="sr-only sm:not-sr-only">
                  {lastForward?.title || tc.detailsPage.updateStatus}
                </span>
              </Button>
            </Can>
          )}

          <ContractFilesModal contract={contract} />
          <StakeholdersModal contract={contract} />
        </div>
      </div>

      <ContractDetailsTable contract={contract} />

      <ForwardContractDialog
        target={{ kind: "contract", contractId: contract.id }}
        open={forwarding}
        onOpenChange={setForwarding}
      />

      {lastForward && (
        <CompleteContractDialog
          contractId={contract.id}
          transferId={lastForward.id}
          open={completing}
          onOpenChange={setCompleting}
        />
      )}
    </div>
  );
}
