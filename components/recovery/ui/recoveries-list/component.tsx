"use client";
import { useAllRecoveries } from "@/services/api-sdk/models/recovery";
import MortgageCard from "@/components/recovery/ui/recovery-card";
import { useSearchResults } from "@/providers/search-provider";
import { RecoveriesListSuspense } from "./suspense";
import { useIntl } from "react-intl";

export function RecoveriesListComponent() {
  const intl = useIntl();
  const { data, isError, isLoading } = useAllRecoveries();
  const filteredData = useSearchResults(data ?? []);

  if (isError) {
    throw new Error(intl.formatMessage({ id: "recovery.fetchError" }));
  }

  if (isLoading) {
    return <RecoveriesListSuspense />;
  }

  if (!data || data.length === 0) {
    return (
      <p className="text-center text-lg italic text-foreground/75">
        {intl.formatMessage({ id: "recovery.noItemsFound" })}
      </p>
    );
  }

  if (filteredData.length === 0) {
    return (
      <p className="text-center text-lg italic text-foreground/75">
        {intl.formatMessage({ id: "recovery.noMatchingItems" })}
      </p>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-10 md:gap-20">
      {filteredData.map(({ id, title, reference, type, guaranteeId }) => (
        <MortgageCard
          key={id}
          recoveryId={id}
          reference={reference}
          type={type}
          title={title}
          guaranteeId={guaranteeId}
        />
      ))}
    </div>
  );
}
