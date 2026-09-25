"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AddRecoveryDialog } from "@/components/recovery/add-recovery-dialog";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function CreateRecoveryCard() {
  const { t } = useDictionary();
  const th = t.recovery.hub;

  return (
    <Card className="max-w-96 self-center sm:min-w-96 sm:max-w-[50%]">
      <CardHeader>
        <CardTitle>{th.cardTitle}</CardTitle>
        <CardDescription>{th.cardDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Image src="/recovery/images/create-recovery.svg" alt="" width={200} height={200} />
      </CardContent>
      <CardFooter className="justify-center">
        <AddRecoveryDialog />
      </CardFooter>
    </Card>
  );
}
