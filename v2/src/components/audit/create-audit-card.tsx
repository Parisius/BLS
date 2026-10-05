"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AddAuditDialog } from "@/components/audit/add-audit-dialog";
import { useDictionary } from "@/lib/i18n/locale-provider";
import { Can } from "@/components/auth/can";

export function CreateAuditCard() {
  const { t } = useDictionary();
  const th = t.audit.home;

  return (
    <Can permission="audit.create">
      <Card className="max-w-96 self-center sm:min-w-96 sm:max-w-[50%]">
        <CardHeader>
          <CardTitle>{th.cardTitle}</CardTitle>
          <CardDescription>{th.cardDescription}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Image src="/audit/images/create-audit.svg" alt="" width={200} height={200} />
        </CardContent>
        <CardFooter className="justify-center">
          <AddAuditDialog variant="card" />
        </CardFooter>
      </Card>
    </Can>
  );
}
