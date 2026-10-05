"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AddIncidentDialog } from "@/components/account-incident/add-incident-dialog";
import { useDictionary } from "@/lib/i18n/locale-provider";
import { Can } from "@/components/auth/can";

export function CreateIncidentCard() {
  const { t } = useDictionary();
  const th = t.accountIncident.hub;

  return (
    <Can permission="incident.create">
      <Card className="max-w-96 self-center sm:min-w-96 sm:max-w-[50%]">
        <CardHeader>
          <CardTitle>{th.cardTitle}</CardTitle>
          <CardDescription>{th.cardDescription}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Image src="/account-incident/images/create-incident.svg" alt="" width={200} height={200} />
        </CardContent>
        <CardFooter className="justify-center">
          <AddIncidentDialog />
        </CardFooter>
      </Card>
    </Can>
  );
}
