"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MoveRight, Search } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllRecoveries } from "@/lib/recovery/hooks";
import type { Recovery } from "@/lib/recovery/recoveries";
import { useDictionary } from "@/lib/i18n/locale-provider";

function RecoveryCard({ recovery }: { recovery: Recovery }) {
  const { t } = useDictionary();
  const tc = t.recovery.card;

  return (
    <Card className="w-72 sm:w-96">
      <CardHeader>
        <CardTitle className="line-clamp-2">{recovery.title}</CardTitle>
        <CardDescription>
          <span className="font-bold">{tc.reference}</span> <span className="italic">{recovery.reference}</span>
        </CardDescription>
        {recovery.guaranteeId && (
          <CardDescription>
            <Button
              variant="link"
              className="gap-1 px-0 italic"
              render={<Link href={`/dashboard/safety/mortgage/${recovery.guaranteeId}`} />}
            >
              {tc.viewGuarantee}
            </Button>
          </CardDescription>
        )}
        {recovery.contractId && (
          <CardDescription>
            <Button
              variant="link"
              className="gap-1 px-0 italic"
              render={<Link href={`/dashboard/contract/${recovery.contractId}`} />}
            >
              {tc.viewContract}
            </Button>
          </CardDescription>
        )}
        <div className="flex items-center justify-between gap-2">
          <Badge className="line-clamp-1 w-fit bg-muted text-muted-foreground hover:bg-muted/90">
            {recovery.type.startsWith("friendly") ? t.recovery.kind.friendly : t.recovery.kind.forced}
          </Badge>
          <Button
            variant="link"
            className="gap-2 px-0 italic"
            render={<Link href={`/dashboard/recovery/${recovery.id}`} />}
          >
            {tc.viewDetails} <MoveRight />
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}

export function RecoveriesList() {
  const { data, isLoading, isError } = useAllRecoveries();
  const { t } = useDictionary();
  const tl = t.recovery.list;
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!data || !query) return data ?? [];
    return data.filter(
      (recovery) => recovery.title.toLowerCase().includes(query) || recovery.reference?.toLowerCase().includes(query),
    );
  }, [data, search]);

  if (isError) return <p className="text-center text-lg italic text-destructive">{t.common.loadError}</p>;

  if (isLoading) {
    return (
      <div className="flex flex-wrap justify-center gap-10 md:gap-20">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-44 w-72 sm:w-96" />
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

      {!data || data.length === 0 ? (
        <p className="text-center text-lg italic text-foreground/75">{tl.noItems}</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-lg italic text-foreground/75">{tl.noMatching}</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-10 md:gap-20">
          {filtered.map((recovery) => (
            <RecoveryCard key={recovery.id} recovery={recovery} />
          ))}
        </div>
      )}
    </div>
  );
}
