"use client";

import { createContext, useContext, useMemo } from "react";
import { dictionaries, type Dictionary, type Locale } from "./dictionary";

interface LocaleContextValue {
  locale: Locale;
  t: Dictionary;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const value = useMemo(() => ({ locale, t: dictionaries[locale] }), [locale]);
  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

/** For Client Components — Server Components should call `getDictionary()` directly. */
export function useDictionary() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useDictionary must be used within a LocaleProvider");
  }
  return context;
}
