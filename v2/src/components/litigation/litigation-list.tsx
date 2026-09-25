"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MoveRight, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllLitigation } from "@/lib/litigation/hooks";
import type { Litigation } from "@/lib/litigation/litigations";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function LitigationCard({ litigation, className }: { litigation: Litigation; className?: string }) {
  const { t } = useDictionary();
  const tc = t.litigation.card;

  return (
    <Card className={cn("w-72 sm:w-80", className)}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="line-clamp-2 flex-1">{litigation.title}</CardTitle>
          {litigation.isArchived && (
            <Badge className="line-clamp-1 w-fit bg-muted text-muted-foreground hover:bg-muted/90">{tc.archived}</Badge>
          )}
        </div>
        {(
          [
            [tc.caseNumber, litigation.caseNumber],
            [tc.reference, litigation.reference],
            [tc.nature, litigation.nature.title],
            [tc.jurisdiction, litigation.jurisdiction.title],
          ] as const
        ).map(([label, value]) => (
          <CardDescription key={label}>
            <span className="font-bold">{label}</span> <span className="italic">{value}</span>
          </CardDescription>
        ))}
        <div className="flex justify-end gap-2">
          <Button variant="link" className="gap-2 px-0 italic" render={<Link href={`/dashboard/litigation/${litigation.id}`} />}>
            {tc.viewDetails} <MoveRight />
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}

export function LitigationList() {
  const { data, isLoading, isError } = useAllLitigation();
  const { t } = useDictionary();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!data || !query) return data ?? [];
    return data.filter((item) =>
      [item.title, item.caseNumber, item.reference, item.nature.title, item.jurisdiction.title].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [data, search]);

  if (isError) return <p className="text-center text-lg italic text-destructive">{t.common.loadError}</p>;

  if (isLoading) {
    return (
      <div className="flex flex-wrap justify-center gap-10 md:gap-20">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-56 w-72 sm:w-80" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="relative mx-auto w-full max-w-md">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.litigation.list.search} className="pl-10" />
        <Search className="pointer-events-none absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
      </div>
      {!data || data.length === 0 ? (
        <p className="text-center text-lg italic text-foreground/75">{t.litigation.list.noItemsFound}</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-lg italic text-foreground/75">{t.litigation.list.noSearchResults}</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-10 md:gap-20">
          {filtered.map((item) => (
            <LitigationCard key={item.id} litigation={item} />
          ))}
        </div>
      )}
    </div>
  );
}
