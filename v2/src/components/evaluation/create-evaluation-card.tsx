"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AddEvaluationDialog } from "@/components/evaluation/add-evaluation-dialog";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function CreateEvaluationCard() {
  const { t } = useDictionary();
  const th = t.evaluation.home;

  return (
    <Card className="max-w-96 self-center sm:min-w-96 sm:max-w-[50%]">
      <CardHeader>
        <CardTitle>{th.cardTitle}</CardTitle>
        <CardDescription>{th.cardDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Image src="/evaluation/images/create-evaluation.svg" alt="" width={200} height={200} />
      </CardContent>
      <CardFooter className="justify-center">
        <AddEvaluationDialog variant="card" />
      </CardFooter>
    </Card>
  );
}
