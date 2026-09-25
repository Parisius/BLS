"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MoveRight, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllAudits } from "@/lib/audit/hooks";
import type { AuditModule } from "@/lib/audit/constants";
import { AUDIT_MODULES } from "@/lib/audit/constants";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function AuditsList() {
  const { data, isLoading, isError } = useAllAudits();
  const { t } = useDictionary();
  const tl = t.audit.list;
  const [search, setSearch] = useState("");

  const moduleLabel = (module: string) =>
    (AUDIT_MODULES as readonly string[]).includes(module) ? t.audit.modules[module as AuditModule] : module;

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!data || !query) return data ?? [];
    return data.filter((audit) =>
      [audit.title, audit.reference, audit.currentStatus].some((value) => value.toLowerCase().includes(query)),
    );
  }, [data, search]);

  if (isError) return <p className="text-center text-lg italic text-destructive">{t.common.loadError}</p>;

  if (isLoading) {
    return (
      <div className="flex flex-wrap justify-center gap-10 md:gap-20">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-40 w-72 sm:w-80" />
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
        <p className="text-center text-lg italic text-foreground/75">{tl.noResults}</p>
      ) : (
        <div className="flex auto-rows-fr flex-wrap justify-center gap-10 md:gap-20">
          {filtered.map((audit) => (
            <Card key={audit.id} className="w-72 sm:w-80">
              <CardHeader>
                <div className="flex items-start gap-2">
                  <CardTitle className="line-clamp-2 flex-1">{audit.title}</CardTitle>
                  <Badge className="bg-muted text-muted-foreground hover:bg-muted/90">{moduleLabel(audit.module)}</Badge>
                </div>
                <CardDescription>
                  <span className="font-bold">{tl.globalScore}</span>{" "}
                  <span className="italic">{audit.currentGlobalScore ?? "-"}</span>
                </CardDescription>
                <div className="flex items-center justify-between gap-2">
                  <Badge>{audit.currentStatus}</Badge>
                  <Button
                    variant="link"
                    className="gap-2 px-0 italic"
                    render={<Link href={`/dashboard/audit/${audit.id}`} />}
                  >
                    {tl.viewDetails} <MoveRight />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
