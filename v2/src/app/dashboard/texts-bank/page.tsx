import Link from "next/link";
import { Component, Link as LinkIcon, Newspaper } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { CreateBankCards } from "@/components/texts-bank/create-bank-cards";
import { getDictionary } from "@/lib/i18n/locale";

const NAV = [
  ["links", LinkIcon],
  ["texts", Newspaper],
  ["other-documents", Newspaper],
] as const;
const KEYS = { texts: "texts", links: "links", "other-documents": "otherDocuments" } as const;

export default async function TextsBankPage() {
  const { t } = await getDictionary();
  const tb = t.textsBank;

  return (
    <div className="container flex flex-1 flex-col gap-10 overflow-y-auto py-5">
      <div className="flex flex-col gap-10 sm:flex-row sm:items-center sm:justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/dashboard/modules" />}>
                <Component />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{tb.breadcrumb.textsBank}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center justify-end gap-2">
          {NAV.map(([kind, Icon]) => (
            <Button key={kind} className="gap-2" render={<Link href={`/dashboard/texts-bank/${kind}`} />}>
              <Icon />
              <span className="sr-only sm:not-sr-only">{tb.kinds[KEYS[kind]].home}</span>
            </Button>
          ))}
        </div>
      </div>
      <CreateBankCards />
    </div>
  );
}
