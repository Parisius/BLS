"use client";
import { CheckCheck, Files, Forward, GanttChart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOneContract } from "@/services/api-sdk/models/contract/contract";
import { notFound } from "next/navigation";
import { ContractDetailsPageBreadcrumb } from "@/components/contract/breadcrumbs";
import ContractEventsTimelineModal from "@/components/contract/modals/contract-events-timeline-modal";
import { ContractDetailsTable } from "@/components/contract/tables/contract-details-table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import StakeholdersModal from "@/components/contract/modals/stakeholders-modal";
import ContractFilesModal from "@/components/contract/modals/contract-files-modal";
import ForwardContractDialog from "@/components/contract/modals/forward-contract-dialog";
import { useCurrentUser } from "@/services/api-sdk/models/user/user";
import CompleteContractDialog from "@/components/contract/modals/complete-contract-dialog";
import ContractDetailsPageLoading from "./loading";
import { useIntl } from "react-intl";

const canForward = ({ forwards, createdBy }, currentUser) => {
  if (forwards && forwards.length > 0) {
    return forwards[0].completed && forwards[0].receiver.id === currentUser?.id;
  }
  return createdBy === currentUser?.id;
};

const canComplete = ({ forwards }, currentUser) =>
  forwards &&
  forwards.length > 0 &&
  !forwards[0].completed &&
  forwards[0].receiver.id === currentUser?.id;

export default function ContractDetailsPage({ params: { id } }) {
  const { data: currentUser } = useCurrentUser();
  const { data, isLoading, isError } = useOneContract(id);
  const intl = useIntl();

  if (isError) {
    throw new Error("An error occurred while fetching the data");
  }

  if (isLoading) {
    return <ContractDetailsPageLoading />;
  }

  if (!data) {
    notFound();
  }

  return (
    <div className="container flex flex-1 flex-col gap-10 overflow-y-auto py-5">
      <ContractDetailsPageBreadcrumb contractTitle={data.title} />
      <h1 className="text-center text-2xl font-bold sm:text-3xl md:text-4xl">
        {data.title}
      </h1>
      <div className="flex flex-row items-center justify-between gap-2">
        <ContractEventsTimelineModal
          asChild
          contractId={data.id}
          contractTitle={data.title}
          contractSignatureDate={data.signatureDate}
          contractEffectiveDate={data.effectiveDate}
          contractExpirationDate={data.expirationDate}
          contractRenewalDate={data.renewalDate}
        >
          <Button
            aria-label={intl.formatMessage({
              id: "contract.contract.detailsPage.schedule",
            })}
            className="gap-2"
          >
            <GanttChart />
            {intl.formatMessage({
              id: "contract.contract.detailsPage.schedule",
            })}
          </Button>
        </ContractEventsTimelineModal>

        <div className="flex items-center gap-2">
          {canForward(
            { forwards: data.forwards, createdBy: data.createdBy },
            currentUser
          ) && (
            <ForwardContractDialog asChild contractId={id}>
              <Button variant="secondary" className="gap-2">
                <Forward />
                <span className="sr-only sm:not-sr-only">
                  {intl.formatMessage({
                    id: "contract.contract.detailsPage.transfer",
                  })}
                </span>
              </Button>
            </ForwardContractDialog>
          )}

          {canComplete({ forwards: data.forwards }, currentUser) && (
            <CompleteContractDialog
              asChild
              contractId={id}
              transferId={data.forwards[0].id}
            >
              <Button variant="secondary" className="gap-2">
                <CheckCheck />
                <span className="sr-only sm:not-sr-only">
                  {data.forwards?.[0].title ??
                    intl.formatMessage({
                      id: "contract.contract.detailsPage.updateStatus",
                    })}
                </span>
              </Button>
            </CompleteContractDialog>
          )}

          <ContractFilesModal
            asChild
            contractFilesGroups={data.filesGroups ?? []}
            contractTitle={data.title}
          >
            <Button className="gap-2">
              <Files />
              <span className="sr-only sm:not-sr-only">
                {intl.formatMessage({
                  id: "contract.contract.detailsPage.documents",
                })}
              </span>
            </Button>
          </ContractFilesModal>

          <Tooltip>
            <StakeholdersModal
              asChild
              contractId={id}
              contractTitle={data.title}
              firstStakeholdersGroup={data.firstStakeholdersGroup}
              secondStakeholdersGroup={data.secondStakeholdersGroup}
            >
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={intl.formatMessage({
                    id: "contract.contract.detailsPage.stakeholders",
                  })}
                  className="gap-2 rounded-full"
                >
                  <Users size={30} />
                </Button>
              </TooltipTrigger>
            </StakeholdersModal>
            <TooltipContent>
              {intl.formatMessage({
                id: "contract.contract.detailsPage.stakeholders",
              })}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <ContractDetailsTable
        id={id}
        title={data.title}
        category={data.category.label}
        categoryType={data.categoryType?.label}
        categorySubType={data.categorySubType?.label}
        signatureDate={data.signatureDate}
        effectiveDate={data.effectiveDate}
        expirationDate={data.expirationDate}
        renewalDate={data.renewalDate}
        forwards={data.forwards}
      />
    </div>
  );
}
