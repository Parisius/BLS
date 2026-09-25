"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddContractDialog } from "@/components/contract/add-contract-dialog";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function CreateContractCard() {
  const { t } = useDictionary();

  return (
    <Card className="max-w-96 self-center sm:min-w-96 sm:max-w-[50%]">
      <CardHeader>
        <CardTitle>{t.contract.initiateContractTitle}</CardTitle>
        <CardDescription>{t.contract.initiateContractDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Image src="/contract/images/create-contract.svg" alt="" width={200} height={200} />
      </CardContent>
      <CardFooter className="justify-center">
        <AddContractDialog />
      </CardFooter>
    </Card>
  );
}
