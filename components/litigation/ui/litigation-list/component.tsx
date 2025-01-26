"use client";
import { useAllLitigation } from "@/services/api-sdk/models/litigation/litigation";
import LitigationCard from "@/components/litigation/ui/litigation-card";
import { useSearchResults } from "@/providers/search-provider";
import { LitigationListSuspense } from "./suspense";
import { FormattedMessage } from "react-intl";

export function LitigationListComponent() {
  const { data, isError, isLoading } = useAllLitigation();
  const filteredData = useSearchResults(data ?? []);

  if (isError) {
    throw new Error("An error occurred while fetching the data");
  }

  if (isLoading) {
    return <LitigationListSuspense />;
  }

  if (!data || data.length === 0) {
    return (
      <p className="text-center text-lg italic text-foreground/75">
        <FormattedMessage id="litigation.litigation.list.noItemsFound" />
      </p>
    );
  }

  if (filteredData.length === 0) {
    return (
      <p className="text-center text-lg italic text-foreground/75">
        <FormattedMessage id="litigation.litigation.list.noSearchResults" />
      </p>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-10 md:gap-20">
      {filteredData.map(
        ({
          id,
          title,
          caseNumber,
          reference,
          nature,
          jurisdiction,
          isArchived,
        }) => (
          <LitigationCard
            key={id}
            litigationId={id}
            title={title}
            caseNumber={caseNumber}
            reference={reference}
            nature={nature.title}
            jurisdiction={jurisdiction.title}
            isArchived={isArchived}
            className="w-72 sm:w-80"
          />
        )
      )}
    </div>
  );
}
