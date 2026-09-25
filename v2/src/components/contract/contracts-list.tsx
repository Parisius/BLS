"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MoveRight, Search } from "lucide-react";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllContracts } from "@/lib/contract/hooks";
import type { Contract } from "@/lib/contract/contracts";
import { useDictionary } from "@/lib/i18n/locale-provider";

function contractCategoryLabel(contract: Contract) {
  const { category, categoryType, categorySubType } = contract;
  // Fixed vs. the original app: its version referenced `categoryType` in the
  // subtype branch even when it was falsy, which could render the literal
  // string "undefined" (e.g. "Category - undefined - SubType").
  if (categoryType && categorySubType) {
    return `${category.label} - ${categoryType.label} - ${categorySubType.label}`;
  }
  if (categoryType) return `${category.label} - ${categoryType.label}`;
  return category.label;
}

function ContractCard({ contract }: { contract: Contract }) {
  const { t } = useDictionary();
  return (
    <Card className="w-72 sm:w-80">
      <CardHeader>
        <CardTitle className="line-clamp-2">{contract.title}</CardTitle>
        <Badge className="line-clamp-1 w-fit bg-muted text-muted-foreground hover:bg-muted/90">
          {contractCategoryLabel(contract)}
        </Badge>
      </CardHeader>
      <CardFooter className="justify-end gap-2">
        <Button
          variant="link"
          className="gap-2 px-0 italic"
          render={<Link href={`/dashboard/contract/${contract.id}`} />}
        >
          {t.contract.card.viewDetails}
          <MoveRight />
        </Button>
      </CardFooter>
    </Card>
  );
}

export function ContractsList() {
  const { data, isLoading, isError } = useAllContracts();
  const { t } = useDictionary();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!data) return [];
    if (!search.trim()) return data;
    const query = search.trim().toLowerCase();
    return data.filter((contract) => contract.title.toLowerCase().includes(query));
  }, [data, search]);

  if (isError) {
    return (
      <p className="text-center text-lg italic text-destructive">{t.common.loadError}</p>
    );
  }

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
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher..."
          className="pl-10"
        />
        <Search className="pointer-events-none absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
      </div>

      {!data || data.length === 0 ? (
        <p className="text-center text-lg italic text-foreground/75">{t.contract.list.noItems}</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-lg italic text-foreground/75">
          {t.contract.list.noSearchResults}
        </p>
      ) : (
        <div className="flex flex-wrap justify-center gap-10 md:gap-20">
          {filtered.map((contract) => (
            <ContractCard key={contract.id} contract={contract} />
          ))}
        </div>
      )}
    </div>
  );
}
