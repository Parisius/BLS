"use client";

import { useTransition } from "react";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setLocale } from "@/lib/i18n/actions";
import type { Locale } from "@/lib/i18n/dictionary";

const LABELS: Record<Locale, string> = { fr: "Français", en: "English" };

export function LocaleSelect({ locale }: { locale: Locale }) {
  const [isPending, startTransition] = useTransition();

  function handleSelect(next: Locale) {
    if (next === locale) return;
    startTransition(async () => {
      await setLocale(next);
      // router.refresh() doesn't reliably bust the client Router Cache for
      // the root layout in this Next.js version, so reload outright — the
      // cookie is already set server-side by this point.
      window.location.reload();
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon" disabled={isPending} />}
      >
        <Languages />
        <span className="sr-only">{LABELS[locale]}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleSelect("fr")}>
          Français
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSelect("en")}>
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
