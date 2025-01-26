"use client";
import { Banknote, Files, GanttChart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { useOneLitigation } from "@/services/api-sdk/models/litigation/litigation";
import { LitigationDetailsPageBreadcrumb } from "@/components/litigation/breadcrumbs";
import LitigationFilesModal from "@/components/litigation/modals/litigation-files-modal";
import { LitigationDetailsTable } from "@/components/litigation/tables/litigation-details-table";
import AddLitigationProvisionsDialog from "@/components/litigation/modals/add-litigation-provisions-dialog";
import ArchiveLitigationButton from "@/components/litigation/buttons/archive-litigation-button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PartiesModal from "@/components/litigation/modals/parties-modal";
import {
  partyCategories,
  partyTypes,
} from "@/services/api-sdk/types/litigation/litigation";
import LitigationTasksTimelineModal from "@/components/litigation/modals/litigation-tasks-timeline-modal";
import LitigationDetailsPageLoading from "./loading";
import { FormattedMessage } from "react-intl";

export default function Page({ params: { id } }) {
  const { data, isLoading, isError } = useOneLitigation(id);

  if (isError) {
    throw new Error("An error occurred while fetching the data");
  }

  if (isLoading) {
    return <LitigationDetailsPageLoading />;
  }

  if (!data) {
    notFound();
  }

  return (
    <div className="container flex flex-1 flex-col gap-10 overflow-y-auto py-5">
      <LitigationDetailsPageBreadcrumb litigationTitle={data.title} />
      <h1 className="text-center text-2xl font-bold sm:text-3xl md:text-4xl">
        {data.title}
      </h1>
      <div className="flex flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <LitigationTasksTimelineModal
            asChild
            litigationId={id}
            litigationTitle={data.title}
            nextStepId={data.nextStep?.id}
          >
            <Button
              aria-label="Planification de l'hypothèque"
              className="gap-2"
            >
              <GanttChart />
              <FormattedMessage id="litigation.litigation.details.schedule" />{" "}
            </Button>
          </LitigationTasksTimelineModal>

          {data.hasProvisions && (
            <AddLitigationProvisionsDialog
              asChild
              litigationId={id}
              estimatedAmount={data.estimatedAmount}
              addedAmountTotal={data.addedAmount}
              remainingAmount={data.remainingAmount}
            >
              <Button className="gap-2">
                <Banknote />
                <span className="sr-only sm:not-sr-only">
                  <FormattedMessage id="litigation.litigation.details.updateProvisions" />{" "}
                </span>
              </Button>
            </AddLitigationProvisionsDialog>
          )}
        </div>

        <div className="flex items-center gap-2">
          {data.isArchived || <ArchiveLitigationButton litigationId={id} />}
          <LitigationFilesModal
            asChild
            litigationFiles={data.files ?? []}
            litigationTitle={data.title}
          >
            <Button className="gap-2">
              <Files />
              <span className="sr-only sm:not-sr-only">
                <FormattedMessage id="litigation.litigation.details.documents" />{" "}
              </span>
            </Button>
          </LitigationFilesModal>
          <Tooltip>
            <PartiesModal
              asChild
              litigationId={id}
              litigationTitle={data.title}
              partiesGroup={data.parties.map((party) => ({
                id: party.id,
                name: party.name,
                category:
                  partyCategories.find(
                    (category) => category.value === party.category
                  )?.label ?? party.category,
                type:
                  partyTypes.find((type) => type.value === party.type)?.label ??
                  party.type,
              }))}
            >
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Parties prenantes"
                  className="gap-2 rounded-full"
                >
                  <Users size={30} />
                </Button>
              </TooltipTrigger>
            </PartiesModal>
            <TooltipContent>
              <FormattedMessage id="litigation.litigation.details.parties" />{" "}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <LitigationDetailsTable
        litigationId={data.id}
        caseNumber={data.caseNumber}
        reference={data.reference}
        estimatedAmount={data.estimatedAmount}
        addedAmount={data.addedAmount}
        remainingAmount={data.remainingAmount}
        nature={data.nature.title}
        jurisdiction={data.jurisdiction.title}
        jurisdictionLocation={data.jurisdictionLocation}
        hasProvisions={data.hasProvisions}
        isArchived={data.isArchived}
      />
    </div>
  );
}
