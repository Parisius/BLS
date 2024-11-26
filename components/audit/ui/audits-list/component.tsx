"use client";
import { useAllAudits } from "@/services/api-sdk/models/audit/audit";
import AuditCard from "@/components/audit/ui/audit-card";
import { useSearchResults } from "@/providers/search-provider";
import { AuditsListSuspense } from "./suspense";
export function AuditsListComponent() {
  const { data, isError, isLoading } = useAllAudits();
  const filteredData = useSearchResults(data ?? []);
  if (isError) {
    throw new Error("An error occurred while fetching the data");
  }
  if (isLoading) {
    return <AuditsListSuspense />;
  }
  if (!data || data.length === 0) {
    return (
      <p className="text-center text-lg italic text-foreground/75">
        Aucun élément trouvé
      </p>
    );
  }
  if (filteredData.length === 0) {
    return (
      <p className="text-center text-lg italic text-foreground/75">
        Aucun élément ne correspond à votre recherche
      </p>
    );
  }
  return (
    <div className="flex auto-rows-fr flex-wrap justify-center gap-10 md:gap-20">
      {filteredData.map(
        ({ id, title, currentGlobalScore, currentStatus, module }) => (
          <AuditCard
            key={id}
            auditId={id}
            title={title}
            module={module}
            globalScore={currentGlobalScore}
            status={currentStatus}
          />
        )
      )}
    </div>
  );
}
