"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AddJudicialDialog } from "@/components/legal-monitoring/judicial-form";
import { AddLegislativeDialog } from "@/components/legal-monitoring/legislative-form";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function CreateItemCards() {
  const { t } = useDictionary();
  const tj = t.legalMonitoring.judicialCard;
  const tl = t.legalMonitoring.legislativeCard;

  return (
    <div className="flex flex-col items-center gap-10 md:flex-row md:justify-center md:gap-20">
      <Card className="max-w-96">
        <CardHeader>
          <CardTitle>{tj.title}</CardTitle>
          <CardDescription>{tj.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Image src="/legal-monitoring/images/create-judicial.svg" alt="" width={200} height={200} />
        </CardContent>
        <CardFooter className="justify-center">
          <AddJudicialDialog variant="card" />
        </CardFooter>
      </Card>
      <span className="sr-only text-lg text-foreground/50 md:not-sr-only">{t.legalMonitoring.home.or}</span>
      <Card className="max-w-96">
        <CardHeader>
          <CardTitle>{tl.title}</CardTitle>
          <CardDescription>{tl.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Image src="/legal-monitoring/images/create-legislative.svg" alt="" width={200} height={200} />
        </CardContent>
        <CardFooter className="justify-center">
          <AddLegislativeDialog variant="card" />
        </CardFooter>
      </Card>
    </div>
  );
}
