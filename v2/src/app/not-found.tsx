import Link from "next/link";
import { Component } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/i18n/locale";

export default async function NotFound() {
  const { t } = await getDictionary();

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-5">
      <div className="h-1/3 w-1/3 bg-[url('/global/images/not-found.svg')] bg-contain bg-center bg-no-repeat" />
      <h1 className="text-center text-3xl font-bold sm:text-4xl">{t.pages.notFoundTitle}</h1>
      <Button className="gap-2" nativeButton={false} render={<Link href="/dashboard/modules" />}>
        <Component size={24} />
        {t.pages.backToModules}
      </Button>
    </main>
  );
}
