"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AddSafetyDialog } from "@/components/safety/add-safety-dialog";
import { KIND_KEY, type SafetyKind } from "@/lib/safety/kinds";
import { useDictionary } from "@/lib/i18n/locale-provider";
import { Can } from "@/components/auth/can";

export function CreateSafetyCard({ kind }: { kind: SafetyKind }) {
  const { t } = useDictionary();
  const tk = t.safety.kinds[KIND_KEY[kind]];

  return (
    <Can permission="guarantee.create">
      <Card className="max-w-96 self-center sm:min-w-96 sm:max-w-[50%]">
        <CardHeader>
          <CardTitle>{tk.cardTitle}</CardTitle>
          <CardDescription>{tk.cardDescription}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Image src="/safety/images/create-safety.svg" alt="" width={200} height={200} />
        </CardContent>
        <CardFooter className="justify-center">
          <AddSafetyDialog kind={kind} />
        </CardFooter>
      </Card>
    </Can>
  );
}
