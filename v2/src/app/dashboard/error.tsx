"use client";

import Image from "next/image";
import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/lib/i18n/locale-provider";

export default function DashboardError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useDictionary();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5">
      <Image src="/global/images/error.svg" alt="" width={300} height={300} />
      <p className="text-center text-lg italic text-secondary-foreground/75">{t.pages.errorMessage}</p>
      <Button className="gap-2" onClick={reset}>
        <RotateCw />
        {t.pages.retry}
      </Button>
    </div>
  );
}
