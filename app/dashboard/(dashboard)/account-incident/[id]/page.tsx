"use client";
import { EllipsisVertical, Files, GanttChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { notFound } from "next/navigation";
import { useOneAccountIncident } from "@/services/api-sdk/models/account-incident";
import { AccountIncidentsDetailsPageBreadcrumb } from "@/components/account-incident/breadcrumbs";
import { AccountIncidentDetailsTable } from "@/components/account-incident/tables/account-incident-details-table";
import IncidentTasksTimelineModal from "@/components/account-incident/modals/incident-tasks-timeline-modal";
import AccountIncidentFilesModal from "@/components/account-incident/modals/account-incident-files-modal";
import AccountIncidentDetailsPageLoading from "./loading";
import { useIntl } from "react-intl";

export default function AccountIncidentDetailsPage({ params: { id } }) {
  const { data, isLoading, isError } = useOneAccountIncident(id);
  const intl = useIntl();

  if (isError) {
    throw new Error("An error occurred while fetching the data");
  }
  if (isLoading) {
    return <AccountIncidentDetailsPageLoading />;
  }
  if (!data) {
    notFound();
  }
  return (
    <div className="container flex flex-1 flex-col gap-10 overflow-y-auto py-5">
      <AccountIncidentsDetailsPageBreadcrumb incidentTitle={data.title} />
      <h1 className="text-center text-2xl font-bold sm:text-3xl md:text-4xl">
        {data.title}
      </h1>
      <div className="flex flex-row items-center justify-between gap-2">
        <IncidentTasksTimelineModal
          asChild
          incidentId={id}
          incidentCompleted={data.completed}
          incidentTitle={data.title}
          currentTaskId={data.currentTask?.id}
        >
          <Button
            aria-label={intl.formatMessage({ id: "incident.button.schedule" })}
            className="gap-2"
          >
            <GanttChart />
            {intl.formatMessage({ id: "incident.button.schedule" })}
          </Button>
        </IncidentTasksTimelineModal>

        <DropdownMenu>
          <Tooltip>
            <DropdownMenuTrigger asChild className="cursor-pointer sm:hidden">
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={intl.formatMessage({
                    id: "incident.button.menu",
                  })}
                  className="gap-2 rounded-full"
                >
                  <EllipsisVertical size={30} />
                </Button>
              </TooltipTrigger>
            </DropdownMenuTrigger>
            <TooltipContent>
              {intl.formatMessage({ id: "incident.button.menu" })}
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent>
            <AccountIncidentFilesModal
              asChild
              incidentId={id}
              incidentTitle={data.title}
            >
              <DropdownMenuItem
                className="cursor-pointer gap-2 sm:hidden"
                onSelect={(e) => e.preventDefault()}
              >
                <Files />
                {intl.formatMessage({ id: "incident.button.archives" })}
              </DropdownMenuItem>
            </AccountIncidentFilesModal>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="hidden items-center justify-between gap-2 sm:flex">
          <Tooltip>
            <AccountIncidentFilesModal
              asChild
              incidentId={id}
              incidentTitle={data.title}
            >
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={intl.formatMessage({
                    id: "incident.button.archives",
                  })}
                  className="gap-2 rounded-full"
                >
                  <Files size={30} />
                </Button>
              </TooltipTrigger>
            </AccountIncidentFilesModal>
            <TooltipContent>
              {intl.formatMessage({ id: "incident.tooltip.archives" })}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <AccountIncidentDetailsTable
        incidentId={id}
        title={data.title}
        reference={data.reference}
        dateReceived={data.dateReceived}
        isClient={data.isClient}
        isCompleted={data.completed}
        category={data.category.label}
        author={data.author}
        currentTask={data.currentTask}
      />
    </div>
  );
}
