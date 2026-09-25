import Link from "next/link";
import { notFound } from "next/navigation";
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
import { AddBankItemDialog } from "@/components/texts-bank/bank-item-dialogs";
import { BankItemsList } from "@/components/texts-bank/bank-items-list";
import { BANK_KINDS, KIND_KEY, isBankKind } from "@/lib/texts-bank/kinds";
import { getDictionary } from "@/lib/i18n/locale";

export default async function BankKindPage({ params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  if (!isBankKind(kind)) notFound();
  const { t } = await getDictionary();
  const tb = t.textsBank;
  const tk = tb.kinds[KIND_KEY[kind]];
  // The list page offers a shortcut to the "next" kind, like the original did.
  const other = BANK_KINDS[(BANK_KINDS.indexOf(kind) + 1) % BANK_KINDS.length];
  const OtherIcon = other === "links" ? LinkIcon : Newspaper;

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
              <BreadcrumbLink render={<Link href="/dashboard/texts-bank" />}>{tb.breadcrumb.textsBank}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{tb.breadcrumb[KIND_KEY[kind]]}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center justify-end gap-2">
          <AddBankItemDialog kind={kind} />
          <Button className="gap-2" render={<Link href={`/dashboard/texts-bank/${other}`} />}>
            <OtherIcon />
            <span className="sr-only sm:not-sr-only">{tb.kinds[KIND_KEY[other]].home}</span>
          </Button>
        </div>
      </div>
      <h1 className="relative text-center text-2xl font-bold sm:text-3xl md:text-4xl">{tk.pageTitle}</h1>
      <BankItemsList kind={kind} />
    </div>
  );
}
