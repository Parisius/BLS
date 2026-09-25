"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AddBankItemDialog } from "@/components/texts-bank/bank-item-dialogs";
import { BANK_KINDS, KIND_KEY } from "@/lib/texts-bank/kinds";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function CreateBankCards() {
  const { t } = useDictionary();

  return (
    <div className="flex flex-wrap items-center justify-center gap-10">
      {BANK_KINDS.map((kind) => {
        const tk = t.textsBank.kinds[KIND_KEY[kind]];
        return (
          <Card key={kind} className="max-w-96">
            <CardHeader>
              <CardTitle>{tk.createTitle}</CardTitle>
              <CardDescription>{tk.createDescription}</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Image
                src={kind === "links" ? "/texts-bank/images/create-link.svg" : "/texts-bank/images/create-text.svg"}
                alt=""
                width={200}
                height={200}
              />
            </CardContent>
            <CardFooter className="justify-center">
              <AddBankItemDialog kind={kind} iconOnlyOnMobile={false} />
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
