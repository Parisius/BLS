"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AddLitigationDialog } from "@/components/litigation/litigation-dialogs";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function CreateLitigationCard() {
  const { t } = useDictionary();
  const tc = t.litigation.createLitigationCard;

  return (
    <Card className="max-w-96 self-center sm:min-w-96 sm:max-w-[50%]">
      <CardHeader>
        <CardTitle>{tc.title}</CardTitle>
        <CardDescription>{tc.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Image src="/litigation/images/create-litigation.svg" alt="" width={200} height={200} />
      </CardContent>
      <CardFooter className="justify-center">
        <AddLitigationDialog variant="card" />
      </CardFooter>
    </Card>
  );
}
