"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { formatAmount } from "@/lib/shared/format";

interface TenantSettings {
  name: string | null;
  currency: string | null;
}

const TenantContext = createContext<TenantSettings>({ name: null, currency: null });

export function TenantProvider({ settings, children }: { settings: TenantSettings; children: React.ReactNode }) {
  const value = useMemo(() => settings, [settings.name, settings.currency]); // eslint-disable-line react-hooks/exhaustive-deps
  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export const useTenantSettings = () => useContext(TenantContext);

/** Money in the tenant's currency. */
export function useFormatAmount() {
  const { currency } = useTenantSettings();
  return useCallback((amount: number) => formatAmount(amount, currency ?? undefined), [currency]);
}
