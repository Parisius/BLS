"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MoveRight, Search } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllIncidents } from "@/lib/account-incident/hooks";
import type { Incident } from "@/lib/account-incident/incidents";
import { formatDisplayDate } from "@/lib/shared/date-utils";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/lib/i18n/locale-provider";

function IncidentCard({ incident }: { incident: Incident }) {
  const { t } = useDictionary();
  const tc = t.accountIncident.card;

  return (
    <Card className="w-72 sm:w-96">
      <CardHeader className="gap-3">
        <div className="flex items-center gap-2">
          <CardTitle className="line-clamp-2">{incident.title}</CardTitle>
          <Badge className="line-clamp-1 bg-muted text-muted-foreground hover:bg-muted/90">
            {incident.category.label}
          </Badge>
        </div>
        <CardDescription>
          <span className="font-bold">{tc.reference}:</span> <span className="italic">{incident.reference}</span>
        </CardDescription>
        <CardDescription>
          <span className="font-bold">{tc.personConcerned}:</span>{" "}
          <span className="italic">{incident.author.name}</span>
        </CardDescription>
        <CardDescription>
          <span className="font-bold">{tc.receivedDate}:</span>{" "}
          <span className="italic">{formatDisplayDate(incident.dateReceived)}</span>
        </CardDescription>
        <div className="flex items-center justify-between gap-2">
          <Badge className={cn({ "bg-primary": !incident.completed, "bg-muted text-muted-foreground": incident.completed })}>
            {incident.completed ? tc.resolved : tc.inProgress}
          </Badge>
          <Button
            variant="link"
            className="gap-2 px-0 italic"
            render={<Link href={`/dashboard/account-incident/${incident.id}`} />}
          >
            {tc.viewDetails} <MoveRight />
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}

export function IncidentsList() {
  const { data, isLoading, isError } = useAllIncidents();
  const { t } = useDictionary();
  const tl = t.accountIncident.list;
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!data || !query) return data ?? [];
    return data.filter(
      (incident) =>
        incident.title.toLowerCase().includes(query) ||
        incident.reference?.toLowerCase().includes(query) ||
        incident.author.name.toLowerCase().includes(query),
    );
  }, [data, search]);

  if (isError) return <p className="text-center text-lg italic text-destructive">{t.common.loadError}</p>;

  if (isLoading) {
    return (
      <div className="flex flex-wrap justify-center gap-10 md:gap-20">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-56 w-72 sm:w-96" />
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
          {filtered.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
        </div>
      )}
    </div>
  );
}
