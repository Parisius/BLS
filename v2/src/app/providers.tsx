"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LocaleProvider } from "@/lib/i18n/locale-provider";
import { TenantProvider } from "@/lib/tenant-provider";
import type { Locale } from "@/lib/i18n/dictionary";

export function Providers({
  locale,
  tenant,
  children,
}: {
  locale: Locale;
  tenant: { name: string | null; currency: string | null };
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <LocaleProvider locale={locale}>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <TenantProvider settings={tenant}>
            <TooltipProvider>{children}</TooltipProvider>
          </TenantProvider>
          <Toaster />
        </QueryClientProvider>
      </SessionProvider>
    </LocaleProvider>
  );
}
