"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllJudicialItems, useAllLegislativeItems } from "@/lib/legal-monitoring/hooks";
import type { LegalItem } from "@/lib/legal-monitoring/items";
import { formatDisplayDate } from "@/lib/shared/date-utils";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/lib/i18n/locale-provider";

function StatusBadge({ isArchived }: { isArchived: boolean }) {
  const { t } = useDictionary();
  return (
    <Badge className={cn(isArchived ? "bg-muted text-muted-foreground" : "bg-primary")}>
      {isArchived ? t.legalMonitoring.status.archived : t.legalMonitoring.status.sentByMail}
    </Badge>
  );
}

function ItemsGrid({
  items,
  isLoading,
  isError,
  searchFields,
  renderCard,
}: {
  items?: LegalItem[];
  isLoading: boolean;
  isError: boolean;
  searchFields: (item: LegalItem) => (string | undefined)[];
  renderCard: (item: LegalItem) => React.ReactNode;
}) {
  const { t } = useDictionary();
  const tl = t.legalMonitoring.list;
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!items || !query) return items ?? [];
    return items.filter((item) => searchFields(item).some((value) => value?.toLowerCase().includes(query)));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- searchFields is a stable module-level function per list
  }, [items, search]);

  if (isError) return <p className="text-center text-lg italic text-destructive">{t.common.loadError}</p>;

  if (isLoading) {
    return (
      <div className="flex flex-wrap justify-center gap-10 md:gap-20">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-44 w-72 sm:w-80" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="relative mx-auto w-full max-w-md">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={tl.search} className="pl-10" />
        <Search className="pointer-events-none absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
      </div>
      {!items || items.length === 0 ? (
        <p className="text-center text-lg italic text-foreground/75">{tl.noItems}</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-lg italic text-foreground/75">{tl.noResults}</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-10 md:gap-20">{filtered.map(renderCard)}</div>
      )}
    </div>
  );
}

const judicialSearch = (item: LegalItem) => [item.title, item.reference, item.jurisdiction?.title, item.jurisdictionLocation];
const legislativeSearch = (item: LegalItem) => [item.title, item.reference, item.caseNumber, item.nature?.title];

export function JudicialItemsList() {
  const { data, isLoading, isError } = useAllJudicialItems();
  const { t } = useDictionary();
  const tl = t.legalMonitoring.judicialList;

  return (
    <ItemsGrid
      items={data}
      isLoading={isLoading}
      isError={isError}
      searchFields={judicialSearch}
      renderCard={(item) => (
        <Link key={item.id} href={`/dashboard/legal-monitoring/judicial/${item.id}`}>
          <Card className="w-72 sm:w-80">
            <CardHeader className="gap-3">
              <CardTitle className="line-clamp-2">{item.title}</CardTitle>
              <CardDescription>
                <span className="font-bold">{tl.eventDate}</span>{" "}
                <span className="italic">{item.eventDate ? formatDisplayDate(item.eventDate) : "-"}</span>
              </CardDescription>
              <CardDescription>
                <span className="font-bold">{tl.jurisdiction}</span>{" "}
                <span className="italic">{item.jurisdiction?.title ?? "-"}</span>
              </CardDescription>
              <CardDescription>
                <StatusBadge isArchived={item.isArchived} />
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      )}
    />
  );
}

export function LegislativeItemsList() {
  const { data, isLoading, isError } = useAllLegislativeItems();
  const { t } = useDictionary();
  const tl = t.legalMonitoring.legislativeList;

  return (
    <ItemsGrid
      items={data}
      isLoading={isLoading}
      isError={isError}
      searchFields={legislativeSearch}
      renderCard={(item) => (
        <Link key={item.id} href={`/dashboard/legal-monitoring/legislative/${item.id}`}>
          <Card className="w-72 sm:w-80">
            <CardHeader className="gap-3">
              <div className="flex items-center gap-2">
                <CardTitle className="line-clamp-2 flex-1">{item.title}</CardTitle>
                <Badge className="bg-muted text-muted-foreground hover:bg-muted/90">
                  {item.type === "regulation" ? tl.regulation : tl.legislation}
                </Badge>
              </div>
              <CardDescription>
                <span className="font-bold">{tl.ref}</span> <span className="italic">{item.reference}</span>
              </CardDescription>
              <CardDescription>
                <span className="font-bold">{tl.effectiveDate}</span>{" "}
                <span className="italic">{item.effectiveDate ? formatDisplayDate(item.effectiveDate) : "-"}</span>
              </CardDescription>
              <CardDescription>
                <span className="font-bold">{tl.nature}</span> <span className="italic">{item.nature?.title ?? "-"}</span>
              </CardDescription>
              <CardDescription>
                <StatusBadge isArchived={item.isArchived} />
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      )}
    />
  );
}

export { StatusBadge };
